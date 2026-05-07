import React from 'react';
import { type Product } from '../../../types';
import { formatPrice } from '../../../utils/helpers';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  onClick
}) => {
  return (
    <div className={styles.productCard} onClick={() => onClick(product)}>
      <img 
        src={product.image} 
        alt={product.title} 
        className={styles.productImage}
      />
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <p className={styles.author}>от {product.author}</p>
        <div className={styles.price}>{formatPrice(product.price)}</div>
        <button 
          className={styles.addToCartBtn}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          В корзину
        </button>
      </div>
    </div>
  );
};
