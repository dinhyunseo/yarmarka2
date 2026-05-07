import React, { useState } from 'react';
import { Shield, Users, ShoppingCart, AlertCircle, Trash2, Eye, EyeOff, X, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import styles from './ProfileComponents.module.css';

export const AdminDashboard: React.FC = () => {
  const products = useSelector((state: RootState) => state.products.items);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  const stats = [
    { label: 'Все товары', value: products.length, icon: <ShoppingCart size={24} />, color: '#673AB7' },
    { label: 'Мастера', value: '42', icon: <Users size={24} />, color: '#00BCD4' },
    { label: 'Жалобы', value: '3', icon: <AlertCircle size={24} />, color: '#F44336' },
    { label: 'Выручка', value: '120,450 ₽', icon: <Shield size={24} />, color: '#009688' },
  ];

  const handleCloseModal = () => setSelectedProduct(null);

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h3 className={styles.statLabel}>Общая статистика</h3>
        <button 
          className={`${styles.privacyToggle} ${isPrivacyMode ? styles.privacyToggleActive : ''}`}
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
          title={isPrivacyMode ? 'Показать данные' : 'Скрыть данные'}
        >
          {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
          <span>{isPrivacyMode ? 'Приватный режим вкл.' : 'Приватный режим выкл.'}</span>
        </button>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={`${styles.statValue} ${isPrivacyMode ? styles.blurredValue : ''}`}>
                {isPrivacyMode ? '••••••' : stat.value}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.section}>
        <h2>Управление контентом (Все товары)</h2>
        <div className={styles.productsList}>
          {products.map((product) => (
            <div key={product.id} className={styles.productRow}>
              <img src={product.image} alt={product.title} className={styles.productImage} />
              <div className={styles.productInfo}>
                <h3>{product.title}</h3>
                <p>Автор: {product.author} | Категория: {product.category}</p>
              </div>
              <div className={styles.adminActions}>
                <button 
                  className={styles.viewBtn} 
                  title="Просмотреть"
                  onClick={() => setSelectedProduct(product)}
                >
                  <Eye size={18} />
                </button>
                <button className={styles.deleteBtn} title="Удалить / Скрыть">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for Product Preview */}
      {selectedProduct && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={handleCloseModal}>
              <X size={24} />
            </button>
            <div className={styles.modalBody}>
              <img src={selectedProduct.image} alt={selectedProduct.title} className={styles.modalImage} />
              <div className={styles.modalDetails}>
                <span className={styles.previewBadge}>Режим предпросмотра</span>
                <h2 className={styles.modalTitle}>{selectedProduct.title}</h2>
                <div className={styles.modalAuthor}>
                   <User size={18} />
                   <span>{selectedProduct.author}</span>
                </div>
                <div className={styles.modalPrice}>{selectedProduct.price} ₽</div>
                <p className={styles.modalDesc}>{selectedProduct.description}</p>
                
                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                   <button className={styles.profileBtn} style={{ flex: 1 }}>Редактировать товар</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
