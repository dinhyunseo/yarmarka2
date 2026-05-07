import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { RootState } from '../../store';
import { toggleRole, logout } from '../../store/authSlice';
import { Header } from '../../components/layout/Header/Header';
import { MasterDashboard } from '../../components/features/Profile/MasterDashboard';
import { MemberDashboard } from '../../components/features/Profile/MemberDashboard';
import { AdminDashboard } from '../../components/features/Profile/AdminDashboard';
import { ProfileSettings } from '../../components/features/Profile/ProfileSettings';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');

  if (!user) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.error}>
            <h2>Вы не авторизованы</h2>
            <button onClick={() => navigate('/login')} className={styles.loginBtn}>
              Войти в аккаунт
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'master':
        return <MasterDashboard />;
      default:
        return <MemberDashboard />;
    }
  };

  const getDashboardTitle = () => {
    switch (user.role) {
      case 'admin':
        return 'Панель управления системой';
      case 'master':
        return 'Дашборд мастера';
      default:
        return 'Мои покупки';
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.profileHeader}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className={styles.avatarPlaceholder}>{user.name.charAt(0)}</div>
              )}
            </div>
            <div className={styles.details}>
              <h1>{user.name}</h1>
              <div className={styles.tags}>
                <span className={`${styles.roleTag} ${styles[user.role]}`}>
                  {user.role === 'admin' ? 'Администратор' : user.role === 'master' ? 'Мастер' : 'Участник'}
                </span>
                <span className={styles.statusTag}>Онлайн</span>
              </div>
              <p className={styles.email}>{user.email}</p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <Link to="/" className={styles.storeBtn}>
              <ShoppingBag size={20} />
              <span>В магазин</span>
            </Link>
            <button 
              className={styles.switchBtn}
              onClick={() => dispatch(toggleRole())}
            >
              Сменить роль (Демо)
            </button>
          </div>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'dashboard' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            {getDashboardTitle()}
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Настройки
          </button>
        </div>

        <div className={styles.dashboardWrapper}>
          {activeTab === 'dashboard' ? (
            renderDashboard()
          ) : (
            <ProfileSettings onLogout={handleLogout} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
