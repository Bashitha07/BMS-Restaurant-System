package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    // Find drivers by status
    List<Driver> findByStatusOrderByRatingDesc(Driver.DriverStatus status);
    
    // Find available drivers
    List<Driver> findByStatusOrderByTotalDeliveriesDesc(Driver.DriverStatus status);
    
    // Find driver by phone number
    Optional<Driver> findByPhone(String phone);
    
    // Find driver by email
    Optional<Driver> findByEmail(String email);
    
    // Find drivers by vehicle type
    List<Driver> findByVehicleTypeOrderByRatingDesc(String vehicleType);
    
    // Find drivers with rating above a threshold
    @Query("SELECT d FROM Driver d WHERE d.rating >= :minRating ORDER BY d.rating DESC")
    List<Driver> findDriversWithMinRating(@Param("minRating") BigDecimal minRating);
    
    // Find top-rated drivers
    @Query("SELECT d FROM Driver d WHERE d.status = :status ORDER BY d.rating DESC, d.totalDeliveries DESC")
    List<Driver> findTopRatedDriversByStatus(@Param("status") Driver.DriverStatus status);
    
    // Find drivers by name containing
    List<Driver> findByNameContainingIgnoreCaseOrderByName(String name);
    
    // Count drivers by status
    @Query("SELECT COUNT(d) FROM Driver d WHERE d.status = :status")
    Long countByStatus(@Param("status") Driver.DriverStatus status);
    
    // Find drivers created within a date range
    List<Driver> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    // Get drivers with most deliveries
    @Query("SELECT d FROM Driver d ORDER BY d.totalDeliveries DESC")
    List<Driver> findDriversByDeliveryCount();
    
    // Find available drivers with specific vehicle type
    @Query("SELECT d FROM Driver d WHERE d.status = 'AVAILABLE' AND d.vehicleType = :vehicleType ORDER BY d.rating DESC")
    List<Driver> findAvailableDriversByVehicleType(@Param("vehicleType") String vehicleType);
    
    // Update driver status
    @Query("UPDATE Driver d SET d.status = :status WHERE d.id = :driverId")
    void updateDriverStatus(@Param("driverId") Long driverId, @Param("status") Driver.DriverStatus status);
    
    // Get driver statistics
    @Query("SELECT AVG(d.rating) FROM Driver d WHERE d.status = :status")
    Double getAverageRatingByStatus(@Param("status") Driver.DriverStatus status);
    
    // Find drivers with delivery count range
    @Query("SELECT d FROM Driver d WHERE d.totalDeliveries BETWEEN :minDeliveries AND :maxDeliveries ORDER BY d.rating DESC")
    List<Driver> findDriversByDeliveryRange(@Param("minDeliveries") Integer minDeliveries, @Param("maxDeliveries") Integer maxDeliveries);
    
    // Check if phone number exists (for unique validation)
    boolean existsByPhone(String phone);
    
    // Check if email exists (for unique validation)
    boolean existsByEmail(String email);
}