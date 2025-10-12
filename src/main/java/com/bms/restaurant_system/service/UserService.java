package com.bms.restaurant_system.service;

import com.bms.restaurant_system.dto.UserDTO;
import com.bms.restaurant_system.dto.RegisterUserDTO;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.entity.Role;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.UserRepository;
import com.bms.restaurant_system.dto.UserResponseDTO; // Assuming this is created
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

/**
 * Service class for managing user-related operations.
 */
@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Retrieves all users and converts them to a list of UserResponseDTOs.
     * @return List of UserResponseDTOs
     */
    public List<UserResponseDTO> getAllUsers() {
        logger.info("🔍 [DB] Executing SELECT query to fetch all users from database");
        
        List<User> users = userRepository.findAll();
        
        logger.info("✅ [DB] Database query completed - Retrieved {} users: {}", 
            users.size(),
            users.stream()
                .map(u -> String.format("User[id=%d, username=%s, role=%s, enabled=%s]", 
                    u.getId(), u.getUsername(), u.getRole(), u.isEnabled()))
                .collect(Collectors.toList()));
        
        return users.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a user by ID and converts to a UserResponseDTO.
     * @param id The user ID
     * @return UserResponseDTO
     * @throws ResourceNotFoundException if user is not found
     */
    public UserResponseDTO getUserById(Long id) {
        logger.info("Fetching user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        logger.info("User found with id: {}", id);
        return convertToResponseDTO(user);
    }

    /**
     * Creates a new user with a mandatory password, hashing it before persistence.
     * @param userDTO The user data transfer object
     * @return UserResponseDTO of the created user
     * @throws IllegalArgumentException if password is null or empty
     */
    public UserResponseDTO createUser(UserDTO userDTO) {
        logger.info("Creating new user: {}", userDTO.username());
        if (userDTO.password() == null || userDTO.password().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        User user = convertToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        logger.info("Password hashed for user: {}", userDTO.username());
        user = userRepository.save(user);
        logger.info("User created with id: {}", user.getId());
        return convertToResponseDTO(user);
    }

    /**
     * Updates an existing user, optionally updating the password if provided.
     * @param id The user ID
     * @param userDTO The updated user data
     * @return UserResponseDTO of the updated user
     * @throws ResourceNotFoundException if user is not found
     */
    public UserResponseDTO updateUser(Long id, UserDTO userDTO) {
        logger.info("Updating user with id: {}", id);
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        existingUser.setUsername(userDTO.username());
        existingUser.setEmail(userDTO.email());
        existingUser.setPhone(userDTO.phone());
        if (userDTO.role() != null) {
            existingUser.setRole(Role.valueOf(userDTO.role().toUpperCase()));
        }
        if (userDTO.password() != null && !userDTO.password().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDTO.password()));
            logger.info("Password hashed for user: {}", userDTO.username());
        }
        existingUser = userRepository.save(existingUser);
        logger.info("User updated with id: {}", id);
        return convertToResponseDTO(existingUser);
    }

    /**
     * Deletes a user by ID.
     * @param id The user ID
     * @throws ResourceNotFoundException if user is not found
     */
    public void deleteUser(Long id) {
        logger.info("Deleting user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
        logger.info("User deleted with id: {}", id);
    }

    /**
     * Finds a user by username.
     * @param username The username
     * @return User entity
     * @throws ResourceNotFoundException if user is not found
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    /**
     * Registers a new user.
     * @param registerUserDTO The user data transfer object
     * @return UserResponseDTO of the registered user
     * @throws IllegalArgumentException if username already exists
     */
    public UserResponseDTO registerUser(RegisterUserDTO registerUserDTO) {
        logger.info("Registering new user: {}", registerUserDTO.username());
        if (userRepository.findByUsername(registerUserDTO.username()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        // Create a new UserDTO with default role USER if not provided
        UserDTO userDTOWithRole = new UserDTO(
            null,
            registerUserDTO.username(),
            registerUserDTO.email(),
            registerUserDTO.phone(),
            registerUserDTO.role() != null ? registerUserDTO.role() : "USER",
            registerUserDTO.password()
        );
        User user = convertToEntity(userDTOWithRole);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user = userRepository.save(user);
        logger.info("User registered with id: {}", user.getId());
        return convertToResponseDTO(user);
    }

    /**
     * Updates user role (admin only).
     * @param id The user ID
     * @param role The new role
     * @return UserResponseDTO of the updated user
     * @throws ResourceNotFoundException if user is not found
     */
    public UserResponseDTO updateUserRole(Long id, String role) {
        logger.info("🔍 [DB] Initiating database query to update user role - User ID: {}, New Role: {}", id, role);
        
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("❌ [DB] User not found in database - ID: {}", id);
                    return new ResourceNotFoundException("User not found with id: " + id);
                });
        
        String oldRole = existingUser.getRole().toString();
        logger.info("📊 [DB] Current user state retrieved from database: User[id={}, username={}, currentRole={}]", 
            id, existingUser.getUsername(), oldRole);
        
        existingUser.setRole(Role.valueOf(role.toUpperCase()));
        
        logger.info("💾 [DB] Executing database UPDATE for user role...");
        existingUser = userRepository.save(existingUser);
        
        logger.info("✅ [DB] Database UPDATE completed successfully: User[id={}, username={}, oldRole={}, newRole={}]", 
            id, existingUser.getUsername(), oldRole, existingUser.getRole().toString());
        
        return convertToResponseDTO(existingUser);
    }

    /**
     * Converts a User entity to a UserResponseDTO, excluding the password.
     * @param user The User entity
     * @return UserResponseDTO
     */
    private UserResponseDTO convertToResponseDTO(User user) {
        return new UserResponseDTO(user.getId(), user.getUsername(), user.getEmail(), user.getPhone(), user.getRole(), user.isEnabled());
    }

    /**
     * Converts a UserDTO to a User entity.
     * @param userDTO The user data transfer object
     * @return User entity
     */
    private User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.username());
        user.setEmail(userDTO.email());
        user.setPhone(userDTO.phone());
        user.setRole(Role.valueOf(userDTO.role().toUpperCase()));
        user.setPassword(userDTO.password());
        return user;
    }

    /**
     * Updates user account status (admin only).
     * @param id The user ID
     * @param enabled Whether the account should be enabled
     * @return UserResponseDTO of the updated user
     * @throws ResourceNotFoundException if user is not found
     */
    public UserResponseDTO updateUserStatus(Long id, boolean enabled) {
        logger.info("🔍 [DB] Initiating database query to update user status - User ID: {}, New Status: {}", 
            id, enabled ? "ENABLED" : "DISABLED");
        
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("❌ [DB] User not found in database - ID: {}", id);
                    return new ResourceNotFoundException("User not found with id: " + id);
                });
        
        boolean oldStatus = existingUser.isEnabled();
        logger.info("📊 [DB] Current user state retrieved from database: User[id={}, username={}, currentStatus={}]", 
            id, existingUser.getUsername(), oldStatus ? "ENABLED" : "DISABLED");
        
        existingUser.setEnabled(enabled);
        
        logger.info("💾 [DB] Executing database UPDATE for user status...");
        existingUser = userRepository.save(existingUser);
        
        logger.info("✅ [DB] Database UPDATE completed successfully: User[id={}, username={}, oldStatus={}, newStatus={}]", 
            id, existingUser.getUsername(), 
            oldStatus ? "ENABLED" : "DISABLED", 
            existingUser.isEnabled() ? "ENABLED" : "DISABLED");
        
        return convertToResponseDTO(existingUser);
    }

    /**
     * Gets users by role.
     * @param role The role to filter by
     * @return List of UserResponseDTOs
     */
    public List<UserResponseDTO> getUsersByRole(String role) {
        logger.info("Fetching users with role: {}", role);
        return userRepository.findByRole(Role.valueOf(role.toUpperCase())).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Gets user statistics.
     * @return Map containing user statistics
     */
    public Map<String, Object> getUserStatistics() {
        logger.info("Fetching user statistics");
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long adminUsers = userRepository.countByRole(Role.ADMIN);
        long customerUsers = userRepository.countByRole(Role.USER);
        long enabledUsers = userRepository.countByEnabled(true);
        long disabledUsers = userRepository.countByEnabled(false);
        
        stats.put("totalUsers", totalUsers);
        stats.put("adminUsers", adminUsers);
        stats.put("customerUsers", customerUsers);
        stats.put("enabledUsers", enabledUsers);
        stats.put("disabledUsers", disabledUsers);
        
        return stats;
    }

}
