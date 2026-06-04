import React, { useState, useMemo } from 'react';
import { Package, DollarSign, Users, TrendingUp, Plus, Edit2, Trash2, X, Check, Image, Sparkles, AlertCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { addProduct, updateProduct, removeProduct } from '../../../store/productsSlice';
import { CATEGORIES } from '../../../utils/constants';
import { type Product } from '../../../types';
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

const CATEGORY_LABELS: Record<string, string> = {
  jewelry: '💍 Бижутерия',
  clothing: 'shirt Одежда и обувь',
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
                  className="p-2 border border-blue-150 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                  onClick={() => handleOpenEditModal(product)}
                  title="Редактировать товар"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className="p-2 border border-red-150 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative border border-gray-150 transition-all transform scale-100 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? '📝 Редактировать изделие' : '🛍️ Добавить новое изделие'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-150"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Product Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                  Название изделия <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Например: Ваза 'Морское дно'"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                />
              </div>

              {/* Price and Category grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                    Цена (₽) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number"
                    required
                    min="1"
                    placeholder="2500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                    Категория <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      // Suggest the default high quality image of matching category
                      const correspondingImage = CATEGORY_DEFAULT_IMAGES[e.target.value as keyof typeof CATEGORY_DEFAULT_IMAGES];
                      if (correspondingImage) {
                        setImage(correspondingImage);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                  Описание изделия <span className="text-red-500">*</span>
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Расскажите о материалах, времени работы и душе, заложенной в ваше изделие..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all resize-none"
                />
              </div>

              {/* Image Input and Quick Choice */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                    Ссылка на изображение (URL)
                  </label>
                  <button
                    type="button"
                    onClick={handleApplyDefaultImage}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-transform"
                    title="Применить профессиональный снимок Unsplash"
                  >
                    <Sparkles size={12} /> Проф. фото категории
                  </button>
                </div>
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                />

                {/* Instant preview card */}
                {image && (
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-gray-150 group h-36 w-full">
                    <img
                      src={image}
                      alt="Превью изделия"
                      className="w-full h-full object-cover transition duration-300"
                      onError={(e) => {
                        // fallback if error link
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&h=500&fit=crop';
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-medium flex items-center gap-1">
                        <Image size={12} /> Превью изделия в каталоге
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags checkboxes like NEW and HIT */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
                <div className="text-left">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Настройки показов</span>
                  <span className="text-[11px] text-gray-500">Управляйте ярлыками и навигацией изделия.</span>
                </div>

                <div className="flex gap-6">
                  {/* isNew checkbox label */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-700">🆕 Новинка</span>
                  </label>

                  {/* isPopular checkbox label */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-700">🔥 Популярное</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 font-semibold text-sm text-gray-700 transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 font-semibold text-sm text-white transition shadow-md shadow-indigo-150"
                >
                  {editingProduct ? 'Сохранить изменения' : 'Создать и выставить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
