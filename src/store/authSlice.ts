import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    toggleRole: (state) => {
      if (state.user) {
        if (state.user.role === 'member') {
          state.user.role = 'master';
          state.user.name = 'Мастер Александр';
        } else if (state.user.role === 'master') {
          state.user.role = 'admin';
          state.user.name = 'Администратор (Главный)';
        } else {
          state.user.role = 'member';
          state.user.name = 'Александр (Покупатель)';
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
});

export const { setUser, toggleRole, logout } = authSlice.actions;
export default authSlice.reducer;
