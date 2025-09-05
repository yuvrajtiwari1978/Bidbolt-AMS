import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowLeft, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('Submitting registration data:', formData);
      const response = await authAPI.register(formData);
      console.log('Registration response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      const { token, user } = response.data.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update app state with user data
      dispatch({ type: 'SET_USER', payload: user });
      
      toast.success('Registration successful! Welcome to the platform!');
      navigate('/');
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      const errorMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Registration failed. Please try again.';
      
      if (errorMessage.includes('already exists')) {
        if (errorMessage.includes('email')) {
          setErrors({ email: 'User with this email already exists' });
        } else if (errorMessage.includes('username')) {
          setErrors({ username: 'Username is already taken' });
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-12">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-teal-900/10"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center space-x-3 text-white/60 hover:text-white transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              BidBolt
            </h1>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Join Our
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              Premium Platform
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Experience the future of bidding with real-time auctions, advanced analytics, and premium collectibles from around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Registration Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-teal-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
                  <UserPlus className="w-10 h-10 text-white relative z-10" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Create Account</h3>
                <p className="text-white/60">Join our premium auction platform</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">
                      First Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative">
                        <User className="w-5 h-5 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 bg-white/10 border ${
                            errors.firstName ? 'border-red-400/50' : 'border-white/20'
                          } rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm transition-all duration-300`}
                          placeholder="First name"
                        />
                      </div>
                    </div>
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-2">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">
                      Last Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative">
                        <User className="w-5 h-5 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 bg-white/10 border ${
                            errors.lastName ? 'border-red-400/50' : 'border-white/20'
                          } rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm transition-all duration-300`}
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-2">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative">
                      <User className="w-5 h-5 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 bg-white/10 border ${
                          errors.username ? 'border-red-400/50' : 'border-white/20'
                        } rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm transition-all duration-300`}
                        placeholder="Username"
                      />
                    </div>
                  </div>
                  {errors.username && (
                    <p className="text-red-400 text-sm mt-2">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 bg-white/10 border ${
                          errors.email ? 'border-red-400/50' : 'border-white/20'
                        } rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm transition-all duration-300`}
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 bg-white/10 border ${
                          errors.password ? 'border-red-400/50' : 'border-white/20'
                        } rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm transition-all duration-300`}
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-2">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold transition-all duration-300 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
