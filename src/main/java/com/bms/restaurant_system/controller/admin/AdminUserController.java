package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.UserResponseDTO;
import com.bms.restaurant_system.dto.UserRoleUpdateDTO;
import com.bms.restaurant_system.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    private static final Logger logger = LoggerFactory.getLogger(AdminUserController.class);

    @Autowired
    private UserService userService;

    // Get all users
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        logger.info("🔍 [DB] Admin requesting all users from database");
        try {
            List<UserResponseDTO> users = userService.getAllUsers();
            logger.info("✅ [DB] Successfully retrieved {} users from database: {}", 
                users.size(), 
                users.stream().map(u -> String.format("User[id=%d, username=%s, role=%s]", 
                    u.id(), u.username(), u.role())).toList());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("❌ [DB] Failed to fetch users from database: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        logger.info("Admin fetching user with id: {}", id);
        try {
            UserResponseDTO user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error fetching user {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("User not found");
        }
    }

    // Update user role
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody UserRoleUpdateDTO updateRequest) {
        logger.info("🔄 [DB] Admin initiating role update - User ID: {}, New Role: {}", id, updateRequest.newRole());
        try {
            UserResponseDTO currentUser = userService.getUserById(id);
            logger.info("📊 [DB] Current user state before role update: User[id={}, username={}, currentRole={}]", 
                id, currentUser.username(), currentUser.role());
            
            UserResponseDTO updatedUser = userService.updateUserRole(id, updateRequest.newRole());
            
            logger.info("✅ [DB] Role update SUCCESSFUL - Database updated: User[id={}, username={}, oldRole={}, newRole={}]", 
                id, updatedUser.username(), currentUser.role(), updatedUser.role());
            
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            logger.error("❌ [DB] Role update FAILED - Database error for user {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(400).body("Failed to update user role: " + e.getMessage());
        }
    }

    // Enable/Disable user account
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestParam boolean enabled) {
        logger.info("🔄 [DB] Admin initiating status update - User ID: {}, New Status: {}", id, enabled ? "ENABLED" : "DISABLED");
        try {
            UserResponseDTO currentUser = userService.getUserById(id);
            logger.info("📊 [DB] Current user state before status update: User[id={}, username={}, currentStatus={}]", 
                id, currentUser.username(), currentUser.enabled() ? "ENABLED" : "DISABLED");
            
            UserResponseDTO updatedUser = userService.updateUserStatus(id, enabled);
            
            logger.info("✅ [DB] Status update SUCCESSFUL - Database updated: User[id={}, username={}, oldStatus={}, newStatus={}]", 
                id, updatedUser.username(), 
                currentUser.enabled() ? "ENABLED" : "DISABLED",
                updatedUser.enabled() ? "ENABLED" : "DISABLED");
            
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            logger.error("❌ [DB] Status update FAILED - Database error for user {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(400).body("Failed to update user status: " + e.getMessage());
        }
    }

    // Delete user account
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        logger.info("Admin deleting user: {}", id);
        try {
            userService.deleteUser(id);
            logger.info("User deleted successfully: {}", id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting user {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to delete user: " + e.getMessage());
        }
    }

    // Search users by role
    @GetMapping("/by-role/{role}")
    public ResponseEntity<List<UserResponseDTO>> getUsersByRole(@PathVariable String role) {
        logger.info("Admin fetching users with role: {}", role);
        List<UserResponseDTO> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    // Get user statistics
    @GetMapping("/statistics")
    public ResponseEntity<?> getUserStatistics() {
        logger.info("Admin fetching user statistics");
        try {
            Map<String, Object> stats = userService.getUserStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching user statistics: {}", e.getMessage());
            return ResponseEntity.status(500).body("Failed to fetch statistics");
        }
    }
}