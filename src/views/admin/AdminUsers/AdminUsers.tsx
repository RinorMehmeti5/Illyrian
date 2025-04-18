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
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => handleEditUser(row.original)}
              className="text-primary-600 hover:text-primary-900 mr-2"
            >
              {t("Edit")}
            </button>
            <button
              onClick={() => handleResetPasswordClick(row.original)}
              className="text-blue-600 hover:text-blue-900 mr-2"
            >
              {t("Reset Password")}
            </button>
            <button
              onClick={() => handleDeleteUser(row.original.id)}
              className="text-red-600 hover:text-red-900"
            >
              {t("Delete")}
            </button>
          </div>
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

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {t("Users")}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {t("Manage all users from here.")}
            </p>
          </div>
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={t("Search...")}
            className="mt-2 sm:mt-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {isLoading && !users.length ? (
          <div className="p-6 text-center">
            <svg
              className="animate-spin mx-auto h-8 w-8 text-primary-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-2">{t("Loading users...")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " ▲",
                          desc: " ▼",
                        }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {t("No users found.")}
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm"
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
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
          <div className="flex-1 flex items-center gap-2">
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t("Previous")}
            </button>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("Next")}
            </button>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
          </div>
          <span>
            {t("Page")}{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="ml-2 border rounded px-2 py-1"
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {t("Show")} {pageSize}
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
