package com.bms.restaurant_system.service.notification;

import com.bms.restaurant_system.dto.user.NotificationDTO;
import com.bms.restaurant_system.entity.Notification;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.NotificationRepository;
import com.bms.restaurant_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<NotificationDTO> getAllNotifications() {
        return notificationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public NotificationDTO getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        return convertToDTO(notification);
    }

    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        User user = null;
        if (notificationDTO.userId() != null) {
            user = userRepository.findById(notificationDTO.userId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + notificationDTO.userId()));
        }
        
        Notification notification = convertToEntity(notificationDTO);
        notification.setUser(user);
        notification.setStatus(Notification.NotificationStatus.UNREAD);
        notification.setCreatedAt(LocalDateTime.now());
        
        notification = notificationRepository.save(notification);
        return convertToDTO(notification);
    }

    public NotificationDTO updateNotification(Long id, NotificationDTO notificationDTO) {
        Notification existingNotification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        
        existingNotification.setMessage(notificationDTO.message());
        existingNotification.setTitle(notificationDTO.title());
        existingNotification.setType(Notification.NotificationType.valueOf(notificationDTO.type()));
        existingNotification.setStatus(Notification.NotificationStatus.valueOf(notificationDTO.status()));
        existingNotification.setReferenceId(notificationDTO.referenceId());
        existingNotification.setReferenceType(notificationDTO.referenceType());
        existingNotification.setIsGlobal(notificationDTO.isGlobal());
        
        existingNotification = notificationRepository.save(existingNotification);
        return convertToDTO(existingNotification);
    }

    @Transactional
    public void deleteNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        notificationRepository.delete(notification);
    }

    private NotificationDTO convertToDTO(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType().name(),
                notification.getStatus().name(),
                notification.getUser() != null ? notification.getUser().getId() : null,
                notification.getUser() != null ? notification.getUser().getUsername() : null,
                notification.getCreatedAt(),
                notification.getReadAt(),
                notification.getReferenceId(),
                notification.getReferenceType(),
                notification.getIsGlobal()
        );
    }

    private Notification convertToEntity(NotificationDTO notificationDTO) {
        Notification notification = new Notification();
        notification.setTitle(notificationDTO.title());
        notification.setMessage(notificationDTO.message());
        notification.setType(Notification.NotificationType.valueOf(notificationDTO.type()));
        notification.setReferenceId(notificationDTO.referenceId());
        notification.setReferenceType(notificationDTO.referenceType());
        notification.setIsGlobal(notificationDTO.isGlobal());
        return notification;
    }
}