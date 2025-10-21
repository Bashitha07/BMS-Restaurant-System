package com.bms.restaurant_system.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentSlipDTO(
    Long id,
    Long orderId,
    Long userId,
    String userName,
    String fileName,
    String filePath,
    Long fileSize,
    String contentType,
    BigDecimal paymentAmount,
    LocalDateTime paymentDate,
    String status,
    LocalDateTime uploadedAt,
    LocalDateTime confirmedAt,
    String confirmedBy,
    String rejectionReason,
    String adminNotes,
    String bankName,
    String transactionReference
) {}