package com.bms.restaurant_system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record RegisterDriverDTO(
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    String name,

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    String username,

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String password,

    @NotBlank(message = "Phone is required")
    String phone,

    @NotBlank(message = "Address is required")
    String address,

    @NotBlank(message = "License number is required")
    String licenseNumber,

    @NotBlank(message = "Vehicle number is required")
    String vehicleNumber,

    @NotBlank(message = "Vehicle type is required")
    String vehicleType,

    String vehicleModel,
    String emergencyContact,
    String emergencyPhone,
    BigDecimal hourlyRate,
    BigDecimal commissionRate,
    String notes
) {}