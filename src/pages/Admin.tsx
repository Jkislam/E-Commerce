import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  LayoutDashboard, 
  Package, 
  LogOut, 
  Search,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Star,
  Upload,
  Layers,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ChevronLeft,
  User,
  MapPin,
  CreditCard,
  Hash,
  Calendar,
  ChevronRight,
  Settings,
  CreditCard as PaymentIcon,
  PlusCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Product, Order, AppSettings } from '../types';
import { supabase } from '../lib/supabase';

interface AdminProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
  onReset: () => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  setSuccessMessage: (msg: string) => void;
}

function SettingsView({ settings, setSettings, setSuccessMessage }: SettingsViewProps) {
  const [newCategory, setNewCategory] = useState('');
  const [paymentNumbers, setPaymentNumbers] = useState(settings.paymentNumbers);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    if (settings.categories.includes(newCategory.trim())) {
      alert('Category already exists');
      return;
    }
    const updatedCategories = [...settings.categories, newCategory.trim()];
    
    // Update local state (which syncs to localStorage in App.tsx)
    setSettings(prev => ({
      ...prev,
      categories: updatedCategories
    }));
    setNewCategory('');
    setSuccessMessage('সফল ভাবে এড হয়েছে।');
  };

  const handleDeleteCategory = async (category: string) => {
    if (window.confirm(`Are you sure you want to delete "${category}"? Products in this category will remain but their category won't be in the list.`)) {
      const updatedCategories = settings.categories.filter(c => c !== category);
      
      // Update local state (which syncs to localStorage in App.tsx)
      setSettings(prev => ({
        ...prev,
        categories: updatedCategories
      }));
      setSuccessMessage('সফল ভাবে ডিলেট হয়েছে।');
    }
  };

  const handleUpdatePayment = async (method: keyof AppSettings['paymentNumbers'], value: string) => {
    const updatedPaymentNumbers = { ...paymentNumbers, [method]: value };
    
    // Update local state (which syncs to localStorage in App.tsx)
    setPaymentNumbers(updatedPaymentNumbers);
    setSettings(prev => ({
      ...prev,
      paymentNumbers: updatedPaymentNumbers
    }));
    setSuccessMessage(`সফল ভাবে ${method} নাম্বার আপডেট হয়েছে।`);
  };

  const [heroSettings, setHeroSettings] = useState(settings.hero || {
    image: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=1920',
    titleLine1: 'Elegance in',
    titleLine2: 'Tradition.',
    description: 'Discover our exclusive collection of premium Panjabis and authentic Attars. Crafted for elegance, designed for you.'
  });
  const [brandName, setBrandName] = useState(settings.brandName || 'AL-Hurumah');
  const [footerDescription, setFooterDescription] = useState(settings.footerDescription || 'Your destination for premium traditional wear and authentic fragrances. We bring you the finest Panjabis and Attars from around the world.');
  const [metaPixelId, setMetaPixelId] = useState(settings.metaPixelId || '');

  const handleUpdateHero = async () => {
    // Update local state (which syncs to localStorage in App.tsx)
    // Skipping Supabase update for 'hero' as the column doesn't exist in the current schema
    setSettings(prev => ({
      ...prev,
      hero: heroSettings
    }));
    setSuccessMessage('সফল ভাবে আপডেট হয়েছে।');
  };

  const handleUpdateGeneralSettings = async () => {
    // Update local state (which syncs to localStorage in App.tsx)
    setSettings(prev => ({
      ...prev,
      brandName,
      footerDescription,
      metaPixelId
    }));
    setSuccessMessage('সফল ভাবে আপডেট হয়েছে।');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Management */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-black/40" />
            </div>
            <h3 className="text-xl font-black">Manage Categories</h3>
          </div>

          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 mb-8">
            <input 
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name..."
              className="flex-1 px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
            />
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-black/90 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </motion.button>
          </form>

          <div className="space-y-3">
            {settings.categories.map(category => (
              <div key={category} className="flex items-center justify-between p-4 bg-black/[0.02] rounded-2xl border border-black/5">
                <span className="font-bold text-sm">{category}</span>
                <motion.button 
                  onClick={() => handleDeleteCategory(category)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Management */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
              <PaymentIcon className="w-5 h-5 text-black/40" />
            </div>
            <h3 className="text-xl font-black">Payment Numbers</h3>
          </div>

          <div className="space-y-6">
            {(['bKash', 'Nagad', 'Rocket'] as const).map(method => (
              <div key={method} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">{method} Number</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text"
                    value={paymentNumbers[method] || ''}
                    onChange={(e) => setPaymentNumbers(prev => ({ ...prev, [method]: e.target.value }))}
                    className="flex-1 px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-mono font-bold"
                  />
                  <motion.button 
                    onClick={() => handleUpdatePayment(method, paymentNumbers[method])}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-black/90 transition-all shadow-lg"
                  >
                    Save
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-black/40" />
            </div>
            <h3 className="text-xl font-black">General Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Brand Name</label>
              <input 
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
                placeholder="AL-Hurumah"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Footer Description</label>
              <textarea 
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold resize-none h-24"
                placeholder="Your destination for premium traditional wear..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Meta Pixel ID</label>
              <input 
                type="text"
                value={metaPixelId}
                onChange={(e) => setMetaPixelId(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
                placeholder="e.g. 123456789012345"
              />
              <p className="text-xs text-black/40 ml-1 mt-1">Leave empty to disable Meta Pixel tracking.</p>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <motion.button 
                onClick={handleUpdateGeneralSettings}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-black/90 transition-all shadow-lg"
              >
                Save General Settings
              </motion.button>
            </div>
          </div>
        </div>

        {/* Hero Section Settings */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-black/40" />
            </div>
            <h3 className="text-xl font-black">Hero Section Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Cover Image (URL or Upload)</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text"
                  value={heroSettings.image}
                  onChange={(e) => setHeroSettings(prev => ({ ...prev, image: e.target.value }))}
                  className="flex-1 min-w-0 px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
                  placeholder="https://..."
                />
                <label className="cursor-pointer px-6 py-4 bg-black/5 hover:bg-black/10 rounded-2xl flex items-center justify-center transition-all shrink-0">
                  <Upload className="w-5 h-5 text-black/60 sm:mr-0 mr-2" />
                  <span className="sm:hidden text-sm font-bold text-black/60">Upload Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setHeroSettings(prev => ({ ...prev, image: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Title (Line 1)</label>
              <input 
                type="text"
                value={heroSettings.titleLine1}
                onChange={(e) => setHeroSettings(prev => ({ ...prev, titleLine1: e.target.value }))}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Title (Line 2 / Highlight)</label>
              <input 
                type="text"
                value={heroSettings.titleLine2}
                onChange={(e) => setHeroSettings(prev => ({ ...prev, titleLine2: e.target.value }))}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Description</label>
              <textarea 
                value={heroSettings.description}
                onChange={(e) => setHeroSettings(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold resize-none h-14"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <motion.button 
              onClick={handleUpdateHero}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-black/90 transition-all shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Hero Settings
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Admin({ 
  products, 
  setProducts, 
  onDelete, 
  onBulkDelete, 
  onReset,
  orders,
  updateOrderStatus,
  onDeleteOrder,
  settings,
  setSettings
}: AdminProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'settings'>('inventory');

  // View state for specific "pages"
  const [currentView, setCurrentView] = useState<'inventory' | 'orders' | 'settings'>('inventory');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setSelectedOrder(null);
  }, [currentView]);

  const renderOrderDetails = (order: Order) => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="p-3 hover:bg-black/5 rounded-2xl transition-colors border border-black/5 bg-white shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-2xl font-black">Order Details</h2>
              <p className="text-[10px] text-black/40 font-black uppercase tracking-[0.2em]">{order.id}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              onDeleteOrder(order.id);
              setSelectedOrder(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Order
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
          {/* Left Column: Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
              <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                Order Items ({order.items.length})
              </h3>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-black/[0.02] rounded-[2rem] border border-black/5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-black/5 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base truncate">{item.name}</h4>
                      <p className="text-[10px] text-black/40 font-black uppercase tracking-widest mt-1">
                        {item.selectedAttr ? `Attribute: ${item.selectedAttr}` : 'Standard'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-black/60">৳{item.price} × {item.quantity}</span>
                        <span className="text-sm font-black">৳{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-black/5 flex justify-between items-center">
                <span className="text-lg font-black">Total Amount</span>
                <span className="text-3xl font-black">৳{order.total}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Payment Info */}
          <div className="space-y-6">
            {/* Delivery Details */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
              <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                <User className="w-5 h-5" />
                Delivery Details
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-black/40" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Customer Name</p>
                    <p className="text-sm font-bold">{order.customername}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-black/40" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Delivery Address</p>
                    <p className="text-sm font-bold leading-relaxed">{order.customeraddress}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0">
                    <Hash className="w-5 h-5 text-black/40" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Phone Number</p>
                    <p className="text-sm font-bold">{order.customerphone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
              <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-black/40" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Method</p>
                    <p className="text-sm font-bold">{order.paymentmethod}</p>
                  </div>
                </div>
                {order.transactionid && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0">
                      <Hash className="w-5 h-5 text-black/40" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Transaction ID</p>
                      <p className="text-sm font-mono font-bold bg-black/5 px-3 py-1.5 rounded-xl inline-block mt-1 border border-black/5">
                        {order.transactionid}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-black/40" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Order Date</p>
                    <p className="text-sm font-bold">{new Date(order.createdat).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Update */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
              <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                <Clock className="w-5 h-5" />
                Order Status
              </h3>
              <select 
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                className="w-full px-6 py-4 bg-black text-white rounded-2xl text-sm font-black uppercase tracking-widest focus:outline-none shadow-lg shadow-black/10"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Initial state for a new product
  const initialProductState: Omit<Product, 'id'> = {
    name: '',
    price: 0,
    category: settings.categories[0] || 'Panjabi',
    image: '',
    rating: 4.5,
    description: '',
    stock: 0,
    sizes: [],
    volumes: [],
    islatest: false
  };

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(initialProductState);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple secure check (In real app, use backend auth)
    if (email === 'admin@alhurumah.com' && password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(id);
      setSelectedIds(prev => prev.filter(selectedId => Number(selectedId) !== Number(id)));
      setSuccessMessage('সফল ভাবে ডিলেট হয়েছে।');
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
      setSuccessMessage(`সফল ভাবে ${selectedIds.length} টি ডিলেট হয়েছে।`);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Update local state (which syncs to localStorage in App.tsx)
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    setSuccessMessage('সফল ভাবে আপডেট হয়েছে।');
  };

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a new ID locally
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const productToAdd = { ...newProduct, id: newId } as Product;
    
    // Update local state (which syncs to localStorage in App.tsx)
    setProducts(prev => [...prev, productToAdd]);
    setIsAddingNew(false);
    setNewProduct(initialProductState);
    setSuccessMessage('সফল ভাবে এড হয়েছে।');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEdit && editingProduct) {
          setEditingProduct({ ...editingProduct, image: base64String });
        } else {
          setNewProduct({ ...newProduct, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3 h-3 text-amber-500" />;
      case 'Processing': return <Package className="w-3 h-3 text-blue-500" />;
      case 'Shipped': return <Truck className="w-3 h-3 text-indigo-500" />;
      case 'Delivered': return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      case 'Cancelled': return <XCircle className="w-3 h-3 text-red-500" />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-black/5"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="text-black/40 mt-2">Secure access to {settings.brandName || 'AL-Hurumah'} Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Email Address</label>
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alhurumah.com"
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Password</label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-6 pr-12 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
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

            {loginError && (
              <p className="text-red-500 text-sm font-medium text-center">{loginError}</p>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-black/90 transition-all shadow-xl"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-black/30">
              Demo Access: admin@alhurumah.com / admin123
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Admin Header */}
      <div className="bg-white border-b border-black/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">Admin Panel</h2>
              <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold mt-1">Management System</p>
            </div>
          </div>

          <div className="flex items-center bg-black/5 p-1 rounded-2xl scale-90 sm:scale-100 origin-left">
            <button 
              onClick={() => setCurrentView('inventory')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${currentView === 'inventory' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black/60'}`}
            >
              Inventory
            </button>
            <button 
              onClick={() => setCurrentView('orders')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${currentView === 'orders' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black/60'}`}
            >
              Orders
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${currentView === 'settings' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black/60'}`}
            >
              Settings
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onReset}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-black/60 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
              title="Reset to default"
            >
              Reset
            </button>
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all shadow-lg animate-in fade-in zoom-in duration-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedIds.length})
              </button>
            )}
            <button 
              onClick={() => setIsAddingNew(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-black/90 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 text-green-700 rounded-2xl font-bold text-center border border-green-200"
          >
            {successMessage}
          </motion.div>
        )}
        {/* Stats & Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">
              {currentView === 'inventory' ? 'Total Products' : 'Total Orders'}
            </p>
            <p className="text-3xl font-black">
              {currentView === 'inventory' ? products.length : orders.length}
            </p>
          </div>
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
            <input 
              type="text"
              placeholder={currentView === 'inventory' ? "Search by name or category..." : "Search by Order ID or Customer..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full min-h-[70px] pl-14 pr-6 bg-white border border-black/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
            />
          </div>
        </div>

        {currentView === 'inventory' ? (
          /* Product List - Responsive */
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/5">
                      <th className="px-6 py-4 w-10">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-black/10 text-black focus:ring-black cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Product</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Category</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Latest</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Price</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Stock</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className={`hover:bg-black/[0.02] transition-colors ${selectedIds.includes(product.id) ? 'bg-black/[0.03]' : ''}`}>
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.includes(product.id)}
                            onChange={() => toggleSelect(product.id)}
                            className="w-4 h-4 rounded border-black/10 text-black focus:ring-black cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-sm">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${product.islatest ? 'bg-black' : 'bg-black/10'}`}
                            onClick={async () => {
                              const newIsLatest = !product.islatest;
                              // Update local state (which syncs to localStorage in App.tsx)
                              setProducts(prev => prev.map(p => p.id === product.id ? { ...p, islatest: newIsLatest } : p));
                              setSuccessMessage(`সফল ভাবে ${newIsLatest ? 'এড' : 'রিমুভ'} হয়েছে।`);
                            }}
                          >
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${product.islatest ? 'left-4.5' : 'left-0.5'}`} />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-sm">৳{product.price}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold ${product.stock < 5 ? 'text-red-500' : 'text-black/60'}`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setEditingProduct(product)}
                              className="p-2 hover:bg-black/5 rounded-lg text-black/60 hover:text-black transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/5 flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{product.category}</span>
                      <span className="w-1 h-1 bg-black/10 rounded-full" />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${product.islatest ? 'text-black' : 'text-black/20'}`}>Latest</span>
                      <span className="w-1 h-1 bg-black/10 rounded-full" />
                      <span className="text-xs font-bold">৳{product.price}</span>
                    </div>
                    <p className={`text-[10px] font-bold mt-1 ${product.stock < 5 ? 'text-red-500' : 'text-black/40'}`}>
                      {product.stock} units in stock
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="p-2.5 bg-black/5 rounded-xl text-black/60 active:bg-black/10 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2.5 bg-red-50 rounded-xl text-red-400 active:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : currentView === 'settings' ? (
          <SettingsView 
            settings={settings} 
            setSettings={setSettings} 
            setSuccessMessage={setSuccessMessage} 
          />
        ) : selectedOrder ? (
          renderOrderDetails(selectedOrder)
        ) : (
          /* Orders List - Responsive */
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/5">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Order ID</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Items</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Total</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Payment</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {orders.filter(o => 
                      o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      o.customername.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map(order => (
                      <tr key={order.id} className="hover:bg-black/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{order.id}</span>
                            {order.status === 'Pending' && (
                              <span className="px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase tracking-tighter rounded-md animate-pulse">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-black/40 mt-1">{new Date(order.createdat).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-md overflow-hidden bg-black/5 flex-shrink-0 border border-black/5">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold leading-tight">{item.name}</span>
                                  <span className="text-[8px] text-black/40 uppercase tracking-widest font-black">
                                    {item.quantity}x {item.selectedAttr ? `| ${item.selectedAttr}` : ''}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{order.customername}</span>
                            <span className="text-[10px] text-black/40">{order.customerphone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-sm">৳{order.total}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black/5 rounded-md inline-block w-fit">
                              {order.paymentmethod}
                            </span>
                            {order.transactionid && (
                              <span className="text-[9px] text-black/40 font-mono mt-1">
                                ID: {order.transactionid}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="text-xs font-bold">{order.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1.5 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-black/80 transition-colors"
                            >
                              View Details
                            </button>
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="px-3 py-1.5 bg-black/5 rounded-lg text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-black/10"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button 
                              onClick={() => onDeleteOrder(order.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {orders.filter(o => 
                o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                o.customername.toLowerCase().includes(searchTerm.toLowerCase())
              ).map(order => (
                <div key={order.id} className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{order.id}</span>
                        {order.status === 'Pending' && (
                          <span className="px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase tracking-tighter rounded-md">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-black/40 mt-1">{new Date(order.createdat).toLocaleDateString()}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                      order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                      order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                      'bg-black/5 text-black'
                    }`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-3 border-y border-black/5">
                    <div className="flex -space-x-3 overflow-hidden">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-black/5">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-lg border-2 border-white bg-black text-white flex items-center justify-center text-[10px] font-bold">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold truncate">{order.items.map(i => i.name).join(', ')}</p>
                      <p className="text-[9px] text-black/40 uppercase tracking-widest font-black mt-0.5">
                        {order.items.length} Items • ৳{order.total}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Customer</p>
                      <p className="text-xs font-bold">{order.customername}</p>
                      <p className="text-[10px] text-black/40">{order.customerphone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 px-4 py-2 bg-black/5 text-black rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                          Details <ChevronRight className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => onDeleteOrder(order.id)}
                          className="p-2 bg-red-50 text-red-400 rounded-xl active:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="w-full px-4 py-2 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-wider focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {(editingProduct || isAddingNew) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[calc(100vh-2rem)] bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 sm:p-8 border-b border-black/5 flex justify-between items-center bg-gray-50 flex-shrink-0">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {isAddingNew ? 'Add New Product' : 'Edit Product'}
                </h2>
                <button 
                  onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form 
                onSubmit={isAddingNew ? handleAddNew : handleSaveEdit}
                className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Product Name</label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        required
                        type="text"
                        value={isAddingNew ? newProduct.name : (editingProduct?.name || '')}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, name: e.target.value})
                          : setEditingProduct({...editingProduct!, name: e.target.value})
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Category</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <select 
                        value={isAddingNew ? newProduct.category : (editingProduct?.category || '')}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, category: e.target.value})
                          : setEditingProduct({...editingProduct!, category: e.target.value})
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all appearance-none"
                      >
                        {settings.categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Price (৳)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        required
                        type="number"
                        value={isAddingNew ? newProduct.price : (editingProduct?.price ?? 0)}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, price: Number(e.target.value)})
                          : setEditingProduct({...editingProduct!, price: Number(e.target.value)})
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Stock Units</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        required
                        type="number"
                        min="0"
                        value={isAddingNew ? newProduct.stock : (editingProduct?.stock ?? 0)}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, stock: Number(e.target.value)})
                          : setEditingProduct({...editingProduct!, stock: Number(e.target.value)})
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Image Selection</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        type="text"
                        value={isAddingNew ? newProduct.image : (editingProduct?.image || '')}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, image: e.target.value})
                          : setEditingProduct({...editingProduct!, image: e.target.value})
                        }
                        placeholder="Image URL..."
                        className="w-full pl-11 pr-4 py-3.5 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-xs"
                      />
                    </div>
                    <div className="relative">
                      <label className="flex items-center justify-center gap-2 w-full h-full min-h-[50px] bg-black/5 rounded-2xl border-2 border-dashed border-black/10 hover:border-black/20 cursor-pointer transition-all">
                        <Upload className="w-4 h-4 text-black/40" />
                        <span className="text-xs font-bold text-black/40">Upload File</span>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, !isAddingNew)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  {(isAddingNew ? newProduct.image : editingProduct?.image) && (
                    <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-black/5">
                      <img 
                        src={isAddingNew ? newProduct.image : editingProduct?.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={isAddingNew ? newProduct.description : (editingProduct?.description || '')}
                    onChange={(e) => isAddingNew 
                      ? setNewProduct({...newProduct, description: e.target.value})
                      : setEditingProduct({...editingProduct!, description: e.target.value})
                    }
                    className="w-full px-5 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-black/5 rounded-2xl border border-black/5">
                  <div 
                    onClick={() => isAddingNew 
                      ? setNewProduct({...newProduct, islatest: !newProduct.islatest})
                      : setEditingProduct({...editingProduct!, islatest: !editingProduct?.islatest})
                    }
                    className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${
                      (isAddingNew ? newProduct.islatest : editingProduct?.islatest) ? 'bg-black' : 'bg-black/10'
                    }`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                      (isAddingNew ? newProduct.islatest : editingProduct?.islatest) ? 'left-6' : 'left-1'
                    }`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Mark as Latest Product</p>
                    <p className="text-[10px] text-black/40">This product will appear in the home page hero slider.</p>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                    className="flex-1 py-4 border border-black/10 rounded-2xl font-bold hover:bg-black/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/90 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isAddingNew ? 'Add Product' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Add Button */}
      <button 
        onClick={() => setIsAddingNew(true)}
        className="sm:hidden fixed bottom-8 right-8 w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
