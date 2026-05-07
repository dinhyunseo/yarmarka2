import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { type CartItem } from '../../../types';
import { ThemeToggle } from '../../ui/ThemeToggle/ThemeToggle';
import { User } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  cartItems?: CartItem[];
  onCartClick?: () => void;
  isMenuOpen?: boolean;
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  searchTerm = '', 
  onSearchChange, 
  cartItems = [],
  onCartClick,
  isMenuOpen = false,
  onMenuToggle
}) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerTop}>
          <button 
            className={styles.menuToggle} 
            onClick={onMenuToggle}
          >
            ☰
          </button>
          <Link to="/" className={styles.logoLink}>
            <h1 className={styles.logo}>Ярмарка Мастеров</h1>
          </Link>
          <div className={styles.headerActions}>
            <ThemeToggle />
            <button className={styles.cartIcon} onClick={onCartClick}>
              🛒 ({cartItems.length})
            </button>
            <div className={styles.userActions}>
              {isAuthenticated ? (
                <Link to="/profile" className={styles.profileLink}>
                  <User size={20} />
                  <span>Профиль</span>
                </Link>
              ) : (
                <>
                  <Link to="/login" className={styles.linkButton}>Войти</Link>
                  <Link to="/register" className={styles.linkButton}>Регистрация</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <nav className={`${styles.mainNav} ${isMenuOpen ? styles.open : ''}`}>
          <ul>
            <li><a href="#new">Новинки</a></li>
            <li><a href="#popular">Популярное</a></li>
            <li><Link to="/masters">Мастера</Link></li>
          </ul>
        </nav>

        {onSearchChange && (
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Поиск по товарам и мастерам..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <button>🔍</button>
          </div>
        )}
      </div>
    </header>
  );
};
