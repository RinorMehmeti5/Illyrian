// src/views/shared/Header.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/authStore";
import AuthService from "../../services/AuthService";

const Header: React.FC = () => {
  const { isAuthenticated, setToken } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangDropdown = () => setIsLangDropdownOpen(!isLangDropdownOpen);

  useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    i18n.changeLanguage(language);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [i18n, scrolled]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    setIsLangDropdownOpen(false);
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

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.1,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  // Navigation items for reuse
  const navItems = [
    { name: t("Home"), path: "/" },
    { name: t("Team"), path: "/team" },
    { name: t("Projects"), path: "/projects" },
    { name: t("Calendar"), path: "/calendar" },
  ];

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black text-white shadow-lg py-2"
          : "bg-[#FFFDF2] text-black py-2"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="h-16 flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/photos/LOGOO.png" alt="Logo" className="h-20 mr-3" />
              <span className="text-xl font-bold">Ilyrian Gym</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                custom={index}
                variants={menuItemVariants}
              >
                <Link
                  to={item.path}
                  className={`px-3 py-2 rounded hover:opacity-80 transition border-b-2 ${
                    scrolled
                      ? "border-transparent hover:border-white"
                      : "border-transparent hover:border-black"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {/* Language Selector */}
            <div className="relative">
              <motion.button
                onClick={toggleLangDropdown}
                className="flex items-center px-3 py-2 rounded hover:opacity-80 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1">
                  {i18n.language === "en" ? "EN" : "SQ"}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isLangDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.button>

              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => changeLanguage("en")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        English
                      </button>
                      <button
                        onClick={() => changeLanguage("sq")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Shqip
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <motion.button
                onClick={handleLogout}
                className={`px-4 py-2 ${
                  scrolled ? "bg-white text-black" : "bg-black text-white"
                } hover:opacity-80 rounded transition`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("Logout")}
              </motion.button>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className={`px-4 py-2 ${
                      scrolled ? "bg-white text-black" : "bg-black text-white"
                    } rounded transition`}
                  >
                    {t("Login")}
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className={`px-4 py-2 ${
                      scrolled
                        ? "border border-white text-white"
                        : "border border-black text-black"
                    } rounded transition`}
                  >
                    {t("Register")}
                  </Link>
                </motion.div>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={toggleMenu}
              className="text-current focus:outline-none"
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-2 py-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    variants={menuItemVariants}
                    custom={index}
                  >
                    <Link
                      to={item.path}
                      className={`block px-3 py-2 rounded ${
                        scrolled
                          ? "hover:bg-white hover:text-black"
                          : "hover:bg-black hover:text-white"
                      } transition`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Language Options */}
                <div className="px-3 py-2 space-y-2">
                  <div className="text-sm font-medium">{t("Language")}:</div>
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={() => changeLanguage("en")}
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      English
                    </motion.button>
                    <motion.button
                      onClick={() => changeLanguage("sq")}
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Shqip
                    </motion.button>
                  </div>
                </div>

                {/* Auth Buttons */}
                <div className="pt-2">
                  {isAuthenticated ? (
                    <motion.button
                      onClick={handleLogout}
                      className={`w-full px-4 py-2 ${
                        scrolled ? "bg-white text-black" : "bg-black text-white"
                      } rounded transition`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {t("Logout")}
                    </motion.button>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/login"
                        className={`px-4 py-2 ${
                          scrolled
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        } rounded text-center transition`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("Login")}
                      </Link>
                      <Link
                        to="/register"
                        className={`px-4 py-2 ${
                          scrolled
                            ? "border border-white text-white"
                            : "border border-black text-black"
                        } rounded text-center transition`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("Register")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
