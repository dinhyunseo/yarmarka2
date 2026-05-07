import React from 'react';
import { ShoppingBag, Heart, Star, Settings } from 'lucide-react';
import styles from './ProfileComponents.module.css';

export const MemberDashboard: React.FC = () => {
  const stats = [
    { label: 'Заказы', value: '12', icon: <ShoppingBag size={24} />, color: '#4CAF50' },
    { label: 'Избранное', value: '25', icon: <Heart size={24} />, color: '#E91E63' },
    { label: 'Отзывы', value: '8', icon: <Star size={24} />, color: '#FFC107' },
    { label: 'Баллы', value: '450', icon: <Settings size={24} />, color: '#2196F3' },
  ];

  const recentOrders = [
    { id: 'ORD-001', date: '05.05.2026', status: 'Доставлено', total: '2,500 ₽' },
    { id: 'ORD-002', date: '28.04.2026', status: 'В пути', total: '4,200 ₽' },
    { id: 'ORD-003', date: '15.04.2026', status: 'Доставлено', total: '1,800 ₽' },
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

      <section className={styles.section}>
        <h2>Последние заказы</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Заказа</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Сумма</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>
                    <span className={`${styles.status} ${styles[order.status === 'Доставлено' ? 'completed' : 'pending']}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
