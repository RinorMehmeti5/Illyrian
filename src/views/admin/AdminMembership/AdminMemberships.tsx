// admin/AdminMembership/AdminMemberships.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useMembershipStore from "../../../store/membershipStore";
import {
  CreateMembershipRequest,
  UpdateMembershipRequest,
  MembershipDTO,
} from "../../../services/MembershipService";
import useAuthStore from "../../../store/authStore";
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
import MembershipForm from "./MembershipForm";
import MembershipModal from "./MembershipModal";
import { MembershipFormValues } from "./types";

const AdminMemberships: React.FC = () => {
  const { t } = useTranslation();
  const {
    memberships,
    membershipTypes,
    isLoading,
    error,
    selectedMembership,
    fetchMemberships,
    fetchMembershipTypes,
    createMembership,
    updateMembership,
    deleteMembership,
    setSelectedMembership,
    clearError,
  } = useMembershipStore();

  const { userRoles, username } = useAuthStore();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form initial values
  const [initialFormValues, setInitialFormValues] =
    useState<MembershipFormValues>({
      userId: "",
      membershipTypeId: 1,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split("T")[0],
      isActive: true,
    });

  // TanStack Table state
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // Fetch memberships and membership types when component mounts
  useEffect(() => {
    fetchMemberships();
    fetchMembershipTypes();
  }, [fetchMemberships, fetchMembershipTypes]);

  // Show error toast if error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Handle form submission
  const handleFormSubmit = async (values: MembershipFormValues) => {
    let success = false;

    if (isEditing && values.membershipId) {
      const updateData: UpdateMembershipRequest = {
        membershipId: values.membershipId,
        userId: values.userId,
        membershipTypeId: values.membershipTypeId,
        startDate: values.startDate,
        endDate: values.endDate,
        isActive: values.isActive,
      };
      success = await updateMembership(values.membershipId, updateData);
    } else {
      const createData: CreateMembershipRequest = {
        userId: values.userId,
        membershipTypeId: values.membershipTypeId,
        startDate: values.startDate,
        endDate: values.endDate,
        isActive: values.isActive,
      };
      success = await createMembership(createData);
    }

    if (success) {
      toast.success(
        isEditing
          ? t("Membership updated successfully")
          : t("Membership created successfully")
      );
      closeModal();
    }
  };

  // Handle edit membership button click
  const handleEditMembership = (membership: MembershipDTO) => {
    setSelectedMembership(membership);
    setInitialFormValues({
      membershipId: membership.membershipId,
      userId: membership.userId,
      membershipTypeId: membership.membershipTypeId,
      startDate: new Date(membership.startDate).toISOString().split("T")[0],
      endDate: new Date(membership.endDate).toISOString().split("T")[0],
      isActive: membership.isActive,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle delete membership button click
  const handleDeleteMembership = async (id: number) => {
    if (window.confirm(t("Are you sure you want to delete this membership?"))) {
      const success = await deleteMembership(id);
      if (success) {
        toast.success(t("Membership deleted successfully"));
      }
    }
  };

  // Handle create new membership button click
  const handleCreateMembership = () => {
    setInitialFormValues({
      userId: "",
      membershipTypeId:
        membershipTypes.length > 0 ? membershipTypes[0].membershipTypeID : 1,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split("T")[0],
      isActive: true,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMembership(null);
  };

  // TanStack Table columns
  const columns = useMemo<ColumnDef<MembershipDTO, any>[]>(
    () => [
      {
        accessorKey: "userFullName",
        header: t("User"),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "membershipTypeName",
        header: t("Membership Type"),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "formattedDuration",
        header: t("Duration"),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "formattedPrice",
        header: t("Price"),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "formattedStartDate",
        header: t("Start Date"),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "formattedEndDate",
        header: t("End Date"),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "isActive",
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
        id: "actions",
        header: t("Actions"),
        cell: ({ row }) => (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => handleEditMembership(row.original)}
              className="text-primary-600 hover:text-primary-900 mr-3"
            >
              {t("Edit")}
            </button>
            <button
              onClick={() => handleDeleteMembership(row.original.membershipId)}
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
    data: memberships,
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
        <h2 className="text-2xl font-bold">{t("Membership Management")}</h2>
        <button
          onClick={handleCreateMembership}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {t("Add New Membership")}
        </button>
      </div>

      {/* Memberships Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {t("Memberships")}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {t("Manage all memberships from here.")}
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

        {isLoading && !memberships.length ? (
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
            <p className="mt-2">{t("Loading memberships...")}</p>
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
                      {t("No memberships found.")}
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

      {/* Membership Form Modal */}
      <MembershipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? t("Edit Membership") : t("Create New Membership")}
      >
        <MembershipForm
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
          membershipTypes={membershipTypes}
          isLoading={isLoading}
          isEditing={isEditing}
        />
      </MembershipModal>
    </div>
  );
};

export default AdminMemberships;
