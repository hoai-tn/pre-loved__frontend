/**
 * API route constants
 */
export const API_ROUTES = {
  BASE_URL: 'http://localhost:3000/api',
  USER: {
    REGISTER: '/user/register',
    LOGIN: '/user/login',
    LOGOUT: '/user/logout',
    PROFILE: '/user/profile',
    REFRESH_TOKEN: '/user/refresh-token',
  },
  PRODUCT: {
    GET_ALL: '/products',
    GET_BY_ID: '/products/:id',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
  },
  ORDER: {
    CREATE: '/orders',
    GET_ALL: '/orders',
    GET_ALL_BY_USER: '/orders/user/:userId',
    GET_BY_ID: '/orders/:id',
  },
} as const
