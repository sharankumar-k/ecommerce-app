// src/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-4">
      <h2>Welcome to E-Commerce</h2>
      <p>Browse our products and start shopping!</p>
      <Link to="/products" className="btn btn-primary">Shop Now</Link>
    </div>
  );
};

export default Home;