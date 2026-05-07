import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';
import { ADMIN_CREDENTIALS } from '../../config/auth';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const [role, setRole] = useState<'buyer' | 'master' | 'admin'>('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Проверка администратора
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      dispatch(setUser({
        id: 'admin_1',
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        role: 'admin',
        createdAt: new Date().toISOString()
      }));
      navigate('/profile');
      return;
    }

    // Простая имитация входа для остальных
    if (email && password.length >= 6) {
      dispatch(setUser({
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
        role: role === 'master' ? 'master' : 'member',
        createdAt: new Date().toISOString()
      }));
      navigate('/profile');
    } else {
      setError('Неверный логин или пароль (минимум 6 символов)');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2>Вход</h2>
        
        <div className={styles.roleSelector}>
          <button 
            type="button"
            className={`${styles.roleBtn} ${role === 'buyer' ? styles.roleBtnActive : ''}`}
            onClick={() => setRole('buyer')}
          >
            Покупатель
          </button>
          <button 
            type="button"
            className={`${styles.roleBtn} ${role === 'master' ? styles.roleBtnActive : ''}`}
            onClick={() => setRole('master')}
          >
            Мастер
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="identifier">Email или имя пользователя</label>
            <input 
              type="text" 
              id="identifier" 
              placeholder="example@mail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {role === 'master' && (
            <div className={styles.inputGroup}>
              <label htmlFor="workshopName">Название мастерской</label>
              <input type="text" id="workshopName" placeholder="Art Studio" />
            </div>
          )}
          <button type="submit" className={styles.submitBtn}>Войти</button>
        </form>
        <p className={styles.switch}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
        <Link to="/" className={styles.backHome}>На главную</Link>
      </div>
    </div>
  );
};
