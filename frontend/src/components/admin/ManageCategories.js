// src/components/admin/ManageCategory.js
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { toast } from 'react-toastify';

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError('Failed to fetch categories: ' + errorMessage);
      toast.error('Failed to fetch categories: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Categories</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <p className="text-muted">No categories found.</p>
      ) : (
        <ul className="list-group">
          {categories.map(category => (
            <li className="list-group-item" key={category.id}>
              {category.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageCategory;