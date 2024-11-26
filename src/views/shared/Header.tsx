// src/views/shared/Header.tsx
import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  UserIcon,
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  CalendarIcon,
  CogIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import { useTranslation } from "react-i18next";
import useAuthStore from "../../store/authStore";
import AuthService from "../../services/AuthService";

// Import flag images (You can also import them if stored locally)
const USA_FLAG = "https://flagcdn.com/us.svg"; // Example URL for USA flag
const ALB_FLAG = "https://flagcdn.com/al.svg"; // Example URL for Albania flag

const Header: React.FC = () => {
  const {
    isAuthenticated,
    userRoles,
    setAuthenticated,
    setUserRoles,
    setToken,
  } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    i18n.changeLanguage(language);
  }, [i18n]);

  const isAdmin = userRoles.some(
    (role) => role.toLowerCase() === "administrator"
  );

  const navigation = [
    { name: "Home", icon: HomeIcon, to: "/" },
    { name: "Team", icon: UsersIcon, to: "/team" },
    { name: "Projects", icon: BriefcaseIcon, to: "/projects" },
    { name: "Calendar", icon: CalendarIcon, to: "/calendar" },
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
      await AuthService.logout();
      localStorage.removeItem("token");
      setToken(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="sticky top-4 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full before:absolute before:inset-0 before:max-w-[66rem] before:mx-2 before:lg:mx-auto before:rounded-[26px] before:bg-black before:backdrop-blur-md">
      <nav className="relative max-w-[66rem] w-full py-1 ps-5 pe-2 md:flex md:items-center md:justify-between md:py-0 mx-2 lg:mx-auto">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link
            to="/"
            className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
            aria-label="Preline"
          >
            {/* Replace the SVG with your logo or keep it as needed */}
            <img
              src="/public/photos/LOGOO.png"
              alt="Your Company"
              className="h-12"
            />
          </Link>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="hs-collapse-toggle size-8 flex justify-center items-center text-sm font-semibold rounded-full bg-neutral-800 text-white disabled:opacity-50 disabled:pointer-events-none"
              id="hs-navbar-floating-dark-collapse"
              aria-expanded="false"
              aria-controls="hs-navbar-floating-dark"
              aria-label="Toggle navigation"
              data-hs-collapse="#hs-navbar-floating-dark"
            >
              <svg
                className="hs-collapse-open:hidden shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg
                className="hs-collapse-open:block hidden shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Collapse */}
        <div
          id="hs-navbar-floating-dark"
          className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block"
          aria-labelledby="hs-navbar-floating-dark-collapse"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-end py-2 md:py-0 md:ps-7 space-y-2 md:space-y-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`py-2 ps-px sm:px-3   md:py-2 text-sm text-white hover:text-neutral-300 focus:outline-none focus:text-neutral-300 rounded-full ${
                  location.pathname === item.to ? "bg-gray-700" : ""
                }`}
                aria-current={
                  location.pathname === item.to ? "page" : undefined
                }
              >
                {/* <item.icon className="h-5 w-5 mr-1" aria-hidden="true" /> */}
                {item.name}
              </Link>
            ))}

            {/* Language Dropdown */}
            {/* Updated Language Dropdown */}
            <div className="hs-dropdown relative inline-flex">
              <button
                id="hs-dropdown-language"
                type="button"
                className="hs-dropdown-toggle py-1 ps-1 pe-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Language Dropdown"
              >
                {/* Display the current language flag */}
                <img
                  src={i18n.language === "en" ? USA_FLAG : ALB_FLAG}
                  alt={i18n.language === "en" ? "English" : "Shqip"}
                  className="w-6 h-6 rounded-full"
                />
                {/* Optionally display the language code */}
                {/* <span className="sr-only">Select Language</span> */}
                <svg
                  className="hs-dropdown-open:rotate-180 size-4 transition-transform duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                className="hs-dropdown-menu transition-opacity duration-150 hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="hs-dropdown-language"
              >
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => changeLanguage("en")}
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 w-full text-left"
                  >
                    <img
                      src={USA_FLAG}
                      alt="English"
                      className="w-5 h-5 rounded-full"
                    />
                    English (EN)
                  </button>
                  <button
                    onClick={() => changeLanguage("sq")}
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 w-full text-left"
                  >
                    <img
                      src={ALB_FLAG}
                      alt="Shqip"
                      className="w-5 h-5 rounded-full"
                    />
                    Shqip (SQ)
                  </button>
                </div>
              </div>
            </div>
            {/* End Updated Language Dropdown */}

            {/* User Controls */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  {/* Notifications Button */}
                  <button
                    className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                    aria-label="Notifications"
                  >
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  {/* Profile Dropdown */}
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <UserIcon
                          className="h-6 w-6 text-gray-400 hover:text-white"
                          aria-hidden="true"
                        />
                        <span className="ml-2 text-white">{username}</span>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {/* Username Display */}
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={`block px-4 py-2 text-sm text-gray-700 ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              Signed in as <strong>{username}</strong>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              Sign Out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-full text-sm font-medium text-white bg-amber-500	hover:bg-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="ml-2 px-3 py-2 rounded-full text-sm font-medium text-white bg-amber-500 hover:bg-gray-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        {/* End Collapse */}
      </nav>
    </header>
  );
};

export default Header;
