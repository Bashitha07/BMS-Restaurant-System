package com.bms.restaurant_system.controller.user;

import com.bms.restaurant_system.dto.OrderTrackingDTO;
import com.bms.restaurant_system.service.order.OrderTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders/tracking")
public class OrderTrackingController {

    @Autowired
    private OrderTrackingService orderTrackingService;
    
    @GetMapping("/{orderId}")
    public ResponseEntity<List<OrderTrackingDTO>> getOrderTracking(@PathVariable Long orderId) {
        List<OrderTrackingDTO> tracking = orderTrackingService.getOrderTrackingByOrderId(orderId);
        return ResponseEntity.ok(tracking);
    }
    
    @PostMapping("/{orderId}")
    public ResponseEntity<OrderTrackingDTO> addOrderTracking(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> requestBody) {
        
        String status = (String) requestBody.get("status");
        String title = (String) requestBody.get("title");
        String description = (String) requestBody.get("description");
        Boolean completed = (Boolean) requestBody.get("completed");
        String actor = (String) requestBody.get("actor");
        
        OrderTrackingDTO tracking = orderTrackingService.addOrderTracking(
            orderId, status, title, description, completed, actor);
        
        return ResponseEntity.ok(tracking);
    }
}