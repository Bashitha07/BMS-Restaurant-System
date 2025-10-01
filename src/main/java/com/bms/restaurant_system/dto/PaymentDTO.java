package com.bms.restaurant_system.dto;

import java.time.LocalDateTime;

public record PaymentDTO(
    Long id,
    Long orderId,
    Double amount,
    String slipImage,
    String status,
    LocalDateTime submittedDate,
    LocalDateTime approvedDate
) {}
