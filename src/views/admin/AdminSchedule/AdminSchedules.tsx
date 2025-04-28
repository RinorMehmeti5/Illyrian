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
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  InputBase,
  Chip,
  Badge,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  MoreVert as MoreVertIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";

const AdminSchedules: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Menu state for action dropdown
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );

  // Fetch schedules when component mounts
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Show toast if error occurs
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
          color: theme.palette.mode === "dark" ? "#ffffff" : "#0f172a",
          borderLeft: `4px solid ${theme.palette.error.main}`,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 12px rgba(0, 0, 0, 0.3)"
              : "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      });
      clearError();
    }
  }, [error, clearError, theme]);

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
          : t("Schedule created successfully"),
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#0f172a",
            borderLeft: `4px solid ${theme.palette.success.main}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }
      );
      closeModal();
    }
  };

  // Handle edit button click
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
    }

    setInitialFormValues({
      scheduleId: schedule.scheduleId,
      startTime: startTimeStr,
      endTime: endTimeStr,
      dayOfWeek: schedule.dayOfWeek,
    });

    setIsEditing(true);
    setIsModalOpen(true);
    handleMenuClose();
  };

  // Handle delete button click
  const handleDeleteSchedule = async (id: number) => {
    const success = await deleteSchedule(id);
    if (success) {
      toast.success(t("Schedule deleted successfully"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
          color: theme.palette.mode === "dark" ? "#ffffff" : "#0f172a",
          borderLeft: `4px solid ${theme.palette.success.main}`,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 12px rgba(0, 0, 0, 0.3)"
              : "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      });
    }
    handleMenuClose();
  };

  // Confirm delete dialog
  const handleConfirmDelete = (id: number) => {
    if (window.confirm(t("Are you sure you want to delete this schedule?"))) {
      handleDeleteSchedule(id);
    }
  };

  // Handle create button click
  const handleCreateSchedule = () => {
    setInitialFormValues({
      startTime: "09:00",
      endTime: "17:00",
      dayOfWeek: "Monday",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  // Menu actions
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    scheduleId: number
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedScheduleId(scheduleId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedScheduleId(null);
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Table columns
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
        header: "",
        cell: ({ row }) => (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Tooltip title={t("Actions")}>
              <IconButton
                aria-label="actions"
                size="small"
                onClick={(e) => handleMenuOpen(e, row.original.scheduleId)}
                sx={{
                  transition: "all 0.2s",
                  color: theme.palette.text.secondary,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.04)",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
        enableSorting: false,
      },
    ],
    [t, theme]
  );

  // TanStack Table instance
  const table = useReactTable({
    data: schedules,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination: {
        pageIndex: page,
        pageSize: rowsPerPage,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Get day of week chip color
  const getDayColor = (day: string) => {
    const colors: Record<string, string> = {
      Monday: theme.palette.primary.main,
      Tuesday: "#10b981", // emerald-500
      Wednesday: "#f59e0b", // amber-500
      Thursday: "#3b82f6", // blue-500
      Friday: "#8b5cf6", // violet-500
      Saturday: "#ec4899", // pink-500
      Sunday: "#ef4444", // red-500
    };
    return colors[day] || theme.palette.primary.main;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: theme.palette.mode === "dark" ? "white" : "text.primary",
                mb: 1,
              }}
            >
              {t("Schedule Management")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500 }}
            >
              {t(
                "Create and manage gym operation schedules across different days of the week."
              )}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateSchedule}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: "8px",
                backgroundColor: theme.palette.primary.main,
                color: "white",
                fontWeight: 500,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(99, 102, 241, 0.3)"
                    : "0 4px 12px rgba(79, 70, 229, 0.2)",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  transform: "translateY(-2px)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 6px 16px rgba(99, 102, 241, 0.4)"
                      : "0 6px 16px rgba(79, 70, 229, 0.3)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {t("Add New Schedule")}
            </Button>
          </motion.div>
        </Box>

        {/* Filters and Search */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "12px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "white",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                : "0 4px 12px rgba(0, 0, 0, 0.05)",
            gap: 2,
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", ml: 1, flex: 1 }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: "8px",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.04)",
                width: { xs: "100%", sm: 300 },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box sx={{ pl: 2, pr: 1, display: "flex", alignItems: "center" }}>
                <SearchIcon color="action" />
              </Box>
              <InputBase
                placeholder={t("Search schedules...")}
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                sx={{
                  flex: 1,
                  fontSize: "0.875rem",
                  color: "inherit",
                  p: 1,
                  width: "100%",
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mr: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {t("Filter by:")}
            </Typography>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <Chip
                key={day}
                label={t(day)}
                size="small"
                variant="outlined"
                onClick={() => setGlobalFilter(day)}
                sx={{
                  borderColor: getDayColor(day),
                  color: getDayColor(day),
                  "&:hover": {
                    backgroundColor: alpha(getDayColor(day), 0.1),
                  },
                  ...(globalFilter === day && {
                    backgroundColor: alpha(getDayColor(day), 0.1),
                    borderColor: getDayColor(day),
                    color: getDayColor(day),
                  }),
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Schedules Table */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "white",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                : "0 4px 12px rgba(0, 0, 0, 0.05)",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 16px rgba(0, 0, 0, 0.2)"
                  : "0 8px 16px rgba(0, 0, 0, 0.1)",
            },
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t("Schedules")}
            </Typography>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="schedules table">
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        align={header.id === "actions" ? "right" : "left"}
                        sortDirection={
                          header.column.getIsSorted()
                            ? header.column.getIsSorted() === "asc"
                              ? "asc"
                              : "desc"
                            : false
                        }
                        sx={{
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.02)"
                              : "rgba(0,0,0,0.01)",
                          color: theme.palette.text.secondary,
                          fontWeight: 600,
                          py: 2,
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: header.column.getCanSort()
                                ? "pointer"
                                : "default",
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <Box
                                sx={{
                                  position: "relative",
                                  ml: 1,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {header.column.getIsSorted() ? (
                                  header.column.getIsSorted() === "asc" ? (
                                    <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                                  ) : (
                                    <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                                  )
                                ) : (
                                  <FilterListIcon
                                    sx={{ fontSize: 16, opacity: 0.5 }}
                                  />
                                )}
                              </Box>
                            )}
                          </Box>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {isLoading && !schedules.length ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <Box
                        sx={{
                          py: 8,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <CircularProgress size={40} color="primary" />
                        <Typography variant="body1" color="text.secondary">
                          {t("Loading schedules...")}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <Box
                        sx={{
                          py: 8,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TimelineIcon
                            sx={{
                              fontSize: 30,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        </Box>
                        <Typography variant="h6" color="text.secondary">
                          {t("No schedules found")}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ maxWidth: 300, textAlign: "center" }}
                        >
                          {t(
                            "There are no schedules matching your search criteria. Try adjusting your search or create a new schedule."
                          )}
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={handleCreateSchedule}
                          sx={{ mt: 2 }}
                        >
                          {t("Add New Schedule")}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        component={motion.tr}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.02)",
                          },
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onClick={() => handleEditSchedule(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => {
                          // Special handling for day of week cell
                          if (cell.column.id === "dayOfWeek") {
                            return (
                              <TableCell
                                key={cell.id}
                                component="th"
                                scope="row"
                              >
                                <Chip
                                  label={cell.getValue() as string}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(
                                      getDayColor(cell.getValue() as string),
                                      0.15
                                    ),
                                    color: getDayColor(
                                      cell.getValue() as string
                                    ),
                                    fontWeight: 500,
                                    borderRadius: "6px",
                                  }}
                                />
                              </TableCell>
                            );
                          }

                          // Default rendering for other cells
                          return (
                            <TableCell
                              key={cell.id}
                              align={
                                cell.column.id === "actions" ? "right" : "left"
                              }
                              onClick={
                                cell.column.id === "actions"
                                  ? (e) => e.stopPropagation()
                                  : undefined
                              }
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Table Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  fontSize: "0.875rem",
                },
              ".MuiTablePagination-actions": {
                "& button": {
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                  },
                },
              },
            }}
            ActionsComponent={({ count, page, rowsPerPage, onPageChange }) => (
              <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                <IconButton
                  onClick={(e) => onPageChange(e, page - 1)}
                  disabled={page === 0}
                  aria-label="previous page"
                  sx={{
                    color: theme.palette.text.secondary,
                    "&.Mui-disabled": {
                      opacity: 0.3,
                    },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => onPageChange(e, page + 1)}
                  disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                  aria-label="next page"
                  sx={{
                    color: theme.palette.text.secondary,
                    "&.Mui-disabled": {
                      opacity: 0.3,
                    },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            )}
          />
        </Paper>

        {/* Action Menu for Edit/Delete */}
        <Menu
          id="schedule-actions-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              minWidth: 180,
              borderRadius: "12px",
              mt: 1,
              overflow: "visible",
              backgroundColor:
                theme.palette.mode === "dark" ? "#1A1C25" : "#FFFFFF",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: theme.palette.mode === "dark" ? "#1A1C25" : "#FFFFFF",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {/* Edit option */}
          <MenuItem
            onClick={() => {
              if (selectedScheduleId !== null) {
                const schedule = schedules.find(
                  (s) => s.scheduleId === selectedScheduleId
                );
                if (schedule) {
                  handleEditSchedule(schedule);
                }
              }
            }}
            sx={{
              borderRadius: "8px",
              mx: 0.5,
              my: 0.5,
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.06)",
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">{t("Edit")}</Typography>
          </MenuItem>

          {/* Delete option */}
          <MenuItem
            onClick={() => {
              if (selectedScheduleId !== null) {
                handleConfirmDelete(selectedScheduleId);
              }
            }}
            sx={{
              borderRadius: "8px",
              mx: 0.5,
              my: 0.5,
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,55,55,0.1)"
                    : "rgba(255,55,55,0.06)",
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.error.main }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">{t("Delete")}</Typography>
          </MenuItem>
        </Menu>

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
      </Box>
    </motion.div>
  );
};

export default AdminSchedules;
