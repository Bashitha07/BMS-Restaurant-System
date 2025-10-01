package com.bms.restaurant_system.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDTO(
    Long id,
    String status,
    Double totalAmount,
    LocalDateTime orderDate,
    String paymentMethod,
    String deliveryAddress,
    List<OrderItemDTO> items,
    DeliveryDTO delivery
) {}
