// src/components/layouts/ModernAdminLayout.tsx
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Box,
  CssBaseline,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Toolbar,
  Typography,
  Drawer as MuiDrawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  Timeline as TimelineIcon,
  SportsGymnastics as SportsGymnasticsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import useAuthStore from "../../store/authStore";
import { motion } from "framer-motion";
import { useThemeContext } from "../../contexts/ThemeContext";
import PageTransition from "../ui/PageTransition";
import { showToast } from "../ui/CustomToast";

// Import Roboto font
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const drawerWidth = 260;
const closedDrawerWidth = 70;

// Interface for the custom AppBar props
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  isMobile?: boolean;
  themeMode: "light" | "dark";
}

// Styled AppBar component that adjusts width based on drawer state
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    prop !== "open" && prop !== "isMobile" && prop !== "themeMode",
})<AppBarProps>(({ theme, open, isMobile, themeMode }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: themeMode === "dark" ? "#1A1C25" : "#FFFFFF",
  color: themeMode === "dark" ? "#FFFFFF" : "#333333",
  boxShadow:
    themeMode === "dark"
      ? "0 4px 6px rgba(0, 0, 0, 0.3)"
      : "0 4px 6px rgba(0, 0, 0, 0.05)",
  ...(open &&
    !isMobile && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

// Styled Drawer component with open/closed states
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "themeMode",
})<{ open: boolean; themeMode: "light" | "dark" }>(
  ({ theme, open, themeMode }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    height: "100vh",
    "& .MuiDrawer-paper": {
      backgroundColor: themeMode === "dark" ? "#111218" : "#FFFFFF",
      color: themeMode === "dark" ? "#FFFFFF" : "#333333",
      boxShadow:
        themeMode === "dark"
          ? "3px 0 10px rgba(0, 0, 0, 0.3)"
          : "3px 0 10px rgba(0, 0, 0, 0.05)",
    },
    ...(open && {
      width: drawerWidth,
      "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        height: "100vh",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        overflowX: "hidden",
      },
    }),
    ...(!open && {
      width: closedDrawerWidth,
      "& .MuiDrawer-paper": {
        position: "relative",
        overflowX: "hidden",
        width: closedDrawerWidth,
        height: "100vh",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        boxSizing: "border-box",
      },
    }),
  })
);

// SearchBox component
const SearchBox = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "8px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled("input")(({ theme }) => ({
  color: "inherit",
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  padding: theme.spacing(1, 1, 1, 0),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create("width"),
  width: "100%",
  [theme.breakpoints.up("md")]: {
    width: "20ch",
  },
}));

const ModernAdminLayout: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Use our theme context
  const { themeMode, toggleThemeMode } = useThemeContext();

  // Toggle drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Profile menu
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Notification menu
  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  // Logout handler
  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    showToast.success({
      title: "Logged Out",
      message: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    toggleThemeMode();
    showToast.info({
      message: `Switched to ${themeMode === "light" ? "dark" : "light"} mode`,
    });
  };

  // Menu items configuration
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Memberships", icon: <PaymentIcon />, path: "/admin/memeberships" },
    { text: "Schedule", icon: <TimelineIcon />, path: "/admin/schedule" },
    {
      text: "Exercises",
      icon: <SportsGymnasticsIcon />,
      path: "/admin/exercises",
    },
    { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
  ];

  // Check if current path matches menu item path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    // Close drawer automatically on mobile
    if (isMobile) {
      setOpen(false);
    }
  };

  // Drawer content
  const drawerContent = (
    <>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: [1],
          py: 2,
        }}
      >
        {open && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: themeMode === "dark" ? "primary.light" : "primary.main",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SportsGymnasticsIcon /> GYM ADMIN
          </Typography>
        )}
        <IconButton
          onClick={handleDrawerClose}
          sx={{
            backgroundColor:
              themeMode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.04)",
            borderRadius: "50%",
            padding: "8px",
            "&:hover": {
              backgroundColor:
                themeMode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          mt: 2,
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor:
              themeMode === "dark"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.2)",
            borderRadius: "2px",
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block", mb: 0.5 }}
                component={motion.li}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    borderRadius: "8px",
                    mx: 1,
                    backgroundColor: active
                      ? themeMode === "dark"
                        ? "rgba(99, 102, 241, 0.2)"
                        : "rgba(79, 70, 229, 0.1)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: active
                        ? themeMode === "dark"
                          ? "rgba(99, 102, 241, 0.3)"
                          : "rgba(79, 70, 229, 0.2)"
                        : themeMode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.04)",
                      transform: "translateX(4px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => handleMenuItemClick(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: active
                        ? "primary.main"
                        : themeMode === "dark"
                        ? "text.secondary"
                        : "text.primary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: active ? "primary.main" : "inherit",
                      "& .MuiTypography-root": {
                        fontWeight: active ? 600 : 400,
                        transition: "font-weight 0.2s ease",
                      },
                    }}
                  />
                  {active && open && (
                    <Box
                      component={motion.div}
                      layoutId="activeIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      sx={{
                        width: "4px",
                        height: "100%",
                        position: "absolute",
                        right: 0,
                        top: 0,
                        backgroundColor: "primary.main",
                        borderRadius: "4px 0 0 4px",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      {open && (
        <Box sx={{ position: "absolute", bottom: 0, width: "100%", p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              borderRadius: "12px",
              backgroundColor:
                themeMode === "dark"
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.02)",
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>
              {themeMode === "dark" ? "Dark" : "Light"} Mode
            </Typography>
            <IconButton
              onClick={handleThemeToggle}
              size="small"
              sx={{
                color: themeMode === "dark" ? "primary.light" : "primary.main",
                backgroundColor:
                  themeMode === "dark"
                    ? "rgba(129, 140, 248, 0.1)"
                    : "rgba(79, 70, 229, 0.1)",
                "&:hover": {
                  backgroundColor:
                    themeMode === "dark"
                      ? "rgba(129, 140, 248, 0.2)"
                      : "rgba(79, 70, 229, 0.2)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        isMobile={isMobile}
        themeMode={themeMode}
        elevation={0}
      >
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && !isMobile && { display: "none" }),
              borderRadius: "8px",
              p: "8px",
              backgroundColor:
                themeMode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
              "&:hover": {
                backgroundColor:
                  themeMode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.08)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <MenuIcon />
          </IconButton>

          <SearchBox
            sx={{
              display: { xs: "none", md: "flex" },
              backgroundColor:
                themeMode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" aria-label="search" />
          </SearchBox>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notification icon */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
              sx={{
                mx: 1,
                borderRadius: "8px",
                p: "8px",
                backgroundColor:
                  themeMode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.04)",
                "&:hover": {
                  backgroundColor:
                    themeMode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.08)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Theme toggle icon for mobile */}
          <IconButton
            color="inherit"
            onClick={handleThemeToggle}
            sx={{
              display: { xs: "flex", md: open ? "none" : "flex" },
              mx: 1,
              borderRadius: "8px",
              p: "8px",
              backgroundColor:
                themeMode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
              "&:hover": {
                backgroundColor:
                  themeMode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.08)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* Profile avatar */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls={Boolean(anchorEl) ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? "true" : undefined}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor:
                    themeMode === "dark" ? "primary.dark" : "primary.main",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                {username?.charAt(0).toUpperCase() || "U"}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Menu for profile */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            mt: 1.5,
            width: 200,
            backgroundColor: themeMode === "dark" ? "#1A1C25" : "#FFFFFF",
            "& .MuiMenuItem-root": {
              borderRadius: "4px",
              mx: 0.5,
              my: 0.25,
              transition: "background-color 0.2s ease, transform 0.2s ease",
              "&:hover": {
                backgroundColor:
                  themeMode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.04)",
                transform: "translateX(4px)",
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administrator
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => navigate("/admin/profile")}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Menu for notifications */}
      <Menu
        anchorEl={notificationAnchorEl}
        id="notification-menu"
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        onClick={handleNotificationMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            mt: 1.5,
            width: 300,
            maxHeight: 400,
            backgroundColor: themeMode === "dark" ? "#1A1C25" : "#FFFFFF",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Notifications
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{
              cursor: "pointer",
              transition: "opacity 0.2s ease",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            Mark all as read
          </Typography>
        </Box>
        <Divider />
        {/* Notification items */}
        {[
          { title: "New User Registration", time: "2 min ago", read: false },
          {
            title: "Membership Payment Received",
            time: "1 hour ago",
            read: false,
          },
          { title: "Schedule Updated", time: "3 hours ago", read: true },
        ].map((notification, index) => (
          <MenuItem
            key={index}
            sx={{
              py: 1.5,
              backgroundColor:
                !notification.read && themeMode === "dark"
                  ? "rgba(99, 102, 241, 0.1)"
                  : !notification.read && themeMode === "light"
                  ? "rgba(79, 70, 229, 0.05)"
                  : "transparent",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor:
                  !notification.read && themeMode === "dark"
                    ? "rgba(99, 102, 241, 0.15)"
                    : !notification.read && themeMode === "light"
                    ? "rgba(79, 70, 229, 0.08)"
                    : themeMode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
              },
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: notification.read ? 400 : 600 }}
              >
                {notification.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          sx={{
            justifyContent: "center",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor:
                themeMode === "dark"
                  ? "rgba(99, 102, 241, 0.08)"
                  : "rgba(79, 70, 229, 0.05)",
            },
          }}
        >
          <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
            View all notifications
          </Typography>
        </MenuItem>
      </Menu>

      {isMobile ? (
        // Mobile drawer - temporary variant that overlays content
        <MuiDrawer
          variant="temporary"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: themeMode === "dark" ? "#111218" : "#FFFFFF",
              borderRight: "none",
            },
          }}
        >
          {drawerContent}
        </MuiDrawer>
      ) : (
        // Desktop drawer - permanent variant that adjusts content width
        <Drawer
          variant="permanent"
          open={open}
          themeMode={themeMode}
          PaperProps={{
            sx: {
              backgroundColor: themeMode === "dark" ? "#111218" : "#FFFFFF",
              borderRight: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content area that adjusts based on drawer state */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: {
            xs: "100%", // Full width on mobile
            md: `calc(100% - ${open ? drawerWidth : closedDrawerWidth}px)`, // Adjusted width on desktop
          },
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <PageTransition>
          <Outlet />
        </PageTransition>
      </Box>
    </Box>
  );
};

export default ModernAdminLayout;
