// admin/AdminMembership/MembershipForm.tsx

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MembershipFormProps, MembershipFormValues } from "./types";

const MembershipForm: React.FC<MembershipFormProps> = ({
  initialValues,
  onSubmit,
  membershipTypes,
  isLoading,
  isEditing,
}) => {
  const { t } = useTranslation();

  // Create validation schema using Yup
  const validationSchema = Yup.object({
    userId: Yup.string().required(t("User ID is required")),
    membershipTypeId: Yup.number().required(t("Membership type is required")),
    startDate: Yup.date().required(t("Start date is required")),
    endDate: Yup.date()
      .required(t("End date is required"))
      .min(Yup.ref("startDate"), t("End date cannot be before start date")),
    isActive: Yup.boolean(),
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
      {({ values, errors, touched, setFieldValue, isSubmitting }) => {
        // Effect to calculate end date based on membership type and start date
        useEffect(() => {
          if (!isEditing && values.startDate && values.membershipTypeId) {
            const selectedType = membershipTypes.find(
              (t) => t.membershipTypeID === values.membershipTypeId
            );
            if (selectedType) {
              const start = new Date(values.startDate);
              const end = new Date(start);
              end.setDate(
                start.getDate() + (selectedType.durationInDays || 30)
              );
              setFieldValue("endDate", end.toISOString().split("T")[0], false);
            }
          }
        }, [
          values.startDate,
          values.membershipTypeId,
          isEditing,
          setFieldValue,
        ]);

        return (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700"
              >
                {t("User ID")}
              </label>
              <Field
                type="text"
                name="userId"
                id="userId"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.userId && touched.userId
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={t("User ID")}
              />
              <ErrorMessage
                name="userId"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="membershipTypeId"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Membership Type")}
              </label>
              <Field
                as="select"
                name="membershipTypeId"
                id="membershipTypeId"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.membershipTypeId && touched.membershipTypeId
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                {membershipTypes.length > 0 ? (
                  membershipTypes.map((type) => (
                    <option
                      key={type.membershipTypeID}
                      value={type.membershipTypeID}
                    >
                      {type.name} ({type.formattedDuration} -{" "}
                      {type.formattedPrice})
                    </option>
                  ))
                ) : (
                  <option value="">{t("Loading membership types...")}</option>
                )}
              </Field>
              <ErrorMessage
                name="membershipTypeId"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Start Date")}
              </label>
              <Field
                type="date"
                name="startDate"
                id="startDate"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.startDate && touched.startDate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="startDate"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                {t("End Date")}
              </label>
              <Field
                type="date"
                name="endDate"
                id="endDate"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.endDate && touched.endDate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="endDate"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="flex items-center">
              <Field
                type="checkbox"
                name="isActive"
                id="isActive"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-900"
              >
                {t("Active")}
              </label>
              <ErrorMessage
                name="isActive"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  // Close form logic here
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  isLoading || isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : ""
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
        );
      }}
    </Formik>
  );
};

export default MembershipForm;
