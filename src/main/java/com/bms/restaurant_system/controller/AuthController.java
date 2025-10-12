package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.LoginRequest;
import com.bms.restaurant_system.dto.LoginResponse;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.service.UserService;
import com.bms.restaurant_system.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for user: {}", loginRequest.getUsername());

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            User user = userService.findByUsername(loginRequest.getUsername());
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

            logger.info("Login successful for user: {}", loginRequest.getUsername());
            return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getRole().name()));

        } catch (AuthenticationException e) {
            logger.warn("Login failed for user: {}", loginRequest.getUsername());
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

}
