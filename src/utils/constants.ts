import { type Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Все категории', icon: '🛍️' },
  { id: 'jewelry', name: 'Бижутерия', icon: '💍' },
  { id: 'clothing', name: 'Одежда и обувь', icon: '👕' },
  { id: 'home', name: 'Дом и интерьер', icon: '🏠' },
  { id: 'toys', name: 'Игрушки и игры', icon: '🧸' },
  { id: 'art', name: 'Искусство', icon: '🎨' },
  { id: 'blacksmith', name: 'Кузнечные дела', icon: '🔨' }
];

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PROFILE: '/profile',
  AUTH: '/auth',
  CART: '/cart'
} as const;
