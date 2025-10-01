package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "delivery_drivers")
@Data
public class DeliveryDriver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String vehicleNumber;
    private String status; // e.g., "AVAILABLE", "BUSY", "OFFLINE"
}
