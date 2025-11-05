
package com.sharan.ecommerce.controller;

import com.sharan.ecommerce.dto.order.OrderItemRequestDTO;
import com.sharan.ecommerce.dto.order.OrderItemResponseDTO;
import com.sharan.ecommerce.model.User;
import com.sharan.ecommerce.repository.UserRepository;
import com.sharan.ecommerce.service.OrderItemService;
import com.sharan.ecommerce.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    @Autowired
    private UserRepository userRepository;

    // Get all items of a specific order
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItemResponseDTO>> getItemsByOrder(Authentication auth,
                                                                      @PathVariable Long orderId) {
        String email = auth.getName(); // get email from JWT
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<OrderItemResponseDTO> items = orderItemService.getItemsByOrderDTO(orderId, user.getId());
        return ResponseEntity.ok(items);
    }

    // Update an order item quantity
    @PutMapping("/update/{itemId}")
    public ResponseEntity<String> updateOrderItem(Authentication auth,
                                                  @PathVariable Long itemId,
                                                  @RequestBody OrderItemRequestDTO dto) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String result = orderItemService.updateOrderItem(itemId, dto, user.getId());
        return ResponseEntity.ok(result);
    }

    // Delete an order item
    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<String> deleteOrderItem(Authentication auth,
                                                  @PathVariable Long itemId) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String result = orderItemService.deleteOrderItem(itemId, user.getId());
        return ResponseEntity.ok(result);
    }
}