package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private String deliveryAddress;

    private String driverName;
    private String driverPhone;
    private String driverVehicle;
    private String status; // e.g., "ASSIGNED", "IN_TRANSIT", "DELIVERED"
    private LocalDateTime assignedDate;
    private LocalDateTime deliveredDate;
}
