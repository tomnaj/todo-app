import { Navigate, Outlet } from 'react-router-dom';
import authService from '@/services/auth.service';

const PrivateRoute = () => {
  const isAuthenticated = authService.isLoggedIn();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;