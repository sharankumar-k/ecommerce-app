// src/main/java/com/sharan/ecommerce/controller/OrderController.java
package com.sharan.ecommerce.controller;

import com.sharan.ecommerce.dto.order.OrderRequestDTO;
import com.sharan.ecommerce.dto.order.OrderResponseDTO;
import com.sharan.ecommerce.model.Order;
import com.sharan.ecommerce.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    // Get current user email from security context
    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    // Create a new order (checkout)
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequest) {
        logger.info("Received order creation request: {}", orderRequest);
        try {
            if (orderRequest == null || orderRequest.getItems() == null || orderRequest.getItems().isEmpty()) {
                logger.warn("Invalid order request: null or empty items");
                return ResponseEntity.badRequest().body("Order items cannot be empty");
            }
            String email = getCurrentUserEmail();
            if (email == null) {
                logger.warn("No authenticated user found");
                return ResponseEntity.status(401).body("Unauthorized: Please log in");
            }
            OrderResponseDTO response = orderService.createOrder(email, orderRequest);
            logger.info("Order created successfully: ID {}", response.getId());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating order: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }

    // Fetch user orders
    @GetMapping
    public ResponseEntity<?> getOrders() {
        try {
            String userEmail = getCurrentUserEmail();
            logger.info("Fetching orders for user: {}", userEmail);
            List<OrderResponseDTO> orders = orderService.getOrdersByEmail(userEmail);
            logger.info("Found {} orders for user {}", orders.size(), userEmail);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Error fetching orders: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }
}