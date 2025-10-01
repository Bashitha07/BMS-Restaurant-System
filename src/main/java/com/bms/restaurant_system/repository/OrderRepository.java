package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Modifying
    @Query("UPDATE Order o SET o.delivery = null WHERE o.id = :orderId")
    void setDeliveryToNull(@Param("orderId") Long orderId);

    @Query("SELECT o.id FROM Order o WHERE o.delivery.id = :deliveryId")
    Optional<Long> findOrderIdByDeliveryId(@Param("deliveryId") Long deliveryId);

    @Query(value = "SELECT id FROM orders WHERE delivery_id = :deliveryId", nativeQuery = true)
    Optional<Long> findOrderIdByDeliveryIdNative(@Param("deliveryId") Long deliveryId);
}
