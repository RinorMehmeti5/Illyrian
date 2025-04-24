// admin/AdminSchedule/ScheduleForm.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ScheduleFormProps, ScheduleFormValues } from "./types";

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  isEditing,
}) => {
  const { t } = useTranslation();

  // Create validation schema using Yup
  const validationSchema = Yup.object({
    startTime: Yup.string().required(t("Start time is required")),
    endTime: Yup.string()
      .required(t("End time is required"))
      .test(
        "is-after-start",
        t("End time must be after start time"),
        function (value) {
          const { startTime } = this.parent;
          if (!startTime || !value) return true;
          return startTime < value;
        }
      ),
    dayOfWeek: Yup.string().required(t("Day of week is required")),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await onSubmit(values);
        setSubmitting(false);
      }}
      enableReinitialize={true}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label
              htmlFor="dayOfWeek"
              className="block text-sm font-medium text-gray-700"
            >
              {t("Day of Week")}
            </label>
            <Field
              as="select"
              name="dayOfWeek"
              id="dayOfWeek"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.dayOfWeek && touched.dayOfWeek
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">{t("Select a day")}</option>
              <option value="Monday">{t("Monday")}</option>
              <option value="Tuesday">{t("Tuesday")}</option>
              <option value="Wednesday">{t("Wednesday")}</option>
              <option value="Thursday">{t("Thursday")}</option>
              <option value="Friday">{t("Friday")}</option>
              <option value="Saturday">{t("Saturday")}</option>
              <option value="Sunday">{t("Sunday")}</option>
            </Field>
            <ErrorMessage
              name="dayOfWeek"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700"
            >
              {t("Start Time")}
            </label>
            <Field
              type="time"
              name="startTime"
              id="startTime"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.startTime && touched.startTime
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            <ErrorMessage
              name="startTime"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700"
            >
              {t("End Time")}
            </label>
            <Field
              type="time"
              name="endTime"
              id="endTime"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.endTime && touched.endTime
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            <ErrorMessage
              name="endTime"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                isLoading || isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading || isSubmitting
                ? t("Saving...")
                : isEditing
                ? t("Update")
                : t("Create")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ScheduleForm;
