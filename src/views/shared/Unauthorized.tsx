import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Unauthorized: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">
          {t("Unauthorized Access")}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t("You don't have permission to access this page.")}
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition"
        >
          {t("Go back to home")}
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
