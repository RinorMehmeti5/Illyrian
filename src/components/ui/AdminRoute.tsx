// components/ui/AdminRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const AdminRoute: React.FC = () => {
  const { isAuthenticated, userRoles } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  const isAdmin = userRoles.includes("Administrator");
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and admin, render the outlet (child routes)
  return <Outlet />;
};

export default AdminRoute;
