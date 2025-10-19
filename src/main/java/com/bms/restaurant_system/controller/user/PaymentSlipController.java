package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.PaymentSlipDTO;
import com.bms.restaurant_system.service.PaymentSlipService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/payment-slips")
public class PaymentSlipController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentSlipController.class);

    @Autowired
    private PaymentSlipService paymentSlipService;

    // Upload payment slip
    @PostMapping("/upload")
    public ResponseEntity<?> uploadPaymentSlip(
            @RequestParam("orderId") Long orderId,
            @RequestParam("userId") Long userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("paymentAmount") BigDecimal paymentAmount,
            @RequestParam("paymentDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime paymentDate,
            @RequestParam(value = "bankName", required = false) String bankName,
            @RequestParam(value = "transactionReference", required = false) String transactionReference) {
        
        logger.info("User {} uploading payment slip for order {}", userId, orderId);
        
        try {
            PaymentSlipDTO uploaded = paymentSlipService.uploadPaymentSlip(
                orderId, userId, file, paymentAmount, paymentDate, bankName, transactionReference);
            
            logger.info("Payment slip uploaded successfully with id: {}", uploaded.id());
            return ResponseEntity.ok(uploaded);
        } catch (Exception e) {
            logger.error("Error uploading payment slip for order {}: {}", orderId, e.getMessage());
            return ResponseEntity.status(400).body("Failed to upload payment slip: " + e.getMessage());
        }
    }

    // Get user's payment slips
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentSlipDTO>> getUserPaymentSlips(@PathVariable Long userId) {
        logger.info("Fetching payment slips for user: {}", userId);
        return ResponseEntity.ok(paymentSlipService.getUserPaymentSlips(userId));
    }

    // Get payment slip by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentSlipById(@PathVariable Long id) {
        logger.info("Fetching payment slip with id: {}", id);
        try {
            PaymentSlipDTO paymentSlip = paymentSlipService.getPaymentSlipById(id);
            return ResponseEntity.ok(paymentSlip);
        } catch (Exception e) {
            logger.error("Error fetching payment slip {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Payment slip not found");
        }
    }
}