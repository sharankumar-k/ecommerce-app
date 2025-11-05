// src/main/java/com/sharan/ecommerce/controller/CartController.java
package com.sharan.ecommerce.controller;

import com.sharan.ecommerce.dto.cart.CartItemRequestDTO;
import com.sharan.ecommerce.dto.cart.CartItemResponseDTO;
import com.sharan.ecommerce.dto.cart.CartResponseDTO;
import com.sharan.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    private String getUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping
    public ResponseEntity<?> getCart() {
        try {
            List<CartItemResponseDTO> cartItems = cartService.getCart(getUserEmail());
            return ResponseEntity.ok(new CartResponseDTO(cartItems));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching cart: " + e.getMessage());
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequestDTO request) {
        try {
            CartItemResponseDTO item = cartService.addToCart(getUserEmail(), request.getProductId(), request.getQuantity());
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error adding to cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        try {
            cartService.clearCart(getUserEmail());
            return ResponseEntity.ok("Cart cleared");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error clearing cart: " + e.getMessage());
        }
    }
}





