package com.bms.restaurant_system.dto;

import java.math.BigDecimal;

public record MenuItemUpdateDTO(
    String name,
    String description,
    BigDecimal price,
    String category,
    Boolean available,
    String imageUrl
) {}