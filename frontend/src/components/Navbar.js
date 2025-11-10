import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand" to="/">
          🛍️ E-Commerce
        </Link>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Center Search Bar */}
          <form
            className="d-flex navbar-search mx-auto my-2 my-lg-0"
            role="search"
            onSubmit={handleSearch}
          >
            <input
              className="form-control"
              type="search"
              placeholder="Search for products, brands and more"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn" type="submit">
              Search
            </button>
          </form>

          {/* Right-side Links */}
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>

            {user ? (
              <>
                {user.role !== "ADMIN" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cart">
                        Cart
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/wishlist">
                        Wishlist
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/orders">
                        My Orders
                      </Link>
                    </li>
                  </>
                )}

                {user.role === "ADMIN" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard">
                      Admin Panel
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-white fw-semibold"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
