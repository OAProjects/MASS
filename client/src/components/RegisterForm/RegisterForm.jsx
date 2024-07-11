import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import styles from "./RegisterForm.module.css";

const RegisterForm = () => {
  const [serverError, setServerError] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    role: Yup.string()
      .required('Role is required')
  });

  // Function to handle successful registration
  const handleRegistrationSuccess = () => {
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 2000); // Hide after 2 seconds
  };

  return (
    <div className={styles.formContainer}>
      <h1>Sign up</h1>
      <Formik
        initialValues={{ email: '', password: '', role: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setServerError('');
          axios.post('http://localhost:3000/users/register', values)
            .then(response => {
              console.log('User registered successfully:', response.data);
              handleRegistrationSuccess();
              resetForm();
            })
            .catch(error => {
              if (error.response && error.response.data) {
                setServerError(error.response.data.message);
              } else {
                setServerError('There was an error registering the user!');
              }
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ errors, touched }) => (
          <Form className={styles.form}>
            {serverError && (
              <div className={styles.errorPopup}>
                <p>{serverError}</p>
                <button onClick={() => setServerError('')}>Close</button>
              </div>
            )}
            {showSuccessAlert && (
              <div className={styles.successPopup}>
                <p>Registration successful!</p>
              </div>
            )}
            <div className={styles.fieldContainer}>
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" className={styles.field} />
              {errors.email && touched.email ? (
                <div className={styles.error}>{errors.email}</div>
              ) : null}
            </div>

            <div className={styles.fieldContainer}>
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className={styles.field} />
              {errors.password && touched.password ? (
                <div className={styles.error}>{errors.password}</div>
              ) : null}
            </div>

            <div className={styles.fieldContainer}>
              <label htmlFor="role">I am a</label>
              <Field as="select" name="role" className={styles.field}>
                <option value="">Select role</option>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
              </Field>
              {errors.role && touched.role ? (
                <div className={styles.error}>{errors.role}</div>
              ) : null}
            </div>

            <button type="submit" className={styles.submitButton}>Sign Up</button>
          </Form>
        )}
      </Formik>
      <p className={styles.loginLink}>
        Already have an account? <Link to="/login" className={styles.loginLinkText}>Log in</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
