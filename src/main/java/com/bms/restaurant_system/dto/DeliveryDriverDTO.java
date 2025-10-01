package com.bms.restaurant_system.dto;

public record DeliveryDriverDTO(
    Long id,
    String name,
    String phone,
    String vehicleNumber,
    String status
) {}
