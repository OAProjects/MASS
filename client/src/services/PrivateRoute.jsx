import { Navigate } from "react-router-dom";
import AuthService from "../services/auth";

const PrivateRoute = ({ children }) => {
  if (!AuthService.isAuthenticated()) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the children components
  return children;
};

export default PrivateRoute;
