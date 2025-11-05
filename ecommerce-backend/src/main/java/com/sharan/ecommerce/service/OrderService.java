package com.sharan.ecommerce.service;

import java.util.List;

import com.sharan.ecommerce.dto.order.OrderRequestDTO;
import com.sharan.ecommerce.dto.order.OrderResponseDTO;

public interface OrderService {
    OrderResponseDTO createOrder(String userEmail, OrderRequestDTO dto);
    List<OrderResponseDTO> getOrdersByEmail(String userEmail);
}