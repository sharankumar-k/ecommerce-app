// src/components/products/ProductDetails.js
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const preloadedProduct = location.state?.product || null;
  const [product, setProduct] = useState(preloadedProduct);
  const [loading, setLoading] = useState(!preloadedProduct);
  const [error, setError] = useState("");

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError("Failed to fetch product: " + msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!preloadedProduct) fetchProduct();
  }, [preloadedProduct, fetchProduct]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please login to add to cart!");
      navigate("/login");
      return;
    }
    try {
      await api.post("/cart/add", { productId: product.id, quantity: 1 });
      toast.success("🛒 Added to cart!");
    } catch {
      toast.error("❌ Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.info("Please login to add to wishlist!");
      navigate("/login");
      return;
    }
    try {
      await api.post("/wishlist/add", { productId: product.id });
      toast.success("❤️ Added to wishlist!");
    } catch {
      toast.error("❌ Failed to add to wishlist");
    }
  };

  const imageUrl =
    product?.imageUrl ||
    "https://via.placeholder.com/800x800.png?text=Product+Image";

  // 🔹 Base style for all buttons
  const buttonBase = {
    flex: "1",
    minWidth: "130px",
    padding: "12px 0",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  };

  return (
    <main className="container py-4">
      <h2 className="fw-bold text-primary mb-4">Product Details</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : !product ? (
        <p className="text-muted">Product not found.</p>
      ) : (
        <div className="row g-4">
          {/* 🖼️ Product Image Section */}
          <div className="col-md-5 text-center">
            <div
              className="p-3 border rounded shadow-sm bg-white d-flex align-items-center justify-content-center"
              style={{ height: "420px", overflow: "hidden" }}
            >
              <img
                src={imageUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/800x800.png?text=Image+Unavailable")
                }
              />
            </div>
          </div>

          {/* 🧾 Product Info Section */}
          <div className="col-md-7">
            <div className="h-100 d-flex flex-column">
              <h1 className="mb-2">{product.name}</h1>

              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="text-warning">
                  <FaStar size={14} /> {product.rating ?? "4.3"}
                </span>
                <small className="text-muted">
                  ({product.reviews ?? "1,245"} reviews)
                </small>
              </div>

              <div className="d-flex align-items-baseline gap-2 mb-3">
                <div className="fs-3 fw-bold text-success">
                  ₹{product.price ?? 0}
                </div>
                {product.mrp && (
                  <div className="text-muted text-decoration-line-through">
                    ₹{product.mrp}
                  </div>
                )}
              </div>

              <p className="text-secondary mb-3">{product.description}</p>

              {/* ✨ Buttons Section */}
              <div className="d-flex flex-wrap gap-2 mt-auto">
                {/* 🟡 Gold Add to Cart Button */}
                <button
                  style={{
                    ...buttonBase,
                    backgroundColor: "#FFD700",
                    color: "#000",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#e6c200")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#FFD700")
                  }
                  onClick={handleAddToCart}
                >
                  🛒 Add to Cart
                </button>

                {/* ❤️ Wishlist Button */}
                <button
                  style={{
                    ...buttonBase,
                    backgroundColor: "#dc3545",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#b02a37")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#dc3545")
                  }
                  onClick={handleAddToWishlist}
                >
                  ❤️ Wishlist
                </button>

                {/* ↩️ Back Button */}
                <button
                  style={{
                    ...buttonBase,
                    backgroundColor: "#6c757d",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#5c636a")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#6c757d")
                  }
                  onClick={() => navigate("/products")}
                >
                  ↩️ Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductDetails;
