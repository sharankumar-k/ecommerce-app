// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
