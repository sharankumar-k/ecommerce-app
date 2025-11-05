package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.order.OrderItemRequestDTO;
import com.sharan.ecommerce.dto.order.OrderItemResponseDTO;

import java.util.List;

public interface OrderItemService {

    List<OrderItemResponseDTO> getItemsByOrderDTO(Long orderId, Long userId);

    String updateOrderItem(Long itemId, OrderItemRequestDTO dto, Long userId);

    String deleteOrderItem(Long itemId, Long userId);
}
