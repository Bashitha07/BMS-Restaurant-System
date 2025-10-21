package com.bms.restaurant_system.controller.driver;

import com.bms.restaurant_system.dto.driver.DeliveryDriverDTO;
import com.bms.restaurant_system.service.delivery.DeliveryDriverService;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/delivery-drivers")
public class DeliveryDriverController {
    private static final Logger logger = LoggerFactory.getLogger(DeliveryDriverController.class);

    @Autowired
    private DeliveryDriverService deliveryDriverService;

    @GetMapping
    public ResponseEntity<List<DeliveryDriverDTO>> getAllDeliveryDrivers() {
        logger.info("Fetching all delivery drivers");
        return ResponseEntity.ok(deliveryDriverService.getAllDeliveryDrivers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDriverDTO> getDeliveryDriverById(@PathVariable Long id) {
        logger.info("Fetching delivery driver with id: {}", id);
        try {
            DeliveryDriverDTO driver = deliveryDriverService.getDeliveryDriverById(id);
            logger.info("Delivery driver found with id: {}", id);
            return ResponseEntity.ok(driver);
        } catch (ResourceNotFoundException e) {
            logger.warn("Delivery driver not found with id: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<DeliveryDriverDTO> createDeliveryDriver(@Valid @RequestBody DeliveryDriverDTO deliveryDriverDTO) {
        logger.info("Creating new delivery driver");
        DeliveryDriverDTO createdDriver = deliveryDriverService.createDeliveryDriver(deliveryDriverDTO);
        logger.info("Delivery driver created with id: {}", createdDriver.id());
        return ResponseEntity.ok(createdDriver);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliveryDriverDTO> updateDeliveryDriver(@PathVariable Long id, @Valid @RequestBody DeliveryDriverDTO deliveryDriverDTO) {
        logger.info("Updating delivery driver with id: {}", id);
        DeliveryDriverDTO updatedDriver = deliveryDriverService.updateDeliveryDriver(id, deliveryDriverDTO);
        logger.info("Delivery driver updated with id: {}", id);
        return ResponseEntity.ok(updatedDriver);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeliveryDriver(@PathVariable Long id) {
        logger.info("Deleting delivery driver with id: {}", id);
        deliveryDriverService.deleteDeliveryDriver(id);
        logger.info("Delivery driver deleted with id: {}", id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pending")
    public ResponseEntity<List<DeliveryDriverDTO>> getPendingDrivers() {
        logger.info("Fetching pending delivery drivers");
        return ResponseEntity.ok(deliveryDriverService.getPendingDrivers());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<DeliveryDriverDTO> approveDriver(@PathVariable Long id) {
        logger.info("Approving delivery driver with id: {}", id);
        try {
            DeliveryDriverDTO approvedDriver = deliveryDriverService.approveDriver(id);
            logger.info("Delivery driver approved with id: {}", id);
            return ResponseEntity.ok(approvedDriver);
        } catch (ResourceNotFoundException e) {
            logger.warn("Delivery driver not found with id: {}", id);
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            logger.warn("Cannot approve driver with id: {} - {}", id, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<DeliveryDriverDTO> rejectDriver(@PathVariable Long id) {
        logger.info("Rejecting delivery driver with id: {}", id);
        try {
            DeliveryDriverDTO rejectedDriver = deliveryDriverService.rejectDriver(id);
            logger.info("Delivery driver rejected with id: {}", id);
            return ResponseEntity.ok(rejectedDriver);
        } catch (ResourceNotFoundException e) {
            logger.warn("Delivery driver not found with id: {}", id);
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            logger.warn("Cannot reject driver with id: {} - {}", id, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
