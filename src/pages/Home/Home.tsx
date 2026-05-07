import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useDispatch();
  const cartItems = useSelector<RootState, CartItem[]>((state) => state.cart.items);

  const filteredProducts = useMemo(() => {
    return filterProducts(PRODUCTS, searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory]);

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
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
        
        <div className={styles.content}>
          <h2 className={styles.pageTitle}>Уникальные товары ручной работы</h2>
          <div className={styles.productsGrid}>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onClick={setSelectedProduct}
              />
            ))}
          </div>
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
