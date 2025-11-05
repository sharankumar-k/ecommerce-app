// src/main/java/com/sharan/ecommerce/service/PaymentServiceImpl.java
package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.payment.PaymentRequestDTO;
import com.sharan.ecommerce.dto.payment.PaymentResponseDTO;
import com.sharan.ecommerce.model.Order;
import com.sharan.ecommerce.model.OrderStatus;
import com.sharan.ecommerce.model.Payment;
import com.sharan.ecommerce.model.PaymentMethod;
import com.sharan.ecommerce.model.PaymentStatus;
import com.sharan.ecommerce.repository.OrderRepository;
import com.sharan.ecommerce.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Correct import

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    @Transactional // Use Spring's @Transactional, omit rollbackOn if not needed
    public PaymentResponseDTO makePayment(PaymentRequestDTO request, String userEmail) {
        logger.info("Processing payment for amount: {}, method: {}, orderId: {}, user: {}", 
                    request.getAmount(), request.getMethod(), request.getOrderId(), userEmail);
        
        if (userEmail == null || userEmail.isEmpty()) {
            logger.warn("User not authenticated");
            throw new IllegalArgumentException("User not authenticated");
        }
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            logger.warn("Invalid payment amount: {}", request.getAmount());
            throw new IllegalArgumentException("Invalid payment amount");
        }
        if (request.getOrderId() == null) {
            logger.warn("Order ID is required");
            throw new IllegalArgumentException("Order ID is required");
        }

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> {
                    logger.error("Order not found: {}", request.getOrderId());
                    return new IllegalArgumentException("Order not found: " + request.getOrderId());
                });

        if (!order.getUser().getEmail().equals(userEmail)) {
            logger.warn("Order {} does not belong to user {}", request.getOrderId(), userEmail);
            throw new IllegalArgumentException("Order does not belong to user");
        }

        if (request.getAmount().compareTo(order.getTotalAmount()) != 0) {
            logger.warn("Payment amount {} does not match order total {}", request.getAmount(), order.getTotalAmount());
            throw new IllegalArgumentException("Payment amount does not match order total");
        }

        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(request.getMethod());
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid payment method: {}", request.getMethod());
            throw new IllegalArgumentException("Invalid payment method: " + request.getMethod());
        }

        Payment payment = new Payment();
        payment.setPaymentReference(UUID.randomUUID().toString());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(paymentMethod);
        payment.setOrder(order);
        payment.setPaymentDate(LocalDateTime.now());

        if (paymentMethod == PaymentMethod.COD) {
            payment.setStatus(PaymentStatus.PENDING);
            order.setStatus(OrderStatus.PENDING);
        } else {
            payment.setStatus(PaymentStatus.SUCCESS);
            order.setStatus(OrderStatus.COMPLETED);
        }

        logger.info("Before saving payment: ID={}, Status={}", payment.getId(), payment.getStatus());
        paymentRepository.save(payment);
        logger.info("After saving payment: ID={}, Status={}", payment.getId(), payment.getStatus());
        logger.info("Before saving order: ID={}, Status={}", order.getId(), order.getStatus());
        orderRepository.save(order);
        logger.info("After saving order: ID={}, Status={}", order.getId(), order.getStatus());

        Order updatedOrder = orderRepository.findById(order.getId()).orElseThrow(() -> 
            new IllegalStateException("Order not found after save: " + order.getId()));
        logger.info("Verified order status in DB: ID={}, Status={}", updatedOrder.getId(), updatedOrder.getStatus());

        logger.info("Payment processed: reference={}, status={}, orderId={}", 
                    payment.getPaymentReference(), payment.getStatus(), order.getId());

        PaymentResponseDTO response = new PaymentResponseDTO();
        response.setPaymentReference(payment.getPaymentReference());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus().name());
        response.setOrderId(order.getId());
        response.setOrderStatus(order.getStatus().name());

        return response;
    }
}

