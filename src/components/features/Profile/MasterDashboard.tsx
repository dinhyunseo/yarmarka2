import React, { useState, useMemo } from 'react';
import { Package, DollarSign, Users, TrendingUp, Plus, Edit2, Trash2, X, Check, Image, Sparkles, AlertCircle, Tag, FileText, Link as LinkIcon, Award, Eye, Sparkle, Upload, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { addProduct, updateProduct, removeProduct } from '../../../store/productsSlice';
import { CATEGORIES } from '../../../utils/constants';
import { type Product } from '../../../types';
import { motion, AnimatePresence } from 'motion/react';
import styles from './ProfileComponents.module.css';

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  jewelry: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop',
  clothing: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=500&fit=crop',
  home: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&h=500&fit=crop',
  toys: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=500&h=500&fit=crop',
  art: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop',
  ceramics: 'https://images.unsplash.com/photo-1612196808214-b9e1d614e380?w=500&h=500&fit=crop',
  leather: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop',
  blacksmith: 'https://images.unsplash.com/photo-1544078751-58fed2b84d57?w=500&h=500&fit=crop'
};

const CATEGORY_DETAILS: Record<string, { icon: string; name: string; desc: string; color: string; bg: string }> = {
  jewelry: { icon: '💍', name: 'Бижутерия', desc: 'Украшения, кольца, серьги', color: 'text-purple-600 border-purple-200', bg: 'bg-purple-50' },
  clothing: { icon: '👕', name: 'Одежда', desc: 'Платья, обувь, аксессуары', color: 'text-blue-600 border-blue-200', bg: 'bg-blue-50' },
  home: { icon: '🏠', name: 'Дом', desc: 'Утварь, текстиль, уют', color: 'text-amber-600 border-amber-200', bg: 'bg-amber-50' },
  toys: { icon: '🧸', name: 'Игрушки', desc: 'Для детей и коллекционеров', color: 'text-rose-600 border-rose-200', bg: 'bg-rose-50' },
  art: { icon: '🎨', name: 'Искусство', desc: 'Живопись, скульптура, панно', color: 'text-emerald-600 border-emerald-200', bg: 'bg-emerald-50' },
  ceramics: { icon: '🏺', name: 'Керамика', desc: 'Глина, посуда, вазы', color: 'text-orange-600 border-orange-200', bg: 'bg-orange-50' },
  leather: { icon: '💼', name: 'Кожа', desc: 'Ремни, сумки, кошельки', color: 'text-stone-700 border-stone-200', bg: 'bg-stone-50' },
  blacksmith: { icon: '🔨', name: 'Кузница', desc: 'Кованые изделия, декор', color: 'text-zinc-700 border-zinc-200', bg: 'bg-zinc-50' }
};

const CATEGORY_LABELS: Record<string, string> = {
  jewelry: '💍 Бижутерия',
  clothing: '👕 Одежда и обувь',
  home: '🏠 Дом и интерьер',
  toys: '🧸 Игрушки и игры',
  art: '🎨 Искусство',
  ceramics: '🏺 Керамика',
  leather: '💼 Кожа и аксессуары',
  blacksmith: '🔨 Кузнечные дела'
};

export const MasterDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const allProducts = useSelector((state: RootState) => state.products.items);

  const activeMasterName = user?.name || 'Мастер Александр';

  // Toggle to show only currently authorized master's items, or all items (useful for testing)
  const [filterMode, setFilterMode] = useState<'mine' | 'all'>('mine');

  // Filtered products
  const masterProducts = useMemo(() => {
    if (filterMode === 'all') {
      return allProducts;
    }
    return allProducts.filter(p => p.author === activeMasterName);
  }, [allProducts, activeMasterName, filterMode]);

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('jewelry');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageSource, setImageSource] = useState<'link' | 'file'>('link');
  const [isNew, setIsNew] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Auto-set stats
  const activeStatsProductsCount = useMemo(() => {
    return allProducts.filter(p => p.author === activeMasterName).length;
  }, [allProducts, activeMasterName]);

  const stats = [
    { label: 'Мои изделия', value: activeStatsProductsCount, icon: <Package size={24} />, color: '#7E57C2' },
    { label: 'Продажи', value: '45 000 ₽', icon: <DollarSign size={24} />, color: '#66BB6A' },
    { label: 'Клиенты', value: '128', icon: <Users size={24} />, color: '#42A5F5' },
    { label: 'Рост за месяц', value: '+15%', icon: <TrendingUp size={24} />, color: '#FFA726' },
  ];

  // Open modal for creation
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setTitle('');
    setPrice('');
    setCategory('jewelry');
    setDescription('');
    setImage(CATEGORY_DEFAULT_IMAGES.jewelry);
    setIsNew(true); // default new products to newly created status
    setIsPopular(false);
    setFeedbackMsg('');
    setIsCategoryDropdownOpen(false);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setPrice(product.price.toString());
    setCategory(product.category);
    setDescription(product.description);
    setImage(product.image);
    setIsNew(!!product.isNew);
    setIsPopular(!!product.isPopular);
    setFeedbackMsg('');
    setIsCategoryDropdownOpen(false);
    setIsModalOpen(true);
  };

  // Quick prefill of high-quality image of the current category
  const handleApplyDefaultImage = () => {
    const defaultImg = CATEGORY_DEFAULT_IMAGES[category as keyof typeof CATEGORY_DEFAULT_IMAGES];
    if (defaultImg) {
      setImage(defaultImg);
    }
  };

  // Save changes
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !price || !description.trim()) {
      setFeedbackMsg('Пожалуйста, заполните необходимые поля');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFeedbackMsg('Пожалуйста, введите корректную цену');
      return;
    }

    const finalImage = image.trim() || CATEGORY_DEFAULT_IMAGES[category as keyof typeof CATEGORY_DEFAULT_IMAGES] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&h=500&fit=crop';

    if (editingProduct) {
      // Edit existing
      const updated: Product = {
        ...editingProduct,
        title: title.trim(),
        price: priceNum,
        category,
        description: description.trim(),
        image: finalImage,
        isNew,
        isPopular,
        // Preserve author
        author: editingProduct.author
      };
      dispatch(updateProduct(updated));
      showToast('Изделие обновлено успешно!');
    } else {
      // Create new product
      const maxId = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.id)) : 0;
      const created: Product = {
        id: maxId + 1,
        title: title.trim(),
        price: priceNum,
        category,
        description: description.trim(),
        image: finalImage,
        isNew,
        isPopular,
        author: activeMasterName
      };
      dispatch(addProduct(created));
      showToast('Изделие добавлено успешно!');
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Вы действительно хотите удалить это изделие?')) {
      dispatch(removeProduct(id));
      showToast('Изделие успешно удалено');
    }
  };

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg('');
    }, 4000);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {feedbackMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 mb-4 animate-fade-in shadow-sm">
          <Check size={18} className="text-emerald-600 shrink-0" />
          <p className="text-sm font-medium">{feedbackMsg}</p>
        </div>
      )}

      {/* Control bar / Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            📦 {filterMode === 'mine' ? 'Моя витрина' : 'Все товары каталога'}
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {masterProducts.length}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {filterMode === 'mine' 
              ? `Управляйте изделиями автора "${activeMasterName}"` 
              : 'Просмотр и редактирование всех изделий в магазине (режим тестирования)'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Toggle filter */}
          <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200">
            <button
              onClick={() => setFilterMode('mine')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cubic-bezier transition-all ${
                filterMode === 'mine' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Только мои
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cubic-bezier transition-all ${
                filterMode === 'all' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Все товары
            </button>
          </div>

          <button className={styles.addBtn} onClick={handleOpenCreateModal}>
            <Plus size={20} />
            <span>Добавить товар</span>
          </button>
        </div>
      </div>

      <div className={styles.productsList}>
        {masterProducts.length === 0 ? (
          <div className="text-center py-16 px-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-4">
            <AlertCircle size={40} className="text-gray-300" />
            <div>
              <h3 className="text-base font-semibold text-gray-800">Нет добавленных изделий</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">
                Вы еще не создали ни одного изделия для витрины от имени <strong>{activeMasterName}</strong>.
              </p>
            </div>
            <button 
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition duration-200 flex items-center gap-2"
              onClick={handleOpenCreateModal}
            >
              <Plus size={16} /> Пополнить витрину
            </button>
          </div>
        ) : (
          masterProducts.map((product) => (
            <div key={product.id} className={styles.productRow}>
              <img src={product.image} alt={product.title} className={styles.productImage} />
              <div className={styles.productInfo}>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
                  <div className="flex gap-1">
                    {product.isNew && (
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-500 text-white px-1.5 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                    {product.isPopular && (
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-red-500 text-white px-1.5 py-0.5 rounded">
                        HIT
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                  <span className="capitalize">{CATEGORY_LABELS[product.category] || product.category}</span>
                  <span>•</span>
                  <span>Автор: {product.author}</span>
                </div>
              </div>
              <div className={styles.productPrice}>{product.price} ₽</div>
              <div className={styles.productStats}>
                <span>45 просмотров</span>
                <span>3 продажи</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  className="p-2 border border-[var(--border-color)] text-indigo-500 hover:bg-[var(--hover-bg)] rounded-xl transition-colors duration-200"
                  onClick={() => handleOpenEditModal(product)}
                  title="Редактировать товар"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className="p-2 border border-[var(--border-color)] text-red-500 hover:bg-red-500/10 rounded-xl transition-colors duration-200"
                  onClick={() => handleDeleteProduct(product.id)}
                  title="Удалить товар"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modern Compact Creation / Editing Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="bg-[var(--card-bg)] rounded-[24px] w-full max-w-lg shadow-2xl relative border border-[var(--border-color)] overflow-hidden flex flex-col max-h-[96vh]"
            >
              
              {/* Header Gradient Accent */}
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 w-full shrink-0" />

              {/* Header Content */}
              <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0 bg-[var(--bg-color)]/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-base shadow-inner text-indigo-500">
                    {editingProduct ? '🖋️' : '✨'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-color)] tracking-tight">
                      {editingProduct ? 'Редактировать товар' : 'Добавить новое изделие'}
                    </h3>
                    <p className="text-[10px] text-[var(--text-color)]/60 font-medium">Заполните поля для мгновенной публикации в каталоге</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-[var(--text-color)]/55 hover:text-[var(--text-color)] p-1.5 hover:bg-[var(--hover-bg)] rounded-full transition-colors duration-150"
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Compact Workspace (without scrolling container constraint unless small heights) */}
              <div className="flex-1 overflow-y-auto bg-[var(--card-bg)] text-[var(--text-color)]">
                
                <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                  
                  {/* Live Compact Horizontal Preview Card */}
                  <div className="bg-gradient-to-r from-indigo-500/5 via-rose-500/5 to-amber-500/5 rounded-2xl p-3 border border-[var(--border-color)] flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-[var(--hover-bg)] border border-[var(--border-color)] overflow-hidden shrink-0">
                      <img
                        src={image || CATEGORY_DEFAULT_IMAGES[category as keyof typeof CATEGORY_DEFAULT_IMAGES]}
                        alt="Превью"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = CATEGORY_DEFAULT_IMAGES[category as keyof typeof CATEGORY_DEFAULT_IMAGES] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&h=500&fit=crop';
                        }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 leading-none">
                        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">
                          {CATEGORY_LABELS[category] || category}
                        </span>
                        {isNew && <span className="text-[8px] bg-amber-500 text-white px-1 py-0.2 rounded font-extrabold uppercase">NEW</span>}
                        {isPopular && <span className="text-[8px] bg-red-500 text-white px-1 py-0.2 rounded font-extrabold uppercase">HIT</span>}
                      </div>
                      <h4 className="text-xs font-bold text-[var(--text-color)] truncate mt-1">
                        {title.trim() || 'Потрясающее название изделия...'}
                      </h4>
                      <p className="text-[10px] text-[var(--text-color)]/50 mt-0.5 truncate leading-none">
                        {description.trim() || 'Ваше теплое описание ручной работы...'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[8px] text-[var(--text-color)]/40 block leading-none">Стоимость</span>
                      <span className="text-sm font-bold text-[var(--text-color)] block mt-0.5">
                        {price ? (+price).toLocaleString('ru-RU') : '0'} ₽
                      </span>
                    </div>
                  </div>

                  {/* Title & Price Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-[var(--text-color)]/60 uppercase tracking-widest flex items-center gap-1">
                        <Tag size={11} className="text-indigo-500" /> Название <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Кружка 'Лесной мох'"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-color)] bg-[var(--input-bg)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all font-medium"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[var(--text-color)]/60 uppercase tracking-widest flex items-center gap-1">
                        Цена (₽) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <input 
                          type="number"
                          required
                          min="1"
                          placeholder="2500"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-3 pr-6 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-color)] bg-[var(--input-bg)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all font-semibold"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--text-color)]/40">₽</span>
                      </div>
                    </div>
                  </div>

                  {/* Category dropdown element */}
                  <div className="space-y-1 relative">
                    <label className="text-[10px] font-bold text-[var(--text-color)]/60 uppercase tracking-widest flex items-center gap-1">
                      <Award size={11} className="text-amber-500" /> Категория <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-color)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium text-left"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm shrink-0 select-none">
                          {CATEGORY_DETAILS[category]?.icon || '🏺'}
                        </span>
                        <span>{CATEGORY_DETAILS[category]?.name || category}</span>
                      </span>
                      <ChevronDown size={14} className={`text-[var(--text-color)]/40 transition-transform duration-150 ${isCategoryDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {/* Popover Dropdown Selection */}
                    {isCategoryDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)} />
                        <div className="absolute left-0 right-0 z-50 mt-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-xl max-h-44 overflow-y-auto p-1 divide-y divide-[var(--border-color)]/30">
                          {Object.entries(CATEGORY_DETAILS).map(([catId, catInfo]) => {
                            const isSelected = category === catId;
                            return (
                              <button
                                type="button"
                                key={catId}
                                onClick={() => {
                                  setCategory(catId);
                                  setIsCategoryDropdownOpen(false);
                                  const correspondImg = CATEGORY_DEFAULT_IMAGES[catId];
                                  if (correspondImg) {
                                    setImage(correspondImg);
                                  }
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors hover:bg-[var(--hover-bg)] ${
                                  isSelected ? 'bg-indigo-500/5 text-indigo-500 font-bold' : 'text-[var(--text-color)]/80'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span>{catInfo.icon}</span>
                                  <span>{catInfo.name}</span>
                                </span>
                                {isSelected && <Check size={14} className="text-indigo-500 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Description input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--text-color)]/60 uppercase tracking-widest flex items-center gap-1">
                      <FileText size={11} className="text-blue-500" /> Описание творения <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      required
                      rows={2}
                      placeholder="Какова история создания этого изделия? Опишите кратко..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-color)] bg-[var(--input-bg)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all resize-none leading-relaxed font-normal"
                    />
                  </div>

                  {/* Combined URL and hidden File Select upload row */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-[var(--text-color)]/60 uppercase tracking-widest flex items-center gap-1">
                        <Image size={11} className="text-rose-500" /> Фотография изделия
                      </label>
                      <button
                        type="button"
                        onClick={handleApplyDefaultImage}
                        className="text-[9px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded transition-transform duration-100"
                      >
                        <Sparkles size={10} /> Стандартный фон
                      </button>
                    </div>

                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        onClick={() => {
                          const fileInput = document.getElementById('compact-file-upload') as HTMLInputElement;
                          fileInput?.click();
                        }}
                        className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] flex items-center justify-center text-[var(--text-color)]/50 hover:text-indigo-500 cursor-pointer shrink-0 transition-colors"
                        title="Загрузить снимок со смартфона или ПК"
                      >
                        <Upload size={15} />
                      </button>
                      <input
                        id="compact-file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setImage(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <input 
                        type="url"
                        placeholder="Вставьте ссылку на Unsplash или Pinterest..."
                        value={image.startsWith('data:image') ? '' : image}
                        onChange={(e) => setImage(e.target.value)}
                        className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-color)] bg-[var(--input-bg)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs transition-all font-medium"
                      />
                    </div>

                    {/* Highly aesthetic material shortcut pills to instantly change images */}
                    <div className="flex flex-wrap gap-1 bg-[var(--bg-color)]/30 p-1.5 rounded-lg border border-[var(--border-color)] mt-1.5">
                      <span className="text-[8px] font-bold text-[var(--text-color)]/40 uppercase tracking-wider block mr-1.5 self-center">Быстрые пресеты:</span>
                      {[
                        { name: '🏺 Керамика', url: 'https://images.unsplash.com/photo-1612196808214-b9e1d614e380?w=500&h=500&fit=crop' },
                        { name: '👜 Кожа', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop' },
                        { name: '🌲 Вяз', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&h=500&fit=crop' },
                        { name: '💍 Сусаль', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop' },
                        { name: '🧶 Холст', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=500&fit=crop' }
                      ].map((preset, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setImage(preset.url)}
                          className="text-[9px] bg-[var(--card-bg)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-[var(--text-color)]/70 hover:bg-[var(--hover-bg)] transition-colors font-medium cursor-pointer"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Elegant low-profile switches placed side-by-side inside form */}
                  <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-3 pb-1">
                    <span className="text-[10px] font-bold text-[var(--text-color)]/50 uppercase tracking-widest">Метки карточки</span>
                    <div className="flex gap-2.5">
                      {/* New Status badge switch */}
                      <button 
                        type="button"
                        onClick={() => setIsNew(!isNew)}
                        className="flex items-center gap-1.5 bg-[var(--bg-color)]/40 border border-[var(--border-color)] px-2.5 py-1 rounded-xl cursor-pointer select-none hover:bg-[var(--hover-bg)] active:scale-95 transition-all text-xs font-semibold text-[var(--text-color)]/80"
                      >
                        <div className={`w-5 h-3 rounded-full p-0.5 transition-colors duration-200 ${isNew ? 'bg-amber-500' : 'bg-gray-300 dark:bg-zinc-700'}`}>
                          <div 
                            className={`w-2 h-2 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${isNew ? 'translate-x-2' : ''}`}
                          />
                        </div>
                        <span className="text-[10px]">🆕 Новинка</span>
                      </button>

                      {/* Hit Status badge switch */}
                      <button 
                        type="button"
                        onClick={() => setIsPopular(!isPopular)}
                        className="flex items-center gap-1.5 bg-[var(--bg-color)]/40 border border-[var(--border-color)] px-2.5 py-1 rounded-xl cursor-pointer select-none hover:bg-[var(--hover-bg)] active:scale-95 transition-all text-xs font-semibold text-[var(--text-color)]/80"
                      >
                        <div className={`w-5 h-3 rounded-full p-0.5 transition-colors duration-200 ${isPopular ? 'bg-red-500' : 'bg-gray-300 dark:bg-zinc-700'}`}>
                          <div 
                            className={`w-2 h-2 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${isPopular ? 'translate-x-2' : ''}`}
                          />
                        </div>
                        <span className="text-[10px]">🔥 ХИТ</span>
                      </button>
                    </div>
                  </div>

                  {/* Layout Action Footer buttons */}
                  <div className="pt-3.5 border-t border-[var(--border-color)] flex items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] font-semibold text-xs text-[var(--text-color)]/70 hover:text-[var(--text-color)] transition duration-200 cursor-pointer"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] font-bold text-xs text-white transition duration-200 cursor-pointer active:scale-95 shadow-md hover:shadow-indigo-500/10"
                    >
                      {editingProduct ? 'Сохранить изделие' : 'Опубликовать'}
                    </button>
                  </div>

                </form>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
