package com.bms.restaurant_system.controller.user;

import com.bms.restaurant_system.dto.AssignDriverRequest;
import com.bms.restaurant_system.dto.OrderCreateDTO;
import com.bms.restaurant_system.dto.OrderDTO;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.service.order.OrderService;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        logger.info("Fetching all orders");
        try {
            List<OrderDTO> orders = orderService.getAllOrders();
            logger.info("Successfully retrieved {} orders", orders.size());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Error fetching all orders", e);
            throw e; // Re-throw to let GlobalExceptionHandler handle it
        }
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
    
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO>> getMyOrders() {
        logger.info("Fetching orders for current user");
        try {
            List<OrderDTO> orders = orderService.getOrdersForCurrentUser();
            logger.info("Found {} orders for current user", orders.size());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Error fetching user orders", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/admin/grouped")
    public ResponseEntity<Map<String, List<OrderDTO>>> getOrdersGroupedForAdmin() {
        logger.info("Fetching grouped orders for admin");
        try {
            Map<String, List<OrderDTO>> groupedOrders = orderService.getOrdersGroupedForAdmin();
            logger.info("Successfully grouped orders - Not Delivered: {}, Recently Delivered: {}, Others: {}", 
                       groupedOrders.get("notDelivered").size(),
                       groupedOrders.get("recentlyDelivered").size(),
                       groupedOrders.get("others").size());
            return ResponseEntity.ok(groupedOrders);
        } catch (Exception e) {
            logger.error("Error fetching grouped orders for admin", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/admin/drivers")
    public ResponseEntity<List<Map<String, Object>>> getAvailableDrivers() {
        logger.info("Fetching available drivers");
        try {
            List<Map<String, Object>> drivers = orderService.getAvailableDrivers();
            logger.info("Found {} available drivers", drivers.size());
            return ResponseEntity.ok(drivers);
        } catch (Exception e) {
            logger.error("Error fetching available drivers", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        logger.info("Updating status for order {} to {}", id, statusUpdate.get("status"));
        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(statusUpdate.get("status"));
            OrderDTO updatedOrder = orderService.updateOrderStatus(id, newStatus);
            logger.info("Successfully updated order {} status", id);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid status value: {}", statusUpdate.get("status"));
            return ResponseEntity.badRequest().build();
        } catch (ResourceNotFoundException e) {
            logger.warn("Order not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating order status", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/assign-driver")
    public ResponseEntity<OrderDTO> assignDriver(
            @PathVariable Long id, 
            @RequestBody AssignDriverRequest request) {
        logger.info("Assigning driver {} to order {}", request.getDriverId(), id);
        try {
            OrderDTO updatedOrder = orderService.assignDriver(id, request.getDriverId());
            logger.info("Successfully assigned driver to order {}", id);
            return ResponseEntity.ok(updatedOrder);
        } catch (ResourceNotFoundException e) {
            logger.warn("Order or driver not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid driver assignment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error assigning driver to order", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
