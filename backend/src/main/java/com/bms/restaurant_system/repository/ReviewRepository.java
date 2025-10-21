package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Find all reviews for a specific menu item
    List<Review> findByMenuIdOrderByCreatedAtDesc(Long menuId);
    
    // Find all reviews by a specific user
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Check if a user has already reviewed a specific menu item
    Optional<Review> findByUserIdAndMenuId(Long userId, Long menuId);
    
    // Count total reviews for a menu item
    @Query("SELECT COUNT(r) FROM Review r WHERE r.menuId = :menuId")
    Long countReviewsByMenuId(@Param("menuId") Long menuId);
    
    // Find recent reviews (last N days)
    @Query("SELECT r FROM Review r WHERE r.createdAt >= :dateThreshold ORDER BY r.createdAt DESC")
    List<Review> findRecentReviews(@Param("dateThreshold") java.time.LocalDateTime dateThreshold);
}