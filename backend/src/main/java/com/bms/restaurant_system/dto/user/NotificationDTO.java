package com.bms.restaurant_system.dto.user;

import java.time.LocalDateTime;

public record NotificationDTO(
    Long id,
    String title,
    String message,
    String type,
    String status,
    Long userId,
    String userName,
    LocalDateTime createdAt,
    LocalDateTime readAt,
    Long referenceId,
    String referenceType,
    Boolean isGlobal
) {}
