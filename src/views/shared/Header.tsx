// Header.tsx
import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  UserIcon,
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  CalendarIcon,
  CogIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface HeaderProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userRoles: string[];
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  setIsAuthenticated,
  userRoles,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  const isAdmin = userRoles.some(
    (role) => role.toLowerCase() === "administrator"
  );

  const navigation = [
    { name: "Home", icon: HomeIcon, to: "/" },
    { name: "Team", icon: UsersIcon, to: "/team" },
    { name: "Projects", icon: BriefcaseIcon, to: "/projects" },
    { name: "Calendar", icon: CalendarIcon, to: "/calendar" },
    ...(isAuthenticated && isAdmin
      ? [
          { name: "Test", icon: CogIcon, to: "/test" },
          { name: "AdminPanel", icon: ShieldCheckIcon, to: "/adminpanel" },
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

  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="/public/photos/logo.jpg"
                alt="Your Company"
                className="h-8 w-auto"
              />
            </Link>
          </div>
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 ${
                  location.pathname === item.to ? "bg-gray-900" : ""
                }`}
              >
                <item.icon className="h-5 w-5 mr-1" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </div>
          {/* User Controls */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                {/* Notifications Button */}
                <button
                  className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                {/* Profile Dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <UserIcon
                        className="h-6 w-6 text-gray-400 hover:text-white"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-white">{username}</span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {/* Username Display */}
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            Signed in as <strong>{username}</strong>
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
