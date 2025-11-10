// src/components/admin/AdminLayout.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="d-flex">
      
      {/* Sidebar */}
      <aside style={{ width: 250, minHeight: "100vh" }} className="bg-dark text-white p-3">
        <h4 className="mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin/dashboard" className="text-white nav-link p-0">
              Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/categories" className="text-white nav-link p-0">
              Manage Categories
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/products" className="text-white nav-link p-0">
              Manage Products
            </Link>
          </li>
        </ul>

        {/* Logout Button */}
        <button 
          className="btn btn-danger w-100 mt-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-grow-1 p-4" style={{ background: "#f5f7fb", minHeight: "100vh" }}>
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;
