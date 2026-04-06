import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="page-loader"><div className="spinner-large" /></div>;
  if (!user) return <Navigate to="/" state={{ from: location }} replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="page-loader"><div className="spinner-large" /></div>;
  if (!user || !isAdmin) return <Navigate to="/" state={{ from: location }} replace />;
  return children;
};
