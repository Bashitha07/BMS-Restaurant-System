package com.bms.restaurant_system.dto;

import java.time.LocalDateTime;

public record ReservationDTO(Long id, String status, Integer numberOfPeople, LocalDateTime reservationDateTime, String timeSlot) {
}
