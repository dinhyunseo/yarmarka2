import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/layout/Header/Header';
import { ArrowLeft, Star, MapPin, Briefcase, Package, MessageSquare, Heart, Share2, CheckCircle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPrice } from '../../utils/helpers';
import styles from './MasterProfile.module.css';

// Данные мастеров (в идеале должны быть в отдельном файле констант или приходить с сервера)
const mastersData = {
  'm1': {
    id: 'm1',
    name: 'Александр Громов',
    specialty: 'Кожевник и мастер аксессуаров из натуральной кожи',
    rating: 4.9,
    reviews: 156,
    productsCount: 24,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    location: 'Санкт-Петербург, Россия',
    experience: 'Более 10 лет',
    bio: 'Специализируюсь на создании долговечных аксессуаров из кожи растительного дубления. Каждое изделие прошивается вручную седельным швом, что гарантирует пожизненную прочность.',
    portfolio: [
      { id: 'p1', title: 'Кошелек "Классика"', price: 4500, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop' },
      { id: 'p2', title: 'Ремень ручной работы', price: 3200, image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop' },
      { id: 'p3', title: 'Сумка "Охотник"', price: 12000, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
      { id: 'p10', title: 'Органайзер для карт', price: 1800, image: 'https://images.unsplash.com/photo-1524333866104-e5557d93b161?w=400&h=400&fit=crop' },
    ]
  },
  'm2': {
    id: 'm2',
    name: 'Елена Светлова',
    specialty: 'Художественная керамика и авторский декор для дома',
    rating: 5.0,
    reviews: 89,
    productsCount: 18,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    location: 'Москва, Россия',
    experience: '6 лет',
    bio: 'Моя керамика — это сочетание природных форм и современного минимализма. Использую только экологичные глазури и высокотемпературный обжиг для безопасности и прочности.',
    portfolio: [
      { id: 'p4', title: 'Ваза "Океан"', price: 5800, image: 'https://images.unsplash.com/photo-1612196808214-b9e1d614e380?w=400&h=400&fit=crop' },
      { id: 'p5', title: 'Набор чашек "Лес"', price: 2400, image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop' },
      { id: 'p6', title: 'Панно "Мраморный берег"', price: 3500, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop' },
      { id: 'p11', title: 'Чайник "Дракон"', price: 4200, image: 'https://images.unsplash.com/photo-158062831248c-aa7a76e1897c?w=400&h=400&fit=crop' },
    ]
  },
  'm3': {
    id: 'm3',
    name: 'Дмитрий Ковалев',
    specialty: 'Ювелирное искусство и работа с редкими металлами',
    rating: 4.8,
    reviews: 64,
    productsCount: 12,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    location: 'Екатеринбург, Россия',
    experience: '15 лет',
    bio: 'Потомственный ювелир. Работаю в технике филиграни и горячей эмали. Создаю украшения, которые становятся семейными реликвиями.',
    portfolio: [
      { id: 'p7', title: 'Кольцо "Дыхание"', price: 15000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop' },
      { id: 'p8', title: 'Подвеска "Звезда"', price: 8500, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
      { id: 'p9', title: 'Серьги "Серебро"', price: 11200, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' },
      { id: 'p12', title: 'Браслет "Медь"', price: 6700, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe157a8?w=400&h=400&fit=crop' },
    ]
  }
};

export const MasterProfile: React.FC = () => {
  const { masterId } = useParams<{ masterId: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [isMessaging, setIsMessaging] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageSent, setMessageSent] = React.useState(false);

  const master = mastersData[masterId as keyof typeof mastersData];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Имитация отправки
    setTimeout(() => {
      setMessageSent(true);
      setMessage('');
      setTimeout(() => {
        setMessageSent(false);
        setIsMessaging(false);
      }, 3000);
    }, 1000);
  };

  if (!master) {
    return (
      <div className={styles.container}>
        <Header isMenuOpen={false} onMenuToggle={() => {}} />
        <div className={styles.error}>
          <h2>Мастер не найден</h2>
          <Link to="/masters" className={styles.backLink}>Вернуться к списку</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header isMenuOpen={false} onMenuToggle={() => {}} />

      <main className={styles.main}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={20} />
          Назад к мастерам
        </button>

        <section className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.avatarContainer}>
              <img src={master.avatar} alt={master.name} className={styles.avatar} />
              <div className={styles.badge}><Star size={12} fill="currentColor" /> Проверенный мастер</div>
            </div>
            
            <div className={styles.details}>
              <h1 className={styles.name}>{master.name}</h1>
              <p className={styles.specialty}>{master.specialty}</p>
              
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <Star size={18} fill="var(--accent-color)" color="var(--accent-color)" />
                  <span>{master.rating}</span>
                  <span className={styles.statLabel}>({master.reviews} отзывов)</span>
                </div>
                <div className={styles.statItem}>
                  <MapPin size={18} />
                  <span>{master.location}</span>
                </div>
                <div className={styles.statItem}>
                  <Briefcase size={18} />
                  <span>{master.experience} опыта</span>
                </div>
              </div>

              <div className={styles.actions}>
                <button 
                  className={styles.primaryBtn}
                  onClick={() => setIsMessaging(!isMessaging)}
                >
                  <MessageSquare size={20} />
                  {isMessaging ? 'Закрыть чат' : 'Написать мастеру'}
                </button>
                <button className={styles.secondaryBtn}>
                  <Heart size={20} />
                </button>
                <button className={styles.secondaryBtn}>
                  <Share2 size={20} />
                </button>
              </div>

              {isMessaging && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.messageBox}
                >
                  {messageSent ? (
                    <div className={styles.successMessage}>
                      <CheckCircle size={32} color="#10b981" />
                      <p>Сообщение успешно отправлено!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage}>
                      <textarea 
                        placeholder={`Напишите ваш вопрос для ${master.name}...`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={styles.textarea}
                        autoFocus
                      />
                      <button type="submit" className={styles.sendBtn} disabled={!message.trim()}>
                        Отправить
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </section>

        <section className={styles.about}>
          <h2>О мастере</h2>
          <p>{master.bio}</p>
        </section>

        <section className={styles.portfolio}>
          <div className={styles.sectionHeader}>
            <h2>Работы мастера</h2>
            <span className={styles.count}>{master.productsCount} изделий</span>
          </div>
          
          <div className={styles.grid}>
            {master.portfolio.map(product => (
              <motion.div 
                key={product.id}
                className={styles.productCard}
                whileHover={{ y: -5 }}
              >
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.title} />
                  <button className={styles.wishlistBtn}><Heart size={18} /></button>
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.title}</h3>
                  <div className={styles.productFooter}>
                    <span className={styles.price}>{formatPrice(product.price)}</span>
                    <button className={styles.addCartBtn}><Package size={18} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className={styles.loadMore}>Посмотреть все изделия</button>
        </section>
      </main>
    </div>
  );
};
