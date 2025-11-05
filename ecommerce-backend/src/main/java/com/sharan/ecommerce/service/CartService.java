package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.cart.*;
import java.util.List;

public interface CartService {

    // Controller uses this one
    CartItemResponseDTO addToCart(String userEmail, Long productId, Integer quantity);

    // Controller uses this one
    List<CartItemResponseDTO> getCart(String userEmail);

    // Existing internal service logic
    CartResponseDTO addItemToCart(String userEmail, CartItemRequestDTO dto);

    CartResponseDTO addMultipleItemsToCart(String userEmail, List<CartItemRequestDTO> items);

    CartResponseDTO updateCartItem(String userEmail, Long itemId, CartItemRequestDTO dto);

    void removeCartItem(String userEmail, Long itemId);

    void clearCart(String userEmail);
}
