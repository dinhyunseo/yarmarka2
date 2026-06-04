import React, { useState, useMemo } from 'react';
import { Package, DollarSign, Users, TrendingUp, Plus, Edit2, Trash2, X, Check, Image, Sparkles, AlertCircle, Tag, FileText, Link as LinkIcon, Award, Eye, Sparkle } from 'lucide-react';
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
  const [isNew, setIsNew] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

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

      {/* Modern Creation / Editing Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[var(--card-bg)] rounded-[32px] w-full max-w-5xl shadow-2xl relative border border-[var(--border-color)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              
              {/* Header Gradient Accent */}
              <div className="h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 w-full shrink-0" />

              {/* Header Content */}
              <div className="px-8 py-5 border-b border-[var(--border-color)] flex items-center justify-between shrink-0 bg-[var(--bg-color)]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-xl shadow-inner text-indigo-500">
                    {editingProduct ? '🖋️' : '✨'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-color)] tracking-tight">
                      {editingProduct ? 'Редактировать шедевр' : 'Создание нового изделия'}
                    </h3>
                    <p className="text-xs text-[var(--text-color)]/60 font-medium">После сохранения товар мгновенно появится на вашей витрине и в общем каталоге</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-[var(--text-color)]/55 hover:text-[var(--text-color)] p-2 hover:bg-[var(--hover-bg)] rounded-full transition-colors duration-150"
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable multi-column workspace */}
              <div className="flex-1 overflow-y-auto lg:grid lg:grid-cols-12 bg-[var(--card-bg)] text-[var(--text-color)]">
                
                {/* LEFT COLUMN: Highly tailored visual Inputs Form (col-span-7) */}
                <form onSubmit={handleSaveProduct} className="p-8 space-y-6 lg:col-span-7 border-r border-[var(--border-color)]">
                  
                  {/* Title Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[var(--text-color)]/60 uppercase tracking-widest flex items-center gap-1.5">
                      <Tag size={13} className="text-indigo-500" /> Название изделия <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <input 
                        type="text"
                        required
                        placeholder="Например: Глиняная кружка 'Лесной мох'"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full pl-4 pr-4 py-3 rounded-2xl border border-[var(--border-color)] text-[var(--text-color)] bg-[var(--input-bg)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm transition-all font-medium group-hover:border-[var(--text-color)]/30"
                      />
                    </div>
                  </div>

                  {/* Price Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[var(--text-color)]/60 uppercase tracking-widest flex items-center gap-1.5">
                      <DollarSign size={13} className="text-emerald-500" /> Цена изделия (₽) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <input 
                        type="number"
                        required
                        min="1"
                        placeholder="2500"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 rounded-2xl border border-[var(--border-color)] text-[var(--text-color)] bg-[var(--input-bg)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm transition-all font-semibold group-hover:border-[var(--text-color)]/30"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-color)]/40">₽</span>
                    </div>
                  </div>

                  {/* Decorative / Visual Visual Category Cards Selection instead of ugly select dropdown */}
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-bold text-[var(--text-color)]/60 uppercase tracking-widest flex items-center gap-1.5">
                      <Award size={13} className="text-amber-500" /> Выберите категорию <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {Object.entries(CATEGORY_DETAILS).map(([catId, catInfo]) => {
                        const isSelected = category === catId;
                        return (
                          <motion.button
                            type="button"
                            key={catId}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setCategory(catId);
                              // Auto update placeholder image matching chosen category material texture
                              const correspondImg = CATEGORY_DEFAULT_IMAGES[catId];
                              if (correspondImg) {
                                setImage(correspondImg);
                              }
                            }}
                            className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10 ring-2 ring-[var(--accent-color)]/10' 
                                : 'border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--text-color)]/30'
                            }`}
                          >
                            <span className="text-2xl">{catInfo.icon}</span>
                            <div>
                              <span className={`block text-xs font-bold leading-none ${isSelected ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]'}`}>
                                {catInfo.name}
                              </span>
                              <span className="text-[9px] opacity-60 text-[var(--text-color)] line-clamp-1 mt-0.5 leading-tight">{catInfo.desc}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[var(--text-color)]/60 uppercase tracking-widest flex items-center gap-1.5">
                      <FileText size={13} className="text-blue-500" /> Описание творения <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Какова история создания этого изделия? Какие благородные материалы и инструменты вы использовали? Подарите покупателю чувство уникальности..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-[var(--border-color)] text-[var(--text-color)] bg-[var(--input-bg)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm transition-all resize-none group-hover:border-[var(--text-color)]/30 font-normal leading-relaxed"
                    />
                  </div>

                  {/* Image input and beautiful textures */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[var(--text-color)]/60 uppercase tracking-widest flex items-center gap-1.5">
                        <LinkIcon size={13} className="text-rose-500" /> Изображение изделия (URL)
                      </label>
                      <button
                        type="button"
                        onClick={handleApplyDefaultImage}
                        className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 bg-indigo-500/10 px-3 py-1 rounded-lg transition-transform"
                        title="Применить высококачественный снимок Unsplash"
                      >
                        <Sparkles size={11} className="animate-pulse" /> Сбросить на фото категории
                      </button>
                    </div>

                    <input 
                      type="url"
                      placeholder="Вставьте ссылку на ваше фото с внешнего ресурса (Unsplash, Pinterest, etc.)"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-[var(--border-color)] text-[var(--text-color)] bg-[var(--input-bg)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm transition-all font-medium"
                    />

                    {/* Quick high quality helper material shortcuts to quickly make the image beautiful */}
                    <div>
                      <span className="text-[10px] font-bold text-[var(--text-color)]/40 uppercase tracking-wider block mb-2">Быстрый подбор текстуры материала</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: '🏺 Глина/Глазурь', url: 'https://images.unsplash.com/photo-1612196808214-b9e1d614e380?w=500&h=500&fit=crop' },
                          { name: '👜 Нат. Кожа', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop' },
                          { name: '🌲 Ценный Вяз', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&h=500&fit=crop' },
                          { name: '💍 Серебро/Опал', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop' },
                          { name: '🧶 Лён/Ткань', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=500&fit=crop' }
                        ].map((preset, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setImage(preset.url)}
                            className="text-xs bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-2.5 py-1.5 text-[var(--text-color)]/70 hover:bg-[var(--hover-bg)] transition-colors font-medium cursor-pointer"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Elegant Toggle Switches for New and Hit tags */}
                  <div className="bg-gradient-to-tr from-[var(--bg-color)] to-[var(--hover-bg)] rounded-2xl p-4 border border-[var(--border-color)]">
                    <div className="flex flex-col sm:flex-row gap-5 items-stretch sm:items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[var(--text-color)]/80 uppercase tracking-widest block font-bold leading-none">Настройки показов</span>
                        <span className="text-[10px] text-[var(--text-color)]/50 mt-0.5 block leading-tight">Ярлыки помогают покупателям находить ваши новинки и бестселлеры быстрее</span>
                      </div>

                      <div className="flex gap-4">
                        {/* New status badge toggler */}
                        <div 
                          onClick={() => setIsNew(!isNew)}
                          className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border-color)] px-3 py-2 rounded-xl cursor-pointer select-none hover:bg-indigo-500/10 active:scale-95 transition-all"
                        >
                          <div className={`w-8 h-5 rounded-full p-0.5 transition-colors duration-200 ${isNew ? 'bg-amber-500' : 'bg-[var(--border-color)]'}`}>
                            <motion.div 
                              layout 
                              className="w-4 h-4 rounded-full bg-white shadow-md"
                              animate={{ x: isNew ? 12 : 0 }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[var(--text-color)]/90">🆕 Новинка</span>
                        </div>

                        {/* Popular status badge toggler */}
                        <div 
                          onClick={() => setIsPopular(!isPopular)}
                          className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border-color)] px-3 py-2 rounded-xl cursor-pointer select-none hover:bg-indigo-500/10 active:scale-95 transition-all"
                        >
                          <div className={`w-8 h-5 rounded-full p-0.5 transition-colors duration-200 ${isPopular ? 'bg-red-500' : 'bg-[var(--border-color)]'}`}>
                            <motion.div 
                              layout 
                              className="w-4 h-4 rounded-full bg-white shadow-md"
                              animate={{ x: isPopular ? 12 : 0 }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[var(--text-color)]/90">🔥 Популярное</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] font-bold text-sm text-[var(--text-color)]/80 transition cursor-pointer"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-2xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] font-bold text-sm text-white transition shadow-lg shadow-[var(--accent-color)]/10 cursor-pointer"
                    >
                      {editingProduct ? 'Сохранить изменения' : 'Опубликовать на ярмарке'}
                    </button>
                  </div>
                </form>

                {/* RIGHT COLUMN: Interactive live real-time simulation product preview! (col-span-12 lg:col-span-5) */}
                <div className="p-8 lg:col-span-5 bg-gradient-to-b from-[var(--bg-color)] to-[var(--hover-bg)] flex flex-col justify-between space-y-6">
                  
                  {/* Decorative Banner */}
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-widest flex items-center gap-1.5">
                      <Eye size={12} /> Живой интерактивный просмотр
                    </span>
                    <h4 className="text-sm font-bold text-[var(--text-color)]">Ваша карточка на витрине</h4>
                    <p className="text-xs text-[var(--text-color)]/50">Так ваше предложение будет выглядеть в поисковой ленте покупателей с учетом его параметров.</p>
                  </div>

                  {/* Gorgeous simulated 3D-hover Product Card Mockup */}
                  <motion.div 
                    whileHover={{ y: -6, rotateY: 1 }}
                    className="bg-[var(--card-bg)] rounded-[24px] overflow-hidden shadow-xl border border-[var(--border-color)] flex flex-col transition-all relative w-full max-w-sm mx-auto self-center"
                  >
                    {/* Visual Badges floating */}
                    {(isNew || isPopular) && (
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                        {isNew && (
                          <span className="text-[9px] font-extrabold tracking-wider uppercase bg-amber-500 text-white px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 select-none">
                            <Sparkle size={9} /> NEW
                          </span>
                        )}
                        {isPopular && (
                          <span className="text-[9px] font-extrabold tracking-wider uppercase bg-red-500 text-white px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 select-none">
                            🔥 ХИТ
                          </span>
                        )}
                      </div>
                    )}

                    {/* Image space */}
                    <div className="relative aspect-square w-full bg-[var(--hover-bg)] overflow-hidden">
                      <img
                        src={image || CATEGORY_DEFAULT_IMAGES[category as keyof typeof CATEGORY_DEFAULT_IMAGES]}
                        alt="Предварительный просмотр"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = CATEGORY_DEFAULT_IMAGES[category as keyof typeof CATEGORY_DEFAULT_IMAGES] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&h=500&fit=crop';
                        }}
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Interactive Author Badge */}
                      <div className="absolute bottom-4 left-4 right-4 bg-[var(--card-bg)]/94 backdrop-blur-md rounded-xl p-2.5 border border-[var(--border-color)] flex items-center gap-2 shadow-md">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                          {activeMasterName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="leading-tight">
                          <span className="text-[8px] text-[var(--text-color)]/50 uppercase tracking-wider block font-bold leading-none">Мастер-создатель</span>
                          <span className="text-[11px] font-extrabold text-[var(--text-color)] leading-none">{activeMasterName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content area inside card mockup */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        {/* Selected Category Label */}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-widest mt-0.5">
                          {CATEGORY_DETAILS[category as keyof typeof CATEGORY_DETAILS]?.icon || '🏺'}{' '}
                          {CATEGORY_DETAILS[category as keyof typeof CATEGORY_DETAILS]?.name || category}
                        </div>

                        {/* Real-time title input tracker */}
                        <h3 className="text-base font-bold text-[var(--text-color)] tracking-tight line-clamp-1">
                          {title.trim() || 'Ваше потрясающее название'}
                        </h3>

                        {/* Real-time description quote tracker */}
                        <p className="text-xs text-[var(--text-color)]/60 leading-relaxed font-normal line-clamp-2">
                          {description.trim() || 'Здесь появится красивое теплое описание ручной работы, завлекающее посетителей.'}
                        </p>
                      </div>

                      {/* Card price mock and CTA button row */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                        <div className="leading-none">
                          <span className="text-[9px] text-[var(--text-color)]/55 block pb-1">Цена изделия</span>
                          <span className="text-lg font-bold text-[var(--text-color)] leading-none">
                            {price ? (+price).toLocaleString('ru-RU') : '0'} ₽
                          </span>
                        </div>

                        <div className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-xl text-xs font-bold px-4 py-2 border-0 shadow-md shadow-[var(--accent-color)]/20 transition-all select-none">
                          В корзину
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Extra designer note */}
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-[11px] text-amber-700 dark:text-amber-400 flex gap-2.5 align-top">
                    <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <strong>Совет гильдии мастеров:</strong> Изделия с качественными деталями в описании и четкими профессиональными превью-карточками имеют на 78% больше шансов попасть в избранное покупателей. Позаботьтесь о хорошем освещении!
                    </div>
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
