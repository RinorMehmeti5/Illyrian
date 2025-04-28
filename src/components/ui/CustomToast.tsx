// src/components/ui/CustomToast.tsx
import React from "react";
import { useTheme } from "@mui/material/styles";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Typography, IconButton } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Type for our custom toast
export type ToastType = "success" | "error" | "info" | "warning";

// Interface for our showToast function
interface ShowToastOptions extends ToastOptions {
  title?: string;
  message: string;
}

// Custom Toast Container Component
export const CustomToastContainer: React.FC = () => {
  const theme = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme.palette.mode === "dark" ? "dark" : "light"}
      style={{ zIndex: 9999 }}
      toastStyle={{
        borderRadius: "12px",
        backgroundColor: theme.palette.mode === "dark" ? "#1A1C25" : "#FFFFFF",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 8px 16px rgba(0, 0, 0, 0.3)"
            : "0 8px 16px rgba(0, 0, 0, 0.1)",
        padding: "6px 8px",
        margin: "0 0 12px 0",
      }}
    />
  );
};

// Custom Toast Component
interface ToastContentProps {
  type: ToastType;
  title?: string;
  message: string;
  closeToast?: () => void;
}

export const ToastContent: React.FC<ToastContentProps> = ({
  type,
  title,
  message,
  closeToast,
}) => {
  const theme = useTheme();

  // Define toast icons and colors based on type
  const toastConfig = {
    success: {
      icon: <CheckCircleIcon fontSize="small" />,
      color: theme.palette.success.main,
      borderColor: theme.palette.success.main,
      bgColor:
        theme.palette.mode === "dark"
          ? `${theme.palette.success.dark}20`
          : `${theme.palette.success.light}20`,
    },
    error: {
      icon: <ErrorIcon fontSize="small" />,
      color: theme.palette.error.main,
      borderColor: theme.palette.error.main,
      bgColor:
        theme.palette.mode === "dark"
          ? `${theme.palette.error.dark}20`
          : `${theme.palette.error.light}20`,
    },
    warning: {
      icon: <WarningIcon fontSize="small" />,
      color: theme.palette.warning.main,
      borderColor: theme.palette.warning.main,
      bgColor:
        theme.palette.mode === "dark"
          ? `${theme.palette.warning.dark}20`
          : `${theme.palette.warning.light}20`,
    },
    info: {
      icon: <InfoIcon fontSize="small" />,
      color: theme.palette.info.main,
      borderColor: theme.palette.info.main,
      bgColor:
        theme.palette.mode === "dark"
          ? `${theme.palette.info.dark}20`
          : `${theme.palette.info.light}20`,
    },
  };

  const { icon, color, borderColor, bgColor } = toastConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          borderLeft: `4px solid ${borderColor}`,
          borderRadius: "4px",
          backgroundColor: bgColor,
          padding: "8px 12px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            color: color,
            mr: 1.5,
            mt: 0.25,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ flex: 1 }}>
          {title && (
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                mb: 0.5,
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8125rem",
              color: theme.palette.text.secondary,
              wordBreak: "break-word",
            }}
          >
            {message}
          </Typography>
        </Box>

        <IconButton
          size="small"
          aria-label="close"
          onClick={closeToast}
          sx={{
            color: theme.palette.text.secondary,
            p: 0.5,
            ml: 0.5,
            mt: -0.5,
            mr: -0.5,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          <CloseIcon fontSize="small" sx={{ fontSize: "0.75rem" }} />
        </IconButton>
      </Box>
    </motion.div>
  );
};

// Custom toast functions
export const showToast = {
  success: ({ title, message, ...options }: ShowToastOptions) => {
    return toast.success(
      (props) => (
        <ToastContent
          type="success"
          title={title}
          message={message}
          {...props}
        />
      ),
      options
    );
  },
  error: ({ title, message, ...options }: ShowToastOptions) => {
    return toast.error(
      (props) => (
        <ToastContent type="error" title={title} message={message} {...props} />
      ),
      options
    );
  },
  info: ({ title, message, ...options }: ShowToastOptions) => {
    return toast.info(
      (props) => (
        <ToastContent type="info" title={title} message={message} {...props} />
      ),
      options
    );
  },
  warning: ({ title, message, ...options }: ShowToastOptions) => {
    return toast.warning(
      (props) => (
        <ToastContent
          type="warning"
          title={title}
          message={message}
          {...props}
        />
      ),
      options
    );
  },
};

export default CustomToastContainer;
