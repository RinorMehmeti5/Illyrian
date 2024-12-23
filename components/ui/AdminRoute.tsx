// src/components/ui/AdminRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../src/store/authStore";

const AdminRoute: React.FC = () => {
  const { isAuthenticated, userRoles } = useAuthStore();
  const isAdmin = userRoles.includes("Administrator");

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
