import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const {
    user,
    isAuthenticated,
    authLoading,
  } = useAuth();

  const location = useLocation();

  // Wait until localStorage authentication is checked
  if (authLoading) {
    return null;
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/account/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Role not allowed
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;