// admin/AdminSchedule/ScheduleModal.tsx
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ScheduleModalProps } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const theme = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={onClose}
          >
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                  aria-hidden="true"
                />
              </Transition.Child>

              {/* Center modal */}
              <span
                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-10 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-10 scale-95"
              >
                <Paper
                  elevation={6}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative inline-block transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1A1C25" : "#FFFFFF",
                    borderRadius: "16px",
                    padding: "24px",
                    backdropFilter: "blur(8px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
                        : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    border:
                      theme.palette.mode === "dark"
                        ? "1px solid rgba(255, 255, 255, 0.05)"
                        : "1px solid rgba(0, 0, 0, 0.05)",
                    maxWidth: "500px",
                    width: "100%",
                    margin: "0 auto",
                  }}
                >
                  {/* Modal Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      pb: 2,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        color:
                          theme.palette.mode === "dark"
                            ? "white"
                            : "text.primary",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {title}
                    </Typography>
                    <IconButton
                      onClick={onClose}
                      size="small"
                      aria-label="close"
                      sx={{
                        color: theme.palette.text.secondary,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.04)",
                        borderRadius: "8px",
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.08)",
                          transform: "scale(1.05)",
                        },
                        "&:active": {
                          transform: "scale(0.98)",
                        },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Modal Content */}
                  <Box sx={{ py: 1 }}>{children}</Box>
                </Paper>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </AnimatePresence>
  );
};

export default ScheduleModal;
