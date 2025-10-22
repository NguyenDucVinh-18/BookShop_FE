import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";


function ProtectedRoute({ element, roles }) {
  const { user } = useContext(AuthContext);
    console.log("ProtectedRoute - user:", user);
  // ⛔ Nếu chưa đăng nhập → chuyển về trang login
  if (!user.id) {
    return <Navigate to="/login" replace />;
  }

  // ⛔ Nếu có roles yêu cầu và role hiện tại không phù hợp → cũng chuyển về login
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Nếu hợp lệ → cho truy cập
  return element;
}

export default ProtectedRoute;
