// src/views/shared/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("About Us")}</h3>
            <p className="text-gray-400">
              {t(
                "Our gym management system helps you track memberships, schedule classes, and manage your fitness business efficiently."
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("Quick Links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("Home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("Team")}
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("Projects")}
                </Link>
              </li>
              <li>
                <Link
                  to="/calendar"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("Calendar")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("Contact")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>123 Main Street, City, Country</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>info@example.com</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+1 234 567 890</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("Newsletter")}</h3>
            <p className="text-gray-400 mb-4">
              {t("Subscribe to our newsletter for updates.")}
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder={t("Your Email")}
                className="px-4 py-2 w-full rounded-l outline-none text-gray-900"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-r transition"
              >
                {t("Subscribe")}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            © {currentYear} Gym Management System. {t("All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
