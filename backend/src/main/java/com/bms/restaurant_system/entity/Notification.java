package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status = NotificationStatus.UNREAD;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // null for system-wide notifications

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    // Additional data for specific notification types
    @Column(name = "reference_id")
    private Long referenceId; // ID of related entity (order, reservation, etc.)

    @Column(name = "reference_type")
    private String referenceType; // "ORDER", "RESERVATION", "DELIVERY", etc.

    @Column(name = "is_global")
    private Boolean isGlobal = false; // For system-wide announcements

    public enum NotificationType {
        ORDER_CONFIRMATION,
        ORDER_STATUS_UPDATE,
        RESERVATION_CONFIRMATION,
        RESERVATION_REMINDER,
        DELIVERY_UPDATE,
        PAYMENT_CONFIRMATION,
        SYSTEM_ANNOUNCEMENT,
        PROMOTIONAL,
        WARNING,
        ERROR
    }

    public enum NotificationStatus {
        UNREAD,
        READ,
        DISMISSED
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Helper methods
    public void markAsRead() {
        this.status = NotificationStatus.READ;
        this.readAt = LocalDateTime.now();
    }

    public void dismiss() {
        this.status = NotificationStatus.DISMISSED;
    }

    public boolean isRead() {
        return this.status == NotificationStatus.READ;
    }

    public boolean isUnread() {
        return this.status == NotificationStatus.UNREAD;
    }
}
