package com.bms.restaurant_system.dto;

import com.bms.restaurant_system.entity.Role;

public record UserResponseDTO(
    Long id,
    String username,
    String email,
    String phone,
    Role role,
    boolean enabled
) {}
