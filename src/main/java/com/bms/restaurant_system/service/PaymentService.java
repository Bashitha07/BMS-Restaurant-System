package com.bms.restaurant_system.service;

import com.bms.restaurant_system.dto.PaymentDTO;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.Payment;
import com.bms.restaurant_system.entity.PaymentMethod;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.OrderRepository;
import com.bms.restaurant_system.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return convertToDTO(payment);
    }

    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Order order = orderRepository.findById(paymentDTO.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + paymentDTO.orderId()));
        
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(paymentDTO.amount());
        payment.setPaymentMethod(PaymentMethod.valueOf(paymentDTO.paymentMethod()));
        payment.setSlipImage(paymentDTO.slipImage());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setSubmittedDate(LocalDateTime.now());
        
        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    public PaymentDTO updatePayment(Long id, PaymentDTO paymentDTO) {
        Payment existingPayment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        existingPayment.setAmount(paymentDTO.amount());
        existingPayment.setSlipImage(paymentDTO.slipImage());
        existingPayment.setStatus(Payment.PaymentStatus.valueOf(paymentDTO.status()));
        existingPayment.setSubmittedDate(paymentDTO.submittedDate());
        existingPayment.setApprovedDate(paymentDTO.approvedDate());
        existingPayment = paymentRepository.save(existingPayment);
        return convertToDTO(existingPayment);
    }

    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        paymentRepository.delete(payment);
    }

    public PaymentDTO approvePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setApprovedDate(LocalDateTime.now());
        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    public PaymentDTO rejectPayment(Long id, String reason) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        payment.setStatus(Payment.PaymentStatus.FAILED);
        payment.setFailureReason(reason);
        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    private PaymentDTO convertToDTO(Payment payment) {
        return new PaymentDTO(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getAmount(),
                payment.getPaymentMethod().name(),
                payment.getStatus().name(),
                payment.getTransactionId(),
                payment.getSlipImage(),
                payment.getPaymentGateway(),
                payment.getGatewayTransactionId(),
                payment.getSubmittedDate(),
                payment.getProcessedDate(),
                payment.getApprovedDate(),
                payment.getFailureReason(),
                payment.getRefundAmount(),
                payment.getRefundedDate(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}