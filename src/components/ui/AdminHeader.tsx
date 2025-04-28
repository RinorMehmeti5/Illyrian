// src/components/ui/AdminHeader.tsx
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import useAuthStore from "../../store/authStore";

const AdminHeader: React.FC = () => {
  const { username, logout } = useAuthStore();

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">Admin Dashboard</h1>
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none">
          <UserIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          <span className="ml-2">{username}</span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`${
                    active ? "bg-gray-100" : ""
                  } block w-full text-left px-4 py-2 text-sm`}
                >
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </header>
  );
};

export default AdminHeader;
