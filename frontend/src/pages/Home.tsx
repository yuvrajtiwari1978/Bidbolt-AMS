import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Clock, Eye, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const stats = [
    { label: "Active Auctions", value: "12,847", change: "+12.5%" },
    { label: "Total Bids", value: "2.4M", change: "+8.2%" },
    { label: "Success Rate", value: "94.7%", change: "+2.1%" },
    { label: "Avg. Bid Value", value: "₹1,24,700", change: "+15.3%" }
  ];

  const handleWatchlist = (auctionId: string) => {
    if (state.watchlist.includes(auctionId)) {
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: auctionId });
    } else {
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: auctionId });
    }
  };

  const handleBidNow = (auctionId: string) => {
    navigate(`/auction/${auctionId}`);
  };

  return (
    <div className="px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white/80 text-sm">Live Auctions Active</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Premium
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              Auction Platform
            </span>
          </h1>
          
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of bidding with real-time auctions, advanced analytics, and premium collectibles from around the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => navigate('/explore')}
              className="relative group px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur group-hover:blur-md transition-all duration-300"></div>
              <span className="relative text-white">Start Bidding</span>
            </button>
            <button 
              onClick={() => navigate('/explore')}
              className="relative group px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-white/10 backdrop-blur-sm transition-all duration-300"></div>
              <span className="relative text-white">Explore Auctions</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur group-hover:blur-md transition-all duration-300"></div>
                <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm mb-2">{stat.label}</div>
                  <div className="text-green-400 text-xs font-medium">{stat.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Auctions */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Auctions</h2>
          <p className="text-white/60">Discover premium items ending soon</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {state.auctions.slice(0, 3).map((item, index) => (
            <div key={item.id} className="relative group" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl overflow-hidden border border-white/20 group-hover:border-white/30 transition-all duration-300">
                <div className="relative overflow-hidden cursor-pointer" onClick={() => navigate(`/auction/${item.id}`)}>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 backdrop-blur-md bg-black/30 rounded-xl px-3 py-1 flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">{item.watchers}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-4 cursor-pointer hover:text-purple-300 transition-colors" onClick={() => navigate(`/auction/${item.id}`)}>
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-white/60 text-sm">Current Bid</p>
                      <p className="text-white text-xl font-bold">₹{item.currentBid.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">Time Left</p>
                      <p className="text-orange-400 font-semibold">{item.timeLeft}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleBidNow(item.id)}
                      className="relative group flex-1 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300"></div>
                      <span className="relative text-white">Place Bid</span>
                    </button>
                    <button 
                      onClick={() => handleWatchlist(item.id)}
                      className="relative group p-3 rounded-xl transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 transition-all duration-300"></div>
                      <Heart className={`w-5 h-5 relative z-10 transition-colors ${
                        state.watchlist.includes(item.id) ? 'text-red-400 fill-current' : 'text-white'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/explore')}
            className="relative group px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-white/10 backdrop-blur-sm transition-all duration-300"></div>
            <span className="relative text-white">View All Auctions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;