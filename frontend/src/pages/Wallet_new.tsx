import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Minus, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Wallet as WalletIcon, TrendingUp, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import { walletAPI } from '../services/api';
import LoginButton from '../components/LoginButton';

const Wallet: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [graphBase64, setGraphBase64] = useState<string | null>(null);

  if (!state.user) {
    return (
      <div className="px-6">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to access your wallet</h2>
          <p className="text-white/60 mb-6">Login to manage your funds and payment methods</p>
          <LoginButton size="lg" variant="primary" />
        </div>
      </div>
    );
  }

  if (!state.user.wallet) {
    return (
      <div className="px-6">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Wallet data is not available</h2>
          <p className="text-white/60 mb-6">Please try refreshing or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  const fetchGraph = async () => {
    try {
      const response = await walletAPI.walletVisualization(state.user.wallet.transactions);
      if (response.data.success) {
        setGraphBase64(response.data.graph_base64);
      } else {
        toast.error('Failed to load wallet graph');
      }
    } catch (error) {
      console.error('Error fetching wallet graph:', error);
      toast.error('Error fetching wallet graph');
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [state.user.wallet.transactions]);

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      try {
        const response = await walletAPI.depositFunds(amount);
        const { balance, transaction } = response.data.data;

        dispatch({ type: 'UPDATE_WALLET_BALANCE', payload: balance });
        dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

        setDepositAmount('');
        setShowDepositModal(false);
        toast.success(`₹${amount} deposited successfully!`);
      } catch (error) {
        console.error('Failed to deposit funds:', error);
        toast.error('Failed to deposit funds');
      }
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= state.user!.wallet.balance) {
      try {
        const response = await walletAPI.withdrawFunds(amount);
        const { balance, transaction } = response.data.data;

        dispatch({ type: 'UPDATE_WALLET_BALANCE', payload: balance });
        dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

        setWithdrawAmount('');
        setShowWithdrawModal(false);
        toast.success(`₹${amount} withdrawal initiated!`);
      } catch (error) {
        console.error('Failed to withdraw funds:', error);
        toast.error('Failed to withdraw funds');
      }
    } else {
      toast.error('Invalid withdrawal amount');
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
      case 'withdrawal': return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      case 'bid': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'refund': return <ArrowDownLeft className="w-5 h-5 text-yellow-400" />;
      case 'payment': return <ArrowUpRight className="w-5 h-5 text-purple-400" />;
      case 'earning': return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
      default: return <DollarSign className="w-5 h-5 text-white/60" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-white/60" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'payment-methods', label: 'Payment Methods' }
  ];

  return (
    <div className="px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Wallet</h1>
          <p className="text-white/60">Manage your funds and payment methods</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <WalletIcon className="w-8 h-8 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Available</span>
              </div>
              <p className="text-3xl font-bold text-white mb-2">₹{state.user.wallet.balance.toFixed(2)}</p>
              <p className="text-white/60 text-sm">Ready to bid</p>
            </div>
          </div>

          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Pending</span>
              </div>
              <p className="text-3xl font-bold text-white mb-2">₹{state.user.wallet.pendingBalance.toFixed(2)}</p>
              <p className="text-white/60 text-sm">Processing</p>
            </div>
          </div>

          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">Total</span>
              </div>
              <p className="text-3xl font-bold text-white mb-2">₹{(state.user.wallet.balance + state.user.wallet.pendingBalance).toFixed(2)}</p>
              <p className="text-white/60 text-sm">All funds</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 mb-8">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="relative group flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                <Plus className="w-5 h-5 text-white" />
                <span className="text-white">Add Funds</span>
              </div>
            </button>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="relative group flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white/10 border border-white/20 rounded-2xl group-hover:bg-white/20 transition-all duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                <Minus className="w-5 h-5 text-white" />
                <span className="text-white">Withdraw</span>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Wallet Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {state.user.wallet.transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-white/60 text-sm">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <div className="flex items-center justify-end space-x-1">
                            {getStatusIcon(transaction.status)}
                            <span className="text-xs text-white/60 capitalize">{transaction.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    {state.user.wallet.paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                        <CreditCard className="w-8 h-8 text-white/60" />
                        <div className="flex-1">
                          <p className="text-white font-medium">{method.brand} •••• {method.last4}</p>
                          <p className="text-white/60 text-sm">{method.isDefault ? 'Default' : 'Secondary'}</p>
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

          {activeTab === 'transactions' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
              <div className="space-y-4">
                {state.user.wallet.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center space-x-4 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">{transaction.description}</p>
                      <p className="text-white/60 text-sm">{transaction.timestamp.toLocaleString()}</p>
                      {transaction.relatedAuctionId && (
                        <p className="text-purple-400 text-xs">Auction ID: {transaction.relatedAuctionId}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <div className="flex items-center justify-end space-x-2 mt-1">
                        {getStatusIcon(transaction.status)}
                        <span className="text-sm text-white/60 capitalize">{transaction.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payment-methods' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Payment Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {state.user.wallet.paymentMethods.map((method) => (
                  <div key={method.id} className="relative p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <CreditCard className="w-8 h-8 text-white" />
                      {method.isDefault && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Default</span>
                      )}
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">{method.brand}</p>
                    <p className="text-white/60 mb-4">•••• •••• •••• {method.last4}</p>
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 px-4 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-all duration-300">
                        Edit
                      </button>
                      <button className="flex-1 py-2 px-4 bg-red-500/20 rounded-lg text-red-400 text-sm hover:bg-red-500/30 transition-all duration-300">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button className="p-6 border-2 border-dashed border-white/20 rounded-2xl text-white/60 hover:border-white/40 hover:text-white transition-all duration-300 flex flex-col items-center justify-center min-h-[200px]">
                  <Plus className="w-8 h-8 mb-2" />
                  <span>Add New Payment Method</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wallet Balance Graph */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Wallet Balance Over Time</h2>
          {graphBase64 ? (
            <img src={`data:image/png;base64,${graphBase64}`} alt="Wallet Balance Graph" className="w-full h-auto rounded-lg" />
          ) : (
            <p className="text-white/60">Loading graph...</p>
          )}
        </div>

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-6">Add Funds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeposit}
                    disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-6">Withdraw Funds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                    placeholder="0.00"
                    min="1"
                    max={state.user.wallet.balance}
                    step="0.01"
                  />
                  <p className="text-white/60 text-sm mt-1">Available: ₹{state.user.wallet.balance.toFixed(2)}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > state.user.wallet.balance}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
