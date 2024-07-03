import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setServerError('');
    axios
      .post('http://localhost:3000/users/login', values)
      .then((response) => {
        console.log('User logged in successfully:', response.data);
        // Show success message
        setLoginSuccess(true);
        setTimeout(() => {
          if (response.data.role.toLowerCase() === 'doctor') {
            // Redirect to doctor profile page
            console.log('Redirecting to doctor profile');
            navigate('/doctor');
          } else if (response.data.role.toLowerCase() === 'patient') {
            // Redirect to patient profile page
            console.log('Redirecting to patient profile');
            navigate('/patient');
          } else {
            // Default redirect or handle other roles as needed
            console.log('Role not recognized, redirecting to default page');
            navigate('/');
          }
        }, 1500); // Redirect after 1.5 seconds
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setServerError(error.response.data.message);
        } else {
          setServerError('There was an error logging in!');
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className={styles.formContainer}>
      <h1>Log in</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className={styles.form}>
            {serverError && (
              <div className={styles.errorPopup}>
                <p>{serverError}</p>
                <button onClick={() => setServerError('')}>Close</button>
              </div>
            )}
            {loginSuccess && (
              <div className={styles.successPopup}>
                <p>Login successful! Redirecting...</p>
              </div>
            )}
            <div className={styles.fieldContainer}>
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" className={styles.field} />
              {errors.email && touched.email && <div className={styles.error}>{errors.email}</div>}
            </div>

            <div className={styles.fieldContainer}>
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className={styles.field} />
              {errors.password && touched.password && (
                <div className={styles.error}>{errors.password}</div>
              )}
            </div>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              Log In
            </button>
          </Form>
        )}
      </Formik>
      <p className={styles.loginLink}>
        Don't have an account? <Link to="/register" className={styles.loginLinkText}>Sign up</Link>
      </p>
    </div>
  );
};

export default LoginForm;
