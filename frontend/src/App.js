import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AnimatedBackground from "./components/AnimatedBackground";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// User Components
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProductList from "./components/products/ProductList";
import ProductDetails from "./components/products/ProductDetails";
import Cart from "./components/cart/Cart";
import Checkout from "./components/checkout/Checkout";
import Wishlist from "./components/wishlist/Wishlist";
import Orders from "./components/orders/Orders";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageCategories from "./components/admin/ManageCategories";
import ManageProducts from "./components/admin/ManageProducts";

// Utils
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* 🌈 Show animated gradient only on user-facing routes */}
      {!isAdminRoute && <AnimatedBackground />}
      {!isAdminRoute && <Navbar />}

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* User-Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Admin-Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute requireAdmin>
                <ManageCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requireAdmin>
                <ManageProducts />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

      {/* Toasts for global alerts */}
      <ToastContainer position="bottom-right" theme="colored" autoClose={2500} />
    </>
  );
}

export default App;
