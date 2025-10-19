package com.bms.restaurant_system.service;

import com.bms.restaurant_system.dto.DeliveryDTO;
import com.bms.restaurant_system.entity.Delivery;
import com.bms.restaurant_system.entity.Driver;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.DeliveryRepository;
import com.bms.restaurant_system.repository.DriverRepository;
import com.bms.restaurant_system.repository.OrderRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {
    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private EntityManager em;

    public List<DeliveryDTO> getAllDeliveries() {
        return deliveryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DeliveryDTO getDeliveryById(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));
        return convertToDTO(delivery);
    }

    public DeliveryDTO createDelivery(DeliveryDTO deliveryDTO) {
        Order order = orderRepository.findById(deliveryDTO.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + deliveryDTO.orderId()));
        
        Delivery delivery = convertToEntity(deliveryDTO);
        delivery.setOrder(order);
        delivery.setStatus(Delivery.DeliveryStatus.PENDING);
        delivery.setAssignedDate(LocalDateTime.now());
        
        delivery = deliveryRepository.save(delivery);
        return convertToDTO(delivery);
    }

    public DeliveryDTO updateDelivery(Long id, DeliveryDTO deliveryDTO) {
        Delivery existingDelivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));
        
        existingDelivery.setDeliveryAddress(deliveryDTO.deliveryAddress());
        existingDelivery.setDriverName(deliveryDTO.driverName());
        existingDelivery.setDriverPhone(deliveryDTO.driverPhone());
        existingDelivery.setDriverVehicle(deliveryDTO.driverVehicle());
        existingDelivery.setStatus(Delivery.DeliveryStatus.valueOf(deliveryDTO.status().toUpperCase()));
        
        existingDelivery = deliveryRepository.save(existingDelivery);
        return convertToDTO(existingDelivery);
    }

    @Transactional
    public void deleteDelivery(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));
        
        Order order = delivery.getOrder();
        if (order != null) {
            order.setDelivery(null);
            orderRepository.save(order);
            em.flush();
        }
        deliveryRepository.delete(delivery);
    }

    private DeliveryDTO convertToDTO(Delivery delivery) {
        return new DeliveryDTO(
                delivery.getId(),
                delivery.getOrder().getId(),
                delivery.getDriver() != null ? delivery.getDriver().getId() : null,
                delivery.getDriverName(),
                delivery.getDriverPhone(),
                delivery.getDriverVehicle(),
                delivery.getDeliveryAddress(),
                delivery.getDeliveryPhone(),
                delivery.getDeliveryInstructions(),
                delivery.getStatus().name(),
                delivery.getDeliveryFee(),
                delivery.getEstimatedDeliveryTime(),
                delivery.getActualDeliveryTime(),
                delivery.getPickupTime(),
                delivery.getAssignedDate(),
                delivery.getDeliveredDate(),
                delivery.getCurrentLatitude(),
                delivery.getCurrentLongitude(),
                delivery.getDeliveryLatitude(),
                delivery.getDeliveryLongitude(),
                delivery.getDistanceKm(),
                delivery.getCustomerRating(),
                delivery.getCustomerFeedback(),
                delivery.getDeliveryNotes(),
                delivery.getProofOfDelivery(),
                delivery.getCreatedAt(),
                delivery.getUpdatedAt()
        );
    }

    private Delivery convertToEntity(DeliveryDTO deliveryDTO) {
        Delivery delivery = new Delivery();
        delivery.setDeliveryAddress(deliveryDTO.deliveryAddress());
        delivery.setDriverName(deliveryDTO.driverName());
        delivery.setDriverPhone(deliveryDTO.driverPhone());
        delivery.setDriverVehicle(deliveryDTO.driverVehicle());
        delivery.setDeliveryPhone(deliveryDTO.deliveryPhone());
        delivery.setDeliveryInstructions(deliveryDTO.deliveryInstructions());
        delivery.setDeliveryFee(deliveryDTO.deliveryFee());
        delivery.setEstimatedDeliveryTime(deliveryDTO.estimatedDeliveryTime());
        return delivery;
    }
    
    // Driver-specific delivery methods
    public List<DeliveryDTO> getAvailableDeliveries() {
        return deliveryRepository.findAll().stream()
                .filter(delivery -> delivery.getStatus() == Delivery.DeliveryStatus.PENDING)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<DeliveryDTO> getDeliveriesByDriverId(Long driverId) {
        return deliveryRepository.findAll().stream()
                .filter(delivery -> delivery.getDriver() != null && delivery.getDriver().getId().equals(driverId))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public DeliveryDTO assignDriverToDelivery(Long deliveryId, Long driverId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + deliveryId));
                
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        
        if (driver.getStatus() != Driver.DriverStatus.AVAILABLE) {
            throw new IllegalStateException("Driver is not available for delivery");
        }
        
        delivery.assignDriver(driver);
        delivery = deliveryRepository.save(delivery);
        return convertToDTO(delivery);
    }
    
    public DeliveryDTO updateDeliveryStatus(Long deliveryId, Delivery.DeliveryStatus status) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + deliveryId));
        
        delivery.setStatus(status);
        
        // Update timestamps based on status
        switch (status) {
            case PENDING -> { /* No special action needed */ }
            case ASSIGNED -> { /* Driver assigned, no timestamp change */ }
            case PICKED_UP -> delivery.markAsPickedUp();
            case IN_TRANSIT -> delivery.markInTransit();
            case ARRIVED -> delivery.markAsArrived();
            case DELIVERED -> delivery.markAsDelivered();
            case CANCELLED -> { /* Handle cancellation */ }
            case FAILED -> { /* Handle failed delivery */ }
            case RETURNED -> { /* Handle return */ }
        }
        
        delivery = deliveryRepository.save(delivery);
        return convertToDTO(delivery);
    }
    
    public DeliveryDTO completeDelivery(Long deliveryId, String notes, String proofOfDelivery) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + deliveryId));
        
        delivery.markAsDelivered();
        if (notes != null) {
            delivery.setDeliveryNotes(notes);
        }
        if (proofOfDelivery != null) {
            delivery.setProofOfDelivery(proofOfDelivery);
        }
        
        delivery = deliveryRepository.save(delivery);
        
        // Update driver's delivery count
        if (delivery.getDriver() != null) {
            Driver driver = delivery.getDriver();
            driver.setTotalDeliveries(driver.getTotalDeliveries() + 1);
            driver.setStatus(Driver.DriverStatus.AVAILABLE); // Set back to available after delivery
            driverRepository.save(driver);
        }
        
        return convertToDTO(delivery);
    }
}
