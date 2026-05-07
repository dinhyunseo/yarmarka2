import type { CartItem } from './product';

export type ThemeType = 'light' | 'dark';

export interface ThemeState {
  current: ThemeType;
  isDark: boolean;
}

export interface CartState {
  items: CartItem[];
  total: number;
}
