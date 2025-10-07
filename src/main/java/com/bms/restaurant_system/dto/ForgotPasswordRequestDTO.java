package com.bms.restaurant_system.dto;

public record ForgotPasswordRequestDTO(
    String username,
    String email
) {}