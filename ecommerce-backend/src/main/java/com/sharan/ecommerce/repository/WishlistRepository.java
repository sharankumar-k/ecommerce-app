package com.sharan.ecommerce.repository;

import com.sharan.ecommerce.model.User;
import com.sharan.ecommerce.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUser(User user);
    Optional<WishlistItem> findByUserAndProductId(User user, Long productId);
}
