import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import AuctionDetail from './pages/AuctionDetail';
import Create from './pages/Create';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Watchlist from './pages/Watchlist';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="auction/:id" element={<AuctionDetail />} />
            <Route path="create" element={<Create />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
          },
        }}
      />
    </AppProvider>
  );
}

export default App;