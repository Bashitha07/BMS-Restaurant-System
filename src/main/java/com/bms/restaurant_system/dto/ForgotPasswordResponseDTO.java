package com.bms.restaurant_system.dto;

public record ForgotPasswordResponseDTO(
    String message,
    String lastThreeCharacters
) {}