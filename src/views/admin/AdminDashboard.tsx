import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Users</h3>
          <p className="text-3xl font-bold">245</p>
          <p className="text-sm text-gray-500 mt-2">12% increase this month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Active Memberships</h3>
          <p className="text-3xl font-bold">189</p>
          <p className="text-sm text-gray-500 mt-2">5% increase this month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Revenue</h3>
          <p className="text-3xl font-bold">$12,450</p>
          <p className="text-sm text-gray-500 mt-2">8% increase this month</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
