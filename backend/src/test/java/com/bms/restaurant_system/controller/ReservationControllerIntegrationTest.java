package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.ReservationDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
class ReservationControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void contextLoads() {
        // This test verifies that the Spring context loads successfully
    }

    @Test
    @WithMockUser(username = "customer", roles = {"USER"})
    void getAllReservations_ShouldReturnReservationsList() throws Exception {
        mockMvc.perform(get("/api/reservations"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(username = "customer", roles = {"USER"})
    void getReservationById_WithValidId_ShouldReturnReservation() throws Exception {
        mockMvc.perform(get("/api/reservations/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(username = "customer", roles = {"USER"})
    void getReservationById_WithInvalidId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/reservations/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createReservation_WithValidData_ShouldReturnCreatedReservation() throws Exception {
        LocalDateTime reservationDateTime = LocalDateTime.now().plusDays(1);
        ReservationDTO reservationDTO = new ReservationDTO(
            null, // id
            LocalDate.from(reservationDateTime), // reservationDate
            LocalTime.from(reservationDateTime), // reservationTime
            reservationDateTime, // reservationDateTime
            "7:00 PM", // timeSlot
            4, // numberOfPeople
            "PENDING", // status
            "John Doe", // customerName
            "john@example.com", // customerEmail
            "123-456-7890", // customerPhone
            "Birthday celebration", // specialRequests
            null, // tableNumber
            null, // createdAt
            null, // updatedAt
            null, // confirmedAt
            null, // cancelledAt
            null, // cancellationReason
            false, // reminderSent
            1L, // userId
            "John Doe" // userName
        );

        mockMvc.perform(post("/api/reservations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reservationDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.numberOfPeople").value(4))
                .andExpect(jsonPath("$.specialRequests").value("Birthday celebration"));
    }

    @Test
    @WithMockUser(username = "customer", roles = {"USER"})
    void updateReservation_WithValidData_ShouldReturnUpdatedReservation() throws Exception {
        // First create a reservation
        LocalDateTime reservationDateTime = LocalDateTime.now().plusDays(1);
        ReservationDTO reservationDTO = new ReservationDTO(
            null, // id
            LocalDate.from(reservationDateTime), // reservationDate
            LocalTime.from(reservationDateTime), // reservationTime
            reservationDateTime, // reservationDateTime
            "7:00 PM", // timeSlot
            4, // numberOfPeople
            "PENDING", // status
            "John Doe", // customerName
            "john@example.com", // customerEmail
            "123-456-7890", // customerPhone
            "Birthday celebration", // specialRequests
            null, // tableNumber
            null, // createdAt
            null, // updatedAt
            null, // confirmedAt
            null, // cancelledAt
            null, // cancellationReason
            false, // reminderSent
            1L, // userId
            "John Doe" // userName
        );

        String response = mockMvc.perform(post("/api/reservations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reservationDTO)))
                .andReturn().getResponse().getContentAsString();

        ReservationDTO created = objectMapper.readValue(response, ReservationDTO.class);

        // Update the reservation
        ReservationDTO updateDTO = new ReservationDTO(
            created.id(),
            created.reservationDate(),
            created.reservationTime(),
            created.reservationDateTime(),
            created.timeSlot(),
            6, // updated numberOfPeople
            "CONFIRMED", // updated status
            created.customerName(),
            created.customerEmail(),
            created.customerPhone(),
            "Updated celebration", // updated specialRequests
            created.tableNumber(),
            created.createdAt(),
            created.updatedAt(),
            created.confirmedAt(),
            created.cancelledAt(),
            created.cancellationReason(),
            created.reminderSent(),
            created.userId(),
            created.userName()
        );

        mockMvc.perform(put("/api/reservations/" + created.id())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numberOfPeople").value(6))
                .andExpect(jsonPath("$.specialRequests").value("Updated celebration"))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void deleteReservation_WithValidId_ShouldReturnSuccess() throws Exception {
        // First create a reservation
        LocalDateTime reservationDateTime = LocalDateTime.now().plusDays(1);
        ReservationDTO reservationDTO = new ReservationDTO(
            null, // id
            LocalDate.from(reservationDateTime), // reservationDate
            LocalTime.from(reservationDateTime), // reservationTime
            reservationDateTime, // reservationDateTime
            "7:00 PM", // timeSlot
            4, // numberOfPeople
            "PENDING", // status
            "John Doe", // customerName
            "john@example.com", // customerEmail
            "123-456-7890", // customerPhone
            "Birthday celebration", // specialRequests
            null, // tableNumber
            null, // createdAt
            null, // updatedAt
            null, // confirmedAt
            null, // cancelledAt
            null, // cancellationReason
            false, // reminderSent
            1L, // userId
            "John Doe" // userName
        );

        String response = mockMvc.perform(post("/api/reservations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reservationDTO)))
                .andReturn().getResponse().getContentAsString();

        ReservationDTO created = objectMapper.readValue(response, ReservationDTO.class);

        // Delete the reservation - returns 204 NO_CONTENT
        mockMvc.perform(delete("/api/reservations/" + created.id()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "customer", roles = {"USER"})
    void getReservationsByUser_ShouldReturnUserReservations() throws Exception {
        mockMvc.perform(get("/api/reservations/user/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(username = "customer", roles = {"USER"})
    void getReservationsByDateRange_ShouldReturnReservationsInRange() throws Exception {
        mockMvc.perform(get("/api/reservations/date-range")
                .param("startDate", "2025-01-01T00:00:00")
                .param("endDate", "2025-12-31T23:59:59"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
