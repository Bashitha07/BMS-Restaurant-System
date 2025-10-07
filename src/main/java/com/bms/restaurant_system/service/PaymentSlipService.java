package com.bms.restaurant_system.service;

import com.bms.restaurant_system.dto.PaymentSlipDTO;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.PaymentSlip;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.OrderRepository;
import com.bms.restaurant_system.repository.PaymentSlipRepository;
import com.bms.restaurant_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentSlipService {
    
    @Autowired
    private PaymentSlipRepository paymentSlipRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private final String uploadDir = "uploads/payment-slips/";
    
    // User methods
    public PaymentSlipDTO uploadPaymentSlip(Long orderId, Long userId, MultipartFile file, 
                                          BigDecimal paymentAmount, LocalDateTime paymentDate,
                                          String bankName, String transactionReference) throws IOException {
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        String contentType = file.getContentType();
        if (!isValidImageType(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only JPEG, PNG, and PDF files are allowed");
        }
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("File name cannot be null or empty");
        }
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        String filePath = uploadDir + uniqueFilename;
        
        // Save file
        Path targetPath = Paths.get(filePath);
        Files.copy(file.getInputStream(), targetPath);
        
        // Create payment slip entity
        PaymentSlip paymentSlip = new PaymentSlip(order, user, originalFilename, filePath, 
                                                paymentAmount, paymentDate);
        paymentSlip.setFileSize(file.getSize());
        paymentSlip.setContentType(contentType);
        paymentSlip.setBankName(bankName);
        paymentSlip.setTransactionReference(transactionReference);
        
        paymentSlip = paymentSlipRepository.save(paymentSlip);
        return convertToDTO(paymentSlip);
    }
    
    public List<PaymentSlipDTO> getUserPaymentSlips(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        return paymentSlipRepository.findByUserOrderByUploadedAtDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public PaymentSlipDTO getPaymentSlipById(Long id) {
        PaymentSlip paymentSlip = paymentSlipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment slip not found with id: " + id));
        return convertToDTO(paymentSlip);
    }
    
    // Admin methods
    public List<PaymentSlipDTO> getAllPaymentSlips() {
        return paymentSlipRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PaymentSlipDTO> getPendingPaymentSlips() {
        return paymentSlipRepository.findByStatusOrderByUploadedAtDesc(PaymentSlip.PaymentSlipStatus.PENDING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PaymentSlipDTO> getPaymentSlipsByStatus(PaymentSlip.PaymentSlipStatus status) {
        return paymentSlipRepository.findByStatusOrderByUploadedAtDesc(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public PaymentSlipDTO confirmPaymentSlip(Long id, String adminUsername, String notes) {
        PaymentSlip paymentSlip = paymentSlipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment slip not found with id: " + id));
        
        if (!paymentSlip.canBeConfirmed()) {
            throw new IllegalStateException("Payment slip cannot be confirmed in current status: " + paymentSlip.getStatus());
        }
        
        paymentSlip.confirm(adminUsername, notes);
        paymentSlip = paymentSlipRepository.save(paymentSlip);
        
        // Update order payment status
        Order order = paymentSlip.getOrder();
        if (order != null) {
            // You might want to update order status or add payment record here
            // order.setStatus(Order.OrderStatus.CONFIRMED);
            // orderRepository.save(order);
        }
        
        return convertToDTO(paymentSlip);
    }
    
    public PaymentSlipDTO rejectPaymentSlip(Long id, String adminUsername, String reason, String notes) {
        PaymentSlip paymentSlip = paymentSlipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment slip not found with id: " + id));
        
        if (!paymentSlip.canBeRejected()) {
            throw new IllegalStateException("Payment slip cannot be rejected in current status: " + paymentSlip.getStatus());
        }
        
        paymentSlip.reject(adminUsername, reason, notes);
        paymentSlip = paymentSlipRepository.save(paymentSlip);
        
        return convertToDTO(paymentSlip);
    }
    
    public void deletePaymentSlip(Long id) {
        PaymentSlip paymentSlip = paymentSlipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment slip not found with id: " + id));
        
        // Delete physical file
        try {
            Path filePath = Paths.get(paymentSlip.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log error but don't fail the operation
            System.err.println("Failed to delete file: " + paymentSlip.getFilePath());
        }
        
        paymentSlipRepository.delete(paymentSlip);
    }
    
    public Map<String, Object> getPaymentSlipStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalPaymentSlips", paymentSlipRepository.count());
        stats.put("pendingPaymentSlips", paymentSlipRepository.countByStatus(PaymentSlip.PaymentSlipStatus.PENDING));
        stats.put("confirmedPaymentSlips", paymentSlipRepository.countByStatus(PaymentSlip.PaymentSlipStatus.CONFIRMED));
        stats.put("rejectedPaymentSlips", paymentSlipRepository.countByStatus(PaymentSlip.PaymentSlipStatus.REJECTED));
        stats.put("processingPaymentSlips", paymentSlipRepository.countByStatus(PaymentSlip.PaymentSlipStatus.PROCESSING));
        
        return stats;
    }
    
    // Helper methods
    private boolean isValidImageType(String contentType) {
        return contentType != null && (
            contentType.equals("image/jpeg") ||
            contentType.equals("image/jpg") ||
            contentType.equals("image/png") ||
            contentType.equals("application/pdf")
        );
    }
    
    private PaymentSlipDTO convertToDTO(PaymentSlip paymentSlip) {
        return new PaymentSlipDTO(
            paymentSlip.getId(),
            paymentSlip.getOrder().getId(),
            paymentSlip.getUser().getId(),
            paymentSlip.getUser().getUsername(),
            paymentSlip.getFileName(),
            paymentSlip.getFilePath(),
            paymentSlip.getFileSize(),
            paymentSlip.getContentType(),
            paymentSlip.getPaymentAmount(),
            paymentSlip.getPaymentDate(),
            paymentSlip.getStatus().name(),
            paymentSlip.getUploadedAt(),
            paymentSlip.getConfirmedAt(),
            paymentSlip.getConfirmedBy(),
            paymentSlip.getRejectionReason(),
            paymentSlip.getAdminNotes(),
            paymentSlip.getBankName(),
            paymentSlip.getTransactionReference()
        );
    }
}