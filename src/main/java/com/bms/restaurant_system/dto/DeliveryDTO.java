package com.bms.restaurant_system.dto;

import java.time.LocalDateTime;

public record DeliveryDTO(Long id, Long orderId, String deliveryAddress, String driverName, String driverPhone, String driverVehicle, String status, LocalDateTime assignedDate, LocalDateTime deliveredDate) {
}
