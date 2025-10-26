package com.bms.restaurant_system.service.delivery;

import com.bms.restaurant_system.entity.Driver;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.DriverRepository;
import com.bms.restaurant_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {
    
    @Autowired
    private DriverRepository driverRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all drivers
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }
    
    // Get driver by ID
    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
    }
    
    // Get available drivers
    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByAvailableTrueOrderByRatingDesc();
    }
    
    // Create a new driver linked to a user
    public Driver createDriver(Driver driver, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        driver.setUser(user);
        return driverRepository.save(driver);
    }
    
    // Update driver
    public Driver updateDriver(Long id, Driver driverDetails) {
        Driver driver = getDriverById(id);
        
        if (driverDetails.getName() != null) {
            driver.setName(driverDetails.getName());
        }
        if (driverDetails.getPhone() != null) {
            driver.setPhone(driverDetails.getPhone());
        }
        if (driverDetails.getVehicleType() != null) {
            driver.setVehicleType(driverDetails.getVehicleType());
        }
        if (driverDetails.getVehicleNumber() != null) {
            driver.setVehicleNumber(driverDetails.getVehicleNumber());
        }
        if (driverDetails.getLicenseNumber() != null) {
            driver.setLicenseNumber(driverDetails.getLicenseNumber());
        }
        if (driverDetails.getAvailable() != null) {
            driver.setAvailable(driverDetails.getAvailable());
        }
        
        return driverRepository.save(driver);
    }
    
    // Update driver availability
    public void updateDriverAvailability(Long driverId, Boolean available) {
        Driver driver = getDriverById(driverId);
        driver.setAvailable(available);
        driverRepository.save(driver);
    }
    
    // Delete driver
    public void deleteDriver(Long id) {
        Driver driver = getDriverById(id);
        driverRepository.delete(driver);
    }
    
    // Get driver by user ID
    public Driver getDriverByUserId(Long userId) {
        return driverRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Driver not found for user ID: " + userId));
    }
}
