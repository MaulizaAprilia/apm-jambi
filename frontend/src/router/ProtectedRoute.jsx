import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const authenticated = authService.isAuthenticated();

  if (!authenticated) {
    // Redirect to admin login with return path
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
