package com.sharan.ecommerce.dto.wishlist;

import java.math.BigDecimal;

public class WishlistResponseDTO {

    private Long id;           
    private Long productId;    
    private String productName;
    private BigDecimal price;  // ✅ NEW
    private String imageUrl;   // ✅ NEW

    public WishlistResponseDTO() {}

    public WishlistResponseDTO(Long id, Long productId, String productName, BigDecimal price, String imageUrl) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
