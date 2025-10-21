package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    @Query(value = "SELECT order_id FROM deliveries WHERE id = :id", nativeQuery = true)
    Long findOrderIdById(@Param("id") Long id);

    @Modifying
    @Query(value = "UPDATE deliveries SET order_id = NULL WHERE id = :id", nativeQuery = true)
    void detachDeliveryFromOrder(@Param("id") Long id);

    @Modifying
    @Query(value = "DELETE FROM deliveries WHERE id = :id", nativeQuery = true)
    void deleteDeliveryById(@Param("id") Long id);
}
