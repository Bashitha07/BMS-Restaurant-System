package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.Payment;
import com.bms.restaurant_system.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByOrderId(Long orderId);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    List<Payment> findByPaymentMethod(PaymentMethod paymentMethod);
    
    @Query("SELECT p FROM Payment p WHERE p.submittedDate BETWEEN :startDate AND :endDate")
    List<Payment> findBySubmittedDateBetween(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Payment p WHERE p.order.user.id = :userId ORDER BY p.submittedDate DESC")
    List<Payment> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal getTotalProcessedAmount();
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    Long countByStatus(@Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.transactionId = :transactionId")
    List<Payment> findByTransactionId(@Param("transactionId") String transactionId);
    
    @Query("SELECT p FROM Payment p WHERE p.gatewayTransactionId = :gatewayTransactionId")
    List<Payment> findByGatewayTransactionId(@Param("gatewayTransactionId") String gatewayTransactionId);
}
