// src/theme/modernTheme.ts
import { createTheme, ThemeOptions } from "@mui/material/styles";

// Create a theme instance for light and dark modes
export const getModernTheme = (mode: "light" | "dark"): ThemeOptions => {
  return {
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#6366f1" : "#4f46e5",
        dark: mode === "dark" ? "#4338ca" : "#3730a3",
        light: mode === "dark" ? "#818cf8" : "#a5b4fc",
        contrastText: "#ffffff",
      },
      secondary: {
        main: mode === "dark" ? "#64748b" : "#475569",
        light: mode === "dark" ? "#94a3b8" : "#94a3b8",
        dark: mode === "dark" ? "#334155" : "#1e293b",
        contrastText: "#ffffff",
      },
      error: {
        main: mode === "dark" ? "#ef4444" : "#dc2626",
        light: mode === "dark" ? "#f87171" : "#f87171",
        dark: mode === "dark" ? "#b91c1c" : "#991b1b",
      },
      warning: {
        main: mode === "dark" ? "#f59e0b" : "#d97706",
        light: mode === "dark" ? "#fbbf24" : "#fbbf24",
        dark: mode === "dark" ? "#b45309" : "#92400e",
      },
      info: {
        main: mode === "dark" ? "#3b82f6" : "#2563eb",
        light: mode === "dark" ? "#60a5fa" : "#60a5fa",
        dark: mode === "dark" ? "#1d4ed8" : "#1e40af",
      },
      success: {
        main: mode === "dark" ? "#10b981" : "#059669",
        light: mode === "dark" ? "#34d399" : "#34d399",
        dark: mode === "dark" ? "#059669" : "#047857",
      },
      background: {
        default: mode === "dark" ? "#121318" : "#f8fafc",
        paper: mode === "dark" ? "#1A1C25" : "#FFFFFF",
      },
      text: {
        primary: mode === "dark" ? "#FFFFFF" : "#0f172a",
        secondary: mode === "dark" ? "#94a3b8" : "#64748b",
        disabled: mode === "dark" ? "#475569" : "#cbd5e1",
      },
      divider:
        mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: "2rem",
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.75rem",
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.25rem",
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: "1.125rem",
        lineHeight: 1.5,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
      },
      button: {
        fontWeight: 500,
        fontSize: "0.875rem",
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: mode === "dark" ? "#121318" : "#f1f5f9",
            },
            "&::-webkit-scrollbar-thumb": {
              background: mode === "dark" ? "#3f3f46" : "#cbd5e1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: mode === "dark" ? "#52525b" : "#94a3b8",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            padding: "8px 16px",
            fontWeight: 500,
            textTransform: "none",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow:
                mode === "dark"
                  ? "0 6px 10px rgba(0, 0, 0, 0.25)"
                  : "0 6px 10px rgba(0, 0, 0, 0.1)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          },
          containedPrimary: {
            backgroundImage:
              mode === "dark"
                ? "linear-gradient(135deg, #5E60E7 0%, #7D74F4 100%)"
                : "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
            boxShadow:
              mode === "dark"
                ? "0 4px 12px rgba(99, 102, 241, 0.3)"
                : "0 4px 12px rgba(79, 70, 229, 0.2)",
            "&:hover": {
              backgroundImage:
                mode === "dark"
                  ? "linear-gradient(135deg, #4E50D7 0%, #6D64E4 100%)"
                  : "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
              boxShadow:
                mode === "dark"
                  ? "0 6px 16px rgba(99, 102, 241, 0.4)"
                  : "0 6px 16px rgba(79, 70, 229, 0.3)",
            },
          },
          outlinedPrimary: {
            borderColor: mode === "dark" ? "#6366f1" : "#4f46e5",
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(99, 102, 241, 0.08)"
                  : "rgba(79, 70, 229, 0.08)",
              borderColor: mode === "dark" ? "#818cf8" : "#6366f1",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.06)",
              transform: "scale(1.05)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            boxShadow:
              mode === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                : "0 4px 12px rgba(0, 0, 0, 0.05)",
            transition: "box-shadow 0.3s ease, transform 0.2s ease",
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 8px 24px rgba(0, 0, 0, 0.3)"
                  : "0 8px 24px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-4px)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow:
              mode === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                : "0 4px 12px rgba(0, 0, 0, 0.05)",
            borderRadius: "12px",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 8px 16px rgba(0, 0, 0, 0.3)"
                  : "0 8px 16px rgba(0, 0, 0, 0.1)",
            },
          },
          elevation1: {
            boxShadow:
              mode === "dark"
                ? "0 2px 8px rgba(0, 0, 0, 0.15)"
                : "0 2px 8px rgba(0, 0, 0, 0.05)",
          },
          elevation2: {
            boxShadow:
              mode === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                : "0 4px 12px rgba(0, 0, 0, 0.08)",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${
              mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.08)"
            }`,
            padding: "16px",
          },
          head: {
            fontWeight: 600,
            backgroundColor:
              mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:last-child td": {
              borderBottom: 0,
            },
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)",
            },
            transition: "background-color 0.2s ease",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease",
            borderRadius: "8px",
            "&.Mui-focused": {
              boxShadow:
                mode === "dark"
                  ? "0 0 0 2px rgba(99, 102, 241, 0.3)"
                  : "0 0 0 2px rgba(79, 70, 229, 0.3)",
            },
          },
          input: {
            padding: "12px 14px",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            transition: "box-shadow 0.2s ease",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === "dark" ? "#6366f1" : "#4f46e5",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: "1px",
              borderColor: mode === "dark" ? "#6366f1" : "#4f46e5",
              boxShadow:
                mode === "dark"
                  ? "0 0 0 3px rgba(99, 102, 241, 0.2)"
                  : "0 0 0 3px rgba(79, 70, 229, 0.2)",
            },
          },
          notchedOutline: {
            borderColor:
              mode === "dark"
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(0, 0, 0, 0.15)",
            transition: "border-color 0.2s ease",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            transition: "all 0.2s ease",
            margin: "4px 8px",
            "&.Mui-selected": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(99, 102, 241, 0.2)"
                  : "rgba(79, 70, 229, 0.1)",
              "&:hover": {
                backgroundColor:
                  mode === "dark"
                    ? "rgba(99, 102, 241, 0.3)"
                    : "rgba(79, 70, 229, 0.2)",
              },
            },
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
              transform: "translateX(4px)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "6px",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 2px 6px rgba(0, 0, 0, 0.2)"
                  : "0 2px 6px rgba(0, 0, 0, 0.1)",
            },
          },
          filled: {
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(99, 102, 241, 0.85)"
                  : "rgba(79, 70, 229, 0.85)",
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 42,
            height: 26,
            padding: 0,
            margin: 8,
          },
          switchBase: {
            padding: 1,
            "&.Mui-checked": {
              transform: "translateX(16px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor: mode === "dark" ? "#6366f1" : "#4f46e5",
                opacity: 1,
                border: "none",
              },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
              color: "#6366f1",
              border: "6px solid #fff",
            },
          },
          thumb: {
            width: 24,
            height: 24,
          },
          track: {
            borderRadius: 13,
            border: `1px solid ${mode === "dark" ? "#39393D" : "#E9E9EA"}`,
            backgroundColor: mode === "dark" ? "#39393D" : "#E9E9EA",
            opacity: 1,
            transition: "background-color 0.2s ease",
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow:
                mode === "dark"
                  ? "0 3px 8px rgba(0, 0, 0, 0.3)"
                  : "0 3px 8px rgba(0, 0, 0, 0.15)",
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === "dark" ? "#1A1C25" : "#0f172a",
            color: "#fff",
            boxShadow:
              mode === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
            fontSize: "0.75rem",
            fontWeight: 500,
            borderRadius: "6px",
            padding: "8px 12px",
          },
          arrow: {
            color: mode === "dark" ? "#1A1C25" : "#0f172a",
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: "12px",
            boxShadow:
              mode === "dark"
                ? "0 8px 16px rgba(0, 0, 0, 0.4)"
                : "0 8px 16px rgba(0, 0, 0, 0.1)",
          },
          list: {
            padding: "8px",
          },
        },
      },
    },
  };
};

// Create and export themes
export const lightTheme = createTheme(getModernTheme("light"));
export const darkTheme = createTheme(getModernTheme("dark"));

export default getModernTheme;
