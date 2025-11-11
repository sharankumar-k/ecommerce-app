import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cart");
      setCart(response.data.items || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch cart: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0).toFixed(2);

  const handleClearCart = async () => {
    try {
      await api.delete("/cart/clear");
      setCart([]);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  const buttonStyle = {
    minWidth: "140px",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-primary">🛒 Your Shopping Cart</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : cart.length === 0 ? (
        <div className="text-center py-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/102/102661.png"
            alt="Empty cart"
            width="120"
            height="120"
            className="mb-3"
          />
          <p className="text-muted fs-5">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold">{item.productName}</td>
                    <td>
                      <img
                        src={
                          item.imageUrl ||
                          "https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                        }
                        alt={item.productName}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                          borderRadius: "6px",
                          background: "#f8f9fa",
                          padding: "6px",
                        }}
                      />
                    </td>
                    <td>₹{(item.price || 0).toFixed(2)}</td>
                    <td>{item.quantity || 0}</td>
                    <td className="fw-semibold text-success">
                      ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
            <h4 className="fw-bold text-success mb-0">
              Total: ₹{calculateTotal()}
            </h4>

            <div className="d-flex gap-2">
              <button
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(135deg, #FFD700, #E6B800)",
                  color: "#212121",
                }}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <button
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(135deg, #FF4D4D, #E53935)",
                  color: "#fff",
                }}
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
