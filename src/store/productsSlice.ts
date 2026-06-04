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
      // Reset local storage products if any of them contain obsolete custom categories
      const validCategories = ['jewelry', 'clothing', 'home', 'toys', 'art', 'ceramics', 'leather', 'blacksmith'];
      const hasObsoleteCategory = parsed.some(p => !validCategories.includes(p.category));
      if (hasObsoleteCategory) {
        localStorage.setItem('master_products', JSON.stringify(PRODUCTS));
        return PRODUCTS;
      }
      return parsed;
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
