// src/components/checkout/Checkout.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      const invalidItems = cartItems.filter(item => !item.productName || !item.price || !item.productId);
      if (invalidItems.length > 0) {
        setError(`Invalid cart items: IDs [${invalidItems.map(item => item.id || 'unknown').join(', ')}]`);
      } else {
        setError('');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError('Failed to fetch cart: ' + errorMessage);
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateCartItems = () => {
    return cart.every(item => item.productName && item.price && item.productId && item.quantity > 0);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price || 0;
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (!validateCartItems()) {
        const invalidItems = cart.filter(item => !item.productName || !item.price || !item.productId);
        const errorMessage = `Invalid cart items: IDs [${invalidItems.map(item => item.id || 'unknown').join(', ')}]`;
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }
      const orderItems = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      console.log('Sending order:', JSON.stringify({ items: orderItems }, null, 2));
      const orderResponse = await api.post('/orders/create', { items: orderItems });
      const order = orderResponse.data;
      console.log('Order response:', orderResponse.data);

      const paymentResponse = await api.post('/payments/make', {
        amount: order.totalAmount,
        method: paymentMethod,
        orderId: order.id,
      });
      console.log('Payment response:', paymentResponse.data);

      if (paymentResponse.data.status === 'SUCCESS' || paymentResponse.data.status === 'PENDING') {
        await api.delete('/cart/clear');
        setCart([]);
        const message = paymentResponse.data.orderStatus === 'PENDING'
          ? `Order placed successfully! Order ID: ${order.id} (Payment due on delivery)`
          : `Order placed successfully! Order ID: ${order.id} (Confirmed)`;
        toast.success(message);
        navigate('/orders');
      } else {
        setError('Payment failed: ' + (paymentResponse.data.message || 'Unknown error'));
        toast.error(`Order placed but payment failed. Order ID: ${order.id}`);
        navigate('/orders');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError('Checkout failed: ' + errorMessage);
      toast.error('Checkout failed: ' + errorMessage);
      console.error('Checkout error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart([]);
      setError('');
      toast.success('Cart cleared!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error('Failed to clear cart: ' + errorMessage);
      console.error('Clear cart error:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
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
          <h4>Order Summary</h4>
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
          <div className="mb-3">
            <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
            <select
              id="paymentMethod"
              className="form-select w-25"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>
          <button
            className="btn btn-success me-2"
            onClick={handleCheckout}
            disabled={loading || !validateCartItems()}
          >
            {loading ? 'Processing...' : 'Place Order'}
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

export default Checkout;