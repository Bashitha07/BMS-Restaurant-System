package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.DriverLoginRequest;
import com.bms.restaurant_system.dto.DriverLoginResponse;
import com.bms.restaurant_system.service.DeliveryDriverService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/driver/auth")
@CrossOrigin(origins = "*")
public class DriverAuthController {
    private static final Logger logger = LoggerFactory.getLogger(DriverAuthController.class);

    @Autowired
    private DeliveryDriverService deliveryDriverService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody DriverLoginRequest loginRequest) {
        logger.info("Driver login attempt for username: {}", loginRequest.getUsername());

        try {
            DriverLoginResponse response = deliveryDriverService.authenticateDriver(loginRequest);
            logger.info("Driver login successful for username: {}", loginRequest.getUsername());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            logger.warn("Driver login failed for username: {}", loginRequest.getUsername());
            return ResponseEntity.status(401).body("Invalid username or password");
        } catch (Exception e) {
            logger.error("Driver login error for username: {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout/{driverId}")
    public ResponseEntity<?> logout(@PathVariable Long driverId) {
        logger.info("Driver logout attempt for driver ID: {}", driverId);

        try {
            deliveryDriverService.logoutDriver(driverId);
            logger.info("Driver logout successful for driver ID: {}", driverId);
            return ResponseEntity.ok("Logout successful");
        } catch (Exception e) {
            logger.error("Driver logout error for driver ID: {}", driverId, e);
            return ResponseEntity.status(500).body("Logout failed: " + e.getMessage());
        }
    }

    @GetMapping("/profile/{driverId}")
    public ResponseEntity<?> getDriverProfile(@PathVariable Long driverId) {
        logger.info("Fetching driver profile for ID: {}", driverId);

        try {
            var driver = deliveryDriverService.getDeliveryDriverById(driverId);
            logger.info("Driver profile fetched for ID: {}", driverId);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            logger.error("Failed to fetch driver profile for ID: {}", driverId, e);
            return ResponseEntity.status(404).body("Driver not found");
        }
    }
}