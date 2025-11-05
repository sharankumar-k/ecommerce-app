// src/components/admin/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <div className="list-group">
        <Link to="/admin/categories" className="list-group-item list-group-item-action">
          Manage Categories
        </Link>
        <Link to="/admin/products" className="list-group-item list-group-item-action">
          Manage Products
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;