package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.wishlist.WishlistRequestDTO;
import com.sharan.ecommerce.dto.wishlist.WishlistResponseDTO;
import com.sharan.ecommerce.exception.ResourceNotFoundException;
import com.sharan.ecommerce.model.Product;
import com.sharan.ecommerce.model.User;
import com.sharan.ecommerce.model.WishlistItem;
import com.sharan.ecommerce.repository.ProductRepository;
import com.sharan.ecommerce.repository.UserRepository;
import com.sharan.ecommerce.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Override
    public List<WishlistResponseDTO> getWishlist(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return wishlistRepository.findByUser(user)
                .stream()
                .map(w -> new WishlistResponseDTO(
                        w.getId(),
                        w.getProduct().getId(),
                        w.getProduct().getName(),
                        w.getProduct().getPrice(),
                        w.getProduct().getImageUrl() // ✅ include image
                ))
                .collect(Collectors.toList());
    }

    @Override
    public WishlistResponseDTO addToWishlist(String userEmail, WishlistRequestDTO dto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        boolean exists = wishlistRepository.findByUserAndProductId(user, product.getId()).isPresent();
        if (exists) {
            throw new RuntimeException("Product already in wishlist");
        }

        WishlistItem wishlist = new WishlistItem();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        wishlistRepository.save(wishlist);

        return new WishlistResponseDTO(
                wishlist.getId(),
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getImageUrl() // ✅ include image
        );
    }

    @Override
    public String removeFromWishlist(String userEmail, Long productId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WishlistItem wishlist = wishlistRepository.findByUserAndProductId(user, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item not found"));

        wishlistRepository.delete(wishlist);
        return "Product removed from wishlist";
    }
}
