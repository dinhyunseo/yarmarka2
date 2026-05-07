import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Product } from '../types';
import { PRODUCTS } from '../data/products';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: PRODUCTS,
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
      state.loading = false;
      state.error = null;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(product => product.id !== action.payload);
    }
  }
});

export const { setLoading, setError, setProducts, addProduct, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;
