// src/components/layouts/AdminLayout.tsx
import React from "react";
import AdminSidebar from "../ui/AdminSidebar";
import AdminHeader from "../ui/AdminHeader";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  debugger;
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <AdminHeader />

        {/* Content */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
