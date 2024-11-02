// Header.tsx
import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Button } from "primereact/button";

interface HeaderProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userRoles: string[];
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  setIsAuthenticated,
  userRoles,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const menu = React.useRef<Menu>(null);

  const isAdmin = userRoles.some(
    (role) => role.toLowerCase() === "administrator"
  );

  const navigation = [
    { label: "Home", icon: "pi pi-home", to: "/" },
    { label: "Team", icon: "pi pi-users", to: "/team" },
    { label: "Projects", icon: "pi pi-briefcase", to: "/projects" },
    { label: "Calendar", icon: "pi pi-calendar", to: "/calendar" },
    ...(isAuthenticated && isAdmin
      ? [
          { label: "Test", icon: "pi pi-cog", to: "/test" },
          { label: "AdminPanel", icon: "pi pi-shield", to: "/adminpanel" },
        ]
      : []),
  ];

  const profileItems = [
    {
      label: username,
      icon: "pi pi-user",
      command: () => {},
    },
    {
      label: "Sign Out",
      icon: "pi pi-sign-out",
      command: () => handleLogout(),
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsername();
    } else {
      setUsername("");
    }
  }, [isAuthenticated]);

  const fetchUsername = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7102/api/auth/username",
        { withCredentials: true }
      );
      setUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("https://localhost:7102/api/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("userid");
      localStorage.removeItem("role");
      localStorage.removeItem("userlanguage");
      delete axios.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
      setUsername("");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const start = (
    <Link to="/">
      <img
        src="/public/photos/logo.jpg"
        alt="Your Company"
        className="h-12 w-auto"
      />
    </Link>
  );

  const end = isAuthenticated ? (
    <>
      <Button
        icon="pi pi-bell"
        className="p-button-text p-button-rounded mr-2"
        aria-label="Notifications"
      />
      <Button
        label={username}
        icon="pi pi-user"
        className="p-button-text p-button-rounded"
        onClick={(e) => menu.current?.toggle(e)}
        aria-controls="profile_menu"
        aria-haspopup
      />
      <Menu model={profileItems} popup ref={menu} id="profile_menu" />
    </>
  ) : (
    <>
      <Link to="/login" className="p-button p-component p-button-text mr-2">
        Login
      </Link>
      <Link to="/register" className="p-button p-component p-button-text">
        Register
      </Link>
    </>
  );

  const onMenuItemClick = (item: any) => {
    // Handle menu item clicks if necessary
  };

  return (
    <Menubar
      model={navigation.map((item) => ({
        label: item.label,
        icon: item.icon,
        command: () => navigate(item.to),
      }))}
      start={start}
      end={end}
      className="bg-black text-white"
    />
  );
};

export default Header;
