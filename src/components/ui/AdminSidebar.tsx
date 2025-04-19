// src/components/ui/AdminSidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, UserGroupIcon, CogIcon } from "@heroicons/react/24/outline";

const adminNavigation = [
  { name: "Dashboard", icon: HomeIcon, to: "/admin/dashboard" },
  { name: "Users", icon: UserGroupIcon, to: "/admin/users" },
  { name: "Settings", icon: CogIcon, to: "/admin/settings" },
  // Add more admin links here
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        {/* Logo or Brand */}
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="mt-5">
        <ul>
          {adminNavigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.to}
                className={`flex items-center px-4 py-2 hover:bg-gray-700 ${
                  location.pathname === item.to ? "bg-gray-900" : ""
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
