import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, setTheme } from '../store/themeSlice';
import { type RootState } from '../store';
import type { ThemeType } from '../types/theme';
import { CONFIG } from '../config';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { current, isDark } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', current === CONFIG.THEMES.DARK);
  }, [current]);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const set = (theme: ThemeType) => {
    dispatch(setTheme(theme));
  };

  return { current, isDark, toggle, set };
};
