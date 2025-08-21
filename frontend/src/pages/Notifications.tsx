import React from 'react';
import { Bell, Clock, CheckCircle, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Notifications: React.FC = () => {
  const { state, dispatch } = useApp();

  if (!state.user) {
    return (
      <div className="px-6">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to view notifications</h2>
        </div>
      </div>
    );
  }

  const handleMarkAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bid_outbid': return <TrendingUp className="w-6 h-6 text-red-400" />;
      case 'auction_ending': return <Clock className="w-6 h-6 text-orange-400" />;
      case 'auction_won': return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'auction_lost': return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'payment_received': return <Package className="w-6 h-6 text-blue-400" />;
      case 'withdrawal_completed': return <CheckCircle className="w-6 h-6 text-green-400" />;
      default: return <Bell className="w-6 h-6 text-white/60" />;
    }
  };

  const unreadCount = state.user.notifications.filter(n => !n.read).length;

  return (
    <div className="px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Notifications</h1>
          <div className="flex items-center justify-between">
            <p className="text-white/60">Stay updated with your auction activity</p>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>

        {state.user.notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-12 border border-white/10">
              <Bell className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No notifications yet</h3>
              <p className="text-white/60">We'll notify you about important auction updates</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {state.user.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative backdrop-blur-xl rounded-3xl p-6 border transition-all duration-300 cursor-pointer ${
                  notification.read 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    notification.read ? 'bg-white/5' : 'bg-white/10'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${notification.read ? 'text-white/80' : 'text-white'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60 text-sm">
                          {notification.timestamp.toLocaleDateString()}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`${notification.read ? 'text-white/60' : 'text-white/80'} mb-3`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-xs">
                        {notification.timestamp.toLocaleTimeString()}
                      </span>
                      
                      {notification.actionUrl && (
                        <button className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
                          View Details →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {!notification.read && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                state.user?.notifications.forEach(notification => {
                  if (!notification.read) {
                    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
                  }
                });
              }}
              className="relative group px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-white/10 transition-all duration-300"></div>
              <span className="relative text-white">Mark All as Read</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;