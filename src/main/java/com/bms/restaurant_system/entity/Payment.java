package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "slip_image")
    private String slipImage;

    @Column(name = "payment_gateway")
    private String paymentGateway; // e.g., "STRIPE", "PAYPAL", "BANK_TRANSFER"

    @Column(name = "gateway_transaction_id")
    private String gatewayTransactionId;

    @Column(name = "submitted_date", nullable = false)
    private LocalDateTime submittedDate = LocalDateTime.now();

    @Column(name = "processed_date")
    private LocalDateTime processedDate;

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

    @Column(name = "failure_reason")
    private String failureReason;

    @Column(name = "refund_amount", precision = 10, scale = 2)
    private BigDecimal refundAmount;

    @Column(name = "refunded_date")
    private LocalDateTime refundedDate;

    @Column(name = "refund_reason", length = 500)
    private String refundReason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PaymentStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED,
        CANCELLED,
        REFUNDED,
        PARTIALLY_REFUNDED
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
        if (this.submittedDate == null) {
            this.submittedDate = LocalDateTime.now();
        }
    }

    // Helper methods
    public void markAsCompleted(String transactionId) {
        this.status = PaymentStatus.COMPLETED;
        this.transactionId = transactionId;
        this.processedDate = LocalDateTime.now();
        this.approvedDate = LocalDateTime.now();
    }

    public void markAsFailed(String reason) {
        this.status = PaymentStatus.FAILED;
        this.failureReason = reason;
        this.processedDate = LocalDateTime.now();
    }

    public void processRefund(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
        this.refundedDate = LocalDateTime.now();
        
        if (refundAmount.compareTo(this.amount) >= 0) {
            this.status = PaymentStatus.REFUNDED;
        } else {
            this.status = PaymentStatus.PARTIALLY_REFUNDED;
        }
    }

    public boolean canBeRefunded() {
        return this.status == PaymentStatus.COMPLETED;
    }
}
