// admin/AdminSchedule/AdminSchedules.tsx
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { createPortal } from "react-dom";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useScheduleStore from "../../../store/scheduleStore";
import {
  CreateScheduleRequest,
  UpdateScheduleRequest,
  ScheduleDTO,
} from "../../../services/ScheduleService";
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
import ScheduleForm from "./ScheduleForm";
import ScheduleModal from "./ScheduleModal";
import { ScheduleFormValues } from "./types";
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const AdminSchedules: React.FC = () => {
  const { t } = useTranslation();
  const {
    schedules,
    isLoading,
    error,
    selectedSchedule,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    setSelectedSchedule,
    clearError,
  } = useScheduleStore();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form initial values
  const [initialFormValues, setInitialFormValues] =
    useState<ScheduleFormValues>({
      startTime: "09:00",
      endTime: "17:00",
      dayOfWeek: "Monday",
    });

  // TanStack Table state
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // Fetch schedules when component mounts
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Show error toast if error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Handle form submission
  const handleFormSubmit = async (values: ScheduleFormValues) => {
    let success = false;

    if (isEditing && values.scheduleId) {
      const updateData: UpdateScheduleRequest = {
        scheduleId: values.scheduleId,
        startTime: values.startTime,
        endTime: values.endTime,
        dayOfWeek: values.dayOfWeek,
      };
      success = await updateSchedule(values.scheduleId, updateData);
    } else {
      const createData: CreateScheduleRequest = {
        startTime: values.startTime,
        endTime: values.endTime,
        dayOfWeek: values.dayOfWeek,
      };
      success = await createSchedule(createData);
    }

    if (success) {
      toast.success(
        isEditing
          ? t("Schedule updated successfully")
          : t("Schedule created successfully")
      );
      closeModal();
    }
  };

  // Handle edit schedule button click
  const handleEditSchedule = (schedule: ScheduleDTO) => {
    setSelectedSchedule(schedule);

    // Safely parse date strings with error handling
    let startTimeStr = "09:00";
    let endTimeStr = "17:00";

    try {
      // First check if the date values might be strings that need to be parsed
      const startDate =
        typeof schedule.startTime === "string"
          ? new Date(schedule.startTime)
          : new Date(schedule.startTime);

      const endDate =
        typeof schedule.endTime === "string"
          ? new Date(schedule.endTime)
          : new Date(schedule.endTime);

      // Check if dates are valid before using them
      if (!isNaN(startDate.getTime())) {
        startTimeStr =
          startDate.getHours().toString().padStart(2, "0") +
          ":" +
          startDate.getMinutes().toString().padStart(2, "0");
      }

      if (!isNaN(endDate.getTime())) {
        endTimeStr =
          endDate.getHours().toString().padStart(2, "0") +
          ":" +
          endDate.getMinutes().toString().padStart(2, "0");
      }
    } catch (error) {
      console.error("Error parsing schedule dates:", error);
      // Use default times if parsing fails
    }

    setInitialFormValues({
      scheduleId: schedule.scheduleId,
      startTime: startTimeStr,
      endTime: endTimeStr,
      dayOfWeek: schedule.dayOfWeek,
    });

    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle delete schedule button click
  const handleDeleteSchedule = async (id: number) => {
    if (window.confirm(t("Are you sure you want to delete this schedule?"))) {
      const success = await deleteSchedule(id);
      if (success) {
        toast.success(t("Schedule deleted successfully"));
      }
    }
  };

  // Handle create new schedule button click
  const handleCreateSchedule = () => {
    setInitialFormValues({
      startTime: "09:00",
      endTime: "17:00",
      dayOfWeek: "Monday",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  // TanStack Table columns
  const columns = useMemo<ColumnDef<ScheduleDTO, any>[]>(
    () => [
      {
        accessorKey: "dayOfWeek",
        header: t("Day of Week"),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "formattedStartTime",
        header: t("Start Time"),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "formattedEndTime",
        header: t("End Time"),
        cell: (info) => info.getValue(),
      },
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
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent hover:border-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t("Actions")}
                <ChevronDownIcon
                  className="w-5 h-5 ml-2 -mr-1 text-gray-100"
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
                              handleEditSchedule(row.original);
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
                              handleDeleteSchedule(row.original.scheduleId);
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

  // Rest of the component remains the same...

  // TanStack Table instance
  const table = useReactTable({
    data: schedules,
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
      {/* Rest of the JSX remains the same... */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("Schedule Management")}</h2>
        <button
          onClick={handleCreateSchedule}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {t("Add New Schedule")}
        </button>
      </div>

      {/* Schedules Table */}
      <div className="bg-white shadow-sm rounded-md overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-base font-medium text-gray-700">
            {t("Schedules")}
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
              {isLoading && !schedules.length ? (
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
                      <p className="mt-2">{t("Loading schedules...")}</p>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-3 text-center text-sm text-gray-500"
                  >
                    {t("No schedules found.")}
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

        {/* Pagination section remains the same */}
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

      {/* Schedule Form Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? t("Edit Schedule") : t("Create New Schedule")}
      >
        <ScheduleForm
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          isLoading={isLoading}
          isEditing={isEditing}
        />
      </ScheduleModal>
    </div>
  );
};

export default AdminSchedules;
