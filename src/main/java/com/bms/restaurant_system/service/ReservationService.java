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

import java.util.List;
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
        existingReservation.setStatus(reservationDTO.status());
        existingReservation.setNumberOfPeople(reservationDTO.numberOfPeople());
        existingReservation = reservationRepository.save(existingReservation);
        return convertToDTO(existingReservation);
    }

    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        reservationRepository.delete(reservation);
    }

    public ReservationDTO cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        reservation.setStatus("CANCELLED");
        reservation = reservationRepository.save(reservation);
        return convertToDTO(reservation);
    }

    public ReservationDTO updateReservationStatus(Long id, String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        reservation.setStatus(status);
        reservation = reservationRepository.save(reservation);
        return convertToDTO(reservation);
    }

    private ReservationDTO convertToDTO(Reservation reservation) {
        return new ReservationDTO(reservation.getId(), reservation.getStatus(), reservation.getNumberOfPeople(), reservation.getReservationDateTime(), reservation.getTimeSlot());
    }

    private Reservation convertToEntity(ReservationDTO reservationDTO) {
        Reservation reservation = new Reservation();
        reservation.setStatus(reservationDTO.status());
        reservation.setNumberOfPeople(reservationDTO.numberOfPeople());
        reservation.setReservationDateTime(reservationDTO.reservationDateTime());
        reservation.setTimeSlot(reservationDTO.timeSlot());

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
        List<Reservation> reservations = reservationRepository.findAll();
        List<String> bookedSlots = reservations.stream()
                .filter(r -> r.getReservationDateTime().toLocalDate().equals(localDate))
                .map(r -> r.getReservationDateTime().toLocalTime().toString().substring(0, 5))
                .collect(Collectors.toList());
        return allSlots.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .collect(Collectors.toList());
    }
}
