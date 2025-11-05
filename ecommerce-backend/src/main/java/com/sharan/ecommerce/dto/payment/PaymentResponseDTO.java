// src/main/java/com/sharan/ecommerce/dto/payment/PaymentResponseDTO.java
package com.sharan.ecommerce.dto.payment;

import java.math.BigDecimal;

public class PaymentResponseDTO {
    private String paymentReference;
    private BigDecimal amount;
    private String status; // Payment status
    private Long orderId;
    private String orderStatus; // Add order status

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }
}