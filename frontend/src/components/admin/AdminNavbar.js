// src/components/admin/AdminNavbar.js
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div className="d-flex justify-content-end mb-3">
      <button className="btn btn-sm btn-outline-light" onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminNavbar;
