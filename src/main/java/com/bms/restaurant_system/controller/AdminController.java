package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.OrderDTO;
import com.bms.restaurant_system.dto.ReservationDTO;
import com.bms.restaurant_system.dto.DeliveryDTO;
import com.bms.restaurant_system.dto.UserDTO;
import com.bms.restaurant_system.dto.UserResponseDTO;
import com.bms.restaurant_system.entity.Menu;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.Reservation;
import com.bms.restaurant_system.service.OrderService;
import com.bms.restaurant_system.service.ReservationService;
import com.bms.restaurant_system.service.DeliveryService;
import com.bms.restaurant_system.service.DatabaseRetrievalService;
import com.bms.restaurant_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private ReservationService reservationService;
    @Autowired
    private DeliveryService deliveryService;
    @Autowired
    private DatabaseRetrievalService databaseRetrievalService;
    @Autowired
    private UserService userService;

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryDTO>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    // Database retrieval endpoints for admin users only
    @GetMapping("/database/menus")
    public ResponseEntity<List<Menu>> getAllMenus() {
        return ResponseEntity.ok(databaseRetrievalService.getAllMenus());
    }

    // Removed duplicate getAllUsers method to fix duplicate method issue

    @GetMapping("/database/orders")
    public ResponseEntity<List<Order>> getAllOrdersFromDB() {
        return ResponseEntity.ok(databaseRetrievalService.getAllOrders());
    }

    @GetMapping("/database/reservations")
    public ResponseEntity<List<Reservation>> getAllReservationsFromDB() {
        return ResponseEntity.ok(databaseRetrievalService.getAllReservations());
    }

    @GetMapping("/database/menus/category/{category}")
    public ResponseEntity<List<Menu>> getMenusByCategory(@PathVariable String category) {
        return ResponseEntity.ok(databaseRetrievalService.getMenusByCategory(category));
    }

    @GetMapping("/database/menus/available")
    public ResponseEntity<List<Menu>> getAvailableMenus() {
        return ResponseEntity.ok(databaseRetrievalService.getAvailableMenus());
    }

    @GetMapping("/database/menus/pagination")
    public ResponseEntity<List<Menu>> getMenusWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(databaseRetrievalService.getMenusWithPagination(page, size));
    }

    @GetMapping("/database/users/pagination")
    public ResponseEntity<List<User>> getUsersWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(databaseRetrievalService.getUsersWithPagination(page, size));
    }

    // Admin reservation management endpoints
    @PutMapping("/reservations/{id}/status")
    public ResponseEntity<ReservationDTO> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        ReservationDTO updatedReservation = reservationService.updateReservationStatus(id, status);
        return ResponseEntity.ok(updatedReservation);
    }

    @DeleteMapping("/reservations/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.noContent().build();
    }

    // Admin delivery management endpoints
    @PostMapping("/deliveries")
    public ResponseEntity<DeliveryDTO> createDelivery(@RequestBody DeliveryDTO deliveryDTO) {
        DeliveryDTO createdDelivery = deliveryService.createDelivery(deliveryDTO);
        return ResponseEntity.ok(createdDelivery);
    }

    @PutMapping("/deliveries/{id}")
    public ResponseEntity<DeliveryDTO> updateDelivery(@PathVariable Long id, @RequestBody DeliveryDTO deliveryDTO) {
        DeliveryDTO updatedDelivery = deliveryService.updateDelivery(id, deliveryDTO);
        return ResponseEntity.ok(updatedDelivery);
    }

    @DeleteMapping("/deliveries/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }

    // Admin user management endpoints
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponseDTO> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role) {
        UserDTO userDTO = new UserDTO(id, null, null, null, role, null);
        UserResponseDTO updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Additional admin functions
}
