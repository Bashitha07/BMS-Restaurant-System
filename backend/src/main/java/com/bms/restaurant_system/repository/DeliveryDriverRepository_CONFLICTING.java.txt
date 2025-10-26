package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.DeliveryDriver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryDriverRepository extends JpaRepository<DeliveryDriver, Long> {
    
    // Find by status
    List<DeliveryDriver> findByStatus(DeliveryDriver.DriverStatus status);
    
    // Find available drivers
    List<DeliveryDriver> findByStatusAndIsActiveTrue(DeliveryDriver.DriverStatus status);
    
    // Find by email
    Optional<DeliveryDriver> findByEmail(String email);
    
    // Find by username
    Optional<DeliveryDriver> findByUsername(String username);
    
    // Find by phone
    Optional<DeliveryDriver> findByPhone(String phone);
    
    // Find by license number
    Optional<DeliveryDriver> findByLicenseNumber(String licenseNumber);
    
    // Find by vehicle number
    Optional<DeliveryDriver> findByVehicleNumber(String vehicleNumber);
    
    // Find active drivers
    List<DeliveryDriver> findByIsActiveTrue();
    
    // Find drivers by vehicle type
    List<DeliveryDriver> findByVehicleTypeAndIsActiveTrue(String vehicleType);
    
    // Find top rated drivers
    @Query("SELECT d FROM DeliveryDriver d WHERE d.isActive = true AND d.totalRatings > 0 ORDER BY d.averageRating DESC")
    List<DeliveryDriver> findTopRatedDrivers();
    
    // Find drivers by rating range
    @Query("SELECT d FROM DeliveryDriver d WHERE d.averageRating >= :minRating AND d.averageRating <= :maxRating AND d.isActive = true")
    List<DeliveryDriver> findByRatingRange(@Param("minRating") BigDecimal minRating, @Param("maxRating") BigDecimal maxRating);
    
    // Find drivers within delivery distance
    @Query("SELECT d FROM DeliveryDriver d WHERE d.maxDeliveryDistance >= :requiredDistance AND d.isActive = true")
    List<DeliveryDriver> findByDeliveryDistanceCapability(@Param("requiredDistance") BigDecimal requiredDistance);
    
    // Find drivers by minimum deliveries count
    @Query("SELECT d FROM DeliveryDriver d WHERE d.totalDeliveries >= :minDeliveries AND d.isActive = true ORDER BY d.totalDeliveries DESC")
    List<DeliveryDriver> findByMinimumDeliveries(@Param("minDeliveries") Integer minDeliveries);
    
    // Get driver statistics
    @Query("SELECT COUNT(d) FROM DeliveryDriver d WHERE d.isActive = true")
    Long countActiveDrivers();
    
    @Query("SELECT COUNT(d) FROM DeliveryDriver d WHERE d.status = :status")
    Long countByStatus(@Param("status") DeliveryDriver.DriverStatus status);
    
    @Query("SELECT AVG(d.averageRating) FROM DeliveryDriver d WHERE d.totalRatings > 0 AND d.isActive = true")
    BigDecimal getAverageRating();
    
    @Query("SELECT SUM(d.totalDeliveries) FROM DeliveryDriver d WHERE d.isActive = true")
    Long getTotalDeliveriesAllDrivers();
    
    // Find drivers by minimum rating
    @Query("SELECT d FROM DeliveryDriver d WHERE d.averageRating >= :minRating AND d.isActive = true ORDER BY d.averageRating DESC")
    List<DeliveryDriver> findByRatingGreaterThanEqual(@Param("minRating") BigDecimal minRating);
    
    // Find nearest available driver (simplified - would need proper GIS functions in production)
    @Query("SELECT d FROM DeliveryDriver d WHERE d.status = 'AVAILABLE' AND d.isActive = true " +
           "AND d.currentLocationLat IS NOT NULL AND d.currentLocationLng IS NOT NULL " +
           "ORDER BY SQRT(POWER(d.currentLocationLat - :latitude, 2) + POWER(d.currentLocationLng - :longitude, 2)) " +
           "LIMIT 1")
    Optional<DeliveryDriver> findNearestAvailableDriver(@Param("latitude") BigDecimal latitude, 
                                                       @Param("longitude") BigDecimal longitude, 
                                                       @Param("radiusKm") double radiusKm);
}
