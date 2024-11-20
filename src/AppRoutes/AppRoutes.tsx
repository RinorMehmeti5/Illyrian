// src/AppRoutes/AppRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../views/Home";
import Team from "../views/Team";
import Projects from "../views/Projects";
import Calendar from "../views/Calendar";
import Test from "../views/Test";
import Login from "../views/shared/Login";
import Register from "../views/shared/Register";
import AdminPanel from "../views/AdminPanel";
import ProtectedRoute from "../../components/ui/ProtectedRoute";

interface AppRoutesProps {
  isAuthenticated: boolean;
  userRoles: string[];
  handleLoginSuccess: (roles: string[]) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  isAuthenticated,
  userRoles,
  handleLoginSuccess,
}) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team" element={<Team />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/calendar" element={<Calendar />} />
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
      <Route
        path="/adminpanel"
        element={
          <ProtectedRoute
            component={AdminPanel}
            isAuthenticated={isAuthenticated}
            userRoles={userRoles}
            requiredRoles={["Administrator"]}
          />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
