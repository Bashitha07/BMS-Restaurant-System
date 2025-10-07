package com.bms.restaurant_system.dto;

public record UserRoleUpdateDTO(
    Long userId,
    String newRole,
    String reason
) {}