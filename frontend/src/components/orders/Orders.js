// src/components/orders/Orders.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import {
  FaCheckCircle,
  FaBoxOpen,
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      console.log("Orders response:", response.data);
      setOrders(response.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError("Failed to fetch orders: " + errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (status) => {
    const steps = ["ORDERED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
    const currentIndex = steps.indexOf(status?.toUpperCase()) + 1 || 1;
    return steps.map((step, index) => ({
      label: step.replace(/_/g, " "),
      completed: index < currentIndex,
    }));
  };

  const getIcon = (label) => {
    switch (label) {
      case "ORDERED":
        return <FaClock />;
      case "PACKED":
        return <FaBoxOpen />;
      case "SHIPPED":
        return <FaTruck />;
      case "OUT FOR DELIVERY":
        return <FaMapMarkerAlt />;
      case "DELIVERED":
        return <FaCheckCircle />;
      default:
        return <FaTimesCircle />;
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">📦 Your Orders</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted py-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="No orders"
            width="120"
            className="mb-3 opacity-75"
          />
          <h5>You have no orders yet</h5>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => {
            const steps = getStatusSteps(order.status);

            return (
              <div className="col-12" key={order.id}>
                <div className="order-card shadow-sm border-0 p-3 rounded bg-white">
                  <div className="d-flex justify-content-between flex-wrap mb-3">
                    <div>
                      <h5 className="fw-semibold text-primary">
                        Order #{order.id}
                      </h5>
                      <p className="mb-1 text-muted small">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h6 className="text-success fw-bold">
                        ₹{order.totalAmount.toFixed(2)}
                      </h6>
                      <span className="badge bg-info text-dark">
                        {order.paymentMethod || "COD"}
                      </span>
                    </div>
                  </div>

                  {/* 🚚 Delivery Timeline */}
                  <div className="timeline d-flex justify-content-between align-items-center">
                    {steps.map((step, index) => (
                      <div
                        key={index}
                        className={`timeline-step ${
                          step.completed ? "completed" : ""
                        }`}
                      >
                        <div className="timeline-icon">{getIcon(step.label)}</div>
                        <p className="timeline-label">
                          {step.label}
                        </p>
                        {index < steps.length - 1 && (
                          <div className="timeline-bar"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
