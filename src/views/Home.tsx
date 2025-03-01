import React from "react";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {t("Welcome to our Gym Management System")}
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            {t(
              "Streamline your fitness business operations with our comprehensive management solution."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
