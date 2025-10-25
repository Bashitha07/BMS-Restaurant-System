package com.bms.restaurant_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, UserDetailsService userDetailsService, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no authentication required
                .requestMatchers("/api/auth/**").permitAll()  // Authentication endpoints
                .requestMatchers("/api/menus","/api/menus/**").permitAll()  // Public menu viewing
                .requestMatchers("/api/menus/available").permitAll()  // Available menus
                .requestMatchers("/api/menus/{id}").permitAll()  // View specific menu item
                .requestMatchers("/api/menus/category/**").permitAll()  // Menu by category
                
                // Static resources - no authentication required
                .requestMatchers("/images/**").permitAll()  // Menu item images
                .requestMatchers("/uploads/**").permitAll()  // Uploaded files
                .requestMatchers("/assets/**").permitAll()  // Frontend assets
                
                // Admin-only endpoints - require ADMIN role
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/delivery-drivers/pending").permitAll()  // Public can view
                .requestMatchers("/api/delivery-drivers/**").hasRole("ADMIN")  // Admin manages
                .requestMatchers("/api/users/*/role").hasRole("ADMIN")
                
                // Kitchen staff endpoints
                .requestMatchers("/api/kitchen/**").hasRole("KITCHEN")
                
                // Manager endpoints
                .requestMatchers("/api/manager/**").hasRole("MANAGER")
                
                // Authenticated user endpoints - require login
                .requestMatchers("/api/orders", "/api/orders/**").authenticated()  // Orders require auth
                .requestMatchers("/api/reservations", "/api/reservations/**").authenticated()  // Reservations require auth
                .requestMatchers("/api/payments", "/api/payments/**").authenticated()  // Payments require auth
                .requestMatchers("/api/users/**").authenticated()  // User management requires auth
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Add JWT authentication filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .userDetailsService(userDetailsService)
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow multiple origins for development
        configuration.setAllowedOrigins(Arrays.asList(
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",  // Vite default port
            "http://127.0.0.1:5173",
            "http://localhost:5174",  // Vite alternate port
            "http://127.0.0.1:5174",
            "http://localhost:5175",  // Vite alternate port
            "http://127.0.0.1:5175",
            "http://localhost:5176",  // Vite current port
            "http://127.0.0.1:5176",
            "file://",  // Allow file:// protocol for local testing
            "null"      // Allow null origin (for local files)
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
