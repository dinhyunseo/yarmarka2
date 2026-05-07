import React from 'react';
import { Package, DollarSign, Users, TrendingUp, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import styles from './ProfileComponents.module.css';

export const MasterDashboard: React.FC = () => {
  const products = useSelector((state: RootState) => state.products.items);
  
  const stats = [
    { label: 'Товары', value: products.length, icon: <Package size={24} />, color: '#7E57C2' },
    { label: 'Продажи', value: '45,000 ₽', icon: <DollarSign size={24} />, color: '#66BB6A' },
    { label: 'Клиенты', value: '128', icon: <Users size={24} />, color: '#42A5F5' },
    { label: 'Рост', value: '+15%', icon: <TrendingUp size={24} />, color: '#FFA726' },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={stat.label}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sectionHeader}>
        <h2>Мои изделия</h2>
        <button className={styles.addBtn}>
          <Plus size={20} />
          <span>Добавить товар</span>
        </button>
      </div>

      <div className={styles.productsList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productRow}>
            <img src={product.image} alt={product.title} className={styles.productImage} />
            <div className={styles.productInfo}>
              <h3>{product.title}</h3>
              <p>{product.category}</p>
            </div>
            <div className={styles.productPrice}>{product.price} ₽</div>
            <div className={styles.productStats}>
              <span>45 просмотров</span>
              <span>3 продажи</span>
            </div>
            <div className={styles.productActions}>
              <button className={styles.editBtn}>Изменить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
