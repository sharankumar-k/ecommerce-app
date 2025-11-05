// src/components/products/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      console.log('Product fetched:', JSON.stringify(response.data, null, 2));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError('Failed to fetch product: ' + errorMessage);
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post('/cart/add', { productId: product.id, quantity: 1 });
      toast.success('Added to cart!');
      console.log('Added to cart:', { productId: product.id, quantity: 1 });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error('Failed to add to cart: ' + errorMessage);
      console.error('Add to cart error:', err);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await api.post('/wishlist/add', { productId: product.id });
      toast.success('Added to wishlist!');
      console.log('Added to wishlist:', { productId: product.id });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error('Failed to add to wishlist: ' + errorMessage);
      console.error('Add to wishlist error:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Product Details</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : !product ? (
        <p className="text-muted">Product not found.</p>
      ) : (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">{product.description}</p>
            <p className="card-text">Price: ${product.price.toFixed(2)}</p>
            <p className="card-text">Category: {product.category ? product.category.name : 'Uncategorized'}</p>
            <p className="card-text">Stock: {product.stockQuantity}</p>
            <p className="card-text">SKU: {product.sku}</p>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="img-fluid mb-3" />}
            <button className="btn btn-primary me-2" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn btn-outline-primary me-2" onClick={handleAddToWishlist}>
              Add to Wishlist
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/products')}>
              Back to Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;