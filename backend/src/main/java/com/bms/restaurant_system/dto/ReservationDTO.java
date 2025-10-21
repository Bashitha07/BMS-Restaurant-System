package com.bms.restaurant_system.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReservationDTO(
    Long id,
    LocalDate reservationDate,
    LocalTime reservationTime,
    LocalDateTime reservationDateTime,
    String timeSlot,
    Integer numberOfPeople,
    String status,
    String customerName,
    String customerEmail,
    String customerPhone,
    String specialRequests,
    Integer tableNumber,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime confirmedAt,
    LocalDateTime cancelledAt,
    String cancellationReason,
    Boolean reminderSent,
    Long userId,
    String userName
) {}
