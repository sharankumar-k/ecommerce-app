import React from 'react';
import AnimatedBackground from "./components/AnimatedBackground";

import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductDetails';
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import Wishlist from './components/wishlist/Wishlist';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageCategories from './components/admin/ManageCategories';
import ManageProducts from './components/admin/ManageProducts';
import Orders from './components/orders/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    
    <>
     {/* 🌈 Animated background appears only for non-admin routes */}
      {!isAdminRoute && <AnimatedBackground />}
      {!isAdminRoute && <Navbar />}
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* Protected user routes */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

        {/* Admin-only routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/categories" element={
          <ProtectedRoute requireAdmin>
            <ManageCategories />
          </ProtectedRoute>
        } />

        <Route path="/admin/products" element={
          <ProtectedRoute requireAdmin>
            <ManageProducts />
          </ProtectedRoute>
        } />
      </Routes>

      {!isAdminRoute && <Footer />}

      <ToastContainer />

    </>
  );
}

export default App;
