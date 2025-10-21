package com.bms.restaurant_system.controller.admin;

import com.bms.restaurant_system.dto.driver.DeliveryDriverDTO;
import com.bms.restaurant_system.dto.driver.RegisterDriverDTO;
import com.bms.restaurant_system.service.delivery.DeliveryDriverService;
import com.bms.restaurant_system.entity.DeliveryDriver;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/drivers")
public class AdminDriverController {
    private static final Logger logger = LoggerFactory.getLogger(AdminDriverController.class);

    @Autowired
    private DeliveryDriverService deliveryDriverService;

    // Get all drivers
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeliveryDriverDTO>> getAllDrivers() {
        logger.info("Admin fetching all drivers");
        return ResponseEntity.ok(deliveryDriverService.getAllDeliveryDrivers());
    }

    // Get driver by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDriverById(@PathVariable Long id) {
        logger.info("Admin fetching driver with id: {}", id);
        try {
            DeliveryDriverDTO driver = deliveryDriverService.getDeliveryDriverById(id);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            logger.error("Error fetching driver {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Driver not found");
        }
    }

    // Register new driver
    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerDriver(@Valid @RequestBody RegisterDriverDTO registerDriverDTO) {
        logger.info("Admin registering new driver: {}", registerDriverDTO.username());
        try {
            DeliveryDriverDTO driver = deliveryDriverService.registerDriver(registerDriverDTO);
            logger.info("Driver registered successfully: {}", driver.username());
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            logger.error("Error registering driver {}: {}", registerDriverDTO.username(), e.getMessage());
            return ResponseEntity.status(400).body("Failed to register driver: " + e.getMessage());
        }
    }

    // Update driver information
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDriver(@PathVariable Long id, @RequestBody DeliveryDriverDTO driverDTO) {
        logger.info("Admin updating driver: {}", id);
        try {
            DeliveryDriverDTO updatedDriver = deliveryDriverService.updateDeliveryDriver(id, driverDTO);
            logger.info("Driver updated successfully: {}", id);
            return ResponseEntity.ok(updatedDriver);
        } catch (Exception e) {
            logger.error("Error updating driver {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to update driver: " + e.getMessage());
        }
    }

    // Activate/Deactivate driver
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDriverStatus(@PathVariable Long id, @RequestBody Map<String, Object> statusUpdate) {
        logger.info("Admin updating driver {} status", id);
        try {
            Boolean isActive = (Boolean) statusUpdate.get("isActive");
            String status = (String) statusUpdate.get("status");
            
            deliveryDriverService.updateDriverActiveStatus(id, isActive);
            if (status != null) {
                DeliveryDriver.DriverStatus driverStatus = DeliveryDriver.DriverStatus.valueOf(status.toUpperCase());
                deliveryDriverService.updateDriverStatus(id, driverStatus);
            }
            
            logger.info("Driver {} status updated successfully", id);
            return ResponseEntity.ok("Driver status updated successfully");
        } catch (Exception e) {
            logger.error("Error updating driver {} status: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to update driver status: " + e.getMessage());
        }
    }

    // Delete driver
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDriver(@PathVariable Long id) {
        logger.info("Admin deleting driver: {}", id);
        try {
            deliveryDriverService.deleteDeliveryDriver(id);
            logger.info("Driver deleted successfully: {}", id);
            return ResponseEntity.ok("Driver deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting driver {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to delete driver: " + e.getMessage());
        }
    }

    // Get available drivers
    @GetMapping("/available")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeliveryDriverDTO>> getAvailableDrivers() {
        logger.info("Admin fetching available drivers");
        return ResponseEntity.ok(deliveryDriverService.getAvailableDrivers());
    }

    // Get driver performance stats
    @GetMapping("/{id}/performance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDriverPerformance(@PathVariable Long id) {
        logger.info("Admin fetching performance stats for driver: {}", id);
        try {
            Map<String, Object> performance = deliveryDriverService.getDriverPerformanceStats(id);
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            logger.error("Error fetching performance for driver {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Driver not found");
        }
    }

    // Update driver rating
    @PostMapping("/{id}/rating")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDriverRating(@PathVariable Long id, @RequestBody Map<String, BigDecimal> ratingData) {
        logger.info("Admin updating rating for driver: {}", id);
        try {
            BigDecimal rating = ratingData.get("rating");
            deliveryDriverService.updateDriverRating(id, rating);
            logger.info("Driver {} rating updated successfully", id);
            return ResponseEntity.ok("Driver rating updated successfully");
        } catch (Exception e) {
            logger.error("Error updating rating for driver {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to update driver rating: " + e.getMessage());
        }
    }

    // Get driver statistics summary
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDriverStatistics() {
        logger.info("Admin fetching driver statistics");
        try {
            Map<String, Object> stats = deliveryDriverService.getDriverStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching driver statistics: {}", e.getMessage());
            return ResponseEntity.status(500).body("Failed to fetch driver statistics");
        }
    }
}