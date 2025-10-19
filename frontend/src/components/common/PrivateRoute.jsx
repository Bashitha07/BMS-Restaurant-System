import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ requireAdmin = false }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    // User is not an admin, redirect to home page
    return <Navigate to="/" replace />;
  }

  // Authorized, render component
  return <Outlet />;
}