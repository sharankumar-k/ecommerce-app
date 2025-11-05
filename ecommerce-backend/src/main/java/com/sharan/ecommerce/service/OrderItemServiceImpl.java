package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.order.OrderItemRequestDTO;
import com.sharan.ecommerce.dto.order.OrderItemResponseDTO;
import com.sharan.ecommerce.model.Order;
import com.sharan.ecommerce.model.OrderItem;
import com.sharan.ecommerce.model.User;
import com.sharan.ecommerce.repository.OrderItemRepository;
import com.sharan.ecommerce.repository.OrderRepository;
import com.sharan.ecommerce.repository.UserRepository;
import com.sharan.ecommerce.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<OrderItemResponseDTO> getItemsByOrderDTO(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        return order.getOrderItems().stream().map(item -> {
            OrderItemResponseDTO dto = new OrderItemResponseDTO();
            dto.setId(item.getId());
            dto.setProductName(item.getProduct().getName());
            dto.setQuantity(item.getQuantity());
            dto.setPrice(item.getPrice());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public String updateOrderItem(Long itemId, OrderItemRequestDTO dto, Long userId) {
        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));

        if (!item.getOrder().getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        item.setQuantity(dto.getQuantity());
        item.setPrice(item.getProduct().getPrice().multiply(
                java.math.BigDecimal.valueOf(dto.getQuantity())
        ));

        orderItemRepository.save(item);
        return "Order item updated successfully";
    }

    @Override
    public String deleteOrderItem(Long itemId, Long userId) {
        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));

        if (!item.getOrder().getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        orderItemRepository.delete(item);
        return "Order item deleted successfully";
    }
}
