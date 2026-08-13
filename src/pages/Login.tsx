import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Lock, ArrowRight, MapPin, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../types';
import { supabase } from '../lib/supabase';
import { checkRateLimit, recordAttempt, resetRateLimit } from '../utils/rateLimiter';
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateAddress,
  sanitizeInput
} from '../lib/security';

export default function Login() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate Email & Password with SQL Injection Checks
      const emailCheck = validateEmail(email);
      if (!emailCheck.isValid) {
        throw new Error(emailCheck.error);
      }

      const passwordCheck = validatePassword(password);
      if (!passwordCheck.isValid) {
        throw new Error(passwordCheck.error);
      }

      const cleanEmail = sanitizeInput(email);

      if (isRegistering) {
        // Enforce Signup Rate Limiting (max 3 attempts per 5 mins)
        const signupRate = checkRateLimit(`signup_${cleanEmail}`, 3, 5 * 60 * 1000);
        if (!signupRate.allowed) {
          throw new Error(signupRate.message || 'অত্যধিক চেষ্টার কারণে সাইনআপ কিছুক্ষণের জন্য স্থগিত রাখা হয়েছে।');
        }
        recordAttempt(`signup_${cleanEmail}`, 5 * 60 * 1000);

        // Full Name Validation
        const nameCheck = validateName(name);
        if (!nameCheck.isValid) {
          throw new Error(nameCheck.error);
        }

        // Phone Validation
        const phoneCheck = validatePhone(phone);
        if (!phoneCheck.isValid) {
          throw new Error(phoneCheck.error);
        }

        // Address Validation
        const addressCheck = validateAddress(address);
        if (!addressCheck.isValid) {
          throw new Error(addressCheck.error);
        }

        const cleanName = sanitizeInput(name);
        const cleanPhone = sanitizeInput(phone);
        const cleanAddress = sanitizeInput(address);

        // Sign Up with Supabase
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: cleanName,
              phone: cleanPhone,
              address: cleanAddress
            }
          }
        });

        if (signUpError) {
          if (signUpError.message.includes('User already registered')) {
            throw new Error('এই ইমেইল দিয়ে ইতিমধ্যেই অ্যাকাউন্ট খোলা হয়েছে।');
          }
          throw new Error(signUpError.message);
        }

        if (data.user) {
          // Ensure profile is created in profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              name: cleanName,
              phone: cleanPhone,
              address: cleanAddress,
              email: cleanEmail,
              role: 'customer'
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }

          if (data.session) {
            setSuccess('অ্যাকাউন্ট তৈরি সফল হয়েছে!');
            navigate('/profile');
          } else {
            setSuccess('সফলভাবে রেজিস্ট্রেশন হয়েছে! দয়া করে আপনার ইমেইল চেক করুন।');
            setIsRegistering(false);
          }
        }
        resetRateLimit(`signup_${cleanEmail}`);
      } else {
        // Enforce Login Rate Limiting (max 5 attempts per 2 mins)
        const loginRate = checkRateLimit(`login_${cleanEmail}`, 5, 2 * 60 * 1000);
        if (!loginRate.allowed) {
          throw new Error(loginRate.message || 'অত্যধিক চেষ্টার কারণে লগইন কিছুক্ষণের জন্য স্থগিত রাখা হয়েছে।');
        }
        recordAttempt(`login_${cleanEmail}`, 2 * 60 * 1000);

        // Sign In with Supabase
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (signInError) {
          if (signInError.message === 'Invalid login credentials') {
            throw new Error('ভুল ইমেইল অথবা পাসওয়ার্ড। আবার চেষ্টা করুন।');
          }
          throw new Error(signInError.message);
        }

        resetRateLimit(`login_${cleanEmail}`);

        // AuthContext will handle state update via onAuthStateChange
        navigate('/profile');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
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
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
              <input 
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
