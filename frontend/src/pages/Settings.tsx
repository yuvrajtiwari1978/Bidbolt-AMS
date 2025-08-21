import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Globe, Moon, Sun, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Settings: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });

  if (!state.user) {
    return (
      <div className="px-6">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to access settings</h2>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  return (
    <div className="px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Settings</h1>
          <p className="text-white/60">Manage your account preferences and security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <img
                        src={state.user.avatar}
                        alt={state.user.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                          Change Photo
                        </button>
                        <p className="text-white/60 text-sm mt-2">JPG, PNG or GIF. Max size 2MB</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={state.user.name}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={state.user.email}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Location</label>
                        <input
                          type="text"
                          placeholder="City, Country"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Bio</label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Auction Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Bell className="w-5 h-5 text-white/60" />
                            <div>
                              <p className="text-white">Outbid alerts</p>
                              <p className="text-white/60 text-sm">Get notified when someone outbids you</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.email}
                            onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                            className="w-5 h-5 text-purple-500 bg-white/5 border border-white/20 rounded focus:ring-purple-400/50"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="w-5 h-5 text-white/60" />
                            <div>
                              <p className="text-white">Push notifications</p>
                              <p className="text-white/60 text-sm">Receive push notifications on your device</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.push}
                            onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                            className="w-5 h-5 text-purple-500 bg-white/5 border border-white/20 rounded focus:ring-purple-400/50"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Marketing</h3>
                      <label className="flex items-center justify-between">
                        <div>
                          <p className="text-white">Marketing emails</p>
                          <p className="text-white/60 text-sm">Receive updates about new features and promotions</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.marketing}
                          onChange={(e) => setNotifications(prev => ({ ...prev, marketing: e.target.checked }))}
                          className="w-5 h-5 text-purple-500 bg-white/5 border border-white/20 rounded focus:ring-purple-400/50"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-semibold mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                          />
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <p className="text-white">Enable 2FA</p>
                          <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600 transition-all duration-300">
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Payment Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-semibold mb-4">Payment Methods</h3>
                      <div className="space-y-4">
                        {state.user.wallet.paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <CreditCard className="w-6 h-6 text-white/60" />
                              <div>
                                <p className="text-white">{method.brand} •••• {method.last4}</p>
                                <p className="text-white/60 text-sm">{method.isDefault ? 'Default' : 'Secondary'}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-all duration-300">
                                Edit
                              </button>
                              <button className="px-3 py-1 bg-red-500/20 rounded-lg text-red-400 text-sm hover:bg-red-500/30 transition-all duration-300">
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                        <button className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-white/60 hover:border-white/40 hover:text-white transition-all duration-300">
                          + Add Payment Method
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-semibold mb-4">Appearance</h3>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center space-x-3">
                          {darkMode ? <Moon className="w-5 h-5 text-white/60" /> : <Sun className="w-5 h-5 text-white/60" />}
                          <div>
                            <p className="text-white">Dark Mode</p>
                            <p className="text-white/60 text-sm">Use dark theme across the platform</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={(e) => setDarkMode(e.target.checked)}
                          className="w-5 h-5 text-purple-500 bg-white/5 border border-white/20 rounded focus:ring-purple-400/50"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-4">Language & Region</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Language</label>
                          <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Currency</label>
                          <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                            <option>JPY (¥)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;