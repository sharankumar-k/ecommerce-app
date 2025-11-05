// src/main/java/com/sharan/ecommerce/repository/OrderRepository.java
package com.sharan.ecommerce.repository;

import com.sharan.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserEmail(String email);

    @Query("SELECT o FROM Order o WHERE o.user.email = :email ORDER BY o.createdAt DESC")
    Optional<Order> findFirstByUserEmailOrderByCreatedAtDesc(String email);
}