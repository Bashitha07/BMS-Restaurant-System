package com.bms.restaurant_system.service;

import com.bms.restaurant_system.dto.ReservationDTO;
import com.bms.restaurant_system.entity.Reservation;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.ReservationRepository;
import com.bms.restaurant_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ReservationDTO> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ReservationDTO getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        return convertToDTO(reservation);
    }

    public ReservationDTO createReservation(ReservationDTO reservationDTO) {
        Reservation reservation = convertToEntity(reservationDTO);
        reservation = reservationRepository.save(reservation);
        return convertToDTO(reservation);
    }

    public ReservationDTO updateReservation(Long id, ReservationDTO reservationDTO) {
        Reservation existingReservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        existingReservation.setStatus(Reservation.ReservationStatus.valueOf(reservationDTO.status()));
        existingReservation.setNumberOfPeople(reservationDTO.numberOfPeople());
        existingReservation = reservationRepository.save(existingReservation);
        return convertToDTO(existingReservation);
    }

    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        reservationRepository.delete(reservation);
    }

    public ReservationDTO cancelReservation(Long id, String reason) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        if (reason != null) {
            reservation.setCancellationReason(reason);
        }
        reservation = reservationRepository.save(reservation);
        return convertToDTO(reservation);
    }

    // Overloaded method for backward compatibility
    public ReservationDTO cancelReservation(Long id) {
        return cancelReservation(id, null);
    }

    public ReservationDTO updateReservationStatus(Long id, String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        reservation.setStatus(Reservation.ReservationStatus.valueOf(status));
        reservation = reservationRepository.save(reservation);
        return convertToDTO(reservation);
    }

    private ReservationDTO convertToDTO(Reservation reservation) {
        return new ReservationDTO(
                reservation.getId(),                    // Long id
                reservation.getReservationDate(),       // LocalDate reservationDate
                reservation.getReservationTime(),       // LocalTime reservationTime
                reservation.getReservationDateTime(),   // LocalDateTime reservationDateTime
                reservation.getTimeSlot(),              // String timeSlot
                reservation.getNumberOfPeople(),        // Integer numberOfPeople
                reservation.getStatus().name(),         // String status
                reservation.getCustomerName(),          // String customerName
                reservation.getCustomerEmail(),         // String customerEmail
                reservation.getCustomerPhone(),         // String customerPhone
                reservation.getSpecialRequests(),       // String specialRequests
                reservation.getTableNumber(),           // Integer tableNumber
                reservation.getCreatedAt(),             // LocalDateTime createdAt
                reservation.getUpdatedAt(),             // LocalDateTime updatedAt
                reservation.getConfirmedAt(),           // LocalDateTime confirmedAt
                reservation.getCancelledAt(),           // LocalDateTime cancelledAt
                reservation.getCancellationReason(),    // String cancellationReason
                reservation.getReminderSent(),          // Boolean reminderSent
                reservation.getUser() != null ? reservation.getUser().getId() : null,        // Long userId
                reservation.getUser() != null ? reservation.getUser().getUsername() : null   // String userName
        );
    }

    private Reservation convertToEntity(ReservationDTO reservationDTO) {
        Reservation reservation = new Reservation();
        reservation.setStatus(Reservation.ReservationStatus.valueOf(reservationDTO.status()));
        reservation.setNumberOfPeople(reservationDTO.numberOfPeople());
        reservation.setReservationDateTime(reservationDTO.reservationDateTime());
        reservation.setTimeSlot(reservationDTO.timeSlot());
        
        // Set separate date and time fields (required by entity)
        if (reservationDTO.reservationDateTime() != null) {
            reservation.setReservationDate(reservationDTO.reservationDateTime().toLocalDate());
            reservation.setReservationTime(reservationDTO.reservationDateTime().toLocalTime());
        }
        
        // Set customer details
        reservation.setCustomerName(reservationDTO.customerName());
        reservation.setCustomerEmail(reservationDTO.customerEmail());
        reservation.setCustomerPhone(reservationDTO.customerPhone());
        reservation.setSpecialRequests(reservationDTO.specialRequests());

        // Assign table number if provided, otherwise assign first available table
        if (reservationDTO.tableNumber() != null) {
            reservation.setTableNumber(reservationDTO.tableNumber());
        } else {
            // Auto-assign first available table for this date and time
            String date = reservationDTO.reservationDateTime().toLocalDate().toString();
            String timeSlot = reservationDTO.reservationDateTime().toLocalTime().toString().substring(0, 5);
            List<Integer> availableTables = getAvailableTablesForSlot(date, timeSlot);
            
            if (!availableTables.isEmpty()) {
                reservation.setTableNumber(availableTables.get(0)); // Assign first available table
            } else {
                throw new RuntimeException("No tables available for the selected time slot");
            }
        }

        // Set the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        reservation.setUser(user);

        return reservation;
    }

    public List<String> getAvailableSlots(String date) {
        // Assume date is in YYYY-MM-DD format
        java.time.LocalDate localDate = java.time.LocalDate.parse(date);
        List<String> allSlots = List.of("10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00");
        
        // Get reservations for the specific date
        List<Reservation> reservations = reservationRepository.findAll().stream()
                .filter(r -> r.getReservationDateTime().toLocalDate().equals(localDate))
                .filter(r -> r.getStatus() == Reservation.ReservationStatus.CONFIRMED || 
                           r.getStatus() == Reservation.ReservationStatus.PENDING)
                .collect(Collectors.toList());
        
        // For each time slot, check if we have available tables
        return allSlots.stream()
                .filter(slot -> {
                    List<Integer> bookedTables = reservations.stream()
                            .filter(r -> r.getReservationDateTime().toLocalTime().toString().substring(0, 5).equals(slot))
                            .map(r -> r.getTableNumber())
                            .filter(tableNum -> tableNum != null)
                            .collect(Collectors.toList());
                    
                    // Assume we have tables 1-20 available
                    List<Integer> allTables = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20);
                    return bookedTables.size() < allTables.size(); // Return true if any tables are available
                })
                .collect(Collectors.toList());
    }
    
    public List<Integer> getAvailableTablesForSlot(String date, String timeSlot) {
        java.time.LocalDate localDate = java.time.LocalDate.parse(date);
        List<Integer> allTables = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20);
        
        // Get booked tables for this specific date and time slot
        List<Integer> bookedTables = reservationRepository.findAll().stream()
                .filter(r -> r.getReservationDateTime().toLocalDate().equals(localDate))
                .filter(r -> r.getReservationDateTime().toLocalTime().toString().substring(0, 5).equals(timeSlot))
                .filter(r -> r.getStatus() == Reservation.ReservationStatus.CONFIRMED || 
                           r.getStatus() == Reservation.ReservationStatus.PENDING)
                .map(r -> r.getTableNumber())
                .filter(tableNum -> tableNum != null)
                .collect(Collectors.toList());
        
        return allTables.stream()
                .filter(table -> !bookedTables.contains(table))
                .collect(Collectors.toList());
    }
    
    // Admin-specific methods
    public List<ReservationDTO> getReservationsByDateRange(LocalDate startDate, LocalDate endDate) {
        return reservationRepository.findAll().stream()
                .filter(r -> {
                    LocalDate resDate = r.getReservationDateTime().toLocalDate();
                    return !resDate.isBefore(startDate) && !resDate.isAfter(endDate);
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ReservationDTO> getReservationsByStatus(Reservation.ReservationStatus status) {
        return reservationRepository.findAll().stream()
                .filter(r -> r.getStatus() == status)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ReservationDTO confirmReservation(Long id, String adminUsername, Integer tableNumber, String notes) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        
        if (!reservation.canBeConfirmed()) {
            throw new IllegalStateException("Reservation cannot be confirmed in current status: " + reservation.getStatus());
        }
        
        reservation.confirm(adminUsername, tableNumber);
        if (notes != null) {
            reservation.setAdminNotes(notes);
        }
        
        reservation = reservationRepository.save(reservation);
        return convertToDTO(reservation);
    }
    
    public ReservationDTO markAsSeated(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        
        reservation.markAsSeated();
        reservation = reservationRepository.save(reservation);
        return convertToDTO(reservation);
    }
    
    public ReservationDTO completeReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        
        reservation.complete();
        reservation = reservationRepository.save(reservation);
        return convertToDTO(reservation);
    }
    
    public ReservationDTO markAsNoShow(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        
        reservation.markAsNoShow();
        reservation = reservationRepository.save(reservation);
        return convertToDTO(reservation);
    }
    
    public Map<String, Object> getReservationStatistics() {
        List<Reservation> allReservations = reservationRepository.findAll();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReservations", allReservations.size());
        stats.put("pendingReservations", allReservations.stream().filter(r -> r.getStatus() == Reservation.ReservationStatus.PENDING).count());
        stats.put("confirmedReservations", allReservations.stream().filter(r -> r.getStatus() == Reservation.ReservationStatus.CONFIRMED).count());
        stats.put("completedReservations", allReservations.stream().filter(r -> r.getStatus() == Reservation.ReservationStatus.COMPLETED).count());
        stats.put("cancelledReservations", allReservations.stream().filter(r -> r.getStatus() == Reservation.ReservationStatus.CANCELLED).count());
        stats.put("noShowReservations", allReservations.stream().filter(r -> r.getStatus() == Reservation.ReservationStatus.NO_SHOW).count());
        
        return stats;
    }
    
    public List<ReservationDTO> getTodaysReservations() {
        LocalDate today = LocalDate.now();
        return getReservationsByDateRange(today, today);
    }
    
    public List<ReservationDTO> getUpcomingReservations() {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(30); // Next 30 days
        return getReservationsByDateRange(today, futureDate);
    }
}
