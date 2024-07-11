import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  return isAuthenticated ? <Element /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
