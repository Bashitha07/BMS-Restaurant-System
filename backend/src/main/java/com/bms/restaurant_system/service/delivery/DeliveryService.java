package com.bms.restaurant_system.service.delivery;

import com.bms.restaurant_system.dto.driver.DeliveryDTO;
import com.bms.restaurant_system.entity.Delivery;
import com.bms.restaurant_system.entity.DeliveryDriver;
import com.bms.restaurant_system.entity.Driver;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.PaymentMethod;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.DeliveryRepository;
import com.bms.restaurant_system.repository.DeliveryDriverRepository;
import com.bms.restaurant_system.repository.DriverRepository;
import com.bms.restaurant_system.repository.OrderRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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
    private DeliveryDriverRepository deliveryDriverRepository;

    @Autowired
    private EntityManager em;    public List<DeliveryDTO> getAllDeliveries() {
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
        Order order = delivery.getOrder();
        return new DeliveryDTO(
                delivery.getId(),
                order.getId(),
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
                order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null,
                order.getTotalAmount(),
                delivery.getCashCollected(),
                delivery.getCashCollectionConfirmed(),
                delivery.getCashCollectionTime(),
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
        
        if (!driver.getAvailable()) {
            throw new IllegalStateException("Driver is not available for delivery");
        }
        
        delivery.assignDriver(driver);
        delivery = deliveryRepository.save(delivery);
        
        // Create junction table entry
        DeliveryDriver dd = new DeliveryDriver();
        dd.setDelivery(delivery);
        dd.setDriver(driver);
        dd.setAssignedAt(LocalDateTime.now());
        deliveryDriverRepository.save(dd);
        
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
            case PICKED_UP -> {
                delivery.markAsPickedUp();
                // Update order status to PICKED_UP or IN_TRANSIT
                updateOrderStatus(delivery.getOrder(), Order.OrderStatus.OUT_FOR_DELIVERY);
            }
            case IN_TRANSIT -> {
                delivery.markInTransit();
                updateOrderStatus(delivery.getOrder(), Order.OrderStatus.OUT_FOR_DELIVERY);
            }
            case ARRIVED -> {
                delivery.markAsArrived();
                updateOrderStatus(delivery.getOrder(), Order.OrderStatus.OUT_FOR_DELIVERY);
            }
            case DELIVERED -> {
                delivery.markAsDelivered();
                updateOrderStatus(delivery.getOrder(), Order.OrderStatus.DELIVERED);
            }
            case CANCELLED -> {
                updateOrderStatus(delivery.getOrder(), Order.OrderStatus.CANCELLED);
            }
            case FAILED -> { /* Handle failed delivery */ }
            case RETURNED -> { /* Handle return */ }
        }
        
        delivery = deliveryRepository.save(delivery);
        return convertToDTO(delivery);
    }
    
    private void updateOrderStatus(Order order, Order.OrderStatus status) {
        if (order != null) {
            order.setStatus(status);
            orderRepository.save(order);
        }
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
        
        // Update the order status to DELIVERED
        Order order = delivery.getOrder();
        if (order != null) {
            order.setStatus(Order.OrderStatus.DELIVERED);
            orderRepository.save(order);
        }
        
        // Update driver's delivery count and set available
        if (delivery.getDriver() != null) {
            Driver driver = delivery.getDriver();
            driver.setTotalDeliveries(driver.getTotalDeliveries() + 1);
            driver.setAvailable(true); // Set back to available after delivery
            driverRepository.save(driver);
        }
        
        return convertToDTO(delivery);
    }

    // Admin: Unassign driver from delivery
    public DeliveryDTO unassignDriverFromDelivery(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + deliveryId));
        
        // Remove driver assignment
        delivery.setDriver(null);
        delivery.setDriverName(null);
        delivery.setDriverPhone(null);
        delivery.setDriverVehicle(null);
        delivery.setStatus(Delivery.DeliveryStatus.PENDING);
        delivery.setAssignedDate(null);
        
        delivery = deliveryRepository.save(delivery);
        
        // Remove junction table entry
        deliveryDriverRepository.findByDeliveryId(deliveryId).forEach(dd -> 
            deliveryDriverRepository.delete(dd)
        );
        
        // Update order status back to CONFIRMED
        updateOrderStatus(delivery.getOrder(), Order.OrderStatus.CONFIRMED);
        
        return convertToDTO(delivery);
    }

    // Driver: Confirm cash collection for COD orders
    public DeliveryDTO confirmCashCollection(Long deliveryId, BigDecimal amount) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + deliveryId));
        
        Order order = delivery.getOrder();
        
        // Verify this is a cash on delivery order
        if (order.getPaymentMethod() != PaymentMethod.CASH_ON_DELIVERY) {
            throw new IllegalStateException("This order is not a cash on delivery order");
        }
        
        // Verify delivery is completed or in final stages
        if (delivery.getStatus() != Delivery.DeliveryStatus.DELIVERED 
            && delivery.getStatus() != Delivery.DeliveryStatus.ARRIVED) {
            throw new IllegalStateException("Cannot confirm cash collection before delivery is completed or arrived");
        }
        
        delivery.setCashCollected(amount);
        delivery.setCashCollectionConfirmed(true);
        delivery.setCashCollectionTime(LocalDateTime.now());
        
        delivery = deliveryRepository.save(delivery);
        
        // Update order payment status to PAID
        if (order.getPaymentStatus() != null) {
            order.setPaymentStatus(Order.PaymentStatus.PAID);
            orderRepository.save(order);
        }
        
        return convertToDTO(delivery);
    }
}