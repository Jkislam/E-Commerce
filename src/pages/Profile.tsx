import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  LogOut, 
  ShoppingBag, 
  ChevronRight, 
  MapPin, 
  Edit3, 
  Camera, 
  User as UserIcon, 
  Phone, 
  X, 
  Save,
  CreditCard,
  Mail,
  Calendar,
  Eye
} from 'lucide-react';
import { User, Order } from '../types';
import { supabase } from '../lib/supabase';

interface ProfileProps {
  currentUser: User | null;
  isAuthLoading: boolean;
  orders: Order[];
  onLogout: () => void;
  onUpdateUser: () => Promise<void>;
}

export default function Profile({ currentUser, isAuthLoading, orders, onLogout, onUpdateUser }: ProfileProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form fields
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editAddress, setEditAddress] = useState(currentUser?.address || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editPhoto, setEditPhoto] = useState(currentUser?.photourl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local states when user loads
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditAddress(currentUser.address || '');
      setEditPhone(currentUser.phone || '');
      setEditPhoto(currentUser.photourl || '');
    }
  }, [currentUser]);

  // Auth Guard
  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, isAuthLoading, navigate]);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality JPEG
      };
    });
  };

  const handlePhotoUploadDirectly = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser || !currentUser.id || isSaving) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("৫ মেগাবাইটের চেয়ে ছোট ছবি আপলোড করুন।");
      return;
    }

    setIsSaving(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressed = await compressImage(reader.result as string);
          setEditPhoto(compressed);
          
          // Update database directly
          const { error } = await supabase.from('profiles').update({
            photourl: compressed,
          }).eq('id', currentUser.id);

          if (error) throw error;

          // Update auth metadata
          const { error: authError } = await supabase.auth.updateUser({
            data: { photourl: compressed }
          });

          if (authError) console.warn('Auth metadata sync failed:', authError.message);

          await onUpdateUser();
        } catch (err: any) {
          console.error('Photo save error:', err);
          alert("ছবি পরিবর্তন করতে সমস্যা হয়েছে: " + (err.message || 'Unknown error'));
        } finally {
          setIsSaving(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Photo upload error:', err);
      setIsSaving(false);
    }
  };

  const handleUpdatePersonalProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.id || isSaving) return;

    setIsSaving(true);
    try {
      // Update profiles table in Supabase
      const { error } = await supabase.from('profiles').update({
        name: editName,
        phone: editPhone,
      }).eq('id', currentUser.id);

      if (error) throw error;

      // Update auth metadata for responsive local state sync
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: editName,
          phone: editPhone
        }
      });

      if (authError) console.warn('Auth metadata sync failed:', authError.message);

      await onUpdateUser();
      setIsEditingProfile(false);
    } catch(err: any) {
      console.error('Update profile error:', err);
      alert("প্রোফাইল আপডেট করতে সমস্যা হয়েছে: " + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateAddressBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.id || isSaving) return;

    setIsSaving(true);
    try {
      // Update profiles table in Supabase
      const { error } = await supabase.from('profiles').update({
        address: editAddress,
      }).eq('id', currentUser.id);

      if (error) throw error;

      // Update auth metadata for responsive local state sync
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          address: editAddress,
        }
      });

      if (authError) console.warn('Auth metadata sync failed:', authError.message);

      await onUpdateUser();
      setIsEditingAddress(false);
    } catch(err: any) {
      console.error('Update address error:', err);
      alert("ঠিকানা আপডেট করতে সমস্যা হয়েছে: " + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f4f4f7]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#f57224]/10 border-t-[#f57224] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Filter orders to show user specific ones and sort by date (newest first)
  const userOrders = orders
    .filter(order => order.customeremail === currentUser.email)
    .sort((a, b) => new Date(b.createdat).getTime() - new Date(a.createdat).getTime());

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'Processing': return <Package className="w-3.5 h-3.5 text-blue-500" />;
      case 'Shipped': return <Truck className="w-3.5 h-3.5 text-[#f57224]" />;
      case 'Delivered': return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
      case 'Cancelled': return <XCircle className="w-3.5 h-3.5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Shipped': return 'bg-orange-50 text-[#f57224] border-orange-100';
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f7] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb path like Daraz */}
        <div className="text-xs text-black/40 mb-6 flex items-center gap-1 font-bold tracking-tight">
          <span className="hover:text-[#f57224] cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black/80 font-black">My Account</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT SIDEBAR (Daraz Account Menu) */}
          <div className="w-full lg:w-64 shrink-0 space-y-4">
            
            {/* Greeting Card */}
            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm flex items-center gap-4">
              <div className="relative group">
                <div className="w-14 h-14 bg-gradient-to-tr from-[#f57224] to-[#ff8f50] text-white rounded-full flex items-center justify-center text-xl font-black shadow-md overflow-hidden border border-white relative">
                  {currentUser.photourl ? (
                    <img src={currentUser.photourl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name[0].toUpperCase()
                  )}
                  {isSaving && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-black/5 shadow-md flex items-center justify-center text-black hover:bg-[#f57224] hover:text-white transition-all animate-pulse-slow"
                  title="Upload avatar"
                  disabled={isSaving}
                >
                  <Camera className="w-3 h-3" />
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUploadDirectly}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">Hello,</p>
                <p className="text-sm font-black text-black truncate leading-snug">{currentUser.name}</p>
              </div>
            </div>

            {/* Sidebar Navigation Options */}
            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-6">
              
              {/* Category Group 1 */}
              <div>
                <p className="text-xs font-black text-black uppercase tracking-wider mb-3">Manage My Account</p>
                <div className="space-y-2.5 pl-3 border-l border-black/5">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left text-xs font-bold block transition-colors ${activeTab === 'profile' ? 'text-[#f57224]' : 'text-black/50 hover:text-[#f57224]'}`}
                  >
                    My Profile
                  </button>
                  <button 
                    onClick={() => { setActiveTab('profile'); setIsEditingAddress(true); }}
                    className="w-full text-left text-xs font-bold block text-black/50 hover:text-[#f57224] transition-colors"
                  >
                    Address Book
                  </button>
                </div>
              </div>

              {/* Category Group 2 */}
              <div>
                <p className="text-xs font-black text-black uppercase tracking-wider mb-3">My Orders</p>
                <div className="space-y-2.5 pl-3 border-l border-black/5">
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left text-xs font-bold block transition-colors ${activeTab === 'orders' ? 'text-[#f57224]' : 'text-black/50 hover:text-[#f57224]'}`}
                  >
                    My Orders
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5">
                <button 
                  onClick={() => { onLogout(); navigate('/'); }}
                  className="w-full flex items-center gap-2 text-xs font-black text-red-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: PROFILE DASHBOARD */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-black text-black tracking-tight">My Profile</h2>

                  {/* Profile & Address Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Personal Profile Card */}
                    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm relative">
                      <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-5">
                        <h3 className="text-sm font-black text-black">Personal Profile</h3>
                        <button 
                          onClick={() => setIsEditingProfile(true)}
                          className="text-[10px] font-black text-[#f57224] hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> EDIT
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black text-black/30 uppercase tracking-wider mb-1">Full Name</p>
                          <p className="text-sm font-black text-black">{currentUser.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-black/30 uppercase tracking-wider mb-1">Email Address</p>
                          <p className="text-sm font-bold text-black/70 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-black/30" /> {currentUser.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-black/30 uppercase tracking-wider mb-1">Phone Number</p>
                          <p className="text-sm font-bold text-black/70 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-black/30" /> {currentUser.phone || 'মোবাইল নাম্বার যুক্ত করুন'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Address Book Card */}
                    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm relative">
                      <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-5">
                        <h3 className="text-sm font-black text-black">Address Book</h3>
                        <button 
                          onClick={() => setIsEditingAddress(true)}
                          className="text-[10px] font-black text-[#f57224] hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> EDIT
                        </button>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-[#f57224] uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-md inline-block">
                          DEFAULT SHIPPING ADDRESS
                        </p>
                        
                        {currentUser.address ? (
                          <div className="space-y-1.5">
                            <p className="text-sm font-black text-black">{currentUser.name}</p>
                            <p className="text-xs font-bold text-black/60 leading-relaxed flex items-start gap-1.5">
                              <MapPin className="w-4 h-4 text-black/30 shrink-0 mt-0.5" />
                              <span>{currentUser.address}</span>
                            </p>
                            {currentUser.phone && (
                              <p className="text-xs font-bold text-black/60 pl-5">{currentUser.phone}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs font-bold text-black/40 italic py-2">
                            কোন ঠিকানা যুক্ত করা হয়নি। ঠিকানা যুক্ত করতে প্রোফাইল পরিবর্তন করুন।
                          </p>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Recent Orders List */}
                  <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between bg-white">
                      <h3 className="text-sm font-black text-black">Recent Orders</h3>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-[#f57224] hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    {userOrders.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShoppingBag className="w-8 h-8 text-black/20" />
                        </div>
                        <p className="text-sm font-bold text-black/40">কোন অর্ডার খুঁজে পাওয়া যায়নি।</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-black/5 border-b border-black/5 text-black/40 font-black uppercase tracking-wider text-[10px]">
                              <th className="p-4 pl-6">Order ID</th>
                              <th className="p-4">Date</th>
                              <th className="p-4">Items</th>
                              <th className="p-4">Total Amount</th>
                              <th className="p-4 pr-6">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/5">
                            {userOrders.slice(0, 5).map((order) => (
                              <tr key={order.id} className="hover:bg-black/5 transition-colors">
                                <td className="p-4 pl-6 font-mono font-bold text-black">#{order.id.slice(0, 8)}...</td>
                                <td className="p-4 font-bold text-black/60">{new Date(order.createdat).toLocaleDateString()}</td>
                                <td className="p-4 max-w-[220px] truncate font-medium text-black/70">
                                  {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                                </td>
                                <td className="p-4 font-black text-black">৳{order.total}</td>
                                <td className="p-4 pr-6">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </motion.div>
              )}

              {/* TAB 2: MY ORDERS LIST */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-black tracking-tight">My Orders</h2>
                    <span className="px-3.5 py-1.5 bg-[#f57224]/5 text-[#f57224] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#f57224]/10">
                      Total {userOrders.length} Orders
                    </span>
                  </div>

                  {userOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border border-black/5 text-center shadow-sm">
                      <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-5">
                        <ShoppingBag className="w-8 h-8 text-black/20" />
                      </div>
                      <h3 className="text-base font-black mb-1">No Orders Placed Yet</h3>
                      <p className="text-xs font-bold text-black/40 mb-6">শপিং শুরু করতে নিচের বাটনে চাপ দিন।</p>
                      <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-[#f57224] hover:bg-[#e05e12] text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-orange-500/10"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                          
                          {/* Order Card Header */}
                          <div className="p-5 bg-black/5 border-b border-black/5 flex flex-wrap items-center justify-between gap-4 text-xs">
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-black uppercase tracking-wider text-black/40">Order Number</p>
                              <p className="font-mono font-bold text-black">#{order.id}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-black uppercase tracking-wider text-black/40">Placed On</p>
                              <p className="font-bold text-black/70">{new Date(order.createdat).toLocaleString()}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-black uppercase tracking-wider text-black/40">Payment</p>
                              <p className="font-bold text-black/70 uppercase">
                                {order.paymentmethod} {order.transactionid && `(ID: ${order.transactionid})`}
                              </p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-black uppercase tracking-wider text-black/40">Total Price</p>
                              <p className="font-black text-[#f57224]">৳{order.total}</p>
                            </div>
                            <div>
                              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                            </div>
                          </div>

                          {/* Order Products List */}
                          <div className="p-5 divide-y divide-black/5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl border border-black/5 overflow-hidden flex-shrink-0 bg-white shadow-sm">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-xs text-black truncate">{item.name}</h4>
                                  <p className="text-[10px] font-bold text-black/40 mt-1">
                                    Quantity: {item.quantity} • ৳{item.price} each
                                    {item.selectedAttr && ` • ${item.selectedAttr}`}
                                  </p>
                                </div>
                                <div className="text-right font-black text-xs text-black">
                                  ৳{item.price * item.quantity}
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* EDIT PERSONAL PROFILE MODAL */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProfile(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] border border-black/5"
            >
              <div className="px-8 py-5 border-b border-black/5 flex items-center justify-between bg-white sticky top-0 z-10">
                <h2 className="text-base font-black text-black">Edit Personal Profile</h2>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="p-1.5 hover:bg-black/5 rounded-full text-black/40 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdatePersonalProfile} className="p-8 space-y-5">
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        required
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-[#f4f4f7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224]/20 transition-all font-bold text-xs"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-[#f4f4f7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224]/20 transition-all font-bold text-xs"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 flex gap-3 border-t border-black/5">
                  <button 
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 py-3 bg-black/5 hover:bg-black/10 text-black text-xs font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className={`flex-1 py-3 bg-[#f57224] hover:bg-[#e05e12] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/10 flex items-center justify-center gap-1.5 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT ADDRESS BOOK MODAL */}
      <AnimatePresence>
        {isEditingAddress && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingAddress(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] border border-black/5"
            >
              <div className="px-8 py-5 border-b border-black/5 flex items-center justify-between bg-white sticky top-0 z-10">
                <h2 className="text-base font-black text-black">Edit Address Book</h2>
                <button 
                  onClick={() => setIsEditingAddress(false)}
                  className="p-1.5 hover:bg-black/5 rounded-full text-black/40 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateAddressBook} className="p-8 space-y-5">
                <div className="space-y-4">
                  {/* Delivery Address */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4.5 w-4 h-4 text-black/20" />
                      <textarea 
                        required
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-[#f4f4f7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224]/20 transition-all font-bold text-xs min-h-[90px]"
                        placeholder="House no, Road no, Area"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 flex gap-3 border-t border-black/5">
                  <button 
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="flex-1 py-3 bg-black/5 hover:bg-black/10 text-black text-xs font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className={`flex-1 py-3 bg-[#f57224] hover:bg-[#e05e12] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/10 flex items-center justify-center gap-1.5 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Address
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
