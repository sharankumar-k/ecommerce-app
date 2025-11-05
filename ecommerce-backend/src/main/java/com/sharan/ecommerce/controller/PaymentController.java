// src/main/java/com/sharan/ecommerce/controller/PaymentController.java
package com.sharan.ecommerce.controller;

import com.sharan.ecommerce.dto.payment.PaymentRequestDTO;
import com.sharan.ecommerce.dto.payment.PaymentResponseDTO;
import com.sharan.ecommerce.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping("/make")
    public ResponseEntity<?> makePayment(@RequestBody PaymentRequestDTO request) {
        try {
            logger.info("Processing payment for amount: {}, method: {}, orderId: {}", 
                        request.getAmount(), request.getMethod(), request.getOrderId());
            PaymentResponseDTO response = paymentService.makePayment(request, getCurrentUserEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid payment request: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error processing payment: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }
}