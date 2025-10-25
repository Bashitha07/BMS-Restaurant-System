package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Existing queries
    @Modifying
    @Query("UPDATE Order o SET o.delivery = null WHERE o.id = :orderId")
    void setDeliveryToNull(@Param("orderId") Long orderId);

    @Query("SELECT o.id FROM Order o WHERE o.delivery.id = :deliveryId")
    Optional<Long> findOrderIdByDeliveryId(@Param("deliveryId") Long deliveryId);

    @Query(value = "SELECT id FROM orders WHERE delivery_id = :deliveryId", nativeQuery = true)
    Optional<Long> findOrderIdByDeliveryIdNative(@Param("deliveryId") Long deliveryId);
    
    // New queries for enhanced functionality
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.menu WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.menu WHERE o.user.id = :userId")
    List<Order> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.menu LEFT JOIN FETCH o.user ORDER BY o.createdAt DESC")
    List<Order> findAllWithDetails();
    
    List<Order> findByStatusOrderByCreatedAtDesc(Order.OrderStatus status);
    
    List<Order> findByStatusInOrderByCreatedAtDesc(List<Order.OrderStatus> statuses);
    
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") Order.OrderStatus status);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED'")
    BigDecimal getTotalRevenue();
    
    @Query("SELECT AVG(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED'")
    BigDecimal getAverageOrderValue();
    
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status IN :statuses")
    List<Order> findByUserIdAndStatusIn(@Param("userId") Long userId, @Param("statuses") List<Order.OrderStatus> statuses);
    
    @Query("SELECT o FROM Order o WHERE o.orderType = :orderType ORDER BY o.createdAt DESC")
    List<Order> findByOrderType(@Param("orderType") Order.OrderType orderType);
}
