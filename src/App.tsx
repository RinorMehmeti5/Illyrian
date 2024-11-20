// App.tsx
import React, { useState, useEffect } from "react";
import Header from "./views/shared/Header";
import Footer from "./views/shared/Footer";
import AppRoutes from "./AppRoutes/AppRoutes";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "./store/authStore";

interface MyJwtPayload extends JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
    | string
    | string[];
}

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // const [userRoles, setUserRoles] = useState<string[]>([]);
  const noHeaderFooterRoutes = ["/login", "/register"];
  const location = useLocation();

  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(
    location.pathname
  );

  const { isAuthenticated, setAuthenticated, userRoles, setUserRoles } =
    useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthenticated(true);

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
      setAuthenticated(false);
      setUserRoles([]);
    }
  }, [setAuthenticated, setUserRoles]);

  const handleLoginSuccess = (roles: string[]) => {
    setAuthenticated(true);
    setUserRoles(roles);
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      {shouldShowHeaderFooter && <Header />}
      <main className="flex-grow">
        <AppRoutes
          isAuthenticated={isAuthenticated}
          userRoles={userRoles}
          handleLoginSuccess={handleLoginSuccess}
        />
      </main>
      {shouldShowHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
