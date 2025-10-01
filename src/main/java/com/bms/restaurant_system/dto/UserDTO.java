package com.bms.restaurant_system.dto;


public record UserDTO(
    Long id,
    String username,
    String email,
    String phone,
    String role,
    String password
) {}
