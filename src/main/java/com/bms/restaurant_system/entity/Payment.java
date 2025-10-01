package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private Double amount;
    private String slipImage;
    private String status; // e.g., "PENDING", "APPROVED", "REJECTED"
    private LocalDateTime submittedDate;
    private LocalDateTime approvedDate;
}
