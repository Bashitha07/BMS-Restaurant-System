package com.bms.restaurant_system.controller.user;

import com.bms.restaurant_system.dto.ReservationDTO;
import com.bms.restaurant_system.service.reservation.ReservationService;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        logger.info("Fetching all reservations");
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationDTO>> getMyReservations() {
        logger.info("Fetching reservations for current user");
        try {
            // Get the authenticated username from SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("No authenticated user found");
                return ResponseEntity.status(401).build();
            }

            String username = authentication.getName();
            logger.info("Authenticated user: {}", username);

            // Find the user by username
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

            logger.info("User found with id: {}", user.getId());

            // Get reservations for this user
            List<ReservationDTO> reservations = reservationService.getReservationsByUser(user.getId());
            logger.info("Found {} reservations for user: {}", reservations.size(), username);
            
            return ResponseEntity.ok(reservations);
        } catch (ResourceNotFoundException e) {
            logger.error("User not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error fetching reservations: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDTO> getReservationById(@PathVariable Long id) {
        logger.info("Fetching reservation with id: {}", id);
        try {
            ReservationDTO reservation = reservationService.getReservationById(id);
            logger.info("Reservation found with id: {}", id);
            return ResponseEntity.ok(reservation);
        } catch (ResourceNotFoundException e) {
            logger.warn("Reservation not found with id: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(@Valid @RequestBody ReservationDTO reservationDTO) {
        logger.info("Creating new reservation");
        ReservationDTO createdReservation = reservationService.createReservation(reservationDTO);
        logger.info("Reservation created with id: {}", createdReservation.id());
        return ResponseEntity.ok(createdReservation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationDTO> updateReservation(@PathVariable Long id, @Valid @RequestBody ReservationDTO reservationDTO) {
        logger.info("Updating reservation with id: {}", id);
        ReservationDTO updatedReservation = reservationService.updateReservation(id, reservationDTO);
        logger.info("Reservation updated with id: {}", id);
        return ResponseEntity.ok(updatedReservation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        logger.info("Deleting reservation with id: {}", id);
        reservationService.deleteReservation(id);
        logger.info("Reservation deleted with id: {}", id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available-slots")
    public ResponseEntity<List<String>> getAvailableSlots(@RequestParam String date) {
        logger.info("Fetching available slots for date: {}", date);
        List<String> availableSlots = reservationService.getAvailableSlots(date);
        logger.info("Available slots fetched for date: {}", date);
        return ResponseEntity.ok(availableSlots);
    }

    @GetMapping("/available-tables")
    public ResponseEntity<List<Integer>> getAvailableTablesForSlot(
            @RequestParam String date, 
            @RequestParam String timeSlot) {
        logger.info("Fetching available tables for date: {} and time slot: {}", date, timeSlot);
        List<Integer> availableTables = reservationService.getAvailableTablesForSlot(date, timeSlot);
        logger.info("Available tables fetched for date: {} and time slot: {}", date, timeSlot);
        return ResponseEntity.ok(availableTables);
    }
}
