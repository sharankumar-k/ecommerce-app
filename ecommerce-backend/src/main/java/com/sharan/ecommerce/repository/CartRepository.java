// src/main/java/com/sharan/ecommerce/repository/CartRepository.java
package com.sharan.ecommerce.repository;

import com.sharan.ecommerce.model.Cart;
import com.sharan.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Fetch all cart items for a specific user
    List<Cart> findByUser(User user);

    // Delete all cart items for a specific user
    void deleteByUser(User user);
}
