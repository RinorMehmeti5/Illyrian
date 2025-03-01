// src/views/shared/Header.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../store/authStore";
import AuthService from "../../services/AuthService";

// Flag image URLs
const USA_FLAG = "https://flagcdn.com/us.svg";
const ALB_FLAG = "https://flagcdn.com/al.svg";

const Header: React.FC = () => {
  const { isAuthenticated, setToken } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangDropdown = () => setIsLangDropdownOpen(!isLangDropdownOpen);

  useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    i18n.changeLanguage(language);
  }, [i18n]);

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

  return (
    <header className="bg-gradient-to-r from-primary-700 to-primary-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/photos/LOGOO.png" alt="Logo" className="h-10 mr-3" />
              <span className="text-xl font-bold">Gym Management</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
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
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded hover:bg-primary-600 transition"
            >
              {t("Home")}
            </Link>
            <Link
              to="/team"
              className="px-3 py-2 rounded hover:bg-primary-600 transition"
            >
              {t("Team")}
            </Link>
            <Link
              to="/projects"
              className="px-3 py-2 rounded hover:bg-primary-600 transition"
            >
              {t("Projects")}
            </Link>
            <Link
              to="/calendar"
              className="px-3 py-2 rounded hover:bg-primary-600 transition"
            >
              {t("Calendar")}
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLangDropdown}
                className="flex items-center px-3 py-2 rounded hover:bg-primary-600 transition"
              >
                <img
                  src={i18n.language === "en" ? USA_FLAG : ALB_FLAG}
                  alt={i18n.language === "en" ? "English" : "Shqip"}
                  className="w-5 h-5 mr-2"
                />
                <svg
                  className="h-4 w-4 ml-1"
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
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => changeLanguage("en")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <img
                        src={USA_FLAG}
                        alt="English"
                        className="w-4 h-4 mr-2"
                      />
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage("sq")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <img
                        src={ALB_FLAG}
                        alt="Shqip"
                        className="w-4 h-4 mr-2"
                      />
                      Shqip
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                {t("Logout")}
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition"
                >
                  {t("Login")}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition"
                >
                  {t("Register")}
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-600">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-3 py-2 rounded hover:bg-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("Home")}
              </Link>
              <Link
                to="/team"
                className="px-3 py-2 rounded hover:bg-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("Team")}
              </Link>
              <Link
                to="/projects"
                className="px-3 py-2 rounded hover:bg-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("Projects")}
              </Link>
              <Link
                to="/calendar"
                className="px-3 py-2 rounded hover:bg-primary-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("Calendar")}
              </Link>

              {/* Language Options */}
              <div className="px-3 py-2 space-y-2">
                <div className="text-sm font-medium">{t("Language")}:</div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => changeLanguage("en")}
                    className="flex items-center"
                  >
                    <img
                      src={USA_FLAG}
                      alt="English"
                      className="w-5 h-5 mr-2"
                    />
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("sq")}
                    className="flex items-center"
                  >
                    <img src={ALB_FLAG} alt="Shqip" className="w-5 h-5 mr-2" />
                    Shqip
                  </button>
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="pt-2 border-t border-primary-600">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                  >
                    {t("Logout")}
                  </button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/login"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded text-center transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("Login")}
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded text-center transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("Register")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
