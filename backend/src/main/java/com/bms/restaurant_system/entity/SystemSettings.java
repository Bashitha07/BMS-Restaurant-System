package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "setting_key", unique = true, nullable = false)
    private String settingKey;
    
    @Column(name = "setting_value", nullable = false)
    private String settingValue;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    public void prePersist() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Helper methods for common settings
    public BigDecimal getValueAsBigDecimal() {
        try {
            return new BigDecimal(this.settingValue);
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }
    
    public Integer getValueAsInteger() {
        try {
            return Integer.parseInt(this.settingValue);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
