import React, { useState, useEffect, useMemo, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";
import api from "../../api/api";
import getLocalImage from "../../api/localImages";
import { AuthContext } from "../../context/AuthContext"; // ✅ Added

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ✅ Added
  const queryParams = new URLSearchParams(location.search);
  const searchTermRaw = queryParams.get("search") || "";
  const searchTerm = searchTermRaw.trim().toLowerCase();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products");
      setProducts(response.data || []);
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError("Failed to fetch products: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  // ✅ Only logic added — no style change
  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.info("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart/add", { productId, quantity: 1 });
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart!");
    }
  };

  // ✅ Only logic added — no style change
  const handleAddToWishlist = async (productId) => {
    if (!user) {
      toast.info("Please log in to add to your wishlist.");
      navigate("/login");
      return;
    }

    try {
      await api.post("/wishlist/add", { productId });
      toast.success("Added to wishlist!");
    } catch {
      toast.error("Failed to add to wishlist!");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const desc = product.description?.toLowerCase() || "";
      const cat =
        typeof product.category === "object"
          ? product.category.name?.toLowerCase() || ""
          : (product.category || product.categoryName || "").toLowerCase();

      const matchesSearch =
        !searchTerm ||
        name.includes(searchTerm) ||
        desc.includes(searchTerm) ||
        cat.includes(searchTerm) ||
        (searchTerm.endsWith("s") && name.includes(searchTerm.slice(0, -1))) ||
        (name.endsWith("s") && name.slice(0, -1).includes(searchTerm));

      const matchesCategory =
        category === "all" || cat === category.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, category, searchTerm]);

  return (
    <main className="container py-4">
      <h2 className="fw-bold mb-4 text-primary">Products</h2>

      <div className="row g-3 mb-3">
        <div className="col-md-6 mx-auto">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const imageUrl =
                product.imageUrl ||
                getLocalImage(product.name, product.category?.name);
              return (
                <div key={product.id} className="col-6 col-md-4 col-lg-3 d-flex">
                  <div className="card product-card w-100">
                    <Link
                      to={`/products/${product.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="product-image-wrap">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="product-image"
                          loading="lazy"
                          onError={(e) =>
                            (e.target.src = "/assets/products/placeholder.png")
                          }
                        />
                      </div>
                    </Link>
                    <div className="card-body product">
                      <div className="product-title">{product.name}</div>
                      <div className="text-muted small">
                        {product.category?.name || product.categoryName || ""}
                      </div>
                      <div className="price-block">
                        <div className="price">₹{product.price ?? 0}</div>
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn btn-add"
                          onClick={() => handleAddToCart(product.id)}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="btn btn-wish"
                          onClick={() => handleAddToWishlist(product.id)}
                          title="Add to Wishlist"
                        >
                          <FaHeart />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center py-5">
              <img
                src="/assets/products/placeholder.png"
                alt="No products"
                className="mb-3"
              />
              <h5>No products found</h5>
              <p className="text-muted">
                Try searching for another term or check back later.
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default ProductList;
