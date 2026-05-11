import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../store';
import { clearCart } from '../../store/cartSlice';
import { formatPrice } from '../../utils/helpers';
import { ArrowLeft, CreditCard, Truck, CheckCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './Checkout.module.css';

type CheckoutStep = 'shipping' | 'delivery' | 'payment' | 'processing' | 'confirmation';

export const Checkout: React.FC = () => {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    deliveryMethod: 'courier' as 'courier' | 'pickup'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliverySelect = (method: 'courier' | 'pickup') => {
    setFormData(prev => ({ ...prev, deliveryMethod: method }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'shipping') setStep('delivery');
    else if (step === 'delivery') setStep('payment');
    else if (step === 'payment') {
      setStep('processing');
      // Simulate order processing delay
      setTimeout(() => {
        setStep('confirmation');
        dispatch(clearCart());
      }, 2500);
    }
  };

  if (items.length === 0 && step !== 'confirmation' && step !== 'processing') {
    return (
      <div className={styles.container}>
        <div className={styles.emptyContent}>
          <Package size={64} />
          <h2>Ваша корзина пуста</h2>
          <p>Добавьте товары, чтобы оформить заказ</p>
          <Link to="/" className={styles.backHomeBtn}>На главную</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <ArrowLeft size={20} />
            Назад к покупкам
          </button>
          <h1>Оформление заказа</h1>
        </div>

        <div className={styles.stepper}>
          <div className={`${styles.step} ${step === 'shipping' ? styles.active : ''} ${step !== 'shipping' ? styles.completed : ''}`}>
            <span className={styles.stepNum}>{['delivery', 'payment', 'confirmation', 'processing'].includes(step) ? <CheckCircle size={16} /> : '1'}</span>
            <span>Данные</span>
          </div>
          <div className={styles.line} />
          <div className={`${styles.step} ${step === 'delivery' ? styles.active : ''} ${['payment', 'confirmation', 'processing'].includes(step) ? styles.completed : ''}`}>
            <span className={styles.stepNum}>{['payment', 'confirmation', 'processing'].includes(step) ? <CheckCircle size={16} /> : '2'}</span>
            <span>Доставка</span>
          </div>
          <div className={styles.line} />
          <div className={`${styles.step} ${step === 'payment' ? styles.active : ''} ${['confirmation', 'processing'].includes(step) ? styles.completed : ''}`}>
            <span className={styles.stepNum}>{step === 'confirmation' ? <CheckCircle size={16} /> : '3'}</span>
            <span>Оплата</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <AnimatePresence mode="wait">
              {step === 'shipping' && (
                <motion.form 
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit}
                  className={styles.form}
                >
                  <div className={styles.sectionTitle}>
                    <Truck size={20} />
                    <h2>Адрес доставки</h2>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>Имя</label>
                      <input name="firstName" required value={formData.firstName} onChange={handleInputChange} placeholder="Иван" />
                    </div>
                    <div className={styles.field}>
                      <label>Фамилия</label>
                      <input name="lastName" required value={formData.lastName} onChange={handleInputChange} placeholder="Иванов" />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="ivan@example.com" />
                  </div>
                  <div className={styles.field}>
                    <label>Телефон</label>
                    <input name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} placeholder="+7 (999) 000-00-00" />
                  </div>
                  <div className={styles.field}>
                    <label>Адрес</label>
                    <input name="address" required value={formData.address} onChange={handleInputChange} placeholder="ул. Ленина, д. 1, кв. 1" />
                  </div>
                  <div className={styles.row}>
                    <div className={styles.field} style={{ flex: 2 }}>
                      <label>Город</label>
                      <input name="city" required value={formData.city} onChange={handleInputChange} placeholder="Москва" />
                    </div>
                    <div className={styles.field} style={{ flex: 1 }}>
                      <label>Индекс</label>
                      <input name="zipCode" required value={formData.zipCode} onChange={handleInputChange} placeholder="123456" />
                    </div>
                  </div>
                  <button type="submit" className={styles.nextBtn}>Перейти к оплате</button>
                </motion.form>
              )}

              {step === 'delivery' && (
                <motion.div 
                  key="delivery"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={styles.form}
                >
                  <div className={styles.sectionTitle}>
                    <Truck size={20} />
                    <h2>Способ получения</h2>
                  </div>
                  
                  <div className={styles.deliveryGrid}>
                    <div 
                      className={`${styles.deliveryOption} ${formData.deliveryMethod === 'courier' ? styles.selected : ''}`}
                      onClick={() => handleDeliverySelect('courier')}
                    >
                      <div className={styles.optionHeader}>
                        <Truck size={24} />
                        <div className={styles.optionCheck} />
                      </div>
                      <h3>Курьерская доставка</h3>
                      <p>До двери за 2-3 дня</p>
                      <span className={styles.optionPrice}>Бесплатно</span>
                    </div>

                    <div 
                      className={`${styles.deliveryOption} ${formData.deliveryMethod === 'pickup' ? styles.selected : ''}`}
                      onClick={() => handleDeliverySelect('pickup')}
                    >
                      <div className={styles.optionHeader}>
                        <Package size={24} />
                        <div className={styles.optionCheck} />
                      </div>
                      <h3>Самовывоз</h3>
                      <p>Из пункта выдачи</p>
                      <span className={styles.optionPrice}>Бесплатно</span>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button type="button" onClick={() => setStep('shipping')} className={styles.backActionBtn}>Назад</button>
                    <button type="button" onClick={() => setStep('payment')} className={styles.nextBtn}>Продолжить</button>
                  </div>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.form 
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit}
                  className={styles.form}
                >
                  <div className={styles.sectionTitle}>
                    <CreditCard size={20} />
                    <h2>Способ оплаты</h2>
                  </div>
                  <div className={styles.field}>
                    <label>Номер карты</label>
                    <input name="cardNumber" required value={formData.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>Срок действия</label>
                      <input name="expiry" required value={formData.expiry} onChange={handleInputChange} placeholder="ММ/ГГ" />
                    </div>
                    <div className={styles.field}>
                      <label>CVV</label>
                      <input name="cvv" type="password" required value={formData.cvv} onChange={handleInputChange} placeholder="***" />
                    </div>
                  </div>
                  <div className={styles.paymentSecurity}>
                    <Shield size={16} />
                    <span>Безопасная оплата. Ваши данные защищены.</span>
                  </div>
                  <div className={styles.actions}>
                    <button type="button" onClick={() => setStep('shipping')} className={styles.backActionBtn}>Вернуться назад</button>
                    <button type="submit" className={styles.nextBtn}>Оплатить {formatPrice(total)}</button>
                  </div>
                </motion.form>
              )}

              {step === 'processing' && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.processing}
                >
                  <div className={styles.spinner} />
                  <h2>Обработка заказа...</h2>
                  <p>Пожалуйста, не закрывайте страницу</p>
                </motion.div>
              )}

              {step === 'confirmation' && (
                <motion.div 
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={styles.confirmation}
                >
                  <div className={styles.successIcon}>
                    <CheckCircle size={80} color="var(--accent-color)" />
                  </div>
                  <h2>Заказ успешно оформлен!</h2>
                  <p>Спасибо за ваш заказ! Мы отправили чек и детали доставки на вашу почту <strong>{formData.email}</strong>.</p>
                  <p className={styles.orderNumber}>Номер заказа: #MAP-{Math.floor(Math.random() * 10000)}</p>
                  <Link to="/" className={styles.nextBtn}>Вернуться в магазин</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step !== 'confirmation' && (
            <div className={styles.summarySection}>
              <div className={styles.summaryCard}>
                <h2>Ваш заказ</h2>
                <div className={styles.items}>
                  {items.map(item => (
                    <div key={item.cartId} className={styles.summaryItem}>
                      <div className={styles.itemMain}>
                        <img src={item.image} alt={item.title} />
                        <div>
                          <h3>{item.title}</h3>
                          <p>Кол-во: {item.quantity}</p>
                        </div>
                      </div>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.divider} />
                <div className={styles.totalRow}>
                  <span>Доставка</span>
                  <span>Бесплатно</span>
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Итого к оплате</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const Shield = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
