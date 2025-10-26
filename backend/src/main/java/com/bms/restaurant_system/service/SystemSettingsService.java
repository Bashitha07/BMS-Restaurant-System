package com.bms.restaurant_system.service;

import com.bms.restaurant_system.entity.SystemSettings;
import com.bms.restaurant_system.repository.SystemSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemSettingsService {
    
    private final SystemSettingsRepository settingsRepository;
    
    // Constants for setting keys
    public static final String DELIVERY_FEE_KEY = "delivery_fee";
    public static final String TAX_RATE_KEY = "tax_rate";
    public static final String DEFAULT_DELIVERY_FEE = "400.00";
    public static final String DEFAULT_TAX_RATE = "0.10";
    
    /**
     * Get delivery fee from settings, or return default if not found
     */
    public BigDecimal getDeliveryFee() {
        return settingsRepository.findBySettingKey(DELIVERY_FEE_KEY)
                .map(SystemSettings::getValueAsBigDecimal)
                .orElse(new BigDecimal(DEFAULT_DELIVERY_FEE));
    }
    
    /**
     * Update delivery fee setting
     */
    @Transactional
    public SystemSettings updateDeliveryFee(BigDecimal deliveryFee) {
        SystemSettings setting = settingsRepository.findBySettingKey(DELIVERY_FEE_KEY)
                .orElse(new SystemSettings());
        
        setting.setSettingKey(DELIVERY_FEE_KEY);
        setting.setSettingValue(deliveryFee.toString());
        setting.setDescription("Delivery fee charged for delivery orders (LKR)");
        
        return settingsRepository.save(setting);
    }
    
    /**
     * Get tax rate from settings, or return default if not found
     */
    public BigDecimal getTaxRate() {
        return settingsRepository.findBySettingKey(TAX_RATE_KEY)
                .map(SystemSettings::getValueAsBigDecimal)
                .orElse(new BigDecimal(DEFAULT_TAX_RATE));
    }
    
    /**
     * Update tax rate setting
     */
    @Transactional
    public SystemSettings updateTaxRate(BigDecimal taxRate) {
        SystemSettings setting = settingsRepository.findBySettingKey(TAX_RATE_KEY)
                .orElse(new SystemSettings());
        
        setting.setSettingKey(TAX_RATE_KEY);
        setting.setSettingValue(taxRate.toString());
        setting.setDescription("Tax rate applied to orders (as decimal, e.g., 0.10 for 10%)");
        
        return settingsRepository.save(setting);
    }
    
    /**
     * Get setting by key
     */
    public SystemSettings getSetting(String key) {
        return settingsRepository.findBySettingKey(key)
                .orElse(null);
    }
    
    /**
     * Get all settings
     */
    public List<SystemSettings> getAllSettings() {
        return settingsRepository.findAll();
    }
    
    /**
     * Update or create a setting
     */
    @Transactional
    public SystemSettings updateSetting(String key, String value, String description) {
        SystemSettings setting = settingsRepository.findBySettingKey(key)
                .orElse(new SystemSettings());
        
        setting.setSettingKey(key);
        setting.setSettingValue(value);
        if (description != null) {
            setting.setDescription(description);
        }
        
        return settingsRepository.save(setting);
    }
    
    /**
     * Initialize default settings if they don't exist
     */
    @Transactional
    public void initializeDefaultSettings() {
        if (!settingsRepository.existsBySettingKey(DELIVERY_FEE_KEY)) {
            updateDeliveryFee(new BigDecimal(DEFAULT_DELIVERY_FEE));
        }
        
        if (!settingsRepository.existsBySettingKey(TAX_RATE_KEY)) {
            updateTaxRate(new BigDecimal(DEFAULT_TAX_RATE));
        }
    }
}
