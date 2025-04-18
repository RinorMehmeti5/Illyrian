// src/views/admin/AdminUsers/AdminUser.tsx
import { Fragment } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useAdminUserStore from "../../../store/adminUserStore";
import {
  UserDTO,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
} from "../../../services/AdminUserService";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import UserForm from "./UserForm";
import UserModal from "./UserModal";
import ResetPasswordModal from "./ResetPasswordModal";
import { UserFormValues, ResetPasswordFormValues } from "./types";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { KeyIcon } from "@heroicons/react/24/solid";

const AdminUsers: React.FC = () => {
  const { t } = useTranslation();
  const {
    users,
    roles,
    isLoading,
    error,
    selectedUser,
    fetchUsers,
    fetchRoles,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    setSelectedUser,
    clearError,
  } = useAdminUserStore();

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resetPasswordUserId, setResetPasswordUserId] = useState("");
  const [resetPasswordUsername, setResetPasswordUsername] = useState("");

  // Form initial values
  const [initialFormValues, setInitialFormValues] = useState<UserFormValues>({
    email: "",
    password: "",
    userName: "",
    personalNumber: "",
    firstname: "",
    lastname: "",
    birthdate: "",
    phoneNumber: "",
    address: "",
    active: true,
    roles: ["User"],
  });

  // TanStack Table state
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // Fetch users and roles when component mounts
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  // Show error toast if error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Handle form submission
  const handleFormSubmit = async (values: UserFormValues) => {
    let success = false;

    if (isEditing && values.id) {
      // Remove password field from update request
      const { password, id, ...updateData } = values;
      const updateRequest: UpdateUserRequest = updateData;
      success = await updateUser(id, updateRequest);
    } else {
      // Include password for create request
      const createRequest: CreateUserRequest = {
        ...values,
        password: values.password || "",
      };
      success = await createUser(createRequest);
    }

    if (success) {
      toast.success(
        isEditing
          ? t("User updated successfully")
          : t("User created successfully")
      );
      closeUserModal();
    }
  };

  // Handle reset password form submission
  const handleResetPasswordSubmit = async (values: ResetPasswordFormValues) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error(t("Passwords do not match"));
      return;
    }

    const resetRequest: ResetPasswordRequest = {
      newPassword: values.newPassword,
    };

    const success = await resetUserPassword(resetPasswordUserId, resetRequest);

    if (success) {
      toast.success(t("Password reset successfully"));
      closeResetPasswordModal();
    }
  };

  // Handle edit user button click
  const handleEditUser = (user: UserDTO) => {
    setSelectedUser(user);
    setInitialFormValues({
      id: user.id,
      email: user.email || "",
      userName: user.userName || "",
      personalNumber: user.personalNumber || "",
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      birthdate: user.birthdate
        ? new Date(user.birthdate).toISOString().split("T")[0]
        : "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      active: user.active === true,
      roles: user.roles || [],
    });
    setIsEditing(true);
    setIsUserModalOpen(true);
  };

  // Handle reset password button click
  const handleResetPasswordClick = (user: UserDTO) => {
    setResetPasswordUserId(user.id);
    setResetPasswordUsername(user.userName || user.email || "");
    setIsResetPasswordModalOpen(true);
  };

  // Handle delete user button click
  const handleDeleteUser = async (id: string) => {
    if (window.confirm(t("Are you sure you want to delete this user?"))) {
      const success = await deleteUser(id);
      if (success) {
        toast.success(t("User deleted successfully"));
      }
    }
  };

  // Handle create new user button click
  const handleCreateUser = () => {
    setInitialFormValues({
      email: "",
      password: "",
      userName: "",
      personalNumber: "",
      firstname: "",
      lastname: "",
      birthdate: "",
      phoneNumber: "",
      address: "",
      active: true,
      roles: ["User"],
    });
    setIsEditing(false);
    setIsUserModalOpen(true);
  };

  // Close modals and reset state
  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
    setResetPasswordUserId("");
    setResetPasswordUsername("");
  };

  // TanStack Table columns
  const columns = useMemo<ColumnDef<UserDTO, any>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: t("Full Name"),
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "email",
        header: t("Email"),
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "userName",
        header: t("Username"),
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "phoneNumber",
        header: t("Phone"),
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "roles",
        header: t("Roles"),
        cell: (info) => (
          <div className="space-x-1">
            {info.getValue()?.map((role: string, index: number) => (
              <span
                key={index}
                className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-blue-100 text-blue-800"
              >
                {role}
              </span>
            )) || "-"}
          </div>
        ),
      },
      {
        accessorKey: "active",
        header: t("Status"),
        cell: (info) =>
          info.getValue() ? (
            <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
              {t("Active")}
            </span>
          ) : (
            <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-red-100 text-red-800">
              {t("Inactive")}
            </span>
          ),
        enableSorting: true,
      },
      {
        accessorKey: "formattedInsertedDate",
        header: t("Created Date"),
        cell: (info) => info.getValue() || "-",
      },
      {
        id: "actions",
        header: t("Actions"),
        cell: ({ row }) => (
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                {t("Actions")}
                <ChevronDownIcon
                  className="w-5 h-5 ml-2 -mr-1 text-gray-500"
                  aria-hidden="true"
                />
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
              <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleEditUser(row.original)}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } group flex items-center w-full px-4 py-2 text-sm`}
                      >
                        <PencilIcon
                          className="w-5 h-5 mr-3 text-primary-500"
                          aria-hidden="true"
                        />
                        {t("Edit")}
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleResetPasswordClick(row.original)}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } group flex items-center w-full px-4 py-2 text-sm`}
                      >
                        <KeyIcon
                          className="w-5 h-5 mr-3 text-blue-500"
                          aria-hidden="true"
                        />
                        {t("Reset Password")}
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleDeleteUser(row.original.id)}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } group flex items-center w-full px-4 py-2 text-sm`}
                      >
                        <TrashIcon
                          className="w-5 h-5 mr-3 text-red-500"
                          aria-hidden="true"
                        />
                        {t("Delete")}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ),
        enableSorting: false,
      },
    ],
    [t]
  );

  // TanStack Table instance
  const table = useReactTable({
    data: users,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("User Management")}</h2>
        <button
          onClick={handleCreateUser}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {t("Add New User")}
        </button>
      </div>

      {/* Compact Modern Table */}
      <div className="bg-white shadow-sm rounded-md overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-base font-medium text-gray-700">{t("Users")}</h3>
          <div className="relative w-64">
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={t("Search...")}
              className="w-full text-sm py-1.5 pl-8 pr-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="bg-gray-50 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center space-x-1">
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {{
                              asc: " ↑",
                              desc: " ↓",
                            }[header.column.getIsSorted() as string] ?? " ↕"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-3 text-center text-sm text-gray-500"
                  >
                    {t("No users found.")}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2 text-sm text-gray-600 font-normal whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Compact Pagination */}
        <div className="bg-white px-4 py-2 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-xs">
              {t("Page")} {table.getState().pagination.pageIndex + 1} {t("of")}{" "}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="text-xs border border-gray-300 rounded px-1 py-1 bg-white"
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} / {t("page")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* User Form Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={closeUserModal}
        title={isEditing ? t("Edit User") : t("Create New User")}
      >
        <UserForm
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
          onCancel={closeUserModal}
          roles={roles}
          isLoading={isLoading}
          isEditing={isEditing}
        />
      </UserModal>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={closeResetPasswordModal}
        userId={resetPasswordUserId}
        username={resetPasswordUsername}
        onSubmit={handleResetPasswordSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminUsers;
