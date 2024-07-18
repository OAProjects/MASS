import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import AuthService from "../../services/auth";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setServerError("");
    axios
      .post("http://localhost:3000/users/login", values)
      .then((response) => {
        console.log("User logged in successfully:", response.data);
        AuthService.setToken(response.data.token);
        AuthService.setUser({
          email: response.data.email,
          role: response.data.role,
        });
        setLoginSuccess(true);
        setTimeout(() => {
          navigate("/profile");
        }, 1500); // Redirect after 1.5 seconds
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setServerError(error.response.data.message);
        } else {
          setServerError("There was an error logging in!");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div
      className={`w-11/12 max-w-[700px] px-10 py-20 rounded-3xl border-2 border-gray-100 shadow-2xl ${styles.main_container}`}
    >
      <h1 className="text-5xl font-semibold">Welcome Back</h1>
      <p className="font-medium text-lg text-gray-500 mt-4">
        Hello! Please enter your details.
      </p>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
            {loginSuccess && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">
                  Login successful! Redirecting...
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
                className="w-full border-2 border-gray-100 rounded-lg p-3 mt-1 bg-transparent"
                placeholder="Enter your email"
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm mt-2">{errors.email}</div>
              )}
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-lg font-medium" htmlFor="password">
                Password
              </label>
              <Field
                name="password"
                type="password"
                className="w-full border-2 border-gray-100 rounded-lg p-4 mt-1 bg-transparent"
                placeholder="Enter your password"
              />
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.password}
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button className="font-medium text-base text-violet-500 hover:underline">
                Forgot password
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-y-4">
              <button
                type="submit"
                className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-violet-500 rounded-lg text-white font-bold text-lg"
                disabled={isSubmitting}
              >
                Log In
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-8 flex justify-center items-center">
        <p className="font-medium text-base">Don&apos;t have an account?</p>
        <Link
          to="/"
          className="ml-2 font-medium text-base text-violet-500 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
