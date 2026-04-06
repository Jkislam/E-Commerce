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
  Save 
} from 'lucide-react';
import { User, Order } from '../types';

interface ProfileProps {
  currentUser: User | null;
  isAuthLoading: boolean;
  orders: Order[];
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

export default function Profile({ currentUser, isAuthLoading, orders, onLogout, onUpdateUser }: ProfileProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editAddress, setEditAddress] = useState(currentUser?.address || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editPhoto, setEditPhoto] = useState(currentUser?.photourl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, isAuthLoading, navigate]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      name: editName,
      address: editAddress,
      phone: editPhone,
      photourl: editPhoto
    };

    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/40 font-bold uppercase tracking-widest text-xs">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const userOrders = orders.filter(o => o.customeremail === currentUser?.email);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Processing': return <Package className="w-4 h-4 text-blue-500" />;
      case 'Shipped': return <Truck className="w-4 h-4 text-indigo-500" />;
      case 'Delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="lg:w-1/3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-sm sticky top-24"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="relative group">
                <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg overflow-hidden">
                  {currentUser.photourl ? (
                    <img src={currentUser.photourl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name[0]
                  )}
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-lg border border-black/5 shadow-sm flex items-center justify-center text-black hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-bold truncate">{currentUser.name}</h2>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 hover:bg-black/5 rounded-lg text-black/40 hover:text-black transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-black/40 truncate">{currentUser.email}</p>
                {currentUser.phone && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-black/60">
                    <Phone className="w-3 h-3" />
                    <span>{currentUser.phone}</span>
                  </div>
                )}
                {currentUser.address && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-black/60">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{currentUser.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 bg-black/5 rounded-2xl font-bold text-sm">
                Order History
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { onLogout(); navigate('/'); }}
                className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">My Orders</h1>
              <span className="px-4 py-2 bg-black/5 rounded-full text-xs font-bold uppercase tracking-widest">
                {userOrders.length} Orders
              </span>
            </div>

            {userOrders.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-12 border border-black/5 text-center">
                <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-10 h-10 text-black/20" />
                </div>
                <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-black/40 mb-8">Start shopping to see your orders here.</p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/90 transition-all shadow-xl"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map((order) => (
                  <motion.div 
                    key={order.id}
                    layout
                    className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden"
                  >
                    <div className="p-6 sm:p-8 border-b border-black/5 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Order ID</p>
                        <p className="font-bold text-sm">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Date</p>
                        <p className="font-bold text-sm">{new Date(order.createdat).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Total Amount</p>
                        <p className="font-bold text-sm">৳{order.total}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Payment</p>
                        <div className="flex flex-col">
                          <p className="font-bold text-sm uppercase">{order.paymentmethod}</p>
                          {order.transactionid && (
                            <p className="text-[9px] text-black/40 font-mono">ID: {order.transactionid}</p>
                          )}
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="p-6 sm:p-8 bg-gray-50/50">
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-black/5 flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-sm">{item.name}</h4>
                              <p className="text-xs text-black/40">
                                {item.quantity} x ৳{item.price} 
                                {item.selectedAttr && ` • ${item.selectedAttr}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm">৳{item.price * item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="p-8 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Edit Profile</h2>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-black/5 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                {/* Photo Upload */}
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-black/5 rounded-[2rem] flex items-center justify-center overflow-hidden border-2 border-dashed border-black/10">
                      {editPhoto ? (
                        <img src={editPhoto} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-10 h-10 text-black/20" />
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Profile Picture</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        required
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-bold"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-bold"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-4 h-4 text-black/20" />
                      <textarea 
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-bold min-h-[100px]"
                        placeholder="House no, Road no, Area"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 bg-black/5 text-black rounded-2xl font-bold hover:bg-black/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/90 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
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
