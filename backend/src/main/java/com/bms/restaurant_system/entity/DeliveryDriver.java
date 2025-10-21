package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "delivery_drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDriver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String address;

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    @Column(name = "vehicle_number", nullable = false, unique = true)
    private String vehicleNumber;

    @Column(name = "vehicle_type", nullable = false)
    private String vehicleType; // e.g., "MOTORCYCLE", "CAR", "BICYCLE"

    @Column(name = "vehicle_model")
    private String vehicleModel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus status = DriverStatus.PENDING;

    @Column(name = "hire_date", nullable = false)
    private LocalDateTime hireDate;

    @Column(name = "birth_date")
    private LocalDateTime birthDate;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Column(name = "emergency_phone")
    private String emergencyPhone;

    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "commission_rate", precision = 5, scale = 2)
    private BigDecimal commissionRate; // Percentage commission per delivery

    @Column(name = "total_deliveries", nullable = false)
    private Integer totalDeliveries = 0;

    @Column(name = "total_earnings", precision = 10, scale = 2)
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = "total_ratings", nullable = false)
    private Integer totalRatings = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "current_location_lat", precision = 10, scale = 8)
    private BigDecimal currentLocationLat;

    @Column(name = "current_location_lng", precision = 11, scale = 8)
    private BigDecimal currentLocationLng;

    @Column(name = "max_delivery_distance", precision = 5, scale = 2)
    private BigDecimal maxDeliveryDistance; // in kilometers

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Enum for driver status
    public enum DriverStatus {
        PENDING,
        APPROVED,
        REJECTED,
        AVAILABLE,
        BUSY,
        ON_DELIVERY,
        BREAK,
        OFFLINE,
        SUSPENDED
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.hireDate == null) {
            this.hireDate = LocalDateTime.now();
        }
    }

    // Helper methods
    public void updateRating(BigDecimal newRating) {
        if (this.totalRatings == 0) {
            this.averageRating = newRating;
        } else {
            BigDecimal totalRatingPoints = this.averageRating.multiply(BigDecimal.valueOf(this.totalRatings));
            totalRatingPoints = totalRatingPoints.add(newRating);
            this.averageRating = totalRatingPoints.divide(BigDecimal.valueOf(this.totalRatings + 1), 2, java.math.RoundingMode.HALF_UP);
        }
        this.totalRatings++;
    }

    public void addEarnings(BigDecimal amount) {
        this.totalEarnings = this.totalEarnings.add(amount);
    }

    public void incrementDeliveries() {
        this.totalDeliveries++;
    }

    public boolean isAvailableForDelivery() {
        return this.isActive && 
               (this.status == DriverStatus.AVAILABLE || this.status == DriverStatus.OFFLINE) &&
               this.status != DriverStatus.SUSPENDED;
    }
}
