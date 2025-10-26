package com.bms.restaurant_system.service.payment;

import com.bms.restaurant_system.dto.PaymentSlipDTO;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.PaymentSlip;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.OrderRepository;
import com.bms.restaurant_system.repository.PaymentSlipRepository;
import com.bms.restaurant_system.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(PaymentSlipService.class);
    
    @Autowired
    private PaymentSlipRepository paymentSlipRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Store payment slips in static resources directory (similar to menu images)
    private static final String PAYMENT_SLIP_DIR = "src/main/resources/static/images/payment-slips/";
    
    private String getUploadDir() {
        return PAYMENT_SLIP_DIR;
    }
    
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
        String uploadDir = getUploadDir();
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            logger.info("Created directory: {}", uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("File name cannot be null or empty");
        }
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = "payment_slip_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + fileExtension;
        String physicalFilePath = uploadDir + uniqueFilename;
        
        // Save file to physical directory
        Path targetPath = Paths.get(physicalFilePath);
        Files.copy(file.getInputStream(), targetPath);
        logger.info("Saved payment slip file to: {}", targetPath);
        
        // Store web-accessible URL path in database (similar to menu images)
        String webAccessiblePath = "/images/payment-slips/" + uniqueFilename;
        
        // Create payment slip entity
        PaymentSlip paymentSlip = new PaymentSlip(order, user, originalFilename, webAccessiblePath, 
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
        logger.info("Payment slip confirmed with ID: {} by admin: {}", id, adminUsername);
        
        // Update order payment status
        Order order = paymentSlip.getOrder();
        if (order != null) {
            order.setStatus(Order.OrderStatus.CONFIRMED);
            order.setPaymentStatus(Order.PaymentStatus.PAID);
            order.addTrackingUpdate(
                "payment_confirmed",
                "Payment Confirmed",
                "Payment was verified by admin: " + adminUsername,
                true
            );
            orderRepository.save(order);
            logger.info("Updated order status to CONFIRMED for order ID: {}", order.getId());
        } else {
            logger.warn("No order found for payment slip ID: {}", id);
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
        logger.info("Payment slip rejected with ID: {} by admin: {}", id, adminUsername);
        
        // Update order payment status
        Order order = paymentSlip.getOrder();
        if (order != null) {
            order.setPaymentStatus(Order.PaymentStatus.FAILED);
            order.addTrackingUpdate(
                "payment_rejected",
                "Payment Rejected",
                "Payment verification failed: " + reason,
                false
            );
            orderRepository.save(order);
            logger.info("Updated order payment status to FAILED for order ID: {}", order.getId());
        } else {
            logger.warn("No order found for payment slip ID: {}", id);
        }
        
        return convertToDTO(paymentSlip);
    }
    
    public PaymentSlipDTO updatePaymentSlipStatus(Long id, String statusString, String adminUsername, String rejectionReason) {
        PaymentSlip paymentSlip = paymentSlipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment slip not found with id: " + id));
        
        try {
            PaymentSlip.PaymentSlipStatus newStatus = PaymentSlip.PaymentSlipStatus.valueOf(statusString.toUpperCase());
            
            // Update the status
            paymentSlip.setStatus(newStatus);
            
            // Set confirmed fields if status is CONFIRMED
            if (newStatus == PaymentSlip.PaymentSlipStatus.CONFIRMED && paymentSlip.getConfirmedAt() == null) {
                paymentSlip.setConfirmedAt(LocalDateTime.now());
                paymentSlip.setConfirmedBy(adminUsername);
            }
            
            // Set rejection reason if status is REJECTED
            if (newStatus == PaymentSlip.PaymentSlipStatus.REJECTED && rejectionReason != null && !rejectionReason.isEmpty()) {
                paymentSlip.setRejectionReason(rejectionReason);
            }
            
            paymentSlip = paymentSlipRepository.save(paymentSlip);
            logger.info("Payment slip {} status updated to {} by admin: {}", id, newStatus, adminUsername);
            
            // Update order payment status based on payment slip status
            Order order = paymentSlip.getOrder();
            if (order != null) {
                switch (newStatus) {
                    case CONFIRMED:
                        order.setPaymentStatus(Order.PaymentStatus.PAID);
                        order.addTrackingUpdate("payment_confirmed", "Payment Confirmed", 
                            "Payment verified and confirmed by " + adminUsername, false);
                        break;
                    case REJECTED:
                        order.setPaymentStatus(Order.PaymentStatus.FAILED);
                        String reason = rejectionReason != null && !rejectionReason.isEmpty() ? rejectionReason : "Payment verification failed";
                        order.addTrackingUpdate("payment_rejected", "Payment Rejected", reason, false);
                        break;
                    case PROCESSING:
                        order.setPaymentStatus(Order.PaymentStatus.PENDING);
                        order.addTrackingUpdate("payment_processing", "Payment Processing", 
                            "Payment verification in progress", false);
                        break;
                    case PENDING:
                        order.setPaymentStatus(Order.PaymentStatus.PENDING);
                        break;
                }
                orderRepository.save(order);
                logger.info("Updated order payment status for order ID: {}", order.getId());
            }
            
            return convertToDTO(paymentSlip);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + statusString);
        }
    }
    
    public void deletePaymentSlip(Long id) {
        PaymentSlip paymentSlip = paymentSlipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment slip not found with id: " + id));
        
        // Delete physical file
        try {
            Path filePath = Paths.get(paymentSlip.getFilePath());
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                logger.info("Deleted file: {}", filePath);
            } else {
                logger.warn("File not found for deletion: {}", filePath);
            }
        } catch (IOException e) {
            // Log error but don't fail the operation
            logger.error("Failed to delete file: {}", paymentSlip.getFilePath(), e);
        }
        
        // Delete from database
        paymentSlipRepository.delete(paymentSlip);
        logger.info("Deleted payment slip record with ID: {}", id);
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