package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime reservationDateTime;
    private String timeSlot; // e.g., "12:00-13:00", "18:00-19:00"
    private Integer numberOfPeople;
    private String status; // e.g., "CONFIRMED", "CANCELLED"

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}