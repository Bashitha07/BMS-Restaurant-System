package com.bms.restaurant_system.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT Configuration Properties
 * Maps jwt.* properties from application.properties
 */
@Component
@ConfigurationProperties(prefix = "jwt")
@EnableConfigurationProperties
public class JwtProperties {
    
    private String secret = "mySecretKey123456789012345678901234567890";
    private long expiration = 86400000; // 24 hours in milliseconds
    
    public String getSecret() {
        return secret;
    }
    
    public void setSecret(String secret) {
        this.secret = secret;
    }
    
    public long getExpiration() {
        return expiration;
    }
    
    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }
}