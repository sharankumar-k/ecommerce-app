package com.sharan.ecommerce.dto.wishlist;

public class WishlistResponseDTO {

    private Long id;           // Wishlist entry ID
    private Long productId;    // Product ID
    private String productName; // Product name

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
}
