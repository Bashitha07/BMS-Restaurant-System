package com.bms.restaurant_system.dto;

import java.time.LocalDateTime;

public record OrderTrackingDTO(
    Long id,
    Long orderId,
    String status,
    String title,
    String description,
    LocalDateTime timestamp,
    boolean completed,
    String actor
) {}