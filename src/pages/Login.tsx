import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Lock, ArrowRight, MapPin } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginProps {
  setCurrentUser: (user: UserType) => void;
}

export default function Login({ setCurrentUser }: LoginProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      const users: UserType[] = JSON.parse(localStorage.getItem('al_hurumah_users') || '[]');

      if (isRegistering) {
        // Sign Up
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          throw new Error('User with this email already exists.');
        }

        const newUser: UserType = {
          email,
          name,
          password, // In a real app, never store plain text passwords
          address,
          phone
        };

        users.push(newUser);
        localStorage.setItem('al_hurumah_users', JSON.stringify(users));

        setSuccess('Registration successful! You are now signed in.');
        setCurrentUser(newUser);
        navigate('/profile');
      } else {
        // Sign In
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          throw new Error('Invalid email or password. Please make sure you have signed up first.');
        }

        setCurrentUser(user);
        navigate('/profile');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setError('Password reset functionality is coming soon. Please contact support if you need immediate assistance.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-black/5"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold">{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-black/40 mt-2">Access your orders and profile</p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-500 text-xs rounded-xl border border-red-100 flex flex-col items-center gap-2">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-600 text-xs rounded-xl border border-green-100">
              {success}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <input 
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Phone Number</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <input 
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-11 pr-4 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <input 
                    required
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House no, Road no, Area"
                    className="w-full pl-11 pr-4 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
              </div>
            </>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full pl-11 pr-4 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Password</label>
              {!isRegistering && (
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] font-black uppercase tracking-widest text-black/20 hover:text-black transition-colors"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-black/90 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setSuccess('');
            }}
            className="text-xs font-bold text-black/40 hover:text-black transition-colors"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
