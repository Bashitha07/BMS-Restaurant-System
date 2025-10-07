package com.bms.restaurant_system.service;

import com.bms.restaurant_system.dto.DeliveryDriverDTO;
import com.bms.restaurant_system.dto.DriverLoginRequest;
import com.bms.restaurant_system.dto.DriverLoginResponse;
import com.bms.restaurant_system.dto.RegisterDriverDTO;
import com.bms.restaurant_system.entity.DeliveryDriver;
import com.bms.restaurant_system.entity.DeliveryDriver.DriverStatus;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.DeliveryDriverRepository;
import com.bms.restaurant_system.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DeliveryDriverService {
    @Autowired
    private DeliveryDriverRepository deliveryDriverRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    // Authentication Methods
    public DriverLoginResponse authenticateDriver(DriverLoginRequest loginRequest) {
        DeliveryDriver driver = deliveryDriverRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));
                
        if (!passwordEncoder.matches(loginRequest.getPassword(), driver.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }
        
        if (!driver.getIsActive()) {
            throw new BadCredentialsException("Driver account is inactive");
        }
        
        // Update last login
        driver.setLastLogin(LocalDateTime.now());
        deliveryDriverRepository.save(driver);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(driver.getUsername(), "DRIVER");
        
        return new DriverLoginResponse(
            token,
            driver.getUsername(),
            "DRIVER",
            driver.getId(),
            driver.getName(),
            driver.getStatus().name()
        );
    }
    
    public void logoutDriver(Long driverId) {
        DeliveryDriver driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        
        // Set driver status to offline when logging out
        driver.setStatus(DriverStatus.OFFLINE);
        deliveryDriverRepository.save(driver);
    }
    
    public DeliveryDriver findByUsername(String username) {
        return deliveryDriverRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with username: " + username));
    }
    
    // Driver Status Management
    public void updateDriverStatus(Long driverId, DriverStatus status) {
        DeliveryDriver driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        
        driver.setStatus(status);
        deliveryDriverRepository.save(driver);
    }

    // Basic CRUD Operations
    public List<DeliveryDriverDTO> getAllDeliveryDrivers() {
        return deliveryDriverRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DeliveryDriverDTO getDeliveryDriverById(Long id) {
        DeliveryDriver driver = deliveryDriverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + id));
        return convertToDTO(driver);
    }

    public DeliveryDriverDTO createDeliveryDriver(DeliveryDriverDTO deliveryDriverDTO) {
        DeliveryDriver driver = convertToEntity(deliveryDriverDTO);
        driver = deliveryDriverRepository.save(driver);
        return convertToDTO(driver);
    }

    public DeliveryDriverDTO updateDeliveryDriver(Long id, DeliveryDriverDTO deliveryDriverDTO) {
        DeliveryDriver existingDriver = deliveryDriverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + id));
        
        updateDriverFromDTO(existingDriver, deliveryDriverDTO);
        existingDriver = deliveryDriverRepository.save(existingDriver);
        return convertToDTO(existingDriver);
    }

    public void deleteDeliveryDriver(Long id) {
        DeliveryDriver driver = deliveryDriverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + id));
        deliveryDriverRepository.delete(driver);
    }

    // Business Logic Methods
    public List<DeliveryDriverDTO> getAvailableDrivers() {
        return deliveryDriverRepository.findByStatus(DriverStatus.AVAILABLE).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DeliveryDriverDTO> getActiveDrivers() {
        return deliveryDriverRepository.findByStatus(DriverStatus.ON_DELIVERY).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DeliveryDriverDTO> getDriversByRatingAbove(BigDecimal minRating) {
        return deliveryDriverRepository.findByRatingGreaterThanEqual(minRating).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DeliveryDriverDTO> getTopRatedDrivers(int limit) {
        return deliveryDriverRepository.findTopRatedDrivers().stream()
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DeliveryDriverDTO assignDriverToDelivery(Long driverId) {
        DeliveryDriver driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + driverId));
        
        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new IllegalStateException("Driver is not available for assignment");
        }
        
        driver.setStatus(DriverStatus.ON_DELIVERY);
        driver.setLastLogin(LocalDateTime.now());
        driver = deliveryDriverRepository.save(driver);
        return convertToDTO(driver);
    }

    public DeliveryDriverDTO completeDelivery(Long driverId, BigDecimal deliveryFee) {
        DeliveryDriver driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + driverId));
        
        driver.addEarnings(deliveryFee);
        driver.incrementDeliveries();
        driver.setStatus(DriverStatus.AVAILABLE);
        driver = deliveryDriverRepository.save(driver);
        return convertToDTO(driver);
    }

    public DeliveryDriverDTO updateDriverRating(Long driverId, BigDecimal newRating) {
        DeliveryDriver driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + driverId));
        
        driver.updateRating(newRating);
        driver = deliveryDriverRepository.save(driver);
        return convertToDTO(driver);
    }

    public DeliveryDriverDTO updateDriverLocation(Long driverId, BigDecimal latitude, BigDecimal longitude) {
        DeliveryDriver driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + driverId));
        
        driver.setCurrentLocationLat(latitude);
        driver.setCurrentLocationLng(longitude);
        driver.setLastLogin(LocalDateTime.now());
        driver = deliveryDriverRepository.save(driver);
        return convertToDTO(driver);
    }

    public DeliveryDriverDTO setDriverAvailability(Long driverId, boolean isAvailable) {
        DeliveryDriver driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + driverId));
        
        driver.setIsActive(isAvailable);
        driver.setStatus(isAvailable ? DriverStatus.AVAILABLE : DriverStatus.OFFLINE);
        driver.setLastLogin(LocalDateTime.now());
        driver = deliveryDriverRepository.save(driver);
        return convertToDTO(driver);
    }

    public Optional<DeliveryDriverDTO> findNearestAvailableDriver(BigDecimal latitude, BigDecimal longitude, double radiusKm) {
        return deliveryDriverRepository.findNearestAvailableDriver(latitude, longitude, radiusKm)
                .map(this::convertToDTO);
    }

    public BigDecimal getAverageRating() {
        return deliveryDriverRepository.getAverageRating();
    }

    public Long getTotalActiveDrivers() {
        return deliveryDriverRepository.countActiveDrivers();
    }

    public BigDecimal getTotalEarningsForDriver(Long driverId) {
        DeliveryDriver driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with id: " + driverId));
        return driver.getTotalEarnings();
    }

    // Helper Methods
    private DeliveryDriverDTO convertToDTO(DeliveryDriver driver) {
        return new DeliveryDriverDTO(
                driver.getId(),
                driver.getName(),
                driver.getUsername(),
                driver.getPhone(),
                driver.getEmail(),
                driver.getLicenseNumber(),
                driver.getVehicleNumber(),
                driver.getVehicleType(),
                driver.getVehicleModel(),
                null, // vehicleColor - not in entity
                driver.getStatus().name(),
                driver.getAverageRating(),
                driver.getTotalDeliveries(),
                driver.getTotalEarnings(),
                driver.getCurrentLocationLat(),
                driver.getCurrentLocationLng(),
                driver.getAddress(),
                driver.getEmergencyContact(),
                driver.getEmergencyPhone(),
                driver.getHireDate().toLocalDate(),
                driver.getLastLogin(),
                driver.getIsActive(),
                null, // profileImageUrl - not in entity
                driver.getNotes()
        );
    }

    private DeliveryDriver convertToEntity(DeliveryDriverDTO dto) {
        DeliveryDriver driver = new DeliveryDriver();
        updateDriverFromDTO(driver, dto);
        return driver;
    }

    private void updateDriverFromDTO(DeliveryDriver driver, DeliveryDriverDTO dto) {
        driver.setName(dto.name());
        if (dto.username() != null) {
            driver.setUsername(dto.username());
        }
        driver.setPhone(dto.phone());
        driver.setEmail(dto.email());
        driver.setLicenseNumber(dto.licenseNumber());
        driver.setVehicleNumber(dto.vehicleNumber());
        driver.setVehicleType(dto.vehicleType());
        driver.setVehicleModel(dto.vehicleModel());
        // vehicleColor not in entity
        
        if (dto.status() != null) {
            driver.setStatus(DriverStatus.valueOf(dto.status()));
        }
        
        if (dto.rating() != null) {
            driver.setAverageRating(dto.rating());
        }
        
        if (dto.totalDeliveries() != null) {
            driver.setTotalDeliveries(dto.totalDeliveries());
        }
        
        if (dto.totalEarnings() != null) {
            driver.setTotalEarnings(dto.totalEarnings());
        }
        
        if (dto.currentLatitude() != null) {
            driver.setCurrentLocationLat(dto.currentLatitude());
        }
        
        if (dto.currentLongitude() != null) {
            driver.setCurrentLocationLng(dto.currentLongitude());
        }
        
        driver.setAddress(dto.address());
        driver.setEmergencyContact(dto.emergencyContact());
        driver.setEmergencyPhone(dto.emergencyPhone());
        
        if (dto.lastActiveTime() != null) {
            driver.setLastLogin(dto.lastActiveTime());
        }
        
        if (dto.isAvailable() != null) {
            driver.setIsActive(dto.isAvailable());
        }
        
        // profileImageUrl not in entity
        driver.setNotes(dto.notes());
    }
    
    // Admin-specific methods
    public DeliveryDriverDTO registerDriver(RegisterDriverDTO registerDriverDTO) {
        // Check if username already exists
        if (deliveryDriverRepository.findByUsername(registerDriverDTO.username()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Check if email already exists
        if (deliveryDriverRepository.findByEmail(registerDriverDTO.email()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Check if license number already exists
        if (deliveryDriverRepository.findByLicenseNumber(registerDriverDTO.licenseNumber()).isPresent()) {
            throw new IllegalArgumentException("License number already exists");
        }
        
        // Check if vehicle number already exists
        if (deliveryDriverRepository.findByVehicleNumber(registerDriverDTO.vehicleNumber()).isPresent()) {
            throw new IllegalArgumentException("Vehicle number already exists");
        }
        
        DeliveryDriver driver = new DeliveryDriver();
        driver.setName(registerDriverDTO.name());
        driver.setUsername(registerDriverDTO.username());
        driver.setEmail(registerDriverDTO.email());
        driver.setPassword(passwordEncoder.encode(registerDriverDTO.password()));
        driver.setPhone(registerDriverDTO.phone());
        driver.setAddress(registerDriverDTO.address());
        driver.setLicenseNumber(registerDriverDTO.licenseNumber());
        driver.setVehicleNumber(registerDriverDTO.vehicleNumber());
        driver.setVehicleType(registerDriverDTO.vehicleType());
        driver.setVehicleModel(registerDriverDTO.vehicleModel());
        driver.setEmergencyContact(registerDriverDTO.emergencyContact());
        driver.setEmergencyPhone(registerDriverDTO.emergencyPhone());
        driver.setHourlyRate(registerDriverDTO.hourlyRate());
        driver.setCommissionRate(registerDriverDTO.commissionRate());
        driver.setNotes(registerDriverDTO.notes());
        driver.setStatus(DriverStatus.OFFLINE);
        driver.setIsActive(true);
        
        driver = deliveryDriverRepository.save(driver);
        return convertToDTO(driver);
    }
    
    public void updateDriverActiveStatus(Long driverId, Boolean isActive) {
        DeliveryDriver driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        
        driver.setIsActive(isActive);
        if (!isActive) {
            driver.setStatus(DriverStatus.SUSPENDED);
        }
        deliveryDriverRepository.save(driver);
    }
    
    public Map<String, Object> getDriverPerformanceStats(Long driverId) {
        DeliveryDriver driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("driverId", driver.getId());
        stats.put("name", driver.getName());
        stats.put("totalDeliveries", driver.getTotalDeliveries());
        stats.put("totalEarnings", driver.getTotalEarnings());
        stats.put("averageRating", driver.getAverageRating());
        stats.put("totalRatings", driver.getTotalRatings());
        stats.put("status", driver.getStatus().name());
        stats.put("isActive", driver.getIsActive());
        stats.put("joinDate", driver.getHireDate());
        stats.put("lastLogin", driver.getLastLogin());
        
        return stats;
    }
    
    public Map<String, Object> getDriverStatistics() {
        List<DeliveryDriver> allDrivers = deliveryDriverRepository.findAll();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDrivers", allDrivers.size());
        stats.put("activeDrivers", allDrivers.stream().filter(DeliveryDriver::getIsActive).count());
        stats.put("availableDrivers", deliveryDriverRepository.countByStatus(DriverStatus.AVAILABLE));
        stats.put("busyDrivers", deliveryDriverRepository.countByStatus(DriverStatus.ON_DELIVERY));
        stats.put("offlineDrivers", deliveryDriverRepository.countByStatus(DriverStatus.OFFLINE));
        
        BigDecimal avgRating = deliveryDriverRepository.getAverageRating();
        stats.put("averageRating", avgRating != null ? avgRating : BigDecimal.ZERO);
        
        Long totalDeliveries = deliveryDriverRepository.getTotalDeliveriesAllDrivers();
        stats.put("totalDeliveries", totalDeliveries != null ? totalDeliveries : 0L);
        
        return stats;
    }
}
