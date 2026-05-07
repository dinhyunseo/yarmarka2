import  { type Product, type CartItem } from '../types';

// Форматирование цены
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
};

// Генерация уникального ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Проверка на мобильное устройство
export const isMobile = (): boolean => {
  return window.innerWidth <= 768;
};

// Фильтрация продуктов
export const filterProducts = (
  products: Product[], 
  searchQuery: string, 
  category: string
): Product[] => {
  return products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === 'all' || product.category === category;
    
    return matchesSearch && matchesCategory;
  });
};

// Вычисление итоговой суммы корзины
export const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};
