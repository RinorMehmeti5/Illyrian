// src/views/shared/Register.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  // Validation schema
  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("Invalid email format"))
      .required(t("Email is required")),
    password: Yup.string()
      .min(8, t("Password must be at least 8 characters"))
      .required(t("Password is required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("Passwords must match"))
      .required(t("Confirm password is required")),
    firstName: Yup.string(),
    lastName: Yup.string(),
    personalNumber: Yup.string(),
    phoneNumber: Yup.string(),
    address: Yup.string(),
  });

  const handleSubmit = async (values: any) => {
    setIsLoading(true);

    try {
      await axios.post("https://localhost:7102/api/auth/register", {
        email: values.email,
        password: values.password,
        firstname: values.firstName,
        lastname: values.lastName,
        personalNumber: values.personalNumber,
        phoneNumber: values.phoneNumber,
        address: values.address,
        birthdate: new Date(),
      });

      toast.success(t("Registration successful! You can now log in."));
      navigate("/login", { state: { fromRegister: true } });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t("Registration failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
        {/* Left side image - hidden on mobile, visible on md breakpoint and up */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden md:block flex-1 bg-black relative overflow-hidden m-10 rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/70 to-transparent z-10"></div>
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: "url('/photos/gym3.jpeg')",
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white p-8 max-w-md">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-4xl font-bold mb-4"
              >
                {t("Join Our Fitness Community")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-xl"
              >
                {t(
                  "Start your fitness journey today with personalized training programs"
                )}
              </motion.p>
            </div>
          </div>
        </motion.div>
        {/* Right side form */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex-1 flex items-center justify-center p-8 bg-white md:h-screen relative"
        >
          <div className="w-full max-w-lg relative z-10">
            <motion.div variants={itemVariants} className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("Create Your Account")}
              </h1>
              <p className="text-gray-600">
                {t("Join us to start your fitness journey")}
              </p>
            </motion.div>

            <Formik
              initialValues={{
                email: "",
                password: "",
                confirmPassword: "",
                firstName: "",
                lastName: "",
                personalNumber: "",
                phoneNumber: "",
                address: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">
                      {t("Account Information")}
                    </h2>

                    {/* Email Field */}
                    <motion.div variants={itemVariants} className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("Email address")} *
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.email && touched.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                        placeholder={t("Enter your email")}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </motion.div>

                    {/* Password Field */}
                    <motion.div variants={itemVariants} className="mb-4">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("Password")} *
                      </label>
                      <div className="relative">
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            errors.password && touched.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                          placeholder={t("Create a password")}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                clipRule="evenodd"
                              />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {t("Password must be at least 8 characters")}
                      </p>
                    </motion.div>

                    {/* Confirm Password Field */}
                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("Confirm Password")} *
                      </label>
                      <div className="relative">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            errors.confirmPassword && touched.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                          placeholder={t("Confirm your password")}
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                clipRule="evenodd"
                              />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </motion.div>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">
                      {t("Personal Information")}
                    </h2>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <motion.div variants={itemVariants}>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("First name")}
                        </label>
                        <Field
                          id="firstName"
                          name="firstName"
                          type="text"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder={t("Enter your first name")}
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("Last name")}
                        </label>
                        <Field
                          id="lastName"
                          name="lastName"
                          type="text"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder={t("Enter your last name")}
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </motion.div>
                    </div>

                    {/* Personal Number & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <motion.div variants={itemVariants}>
                        <label
                          htmlFor="personalNumber"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("Personal number")}
                        </label>
                        <Field
                          id="personalNumber"
                          name="personalNumber"
                          type="text"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder={t("Enter your personal number")}
                        />
                        <ErrorMessage
                          name="personalNumber"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("Phone number")}
                        </label>
                        <Field
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder={t("Enter your phone number")}
                        />
                        <ErrorMessage
                          name="phoneNumber"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </motion.div>
                    </div>

                    {/* Address */}
                    <motion.div variants={itemVariants} className="mb-4">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("Address")}
                      </label>
                      <Field
                        id="address"
                        name="address"
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder={t("Enter your address")}
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200"
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        t("Create account")
                      )}
                    </button>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="mt-6 text-center"
                  >
                    <p className="text-sm text-gray-600">
                      {t("Already have an account?")}{" "}
                      <Link
                        to="/login"
                        className="font-medium text-black hover:text-gray-800"
                      >
                        {t("Sign in")}
                      </Link>
                    </p>
                  </motion.div>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;
