package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.PaymentSlip;
import com.bms.restaurant_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentSlipRepository extends JpaRepository<PaymentSlip, Long> {
    
    // Find by status
    List<PaymentSlip> findByStatus(PaymentSlip.PaymentSlipStatus status);
    
    // Find by user
    List<PaymentSlip> findByUserOrderByUploadedAtDesc(User user);
    
    // Find by order ID
    List<PaymentSlip> findByOrderId(Long orderId);
    
    // Find pending payment slips
    List<PaymentSlip> findByStatusOrderByUploadedAtDesc(PaymentSlip.PaymentSlipStatus status);
    
    // Find payment slips uploaded within date range
    @Query("SELECT p FROM PaymentSlip p WHERE p.uploadedAt >= :startDate AND p.uploadedAt <= :endDate")
    List<PaymentSlip> findByUploadedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate);
    
    // Find payment slips by confirmed by admin
    List<PaymentSlip> findByConfirmedBy(String confirmedBy);
    
    // Count by status
    @Query("SELECT COUNT(p) FROM PaymentSlip p WHERE p.status = :status")
    Long countByStatus(@Param("status") PaymentSlip.PaymentSlipStatus status);
    
    // Find recent uploads
    @Query("SELECT p FROM PaymentSlip p ORDER BY p.uploadedAt DESC")
    List<PaymentSlip> findRecentUploads();
    
    // Find by user and status
    List<PaymentSlip> findByUserAndStatus(User user, PaymentSlip.PaymentSlipStatus status);
}