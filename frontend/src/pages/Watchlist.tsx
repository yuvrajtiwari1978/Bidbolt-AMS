import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, Clock, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Watchlist: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const watchedAuctions = state.auctions.filter(auction => 
    state.watchlist.includes(auction.id)
  );

  const handleRemoveFromWatchlist = (auctionId: string) => {
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: auctionId });
  };

  const handleBidNow = (auctionId: string) => {
    navigate(`/auction/${auctionId}`);
  };

  return (
    <div className="px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Watchlist</h1>
          <p className="text-white/60">Keep track of auctions you're interested in</p>
        </div>

        {watchedAuctions.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
              <Heart className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Your watchlist is empty</h3>
              <p className="text-white/60 mb-6">Start adding auctions to keep track of items you're interested in</p>
              <button
                onClick={() => navigate('/explore')}
                className="relative group px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300"></div>
                <span className="relative text-white">Browse Auctions</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Watching</p>
                  <p className="text-3xl font-bold text-white">{watchedAuctions.length}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Ending Soon</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {watchedAuctions.filter(auction => {
                      const timeLeft = auction.timeLeft;
                      return timeLeft.includes('h') && parseInt(timeLeft) < 24;
                    }).length}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Value</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${watchedAuctions.reduce((sum, auction) => sum + auction.currentBid, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Watchlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {watchedAuctions.map((auction, index) => (
                <div key={auction.id} className="relative group" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl overflow-hidden border border-white/20 group-hover:border-white/30 transition-all duration-300">
                    <div className="relative overflow-hidden cursor-pointer" onClick={() => navigate(`/auction/${auction.id}`)}>
                      <img 
                        src={auction.image} 
                        alt={auction.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 right-4 backdrop-blur-md bg-black/30 rounded-xl px-3 py-1 flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-white" />
                        <span className="text-white text-sm">{auction.watchers}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWatchlist(auction.id);
                        }}
                        className="absolute top-4 left-4 backdrop-blur-md bg-black/30 rounded-xl p-2 hover:bg-red-500/50 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                          {auction.category}
                        </span>
                        <span className="text-xs text-white/60">{auction.condition}</span>
                      </div>
                      
                      <h3 className="text-white font-semibold text-lg mb-4 cursor-pointer hover:text-purple-300 transition-colors" onClick={() => navigate(`/auction/${auction.id}`)}>
                        {auction.title}
                      </h3>
                      
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-white/60 text-sm">Current Bid</p>
                          <p className="text-white text-xl font-bold">${auction.currentBid.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-sm">Time Left</p>
                          <p className="text-orange-400 font-semibold flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {auction.timeLeft}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleBidNow(auction.id)}
                          className="flex-1 relative group py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300"></div>
                          <span className="relative text-white">Place Bid</span>
                        </button>
                        <button 
                          onClick={() => handleRemoveFromWatchlist(auction.id)}
                          className="relative group p-3 rounded-xl transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-red-500/20 border border-red-500/30 rounded-xl group-hover:bg-red-500/30 transition-all duration-300"></div>
                          <Heart className="w-5 h-5 relative z-10 text-red-400 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Watchlist;