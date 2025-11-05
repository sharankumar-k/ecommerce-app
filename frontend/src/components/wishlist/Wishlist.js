// src/components/wishlist/Wishlist.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await api.get('/wishlist');
      console.log('Wishlist fetched:', JSON.stringify(response.data, null, 2));
      const wishlistItems = response.data || [];
      const enrichedItems = await Promise.all(
        wishlistItems.map(async (item) => {
          try {
            const productResponse = await api.get(`/products/${item.productId}`);
            return { ...item, price: productResponse.data.price };
          } catch (err) {
            console.error(`Failed to fetch product ${item.productId}:`, err);
            return { ...item, price: 0 };
          }
        })
      );
      setWishlist(enrichedItems);
      const invalidItems = enrichedItems.filter(item => !item.productName || item.price === undefined);
      if (invalidItems.length > 0) {
        setError(`Invalid wishlist items: IDs [${invalidItems.map(item => item.id || 'unknown').join(', ')}]`);
      } else {
        setError('');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError('Failed to fetch wishlist: ' + errorMessage);
      console.error('Wishlist fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      toast.success('Removed from wishlist!');
      setWishlist(wishlist.filter(item => item.productId !== productId));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error('Failed to remove from wishlist: ' + errorMessage);
      console.error('Remove from wishlist error:', err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      toast.success('Added to cart!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error('Failed to add to cart: ' + errorMessage);
      console.error('Add to cart error:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Wishlist</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : wishlist.length === 0 ? (
        <p className="text-muted">Your wishlist is empty.</p>
      ) : (
        <div className="row">
          {wishlist.map(item => (
            <div className="col-md-4 mb-3" key={item.id || Math.random()}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{item.productName || 'Unknown Product'}</h5>
                  <p className="card-text">Price: ${(item.price || 0).toFixed(2)}</p>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleAddToCart(item.productId)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                  >
                    Remove
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

export default Wishlist;