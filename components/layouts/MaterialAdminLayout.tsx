// src/components/layouts/MaterialAdminLayout.tsx
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { styled, ThemeProvider, useTheme } from "@mui/material/styles";
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import adminTheme from "../../src/theme/adminTheme";
import useAuthStore from "../../src/store/authStore";

// Import Roboto font
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const drawerWidth = 240;
const closedDrawerWidth = 64; // Equivalent to theme.spacing(8)

// Interface for the custom AppBar props
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  isMobile?: boolean;
}

// Styled AppBar component that adjusts width based on drawer state
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile",
})<AppBarProps>(({ theme, open, isMobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
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
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  height: "100vh",
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
}));

const MaterialAdminLayout = () => {
  const [open, setOpen] = useState(true);
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Memberships", icon: <PaymentIcon />, path: "/admin/memeberships" },
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
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  backgroundColor: active
                    ? "rgba(0, 0, 0, 0.08)"
                    : "transparent",
                }}
                onClick={() => handleMenuItemClick(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: active ? "primary.main" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: active ? "primary.main" : "inherit",
                    fontWeight: active ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} isMobile={isMobile}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && !isMobile && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />

            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {username}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <Typography variant="body2">Logout</Typography>
            </IconButton>
          </Toolbar>
        </AppBar>

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
              },
            }}
          >
            {drawerContent}
          </MuiDrawer>
        ) : (
          // Desktop drawer - permanent variant that adjusts content width
          <Drawer variant="permanent" open={open}>
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
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MaterialAdminLayout;
