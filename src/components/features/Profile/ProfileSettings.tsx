import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { setRole } from '../../../store/authSlice';
import { 
  LogOut, 
  Shield, 
  User, 
  Smartphone, 
  CheckCircle, 
  Users, 
  ArrowLeft, 
  ShieldCheck, 
  Briefcase, 
  UserCheck, 
  Sliders, 
  Info, 
  Sparkles, 
  AlertTriangle,
  Lock,
  Eye,
  Settings,
  Flame,
  ChevronRight
} from 'lucide-react';
import styles from './ProfileComponents.module.css';

interface ProfileSettingsProps {
  onLogout: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onLogout }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Navigation within settings
  const [activeSubView, setActiveSubView] = useState<'list' | 'roles' | 'account' | 'security' | 'devices'>('list');

  // Load custom role-specific privileges from localStorage or default values
  const [memberPermissions, setMemberPermissions] = useState({
    allowReviews: true,
    autoCoupons: false,
    foreignCurrency: false,
    instantRefund: true,
  });

  const [masterPermissions, setMasterPermissions] = useState({
    autoPublish: false,
    advancedAnalytics: true,
    directChat: true,
    unlimitedUploads: false,
  });

  const [adminPermissions, setAdminPermissions] = useState({
    permanentDelete: true,
    reviewModeration: true,
    hideTotalRevenue: false,
    autoSystemBackup: true,
  });

  // Account Form states
  const [accountForm, setAccountForm] = useState({
    name: user?.name || 'Александр',
    email: user?.email || 'member@yarmarka.ru',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    phone: '+7 (995) 124-55-12'
  });

  // Security Form States
  const [securityForm, setSecurityForm] = useState({
    twoFactor: false,
    sessionNotify: true,
    securePinCode: false
  });

  // Load initial settings from localStorage
  useEffect(() => {
    const savedMember = localStorage.getItem('perm_member');
    const savedMaster = localStorage.getItem('perm_master');
    const savedAdmin = localStorage.getItem('perm_admin');
    
    if (savedMember) setMemberPermissions(JSON.parse(savedMember));
    if (savedMaster) setMasterPermissions(JSON.parse(savedMaster));
    if (savedAdmin) setAdminPermissions(JSON.parse(savedAdmin));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Safe Saving functions
  const saveMemberPermissions = (newPerms: typeof memberPermissions) => {
    setMemberPermissions(newPerms);
    localStorage.setItem('perm_member', JSON.stringify(newPerms));
    showToast('Привилегии Покупателя успешно обновлены в системе!');
  };

  const saveMasterPermissions = (newPerms: typeof masterPermissions) => {
    setMasterPermissions(newPerms);
    localStorage.setItem('perm_master', JSON.stringify(newPerms));
    showToast('Параметры Мастера успешно зафиксированы!');
  };

  const saveAdminPermissions = (newPerms: typeof adminPermissions) => {
    setAdminPermissions(newPerms);
    localStorage.setItem('perm_admin', JSON.stringify(newPerms));
    showToast('Супер-права администратора успешно сохранены!');
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Профиль успешно обновлен!');
  };

  // Change Role instantly via Dispatch
  const handleAssignActiveRole = (targetRole: 'member' | 'master' | 'admin') => {
    dispatch(setRole(targetRole));
    
    const roleLabels = {
      member: 'Покупатель / Участник',
      master: 'Мастер ярмарки',
      admin: 'Администратор лавки'
    };
    
    showToast(`Ваша глобальная роль изменена на: ${roleLabels[targetRole]}!`);
  };

  // List layout item definition
  const sections = [
    { id: 'account', title: 'Аккаунт', icon: <User size={20} />, description: 'Управление вашими данными, контактами и аватаром' },
    { id: 'security', title: 'Безопасность', icon: <Shield size={20} />, description: 'Пароль, двухфакторный вход и параметры авторизации' },
    { id: 'devices', title: 'Устройства', icon: <Smartphone size={20} />, description: 'Просмотр и прекращение сессий на устройствах' },
  ];

  return (
    <div className={styles.settingsGrid}>
      {activeSubView === 'list' && (
        <div className={styles.settingsMain}>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mb-1">Центр управления настройками</h2>
            <p className="text-xs text-gray-500 mb-5">Настройте параметры безопасности, личный кабинет или протестируйте роли системы</p>
          </div>

          {sections.map((section) => (
            <div key={section.id} className={`${styles.settingsItem} hover:translate-x-1 border border-gray-100 transition-all`}>
              <div className={styles.settingsIconWrapper}>{section.icon}</div>
              <div className={styles.settingsContent}>
                <h3 className="font-bold text-gray-900">{section.title}</h3>
                <p className="text-xs mt-0.5">{section.description}</p>
              </div>
              <button 
                className={`${styles.editBtn} flex items-center gap-1 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer text-xs font-bold`}
                onClick={() => setActiveSubView(section.id as any)}
              >
                <span>Настроить</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
          
          <div className={`${styles.settingsItem} ${styles.dangerZone}`}>
            <div className={`${styles.settingsIconWrapper} ${styles.logoutIcon}`}>
              <LogOut size={20} />
            </div>
            <div className={styles.settingsContent}>
              <h3 className="font-bold text-red-600">Выйти из учетной записи</h3>
              <p className="text-xs text-gray-500 mt-0.5">Все сессии на этом устройстве будут мгновенно ликвидированы</p>
            </div>
            <button className={styles.logoutBtn} onClick={onLogout}>Выйти</button>
          </div>
        </div>
      )}

      {/* DETAILED ROLES CONFIGURATION HANDLER */}
      {activeSubView === 'roles' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={() => setActiveSubView('list')} 
              className="p-1.5 hover:bg-gray-100 rounded-lg transition duration-150 text-gray-500 hover:text-gray-900 cursor-pointer"
              title="Назад в меню"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600">Безопасность & Доступы</span>
              <h2 className="text-lg font-black text-gray-950">Конфигуратор и переключатель ролей</h2>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Наша площадка построена на трех разных ролях. Выберите роль ниже, чтобы активировать её, или переключите доступы и внутренние привилегии для детальной симуляции ярмарки мастеров.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* BUYER / MEMBER CARD */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between transition ${user?.role === 'member' ? 'border-indigo-600 bg-indigo-50/10 ring-2 ring-indigo-600/10' : 'border-gray-100 bg-gray-50/20'}`}>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-indigo-100/50 text-indigo-600 rounded-xl">
                    <UserCheck size={20} />
                  </div>
                  {user?.role === 'member' && (
                    <span className="text-[9px] font-black tracking-widest bg-indigo-600 text-white uppercase px-2 py-0.5 rounded-full">
                      АКТИВНА
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-extrabold text-gray-900">Покупатель</h3>
                <span className="text-[10px] text-indigo-600 font-semibold uppercase">member</span>
                <p className="text-xs text-gray-500 mt-2 mb-4 leading-relaxed">
                  Стандартный профиль клиента. Доступен каталог, покупка в корзину, просмотр личных заказов и добавление отзывов.
                </p>
                
                {/* Embedded Privileges Config */}
                <div className="border-t border-gray-100 pt-3 mt-4 space-y-2.5">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Привилегии:</span>
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-gray-600">Разрешить отзывы</span>
                    <input 
                      type="checkbox" 
                      checked={memberPermissions.allowReviews} 
                      onChange={(e) => saveMemberPermissions({ ...memberPermissions, allowReviews: e.target.checked })} 
                      className="accent-indigo-600"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-gray-600">Инстантно возвратить</span>
                    <input 
                      type="checkbox" 
                      checked={memberPermissions.instantRefund} 
                      onChange={(e) => saveMemberPermissions({ ...memberPermissions, instantRefund: e.target.checked })} 
                      className="accent-indigo-600"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-gray-600">Авто-выдача купонов</span>
                    <input 
                      type="checkbox" 
                      checked={memberPermissions.autoCoupons} 
                      onChange={(e) => saveMemberPermissions({ ...memberPermissions, autoCoupons: e.target.checked })} 
                      className="accent-indigo-600"
                    />
                  </label>
                </div>
              </div>
              
              <button
                disabled={user?.role === 'member'}
                onClick={() => handleAssignActiveRole('member')}
                className={`mt-5 w-full py-2 rounded-xl text-xs font-black tracking-wider uppercase transition active:scale-95 cursor-pointer ${
                  user?.role === 'member'
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                }`}
              >
                {user?.role === 'member' ? 'Вы Покупатель' : 'Стать Покупателем'}
              </button>
            </div>

            {/* MASTER CARD */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between transition ${user?.role === 'master' ? 'border-amber-600 bg-amber-50/10 ring-2 ring-amber-600/10' : 'border-gray-100 bg-gray-50/20'}`}>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                    <Briefcase size={20} />
                  </div>
                  {user?.role === 'master' && (
                    <span className="text-[9px] font-black tracking-widest bg-amber-500 text-white uppercase px-2 py-0.5 rounded-full animate-bounce">
                      АКТИВНА
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-extrabold text-gray-900">Мастер ярмарки</h3>
                <span className="text-[10px] text-amber-600 font-semibold uppercase">master</span>
                <p className="text-xs text-gray-500 mt-2 mb-4 leading-relaxed">
                  Создатель изделий. Позволяет добавлять свои работы в лавку через модерацию, редактировать цены и видеть личную статистику.
                </p>

                {/* Embedded Privileges Config */}
                <div className="border-t border-gray-100 pt-3 mt-4 space-y-2.5">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Суб-параметры:</span>
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-gray-600">Публиковать без модерации</span>
                    <input 
                      type="checkbox" 
                      checked={masterPermissions.autoPublish} 
                      onChange={(e) => saveMasterPermissions({ ...masterPermissions, autoPublish: e.target.checked })} 
                      className="accent-amber-500"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-gray-600">Продвинутая аналитика</span>
                    <input 
                      type="checkbox" 
                      checked={masterPermissions.advancedAnalytics} 
                      onChange={(e) => saveMasterPermissions({ ...masterPermissions, advancedAnalytics: e.target.checked })} 
                      className="accent-amber-500"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-gray-600">Безлимитный лог товаров</span>
                    <input 
                      type="checkbox" 
                      checked={masterPermissions.unlimitedUploads} 
                      onChange={(e) => saveMasterPermissions({ ...masterPermissions, unlimitedUploads: e.target.checked })} 
                      className="accent-amber-500"
                    />
                  </label>
                </div>
              </div>

              <button
                disabled={user?.role === 'master'}
                onClick={() => handleAssignActiveRole('master')}
                className={`mt-5 w-full py-2 rounded-xl text-xs font-black tracking-wider uppercase transition active:scale-95 cursor-pointer ${
                  user?.role === 'master'
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                }`}
              >
                {user?.role === 'master' ? 'Вы Мастер' : 'Активировать Мастера'}
              </button>
            </div>

            {/* ADMINISTRATOR CARD */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between transition ${user?.role === 'admin' ? 'border-rose-600 bg-rose-50/10 ring-2 ring-rose-600/10' : 'border-gray-100 bg-gray-50/20'}`}>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-red-100 text-rose-600 rounded-xl">
                    <ShieldCheck size={20} />
                  </div>
                  {user?.role === 'admin' && (
                    <span className="text-[9px] font-black tracking-widest bg-rose-600 text-white uppercase px-2 py-0.5 rounded-full animate-pulse">
                      АКТИВЕН
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-extrabold text-gray-900">Администратор</h3>
                <span className="text-[10px] text-rose-600 font-semibold uppercase">admin</span>
                <p className="text-xs text-gray-500 mt-2 mb-4 leading-relaxed">
                  Полная модерация и судейство. Доступ к контролю работ, назначению ярлыков NEW / HIT, удалению изделий и полной статистике лавки.
                </p>

                {/* Embedded Privileges Config */}
                <div className="border-t border-gray-100 pt-3 mt-4 space-y-2.5">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Супер-права:</span>
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-gray-600">Полное удаление работ</span>
                    <input 
                      type="checkbox" 
                      checked={adminPermissions.permanentDelete} 
                      onChange={(e) => saveAdminPermissions({ ...adminPermissions, permanentDelete: e.target.checked })} 
                      className="accent-rose-600"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-gray-600">Модерация чужих отзывов</span>
                    <input 
                      type="checkbox" 
                      checked={adminPermissions.reviewModeration} 
                      onChange={(e) => saveAdminPermissions({ ...adminPermissions, reviewModeration: e.target.checked })} 
                      className="accent-rose-600"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-gray-600 font-medium text-rose-600 flex items-center gap-1">
                      <Flame size={12} /> Скрыть общую выручку
                    </span>
                    <input 
                      type="checkbox" 
                      checked={adminPermissions.hideTotalRevenue} 
                      onChange={(e) => saveAdminPermissions({ ...adminPermissions, hideTotalRevenue: e.target.checked })} 
                      className="accent-rose-600"
                    />
                  </label>
                </div>
              </div>

              <button
                disabled={user?.role === 'admin'}
                onClick={() => handleAssignActiveRole('admin')}
                className={`mt-5 w-full py-2 rounded-xl text-xs font-black tracking-wider uppercase transition active:scale-95 cursor-pointer ${
                  user?.role === 'admin'
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                }`}
              >
                {user?.role === 'admin' ? 'Вы Администратор' : 'Вступить в Права'}
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-3 text-xs text-gray-500 leading-relaxed mb-4">
            <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              Все измененные привилегии сохраняются в локальное зашифрованное хранилище окружения ярмарки. Текущая активная сессия мгновенно перерисовывает интерфейс в соответствии с вашими правами без перезагрузки страницы.
            </div>
          </div>
          
          <button 
            onClick={() => setActiveSubView('list')}
            className="w-full py-3 border border-gray-200 hover:border-gray-300 text-gray-700 bg-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
          >
            Утвердить и вернуться назад
          </button>
        </div>
      )}

      {/* ACCOUNT DETAILS SUB VIEW */}
      {activeSubView === 'account' && (
        <form onSubmit={handleSaveAccount} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <button type="button" onClick={() => setActiveSubView('list')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-sans">Личный профиль</span>
              <h2 className="text-lg font-black text-gray-950">Персональная информация</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <img src={accountForm.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200" />
            <div>
              <button 
                type="button" 
                onClick={() => {
                  setAccountForm(prev => ({ ...prev, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' }));
                  showToast('Аватар обновлен!');
                }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer transition"
              >
                Изменить аватар
              </button>
              <span className="text-[10px] text-gray-400 block mt-1">Рекомендуемый размер квадрата: 150x150</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Имя пользователя</label>
              <input 
                type="text" 
                value={accountForm.name} 
                onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Email адрес</label>
              <input 
                type="email" 
                value={accountForm.email} 
                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Номер телефона</label>
              <input 
                type="text" 
                value={accountForm.phone} 
                onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => setActiveSubView('list')}
              className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 flex-1 cursor-pointer"
            >
              Отмена
            </button>
            <button 
              type="submit"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex-1 cursor-pointer"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      )}

      {/* SECURITY SUB VIEW */}
      {activeSubView === 'security' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setActiveSubView('list')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7c3aed]">Политика защиты</span>
              <h2 className="text-lg font-black text-gray-950">Параметры безопасности</h2>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Настройте уровень защиты своего личного аккаунта и входа в кабинет.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start gap-2.5">
                <Lock size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold text-gray-900 block">Двухфакторная аутентификация</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Вход по одноразовому PIN-коду из СМС</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={securityForm.twoFactor} 
                onChange={(e) => {
                  setSecurityForm({ ...securityForm, twoFactor: e.target.checked });
                  showToast(e.target.checked ? 'Двухфакторная защита активирована!' : 'Двухфакторная авторизация выключена.');
                }}
                className="accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start gap-2.5">
                <Eye size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold text-gray-900 block">Информировать о сессиях</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Push-уведомление при каждой авторизации</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={securityForm.sessionNotify} 
                onChange={(e) => {
                  setSecurityForm({ ...securityForm, sessionNotify: e.target.checked });
                  showToast('Режим информирования обновлен');
                }}
                className="accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start gap-2.5">
                <Settings size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold text-gray-900 block">Защитный пин-код платежей</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Спрашивать 4-значный код при оплате</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={securityForm.securePinCode} 
                onChange={(e) => {
                  setSecurityForm({ ...securityForm, securePinCode: e.target.checked });
                  showToast(e.target.checked ? 'Пин-код для покупок успешно включен!' : 'Подтверждение пин-кодом выключено.');
                }}
                className="accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => setActiveSubView('list')}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition active:scale-95 text-center block"
          >
            Сохранить и вернуться
          </button>
        </div>
      )}

      {/* DEVICES SUB VIEW */}
      {activeSubView === 'devices' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setActiveSubView('list')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7c3aed]">Активные авторизации</span>
              <h2 className="text-lg font-black text-gray-950">Текущие устройства</h2>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-5 leading-relaxed">
            Ниже приведены устройства и браузеры, на которых открыт данный кабинет.
          </p>

          <div className="space-y-3 mb-6">
            <div className="p-3.5 bg-indigo-50/20 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-gray-950 block">Google Chrome (Это устройство)</span>
                <span className="text-[10px] text-indigo-700 font-medium block mt-0.5">Москва, Россия | IP: 192.168.1.45</span>
              </div>
              <span className="text-[9px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                ТЕКУЩИЙ ВХОД
              </span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-900 block">Safari на Apple iPhone 14 Pro</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">Санкт-Петербург, Россия | IP: 185.122.90.11</span>
              </div>
              <button 
                onClick={() => showToast('Сессия на Apple iPhone успешно аннулирована!')}
                className="text-[10px] text-red-600 font-black tracking-wider uppercase border border-red-200 hover:bg-red-50 px-3 py-1 rounded-lg transition cursor-pointer"
              >
                СБРОСИТЬ
              </button>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => setActiveSubView('list')}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition active:scale-95 text-center block"
          >
            Вернуться назад
          </button>
        </div>
      )}

      {/* Render elegant, eye-safe feedback notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--card-bg, #ffffff)',
          color: 'var(--text-color, #1f2937)',
          border: '1px solid var(--border-color, #e5e7eb)',
          padding: '12px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          fontWeight: 600,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }} className="animate-fade-in shadow-xl blur-none">
          <CheckCircle size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
