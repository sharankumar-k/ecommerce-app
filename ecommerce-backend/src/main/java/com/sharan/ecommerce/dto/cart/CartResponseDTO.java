package com.sharan.ecommerce.dto.cart;

import java.util.List;

public class CartResponseDTO {
    private Long userId;
    private List<CartItemResponseDTO> items;

    public CartResponseDTO() {}

    public CartResponseDTO(List<CartItemResponseDTO> items) {
        this.items = items;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<CartItemResponseDTO> getItems() { return items; }
    public void setItems(List<CartItemResponseDTO> items) { this.items = items; }
}
