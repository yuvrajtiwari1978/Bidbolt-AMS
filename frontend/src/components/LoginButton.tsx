import React, { useState } from 'react';
import { LogIn, X, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface LoginButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

const LoginButton: React.FC<LoginButtonProps> = ({ 
  size = 'md', 
  variant = 'primary' 
}) => {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600',
    secondary: 'bg-white/10 border border-white/20 hover:bg-white/20'
  };

      const handleLogin = async (e: React.FormEvent) => {
        console.log('Attempting to log in with:', { email, password }); // Log email and password
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authAPI.login({ email, password });
      console.log('API Response:', response); // Log API response
      const { token, user } = response.data.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update app state with user data
      dispatch({ type: 'SET_USER', payload: user });
      
      // Close modal and reset form
      setShowLoginModal(false);
      setEmail('');
      setPassword('');
      
      toast.success('Login successful!');
      
      // Redirect to profile page after successful login
      navigate('/profile');
    } catch (error: unknown) {
      console.error('Login failed:', error);
      const errorMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          console.log('Login button clicked'); // Log button click
          console.log('Opening login modal'); // Log modal opening
          setShowLoginModal(true);
        }}
        className={`relative group rounded-xl font-semibold transition-all duration-300 ${sizeClasses[size]} ${variantClasses[variant]}`}
      >
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur group-hover:blur-md transition-all duration-300"></div>
        )}
        <div className="relative flex items-center space-x-2">
          <LogIn className="w-4 h-4" />
          <span className="text-white">Login</span>
        </div>
      </button>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 max-w-md w-full">
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6 text-center">Login to Your Account</h3>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      console.log('Email updated:', e.target.value); // Log email value
                    }}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate('/register');
                  }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginButton;
