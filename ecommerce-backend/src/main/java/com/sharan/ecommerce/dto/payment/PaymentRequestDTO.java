// src/main/java/com/sharan/ecommerce/dto/payment/PaymentRequestDTO.java
package com.sharan.ecommerce.dto.payment;

import java.math.BigDecimal;

public class PaymentRequestDTO {
    private BigDecimal amount;
    private String method;
    private Long orderId;

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
}