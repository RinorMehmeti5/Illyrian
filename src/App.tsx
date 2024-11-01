// App.tsx
import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./views/shared/Header";
import Footer from "./views/shared/Footer";
import Home from "./views/Home";
import Team from "./views/Team";
import Projects from "./views/Projects";
import Calendar from "./views/Calendar";
import Test from "./views/Test";
import Login from "./views/shared/Login";
import Register from "./views/shared/Register";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import ProtectedRoute from "../components/ui/ProtectedRoute";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminPanel from "./views/AdminPanel";
import { Toast } from "primereact/toast";

interface MyJwtPayload extends JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
    | string
    | string[];
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const noHeaderFooterRoutes = ["/login", "/register"];
  const location = useLocation();
  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(
    location.pathname
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);

      // Decode the token to get the roles
      const decodedToken = jwtDecode<MyJwtPayload>(token);
      const rolesClaim =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      const initialUserRoles = rolesClaim
        ? Array.isArray(rolesClaim)
          ? rolesClaim
          : [rolesClaim]
        : [];
      setUserRoles(initialUserRoles);
    } else {
      setIsAuthenticated(false);
      setUserRoles([]);
    }
  }, []);

  const handleLoginSuccess = (roles: string[]) => {
    setIsAuthenticated(true);
    setUserRoles(roles);
  };

  // Only render the app after authentication status is known
  if (isAuthenticated === null) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <Toast />
      {shouldShowHeaderFooter && (
        <Header
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          userRoles={userRoles}
        />
      )}
      <main className="flex-grow no-scrollbar">
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
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {shouldShowHeaderFooter && <Footer />}
    </>
  );
}

export default App;
