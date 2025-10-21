package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.OrderTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderTrackingRepository extends JpaRepository<OrderTracking, Long> {
    List<OrderTracking> findByOrderOrderByTimestampDesc(Order order);
}