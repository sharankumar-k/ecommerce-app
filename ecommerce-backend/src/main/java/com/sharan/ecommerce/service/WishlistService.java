package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.wishlist.WishlistRequestDTO;
import com.sharan.ecommerce.dto.wishlist.WishlistResponseDTO;

import java.util.List;

public interface WishlistService {
    List<WishlistResponseDTO> getWishlist(String userEmail);
    WishlistResponseDTO addToWishlist(String userEmail, WishlistRequestDTO dto);
    String removeFromWishlist(String userEmail, Long productId);
}
