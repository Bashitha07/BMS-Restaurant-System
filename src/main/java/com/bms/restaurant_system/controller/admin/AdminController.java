package com.bms.restaurant_system.controller.admin;

import com.bms.restaurant_system.dto.OrderDTO;
import com.bms.restaurant_system.dto.driver.DeliveryDTO;
import com.bms.restaurant_system.entity.Menu;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.Reservation;
import com.bms.restaurant_system.service.order.OrderService;
import com.bms.restaurant_system.service.delivery.DeliveryService;
import com.bms.restaurant_system.service.database.DatabaseRetrievalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private DeliveryService deliveryService;
    @Autowired
    private DatabaseRetrievalService databaseRetrievalService;

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
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

    // Note: GET /users endpoint moved to AdminUserController to avoid duplicate mapping

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

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String statusStr = request.get("status");
        Order.OrderStatus status = Order.OrderStatus.valueOf(statusStr.toUpperCase());
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // Note: User management endpoints have been moved to AdminUserController
    // to avoid duplicate mappings and provide better separation of concerns
}
