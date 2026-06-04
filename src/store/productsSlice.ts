import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Product } from '../types';
import { PRODUCTS } from '../data/products';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const loadProductsFromStorage = (): Product[] => {
  const stored = localStorage.getItem('master_products');
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Product[];
      // Filter out deleted items if they are present in localStorage to keep it fresh
      const filtered = parsed.filter(p => !['Декоративная ваза "Океан"', 'Ремень ручной работы'].includes(p.title));
      if (filtered.length !== parsed.length) {
        localStorage.setItem('master_products', JSON.stringify(filtered));
      }
      return filtered;
    } catch (e) {
      console.error("Failed to parse stored products", e);
    }
  }
  return PRODUCTS;
};

const initialState: ProductsState = {
  items: loadProductsFromStorage(),
  loading: false,
  error: null
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      localStorage.setItem('master_products', JSON.stringify(state.items));
      state.loading = false;
      state.error = null;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
      localStorage.setItem('master_products', JSON.stringify(state.items));
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        localStorage.setItem('master_products', JSON.stringify(state.items));
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(product => product.id !== action.payload);
      localStorage.setItem('master_products', JSON.stringify(state.items));
    }
  }
});

export const { setLoading, setError, setProducts, addProduct, updateProduct, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;
