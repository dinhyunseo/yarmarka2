import React from 'react';
import { useTheme } from '../../../hooks/useTheme';
import styles from './ThemeToggle.module.css';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggle } = useTheme();

  return (
    <button 
      className={styles.themeToggle}
      onClick={toggle}
      aria-label={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};
