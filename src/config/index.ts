export const CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  BASE_PATH: import.meta.env.BASE_URL || '/',
  THEMES: {
    LIGHT: 'light' as const,
    DARK: 'dark' as const
  },
  STORAGE_KEYS: {
    THEME: 'theme',
    CART: 'cart',
    USER: 'user'
  },
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  }
} as const;

export type ConfigType = typeof CONFIG;
