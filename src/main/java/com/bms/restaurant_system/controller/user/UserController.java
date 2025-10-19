package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.UserResponseDTO;
import com.bms.restaurant_system.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody com.bms.restaurant_system.dto.UserDTO userDTO) {
        // Accept UserDTO in request (tests send this shape) and convert to RegisterUserDTO
        logger.info("Registering user: {}", userDTO.username());
        try {
            com.bms.restaurant_system.dto.RegisterUserDTO registerUserDTO = new com.bms.restaurant_system.dto.RegisterUserDTO(
                    userDTO.username(), userDTO.email(), userDTO.phone(), userDTO.role(), userDTO.password()
            );
            UserResponseDTO createdUser = userService.registerUser(registerUserDTO);
            logger.info("User registered successfully: {}", createdUser.username());
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", userDTO.username(), e);
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> roleUpdate) {
        logger.info("Updating role for user with id: {}", id);
        try {
            String role = roleUpdate.get("role");
            if (role == null || role.isEmpty()) {
                return ResponseEntity.badRequest().body("Role is required");
            }
            UserResponseDTO updatedUser = userService.updateUserRole(id, role);
            logger.info("Role updated successfully for user with id: {}", id);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            logger.error("Role update failed for user with id: {}", id, e);
            return ResponseEntity.badRequest().body("Role update failed: " + e.getMessage());
        }
    }
}
