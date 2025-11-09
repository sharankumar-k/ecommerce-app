package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.cart.*;
import com.sharan.ecommerce.model.Cart;
import com.sharan.ecommerce.model.Product;
import com.sharan.ecommerce.model.User;
import com.sharan.ecommerce.repository.CartRepository;
import com.sharan.ecommerce.repository.ProductRepository;
import com.sharan.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public CartItemResponseDTO addToCart(String userEmail, Long productId, Integer quantity) {
        CartItemRequestDTO dto = new CartItemRequestDTO();
        dto.setProductId(productId);
        dto.setQuantity(quantity);

        CartResponseDTO cartResponse = addItemToCart(userEmail, dto);

        return cartResponse.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .orElse(null);
    }

    @Override
    @Transactional
    public List<CartItemResponseDTO> getCart(String userEmail) {
        return getCartForUser(userEmail).getItems();
    }

    @Override
    @Transactional
    public CartResponseDTO addItemToCart(String userEmail, CartItemRequestDTO dto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart existing = cartRepository.findByUser(user).stream()
                .filter(c -> c.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + dto.getQuantity());
            cartRepository.save(existing);
        } else {
            Cart cart = new Cart();
            cart.setUser(user);
            cart.setProduct(product);
            cart.setQuantity(dto.getQuantity());
            cartRepository.save(cart);
        }

        return getCartForUser(userEmail);
    }

    @Transactional
    public CartResponseDTO getCartForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItemResponseDTO> itemResponses = cartRepository.findByUser(user)
                .stream()
                .map(c -> new CartItemResponseDTO(
                        c.getId(),
                        c.getProduct().getId(),
                        c.getProduct().getName(),
                        c.getProduct().getPrice(),
                        c.getQuantity(),
                        c.getProduct().getImageUrl() // ✅ include image
                ))
                .collect(Collectors.toList());

        CartResponseDTO response = new CartResponseDTO(itemResponses);
        response.setUserId(user.getId());
        return response;
    }

    @Override
    @Transactional
    public CartResponseDTO addMultipleItemsToCart(String userEmail, List<CartItemRequestDTO> items) {
        for (CartItemRequestDTO item : items) {
            addItemToCart(userEmail, item);
        }
        return getCartForUser(userEmail);
    }

    @Override
    @Transactional
    public CartResponseDTO updateCartItem(String userEmail, Long itemId, CartItemRequestDTO dto) {
        Cart cart = cartRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cart.setQuantity(dto.getQuantity());
        cartRepository.save(cart);

        return getCartForUser(userEmail);
    }

    @Override
    @Transactional
    public void removeCartItem(String userEmail, Long itemId) {
        cartRepository.deleteById(itemId);
    }

    @Override
    @Transactional
    public void clearCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartRepository.deleteByUser(user);
    }
}
