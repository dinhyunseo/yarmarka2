import React, { useState, useMemo, useEffect } from 'react';
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

  // Hide global layout header when the creation/editing modal is active to prevent overlap/distraction
  useEffect(() => {
    const header = document.querySelector('header');
    if (isModalOpen) {
      if (header) {
        header.style.transition = 'opacity 0.2s ease, visibility 0.2s';
        header.style.opacity = '0';
        header.style.visibility = 'hidden';
        header.style.pointerEvents = 'none';
      }
    } else {
      if (header) {
        header.style.opacity = '1';
        header.style.visibility = 'visible';
        header.style.pointerEvents = 'auto';
      }
    }
    return () => {
      if (header) {
        header.style.opacity = '1';
        header.style.visibility = 'visible';
        header.style.pointerEvents = 'auto';
      }
    };
  }, [isModalOpen]);

  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('jewelry');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
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
    setImage(''); // Start completely blank for user to upload their own file
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

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImage(reader.result);
            setFeedbackMsg('');
          }
        };
        reader.readAsDataURL(file);
      } else {
        setFeedbackMsg('Пожалуйста, выберите файл с изображением (png, jpg, jpeg)!');
      }
    }
  };

  // Save changes
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !price || !description.trim()) {
      setFeedbackMsg('Пожалуйста, заполните необходимые поля');
      return;
    }

    if (!image) {
      setFeedbackMsg('Пожалуйста, обязательно загрузите файл изображения вашего изделия!');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFeedbackMsg('Пожалуйста, введите корректную цену');
      return;
    }

    const finalImage = image.trim();

    if (editingProduct) {
      // Edit existing - send back to moderation queue upon modifications as per admin rules
      const updated: Product = {
        ...editingProduct,
        title: title.trim(),
        price: priceNum,
        category,
        description: description.trim(),
        image: finalImage,
        isApproved: false, // returns to moderation for review
        author: editingProduct.author
      };
      dispatch(updateProduct(updated));
      showToast('Изделие зарезервировано и отправлено на повторную модерацию!');
    } else {
      // Create new product - always goes directly to admin moderation first
      const maxId = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.id)) : 0;
      const created: Product = {
        id: maxId + 1,
        title: title.trim(),
        price: priceNum,
        category,
        description: description.trim(),
        image: finalImage,
        isNew: false, // will be assigned by Administrator if applicable
        isPopular: false, // will be assigned by Administrator if applicable
        isApproved: false, // needs administrator approval
        author: activeMasterName
      };
      dispatch(addProduct(created));
      showToast('Новое творение добавлено и отправлено администратору на модерацию!');
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
                  <div className="flex gap-2.5 items-center flex-wrap">
                    {product.isApproved === false ? (
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 border border-amber-300/30 px-2.5 py-0.5 rounded-full">
                        ⏳ На модерации
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-300/30 px-2.5 py-0.5 rounded-full">
                        ✓ Опубликован
                      </span>
                    )}
                    {product.isNew && (
                      <span className="text-[9px] font-black tracking-widest uppercase bg-gradient-to-r from-amber-400 to-amber-500 text-white px-1.5 py-0.5 rounded shadow-sm">
                        NEW
                      </span>
                    )}
                    {product.isPopular && (
                      <span className="text-[9px] font-black tracking-widest uppercase bg-gradient-to-r from-rose-500 to-red-600 text-white px-1.5 py-0.5 rounded shadow-sm">
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
                  className="p-2 border border-[var(--border-color)] text-indigo-500 hover:bg-[var(--hover-bg)] rounded-xl transition-colors duration-200 cursor-pointer"
                  onClick={() => handleOpenEditModal(product)}
                  title="Редактировать товар"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className="p-2 border border-[var(--border-color)] text-red-500 hover:bg-red-500/10 rounded-xl transition-colors duration-200 cursor-pointer"
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

      {/* Modern Grand Spacious Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[var(--card-bg)] rounded-[32px] w-full max-w-5xl shadow-2xl relative border border-[var(--border-color)] overflow-hidden flex flex-col max-h-[92vh]"
            >
              
              {/* Header Gradient Accent Accent */}
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 w-full shrink-0" />

              {/* Header Content */}
              <div className="px-6 py-4 md:px-8 md:py-5 border-b border-[var(--border-color)] flex items-center justify-between shrink-0 bg-[var(--bg-color)]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-lg shadow-inner text-indigo-500 font-bold select-none">
                    {editingProduct ? '🖋️' : '✨'}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-[var(--text-color)] tracking-tight">
                      {editingProduct ? 'Редактировать товар на витрине' : 'Добавить новое изделие'}
                    </h3>
                    <p className="text-xs md:text-sm text-[var(--text-color)]/60 font-medium">Заполните поля для мгновенной публикации в вашей лавке</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-[var(--text-color)]/55 hover:text-[var(--text-color)] p-2 hover:bg-[var(--hover-bg)] rounded-full transition-all duration-150 cursor-pointer"
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Grand Multi-Column Workspace */}
              <div className="flex-1 overflow-y-auto lg:grid lg:grid-cols-12 bg-[var(--card-bg)] text-[var(--text-color)] font-sans">
                
                {/* Form column (Left) */}
                <form onSubmit={handleSaveProduct} className="p-6 md:p-8 space-y-5 lg:col-span-7 lg:border-r lg:border-[var(--border-color)] flex flex-col justify-between">
                  <div className="space-y-5">
                    
                    {/* Title Input */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[var(--text-color)]/80 flex items-center gap-2">
                        <Tag size={16} className="text-indigo-500" /> Название изделия <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Например: Кружка 'Лесной мох'"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] text-sm text-[var(--text-color)] bg-[var(--input-bg)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                      />
                    </div>

                    {/* Price and Category side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Price fields */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-[var(--text-color)]/80 flex items-center gap-2">
                          <DollarSign size={16} className="text-emerald-500" /> Стоимость (₽) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="number"
                            required
                            min="1"
                            placeholder="2500"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 rounded-xl border border-[var(--border-color)] text-sm text-[var(--text-color)] bg-[var(--input-bg)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-color)]/40">₽</span>
                        </div>
                      </div>

                      {/* Category Selector */}
                      <div className="space-y-1.5 relative">
                        <label className="text-sm font-semibold text-[var(--text-color)]/80 flex items-center gap-2">
                          <Award size={16} className="text-amber-500" /> Категория <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--border-color)] text-sm text-[var(--text-color)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium text-left cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base select-none">
                              {CATEGORY_DETAILS[category]?.icon || '🏺'}
                            </span>
                            <span className="text-sm font-semibold">{CATEGORY_DETAILS[category]?.name || category}</span>
                          </span>
                          <ChevronDown size={16} className={`text-[var(--text-color)]/40 transition-transform duration-150 ${isCategoryDropdownOpen ? 'transform rotate-180' : ''}`} />
                        </button>

                        {/* Popover list */}
                        {isCategoryDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)} />
                            <div className="absolute left-0 right-0 z-50 mt-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-xl max-h-52 overflow-y-auto p-1.5 divide-y divide-[var(--border-color)]/30">
                              {Object.entries(CATEGORY_DETAILS).map(([catId, catInfo]) => {
                                const isSelected = category === catId;
                                return (
                                  <button
                                    type="button"
                                    key={catId}
                                    onClick={() => {
                                      setCategory(catId);
                                      setIsCategoryDropdownOpen(false);
                                      setImage('');
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-left text-sm transition-colors hover:bg-[var(--hover-bg)] cursor-pointer ${
                                      isSelected ? 'bg-indigo-500/5 text-indigo-500 font-bold' : 'text-[var(--text-color)]/80'
                                    }`}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="text-base">{catInfo.icon}</span>
                                      <span className="font-medium">{catInfo.name}</span>
                                    </span>
                                    {isSelected && <Check size={16} className="text-indigo-500 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>

                    </div>

                    {/* Description text input */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[var(--text-color)]/80 flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" /> Описание творения <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="Расскажите историю создания, какие материалы и тепло души вы заложили в это неповторимое творение..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] text-sm text-[var(--text-color)] bg-[var(--input-bg)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none leading-relaxed font-normal"
                      />
                    </div>

                    {/* Image file upload zone */}
                    <div className="space-y-2.5">
                      <label className="text-sm font-semibold text-[var(--text-color)]/80 flex items-center gap-2">
                        <Image size={16} className="text-rose-500" /> Изображение изделия <span className="text-red-500">*</span>
                      </label>

                      <div 
                        id="gp-file-dropzone"
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => {
                          const fileInput = document.getElementById('gp-file-upload') as HTMLInputElement;
                          fileInput?.click();
                        }}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px] ${
                          isDragActive 
                            ? 'border-indigo-500 bg-indigo-500/5' 
                            : image 
                              ? 'border-emerald-500/30 bg-emerald-500/5' 
                              : 'border-[var(--border-color)] bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] hover:border-indigo-500/60'
                        }`}
                      >
                        <input
                          id="gp-file-upload"
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
                                  setFeedbackMsg('');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />

                        {image ? (
                          <div className="space-y-3 relative w-full flex flex-col items-center">
                            <div className="relative group">
                              <img 
                                src={image} 
                                alt="Загруженное превью" 
                                className="w-28 h-28 object-cover rounded-xl border border-[var(--border-color)] shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImage('');
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white w-6 h-6 rounded-full flex items-center justify-center shadow transition-all cursor-pointer"
                                title="Удалить снимок"
                              >
                                &times;
                              </button>
                            </div>
                            <div className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                              <Check size={14} /> Изображение успешно прикреплено
                            </div>
                            <p className="text-[11px] text-[var(--text-color)]/50">Нажмите на область или перетащите файл, чтобы заменить фото</p>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mx-auto select-none">
                              <Upload size={22} />
                            </div>
                            <div>
                              <p className="text-xs md:text-sm font-bold text-[var(--text-color)]">
                                Перетащите файл сюда или кликните для обзора
                              </p>
                              <p className="text-[11px] text-[var(--text-color)]/55 mt-1">
                                Разрешены форматы PNG, JPG, JPEG. Качественное изображение повышает шансы на одобрение работы!
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>



                  </div>

                  {/* Submit and Cancel layout footer actions */}
                  <div className="pt-5 border-t border-[var(--border-color)] flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] font-semibold text-sm text-[var(--text-color)]/70 hover:text-[var(--text-color)] transition-all duration-150 cursor-pointer"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] font-bold text-sm text-white transition-all duration-150 cursor-pointer active:scale-95 shadow-md hover:shadow-indigo-500/10"
                    >
                      {editingProduct ? 'Сохранить изделие' : 'Опубликовать на ярмарке'}
                    </button>
                  </div>

                </form>

                {/* Live Preview column (Right) */}
                <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-[var(--bg-color)]/60 to-[var(--bg-color)]/20 p-8 flex-col justify-between overflow-y-auto">
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[var(--text-color)]/50 uppercase tracking-widest block select-none">Интерактивный предпросмотр</span>
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-color)]/60 leading-relaxed font-medium">
                      Ниже показана ваша карточка изделия в реальном времени. В таком виде её увидят тысячи покупателей каталога ярмарки.
                    </p>
                  </div>

                  {/* Real-time Simulated Product Card Card */}
                  <div className="my-6 bg-[var(--card-bg)] rounded-[24px] border border-[var(--border-color)] overflow-hidden shadow-lg transition-transform duration-300">
                    <div className="relative aspect-square w-full bg-[var(--hover-bg)] overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt="Превью"
                          className="w-full h-full object-cover transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-6 text-center select-none">
                          <Image size={36} className="text-gray-300 stroke-1.5 mb-2" />
                          <span className="text-xs font-bold text-gray-400">Файл не выбран</span>
                          <span className="text-[10px] text-gray-400 mt-1">Прикрепите фото изделия слева</span>
                        </div>
                      )}
                      
                      {/* Interactive Float metadata tag badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 select-none">
                        <span className="bg-black/55 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                          <span>{CATEGORY_DETAILS[category]?.icon}</span>
                          <span>{CATEGORY_DETAILS[category]?.name || category}</span>
                        </span>
                        
                        <div className="flex gap-1.5">
                          {isNew && (
                            <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm tracking-wider uppercase">
                              NEW
                            </span>
                          )}
                          {isPopular && (
                            <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm tracking-wider uppercase">
                              HIT
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 select-none">Автор: {activeMasterName}</span>
                        <h4 className="text-base font-bold text-[var(--text-color)] truncate mt-1 leading-snug">
                          {title.trim() || 'Потрясающее название изделия...'}
                        </h4>
                      </div>
                      
                      <p className="text-xs text-[var(--text-color)]/70 line-clamp-2 h-8 leading-relaxed">
                        {description.trim() || 'Сюда мгновенно транслируется ваше теплое описание ручной работы...'}
                      </p>

                      <div className="pt-3 border-t border-[var(--border-color)]/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-semibold leading-none">Стоимость изделия</span>
                          <span className="text-lg font-black text-[var(--text-color)] mt-1 block tracking-tight">
                            {price ? (+price).toLocaleString('ru-RU') : '0'} ₽
                          </span>
                        </div>
                        <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-xl select-none">
                          В каталог
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[var(--text-color)]/40 text-center select-none font-medium">
                    Свежие данные синхронизированы с базой данных лавки.
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
