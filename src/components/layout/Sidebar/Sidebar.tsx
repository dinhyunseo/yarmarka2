import React from 'react';
import { Link } from 'react-router-dom';
import { type Category } from '../../../types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  categories?: Category[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  categories = [], 
  selectedCategory = 'all', 
  onCategorySelect,
  isOpen = false,
  onClose
}) => {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3>Меню</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.mobileOnly}>
          <div className={styles.authLinks}>
            <Link to="/login" className={styles.authLink} onClick={onClose}>Войти</Link>
            <Link to="/register" className={styles.authLink} onClick={onClose}>Регистрация</Link>
          </div>
          <nav className={styles.mobileNav}>
            <ul>
              <li><a href="#new" onClick={onClose}>Новинки</a></li>
              <li><a href="#popular" onClick={onClose}>Популярное</a></li>
              <li><Link to="/masters" onClick={onClose}>Мастера</Link></li>
            </ul>
          </nav>
          {categories.length > 0 && (
            <>
              <div className={styles.divider} />
              <h3>Категории</h3>
            </>
          )}
        </div>

        {categories.length > 0 && (
          <ul className={styles.sidebarList}>
            {categories.map(category => (
              <li key={category.id} className={styles.sidebarItem}>
                <button 
                  className={`${styles.sidebarButton} ${selectedCategory === category.id ? styles.active : ''}`}
                  onClick={() => onCategorySelect?.(category.id)}
                >
                  <span className={styles.icon}>{category.icon}</span>
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  );
};
