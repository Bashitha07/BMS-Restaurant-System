package com.bms.restaurant_system.dto;

import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.PaymentMethod;

import java.util.List;

public record OrderCreateDTO(
    Long userId,
    List<OrderItemCreateDTO> items,
    PaymentMethod paymentMethod,
    String deliveryAddress,
    String deliveryPhone,
    String specialInstructions,
    Order.OrderType orderType
) {
    public record OrderItemCreateDTO(
        Long menuId,
        Integer quantity,
        String specialInstructions
    ) {}
}
