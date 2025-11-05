// src/components/orders/Orders.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      console.log('Orders response:', JSON.stringify(response.data, null, 2));
      setOrders(response.data || []);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError('Failed to fetch orders: ' + errorMessage);
      toast.error('Failed to fetch orders: ' + errorMessage);
      console.error('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Orders</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-muted">You have no orders.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment Method</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  {order.status === 'PENDING' ? (
                    <span className="badge bg-warning">Pending (Payment due on delivery)</span>
                  ) : (
                    <span className="badge bg-success">{order.status}</span>
                  )}
                </td>
                <td>{order.paymentMethod || 'N/A'}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;