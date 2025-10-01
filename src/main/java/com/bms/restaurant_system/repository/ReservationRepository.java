package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}