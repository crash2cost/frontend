import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { STORAGE_KEYS } from '../../constants/api.constants';
import { getTokenRole } from '../../utils/jwt';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  const role = token ? getTokenRole(token) : null;

  if (role?.toUpperCase() !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
