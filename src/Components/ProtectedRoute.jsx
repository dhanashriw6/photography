import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute
 * If no authToken in localStorage → send user to signup (new user flow).
 * If token exists → render the protected page normally.
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');
  return token ? <Outlet /> : <Navigate to="/join-as-photographer" replace />;
};

export default ProtectedRoute;
