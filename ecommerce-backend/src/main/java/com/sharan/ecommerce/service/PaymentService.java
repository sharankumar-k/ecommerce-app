
package com.sharan.ecommerce.service;

import com.sharan.ecommerce.dto.payment.PaymentRequestDTO;
import com.sharan.ecommerce.dto.payment.PaymentResponseDTO;

public interface PaymentService {
    PaymentResponseDTO makePayment(PaymentRequestDTO request, String userEmail);
}