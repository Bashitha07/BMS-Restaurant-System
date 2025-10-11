package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.PaymentSlipDTO;
import com.bms.restaurant_system.entity.PaymentSlip;
import com.bms.restaurant_system.service.PaymentSlipService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/payment-slips")
public class AdminPaymentSlipController {
    private static final Logger logger = LoggerFactory.getLogger(AdminPaymentSlipController.class);

    @Autowired
    private PaymentSlipService paymentSlipService;

    // Get all payment slips
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentSlipDTO>> getAllPaymentSlips() {
        logger.info("Admin fetching all payment slips");
        return ResponseEntity.ok(paymentSlipService.getAllPaymentSlips());
    }

    // Get pending payment slips
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentSlipDTO>> getPendingPaymentSlips() {
        logger.info("Admin fetching pending payment slips");
        return ResponseEntity.ok(paymentSlipService.getPendingPaymentSlips());
    }

    // Get payment slips by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentSlipDTO>> getPaymentSlipsByStatus(@PathVariable String status) {
        logger.info("Admin fetching payment slips with status: {}", status);
        try {
            PaymentSlip.PaymentSlipStatus slipStatus = PaymentSlip.PaymentSlipStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(paymentSlipService.getPaymentSlipsByStatus(slipStatus));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid payment slip status: {}", status);
            return ResponseEntity.badRequest().build();
        }
    }

    // Get payment slip by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPaymentSlipById(@PathVariable Long id) {
        logger.info("Admin fetching payment slip with id: {}", id);
        try {
            PaymentSlipDTO paymentSlip = paymentSlipService.getPaymentSlipById(id);
            return ResponseEntity.ok(paymentSlip);
        } catch (Exception e) {
            logger.error("Error fetching payment slip {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Payment slip not found");
        }
    }

    // Confirm payment slip
    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> confirmPaymentSlip(@PathVariable Long id, @RequestBody Map<String, String> confirmationData) {
        logger.info("Admin confirming payment slip: {}", id);
        try {
            String adminUsername = confirmationData.get("adminUsername");
            String notes = confirmationData.get("notes");
            
            PaymentSlipDTO confirmed = paymentSlipService.confirmPaymentSlip(id, adminUsername, notes);
            logger.info("Payment slip {} confirmed successfully", id);
            return ResponseEntity.ok(confirmed);
        } catch (Exception e) {
            logger.error("Error confirming payment slip {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to confirm payment slip: " + e.getMessage());
        }
    }

    // Reject payment slip
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectPaymentSlip(@PathVariable Long id, @RequestBody Map<String, String> rejectionData) {
        logger.info("Admin rejecting payment slip: {}", id);
        try {
            String adminUsername = rejectionData.get("adminUsername");
            String reason = rejectionData.get("reason");
            String notes = rejectionData.get("notes");
            
            PaymentSlipDTO rejected = paymentSlipService.rejectPaymentSlip(id, adminUsername, reason, notes);
            logger.info("Payment slip {} rejected successfully", id);
            return ResponseEntity.ok(rejected);
        } catch (Exception e) {
            logger.error("Error rejecting payment slip {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to reject payment slip: " + e.getMessage());
        }
    }

    // Delete payment slip
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePaymentSlip(@PathVariable Long id) {
        logger.info("Admin deleting payment slip: {}", id);
        try {
            paymentSlipService.deletePaymentSlip(id);
            logger.info("Payment slip {} deleted successfully", id);
            return ResponseEntity.ok("Payment slip deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting payment slip {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to delete payment slip: " + e.getMessage());
        }
    }

    // Get payment slip statistics
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPaymentSlipStatistics() {
        logger.info("Admin fetching payment slip statistics");
        try {
            Map<String, Object> stats = paymentSlipService.getPaymentSlipStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching payment slip statistics: {}", e.getMessage());
            return ResponseEntity.status(500).body("Failed to fetch statistics");
        }
    }
}