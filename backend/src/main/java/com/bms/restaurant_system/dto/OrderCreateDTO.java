package com.bms.restaurant_system.dto;

import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderCreateDTO(
    Long userId,
    @NotEmpty(message = "Order must contain at least one item")
    List<OrderItemCreateDTO> items,
    @NotNull(message = "Payment method is required")
    PaymentMethod paymentMethod,
    String deliveryAddress,
    String deliveryPhone,
    String specialInstructions,
    @NotNull(message = "Order type is required")
    Order.OrderType orderType
) {
    public record OrderItemCreateDTO(
        @NotNull(message = "Menu ID is required")
        Long menuId,
        @NotNull(message = "Quantity is required")
        Integer quantity,
        String specialInstructions
    ) {}
}

