// src/main/java/com/sharan/ecommerce/service/OrderServiceImpl.java
package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.order.OrderItemRequestDTO;
import com.sharan.ecommerce.dto.order.OrderItemResponseDTO;
import com.sharan.ecommerce.dto.order.OrderRequestDTO;
import com.sharan.ecommerce.dto.order.OrderResponseDTO;
import com.sharan.ecommerce.model.Order;
import com.sharan.ecommerce.model.OrderItem;
import com.sharan.ecommerce.model.OrderStatus;
import com.sharan.ecommerce.model.Product;
import com.sharan.ecommerce.model.User;
import com.sharan.ecommerce.repository.OrderRepository;
import com.sharan.ecommerce.repository.ProductRepository;
import com.sharan.ecommerce.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    @Override
    public OrderResponseDTO createOrder(String userEmail, OrderRequestDTO dto) {
        logger.info("Creating order for user: {}", userEmail);
        if (userEmail == null) {
            logger.error("User email is null");
            throw new IllegalArgumentException("User email cannot be null");
        }
        if (dto == null || dto.getItems() == null || dto.getItems().isEmpty()) {
            logger.error("Order request is null or has empty items");
            throw new IllegalArgumentException("Order items cannot be empty");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", userEmail);
                    return new IllegalArgumentException("User not found: " + userEmail);
                });

        // Validate all product IDs first
        List<Long> invalidProductIds = new ArrayList<>();
        for (OrderItemRequestDTO item : dto.getItems()) {
            if (item.getProductId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                logger.error("Invalid item: productId={}, quantity={}", item.getProductId(), item.getQuantity());
                throw new IllegalArgumentException("Invalid product ID or quantity in item: " + item);
            }
            if (!productRepository.existsById(item.getProductId())) {
                invalidProductIds.add(item.getProductId());
            }
        }
        if (!invalidProductIds.isEmpty()) {
            logger.error("Products not found: IDs {}", invalidProductIds);
            throw new IllegalArgumentException("Products not found: IDs " + invalidProductIds);
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = dto.getItems().stream().map(item -> {
            Product product = productRepository.findById(item.getProductId()).orElseThrow();
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setOrder(order);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return orderItem;
        }).collect(Collectors.toList());

        order.setOrderItems(orderItems);

        BigDecimal total = orderItems.stream()
                .map(OrderItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        logger.info("Saving order with {} items, total: {}", orderItems.size(), total);
        Order savedOrder = orderRepository.save(order);
        logger.info("Order saved: ID {}", savedOrder.getId());

        OrderResponseDTO response = new OrderResponseDTO();
        response.setId(savedOrder.getId());
        response.setUserId(user.getId());
        response.setStatus(savedOrder.getStatus().name());
        response.setTotalAmount(savedOrder.getTotalAmount());
        response.setCreatedAt(savedOrder.getCreatedAt());
        response.setItems(orderItems.stream().map(oi -> {
            OrderItemResponseDTO itemDto = new OrderItemResponseDTO();
            itemDto.setId(oi.getId());
            itemDto.setProductName(oi.getProduct().getName());
            itemDto.setQuantity(oi.getQuantity());
            itemDto.setPrice(oi.getPrice());
            return itemDto;
        }).collect(Collectors.toList()));

        return response;
    }

    @Transactional(readOnly = true)
    @Override
    public List<OrderResponseDTO> getOrdersByEmail(String userEmail) {
        logger.info("Fetching orders for user: {}", userEmail);
        if (userEmail == null) {
            logger.error("User email is null");
            throw new IllegalArgumentException("User email cannot be null");
        }

        List<Order> orders = orderRepository.findByUserEmail(userEmail);
        logger.info("Found {} orders for user {}", orders.size(), userEmail);

        return orders.stream().map(order -> {
            OrderResponseDTO response = new OrderResponseDTO();
            response.setId(order.getId());
            response.setUserId(order.getUser().getId());
            response.setStatus(order.getStatus().name());
            response.setTotalAmount(order.getTotalAmount());
            response.setCreatedAt(order.getCreatedAt());
            response.setPaymentMethod(order.getPayment() != null ? order.getPayment().getPaymentMethod().name() : null);
            response.setItems(order.getOrderItems().stream().map(oi -> {
                OrderItemResponseDTO itemDto = new OrderItemResponseDTO();
                itemDto.setId(oi.getId());
                itemDto.setProductName(oi.getProduct().getName());
                itemDto.setQuantity(oi.getQuantity());
                itemDto.setPrice(oi.getPrice());
                return itemDto;
            }).collect(Collectors.toList()));
            return response;
        }).collect(Collectors.toList());
    }
}

