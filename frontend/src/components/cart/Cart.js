// src/components/cart/Cart.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cart');
      console.log('Raw cart response:', JSON.stringify(response.data, null, 2));
      const cartItems = response.data.items || [];
      setCart(cartItems);
      const invalidItems = cartItems.filter(item => !item.productName || !item.price || !item.id);
      if (invalidItems.length > 0) {
        setError(`Invalid cart items: IDs [${invalidItems.map(item => item.id || 'unknown').join(', ')}]`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError('Failed to fetch cart: ' + errorMessage);
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price || 0;
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  const handleClearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart([]);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('Clear cart error:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Cart</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id || Math.random()}>
                  <td>{item.productName || 'Unknown Product'}</td>
                  <td>${(item.price || 0).toFixed(2)}</td>
                  <td>{item.quantity || 0}</td>
                  <td>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Total: ${calculateTotal()}</h4>
          <button
            className="btn btn-success me-2"
            onClick={() => navigate('/checkout')}
            disabled={loading}
          >
            Proceed to Checkout
          </button>
          <button
            className="btn btn-danger"
            onClick={handleClearCart}
            disabled={loading}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;