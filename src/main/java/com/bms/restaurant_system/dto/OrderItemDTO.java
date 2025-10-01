package com.bms.restaurant_system.dto;

public record OrderItemDTO(
    Long menuId,
    Integer quantity
) {
}
