package com.bms.restaurant_system.service.order;

import com.bms.restaurant_system.dto.OrderTrackingDTO;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.OrderTracking;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.OrderRepository;
import com.bms.restaurant_system.repository.OrderTrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderTrackingService {

    @Autowired
    private OrderTrackingRepository orderTrackingRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    /**
     * Get all tracking entries for a specific order
     */
    public List<OrderTrackingDTO> getOrderTrackingByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        return orderTrackingRepository.findByOrderOrderByTimestampDesc(order)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Add a tracking update to an order
     */
    public OrderTrackingDTO addOrderTracking(Long orderId, String status, String title, 
                                          String description, boolean completed, String actor) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        OrderTracking tracking = new OrderTracking();
        tracking.setOrder(order);
        tracking.setStatus(status);
        tracking.setTitle(title);
        tracking.setDescription(description);
        tracking.setCompleted(completed);
        tracking.setTimestamp(LocalDateTime.now());
        tracking.setActor(actor);
        
        tracking = orderTrackingRepository.save(tracking);
        return convertToDTO(tracking);
    }
    
    /**
     * Convert entity to DTO
     */
    private OrderTrackingDTO convertToDTO(OrderTracking tracking) {
        return new OrderTrackingDTO(
            tracking.getId(),
            tracking.getOrder().getId(),
            tracking.getStatus(),
            tracking.getTitle(),
            tracking.getDescription(),
            tracking.getTimestamp(),
            tracking.isCompleted(),
            tracking.getActor()
        );
    }
}