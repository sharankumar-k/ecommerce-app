// src/components/products/ProductList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

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
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      toast.success('Added to cart!');
      console.log('Added to cart:', { productId, quantity: 1 });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error('Failed to add to cart: ' + errorMessage);
      console.error('Add to cart error:', err);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await api.post('/wishlist/add', { productId });
      toast.success('Added to wishlist!');
      console.log('Added to wishlist:', { productId });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error('Failed to add to wishlist: ' + errorMessage);
      console.error('Add to wishlist error:', err);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || (product.category && product.category.name === category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mt-4">
      <h2>Products</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">Filter by Category:</label>
        <select
          id="category"
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {/* Add dynamic categories if available */}
        </select>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map(product => (
            <div className="col-md-4 mb-3" key={product.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">Price: ${product.price.toFixed(2)}</p>
                  <p className="card-text">Category: {product.category ? product.category.name : 'Uncategorized'}</p>
                  <Link to={`/products/${product.id}`} className="btn btn-primary me-2">View Details</Link>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleAddToWishlist(product.id)}
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;