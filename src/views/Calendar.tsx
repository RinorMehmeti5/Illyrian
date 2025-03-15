import React from "react";
import { useTranslation } from "react-i18next";

const Calendar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {t("Calendar")}
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            {t("Check out our schedule and upcoming events.")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
