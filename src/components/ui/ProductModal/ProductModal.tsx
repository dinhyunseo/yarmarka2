import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { type Product } from '../../../types';
import { formatPrice } from '../../../utils/helpers';
import styles from './ProductModal.module.css';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div 
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
          
          <div className={styles.content}>
            <div className={styles.imageSection}>
              <img src={product.image} alt={product.title} />
            </div>
            
            <div className={styles.infoSection}>
              <h2 className={styles.title}>{product.title}</h2>
              <p className={styles.author}>от {product.author}</p>
              
              <div className={styles.description}>
                <h3>Описание</h3>
                <p>{product.description}</p>
              </div>
              
              <div className={styles.footer}>
                <div className={styles.price}>{formatPrice(product.price)}</div>
                <button 
                  className={styles.addBtn}
                  onClick={() => onAddToCart(product)}
                >
                  Добавить в корзину
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
