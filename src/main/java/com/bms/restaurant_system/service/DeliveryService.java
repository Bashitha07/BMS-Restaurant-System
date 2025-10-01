package com.bms.restaurant_system.service;

import com.bms.restaurant_system.dto.DeliveryDTO;
import com.bms.restaurant_system.entity.Delivery;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.DeliveryRepository;
import com.bms.restaurant_system.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {
    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @PersistenceContext
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
        Delivery delivery = convertToEntity(deliveryDTO);
        Order order = orderRepository.findById(deliveryDTO.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + deliveryDTO.orderId()));
        delivery.setOrder(order);
        order.setDelivery(delivery);
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
        existingDelivery.setStatus(deliveryDTO.status());
        existingDelivery.setAssignedDate(deliveryDTO.assignedDate());
        existingDelivery.setDeliveredDate(deliveryDTO.deliveredDate());
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
                delivery.getOrder() != null ? delivery.getOrder().getId() : null,
                delivery.getDeliveryAddress(),
                delivery.getDriverName(),
                delivery.getDriverPhone(),
                delivery.getDriverVehicle(),
                delivery.getStatus(),
                delivery.getAssignedDate(),
                delivery.getDeliveredDate()
        );
    }

    private Delivery convertToEntity(DeliveryDTO deliveryDTO) {
        Delivery delivery = new Delivery();
        delivery.setDeliveryAddress(deliveryDTO.deliveryAddress());
        delivery.setDriverName(deliveryDTO.driverName());
        delivery.setDriverPhone(deliveryDTO.driverPhone());
        delivery.setDriverVehicle(deliveryDTO.driverVehicle());
        delivery.setStatus(deliveryDTO.status());
        delivery.setAssignedDate(deliveryDTO.assignedDate());
        delivery.setDeliveredDate(deliveryDTO.deliveredDate());
        return delivery;
    }
}
