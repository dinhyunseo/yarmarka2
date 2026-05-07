import React from 'react';
import { Header } from '../../components/layout/Header/Header';
import { Sidebar } from '../../components/layout/Sidebar/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { User, Shield, Star, Package } from 'lucide-react';
import styles from './Masters.module.css';

const masters = [
  {
    id: 'm1',
    name: 'Анна Мария',
    specialty: 'Керамика и гончарное дело',
    rating: 4.9,
    reviews: 128,
    productsCount: 15,
    avatar: '/api/placeholder/150/150'
  },
  {
    id: 'm2',
    name: 'Мастер Сергей',
    specialty: 'Деревянные изделия и игрушки',
    rating: 4.8,
    reviews: 86,
    productsCount: 12,
    avatar: '/api/placeholder/150/150'
  },
  {
    id: 'm3',
    name: 'Кузнец Иван',
    specialty: 'Художественная ковка',
    rating: 5.0,
    reviews: 45,
    productsCount: 8,
    avatar: '/api/placeholder/150/150'
  },
  {
    id: 'm4',
    name: 'Кузнец Максим',
    specialty: 'Оружейное мастерство и аксессуары',
    rating: 4.7,
    reviews: 32,
    productsCount: 6,
    avatar: '/api/placeholder/150/150'
  }
];

export const Masters: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className={styles.container}>
      <Header isMenuOpen={isSidebarOpen} onMenuToggle={() => setSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Наши Мастера</h1>
          <p>Познакомьтесь с талантливыми людьми, создающими уникальные вещи своими руками</p>
        </div>

        <div className={styles.mastersGrid}>
          {masters.map((master) => (
            <div key={master.id} className={styles.masterCard}>
              <div className={styles.avatarWrapper}>
                <img src={master.avatar} alt={master.name} className={styles.avatar} />
                <div className={styles.badge}>
                   <Shield size={14} />
                   <span>Проверен</span>
                </div>
              </div>
              
              <div className={styles.masterInfo}>
                <h3>{master.name}</h3>
                <p className={styles.specialty}>{master.specialty}</p>
                
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <Star size={16} className={styles.starIcon} />
                    <span>{master.rating}</span>
                  </div>
                  <div className={styles.stat}>
                    <User size={16} />
                    <span>{master.reviews} отзывов</span>
                  </div>
                  <div className={styles.stat}>
                    <Package size={16} />
                    <span>{master.productsCount} товаров</span>
                  </div>
                </div>

                <button className={styles.profileBtn}>Смотреть профиль</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
