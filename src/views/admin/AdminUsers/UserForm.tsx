import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UserFormProps, UserFormValues } from "./types";

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  roles,
  isLoading,
  isEditing,
}) => {
  const { t } = useTranslation();

  // Create validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("Invalid email address"))
      .required(t("Email is required")),
    password: isEditing
      ? Yup.string() // Optional during editing
      : Yup.string()
          .min(6, t("Password must be at least 6 characters"))
          .required(t("Password is required")),
    userName: Yup.string(),
    personalNumber: Yup.string(),
    firstname: Yup.string(),
    lastname: Yup.string(),
    birthdate: Yup.date(),
    phoneNumber: Yup.string(),
    address: Yup.string(),
    active: Yup.boolean(),
    roles: Yup.array().of(Yup.string()),
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
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Email")} *
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={t("Email")}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Username")}
              </label>
              <Field
                type="text"
                name="userName"
                id="userName"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.userName && touched.userName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={t("Username")}
              />
              <ErrorMessage
                name="userName"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {!isEditing && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("Password")} *
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder={t("Password")}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="personalNumber"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Personal Number")}
              </label>
              <Field
                type="text"
                name="personalNumber"
                id="personalNumber"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.personalNumber && touched.personalNumber
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={t("Personal Number")}
              />
              <ErrorMessage
                name="personalNumber"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                {t("First Name")}
              </label>
              <Field
                type="text"
                name="firstname"
                id="firstname"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.firstname && touched.firstname
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={t("First Name")}
              />
              <ErrorMessage
                name="firstname"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Last Name")}
              </label>
              <Field
                type="text"
                name="lastname"
                id="lastname"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.lastname && touched.lastname
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={t("Last Name")}
              />
              <ErrorMessage
                name="lastname"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="birthdate"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Birthdate")}
              </label>
              <Field
                type="date"
                name="birthdate"
                id="birthdate"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.birthdate && touched.birthdate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="birthdate"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Phone Number")}
              </label>
              <Field
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.phoneNumber && touched.phoneNumber
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={t("Phone Number")}
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Address")}
              </label>
              <Field
                type="text"
                name="address"
                id="address"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.address && touched.address
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={t("Address")}
              />
              <ErrorMessage
                name="address"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="roles"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Roles")}
              </label>
              <div className="mt-1">
                {roles.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center">
                        <Field
                          type="checkbox"
                          name="roles"
                          value={role.name}
                          id={`role-${role.id}`}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={values.roles.includes(role.name || "")}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            if (e.target.checked) {
                              setFieldValue("roles", [
                                ...values.roles,
                                role.name,
                              ]);
                            } else {
                              setFieldValue(
                                "roles",
                                values.roles.filter((r) => r !== role.name)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`role-${role.id}`}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {role.nameEn} ({role.nameSq})
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    {t("Loading roles...")}
                  </div>
                )}
                <ErrorMessage
                  name="roles"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center mt-2">
            <Field
              type="checkbox"
              name="active"
              id="active"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="active"
              className="ml-2 block text-sm text-gray-900"
            >
              {t("Active")}
            </label>
            <ErrorMessage
              name="active"
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

export default UserForm;
