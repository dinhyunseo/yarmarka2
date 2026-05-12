import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/layout/Header/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { User, Shield, Star, Package } from 'lucide-react';
import styles from './Masters.module.css';

const masters = [
  {
    id: 'm1',
    name: 'Александр Громов',
    specialty: 'Кожевник и мастер аксессуаров из натуральной кожи',
    rating: 4.9,
    reviews: 156,
    productsCount: 24,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  },
  {
    id: 'm2',
    name: 'Елена Светлова',
    specialty: 'Художественная керамика и авторский декор для дома',
    rating: 5.0,
    reviews: 89,
    productsCount: 18,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  },
  {
    id: 'm3',
    name: 'Дмитрий Ковалев',
    specialty: 'Ювелирное искусство и работа с редкими металлами',
    rating: 4.8,
    reviews: 64,
    productsCount: 12,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
  }
];

export const Masters: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header isMenuOpen={false} onMenuToggle={() => {}} />
      
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

                <Link to={`/masters/${master.id}`} className={styles.profileBtn}>
                  Смотреть профиль
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
