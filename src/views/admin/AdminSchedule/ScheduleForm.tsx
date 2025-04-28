// admin/AdminSchedule/ScheduleForm.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ScheduleFormProps, ScheduleFormValues } from "./types";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  CalendarMonth as CalendarMonthIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  isEditing,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

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

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        // Ensure time values are properly formatted as HH:MM
        const formattedValues = {
          ...values,
          startTime: values.startTime, // Already in HH:MM format from the time input
          endTime: values.endTime, // Already in HH:MM format from the time input
        };

        await onSubmit(formattedValues);
        setSubmitting(false);
      }}
      enableReinitialize={true}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
      }) => (
        <Form>
          <Box
            component={motion.div}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            sx={{ width: "100%" }}
          >
            {/* Title */}
            <Typography
              variant="h6"
              component={motion.h6}
              variants={itemVariants}
              sx={{
                mb: 3,
                color: theme.palette.mode === "dark" ? "white" : "text.primary",
                fontWeight: 600,
              }}
            >
              {isEditing
                ? t("Update Schedule Details")
                : t("New Schedule Details")}
            </Typography>

            {/* Day of Week Select */}
            <Box component={motion.div} variants={itemVariants} sx={{ mb: 3 }}>
              <FormControl
                fullWidth
                error={!!(errors.dayOfWeek && touched.dayOfWeek)}
                variant="outlined"
                sx={{
                  ".MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: "1px",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? `0 0 0 2px ${theme.palette.primary.dark}30`
                          : `0 0 0 2px ${theme.palette.primary.main}30`,
                    },
                  },
                }}
              >
                <InputLabel
                  htmlFor="dayOfWeek"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <CalendarMonthIcon fontSize="small" />
                  {t("Day of Week")}
                </InputLabel>
                <Select
                  id="dayOfWeek"
                  name="dayOfWeek"
                  value={values.dayOfWeek}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label={t("Day of Week")}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: "8px",
                        mt: 1,
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)"
                            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>{t("Select a day")}</em>
                  </MenuItem>
                  <MenuItem value="Monday">{t("Monday")}</MenuItem>
                  <MenuItem value="Tuesday">{t("Tuesday")}</MenuItem>
                  <MenuItem value="Wednesday">{t("Wednesday")}</MenuItem>
                  <MenuItem value="Thursday">{t("Thursday")}</MenuItem>
                  <MenuItem value="Friday">{t("Friday")}</MenuItem>
                  <MenuItem value="Saturday">{t("Saturday")}</MenuItem>
                  <MenuItem value="Sunday">{t("Sunday")}</MenuItem>
                </Select>
                {errors.dayOfWeek && touched.dayOfWeek && (
                  <FormHelperText error>{errors.dayOfWeek}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Time inputs row */}
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 4,
              }}
            >
              {/* Start Time */}
              <FormControl
                fullWidth
                error={!!(errors.startTime && touched.startTime)}
                variant="outlined"
                sx={{
                  ".MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: "1px",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? `0 0 0 2px ${theme.palette.primary.dark}30`
                          : `0 0 0 2px ${theme.palette.primary.main}30`,
                    },
                  },
                }}
              >
                <InputLabel
                  htmlFor="startTime"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <AccessTimeIcon fontSize="small" />
                  {t("Start Time")}
                </InputLabel>
                <TextField
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={values.startTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label={t("Start Time")}
                  InputProps={{
                    startAdornment: (
                      <AccessTimeIcon
                        fontSize="small"
                        color="action"
                        sx={{ mr: 1, opacity: 0.7 }}
                      />
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {errors.startTime && touched.startTime && (
                  <FormHelperText error>{errors.startTime}</FormHelperText>
                )}
              </FormControl>

              {/* End Time */}
              <FormControl
                fullWidth
                error={!!(errors.endTime && touched.endTime)}
                variant="outlined"
                sx={{
                  ".MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: "1px",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? `0 0 0 2px ${theme.palette.primary.dark}30`
                          : `0 0 0 2px ${theme.palette.primary.main}30`,
                    },
                  },
                }}
              >
                <InputLabel
                  htmlFor="endTime"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <AccessTimeIcon fontSize="small" />
                  {t("End Time")}
                </InputLabel>
                <TextField
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={values.endTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label={t("End Time")}
                  InputProps={{
                    startAdornment: (
                      <AccessTimeIcon
                        fontSize="small"
                        color="action"
                        sx={{ mr: 1, opacity: 0.7 }}
                      />
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {errors.endTime && touched.endTime && (
                  <FormHelperText error>{errors.endTime}</FormHelperText>
                )}
              </FormControl>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Form Actions */}
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                type="button"
                onClick={onCancel}
                variant="outlined"
                color="inherit"
                startIcon={<CancelIcon />}
                disabled={isLoading || isSubmitting}
                sx={{
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.15)",
                  color: theme.palette.text.primary,
                  "&:hover": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(0,0,0,0.3)",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)",
                  },
                  transition: "all 0.2s",
                }}
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={
                  isLoading || isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={isLoading || isSubmitting}
                sx={{
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 4px 12px rgba(99, 102, 241, 0.3)"
                      : "0 4px 12px rgba(79, 70, 229, 0.2)",
                  "&:hover": {
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 6px 16px rgba(99, 102, 241, 0.4)"
                        : "0 6px 16px rgba(79, 70, 229, 0.3)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  transition: "all 0.2s",
                }}
              >
                {isLoading || isSubmitting
                  ? t("Saving...")
                  : isEditing
                  ? t("Update Schedule")
                  : t("Create Schedule")}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ScheduleForm;
