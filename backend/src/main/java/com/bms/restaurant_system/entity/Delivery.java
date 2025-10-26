package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;

    @Column(name = "delivery_phone")
    private String deliveryPhone;

    @Column(name = "delivery_instructions", columnDefinition = "TEXT")
    private String deliveryInstructions;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status = DeliveryStatus.PENDING;

    @Column(name = "delivery_fee", precision = 10, scale = 2)
    private BigDecimal deliveryFee;

    @Column(name = "estimated_delivery_time")
    private LocalDateTime estimatedDeliveryTime;

    @Column(name = "actual_delivery_time")
    private LocalDateTime actualDeliveryTime;

    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;

    @Column(name = "assigned_date")
    private LocalDateTime assignedDate;

    @Column(name = "delivered_date")
    private LocalDateTime deliveredDate;

    @Column(name = "delivery_notes", columnDefinition = "TEXT")
    private String deliveryNotes;

    @Column(name = "current_latitude", precision = 10, scale = 8)
    private BigDecimal currentLatitude;

    @Column(name = "current_longitude", precision = 11, scale = 8)
    private BigDecimal currentLongitude;

    @Column(name = "delivery_latitude", precision = 10, scale = 8)
    private BigDecimal deliveryLatitude;

    @Column(name = "delivery_longitude", precision = 11, scale = 8)
    private BigDecimal deliveryLongitude;

    @Column(name = "distance_km", precision = 5, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "customer_rating")
    private Integer customerRating; // 1-5 stars

    @Column(name = "customer_feedback", columnDefinition = "TEXT")
    private String customerFeedback;

    @Column(name = "proof_of_delivery")
    private String proofOfDelivery; // Image URL or signature

    @Column(name = "cash_collected", precision = 10, scale = 2)
    private BigDecimal cashCollected; // Amount collected for COD orders

    @Column(name = "cash_collection_confirmed")
    private Boolean cashCollectionConfirmed = false; // Driver confirms cash received

    @Column(name = "cash_collection_time")
    private LocalDateTime cashCollectionTime; // When cash was collected

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Legacy fields for backward compatibility
    @Column(name = "driver_name")
    private String driverName;

    @Column(name = "driver_phone")
    private String driverPhone;

    @Column(name = "driver_vehicle")
    private String driverVehicle;

    public enum DeliveryStatus {
        PENDING,
        ASSIGNED,
        PICKED_UP,
        IN_TRANSIT,
        ARRIVED,
        DELIVERED,
        FAILED,
        CANCELLED,
        RETURNED
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
        // Set legacy driver fields if driver is assigned
        if (this.driver != null) {
            this.driverName = this.driver.getName();
            this.driverPhone = this.driver.getPhone();
            this.driverVehicle = this.driver.getVehicleNumber();
        }
    }

    // Helper methods
    public void assignDriver(Driver driver) {
        this.driver = driver;
        this.driverName = driver.getName();
        this.driverPhone = driver.getPhone();
        this.driverVehicle = driver.getVehicleNumber();
        this.status = DeliveryStatus.ASSIGNED;
        this.assignedDate = LocalDateTime.now();
    }

    public void markAsPickedUp() {
        this.status = DeliveryStatus.PICKED_UP;
        this.pickupTime = LocalDateTime.now();
    }

    public void markInTransit() {
        this.status = DeliveryStatus.IN_TRANSIT;
    }

    public void markAsArrived() {
        this.status = DeliveryStatus.ARRIVED;
    }

    public void markAsDelivered() {
        this.status = DeliveryStatus.DELIVERED;
        this.deliveredDate = LocalDateTime.now();
        this.actualDeliveryTime = LocalDateTime.now();
    }

    public void markAsFailed(String notes) {
        this.status = DeliveryStatus.FAILED;
        this.deliveryNotes = notes;
    }

    public void updateLocation(BigDecimal latitude, BigDecimal longitude) {
        this.currentLatitude = latitude;
        this.currentLongitude = longitude;
    }

    public void setCustomerFeedback(Integer rating, String feedback) {
        this.customerRating = rating;
        this.customerFeedback = feedback;
    }

    public boolean isInProgress() {
        return this.status == DeliveryStatus.ASSIGNED || 
               this.status == DeliveryStatus.PICKED_UP || 
               this.status == DeliveryStatus.IN_TRANSIT ||
               this.status == DeliveryStatus.ARRIVED;
    }

    public boolean isCompleted() {
        return this.status == DeliveryStatus.DELIVERED;
    }
}
