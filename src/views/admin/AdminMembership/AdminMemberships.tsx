// admin/AdminMembership/AdminMemberships.tsx
import { Fragment } from "react";
import { createPortal } from "react-dom";
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
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
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

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
      // 2. Replace the "actions" column definition in the columns array:
      {
        id: "actions",
        header: t("Actions"),
        cell: ({ row }) => {
          const [isOpen, setIsOpen] = useState(false);
          const buttonRef = useRef<HTMLButtonElement | null>(null);
          const menuRef = useRef<HTMLDivElement | null>(null);

          const getMenuPosition = useCallback(() => {
            if (!buttonRef.current)
              return { top: 0, left: 0, shouldFlip: false };

            const rect = buttonRef.current.getBoundingClientRect();
            const menuWidth = 224; // Width of the dropdown (w-56 = 224px)

            // Check vertical space
            const spaceBelow = window.innerHeight - rect.bottom;
            const menuHeight = 150; // Approximate height of the menu
            const shouldFlipVertical = spaceBelow < menuHeight;

            // Check horizontal space
            const spaceRight = window.innerWidth - rect.left;
            const shouldFlipHorizontal = spaceRight < menuWidth;

            // Calculate positions
            const top = shouldFlipVertical
              ? rect.top - menuHeight
              : rect.bottom;

            // If not enough space on the right, align to the right edge of the button
            const left = shouldFlipHorizontal
              ? Math.max(0, rect.right - menuWidth)
              : Math.max(0, rect.left);

            return {
              top,
              left,
              shouldFlipVertical,
              shouldFlipHorizontal,
            };
          }, []);

          // Close menu when clicking outside
          useEffect(() => {
            if (!isOpen) return;

            const handleClickOutside = (event: MouseEvent) => {
              // First check if refs have current value
              if (!buttonRef.current || !menuRef.current) return;

              const target = event.target as Node;

              if (
                !buttonRef.current.contains(target) &&
                !menuRef.current.contains(target)
              ) {
                setIsOpen(false);
              }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () =>
              document.removeEventListener("mousedown", handleClickOutside);
          }, [isOpen]);

          return (
            <div className="relative inline-block text-left">
              <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t("Actions")}
                <ChevronDownIcon
                  className="w-5 h-5 ml-2 -mr-1 text-gray-500"
                  aria-hidden="true"
                />
              </button>

              {isOpen &&
                createPortal(
                  (() => {
                    // Calculate position here
                    const {
                      top,
                      left,
                      shouldFlipVertical,
                      shouldFlipHorizontal,
                    } = getMenuPosition();
                    const menuStyle = {
                      top: `${top}px`,
                      left: `${left}px`,
                      transformOrigin: shouldFlipVertical
                        ? "bottom " + (shouldFlipHorizontal ? "right" : "left")
                        : "top " + (shouldFlipHorizontal ? "right" : "left"),
                    };

                    return (
                      <div
                        ref={menuRef}
                        className="fixed z-50 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        style={menuStyle}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleEditMembership(row.original);
                              setIsOpen(false);
                            }}
                            className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          >
                            <PencilIcon
                              className="w-5 h-5 mr-3 text-primary-500"
                              aria-hidden="true"
                            />
                            {t("Edit")}
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteMembership(row.original.membershipId);
                              setIsOpen(false);
                            }}
                            className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          >
                            <TrashIcon
                              className="w-5 h-5 mr-3 text-red-500"
                              aria-hidden="true"
                            />
                            {t("Delete")}
                          </button>
                        </div>
                      </div>
                    );
                  })(),
                  document.body
                )}
            </div>
          );
        },
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
      <div className="bg-white shadow-sm rounded-md overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-base font-medium text-gray-700">
            {t("Memberships")}
          </h3>
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
              {isLoading && !memberships.length ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-3 text-center text-sm text-gray-500"
                  >
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
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-3 text-center text-sm text-gray-500"
                  >
                    {t("No memberships found.")}
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

      {/* Membership Form Modal */}
      <MembershipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? t("Edit Membership") : t("Create New Membership")}
      >
        <MembershipForm
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          membershipTypes={membershipTypes}
          isLoading={isLoading}
          isEditing={isEditing}
        />
      </MembershipModal>
    </div>
  );
};

export default AdminMemberships;
