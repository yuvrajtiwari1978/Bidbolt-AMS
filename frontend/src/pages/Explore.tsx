import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Grid, List, Eye, Heart, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('ending_soon');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCondition, setSelectedCondition] = useState('');

  const filteredAuctions = useMemo(() => {
    let filtered = [...state.auctions];

    // Filter by search query
    if (state.searchQuery) {
      filtered = filtered.filter(auction =>
        auction.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        auction.description.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (state.selectedCategory) {
      filtered = filtered.filter(auction =>
        auction.category.toLowerCase() === state.selectedCategory.toLowerCase()
      );
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(auction => auction.currentBid >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(auction => auction.currentBid <= parseInt(priceRange.max));
    }

    // Filter by condition
    if (selectedCondition) {
      filtered = filtered.filter(auction => auction.condition === selectedCondition);
    }

    // Sort auctions
    switch (sortBy) {
      case 'ending_soon':
        filtered.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
        break;
      case 'price_low':
        filtered.sort((a, b) => a.currentBid - b.currentBid);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.currentBid - a.currentBid);
        break;
      case 'most_watched':
        filtered.sort((a, b) => b.watchers - a.watchers);
        break;
      case 'most_bids':
        filtered.sort((a, b) => b.bidCount - a.bidCount);
        break;
    }

    return filtered;
  }, [state.auctions, state.searchQuery, state.selectedCategory, priceRange, selectedCondition, sortBy]);

  const handleWatchlist = (auctionId: string) => {
    if (state.watchlist.includes(auctionId)) {
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: auctionId });
    } else {
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: auctionId });
    }
  };

  const clearFilters = () => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: '' });
    setPriceRange({ min: '', max: '' });
    setSelectedCondition('');
    setSortBy('ending_soon');
  };

  return (
    <div className="px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Auctions</h1>
          <p className="text-white/60">Discover amazing items from sellers worldwide</p>
        </div>

        {/* Filters and Controls */}
        <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sort and View Controls */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              >
                <option value="ending_soon">Ending Soon</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="most_watched">Most Watched</option>
                <option value="most_bids">Most Bids</option>
              </select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 flex-1">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
                <span className="text-white/60">-</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>

              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              >
                <option value="">All Conditions</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>

            <div className="text-white/60 text-sm">
              {filteredAuctions.length} auctions found
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredAuctions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No auctions found</h3>
            <p className="text-white/60 mb-6">Try adjusting your search criteria</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'space-y-6'
          }>
            {filteredAuctions.map((auction, index) => (
              <div key={auction.id} className={`relative group ${
                viewMode === 'list' ? 'flex' : ''
              }`} style={{ animationDelay: `${index * 50}ms` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className={`relative backdrop-blur-2xl bg-white/10 rounded-3xl overflow-hidden border border-white/20 group-hover:border-white/30 transition-all duration-300 ${
                  viewMode === 'list' ? 'flex w-full' : ''
                }`}>
                  <div className={`relative overflow-hidden cursor-pointer ${
                    viewMode === 'list' ? 'w-48 flex-shrink-0' : ''
                  }`} onClick={() => navigate(`/auction/${auction.id}`)}>
                    <img 
                      src={auction.image} 
                      alt={auction.title}
                      className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                        viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 right-4 backdrop-blur-md bg-black/30 rounded-xl px-3 py-1 flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">{auction.watchers}</span>
                    </div>
                  </div>
                  
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                          {auction.category}
                        </span>
                        <span className="text-xs text-white/60">{auction.condition}</span>
                      </div>
                      
                      <h3 className="text-white font-semibold text-lg mb-2 cursor-pointer hover:text-purple-300 transition-colors" onClick={() => navigate(`/auction/${auction.id}`)}>
                        {auction.title}
                      </h3>
                      
                      {viewMode === 'list' && (
                        <p className="text-white/60 text-sm mb-4 line-clamp-2">{auction.description}</p>
                      )}
                    </div>
                    
                    <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                      <div className={`${viewMode === 'list' ? 'flex items-center space-x-6' : 'flex justify-between items-center mb-6'}`}>
                        <div>
                          <p className="text-white/60 text-sm">Current Bid</p>
                          <p className="text-white text-xl font-bold">₹{auction.currentBid.toLocaleString()}</p>
                        </div>
                        <div className={viewMode === 'list' ? '' : 'text-right'}>
                          <p className="text-white/60 text-sm">Time Left</p>
                          <p className="text-orange-400 font-semibold flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {auction.timeLeft}
                          </p>
                        </div>
                        {viewMode === 'list' && (
                          <div>
                            <p className="text-white/60 text-sm">Bids</p>
                            <p className="text-white font-semibold">{auction.bidCount}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className={`flex space-x-3 ${viewMode === 'list' ? 'ml-6' : ''}`}>
                        <button 
                          onClick={() => navigate(`/auction/${auction.id}`)}
                          className="relative group flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300"></div>
                          <span className="relative text-white">Place Bid</span>
                        </button>
                        <button 
                          onClick={() => navigate(`/auction/${auction.id}?buyNow=true`)}
                          className="relative group flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300"></div>
                          <span className="relative text-white text-sm">Buy Now ₹{(auction.currentBid * 2).toLocaleString()}</span>
                        </button>
                        <button 
                          onClick={() => handleWatchlist(auction.id)}
                          className="relative group p-3 rounded-xl transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 transition-all duration-300"></div>
                          <Heart className={`w-5 h-5 relative z-10 transition-colors ${
                            state.watchlist.includes(auction.id) ? 'text-red-400 fill-current' : 'text-white'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;