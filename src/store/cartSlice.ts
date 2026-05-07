import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type CartState, type CartItem, type Product } from '../types';
import { CONFIG } from '../config';
import { calculateTotal } from '../utils/helpers';

const getInitialCart = (): CartItem[] => {
  const savedCart = localStorage.getItem(CONFIG.STORAGE_KEYS.CART);
  return savedCart ? JSON.parse(savedCart) : [];
};

const initialState: CartState = {
  items: getInitialCart(),
  total: 0
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push({ ...action.payload, quantity: 1, cartId: Date.now() });
      }
      state.total = calculateTotal(state.items);
      localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.cartId !== action.payload);
      state.total = calculateTotal(state.items);
      localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.cartId === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = calculateTotal(state.items);
        localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem(CONFIG.STORAGE_KEYS.CART);
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
