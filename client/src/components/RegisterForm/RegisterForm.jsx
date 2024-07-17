import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import styles from "./RegisterForm.module.css";

const RegisterForm = () => {
  const [serverError, setServerError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  // Function to handle successful registration
  const handleRegistrationSuccess = () => {
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 2000); // Hide after 2 seconds
  };

  const handleRegisterSubmit = (values, { setSubmitting }) => {
    setServerError("");
    axios
      .post("http://localhost:3000/users/register", values)
      .then((response) => {
        console.log("User registered successfully:", response.data);
        handleRegistrationSuccess();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setServerError(error.response.data.message);
        } else {
          setServerError("There was an error registering!");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className={`w-11/12 max-w-[700px] px-10 py-20 rounded-3xl border-2 border-gray-100 shadow-2xl ${styles.register_container}`}>
      <h1 className="text-5xl font-semibold">Create An Account</h1>
      <p className="font-medium text-lg text-gray-500 mt-4">
        Please enter your details.
      </p>
      <Formik
        initialValues={{ email: "", password: "", role: "" }}
        validationSchema={validationSchema}
        onSubmit={handleRegisterSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="mt-8">
            {serverError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{serverError}</span>
                <span
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setServerError("")}
                >
                  <svg
                    className="fill-current h-6 w-6 text-red-500"
                    role="button"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <title>Close</title>
                    <path d="M14.348 5.652a.5.5 0 00-.707 0L10 9.293 6.36 5.652a.5.5 0 10-.707.707l3.64 3.641-3.64 3.64a.5.5 0 00.707.708l3.641-3.64 3.64 3.64a.5.5 0 00.707-.707l-3.64-3.64 3.64-3.64a.5.5 0 000-.707z" />
                  </svg>
                </span>
              </div>
            )}
            {showSuccessAlert && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">
                  Registration successful!
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <label className="text-lg font-medium" htmlFor="email">
                Email
              </label>
              <Field
                name="email"
                type="email"
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your email"
              />
              {errors.email && touched.email ? (
                <div className="text-red-500 text-sm mt-2">{errors.email}</div>
              ) : null}
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-lg font-medium" htmlFor="password">
                Password
              </label>
              <Field
                name="password"
                type="password"
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your password"
              />
              {errors.password && touched.password ? (
                <div className="text-red-500 text-sm mt-2">
                  {errors.password}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-lg font-medium" htmlFor="role">
                I am a
              </label>
              <Field
                as="select"
                name="role"
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              >
                <option value="">Select role</option>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
              </Field>
              {errors.role && touched.role ? (
                <div className="text-red-500 text-sm mt-2">{errors.role}</div>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col gap-y-4">
              <button
                type="submit"
                className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-violet-500 rounded-lg text-white font-bold text-lg"
                disabled={isSubmitting}
              >
                Sign Up
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-8 flex justify-center items-center">
        <p className="font-medium text-base">Already have an account?</p>
        <Link
          to="/login"
          className="ml-2 font-medium text-base text-violet-500"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
