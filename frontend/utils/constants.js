/**
 * Global Constants
 */

export const APP_NAME = 'Synapse';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
};

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};
