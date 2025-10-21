package com.bms.restaurant_system.dto.driver;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DeliveryDTO(
    Long id,
    Long orderId,
    Long driverId,
    String driverName,
    String driverPhone,
    String driverVehicle,
    String deliveryAddress,
    String deliveryPhone,
    String deliveryInstructions,
    String status,
    BigDecimal deliveryFee,
    LocalDateTime estimatedDeliveryTime,
    LocalDateTime actualDeliveryTime,
    LocalDateTime pickupTime,
    LocalDateTime assignedDate,
    LocalDateTime deliveredDate,
    BigDecimal currentLatitude,
    BigDecimal currentLongitude,
    BigDecimal deliveryLatitude,
    BigDecimal deliveryLongitude,
    BigDecimal distanceKm,
    Integer customerRating,
    String customerFeedback,
    String deliveryNotes,
    String proofOfDelivery,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
