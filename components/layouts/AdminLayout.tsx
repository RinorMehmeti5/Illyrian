// components/layouts/AdminLayout.tsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useAuthStore from "../../src/store/authStore";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary-800 text-white transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:static lg:z-auto`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-primary-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar content */}
        <nav className="py-4">
          <div className="px-4 py-2 text-gray-300 text-sm">
            Signed in as <span className="font-medium">{username}</span>
          </div>

          <div className="mt-4 px-2 space-y-1">
            <a
              href="/admin/dashboard"
              className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-primary-700"
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              Dashboard
            </a>
            <a
              href="/admin/users"
              className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-primary-700"
            >
              <UsersIcon className="h-5 w-5 mr-3" />
              Users
            </a>
            <a
              href="/admin/settings"
              className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-primary-700"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-3" />
              Settings
            </a>
          </div>

          <div className="px-2 mt-8">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm rounded-md text-white hover:bg-primary-700"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Admin Dashboard</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-grow p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Gym Management System. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
