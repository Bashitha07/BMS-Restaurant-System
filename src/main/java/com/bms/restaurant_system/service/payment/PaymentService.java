package com.bms.restaurant_system.service.payment;

import com.bms.restaurant_system.dto.PaymentDTO;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.Payment;
import com.bms.restaurant_system.entity.PaymentMethod;
import com.bms.restaurant_system.entity.Delivery;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.OrderRepository;
import com.bms.restaurant_system.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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

    public PaymentDTO processRefund(Long paymentId, BigDecimal refundAmount, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));

        // Validate refund amount
        if (refundAmount == null || refundAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Refund amount must be greater than zero");
        }

        if (refundAmount.compareTo(payment.getAmount()) > 0) {
            throw new IllegalArgumentException("Refund amount cannot exceed original payment amount");
        }

        // Check if payment can be refunded
        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Only completed payments can be refunded");
        }

        // Process refund through payment gateway
        boolean gatewayRefundSuccess = processGatewayRefund(payment, refundAmount);

        if (gatewayRefundSuccess) {
            // Update payment status
            if (refundAmount.compareTo(payment.getAmount()) == 0) {
                payment.setStatus(Payment.PaymentStatus.REFUNDED);
            } else {
                payment.setStatus(Payment.PaymentStatus.PARTIALLY_REFUNDED);
            }

            payment.setRefundAmount(refundAmount);
            payment.setRefundedDate(LocalDateTime.now());
            payment.setRefundReason(reason);

            // Update order status if full refund
            if (refundAmount.compareTo(payment.getAmount()) == 0) {
                Order order = payment.getOrder();
                order.setStatus(Order.OrderStatus.REFUNDED);
                orderRepository.save(order);
            }

            payment = paymentRepository.save(payment);
            return convertToDTO(payment);
        } else {
            throw new RuntimeException("Payment gateway refund failed");
        }
    }

    public PaymentDTO processFullRefund(Long paymentId, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));

        return processRefund(paymentId, payment.getAmount(), reason);
    }

    public BigDecimal calculateRefundAmount(Long orderId, String refundType) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        Payment payment = paymentRepository.findByOrderId(orderId)
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No payment found for order: " + orderId));

        BigDecimal originalAmount = payment.getAmount();
        BigDecimal refundAmount = BigDecimal.ZERO;

        switch (refundType.toUpperCase()) {
            case "FULL":
                refundAmount = originalAmount;
                break;
            case "PARTIAL_DELIVERY_FEE":
                // Refund only delivery fee if order was cancelled before delivery
                if (order.getStatus() == Order.OrderStatus.CANCELLED &&
                    (order.getDelivery() == null || order.getDelivery().getStatus() == Delivery.DeliveryStatus.PENDING)) {
                    refundAmount = order.getDeliveryFee() != null ? order.getDeliveryFee() : BigDecimal.ZERO;
                }
                break;
            case "PROPORTIONAL":
                // Calculate based on order status and time elapsed
                refundAmount = calculateProportionalRefund(order, originalAmount);
                break;
            default:
                throw new IllegalArgumentException("Invalid refund type: " + refundType);
        }

        return refundAmount;
    }

    private BigDecimal calculateProportionalRefund(Order order, BigDecimal originalAmount) {
        // Business logic for proportional refunds based on order status
        return switch (order.getStatus()) {
            case PENDING, CONFIRMED -> originalAmount; // Full refund
            case PREPARING -> originalAmount.multiply(new BigDecimal("0.75")); // 75% refund
            case READY_FOR_PICKUP -> originalAmount.multiply(new BigDecimal("0.50")); // 50% refund
            case OUT_FOR_DELIVERY -> originalAmount.multiply(new BigDecimal("0.25")); // 25% refund
            case DELIVERED -> BigDecimal.ZERO; // No refund after delivery
            default -> BigDecimal.ZERO;
        };
    }

    private boolean processGatewayRefund(Payment payment, BigDecimal refundAmount) {
        // Simulate payment gateway integration
        // In a real implementation, this would call the actual payment gateway API
        try {
            // Simulate gateway processing time
            Thread.sleep(1000);

            // Simulate success/failure (90% success rate for demo)
            return Math.random() > 0.1;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
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
                payment.getRefundReason(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}