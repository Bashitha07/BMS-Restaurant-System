package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.PaymentDTO;
import com.bms.restaurant_system.service.PaymentService;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        logger.info("Fetching all payments");
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Long id) {
        logger.info("Fetching payment with id: {}", id);
        try {
            PaymentDTO payment = paymentService.getPaymentById(id);
            logger.info("Payment found with id: {}", id);
            return ResponseEntity.ok(payment);
        } catch (ResourceNotFoundException e) {
            logger.warn("Payment not found with id: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(@Valid @RequestBody PaymentDTO paymentDTO) {
        logger.info("Creating new payment");
        PaymentDTO createdPayment = paymentService.createPayment(paymentDTO);
        logger.info("Payment created with id: {}", createdPayment.id());
        return ResponseEntity.ok(createdPayment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentDTO> updatePayment(@PathVariable Long id, @Valid @RequestBody PaymentDTO paymentDTO) {
        logger.info("Updating payment with id: {}", id);
        PaymentDTO updatedPayment = paymentService.updatePayment(id, paymentDTO);
        logger.info("Payment updated with id: {}", id);
        return ResponseEntity.ok(updatedPayment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        logger.info("Deleting payment with id: {}", id);
        paymentService.deletePayment(id);
        logger.info("Payment deleted with id: {}", id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<PaymentDTO> approvePayment(@PathVariable Long id) {
        logger.info("Approving payment with id: {}", id);
        PaymentDTO approvedPayment = paymentService.approvePayment(id);
        logger.info("Payment approved with id: {}", id);
        return ResponseEntity.ok(approvedPayment);
    }
}
