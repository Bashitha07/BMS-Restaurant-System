package com.bms.restaurant_system.dto;

import java.math.BigDecimal;

public record OrderItemDTO(
    Long id,
    Long menuId,
    String menuName,
    String menuDescription,
    String menuCategory,
    String menuImageUrl,
    Integer quantity,
    BigDecimal unitPrice,
    BigDecimal totalPrice,
    String specialInstructions
) {}
