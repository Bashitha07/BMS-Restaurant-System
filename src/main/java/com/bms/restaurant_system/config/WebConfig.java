package com.bms.restaurant_system.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("http://localhost:3000", "http://127.0.0.1:3000", 
                                       "http://localhost:5173", "http://127.0.0.1:5173",
                                       "http://localhost:5174", "http://127.0.0.1:5174")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve uploaded images from backend static directory
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/")
                .setCachePeriod(3600); // Cache for 1 hour
        
        // Handle specific category images
        registry.addResourceHandler("/images/food/**")
                .addResourceLocations("classpath:/static/images/food/")
                .setCachePeriod(3600);
                
        registry.addResourceHandler("/images/beverages/**")
                .addResourceLocations("classpath:/static/images/beverages/")
                .setCachePeriod(3600);
                
        registry.addResourceHandler("/images/desserts/**")
                .addResourceLocations("classpath:/static/images/desserts/")
                .setCachePeriod(3600);
                
        // Map frontend asset paths to backend static resources
        // This helps during development when assets are referenced directly
        registry.addResourceHandler("/assets/images/**")
                .addResourceLocations("classpath:/static/images/")
                .setCachePeriod(3600);
    }
}