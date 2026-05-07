import React from 'react';
import { LogOut, Bell, Shield, User, Smartphone } from 'lucide-react';
import styles from './ProfileComponents.module.css';

interface ProfileSettingsProps {
  onLogout: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onLogout }) => {
  const sections = [
    { title: 'Аккаунт', icon: <User size={20} />, description: 'Персональная информация и аватар' },
    { title: 'Уведомления', icon: <Bell size={20} />, description: 'Настройка push-уведомлений и email' },
    { title: 'Безопасность', icon: <Shield size={20} />, description: 'Пароль и двухфакторная аутентификация' },
    { title: 'Устройства', icon: <Smartphone size={20} />, description: 'Управление активными сессиями' },
  ];

  return (
    <div className={styles.settingsGrid}>
      <div className={styles.settingsMain}>
        {sections.map((section, i) => (
          <div key={i} className={styles.settingsItem}>
            <div className={styles.settingsIconWrapper}>{section.icon}</div>
            <div className={styles.settingsContent}>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </div>
            <button className={styles.editBtn}>Управлять</button>
          </div>
        ))}
        
        <div className={`${styles.settingsItem} ${styles.dangerZone}`}>
          <div className={`${styles.settingsIconWrapper} ${styles.logoutIcon}`}>
            <LogOut size={20} />
          </div>
          <div className={styles.settingsContent}>
            <h3>Выйти из аккаунта</h3>
            <p>Ваша сессия будет завершена на этом устройстве</p>
          </div>
          <button className={styles.logoutBtn} onClick={onLogout}>Выйти</button>
        </div>
      </div>
    </div>
  );
};
