package com.bms.restaurant_system.service;

import com.bms.restaurant_system.dto.PaymentDTO;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.Payment;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.OrderRepository;
import com.bms.restaurant_system.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        Payment payment = convertToEntity(paymentDTO);
        Order order = orderRepository.findById(paymentDTO.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + paymentDTO.orderId()));
        payment.setOrder(order);
        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    public PaymentDTO updatePayment(Long id, PaymentDTO paymentDTO) {
        Payment existingPayment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        existingPayment.setAmount(paymentDTO.amount());
        existingPayment.setSlipImage(paymentDTO.slipImage());
        existingPayment.setStatus(paymentDTO.status());
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
        payment.setStatus("APPROVED");
        payment.setApprovedDate(java.time.LocalDateTime.now());
        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    private PaymentDTO convertToDTO(Payment payment) {
        return new PaymentDTO(
                payment.getId(),
                payment.getOrder() != null ? payment.getOrder().getId() : null,
                payment.getAmount(),
                payment.getSlipImage(),
                payment.getStatus(),
                payment.getSubmittedDate(),
                payment.getApprovedDate()
        );
    }

    private Payment convertToEntity(PaymentDTO paymentDTO) {
        Payment payment = new Payment();
        payment.setAmount(paymentDTO.amount());
        payment.setSlipImage(paymentDTO.slipImage());
        payment.setStatus(paymentDTO.status());
        payment.setSubmittedDate(paymentDTO.submittedDate());
        payment.setApprovedDate(paymentDTO.approvedDate());
        return payment;
    }
}
