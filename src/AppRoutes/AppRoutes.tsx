// src/AppRoutes/AppRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

// Layouts
import PublicLayout from "../components/layouts/PublicLayout";
import MaterialAdminLayout from "../components/layouts/MaterialAdminLayout";

// Public views
import Home from "../views/Home";
import Team from "../views/Team";
import Login from "../views/shared/Login";
import Register from "../views/shared/Register";
import Unauthorized from "../views/shared/Unauthorized";

// Admin views
import AdminDashboard from "../views/admin/AdminDashboard";
import AdminUsers from "../views/admin/AdminUsers";
import Test from "../views/Test";

// Protected route components
import ProtectedRoute from "../components/ui/ProtectedRoute";
import AdminRoute from "../components/ui/AdminRoute";
import AdminMemberships from "../views/admin/AdminMembership/AdminMemberships";
import AdminSchedules from "../views/admin/AdminSchedule";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, userRoles } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes with Public Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Protected Route */}
      <Route
        path="/test"
        element={
          <ProtectedRoute
            component={Test}
            isAuthenticated={isAuthenticated}
            userRoles={userRoles}
            requiredRoles={["User"]}
          />
        }
      />

      {/* Admin Routes with Material UI Admin Layout */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<MaterialAdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="memeberships" element={<AdminMemberships />} />
          <Route path="schedule" element={<AdminSchedules />} />

          {/* Add more admin routes as needed */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
