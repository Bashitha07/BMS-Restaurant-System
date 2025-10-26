package com.bms.restaurant_system.controller.admin;

import com.bms.restaurant_system.entity.SystemSettings;
import com.bms.restaurant_system.service.SystemSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettingsController {
    
    private final SystemSettingsService settingsService;
    
    /**
     * Get all system settings
     */
    @GetMapping
    public ResponseEntity<List<SystemSettings>> getAllSettings() {
        return ResponseEntity.ok(settingsService.getAllSettings());
    }
    
    /**
     * Get delivery fee
     */
    @GetMapping("/delivery-fee")
    public ResponseEntity<Map<String, Object>> getDeliveryFee() {
        BigDecimal deliveryFee = settingsService.getDeliveryFee();
        Map<String, Object> response = new HashMap<>();
        response.put("deliveryFee", deliveryFee);
        response.put("key", SystemSettingsService.DELIVERY_FEE_KEY);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Update delivery fee
     */
    @PutMapping("/delivery-fee")
    public ResponseEntity<Map<String, Object>> updateDeliveryFee(@RequestBody Map<String, String> request) {
        try {
            BigDecimal deliveryFee = new BigDecimal(request.get("deliveryFee"));
            
            if (deliveryFee.compareTo(BigDecimal.ZERO) < 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Delivery fee cannot be negative"
                ));
            }
            
            SystemSettings updated = settingsService.updateDeliveryFee(deliveryFee);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("deliveryFee", deliveryFee);
            response.put("message", "Delivery fee updated successfully");
            response.put("setting", updated);
            
            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid delivery fee format"
            ));
        }
    }
    
    /**
     * Get tax rate
     */
    @GetMapping("/tax-rate")
    public ResponseEntity<Map<String, Object>> getTaxRate() {
        BigDecimal taxRate = settingsService.getTaxRate();
        Map<String, Object> response = new HashMap<>();
        response.put("taxRate", taxRate);
        response.put("taxPercentage", taxRate.multiply(new BigDecimal("100")));
        response.put("key", SystemSettingsService.TAX_RATE_KEY);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Update tax rate
     */
    @PutMapping("/tax-rate")
    public ResponseEntity<Map<String, Object>> updateTaxRate(@RequestBody Map<String, String> request) {
        try {
            BigDecimal taxRate = new BigDecimal(request.get("taxRate"));
            
            if (taxRate.compareTo(BigDecimal.ZERO) < 0 || taxRate.compareTo(BigDecimal.ONE) > 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tax rate must be between 0 and 1"
                ));
            }
            
            SystemSettings updated = settingsService.updateTaxRate(taxRate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("taxRate", taxRate);
            response.put("taxPercentage", taxRate.multiply(new BigDecimal("100")));
            response.put("message", "Tax rate updated successfully");
            response.put("setting", updated);
            
            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid tax rate format"
            ));
        }
    }
    
    /**
     * Get a specific setting by key
     */
    @GetMapping("/{key}")
    public ResponseEntity<SystemSettings> getSetting(@PathVariable String key) {
        SystemSettings setting = settingsService.getSetting(key);
        if (setting == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(setting);
    }
    
    /**
     * Update or create a setting
     */
    @PutMapping("/{key}")
    public ResponseEntity<SystemSettings> updateSetting(
            @PathVariable String key,
            @RequestBody Map<String, String> request) {
        
        String value = request.get("value");
        String description = request.get("description");
        
        if (value == null) {
            return ResponseEntity.badRequest().build();
        }
        
        SystemSettings updated = settingsService.updateSetting(key, value, description);
        return ResponseEntity.ok(updated);
    }
}
