import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ThemeState, type ThemeType } from '../types';
import { CONFIG } from '../config';

const getInitialTheme = (): ThemeType => {
  const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
  return (savedTheme as ThemeType) || CONFIG.THEMES.LIGHT;
};

const initialState: ThemeState = {
  current: getInitialTheme(),
  isDark: getInitialTheme() === CONFIG.THEMES.DARK
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.current = state.current === CONFIG.THEMES.LIGHT ? 
        CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;
      state.isDark = !state.isDark;
      localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, state.current);
    },
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.current = action.payload;
      state.isDark = action.payload === CONFIG.THEMES.DARK;
      localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, action.payload);
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
