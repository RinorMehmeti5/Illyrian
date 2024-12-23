// src/views/shared/Header.tsx

import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import {
  UsersIcon,
  BriefcaseIcon,
  CalendarIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

import { useTranslation } from "react-i18next";
import useAuthStore from "../../store/authStore";
import AuthService from "../../services/AuthService";

// Import flag images (You can also import them if stored locally)
const USA_FLAG = "https://flagcdn.com/us.svg"; // Example URL for USA flag
const ALB_FLAG = "https://flagcdn.com/al.svg"; // Example URL for Albania flag

const Header: React.FC = () => {
  const { isAuthenticated, userRoles, username, setToken } = useAuthStore();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    i18n.changeLanguage(language);
  }, [i18n]);

  const navigation = [
    { name: "Home", icon: HomeIcon, to: "/" },
    { name: "Team", icon: UsersIcon, to: "/team" },
    { name: "Projects", icon: BriefcaseIcon, to: "/projects" },
    { name: "Calendar", icon: CalendarIcon, to: "/calendar" },
  ];

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
    <header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full py-7">
      <nav className="relative max-w-7xl w-full flex flex-wrap md:grid md:grid-cols-12 basis-full items-center px-4 md:px-6 md:px-8 mx-auto">
        <div className="md:col-span-3">
          {/* Logo */}
          <Link
            className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
            to="/"
            aria-label="Your Company"
          >
            {/* Replace the SVG with your logo or keep it as needed */}
            <img
              src="/public/photos/LOGOO.png"
              alt="Your Company"
              className="h-20"
            />
          </Link>
          {/* End Logo */}
        </div>

        {/* Button Group */}
        <div className="flex items-center gap-x-1 md:gap-x-2 ms-auto py-1 md:ps-6 md:order-3 md:col-span-3">
          {isAuthenticated ? (
            <>
              {/* Profile Dropdown */}
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none">
                    <UsersIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-2">{username}</span>
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
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-lime-400 text-black hover:bg-lime-500 focus:outline-none focus:bg-lime-500 transition"
              >
                Register
              </Link>
            </>
          )}

          {/* Language Dropdown */}
          <div className="hs-dropdown relative inline-flex">
            <button
              id="hs-dropdown-language"
              type="button"
              className="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              {/* Display the current language flag */}
              <img
                src={i18n.language === "en" ? USA_FLAG : ALB_FLAG}
                alt={i18n.language === "en" ? "English" : "Shqip"}
                className="w-6 h-6 rounded-full"
              />
              {/* Optionally display the language code */}
              {/* <span>{i18n.language.toUpperCase()}</span> */}
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
              className="hs-dropdown-menu transition-opacity duration-150 hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-language"
            >
              <div className="p-1 space-y-1">
                <button
                  onClick={() => changeLanguage("en")}
                  className="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none w-full text-left"
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
                  className="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none w-full text-left"
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
          {/* End Language Dropdown */}

          <div className="md:hidden">
            <button
              type="button"
              className="hs-collapse-toggle size-[38px] flex justify-center items-center text-sm font-semibold rounded-xl border border-gray-200 text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              id="hs-navbar-hcail-collapse"
              aria-expanded={isMobileMenuOpen}
              aria-controls="hs-navbar-hcail"
              aria-label="Toggle navigation"
              data-hs-collapse="#hs-navbar-hcail"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className={`${
                  isMobileMenuOpen ? "hidden" : "block"
                } hs-collapse-open:hidden shrink-0 size-4`}
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
                className={`${
                  isMobileMenuOpen ? "block" : "hidden"
                } hs-collapse-open:block hidden shrink-0 size-4`}
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
        {/* End Button Group */}

        {/* Collapse */}
        <div
          id="hs-navbar-hcail"
          className={`hs-collapse transition-all duration-300 basis-full grow md:block md:w-auto md:basis-auto md:order-2 md:col-span-6 ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
          aria-labelledby="hs-navbar-hcail-collapse"
        >
          <div className="flex flex-col gap-y-4 gap-x-0 mt-5 md:flex-row md:justify-center md:items-center md:gap-y-0 md:gap-x-7 md:mt-0">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  className={`relative inline-block text-white focus:outline-none ${
                    location.pathname === item.to
                      ? "before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400"
                      : "hover:text-gray-600"
                  }`}
                  to={item.to}
                  aria-current={
                    location.pathname === item.to ? "page" : undefined
                  }
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* End Collapse */}
      </nav>
    </header>
  );
};

export default Header;
