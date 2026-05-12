import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import { Masters } from './pages/Masters/Masters';
import { MasterProfile } from './pages/Masters/MasterProfile';
import { Checkout } from './pages/Checkout/Checkout';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/masters" element={<Masters />} />
          <Route path="/masters/:masterId" element={<MasterProfile />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </Provider>
  );
}
