package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.DeliveryDriver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryDriverRepository extends JpaRepository<DeliveryDriver, Long> {
    
    // Find all assignments for a specific delivery
    List<DeliveryDriver> findByDeliveryId(Long deliveryId);
    
    // Find all assignments for a specific driver
    List<DeliveryDriver> findByDriverId(Long driverId);
    
    // Find a specific assignment
    Optional<DeliveryDriver> findByDeliveryIdAndDriverId(Long deliveryId, Long driverId);
    
    // Check if a driver is assigned to a delivery
    boolean existsByDeliveryIdAndDriverId(Long deliveryId, Long driverId);
    
    // Find recent assignments for a driver
    @Query("SELECT dd FROM DeliveryDriver dd WHERE dd.driver.id = :driverId ORDER BY dd.assignedAt DESC")
    List<DeliveryDriver> findRecentAssignmentsByDriver(@Param("driverId") Long driverId);
}
