package com.bms.restaurant_system.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MenuDTO(
    Long id,
    String name,
    String description,
    BigDecimal price,
    String category,
    Boolean isAvailable,
    String imageUrl,
    Integer preparationTime,
    String ingredients,
    Boolean isVegetarian,
    Boolean isVegan,
    Boolean isGlutenFree,
    Boolean isSpicy,
    Integer spiceLevel,
    Integer stockQuantity,
    Integer lowStockThreshold,
    Boolean isFeatured,
    BigDecimal discountPercentage,
    BigDecimal discountedPrice,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
