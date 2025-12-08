// Application-wide constants
export const APP_CONFIG = {
  name: 'Labyrinth Nexus',
  version: '1.0.0',
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 25, 50, 100],
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  refreshTokenBuffer: 2 * 60 * 1000, // 2 minutes
  dateFormat: 'yyyy-MM-dd',
  dateTimeFormat: 'yyyy-MM-dd HH:mm:ss',

  routes: {
    afterLogin: '/dashboard',
    afterLogout: '/auth/login',
    unauthorized: '/auth/unauthorized',
  }
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  users: '/users',
  roles: '/roles',
  sessions: '/sessions',
  settings: '/settings',
} as const;
