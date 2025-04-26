import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ExerciseFormProps, ExerciseFormValues } from "./types";

const difficultyOptions = [
  { value: "", label: "Select difficulty" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  isEditing,
}) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    exerciseName: Yup.string().required(t("Exercise name is required")),
    muscleGroup: Yup.string().nullable(),
    difficultyLevel: Yup.string().nullable(),
    description: Yup.string().nullable(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit(values);
        setSubmitting(false);
      }}
      enableReinitialize={true}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-4">
          {/* Exercise Name */}
          <div>
            <label
              htmlFor="exerciseName"
              className="block text-sm font-medium text-gray-700"
            >
              {t("Exercise Name")}
            </label>
            <Field
              type="text"
              name="exerciseName"
              id="exerciseName"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.exerciseName && touched.exerciseName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder={t("Exercise Name")}
            />
            <ErrorMessage
              name="exerciseName"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {/* Muscle Group */}
          <div>
            <label
              htmlFor="muscleGroup"
              className="block text-sm font-medium text-gray-700"
            >
              {t("Muscle Group")}
            </label>
            <Field
              type="text"
              name="muscleGroup"
              id="muscleGroup"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.muscleGroup && touched.muscleGroup
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder={t("Muscle Group")}
            />
            <ErrorMessage
              name="muscleGroup"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label
              htmlFor="difficultyLevel"
              className="block text-sm font-medium text-gray-700"
            >
              {t("Difficulty Level")}
            </label>
            <Field
              as="select"
              name="difficultyLevel"
              id="difficultyLevel"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.difficultyLevel && touched.difficultyLevel
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              {difficultyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="difficultyLevel"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              {t("Description")}
            </label>
            <Field
              as="textarea"
              name="description"
              id="description"
              rows={3}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.description && touched.description
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder={t("Description")}
            />
            <ErrorMessage
              name="description"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {/* Actions */}
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

export default ExerciseForm;
