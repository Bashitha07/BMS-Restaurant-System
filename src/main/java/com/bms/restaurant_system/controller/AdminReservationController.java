package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.ReservationDTO;
import com.bms.restaurant_system.service.ReservationService;
import com.bms.restaurant_system.entity.Reservation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reservations")
@CrossOrigin(origins = "*")
public class AdminReservationController {
    private static final Logger logger = LoggerFactory.getLogger(AdminReservationController.class);

    @Autowired
    private ReservationService reservationService;

    // Get all reservations (admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        logger.info("Admin fetching all reservations");
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    // Get reservations by date range
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDTO>> getReservationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        logger.info("Admin fetching reservations from {} to {}", startDate, endDate);
        return ResponseEntity.ok(reservationService.getReservationsByDateRange(startDate, endDate));
    }

    // Get reservations by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDTO>> getReservationsByStatus(@PathVariable String status) {
        logger.info("Admin fetching reservations with status: {}", status);
        try {
            Reservation.ReservationStatus reservationStatus = Reservation.ReservationStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(reservationService.getReservationsByStatus(reservationStatus));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid reservation status: {}", status);
            return ResponseEntity.badRequest().build();
        }
    }

    // Get reservation by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getReservationById(@PathVariable Long id) {
        logger.info("Admin fetching reservation with id: {}", id);
        try {
            ReservationDTO reservation = reservationService.getReservationById(id);
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            logger.error("Error fetching reservation {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Reservation not found");
        }
    }

    // Create reservation (admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createReservation(@RequestBody ReservationDTO reservationDTO) {
        logger.info("Admin creating reservation for: {}", reservationDTO.customerName());
        try {
            ReservationDTO created = reservationService.createReservation(reservationDTO);
            logger.info("Reservation created successfully with id: {}", created.id());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            logger.error("Error creating reservation: {}", e.getMessage());
            return ResponseEntity.status(400).body("Failed to create reservation: " + e.getMessage());
        }
    }

    // Update reservation
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateReservation(@PathVariable Long id, @RequestBody ReservationDTO reservationDTO) {
        logger.info("Admin updating reservation: {}", id);
        try {
            ReservationDTO updated = reservationService.updateReservation(id, reservationDTO);
            logger.info("Reservation updated successfully: {}", id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating reservation {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to update reservation: " + e.getMessage());
        }
    }

    // Confirm reservation
    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> confirmReservation(@PathVariable Long id, @RequestBody Map<String, Object> confirmationData) {
        logger.info("Admin confirming reservation: {}", id);
        try {
            String adminUsername = (String) confirmationData.get("adminUsername");
            Integer tableNumber = (Integer) confirmationData.get("tableNumber");
            String notes = (String) confirmationData.get("notes");
            
            ReservationDTO confirmed = reservationService.confirmReservation(id, adminUsername, tableNumber, notes);
            logger.info("Reservation {} confirmed successfully", id);
            return ResponseEntity.ok(confirmed);
        } catch (Exception e) {
            logger.error("Error confirming reservation {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to confirm reservation: " + e.getMessage());
        }
    }

    // Cancel reservation
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id, @RequestBody Map<String, String> cancellationData) {
        logger.info("Admin cancelling reservation: {}", id);
        try {
            String reason = cancellationData.get("reason");
            ReservationDTO cancelled = reservationService.cancelReservation(id, reason);
            logger.info("Reservation {} cancelled successfully", id);
            return ResponseEntity.ok(cancelled);
        } catch (Exception e) {
            logger.error("Error cancelling reservation {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to cancel reservation: " + e.getMessage());
        }
    }

    // Mark as seated
    @PostMapping("/{id}/seat")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> markAsSeated(@PathVariable Long id) {
        logger.info("Admin marking reservation {} as seated", id);
        try {
            ReservationDTO seated = reservationService.markAsSeated(id);
            logger.info("Reservation {} marked as seated", id);
            return ResponseEntity.ok(seated);
        } catch (Exception e) {
            logger.error("Error seating reservation {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to mark as seated: " + e.getMessage());
        }
    }

    // Complete reservation
    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> completeReservation(@PathVariable Long id) {
        logger.info("Admin completing reservation: {}", id);
        try {
            ReservationDTO completed = reservationService.completeReservation(id);
            logger.info("Reservation {} completed successfully", id);
            return ResponseEntity.ok(completed);
        } catch (Exception e) {
            logger.error("Error completing reservation {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to complete reservation: " + e.getMessage());
        }
    }

    // Mark as no-show
    @PostMapping("/{id}/no-show")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> markAsNoShow(@PathVariable Long id) {
        logger.info("Admin marking reservation {} as no-show", id);
        try {
            ReservationDTO noShow = reservationService.markAsNoShow(id);
            logger.info("Reservation {} marked as no-show", id);
            return ResponseEntity.ok(noShow);
        } catch (Exception e) {
            logger.error("Error marking reservation {} as no-show: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to mark as no-show: " + e.getMessage());
        }
    }

    // Delete reservation
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        logger.info("Admin deleting reservation: {}", id);
        try {
            reservationService.deleteReservation(id);
            logger.info("Reservation {} deleted successfully", id);
            return ResponseEntity.ok("Reservation deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting reservation {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to delete reservation: " + e.getMessage());
        }
    }

    // Get reservation statistics
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getReservationStatistics() {
        logger.info("Admin fetching reservation statistics");
        try {
            Map<String, Object> stats = reservationService.getReservationStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching reservation statistics: {}", e.getMessage());
            return ResponseEntity.status(500).body("Failed to fetch statistics");
        }
    }

    // Get today's reservations
    @GetMapping("/today")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDTO>> getTodaysReservations() {
        logger.info("Admin fetching today's reservations");
        return ResponseEntity.ok(reservationService.getTodaysReservations());
    }

    // Get upcoming reservations
    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDTO>> getUpcomingReservations() {
        logger.info("Admin fetching upcoming reservations");
        return ResponseEntity.ok(reservationService.getUpcomingReservations());
    }
}