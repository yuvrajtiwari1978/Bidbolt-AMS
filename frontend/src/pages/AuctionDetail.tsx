import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Eye, Clock, User, MapPin, Truck, Shield, TrendingUp, MessageCircle, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [bidAmount, setBidAmount] = useState('');
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const auction = state.auctions.find(a => a.id === id);

  useEffect(() => {
    if (!auction) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.endTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Auction Ended');
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  if (!auction) {
    return (
      <div className="px-6">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Auction not found</h2>
          <button
            onClick={() => navigate('/explore')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold"
          >
            Browse Auctions
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);
    if (amount > auction.currentBid) {
      dispatch({ type: 'PLACE_BID', payload: { auctionId: auction.id, amount } });
      setBidAmount('');
      // Show success message
    }
  };

  const handleWatchlist = () => {
    if (state.watchlist.includes(auction.id)) {
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: auction.id });
    } else {
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: auction.id });
    }
  };

  const minBid = auction.currentBid + 50; // Minimum bid increment

  return (
    <div className="px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative">
            <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl overflow-hidden border border-white/10">
              <img
                src={auction.image}
                alt={auction.title}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute top-4 left-4 flex space-x-2">
                <div className="backdrop-blur-md bg-black/30 rounded-xl px-3 py-1 flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">{auction.watchers}</span>
                </div>
                <div className="backdrop-blur-md bg-black/30 rounded-xl px-3 py-1">
                  <span className="text-white text-sm">{auction.condition}</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={handleWatchlist}
                  className="backdrop-blur-md bg-black/30 rounded-xl p-2 hover:bg-black/50 transition-all duration-300"
                >
                  <Heart className={`w-5 h-5 transition-colors ${
                    state.watchlist.includes(auction.id) ? 'text-red-400 fill-current' : 'text-white'
                  }`} />
                </button>
                <button className="backdrop-blur-md bg-black/30 rounded-xl p-2 hover:bg-black/50 transition-all duration-300">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">
                  {auction.category}
                </span>
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <Clock className="w-4 h-4" />
                  <span className={timeLeft === 'Auction Ended' ? 'text-red-400' : 'text-orange-400'}>
                    {timeLeft}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">{auction.title}</h1>
              <p className="text-white/70 leading-relaxed">{auction.description}</p>
            </div>

            {/* Current Bid */}
            <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-white/60 text-sm">Current Bid</p>
                  <p className="text-3xl font-bold text-white">₹{auction.currentBid.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">Total Bids</p>
                  <p className="text-xl font-semibold text-white">{auction.bidCount}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-white/60 text-sm">Buy It Now</p>
                <p className="text-xl font-semibold text-green-400">₹{(auction.currentBid * 2).toLocaleString()}</p>
              </div>

              {/* Bid Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">
                    Your Bid (minimum: ${minBid.toLocaleString()})
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minBid}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                    placeholder={`$${minBid.toLocaleString()}`}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handlePlaceBid}
                    disabled={!bidAmount || parseFloat(bidAmount) < minBid}
                    className="flex-1 relative group py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300"></div>
                    <span className="relative text-white">Place Bid</span>
                  </button>
                  
                  {auction.buyNowPrice && (
                    <button className="flex-1 relative group py-3 rounded-xl font-semibold transition-all duration-300">
                      <div className="absolute inset-0 bg-green-500 rounded-xl group-hover:bg-green-600 transition-all duration-300"></div>
                      <span className="relative text-white">Buy Now</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4">Seller Information</h3>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={auction.seller.avatar}
                  alt={auction.seller.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-medium">{auction.seller.name}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.floor(auction.seller.rating))}
                    </div>
                    <span className="text-white/60 text-sm">({auction.seller.rating})</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 py-2 px-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Seller</span>
                </button>
                <button className="py-2 px-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300">
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4">Shipping & Location</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-white/60" />
                  <span className="text-white">{auction.shipping.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-white/60" />
                  <span className="text-white">
                    {auction.shipping.cost === 0 ? 'Free Shipping' : `$${auction.shipping.cost} Shipping`}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-white/60" />
                  <span className="text-white">
                    {auction.shipping.international ? 'Ships Worldwide' : 'Domestic Only'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bid History */}
        <div className="mt-8">
          <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
            <div className="p-6 border-b border-white/10">
              <button
                onClick={() => setShowBidHistory(!showBidHistory)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-white font-semibold">Bid History ({auction.bidCount})</h3>
                <TrendingUp className={`w-5 h-5 text-white transition-transform ${showBidHistory ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {showBidHistory && (
              <div className="p-6">
                <div className="text-center text-white/60 py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Bid history will be displayed here</p>
                  <p className="text-sm mt-2">Recent bids and bidder information</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;