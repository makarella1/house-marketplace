import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus';

import Spinner from '../UI/Spinner/Spinner';

const ProtectedRoute = () => {
  const [isLoggedIn, isLoading] = useAuthStatus();

  if (isLoading) {
    return <Spinner />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
