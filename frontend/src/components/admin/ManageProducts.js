// src/components/admin/ManageProducts.js
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { toast } from 'react-toastify';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError('Failed to fetch products: ' + errorMessage);
      toast.error('Failed to fetch products: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Products</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        <ul className="list-group">
          {products.map(product => (
            <li className="list-group-item" key={product.id}>
              {product.name} - ${product.price?.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageProducts;