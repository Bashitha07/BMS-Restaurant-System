package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.OrderDTO;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kitchen")
public class KitchenController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/orders/pending")
    public ResponseEntity<List<OrderDTO>> getPendingOrders() {
        List<OrderDTO> allOrders = orderService.getAllOrders();
        List<OrderDTO> pendingOrders = allOrders.stream()
            .filter(order -> "PENDING".equals(order.status()) ||
                           "CONFIRMED".equals(order.status()) ||
                           "PREPARING".equals(order.status()))
            .toList();
        return ResponseEntity.ok(pendingOrders);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String statusStr = request.get("status");
        Order.OrderStatus status = Order.OrderStatus.valueOf(statusStr.toUpperCase());
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}