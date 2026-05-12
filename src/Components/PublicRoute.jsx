import { Navigate, Outlet } from 'react-router-dom';

/**
 * PublicRoute
 * If authToken already exists → user is logged in, send them to dashboard.
 * If no token → render the public page (signup / login) normally.
 */
const PublicRoute = () => {
  const token = localStorage.getItem('authToken');
  return token ? <Navigate to="/join-as-photographer/home" replace /> : <Outlet />;
};

export default PublicRoute;
