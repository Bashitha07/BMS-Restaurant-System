package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "menus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Menu name is required")
    @Size(max = 100, message = "Menu name must not exceed 100 characters")
    @Column(nullable = false)
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "preparation_time")
    private Integer preparationTime; // in minutes

    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredients;

    @Column(name = "is_vegetarian")
    private Boolean isVegetarian = false;

    @Column(name = "is_vegan")
    private Boolean isVegan = false;

    @Column(name = "is_gluten_free")
    private Boolean isGlutenFree = false;

    @Column(name = "is_spicy")
    private Boolean isSpicy = false;

    @Column(name = "spice_level")
    private Integer spiceLevel; // 1-5 scale

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 10;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "discount_percentage", precision = 5, scale = 2)
    private BigDecimal discountPercentage = BigDecimal.ZERO;

    @Column(name = "discounted_price", precision = 10, scale = 2)
    private BigDecimal discountedPrice;

    @Column(name = "created_at", nullable = true)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        calculateDiscountedPrice();
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        calculateDiscountedPrice();
    }

    // Constructor for backward compatibility
    public Menu(String name, String description, BigDecimal price, String category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.isAvailable = true;
        this.createdAt = LocalDateTime.now();
    }

    // Helper methods
    private void calculateDiscountedPrice() {
        if (this.discountPercentage != null && this.discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discount = this.price.multiply(this.discountPercentage).divide(BigDecimal.valueOf(100));
            this.discountedPrice = this.price.subtract(discount);
        } else {
            this.discountedPrice = this.price;
        }
    }

    public boolean isInStock() {
        return this.stockQuantity == null || this.stockQuantity > 0;
    }

    public boolean isLowStock() {
        return this.stockQuantity != null && this.stockQuantity <= this.lowStockThreshold;
    }

    public void reduceStock(int quantity) {
        if (this.stockQuantity != null) {
            this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
        }
    }

    public void addStock(int quantity) {
        if (this.stockQuantity == null) {
            this.stockQuantity = quantity;
        } else {
            this.stockQuantity += quantity;
        }
    }

    public BigDecimal getEffectivePrice() {
        return this.discountedPrice != null ? this.discountedPrice : this.price;
    }

    public boolean hasDiscount() {
        return this.discountPercentage != null && this.discountPercentage.compareTo(BigDecimal.ZERO) > 0;
    }
}
