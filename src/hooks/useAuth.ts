import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../components/common/constants/constants';
import { STORAGE_KEYS } from '../constants/api.constants';

export const useAuth = () => {
  const navigate = useNavigate();

  const login = (token: string) => {
    localStorage.setItem(STORAGE_KEYS.authToken, token);
    navigate(ROUTES.DASHBOARD);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    navigate(ROUTES.LOGIN);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem(STORAGE_KEYS.authToken);
  };

  return { login, logout, isAuthenticated };
};
