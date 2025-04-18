// src/views/admin/AdminUsers/ResetPasswordModal.tsx
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { ResetPasswordModalProps, ResetPasswordFormValues } from "./types";

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  userId,
  username,
  onSubmit,
  isLoading,
}) => {
  const { t } = useTranslation();

  const initialValues: ResetPasswordFormValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, t("Password must be at least 6 characters"))
      .required(t("Password is required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], t("Passwords must match"))
      .required(t("Confirm password is required")),
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  {t("Reset Password for {{username}}", { username })}
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Dialog.Title>

                <div className="mt-4">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                      await onSubmit(values);
                      setSubmitting(false);
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <div>
                          <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t("New Password")}
                          </label>
                          <Field
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                          <ErrorMessage
                            name="newPassword"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t("Confirm Password")}
                          </label>
                          <Field
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          >
                            {t("Cancel")}
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                              isSubmitting || isLoading
                                ? "opacity-70 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {isSubmitting || isLoading
                              ? t("Saving...")
                              : t("Reset Password")}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ResetPasswordModal;
