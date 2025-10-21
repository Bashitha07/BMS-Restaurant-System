package com.bms.restaurant_system.dto.driver;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record DeliveryDriverDTO(
    Long id,
    String name,
    String username,
    String phone,
    String email,
    String licenseNumber,
    String vehicleNumber,
    String vehicleType,
    String vehicleModel,
    String vehicleColor,
    String status,
    BigDecimal rating,
    Integer totalDeliveries,
    BigDecimal totalEarnings,
    BigDecimal currentLatitude,
    BigDecimal currentLongitude,
    String address,
    String emergencyContact,
    String emergencyPhone,
    LocalDate joinDate,
    LocalDateTime lastActiveTime,
    Boolean isAvailable,
    String profileImageUrl,
    String notes
) {}
