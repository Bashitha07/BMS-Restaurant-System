package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.OrderCreateDTO;
import com.bms.restaurant_system.dto.OrderDTO;
import com.bms.restaurant_system.service.OrderService;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        logger.info("Fetching all orders");
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        logger.info("Fetching order with id: {}", id);
        try {
            OrderDTO order = orderService.getOrderById(id);
            logger.info("Order found with id: {}", id);
            return ResponseEntity.ok(order);
        } catch (ResourceNotFoundException e) {
            logger.warn("Order not found with id: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderCreateDTO orderCreateDTO) {
        logger.info("Creating new order");
        OrderDTO createdOrder = orderService.createOrder(orderCreateDTO);
        logger.info("Order created with id: {}", createdOrder.id());
        return ResponseEntity.ok(createdOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderDTO orderDTO) {
        logger.info("Updating order with id: {}", id);
        OrderDTO updatedOrder = orderService.updateOrder(id, orderDTO);
        logger.info("Order updated with id: {}", id);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        logger.info("Deleting order with id: {}", id);
        orderService.deleteOrder(id);
        logger.info("Order deleted with id: {}", id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<?> getInvoice(@PathVariable Long id) {
        logger.info("Generating invoice for order with id: {}", id);
        try {
            var invoice = orderService.generateInvoice(id);
            logger.info("Invoice generated for order with id: {}", id);
            return ResponseEntity.ok(invoice);
        } catch (ResourceNotFoundException e) {
            logger.warn("Order not found with id: {}", id);
            return ResponseEntity.notFound().build();
        }
    }
}
