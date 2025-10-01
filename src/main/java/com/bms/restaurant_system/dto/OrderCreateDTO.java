package com.bms.restaurant_system.dto;

import com.bms.restaurant_system.entity.PaymentMethod;

import java.util.List;

public record OrderCreateDTO(
    Long userId,
    List<OrderItemDTO> items,
    PaymentMethod paymentMethod,
    String deliveryAddress
) {
}
