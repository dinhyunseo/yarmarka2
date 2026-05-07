import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    cart: cartReducer,
    products: productsReducer,
    auth: authReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
