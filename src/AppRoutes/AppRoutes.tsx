// src/AppRoutes/AppRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../views/Home";
import Team from "../views/Team";
import Projects from "../views/Projects";
import Calendar from "../views/Calendar";
import Login from "../views/shared/Login";
import Register from "../views/shared/Register";
import AdminLayout from "../../components/layouts/AdminLayout";
import AdminDashboard from "../views/admin/AdminDashboard";
import AdminUsers from "../views/admin/AdminUsers";
import useAuthStore from "../store/authStore";
import Test from "../views/Test";
import ProtectedRoute from "../../components/ui/ProtectedRoute";

import AdminRoute from "../../components/ui/AdminRoute";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, userRoles } = useAuthStore();
  const isAdmin = userRoles.includes("Administrator");

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/team" element={<Team />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/test"
        element={
          <ProtectedRoute
            component={Test}
            isAuthenticated={isAuthenticated}
            userRoles={userRoles}
            requiredRoles={["Administrator"]}
          />
        }
      />

      {/* Admin Routes */}
      {isAdmin && (
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            {/* Add more admin routes here */}
          </Route>
        </Route>
      )}

      {/* Redirects */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
