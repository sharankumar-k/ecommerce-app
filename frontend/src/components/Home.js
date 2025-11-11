// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./css/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-banner">
        <h1>Welcome to PrimeZone</h1>
        <p>Discover amazing deals on the latest products with fast delivery</p>
        <Link to="/products" className="hero-cta">
          Shop Now 🚀
        </Link>
      </section>

      {/* CATEGORY STRIP */}
      <div className="category-strip">
        {[
          { name: "Mobiles", img: "https://cdn-icons-png.flaticon.com/512/3523/3523063.png" },
          { name: "Laptops", img: "https://cdn-icons-png.flaticon.com/512/906/906343.png" },
          { name: "Electronics", img: "https://cdn-icons-png.flaticon.com/512/3659/3659743.png" },
          { name: "Fashion", img: "https://cdn-icons-png.flaticon.com/512/892/892458.png" },
          { name: "Home", img: "https://cdn-icons-png.flaticon.com/512/1042/1042339.png" },
        ].map((c) => (
          <div key={c.name} className="category-item">
            <img src={c.img} alt={c.name} className="category-icon" />
            <p>{c.name}</p>
          </div>
        ))}
      </div>

      {/* PRODUCT SECTION */}
      <section className="product-section">
        <h2 className="section-title">Featured Products</h2>

        <div className="product-grid">
          {[
            {
              name: "iPhone 15 Pro",
              desc: "Latest Apple iPhone with A17 Pro chip and titanium design",
              img: "https://m.media-amazon.com/images/I/71yzJoE7WlL._SL1500_.jpg",
              price: "₹79,999",
              badge: "New"
            },
            {
              name: "Dell Inspiron 15",
              desc: "Intel i5 12th Gen | 16GB RAM | 512GB SSD | 2GB Graphics",
              img: "https://m.media-amazon.com/images/I/71rXSVqET9L._SL1500_.jpg",
              price: "₹56,990",
              badge: "Popular"
            },
            {
              name: "Sony WH-1000XM5",
              desc: "Industry-leading noise cancellation with 30hr battery life",
              img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
              price: "₹29,990",
              badge: "Best Seller"
            },
          ].map((p) => (
            <div key={p.name} className="product-card">
              <div className="product-image-container">
                <img src={p.img} alt={p.name} className="product-image" />
                <span className="product-badge">{p.badge}</span>
              </div>
              <div className="product-info">
                <h3>{p.name}</h3>
                <p className="description">{p.desc}</p>
                <div className="product-price">{p.price}</div>
                <div className="product-actions">
                  <button className="btn-primary">Add to Cart</button>
                  <button className="btn-secondary">Quick View</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/products" className="view-all-btn">
            Explore All Products ✨
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
