package com.bms.restaurant_system.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentDTO(
    Long id,
    Long orderId,
    BigDecimal amount,
    String paymentMethod,
    String status,
    String transactionId,
    String slipImage,
    String paymentGateway,
    String gatewayTransactionId,
    LocalDateTime submittedDate,
    LocalDateTime processedDate,
    LocalDateTime approvedDate,
    String failureReason,
    BigDecimal refundAmount,
    LocalDateTime refundedDate,
    String refundReason,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
