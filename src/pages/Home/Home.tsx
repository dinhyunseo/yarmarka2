import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { addToCart } from '../../store/cartSlice';
import { RootState } from '../../store';
import { Header } from '../../components/layout/Header/Header';
import { Sidebar } from '../../components/layout/Sidebar/Sidebar';
import { ProductCard } from '../../components/ui/ProductCard/ProductCard';
import { ProductModal } from '../../components/ui/ProductModal/ProductModal';
import { CATEGORIES } from '../../utils/constants';
import { filterProducts } from '../../utils/helpers';
import { Product, CartItem } from '../../types';
import { PRODUCTS } from '../../data/products';
import { Cart } from '../../components/ui/Cart/Cart';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'all' | 'new' | 'popular') || 'all';

  const handleTabChange = (tab: 'all' | 'new' | 'popular') => {
    const newParams = new URLSearchParams(searchParams);
    if (tab === 'all') {
      newParams.delete('tab');
    } else {
      newParams.set('tab', tab);
    }
    setSearchParams(newParams);
  };
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useDispatch();
  const cartItems = useSelector<RootState, CartItem[]>((state) => state.cart.items);

  const filteredProducts = useMemo(() => {
    let list = filterProducts(PRODUCTS, searchTerm, selectedCategory);
    if (activeTab === 'new') {
      list = list.filter(p => p.isNew);
    } else if (activeTab === 'popular') {
      list = list.filter(p => p.isPopular);
    }
    return list;
  }, [searchTerm, selectedCategory, activeTab]);

  const navigate = useNavigate();

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    setSelectedProduct(null); // Close modal after adding to cart
    navigate('/'); // Ensure navigation to home page
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsMenuOpen(false); // Close menu on mobile after selection
  };

  return (
    <div className={styles.home}>
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItems={cartItems}
        onCartClick={() => setIsCartOpen(true)}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      
      <main className={styles.main}>
          <Sidebar 
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            onTabSelect={handleTabChange}
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          />
          
          <div className={styles.content}>
            <div className={styles.contentHeader}>
              <h2 className={styles.pageTitle}>Уникальные товары ручной работы</h2>
              <div className={styles.tabs}>
                <button 
                  className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
                  onClick={() => handleTabChange('all')}
                >
                  Все
                </button>
                <button 
                  className={`${styles.tab} ${activeTab === 'new' ? styles.activeTab : ''}`}
                  onClick={() => handleTabChange('new')}
                >
                  <span className={styles.tabIcon}>⚡</span> Новинки
                </button>
                <button 
                  className={`${styles.tab} ${activeTab === 'popular' ? styles.activeTab : ''}`}
                  onClick={() => handleTabChange('popular')}
                >
                  <span className={styles.tabIcon}>🔥</span> Популярное
                </button>
              </div>
            </div>
          
          <motion.div layout className={styles.productsGrid}>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard 
                    product={product}
                    onAddToCart={handleAddToCart}
                    onClick={setSelectedProduct}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
      
      <ProductModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
