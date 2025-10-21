package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    List<Notification> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.status = 'UNREAD' AND n.user.id = :userId ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUserId(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.isGlobal = true ORDER BY n.createdAt DESC")
    List<Notification> findGlobalNotifications();
    
    @Query("SELECT n FROM Notification n WHERE n.type = :type ORDER BY n.createdAt DESC")
    List<Notification> findByType(@Param("type") Notification.NotificationType type);
    
    @Query("SELECT n FROM Notification n WHERE n.referenceId = :referenceId AND n.referenceType = :referenceType")
    List<Notification> findByReference(@Param("referenceId") Long referenceId, @Param("referenceType") String referenceType);
}