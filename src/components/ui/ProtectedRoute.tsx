// components/ui/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  component: React.ComponentType;
  isAuthenticated: boolean;
  userRoles: string[];
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  isAuthenticated,
  userRoles,
  requiredRoles = [],
}) => {
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if roles are required and if user has required roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role)
    );
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If authenticated and has required roles (or no roles required), render the component
  return <Component />;
};

export default ProtectedRoute;
