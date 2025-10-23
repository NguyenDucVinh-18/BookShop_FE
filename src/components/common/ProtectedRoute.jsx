import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element, roles }) {
  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return element;
}

export default ProtectedRoute;
