import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
import { removeFromCart, updateQuantity, clearCart } from '../../../store/cartSlice';
import { formatPrice } from '../../../utils/helpers';
import styles from './Cart.module.css';

interface CartProps {
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className={styles.cartOverlay} onClick={onClose}>
        <div className={styles.cartContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2>Корзина</h2>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </div>
          <div className={styles.empty}>
            <p>Ваша корзина пуста</p>
            <button className={styles.continueButton} onClick={onClose}>
              Продолжить покупки
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartOverlay} onClick={onClose}>
      <div className={styles.cartContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Корзина ({items.length})</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.cartId} className={styles.cartItem}>
              <img src={item.image} alt={item.title} className={styles.itemImage} />
              <div className={styles.itemInfo}>
                <h3>{item.title}</h3>
                <p className={styles.author}>{item.author}</p>
                <div className={styles.controls}>
                  <div className={styles.quantity}>
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.cartId, quantity: Math.max(1, item.quantity - 1) }))}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.cartId, quantity: item.quantity + 1 }))}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className={styles.remove}
                    onClick={() => dispatch(removeFromCart(item.cartId))}
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <div className={styles.itemPrice}>
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Итого:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className={styles.actions}>
            <button className={styles.clearButton} onClick={() => dispatch(clearCart())}>
              Очистить
            </button>
            <button className={styles.checkoutButton} onClick={handleCheckout}>
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
