// src/main/java/com/sharan/ecommerce/repository/PaymentRepository.java
package com.sharan.ecommerce.repository;

import com.sharan.ecommerce.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}