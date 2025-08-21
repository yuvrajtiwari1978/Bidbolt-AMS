import React, { useState } from 'react';
import { User, Star, Calendar, Package, Heart, MessageCircle, Settings, Edit3, Trophy, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Profile: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  if (!state.user) {
    return (
      <div className="px-6">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'auctions', label: 'My Auctions', icon: Package },
    { id: 'bids', label: 'My Bids', icon: TrendingUp },
    { id: 'watchlist', label: 'Watchlist', icon: Heart },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const stats = [
    { label: 'Auctions Won', value: '23', icon: Trophy },
    { label: 'Items Sold', value: '45', icon: Package },
    { label: 'Total Bids', value: '156', icon: TrendingUp },
    { label: 'Feedback Score', value: '98.5%', icon: Star }
  ];

  return (
    <div className="px-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <img
                src={state.user.avatar}
                alt={state.user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
              />
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                <Edit3 className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{state.user.name}</h1>
              <p className="text-white/60 mb-4">{state.user.email}</p>
              
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(Math.floor(state.user.rating))}
                  </div>
                  <span className="text-white font-semibold">({state.user.rating})</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {state.user.joinDate.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/5 rounded-xl mb-2 mx-auto">
                      <stat.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-white font-bold text-lg">{stat.value}</p>
                    <p className="text-white/60 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Account Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Won auction for MacBook Pro</p>
                        <p className="text-white/60 text-sm">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Placed bid on Vintage Watch</p>
                        <p className="text-white/60 text-sm">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                      Create New Auction
                    </button>
                    <button className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300">
                      View My Watchlist
                    </button>
                    <button className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300">
                      Check Messages
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'auctions' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">My Auctions</h2>
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 mb-4">You haven't created any auctions yet</p>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                  Create Your First Auction
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bids' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">My Bids</h2>
              <div className="text-center py-16">
                <TrendingUp className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 mb-4">You haven't placed any bids yet</p>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                  Explore Auctions
                </button>
              </div>
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">My Watchlist</h2>
              {state.watchlist.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60 mb-4">Your watchlist is empty</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                    Browse Auctions
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {state.auctions
                    .filter(auction => state.watchlist.includes(auction.id))
                    .map(auction => (
                      <div key={auction.id} className="relative backdrop-blur-xl bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                        <img
                          src={auction.image}
                          alt={auction.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-white font-semibold mb-2">{auction.title}</h3>
                          <p className="text-white/60 text-sm mb-2">{auction.timeLeft} left</p>
                          <p className="text-white font-bold">${auction.currentBid.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Messages</h2>
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No messages yet</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={state.user.name}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={state.user.email}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-purple-500 bg-white/5 border border-white/20 rounded" defaultChecked />
                      <span className="text-white">Email notifications for outbid alerts</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-purple-500 bg-white/5 border border-white/20 rounded" defaultChecked />
                      <span className="text-white">SMS notifications for auction endings</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-purple-500 bg-white/5 border border-white/20 rounded" />
                      <span className="text-white">Marketing emails</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;