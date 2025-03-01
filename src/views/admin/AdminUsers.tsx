import React from "react";

const AdminUsers: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Users</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage all system users from here.
          </p>
        </div>
        <div className="p-6">
          <p className="text-gray-500">
            User management content will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
