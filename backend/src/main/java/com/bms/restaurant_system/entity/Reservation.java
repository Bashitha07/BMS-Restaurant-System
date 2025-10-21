package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;

    @Column(name = "reservation_time", nullable = false)
    private LocalTime reservationTime;

    @Column(name = "reservation_date_time", nullable = false)
    private LocalDateTime reservationDateTime;

    @Column(name = "time_slot")
    private String timeSlot; // e.g., "12:00-13:00", "18:00-19:00"

    @Column(name = "number_of_people", nullable = false)
    private Integer numberOfPeople;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Column(name = "table_number")
    private Integer tableNumber;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "reminder_sent")
    private Boolean reminderSent = false;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum ReservationStatus {
        PENDING,
        CONFIRMED,
        SEATED,
        CANCELLED,
        NO_SHOW,
        COMPLETED
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
        // Combine date and time into datetime
        if (this.reservationDate != null && this.reservationTime != null) {
            this.reservationDateTime = this.reservationDate.atTime(this.reservationTime);
        }
    }

    // Helper methods
    public boolean canBeConfirmed() {
        return this.status == ReservationStatus.PENDING;
    }

    public void confirm(String adminUsername, Integer tableNumber) {
        this.status = ReservationStatus.CONFIRMED;
        this.confirmedAt = LocalDateTime.now();
        if (tableNumber != null) {
            this.tableNumber = tableNumber;
        }
    }

    public void confirm() {
        this.status = ReservationStatus.CONFIRMED;
        this.confirmedAt = LocalDateTime.now();
    }

    public void markAsSeated() {
        this.status = ReservationStatus.SEATED;
    }

    public void cancel(String reason) {
        this.status = ReservationStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
        this.cancellationReason = reason;
    }

    public void markAsNoShow() {
        this.status = ReservationStatus.NO_SHOW;
    }

    public void complete() {
        this.status = ReservationStatus.COMPLETED;
    }

    public boolean canBeCancelled() {
        return this.status == ReservationStatus.PENDING || this.status == ReservationStatus.CONFIRMED;
    }

    public boolean canBeModified() {
        return this.status == ReservationStatus.PENDING || this.status == ReservationStatus.CONFIRMED;
    }

    public void markReminderSent() {
        this.reminderSent = true;
    }
}