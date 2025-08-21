import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, Heart, ShoppingBag, Zap, Home, Compass, Plus, ChevronDown, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SplineBackground from './SplineBackground';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useApp();
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '📱', count: '2.3k' },
    { id: 'fashion', name: 'Fashion', icon: '👕', count: '1.8k' },
    { id: 'collectibles', name: 'Collectibles', icon: '🎨', count: '956' },
    { id: 'sports', name: 'Sports', icon: '⚽', count: '1.2k' },
    { id: 'automotive', name: 'Automotive', icon: '🚗', count: '567' },
    { id: 'home', name: 'Home', icon: '🏠', count: '890' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery });
    navigate('/explore');
  };

  const handleCategorySelect = (categoryId: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: categoryId });
    setShowCategories(false);
    navigate('/explore');
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/explore') return 'explore';
    if (path === '/create') return 'create';
    if (path === '/profile') return 'profile';
    if (path === '/wallet') return 'wallet';
    return 'home';
  };

  const unreadNotifications = state.user?.notifications?.filter(n => !n.read).length || 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Spline 3D Background */}
      <SplineBackground />

      {/* Header */}
      <header className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl p-4 border border-white/20 shadow-2xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-teal-500/30 blur-xl"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    BidBolt
                  </h1>
                  <p className="text-xs text-white/60">Premium Auctions</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-2xl blur group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative">
                    <Search className="w-5 h-5 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
                    <input 
                      type="text" 
                      placeholder="Search premium auctions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-80 pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm transition-all duration-300"
                    />
                  </div>
                </form>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/notifications')}
                  className="relative group p-3 rounded-2xl backdrop-blur-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-all duration-300"></div>
                  <Bell className="w-5 h-5 text-white relative z-10" />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{unreadNotifications}</span>
                    </div>
                  )}
                </button>
                
                <button 
                  onClick={() => navigate('/watchlist')}
                  className="relative group p-3 rounded-2xl backdrop-blur-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-all duration-300"></div>
                  <Heart className="w-5 h-5 text-white relative z-10" />
                  {state.watchlist.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{state.watchlist.length}</span>
                    </div>
                  )}
                </button>
                
                <button 
                  onClick={() => navigate('/wallet')}
                  className="relative group p-3 rounded-2xl backdrop-blur-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-all duration-300"></div>
                  <Wallet className="w-5 h-5 text-white relative z-10" />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="bg-black/90 backdrop-blur-xl text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                      ${state.user?.wallet.balance.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/profile')}
                  className="relative group p-3 rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur group-hover:blur-md transition-all duration-300"></div>
                  <User className="w-5 h-5 text-white relative z-10" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Dropdown */}
      <section className="relative z-40 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="relative group w-full md:w-auto px-8 py-4 rounded-3xl font-medium transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/20 rounded-3xl group-hover:from-white/20 group-hover:via-white/10 group-hover:to-white/20 backdrop-blur-xl transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative flex items-center justify-between md:justify-start space-x-3">
                <span className="text-white font-semibold">Browse Categories</span>
                <ChevronDown className={`w-5 h-5 text-white transition-all duration-500 ${showCategories ? 'rotate-180 scale-110' : ''}`} />
              </div>
            </button>

            <div className={`absolute top-full left-0 right-0 md:right-auto md:w-[500px] mt-4 transition-all duration-700 ease-out ${
              showCategories 
                ? 'opacity-100 translate-y-0 scale-100 rotate-0' 
                : 'opacity-0 -translate-y-8 scale-90 rotate-3 pointer-events-none'
            }`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-teal-500/30 rounded-3xl blur-2xl"></div>
                <div className="relative backdrop-blur-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className="relative group p-6 rounded-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          transform: showCategories ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
                          transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 100}ms`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl group-hover:from-white/20 group-hover:to-white/10 transition-all duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-teal-500/0 group-hover:from-purple-500/30 group-hover:via-blue-500/20 group-hover:to-teal-500/30 rounded-2xl blur transition-all duration-500"></div>
                        <div className="relative text-center">
                          <div className="text-3xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                            {category.icon}
                          </div>
                          <div className="text-white font-semibold text-sm mb-2 group-hover:text-purple-200 transition-colors duration-300">{category.name}</div>
                          <div className="text-white/70 text-xs font-medium bg-white/10 rounded-full px-2 py-1">{category.count} items</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 pb-32">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-teal-500/30 rounded-3xl blur-xl animate-pulse"></div>
          
          <div className="relative backdrop-blur-3xl bg-gradient-to-r from-white/15 via-white/10 to-white/15 rounded-3xl p-3 border border-white/30 shadow-2xl">
            <div className="flex items-center space-x-2">
              {[
                { icon: Home, id: 'home', label: 'Home', path: '/' },
                { icon: Compass, id: 'explore', label: 'Explore', path: '/explore' },
                { icon: Plus, id: 'create', label: 'Create', path: '/create', special: true },
                { icon: Wallet, id: 'wallet', label: 'Wallet', path: '/wallet' },
                { icon: User, id: 'profile', label: 'Profile', path: '/profile' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`relative group p-3 rounded-2xl transition-all duration-300 ${
                    item.special ? 'mx-2' : ''
                  }`}
                >
                  {getActiveTab() === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-2xl shadow-lg"></div>
                  )}
                  
                  {item.special && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-2xl group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-teal-600 transition-all duration-300 shadow-lg"></div>
                  )}
                  
                  {!item.special && (
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-2xl transition-all duration-300"></div>
                  )}
                  
                  <item.icon className={`w-6 h-6 relative z-10 transition-all duration-300 ${
                    getActiveTab() === item.id || item.special 
                      ? 'text-white scale-110' 
                      : 'text-white/70 group-hover:text-white group-hover:scale-105'
                  }`} />
                  
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="bg-black/90 backdrop-blur-xl text-white text-xs px-3 py-2 rounded-xl whitespace-nowrap border border-white/20">
                      {item.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;