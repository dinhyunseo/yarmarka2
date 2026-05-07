import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Login/Login.module.css';

export const Register: React.FC = () => {
  const [role, setRole] = useState<'buyer' | 'master'>('buyer');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    // Проверка на английские буквы, цифры и подчеркивание
    const englishRegex = /^[a-zA-Z0-9_]*$/;
    if (!englishRegex.test(value)) {
      setUsernameError('Имя пользователя должно содержать только английские буквы, цифры и "_"');
    } else {
      setUsernameError('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2>Регистрация</h2>

        <div className={styles.roleSelector}>
          <button 
            className={`${styles.roleBtn} ${role === 'buyer' ? styles.roleBtnActive : ''}`}
            onClick={() => setRole('buyer')}
          >
            Покупатель
          </button>
          <button 
            className={`${styles.roleBtn} ${role === 'master' ? styles.roleBtnActive : ''}`}
            onClick={() => setRole('master')}
          >
            Мастер
          </button>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName">Имя и фамилия</label>
            <input type="text" id="fullName" placeholder="Иван Иванов" />
          </div>
          {role === 'master' && (
            <div className={styles.inputGroup}>
              <label htmlFor="workshopName">Название мастерской</label>
              <input type="text" id="workshopName" placeholder="Art Studio" />
            </div>
          )}
          <div className={styles.inputGroup}>
            <label htmlFor="username">Имя пользователя (никнейм)</label>
            <input 
              type="text" 
              id="username" 
              placeholder="user123" 
              value={username}
              onChange={handleUsernameChange}
              className={usernameError ? styles.inputError : ''}
            />
            {usernameError && <span className={styles.errorMessage}>{usernameError}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="example@mail.com" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <input type="password" id="password" placeholder="••••••••" />
          </div>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!!usernameError || !username}
          >
            Зарегистрироваться
          </button>
        </form>
        <p className={styles.switch}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
        <Link to="/" className={styles.backHome}>На главную</Link>
      </div>
    </div>
  );
};
