import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface HeaderProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userRoles: string[];
}

export default function Header({
  isAuthenticated,
  setIsAuthenticated,
  userRoles,
}: HeaderProps) {
  const isAdmin = userRoles.some(
    (role) => role.toLowerCase() === "administrator"
  );
  const [username, setUsername] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menu = useRef<Menu>(null);

  const navigation = [
    { name: "Home", to: "/" },
    { name: "Team", to: "/team" },
    { name: "Projects", to: "/projects" },
    { name: "Calendar", to: "/calendar" },
    ...(isAuthenticated && isAdmin
      ? [
          { name: "Test", to: "/test" },
          { name: "AdminPanel", to: "/adminpanel" },
        ]
      : []),
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsername();
    } else {
      setUsername("");
    }
  }, [isAuthenticated]);

  const fetchUsername = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7102/api/auth/username",
        { withCredentials: true }
      );
      setUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("https://localhost:7102/api/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("userid");
      localStorage.removeItem("role");
      localStorage.removeItem("userlanguage");
      delete axios.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
      setUsername("");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const profileItems = [
    {
      label: username,
      template: (item: any, options: any) => (
        <span className="block px-4 py-2 text-sm text-gray-700">
          {username}
        </span>
      ),
    },
    {
      label: "Sign out",
      command: handleLogout,
    },
  ];

  return (
    <header className="bg-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <Button
              icon={mobileMenuOpen ? "pi pi-times" : "pi pi-bars"}
              className="p-button-rounded p-button-text p-button-plain text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            />
          </div>
          {/* Logo */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-20 w-auto"
                src="/public/photos/logo.jpg"
                alt="Your Company"
              />
            </div>
            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:block my-auto">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={classNames(
                      location.pathname === item.to
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* Notification Bell and Profile */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-4">
            {/* Notification Bell */}
            <Button
              icon="pi pi-bell"
              className="p-button-rounded p-button-text p-button-plain text-gray-400 hover:text-white"
              aria-label="View notifications"
            />
            {/* Profile dropdown or Login/Register */}
            {isAuthenticated ? (
              <>
                <Menu model={profileItems} popup ref={menu} id="profile_menu" />
                <Button
                  className="p-button-rounded p-button-text p-button-plain"
                  onClick={(event) => menu.current?.toggle(event)}
                  aria-controls="profile_menu"
                  aria-haspopup
                >
                  <Avatar
                    image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    shape="circle"
                  />
                </Button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={classNames(
                  location.pathname === item.to
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
