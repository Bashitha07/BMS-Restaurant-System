package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime orderDate;
    private String status; // e.g., "PENDING", "COMPLETED", "CANCELLED"
    private Double totalAmount;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    private String deliveryAddress;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    private List<OrderItem> items;

    @OneToOne(mappedBy = "order", fetch = FetchType.LAZY)
    private Delivery delivery;
}