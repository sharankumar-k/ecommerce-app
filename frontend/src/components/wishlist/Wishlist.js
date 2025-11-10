import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await api.get("/wishlist");
      setWishlist(response.data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch wishlist: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      toast.success("Removed from wishlist!");
      setWishlist(wishlist.filter((item) => item.productId !== productId));
    } catch {
      toast.error("Failed to remove from wishlist.");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post("/cart/add", { productId, quantity: 1 });
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart.");
    }
  };

  const buttonStyle = {
    minWidth: "120px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-danger">❤️ Your Wishlist</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : wishlist.length === 0 ? (
        <p className="text-muted text-center fs-5">Your wishlist is empty.</p>
      ) : (
        <div className="row g-3">
          {wishlist.map((item) => (
            <div className="col-md-4" key={item.id || Math.random()}>
              <div
                className="card border-0 shadow-sm h-100 text-center p-3"
                style={{
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
              >
                <img
                  src={
                    item.imageUrl ||
                    "https://via.placeholder.com/140x140.png?text=No+Image"
                  }
                  alt={item.productName}
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "contain",
                    margin: "10px auto",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "5px",
                  }}
                />
                <h6 className="fw-semibold mt-2">{item.productName}</h6>
                <p className="text-success fw-bold mb-3">
                  ₹{(item.price || 0).toFixed(2)}
                </p>

                <div className="d-flex justify-content-center gap-2">
                  <button
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(135deg, #FFD700, #E6B800)",
                      color: "#000",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background =
                        "linear-gradient(135deg, #FFE55C, #FFCA28)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background =
                        "linear-gradient(135deg, #FFD700, #E6B800)")
                    }
                    onClick={() => handleAddToCart(item.productId)}
                  >
                    🛒 Add to Cart
                  </button>

                  <button
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(135deg, #FF4D4D, #E53935)",
                      color: "#fff",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background =
                        "linear-gradient(135deg, #FF6B6B, #EF5350)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background =
                        "linear-gradient(135deg, #FF4D4D, #E53935)")
                    }
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
