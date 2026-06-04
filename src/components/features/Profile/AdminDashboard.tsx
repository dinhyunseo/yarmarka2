import React, { useState } from 'react';
import { Shield, Users, ShoppingCart, AlertCircle, Trash2, Eye, EyeOff, X, Check, Sparkles, Flame, User as UserIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { RootState } from '../../../store';
import { updateProduct, removeProduct } from '../../../store/productsSlice';
import styles from './ProfileComponents.module.css';

export const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const [activeTab, setActiveTab2] = useState<'moderation' | 'published'>('moderation');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: number; title: string } | null>(null);
  
  // Real-time lookup from the Redux store to keep changes reactive inside the modal preview instantly!
  const currentProduct = selectedProduct ? (products.find(p => p.id === selectedProduct.id) || selectedProduct) : null;
  
  // Separate products by approval status
  const pendingProducts = products.filter(p => p.isApproved === false);
  const approvedProducts = products.filter(p => p.isApproved !== false);

  const stats = [
    { label: 'Опубликовано', value: approvedProducts.length, icon: <ShoppingCart size={24} />, color: '#009688' },
    { label: 'На модерации', value: pendingProducts.length, icon: <AlertCircle size={24} />, color: '#FF9800' },
    { label: 'Мастера ярмарки', value: '42', icon: <Users size={24} />, color: '#00BCD4' },
    { label: 'Выручка лавки', value: '120,450 ₽', icon: <Shield size={24} />, color: '#7E57C2' },
  ];

  const handleCloseModal = () => setSelectedProduct(null);

  // Administrative handlers
  const handleApproveProduct = (product: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    dispatch(updateProduct({
      ...product,
      isApproved: true
    }));
    // If the approved product is selected in preview, update preview state or close
    if (selectedProduct && selectedProduct.id === product.id) {
      setSelectedProduct({ ...selectedProduct, isApproved: true });
    }
  };

  const handleToggleNew = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(updateProduct({
      ...product,
      isNew: !product.isNew
    }));
  };

  const handleTogglePopular = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(updateProduct({
      ...product,
      isPopular: !product.isPopular
    }));
  };

  const handleDeleteProduct = (id: number, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProductToDelete({ id, title });
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h3 className={styles.statLabel}>Панель администратора</h3>
        <button 
          className={`${styles.privacyToggle} ${isPrivacyMode ? styles.privacyToggleActive : ''}`}
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
          title={isPrivacyMode ? 'Показать показатели' : 'Скрыть данные'}
        >
          {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
          <span>{isPrivacyMode ? 'Приватный режим вкл.' : 'Приватный режим выкл.'}</span>
        </button>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={`${styles.statValue} ${isPrivacyMode ? styles.blurredValue : ''}`}>
                {isPrivacyMode ? '••••••' : stat.value}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <section className={`${styles.section} md:col-span-2 flex flex-col justify-between`}>
          <div>
            <h2>Инструкция для администрации</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.6', marginTop: '4px' }}>
              Новые работы мастеров попадают сначала на модерацию. Ознакомьтесь с материалами, качеством снимка и описанием. После подтверждения они мгновенно появятся в общей ленте ярмарки. Вы также можете назначать плашки <strong>«Новинка» (NEW)</strong> или <strong>«ХИТ» (HIT)</strong> для стимуляции продаж самых ярких творений.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Управление мастерами</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '15px', fontSize: '13px' }}>Контроль репутации, квалификации и просмотр портфолио</p>
          <Link to="/masters" className={styles.profileBtn} style={{ display: 'inline-flex', width: '100%', justifyContent: 'center' }}>Открыть список мастеров</Link>
        </section>
      </div>

      {/* Tabs System layout with beautiful visual indicator */}
      <section className={styles.section} style={{ padding: '24px' }}>
        <div className="flex border-b border-gray-100 mb-6">
          <button
            onClick={() => setActiveTab2('moderation')}
            className={`flex items-center gap-2 py-3.5 px-6 font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer relative ${
              activeTab === 'moderation'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>⏳ Очередь модерации</span>
            {pendingProducts.length > 0 ? (
              <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full select-none animate-pulse">
                {pendingProducts.length}
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">0</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab2('published')}
            className={`flex items-center gap-2 py-3.5 px-6 font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === 'published'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>✨ Опубликованный каталог</span>
            <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {approvedProducts.length}
            </span>
          </button>
        </div>

        {/* List render base on Tab active */}
        {activeTab === 'moderation' ? (
          <div>
            {pendingProducts.length === 0 ? (
              <div className="text-center py-16 px-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3">
                <Check className="text-emerald-500 bg-emerald-50 p-2.5 rounded-full" size={48} />
                <h3 className="text-base font-bold text-gray-800">Вся очередь модерации пуста</h3>
                <p className="text-xs text-gray-500 max-w-sm">
                  Все работы мастеров успешно проверены и опубликованы в каталоге! Ожидайте новых пополнений от наших мастеров.
                </p>
              </div>
            ) : (
              <div className={styles.productsList}>
                {pendingProducts.map((product) => (
                  <div key={product.id} className={`${styles.productRow} flex items-center justify-between p-4 bg-gray-50/40 hover:bg-gray-50/80 rounded-2xl border border-gray-100 transition-all gap-4`}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img src={product.image} alt={product.title} className={`${styles.productImage} w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900 truncate">{product.title}</h3>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Ожидает проверки
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 lines-clamp-1 truncate">
                          Автор: <span className="font-semibold text-gray-700">{product.author}</span> | Категория: <span className="font-semibold text-gray-700">{product.category}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1 truncate italic">
                          "{product.description}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                      <div className="text-right mr-2">
                        <span className="text-[10px] font-semibold text-gray-400 block">Стоимость</span>
                        <span className="text-sm font-black text-gray-900 block">{product.price.toLocaleString('ru-RU')} ₽</span>
                      </div>

                      {/* Quick action buttons for administrators */}
                      <button 
                        onClick={(e) => handleApproveProduct(product, e)}
                        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:shadow-lg active:scale-95 cursor-pointer"
                        title="Одобрить и опубликовать"
                      >
                        <Check size={14} />
                        <span>Выпустить</span>
                      </button>

                      <button 
                        className={styles.viewBtn} 
                        title="Подробнее"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye size={18} />
                      </button>

                      <button 
                        className={styles.deleteBtn} 
                        title="Отклонить / Удалить с концами"
                        onClick={(e) => handleDeleteProduct(product.id, product.title, e)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {approvedProducts.length === 0 ? (
              <div className="text-center py-16 px-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3">
                <AlertCircle className="text-gray-300" size={40} />
                <h3 className="text-base font-bold text-gray-800">Нет опубликованных работ</h3>
                <p className="text-xs text-gray-500 max-w-sm">
                  В настоящее время на ярмарке не выставлено узаконенного товара. Одобрите работы во вкладке "Очередь модерации".
                </p>
              </div>
            ) : (
              <div className={styles.productsList}>
                {approvedProducts.map((product) => (
                  <div key={product.id} className={`${styles.productRow} flex items-center justify-between p-4 bg-gray-50/40 hover:bg-gray-50/80 rounded-2xl border border-gray-100 transition-all gap-4`}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img src={product.image} alt={product.title} className={`${styles.productImage} w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900 truncate">{product.title}</h3>
                          
                          {/* Super high polish interactively toggleable pills for Administrator */}
                          <button
                            onClick={(e) => handleToggleNew(product, e)}
                            className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded cursor-pointer transition-all border ${
                              product.isNew 
                                ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                                : 'bg-gray-100/60 text-gray-400 border-gray-300/40 hover:bg-amber-500/10 hover:text-amber-600'
                            }`}
                            title="Нажмите, чтобы включить/выключить плашку НОВИНКА"
                          >
                            <span className="flex items-center gap-0.5">
                              <Sparkles size={8} /> NEW
                            </span>
                          </button>
                          
                          <button
                            onClick={(e) => handleTogglePopular(product, e)}
                            className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded cursor-pointer transition-all border ${
                              product.isPopular 
                                ? 'bg-rose-500 text-white border-rose-600 shadow-sm' 
                                : 'bg-gray-100/60 text-gray-400 border-gray-300/40 hover:bg-rose-500/10 hover:text-rose-600'
                            }`}
                            title="Нажмите, чтобы включить/выключить плашку ХИТ"
                          >
                            <span className="flex items-center gap-0.5">
                              <Flame size={8} /> HIT
                            </span>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Автор: <span className="font-semibold text-gray-700">{product.author}</span> | Категория: <span className="font-semibold text-gray-700">{product.category}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                      <div className="text-right mr-2">
                        <span className="text-[10px] font-semibold text-gray-400 block">Стоимость</span>
                        <span className="text-sm font-black text-gray-900 block">{product.price.toLocaleString('ru-RU')} ₽</span>
                      </div>

                      <button 
                        className={styles.viewBtn} 
                        title="Подробнее"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye size={18} />
                      </button>

                      <button 
                        className={styles.deleteBtn} 
                        title="Отозвать / Скрыть / Удалить"
                        onClick={(e) => handleDeleteProduct(product.id, product.title, e)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Modal for Product Preview with Full Editorial Review Actions inside */}
      <AnimatePresence>
        {selectedProduct && currentProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.modalOverlay} 
            onClick={handleCloseModal}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={styles.modalContent} 
              onClick={e => e.stopPropagation()}
            >
              <button className={styles.closeModal} onClick={handleCloseModal}>
                <X size={24} />
              </button>
              <div className={styles.modalBody}>
                <img src={currentProduct.image} alt={currentProduct.title} className={styles.modalImage} />
                <div className={styles.modalDetails}>
                  <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase self-start mb-3 select-none">
                    Детальное досье изделия
                  </span>
                  <h2 className={styles.modalTitle}>{currentProduct.title}</h2>
                  <div className={styles.modalAuthor}>
                     <UserIcon size={18} />
                     <span>Автор: {currentProduct.author}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Категория: <span className="font-semibold uppercase text-indigo-600">{currentProduct.category}</span>
                  </div>
                  <div className={styles.modalPrice}>{currentProduct.price.toLocaleString('ru-RU')} ₽</div>
                  <p className={styles.modalDesc}>{currentProduct.description}</p>
                  
                  {/* Visual Status Indicator in modal */}
                  <div className="my-3 p-3 bg-gray-50 rounded-xl border border-gray-100Box">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Статус публикации:</span>
                    {currentProduct.isApproved === false ? (
                      <span className="text-xs font-semibold text-amber-600 inline-flex items-center gap-1">
                        ⏳ Находится в очереди модерации
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
                        ✓ Опубликован на главной странице ярмарки
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }} className="pt-4 border-t border-gray-100 flex-wrap sm:flex-nowrap">
                    {currentProduct.isApproved === false ? (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleApproveProduct(currentProduct)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex-1 flex items-center justify-center gap-2 transition duration-150 cursor-pointer"
                      >
                        <Check size={16} /> Одобрить выпуск
                      </motion.button>
                    ) : (
                      <div className="flex gap-2 flex-1 flex-wrap">
                        {/* Interactive Sparkles/NEW button toggle with dynamic animation */}
                        <motion.button 
                          layout
                          whileHover={{ scale: 1.03, y: -0.5 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => handleToggleNew(currentProduct, e)}
                          className={`font-semibold text-xs px-3 py-2.5 rounded-xl flex-1 flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                            currentProduct.isNew 
                              ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/20' 
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50/50 hover:border-amber-200'
                          }`}
                        >
                          <motion.span
                            animate={currentProduct.isNew ? { rotate: [0, 20, -20, 0] } : { rotate: 0 }}
                            transition={{ repeat: currentProduct.isNew ? Infinity : 0, repeatType: 'reverse', duration: 1 }}
                            className="flex items-center shrink-0"
                          >
                            <Sparkles size={14} className={currentProduct.isNew ? 'text-white' : 'text-amber-500'} />
                          </motion.span>
                          <span>NEW: {currentProduct.isNew ? 'Вкл' : 'Выкл'}</span>
                        </motion.button>

                        {/* Interactive Flame/HIT button toggle with pulsing active animation */}
                        <motion.button 
                          layout
                          whileHover={{ scale: 1.03, y: -0.5 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => handleTogglePopular(currentProduct, e)}
                          className={`font-semibold text-xs px-3 py-2.5 rounded-xl flex-1 flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                            currentProduct.isPopular 
                              ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/20' 
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-rose-50/50 hover:border-rose-200'
                          }`}
                        >
                          <motion.span
                            animate={currentProduct.isPopular ? { y: [0, -2, 0] } : { y: 0 }}
                            transition={{ repeat: currentProduct.isPopular ? Infinity : 0, duration: 0.8 }}
                            className="flex items-center shrink-0"
                          >
                            <Flame size={14} className={currentProduct.isPopular ? 'text-white' : 'text-rose-500'} />
                          </motion.span>
                          <span>HIT: {currentProduct.isPopular ? 'Вкл' : 'Выкл'}</span>
                        </motion.button>
                      </div>
                    )}

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDeleteProduct(currentProduct.id, currentProduct.title)}
                      className="border border-red-200 hover:bg-red-50 text-red-600 font-semibold text-sm px-4 py-2.5 rounded-xl max-w-[120px] transition duration-150 cursor-pointer shrink-0"
                      title="Удалить или скрыть творение"
                    >
                      Отклонить
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal for Deletion to avoid window.confirm blocking in iframe */}
      {productToDelete && (
        <div className={styles.modalOverlay} onClick={() => setProductToDelete(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ padding: '24px', maxWidth: '380px' }}>
            <div className="text-center p-2">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">Подтверждение удаления</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Вы действительно хотите отклонить или полностью удалить работу <strong>"{productToDelete.title}"</strong> из лавки? Это действие необратимо.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl text-xs font-semibold hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    dispatch(removeProduct(productToDelete.id));
                    if (selectedProduct && selectedProduct.id === productToDelete.id) {
                      setSelectedProduct(null);
                    }
                    setProductToDelete(null);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
