package com.sharan.ecommerce.controller;

import com.sharan.ecommerce.dto.wishlist.WishlistRequestDTO;
import com.sharan.ecommerce.dto.wishlist.WishlistResponseDTO;
import com.sharan.ecommerce.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/add")
    public ResponseEntity<WishlistResponseDTO> addToWishlist(@RequestBody WishlistRequestDTO request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        WishlistResponseDTO item = wishlistService.addToWishlist(email, request);
        return ResponseEntity.ok(item);
    }

    @GetMapping
    public ResponseEntity<List<WishlistResponseDTO>> getWishlist() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<WishlistResponseDTO> items = wishlistService.getWishlist(email);
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Long productId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String msg = wishlistService.removeFromWishlist(email, productId);
        return ResponseEntity.ok(msg);
    }
}
