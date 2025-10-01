package com.bms.restaurant_system.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class MenuDTO {
    @NotBlank(message = "Menu name is required")
    @Size(max = 100, message = "Menu name must not exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    private String category;
    private Boolean isAvailable = true;

    // Constructors
    public MenuDTO() {}

    public MenuDTO(String name, String description, BigDecimal price, String category, Boolean isAvailable) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.isAvailable = isAvailable;
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
