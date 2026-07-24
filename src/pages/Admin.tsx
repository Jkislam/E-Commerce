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
  EyeOff,
  TrendingUp,
  Users,
  BarChart3,
  Info,
  Mail,
  Phone,
  AlertTriangle,
  Activity,
  Zap,
  Minus,
  Download,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Boxes,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { Product, Order, AppSettings, SocialLink } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useSearchParams } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface AdminProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onDelete: (id: number | string) => void;
  onBulkDelete: (ids: (number | string)[]) => void;
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
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

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

  const handleDeleteCategory = (category: string) => {
    setCategoryToDelete(category);
  };

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    const updatedCategories = settings.categories.filter(c => c !== categoryToDelete);
    
    // Update local state (which syncs to localStorage in App.tsx)
    setSettings(prev => ({
      ...prev,
      categories: updatedCategories
    }));
    setSuccessMessage('ক্যাটাগরি সফল ভাবে ডিলেট হয়েছে।');
    setCategoryToDelete(null);
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
  const [seoKeywords, setSeoKeywords] = useState(settings.seoKeywords || 'AL-Hurumah, Panjabi, Attar, Traditional Wear, Fragrances, Premium Panjabi, Authentic Attar');
  const [logo, setLogo] = useState(settings.logo || '');

  const handleUpdateHero = async () => {
    // Update local state (which syncs to localStorage in App.tsx)
    // Skipping Supabase update for 'hero' as the column doesn't exist in the current schema
    setSettings(prev => ({
      ...prev,
      hero: heroSettings,
      logo: logo
    }));
    setSuccessMessage('সফল ভাবে আপডেট হয়েছে।');
  };

  const handleUpdateGeneralSettings = async () => {
    // Update local state (which syncs to localStorage in App.tsx)
    setSettings(prev => ({
      ...prev,
      brandName,
      footerDescription,
      metaPixelId,
      seoKeywords
    }));
    setSuccessMessage('সফল ভাবে আপডেট হয়েছে।');
  };

  const [aboutText1, setAboutText1] = useState(settings.aboutText1 || 'Founded in 2024, AL-Hurumah began with a simple yet profound vision: to bridge the gap between traditional craftsmanship and contemporary style. Our journey started in the heart of the artisan community, where we discovered the timeless beauty of hand-stitched Panjabis and the mystical allure of organic Attars.');
  const [aboutText2, setAboutText2] = useState(settings.aboutText2 || 'We believe that clothing and fragrance are more than just products; they are reflections of identity and culture. That\'s why we source only the finest materials—from premium Egyptian cotton to the rarest essential oils—ensuring that every piece carries the legacy of quality.');
  const [aboutMission, setAboutMission] = useState(settings.aboutMission || 'To preserve and promote traditional artistry by crafting premium attire and fragrances that inspire confidence and celebrate authenticity in a modern world.');
  const [aboutVision, setAboutVision] = useState(settings.aboutVision || 'To become a global symbol of refined traditionalism, where every thread and scent tells a story of heritage, quality, and timeless grace.');

  const [contactEmail, setContactEmail] = useState(settings.contactEmail || 'concierge@alhurumah.com');
  const [contactPhone, setContactPhone] = useState(settings.contactPhone || '+880 1234 567890');
  const [contactAddress, setContactAddress] = useState(settings.contactAddress || 'Gulshan-2, Dhaka');
  const [contactHours, setContactHours] = useState(settings.contactHours || '10:00 AM - 09:00 PM');
  const [contactImageTop, setContactImageTop] = useState(settings.contactImageTop || 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2000');
  const [contactImageBottom, setContactImageBottom] = useState(settings.contactImageBottom || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000');

  const handleUpdateAboutSettings = async () => {
    setSettings(prev => ({
      ...prev,
      aboutText1,
      aboutText2,
      aboutMission,
      aboutVision
    }));
    setSuccessMessage('About এর তর্থ্য সফল ভাবে আপডেট হয়েছে।');
  };

  const handleUpdateContactSettings = async () => {
    setSettings(prev => ({
      ...prev,
      contactEmail,
      contactPhone,
      contactAddress,
      contactHours,
      contactImageTop,
      contactImageBottom
    }));
    setSuccessMessage('Contact এর তর্থ্য সফল ভাবে আপডেট হয়েছে।');
  };

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(settings.socialLinks || [
    { platform: 'Facebook', url: 'https://facebook.com' },
    { platform: 'Twitter', url: 'https://twitter.com' },
    { platform: 'Instagram', url: 'https://instagram.com' }
  ]);
  const [newPlatform, setNewPlatform] = useState<SocialLink['platform']>('Facebook');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    if (settings.socialLinks) {
      setSocialLinks(settings.socialLinks);
    }
  }, [settings.socialLinks]);

  const handleAddSocialLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const exists = socialLinks.some(link => link.platform === newPlatform);
    if (exists) {
      alert(`${newPlatform} link already exists. Please remove the existing one first if you want to update it.`);
      return;
    }

    const updatedLinks = [...socialLinks, { platform: newPlatform, url: newUrl.trim() }];
    setSocialLinks(updatedLinks);
    setNewUrl('');
  };

  const handleDeleteSocialLink = (platformToDelete: SocialLink['platform']) => {
    const updatedLinks = socialLinks.filter(link => link.platform !== platformToDelete);
    setSocialLinks(updatedLinks);
  };

  const handleSaveSocialLinks = async () => {
    setSettings(prev => ({
      ...prev,
      socialLinks: socialLinks
    }));
    setSuccessMessage('সোসাল মিডিয়ার লিংকগুলো সফল ভাবে আপডেট হয়েছে।');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCategoryToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-sm p-8 rounded-[2.5rem] border border-black/5 shadow-2xl z-10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                
                <h3 className="text-xl font-black text-black tracking-tight">আপনি কি নিশ্চিত?</h3>
                <p className="text-sm font-bold text-black/50 mt-3 leading-relaxed">
                  আপনি কি সত্যিই <span className="text-red-500 font-black">"{categoryToDelete}"</span> ক্যাটাগরিটি ডিলেট করতে চান?
                  <br />
                  ক্যাটাগরিটি ডিলেট করলেও এই ক্যাটাগরির প্রোডাক্টগুলো ডিলিট হবে না।
                </p>
                
                <div className="flex gap-4 w-full mt-8">
                  <button 
                    onClick={() => setCategoryToDelete(null)}
                    type="button"
                    className="flex-1 py-4 bg-black/5 hover:bg-black/10 text-black/60 font-black text-sm rounded-2xl transition-all"
                  >
                    বাতিল
                  </button>
                  <button 
                    onClick={confirmDeleteCategory}
                    type="button"
                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-red-500/10"
                  >
                    ডিলেট করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Management */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
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
            {(settings?.categories || []).map(category => (
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
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
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
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-black/5 shadow-sm lg:col-span-2">
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
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">SEO Keywords</label>
              <input 
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
                placeholder="e.g. AL-Hurumah, Panjabi, Attar, Traditional Wear"
              />
              <p className="text-xs text-black/40 ml-1 mt-1">Comma-separated keywords for search engines.</p>
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
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-black/5 shadow-sm lg:col-span-2">
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
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Hero Title (Line 1)</label>
              <input 
                type="text"
                value={heroSettings.titleLine1}
                onChange={(e) => setHeroSettings(prev => ({ ...prev, titleLine1: e.target.value }))}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Website Logo (Upload)</label>
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-black/[0.02] rounded-3xl border border-dashed border-black/10">
                <div className="w-24 h-24 bg-white rounded-2xl border border-black/5 flex items-center justify-center p-2 shadow-sm overflow-hidden flex-shrink-0">
                  {logo ? (
                    <img src={logo} alt="Brand Logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-black/20">
                      <LayoutDashboard className="w-8 h-8 mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-tighter">No Logo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex gap-2">
                    <label className="cursor-pointer flex-1 px-6 py-4 bg-black text-white rounded-2xl font-bold text-xs hover:bg-black/90 transition-all shadow-lg flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Logo
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setLogo(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {logo && (
                      <button 
                        onClick={() => setLogo('')}
                        className="px-4 py-4 bg-red-50 text-red-500 rounded-2xl font-bold text-xs hover:bg-red-100 transition-all border border-red-100 flex items-center justify-center"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-black/40 font-medium px-2">Recommended: Square PNG with transparent background.</p>
                </div>
              </div>
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

        {/* About Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-black/5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5 text-black/40" />
            </div>
            <h3 className="text-xl font-black">About Us Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">About Story (Paragraph 1)</label>
              <textarea 
                value={aboutText1}
                onChange={(e) => setAboutText1(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold resize-none h-24"
                placeholder="Story Paragraph 1..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">About Story (Paragraph 2)</label>
              <textarea 
                value={aboutText2}
                onChange={(e) => setAboutText2(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold resize-none h-24"
                placeholder="Story Paragraph 2..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Our Mission</label>
              <textarea 
                value={aboutMission}
                onChange={(e) => setAboutMission(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold resize-none h-24"
                placeholder="Preserve and promote traditional artistry..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Our Vision</label>
              <textarea 
                value={aboutVision}
                onChange={(e) => setAboutVision(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold resize-none h-24"
                placeholder="Become a global symbol..."
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <motion.button 
                onClick={handleUpdateAboutSettings}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-black/90 transition-all shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save About Settings
              </motion.button>
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-black/5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-black/40" />
            </div>
            <h3 className="text-xl font-black">Contact Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Contact Email</label>
              <input 
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
                placeholder="concierge@alhurumah.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Contact Phone</label>
              <input 
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
                placeholder="+880 1234 567890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Boutique / Office Address</label>
              <input 
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
                placeholder="Gulshan-2, Dhaka"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Working Hours</label>
              <input 
                type="text"
                value={contactHours}
                onChange={(e) => setContactHours(e.target.value)}
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
                placeholder="10:00 AM - 09:00 PM"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Contact Page Banner Image (Top) - URL or Upload</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text"
                  value={contactImageTop}
                  onChange={(e) => setContactImageTop(e.target.value)}
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
                          setContactImageTop(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Contact Page Bottom Image (Office/Map) - URL or Upload</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text"
                  value={contactImageBottom}
                  onChange={(e) => setContactImageBottom(e.target.value)}
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
                          setContactImageBottom(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <motion.button 
                onClick={handleUpdateContactSettings}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-black/90 transition-all shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Contact Settings
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links Card */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-black/5">
          <div>
            <h3 className="text-xl font-black text-black tracking-tight">Social Media Links (সোসাল মিডিয়া লিংক)</h3>
            <p className="text-sm font-bold text-black/40 mt-1">ফুটারে প্রদর্শনের জন্য সোসাল মিডিয়া প্ল্যাটফর্ম ও লিংক যোগ অথবা বাদ করুন।</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Add Form */}
          <form onSubmit={handleAddSocialLink} className="flex flex-col md:flex-row gap-4 items-end bg-black/5 p-6 rounded-2xl">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Platform (প্ল্যাটফর্ম)</label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as SocialLink['platform'])}
                className="w-full px-6 py-4 bg-white rounded-2xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
              >
                <option value="Facebook">Facebook</option>
                <option value="Twitter">Twitter</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="TikTok">TikTok</option>
                <option value="Pinterest">Pinterest</option>
                <option value="GitHub">GitHub</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="w-full md:flex-1 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">URL (লিংক)</label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://facebook.com/your-page"
                className="w-full px-6 py-4 bg-white rounded-2xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-bold"
              />
            </div>
            
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 bg-black text-white hover:bg-black/90 font-bold text-sm rounded-2xl transition-all shadow-sm shrink-0"
            >
              Add Link
            </button>
          </form>

          {/* Social Links List */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Active Links (সক্রিয় লিংকসমূহ)</h4>
            {socialLinks.length === 0 ? (
              <p className="text-sm font-bold text-black/30 p-6 bg-black/5 rounded-2xl text-center">কোন লিংক যোগ করা হয়নি।</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {socialLinks.map((link) => (
                  <div key={link.platform} className="flex justify-between items-center p-4 bg-black/5 rounded-2xl border border-black/5">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-black">{link.platform}</p>
                      <p className="text-xs font-medium text-black/40 truncate">{link.url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSocialLink(link.platform)}
                      className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all shrink-0"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-black/5">
            <motion.button
              type="button"
              onClick={handleSaveSocialLinks}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Social Media Links
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnalyticsView({ orders, products = [], setCurrentView }: { orders: Order[], products?: Product[], setCurrentView: (view: any) => void }) {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    avgOrderValue: 0
  });
  const [chartData, setChartData] = useState<{ date: string; amount: number }[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isSubscribed = true;

    // Real-time subscription to 'profiles' table to update Total Users in real-time
    const profilesChannel = supabase
      .channel('public:profiles-analytics-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Real-time profiles change received in Analytics:', payload);
          if (isSubscribed) {
            setRefreshTrigger(prev => prev + 1);
          }
        }
      )
      .subscribe();

    // Subscribe to 'orders' table to ensure any order status or creation updates trigger analytics re-fetch instantly
    const ordersChannel = supabase
      .channel('public:orders-analytics-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Real-time orders change received in Analytics:', payload);
          if (isSubscribed) {
            setRefreshTrigger(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      isSubscribed = false;
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch Total Users using standard GET request with a localized fallback to prevent iframe network failures from bubbling up
        let count = 0;
        try {
          const { data: usersData, error: userError } = await supabase
            .from('profiles')
            .select('id');
          
          if (userError) {
            console.warn('Profiles fetch warning (handled):', userError.message);
          } else {
            count = usersData ? usersData.length : 0;
          }
        } catch (fetchErr: any) {
          console.warn('Profiles fetch network exception (handled):', fetchErr?.message || fetchErr);
        }

        // Calculate Stats based on timeframe
        const now = new Date();
        let filteredOrders = [...orders];

        if (timeframe === 'daily') {
          const startOfToday = new Date(now);
          startOfToday.setHours(0,0,0,0);
          filteredOrders = orders.filter(o => {
            if (!o.createdat) return false;
            const d = new Date(o.createdat);
            return !isNaN(d.getTime()) && d >= startOfToday;
          });
        } else if (timeframe === 'weekly') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredOrders = orders.filter(o => {
            if (!o.createdat) return false;
            const d = new Date(o.createdat);
            return !isNaN(d.getTime()) && d >= sevenDaysAgo;
          });
        } else if (timeframe === 'monthly') {
          const startOfRunningYear = new Date(now.getFullYear(), 0, 1);
          filteredOrders = orders.filter(o => {
            if (!o.createdat) return false;
            const d = new Date(o.createdat);
            return !isNaN(d.getTime()) && d >= startOfRunningYear;
          });
        } else if (timeframe === 'yearly') {
          filteredOrders = orders.filter(o => {
            if (!o.createdat) return false;
            const d = new Date(o.createdat);
            return !isNaN(d.getTime());
          });
        }

        const totalSales = filteredOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        const totalOrders = filteredOrders.length;
        const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

        setStats({
          totalSales,
          totalOrders,
          totalUsers: count || 0,
          avgOrderValue
        });

        // Prepare Chart Data
        const dailyData: { [key: string]: number } = {};
        let formattedChartData: { date: string; amount: number }[] = [];

        if (timeframe === 'daily') {
          const slots = ["12 AM", "3 AM", "6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"];
          slots.forEach(slot => {
            dailyData[slot] = 0;
          });

          filteredOrders.forEach(order => {
            if (!order.createdat) return;
            const parsedDate = new Date(order.createdat);
            if (isNaN(parsedDate.getTime())) return;

            const hour = parsedDate.getHours();
            let slot = "12 AM";
            if (hour >= 3 && hour < 6) slot = "3 AM";
            else if (hour >= 6 && hour < 9) slot = "6 AM";
            else if (hour >= 9 && hour < 12) slot = "9 AM";
            else if (hour >= 12 && hour < 15) slot = "12 PM";
            else if (hour >= 15 && hour < 18) slot = "3 PM";
            else if (hour >= 18 && hour < 21) slot = "6 PM";
            else if (hour >= 21) slot = "9 PM";

            dailyData[slot] = (dailyData[slot] || 0) + (Number(order.total) || 0);
          });

          formattedChartData = slots.map(slot => ({ date: slot, amount: dailyData[slot] }));

        } else if (timeframe === 'weekly') {
          for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const key = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            dailyData[key] = 0;
          }

          filteredOrders.forEach(order => {
            if (!order.createdat) return;
            const parsedDate = new Date(order.createdat);
            if (isNaN(parsedDate.getTime())) return;

            const date = parsedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            if (dailyData[date] !== undefined) {
              dailyData[date] = (dailyData[date] || 0) + (Number(order.total) || 0);
            }
          });

          formattedChartData = Object.entries(dailyData)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => {
              const currentYear = new Date().getFullYear();
              const dateA = new Date(`${a.date} ${currentYear}`);
              const dateB = new Date(`${b.date} ${currentYear}`);
              if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
              return dateA.getTime() - dateB.getTime();
            });

        } else if (timeframe === 'monthly') {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const currentMonthIdx = now.getMonth();
          for (let i = 0; i <= currentMonthIdx; i++) {
            dailyData[months[i]] = 0;
          }

          filteredOrders.forEach(order => {
            if (!order.createdat) return;
            const parsedDate = new Date(order.createdat);
            if (isNaN(parsedDate.getTime())) return;

            const monthKey = parsedDate.toLocaleDateString('en-US', { month: 'short' });
            if (dailyData[monthKey] !== undefined) {
              dailyData[monthKey] = (dailyData[monthKey] || 0) + (Number(order.total) || 0);
            }
          });

          formattedChartData = months
            .slice(0, currentMonthIdx + 1)
            .map(m => ({ date: m, amount: dailyData[m] || 0 }));

        } else if (timeframe === 'yearly') {
          const years = new Set<number>();
          orders.forEach(o => {
            if (o.createdat) {
              const d = new Date(o.createdat);
              if (!isNaN(d.getTime())) {
                years.add(d.getFullYear());
              }
            }
          });
          years.add(now.getFullYear());
          const sortedYears = Array.from(years).sort((a, b) => a - b);
          sortedYears.forEach(y => {
            dailyData[y.toString()] = 0;
          });

          filteredOrders.forEach(order => {
            if (!order.createdat) return;
            const parsedDate = new Date(order.createdat);
            if (isNaN(parsedDate.getTime())) return;

            const yearKey = parsedDate.getFullYear().toString();
            if (dailyData[yearKey] !== undefined) {
              dailyData[yearKey] = (dailyData[yearKey] || 0) + (Number(order.total) || 0);
            }
          });

          formattedChartData = sortedYears.map(y => ({ date: y.toString(), amount: dailyData[y.toString()] || 0 }));
        }

        setChartData(formattedChartData);
      } catch (err: any) {
        console.warn('Analytics processing warning (handled):', err?.message || err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [orders, timeframe, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  // Today's Live Performance calculations
  const localToday = new Date();
  localToday.setHours(0,0,0,0);
  const startOfTodayMs = localToday.getTime();

  const todayOrders = orders.filter(order => {
    if (!order.createdat) return false;
    const orderTime = new Date(order.createdat).getTime();
    return orderTime >= startOfTodayMs;
  });

  const todaySales = todayOrders
    .filter(order => order.status !== 'Cancelled')
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  const todayPendingCount = todayOrders.filter(order => order.status === 'Pending').length;
  const todayProcessingCount = todayOrders.filter(order => ['Processing', 'Shipped', 'Delivered'].includes(order.status)).length;
  const todayProgressPercent = todayOrders.length > 0 ? Math.round((todayProcessingCount / todayOrders.length) * 100) : 100;

  // Operational Action Centers calculations
  const allPendingOrders = orders.filter(order => order.status === 'Pending');
  const lowStockProducts = products.filter(product => {
    const stockVal = Number(product.stock);
    return !isNaN(stockVal) && stockVal < 5;
  });

  const statCards = [
    { title: 'Total Sales', value: `৳${stats.totalSales.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500', action: () => setCurrentView('orders') },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'bg-blue-500', action: () => setCurrentView('orders') },
    { title: 'Total Users', value: stats.totalUsers.toString(), icon: Users, color: 'bg-amber-500', action: () => setCurrentView('users') },
    { title: 'Average Sales', value: `৳${stats.avgOrderValue.toLocaleString()}`, icon: BarChart3, color: 'bg-purple-500' },
  ];

  const ranges = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={stat.action}
            className={`bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm flex items-center gap-6 ${stat.action ? 'cursor-pointer hover:border-black/20 hover:shadow-md transition-all active:scale-[0.98]' : ''}`}
          >
            <div className={`w-14 h-14 ${stat.color}/10 rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 text-${stat.color.split('-')[1]}-600`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Live Performance & Operational Action Centers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Live Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-premium flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Today's Live Performance</h3>
                  <p className="text-[10px] font-black text-black/30 uppercase tracking-widest mt-1">Real-time stats</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping animate-pulse" />
                <span>LIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/[0.02] p-5 rounded-2xl border border-black/5">
                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">Today's Sales</p>
                <h4 className="text-xl font-black text-green-600">৳{todaySales.toLocaleString()}</h4>
              </div>
              <div className="bg-black/[0.02] p-5 rounded-2xl border border-black/5">
                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">Today's Orders</p>
                <h4 className="text-xl font-black text-black">{todayOrders.length}</h4>
              </div>
              <div className="bg-black/[0.02] p-5 rounded-2xl border border-black/5">
                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">Pending Today</p>
                <h4 className="text-xl font-black text-amber-600">{todayPendingCount}</h4>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Operational Action Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-premium flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Operational Action Center</h3>
                <p className="text-[10px] font-black text-black/30 uppercase tracking-widest mt-1">System Alerts & Tasks</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Alert 1: Pending Orders */}
              {allPendingOrders.length > 0 ? (
                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-4 transition-all hover:bg-rose-100/50">
                  <div className="w-12 h-12 bg-rose-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-rose-900 uppercase tracking-wider">Pending Orders Alert</h4>
                    <p className="text-xs font-bold text-rose-700/80 mt-1">
                      There are {allPendingOrders.length} pending orders waiting for fulfillment.
                    </p>
                    <button
                      onClick={() => setCurrentView('orders')}
                      className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm font-bold"
                    >
                      Process Orders
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-4 transition-all hover:bg-green-100/50">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-green-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-green-900 uppercase tracking-wider">Orders Status Clear</h4>
                    <p className="text-xs font-bold text-green-700/80 mt-1">
                      All orders are fully processed and up to date!
                    </p>
                  </div>
                </div>
              )}

              {/* Alert 2: Low Stock Alert */}
              {lowStockProducts.length > 0 ? (
                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4 transition-all hover:bg-amber-100/50">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-amber-900 uppercase tracking-wider">Critical Inventory Alert</h4>
                    <p className="text-xs font-bold text-amber-700/80 mt-1">
                      {lowStockProducts.length} items have critical stock level of less than 5 units.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {lowStockProducts.slice(0, 3).map((p, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-[9px] font-black text-amber-800">
                          {p.name}: {p.stock} left
                        </span>
                      ))}
                      {lowStockProducts.length > 3 && (
                        <span className="px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-[9px] font-black text-amber-800">
                          +{lowStockProducts.length - 3} more
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setCurrentView('inventory')}
                      className="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm font-bold"
                    >
                      Manage Inventory
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-4 transition-all hover:bg-green-100/50">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-green-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-green-900 uppercase tracking-wider">Stock Levels Healthy</h4>
                    <p className="text-xs font-bold text-green-700/80 mt-1">
                      All products have healthy inventory and adequate stock levels.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8">
        {(() => {
          const peakSales = chartData.length > 0 ? Math.max(...chartData.map(d => d.amount)) : 0;
          const totalSalesInPeriod = chartData.reduce((sum, d) => sum + d.amount, 0);
          const avgSales = chartData.length > 0 ? Math.round(totalSalesInPeriod / chartData.length) : 0;
          const activeSalesDays = chartData.filter(d => d.amount > 0).length;

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 sm:p-10 rounded-[3rem] border border-black/5 shadow-premium overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Sales Overview</h3>
                    <p className="text-xs font-bold text-black/30 uppercase tracking-widest mt-1">Revenue performance analytics</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-black/5 p-1 rounded-2xl self-start">
                  {ranges.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setTimeframe(r.value as any)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === r.value ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black/60'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Period Quick Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 bg-black/[0.01] border border-black/5 p-6 rounded-[2rem]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-black/30 uppercase tracking-widest">
                    {timeframe === 'daily' ? 'Peak Hourly Revenue' : timeframe === 'weekly' ? 'Peak Daily Revenue' : timeframe === 'monthly' ? 'Peak Monthly Revenue' : 'Peak Yearly Revenue'}
                  </span>
                  <span className="text-xl font-black text-black mt-1">৳{peakSales.toLocaleString()}</span>
                  <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Highest performance point
                  </span>
                </div>
                <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-black/5 pt-4 sm:pt-0 sm:pl-6">
                  <span className="text-[10px] font-black text-black/30 uppercase tracking-widest">
                    {timeframe === 'daily' ? 'Hourly Average' : timeframe === 'weekly' ? 'Daily Average' : timeframe === 'monthly' ? 'Monthly Average' : 'Yearly Average'}
                  </span>
                  <span className="text-xl font-black text-black mt-1">৳{avgSales.toLocaleString()}</span>
                  <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wider mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span> Normalised performance value
                  </span>
                </div>
                <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-black/5 pt-4 sm:pt-0 sm:pl-6">
                  <span className="text-[10px] font-black text-black/30 uppercase tracking-widest">
                    {timeframe === 'daily' ? 'Active Sales Hours' : timeframe === 'weekly' ? 'Active Sales Days' : timeframe === 'monthly' ? 'Active Months' : 'Active Years'}
                  </span>
                  <span className="text-xl font-black text-black mt-1">
                    {timeframe === 'daily' ? `${activeSalesDays} Hours` : timeframe === 'weekly' ? `${activeSalesDays} Days` : timeframe === 'monthly' ? `${activeSalesDays} Months` : `${activeSalesDays} Years`}
                  </span>
                  <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span> Active timeline markers
                  </span>
                </div>
              </div>

              <div className="w-full" style={{ height: '400px', minHeight: '400px' }}>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25}/>
                        <stop offset="50%" stopColor="#c084fc" stopOpacity={0.08}/>
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000005" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#00000040', fontWeight: 800 }}
                      dy={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#00000040', fontWeight: 800 }}
                      tickFormatter={(val) => `৳${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
                    />
                    <Tooltip 
                      cursor={{ stroke: '#00000010', strokeWidth: 1.5 }}
                      contentStyle={{ 
                        backgroundColor: '#000', 
                        borderRadius: '24px', 
                        border: 'none',
                        padding: '16px 20px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.25)'
                      }}
                      itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: '900' }}
                      labelStyle={{ color: '#ffffff60', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}
                      formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#4f46e5" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorSales)"
                      activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 3, fill: '#ffffff' }}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center justify-center gap-8 mt-10 pt-8 border-t border-t-black/5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-sm shadow-indigo-600/20 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
                    {timeframe === 'daily' ? 'Hourly Performance' : timeframe === 'weekly' ? 'Weekly Performance' : timeframe === 'monthly' ? 'Monthly Performance' : 'Yearly Performance'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500/30"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Projections Fill</span>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </div>
    </div>
  );
}

interface InventoryViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: string[];
  onDelete: (id: number | string) => void;
  onBulkDelete: (ids: (number | string)[]) => void;
  setEditingProduct: (p: Product) => void;
  setIsAddingNew: (val: boolean) => void;
  setSuccessMessage: (msg: string) => void;
}

function InventoryView({
  products,
  setProducts,
  categories,
  onDelete,
  onBulkDelete,
  setEditingProduct,
  setIsAddingNew,
  setSuccessMessage
}: InventoryViewProps) {
  const [inventoryTab, setInventoryTab] = useState<'all' | 'instock' | 'lowstock' | 'outstock' | 'latest'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'stock-asc' | 'stock-desc' | 'price-asc' | 'price-desc' | 'name-asc'>('newest');
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);

  // Calculations for Overview Cards
  const totalProductsCount = products.length;
  const inStockCount = products.filter(p => (Number(p.stock) || 0) > 0).length;
  const lowStockCount = products.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= 5).length;
  const outOfStockCount = products.filter(p => (Number(p.stock) || 0) === 0).length;
  const latestCount = products.filter(p => Boolean(p.islatest)).length;
  const totalStockValue = products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);

  // Filtered & Sorted Products
  const filteredProducts = products.filter(p => {
    // Search query match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      String(p.id).toLowerCase().includes(q);

    // Category filter
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    // Tab filter
    const stock = Number(p.stock) || 0;
    let matchesTab = true;
    if (inventoryTab === 'instock') matchesTab = stock > 0;
    else if (inventoryTab === 'lowstock') matchesTab = stock > 0 && stock <= 5;
    else if (inventoryTab === 'outstock') matchesTab = stock === 0;
    else if (inventoryTab === 'latest') matchesTab = Boolean(p.islatest);

    return matchesSearch && matchesCategory && matchesTab;
  }).sort((a, b) => {
    const stockA = Number(a.stock) || 0;
    const stockB = Number(b.stock) || 0;
    const priceA = Number(a.price) || 0;
    const priceB = Number(b.price) || 0;

    if (sortBy === 'stock-asc') return stockA - stockB;
    if (sortBy === 'stock-desc') return stockB - stockA;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    return String(b.id).localeCompare(String(a.id));
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: number | string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStockAdjust = async (productId: string | number, delta: number) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const currentStock = Number(target.stock) || 0;
    const newStock = Math.max(0, currentStock + delta);

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));

    try {
      const { error } = await supabase
        .from('products')
        .update({
          details: {
            sizes: target.sizes,
            volumes: target.volumes,
            stock: newStock,
            is_latest: target.islatest,
            images: target.images || [],
            delivery_days_min: target.delivery_days_min,
            delivery_days_max: target.delivery_days_max,
            delivery_charge: target.delivery_charge,
            delivery_charge_active: target.delivery_charge_active,
            cod_available: target.cod_available,
            change_of_mind_available: target.change_of_mind_available,
            easy_return_days: target.easy_return_days,
            warranty_available: target.warranty_available,
            warranty_duration: target.warranty_duration,
            store_name: target.store_name,
            seller_rating: target.seller_rating,
            ship_on_time: target.ship_on_time,
            chat_response_rate: target.chat_response_rate
          }
        })
        .eq('id', productId);

      if (error) {
        console.warn('Error updating stock in Supabase:', error.message);
      } else {
        setSuccessMessage(`Stock of '${target.name.slice(0, 18)}...' updated to ${newStock}`);
      }
    } catch (err) {
      console.error('Stock adjust error:', err);
    }
  };

  const handleDirectStockSet = async (productId: string | number, valueStr: string) => {
    const parsedVal = parseInt(valueStr, 10);
    if (isNaN(parsedVal)) return;
    const newStock = Math.max(0, parsedVal);
    const target = products.find(p => p.id === productId);
    if (!target || target.stock === newStock) return;

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));

    try {
      await supabase
        .from('products')
        .update({
          details: {
            sizes: target.sizes,
            volumes: target.volumes,
            stock: newStock,
            is_latest: target.islatest,
            images: target.images || [],
            delivery_days_min: target.delivery_days_min,
            delivery_days_max: target.delivery_days_max,
            delivery_charge: target.delivery_charge,
            delivery_charge_active: target.delivery_charge_active,
            cod_available: target.cod_available,
            change_of_mind_available: target.change_of_mind_available,
            easy_return_days: target.easy_return_days,
            warranty_available: target.warranty_available,
            warranty_duration: target.warranty_duration,
            store_name: target.store_name,
            seller_rating: target.seller_rating,
            ship_on_time: target.ship_on_time,
            chat_response_rate: target.chat_response_rate
          }
        })
        .eq('id', productId);

      setSuccessMessage('Stock updated successfully!');
    } catch (err) {
      console.error('Direct stock set error:', err);
    }
  };

  const handleToggleLatest = async (productId: string | number) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const newIsLatest = !target.islatest;

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, islatest: newIsLatest } : p));

    try {
      const { error } = await supabase
        .from('products')
        .update({ islatest: newIsLatest })
        .eq('id', productId);

      if (error) {
        console.warn('Error updating islatest:', error.message);
      } else {
        setSuccessMessage(`Product ${newIsLatest ? 'added to' : 'removed from'} latest showcase`);
      }
    } catch (err) {
      console.error('Latest toggle error:', err);
    }
  };

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      alert('No products found to download');
      return;
    }
    
    const headers = ["ID", "Product Name", "Category", "Price (BDT)", "Stock", "Stock Status", "Is Latest"];
    const rows = filteredProducts.map(p => {
      const stock = Number(p.stock) || 0;
      const status = stock === 0 ? "Out of Stock" : stock <= 5 ? "Low Stock" : "In Stock";
      return [
        `"${p.id}"`,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${(p.category || '').replace(/"/g, '""')}"`,
        p.price,
        stock,
        `"${status}"`,
        p.islatest ? "Yes" : "No"
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDeleteAction = () => {
    if (selectedIds.length === 0) return;
    onBulkDelete(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Seller Center Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white rounded-[2rem] p-6 sm:p-8 shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md flex items-center gap-1.5">
                <Boxes className="w-3 h-3" />
                Store Inventory
              </span>
              <span className="text-xs text-white/50 font-bold">• Stock & Products</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Inventory Management Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl font-medium">
              Manage and update product stock, pricing, and categories for your store in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs backdrop-blur-md transition-all border border-white/10 hover:border-white/30"
              title="Download CSV Report"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Report</span>
            </button>
            <button 
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-2xl font-bold text-xs shadow-lg shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Widgets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between text-white/60 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider">Total Products</span>
              <Boxes className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white">{totalProductsCount}</p>
            <p className="text-[9px] text-white/40 mt-1 font-bold">All Active SKUs</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between text-white/60 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">In Stock</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400">{inStockCount}</p>
            <p className="text-[9px] text-emerald-400/60 mt-1 font-bold">Ready for Shipment</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between text-white/60 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Low Stock (&le; 5)</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400">{lowStockCount}</p>
            <p className="text-[9px] text-amber-400/60 mt-1 font-bold">Needs Restock</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between text-white/60 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">Out of Stock</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-black text-rose-400">{outOfStockCount}</p>
            <p className="text-[9px] text-rose-400/60 mt-1 font-bold">Not Available</p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between text-white/60 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">Total Inventory Value</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-purple-300">৳{totalStockValue.toLocaleString()}</p>
            <p className="text-[9px] text-purple-300/60 mt-1 font-bold">Total Stock Value</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Filter Tabs (Desktop) */}
      <div className="hidden md:flex bg-white p-2 rounded-2xl border border-black/5 shadow-sm items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setInventoryTab('all')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            inventoryTab === 'all' 
              ? 'bg-black text-white shadow-md shadow-black/20' 
              : 'text-black/60 hover:bg-black/5 hover:text-black'
          }`}
        >
          <span>All Products</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            inventoryTab === 'all' ? 'bg-white/20 text-white' : 'bg-black/5 text-black/60'
          }`}>
            {totalProductsCount}
          </span>
        </button>

        <button
          onClick={() => setInventoryTab('instock')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            inventoryTab === 'instock' 
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
              : 'text-black/60 hover:bg-black/5 hover:text-black'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>In Stock</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            inventoryTab === 'instock' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
          }`}>
            {inStockCount}
          </span>
        </button>

        <button
          onClick={() => setInventoryTab('lowstock')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            inventoryTab === 'lowstock' 
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
              : 'text-black/60 hover:bg-black/5 hover:text-black'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
          <span>Low Stock</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            inventoryTab === 'lowstock' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'
          }`}>
            {lowStockCount}
          </span>
        </button>

        <button
          onClick={() => setInventoryTab('outstock')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            inventoryTab === 'outstock' 
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
              : 'text-black/60 hover:bg-black/5 hover:text-black'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-300"></span>
          <span>Out of Stock</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            inventoryTab === 'outstock' ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-700'
          }`}>
            {outOfStockCount}
          </span>
        </button>

        <button
          onClick={() => setInventoryTab('latest')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            inventoryTab === 'latest' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
              : 'text-black/60 hover:bg-black/5 hover:text-black'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Latest Items</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            inventoryTab === 'latest' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
          }`}>
            {latestCount}
          </span>
        </button>
      </div>

      {/* Control Bar: Search, Category Filter & Mobile Status Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-black/5 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
          <input 
            type="text"
            placeholder="Search by product name, ID or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-black/5 rounded-2xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-black/20 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black/30 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Category Dropdown */}
          <div className="relative shrink-0 flex-1 sm:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 bg-gray-50 border border-black/5 rounded-2xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-black/20 appearance-none pr-8 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30 pointer-events-none" />
          </div>

          {/* Status Filter Dropdown (Mobile Only) */}
          <div className="relative shrink-0 flex-1 sm:flex-none md:hidden">
            <select
              value={inventoryTab}
              onChange={(e) => setInventoryTab(e.target.value as any)}
              className="w-full sm:w-auto px-4 py-3 bg-gray-50 border border-black/5 rounded-2xl text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-black/20 appearance-none pr-8 cursor-pointer"
            >
              <option value="all">All Products</option>
              <option value="instock">In Stock</option>
              <option value="lowstock">Low Stock</option>
              <option value="outstock">Out of Stock</option>
              <option value="latest">Latest Items</option>
            </select>
            <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Selected Items Floating Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-4 sticky top-24 z-20"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs border border-white/20">
                {selectedIds.length}
              </span>
              <div>
                <p className="text-xs font-bold text-white">{selectedIds.length === 1 ? 'Product Selected' : 'Products Selected'}</p>
                <p className="text-[10px] text-white/50">Choose bulk action</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleBulkDeleteAction}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected Products</span>
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Inventory Desktop Table View */}
      <div className="hidden md:block bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-black/5">
                <th className="px-6 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Product Info</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Category</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Price (BDT)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40 text-center">Adjust Stock</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Stock Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40 text-center">Latest Showcase</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-black/20 mb-4">
                        <Boxes className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-base text-black/70">No products found</h3>
                      <p className="text-xs text-black/40 mt-1">Try changing your search query or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const stock = Number(product.stock) || 0;
                  const isOutOfStock = stock === 0;
                  const isLowStock = stock > 0 && stock <= 5;

                  return (
                    <tr 
                      key={product.id} 
                      className={`hover:bg-gray-50/80 transition-colors group ${
                        selectedIds.includes(product.id) ? 'bg-gray-100/60' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                        />
                      </td>

                      {/* Product Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-black/5 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 relative">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm text-black group-hover:text-emerald-700 transition-colors truncate max-w-xs">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-mono text-black/40">ID: #{product.id}</span>
                              <span className="text-[10px] text-black/30">•</span>
                              <span className="text-[10px] font-bold text-black/40">{product.store_name || 'Online Store'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-black/70 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-black text-sm text-black">
                        ৳{product.price.toLocaleString()}
                      </td>

                      {/* Inline Stock Adjustment Control */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5 bg-gray-100 p-1 rounded-2xl border border-black/5 w-fit mx-auto">
                          <button
                            onClick={() => handleStockAdjust(product.id, -1)}
                            disabled={stock === 0}
                            className="w-7 h-7 rounded-xl bg-white text-black/70 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                            title="Decrease stock by 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          
                          <input
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val >= 0) {
                                setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: val } : p));
                              }
                            }}
                            onBlur={(e) => handleDirectStockSet(product.id, e.target.value)}
                            className="w-12 text-center text-xs font-black bg-transparent text-black focus:outline-none"
                          />

                          <button
                            onClick={() => handleStockAdjust(product.id, 1)}
                            className="w-7 h-7 rounded-xl bg-white text-black/70 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-all shadow-sm active:scale-95"
                            title="Increase stock by 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Stock Status Pill Badge */}
                      <td className="px-6 py-4">
                        {isOutOfStock ? (
                          <span className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                            <XCircle className="w-3 h-3 text-rose-500" />
                            Out of Stock (0)
                          </span>
                        ) : isLowStock ? (
                          <span className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            Low Stock ({stock})
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            In Stock ({stock})
                          </span>
                        )}
                      </td>

                      {/* Latest Showcase Switch */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleLatest(product.id)}
                          className={`w-11 h-6 rounded-full p-1 transition-colors relative cursor-pointer mx-auto ${
                            product.islatest ? 'bg-black' : 'bg-gray-200'
                          }`}
                          title="Show as latest on homepage"
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-md ${
                            product.islatest ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setEditingProduct(product)}
                            className="p-2.5 hover:bg-gray-100 rounded-xl text-black/60 hover:text-black transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDelete(product.id)}
                            className="p-2.5 hover:bg-rose-50 rounded-xl text-rose-400 hover:text-rose-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Inventory Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-black/5 shadow-sm">
            <Boxes className="w-10 h-10 text-black/20 mx-auto mb-2" />
            <p className="font-bold text-sm text-black/70">No products found</p>
          </div>
        ) : (
          filteredProducts.map(product => {
            const stock = Number(product.stock) || 0;
            const isOutOfStock = stock === 0;
            const isLowStock = stock > 0 && stock <= 5;

            return (
              <div 
                key={product.id} 
                className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Image with status badge */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border border-black/5 shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    {isOutOfStock && (
                      <span className="absolute bottom-0 inset-x-0 bg-rose-600/90 text-white text-[8px] font-black text-center py-0.5 uppercase tracking-tighter">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-black/40 uppercase tracking-wider">{product.category}</span>
                      <span className="text-[9px] font-mono text-black/30">#{product.id}</span>
                    </div>

                    <h4 className="font-bold text-sm text-black truncate mt-0.5">{product.name}</h4>
                    <p className="text-base font-black text-black mt-1">৳{product.price.toLocaleString()}</p>

                    <div className="flex items-center gap-2 mt-2">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-md text-[9px] font-black">
                          Out of Stock (0)
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[9px] font-black">
                          Low Stock ({stock})
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[9px] font-black">
                          In Stock ({stock})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Stock Adjuster & Latest Switch */}
                <div className="flex items-center justify-between pt-3 border-t border-black/5 gap-2">
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => handleStockAdjust(product.id, -1)}
                      disabled={stock === 0}
                      className="w-7 h-7 rounded-lg bg-white text-black active:bg-rose-100 disabled:opacity-30 flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-black">{stock}</span>
                    <button
                      onClick={() => handleStockAdjust(product.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white text-black active:bg-emerald-100 flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleLatest(product.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 ${
                        product.islatest ? 'bg-black text-white' : 'bg-gray-100 text-black/40'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      {product.islatest ? 'Latest' : 'Normal'}
                    </button>

                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="p-2 bg-gray-100 text-black/60 rounded-xl"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => onDelete(product.id)}
                      className="p-2 bg-rose-50 text-rose-500 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function UsersView({ setSuccessMessage }: { setSuccessMessage: (msg: string) => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('Failed to fetch') || msg.includes('network')) {
        console.warn('Error fetching users (network):', msg);
      } else {
        console.error('Error fetching users:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      setUpdatingId(userId);
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId);
        
        if (error) throw error;
        
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setSuccessMessage('ইউজার রোল সফল ভাবে আপডেট হয়েছে।');
      } catch (err: any) {
        alert('Error updating role: ' + err.message);
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
        <input 
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full min-h-[70px] pl-14 pr-6 bg-white border border-black/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm font-bold"
        />
      </div>

      {/* Desktop View Table */}
      <div className="hidden md:block bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">User</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Email</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-black/5 flex-shrink-0 border border-black/5">
                        {user.photourl ? (
                          <img src={user.photourl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-black/20">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-none">{user.name || 'No Name'}</p>
                        <p className="text-[10px] text-black/40 mt-1 uppercase tracking-widest font-black">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-black/60">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-black text-white' : 'bg-black/5 text-black/40'}`}>
                      {user.role || 'customer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center bg-black/5 p-1 rounded-xl">
                      <button 
                        disabled={updatingId === user.id}
                        onClick={() => handleRoleChange(user.id, 'customer')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${user.role !== 'admin' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'}`}
                      >
                        User
                      </button>
                      <button 
                        disabled={updatingId === user.id}
                        onClick={() => handleRoleChange(user.id, 'admin')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${user.role === 'admin' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'}`}
                      >
                        Admin
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View Cards */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map(user => (
          <motion.div 
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-black/5 flex-shrink-0 border border-black/5">
                {user.photourl ? (
                  <img src={user.photourl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/20">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-base truncate">{user.name || 'No Name'}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-black text-white' : 'bg-black/5 text-black/40'}`}>
                    {user.role || 'customer'}
                  </span>
                </div>
                <p className="text-xs text-black/40 truncate">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-black/5 gap-3">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-black/20">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
              <div className="flex items-center bg-black/5 p-1 rounded-xl">
                <button 
                  disabled={updatingId === user.id}
                  onClick={() => handleRoleChange(user.id, 'customer')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${user.role !== 'admin' ? 'bg-white text-black shadow-sm' : 'text-black/40'}`}
                >
                  User
                </button>
                <button 
                  disabled={updatingId === user.id}
                  onClick={() => handleRoleChange(user.id, 'admin')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${user.role === 'admin' ? 'bg-white text-black shadow-sm' : 'text-black/40'}`}
                >
                  Admin
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
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
  const { currentUser, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders' | 'users' | 'settings'>('analytics');

  // Use URL search params to control current view
  const [searchParams] = useSearchParams();
  const viewParam = searchParams.get('view') as 'analytics' | 'inventory' | 'orders' | 'users' | 'settings' | null;

  // View state for specific "pages"
  const [currentView, setCurrentView] = useState<'analytics' | 'inventory' | 'orders' | 'users' | 'settings'>(viewParam || 'analytics');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null) setUserCount(count);
      } catch (err: any) {
        const msg = err?.message || String(err);
        if (msg.includes('Failed to fetch') || msg.includes('network')) {
          console.warn('Error fetching user count (network):', msg);
        } else {
          console.error('Error fetching user count:', err);
        }
      }
    };
    fetchUserCount();
  }, []);

  useEffect(() => {
    if (viewParam && ['analytics', 'inventory', 'orders', 'users', 'settings'].includes(viewParam)) {
      setCurrentView(viewParam);
    }
  }, [viewParam]);

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
    category: settings.categories?.[0] || 'Panjabi',
    image: '',
    rating: 4.5,
    description: '',
    stock: 0,
    sizes: [],
    volumes: [],
    islatest: false,
    images: [],
    delivery_days_min: 2,
    delivery_days_max: 5,
    delivery_charge: 110,
    delivery_charge_active: true,
    cod_available: true,
    change_of_mind_available: true,
    easy_return_days: 14,
    warranty_available: false,
    warranty_duration: 'Warranty not available',
    store_name: 'Buy More Save More Store',
    seller_rating: '88%',
    ship_on_time: '100%',
    chat_response_rate: 'Not enough data'
  };

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(initialProductState);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Let AuthContext handle the user state update. 
    } catch (err: any) {
      setLoginError(err.message || 'Invalid email or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDelete = (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(id);
      setSelectedIds(prev => prev.filter(selectedId => String(selectedId) !== String(id)));
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

  const toggleSelect = (id: number | string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || isSaving) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          category: editingProduct.category,
          image: editingProduct.image,
          details: {
            sizes: editingProduct.sizes,
            volumes: editingProduct.volumes,
            stock: editingProduct.stock,
            is_latest: editingProduct.islatest,
            images: editingProduct.images || [],
            delivery_days_min: editingProduct.delivery_days_min,
            delivery_days_max: editingProduct.delivery_days_max,
            delivery_charge: editingProduct.delivery_charge,
            delivery_charge_active: editingProduct.delivery_charge_active,
            cod_available: editingProduct.cod_available,
            change_of_mind_available: editingProduct.change_of_mind_available,
            easy_return_days: editingProduct.easy_return_days,
            warranty_available: editingProduct.warranty_available,
            warranty_duration: editingProduct.warranty_duration,
            store_name: editingProduct.store_name,
            seller_rating: editingProduct.seller_rating,
            ship_on_time: editingProduct.ship_on_time,
            chat_response_rate: editingProduct.chat_response_rate
          }
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      setSuccessMessage('সফল ভাবে আপডেট হয়েছে।');
    } catch (err: any) {
      alert('Error updating product: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('products').insert({
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        category: newProduct.category,
        image: newProduct.image,
        details: {
          sizes: newProduct.sizes,
          volumes: newProduct.volumes,
          stock: Number(newProduct.stock),
          is_latest: newProduct.islatest,
          images: newProduct.images || [],
          delivery_days_min: newProduct.delivery_days_min,
          delivery_days_max: newProduct.delivery_days_max,
          delivery_charge: newProduct.delivery_charge,
          delivery_charge_active: newProduct.delivery_charge_active,
          cod_available: newProduct.cod_available,
          change_of_mind_available: newProduct.change_of_mind_available,
          easy_return_days: newProduct.easy_return_days,
          warranty_available: newProduct.warranty_available,
          warranty_duration: newProduct.warranty_duration,
          store_name: newProduct.store_name,
          seller_rating: newProduct.seller_rating,
          ship_on_time: newProduct.ship_on_time,
          chat_response_rate: newProduct.chat_response_rate
        }
      }).select().single();

      if (error) throw error;

      const productToAdd = { 
        ...newProduct, 
        id: data.id 
      } as Product;
      
      setProducts(prev => [productToAdd, ...prev]);
      setIsAddingNew(false);
      setNewProduct(initialProductState);
      setSuccessMessage('সফল ভাবে এড হয়েছে।');
    } catch (err: any) {
       alert('Error adding product: ' + err.message);
    } finally {
      setIsSaving(false);
    }
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

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEdit && editingProduct) {
          const currentImages = [...(editingProduct.images || [])];
          currentImages[index] = base64String;
          setEditingProduct({ ...editingProduct, images: currentImages });
        } else {
          const currentImages = [...(newProduct.images || [])];
          currentImages[index] = base64String;
          setNewProduct({ ...newProduct, images: currentImages });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageUrlChange = (url: string, index: number, isEdit: boolean) => {
    if (isEdit && editingProduct) {
      const currentImages = [...(editingProduct.images || [])];
      currentImages[index] = url;
      setEditingProduct({ ...editingProduct, images: currentImages });
    } else {
      const currentImages = [...(newProduct.images || [])];
      currentImages[index] = url;
      setNewProduct({ ...newProduct, images: currentImages });
    }
  };

  const handleRemoveAdditionalImage = (index: number, isEdit: boolean) => {
    if (isEdit && editingProduct) {
      const currentImages = [...(editingProduct.images || [])];
      currentImages.splice(index, 1);
      setEditingProduct({ ...editingProduct, images: currentImages });
    } else {
      const currentImages = [...(newProduct.images || [])];
      currentImages.splice(index, 1);
      setNewProduct({ ...newProduct, images: currentImages });
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

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center font-bold">Checking access...</div>;
  }

  const isLoggedIn = currentUser !== null;
  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
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

          {isLoggedIn && !isAdmin ? (
            <div className="text-center mb-6 p-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-red-600 font-bold mb-2">Access Denied</p>
              <p className="text-sm text-red-500/80 mb-4">You are logged in as a normal customer. Please log out and sign in with an admin account.</p>
              <button 
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
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
                disabled={isLoggingIn}
                className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-black/90 transition-all shadow-xl disabled:opacity-50"
              >
                {isLoggingIn ? 'Logging in...' : 'Sign In'}
              </button>
            </form>
          )}

          {!isLoggedIn && (
            <div className="mt-8 text-center">
              <p className="text-xs text-black/30">
                Demo Access: admin@alhurumah.com / admin123
              </p>
            </div>
          )}
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
              <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold mt-1">
                {currentView === 'analytics' ? 'Business Overview' : 
                 currentView === 'inventory' ? 'Inventory Management' : 
                 currentView === 'orders' ? `Manage Orders (${orders.length})` : 
                 currentView === 'users' ? 'User Management' :
                 'Store Settings'}
              </p>
            </div>
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
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className="fixed bottom-6 right-6 z-[9999] min-w-[320px] max-w-sm bg-white border border-green-200 shadow-2xl rounded-3xl p-5 flex items-start gap-4 overflow-hidden"
            >
              {/* Left border line or decorative bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500 rounded-l-3xl" />
              
              {/* Check Circle Icon with animation */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0 border border-green-100"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </motion.div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 pr-6">
                <h4 className="text-sm font-black text-green-900 tracking-tight">কর্মসম্পাদন সফল হয়েছে!</h4>
                <p className="text-xs font-bold text-black/50 mt-1 leading-normal break-words">{successMessage}</p>
              </div>

              {/* Dismiss Button */}
              <button 
                onClick={() => setSuccessMessage('')}
                className="absolute right-4 top-4 p-1.5 hover:bg-black/5 rounded-xl text-black/40 hover:text-black/70 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Progress bar line to show cooldown */}
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Stats & Search for Orders */}
        {currentView === 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm group">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-black/40 uppercase tracking-widest">
                  Total Orders
                </p>
                <ShoppingBag className="w-4 h-4 text-black/10 transition-colors" />
              </div>
              <p className="text-3xl font-black">
                {orders.length}
              </p>
              <p className="text-[10px] text-black/40 font-bold mt-1 flex items-center gap-1">
                All registered orders
              </p>
            </div>
            <div className="md:col-span-2 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
              <input 
                type="text"
                placeholder="Search by Order ID or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-full min-h-[70px] pl-14 pr-6 bg-white border border-black/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
              />
            </div>
          </div>
        )}

        {currentView === 'analytics' ? (
          <AnalyticsView orders={orders} products={products} setCurrentView={setCurrentView} />
        ) : currentView === 'users' ? (
          <UsersView setSuccessMessage={setSuccessMessage} />
        ) : currentView === 'inventory' ? (
          <InventoryView 
            products={products}
            setProducts={setProducts}
            categories={settings.categories || ['Panjabi', 'Attar']}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            setEditingProduct={setEditingProduct}
            setIsAddingNew={setIsAddingNew}
            setSuccessMessage={setSuccessMessage}
          />
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

      {/* Edit/Add Modal - Modern Seller Center UI */}
      <AnimatePresence>
        {(editingProduct || isAddingNew) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-black/10"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-black/5 bg-slate-900 text-white flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 border border-white/10">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[9px] font-black uppercase tracking-widest border border-amber-400/30">
                        Seller Center
                      </span>
                      <span className="text-xs text-white/50 font-bold">• Product Management</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold mt-0.5 truncate max-w-md">
                      {isAddingNew ? 'Add New Product' : `Edit Product: ${editingProduct?.name || ''}`}
                    </h2>
                  </div>
                </div>
                <button 
                  onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                  className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form 
                onSubmit={isAddingNew ? handleAddNew : handleSaveEdit}
                className="p-5 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50"
              >
                {/* 1. Basic Information */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-black/5 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-black/5">
                    <Package className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
                      1. Basic Information (প্রাথমিক তথ্য)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-2 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">
                          Product Name <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-black/35 font-mono">
                          {(isAddingNew ? newProduct.name : (editingProduct?.name || '')).length}/200
                        </span>
                      </div>
                      <div className="relative">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                        <input 
                          required
                          type="text"
                          maxLength={200}
                          placeholder="e.g. Exclusive Premium Cotton Panjabi..."
                          value={isAddingNew ? newProduct.name : (editingProduct?.name || '')}
                          onChange={(e) => isAddingNew 
                            ? setNewProduct({...newProduct, name: e.target.value})
                            : setEditingProduct({...editingProduct!, name: e.target.value})
                          }
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-black/5 rounded-2xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">
                        Category <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                        <select 
                          value={isAddingNew ? newProduct.category : (editingProduct?.category || '')}
                          onChange={(e) => isAddingNew 
                            ? setNewProduct({...newProduct, category: e.target.value})
                            : setEditingProduct({...editingProduct!, category: e.target.value})
                          }
                          className="w-full pl-11 pr-8 py-3 bg-gray-50 border border-black/5 rounded-2xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all appearance-none cursor-pointer"
                        >
                          {settings.categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">
                      Product Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Write comprehensive product description, specs, fabric guidelines, and details for buyers..."
                      value={isAddingNew ? newProduct.description : (editingProduct?.description || '')}
                      onChange={(e) => isAddingNew 
                        ? setNewProduct({...newProduct, description: e.target.value})
                        : setEditingProduct({...editingProduct!, description: e.target.value})
                      }
                      className="w-full p-4 bg-gray-50 border border-black/5 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* 2. Product Media Gallery */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-black/5 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-black/5">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-slate-700" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
                        2. Images & Gallery (প্রোডাক্ট ছবি ও গ্যালারি)
                      </h3>
                    </div>
                    <span className="text-[10px] text-black/40 font-bold">High Quality 1:1 Images Recommended</span>
                  </div>

                  {/* Main Cover Image */}
                  <div className="p-4 bg-slate-50 border border-black/5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                        Main Cover Image (Required)
                      </label>
                      <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase tracking-wider">Primary</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <div className="sm:col-span-2 space-y-2">
                        <div className="relative">
                          <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                          <input 
                            required
                            type="text"
                            value={isAddingNew ? newProduct.image : (editingProduct?.image || '')}
                            onChange={(e) => isAddingNew 
                              ? setNewProduct({...newProduct, image: e.target.value})
                              : setEditingProduct({...editingProduct!, image: e.target.value})
                            }
                            placeholder="Paste image URL..."
                            className="w-full pl-10 pr-3 py-2.5 bg-white border border-black/10 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-slate-900"
                          />
                        </div>
                        <label className="flex items-center justify-center gap-2 py-2.5 bg-white border border-dashed border-slate-300 hover:border-slate-800 rounded-xl cursor-pointer transition-all">
                          <Upload className="w-3.5 h-3.5 text-slate-600" />
                          <span className="text-xs font-bold text-slate-700">Upload Image File</span>
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, !isAddingNew)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex justify-center sm:justify-end">
                        {(isAddingNew ? newProduct.image : editingProduct?.image) ? (
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-900 shadow-md">
                            <img 
                              src={isAddingNew ? newProduct.image : editingProduct?.image} 
                              alt="Cover Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center text-slate-300">
                            <ImageIcon className="w-6 h-6" />
                            <span className="text-[8px] font-bold mt-1">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Product Images Gallery */}
                  <div className="space-y-3 pt-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">
                      Gallery Images (Up to 4 slots)
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[0, 1, 2, 3].map((index) => {
                        const imagesList = isAddingNew ? (newProduct.images || []) : (editingProduct?.images || []);
                        const currentImageUrl = imagesList[index] || '';

                        return (
                          <div key={index} className="p-3 bg-slate-50 border border-black/5 rounded-2xl flex flex-col justify-between space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black uppercase text-black/40">Slot {index + 1}</span>
                              {currentImageUrl && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              )}
                            </div>
                            
                            {currentImageUrl ? (
                              <div className="relative group aspect-square rounded-xl overflow-hidden border border-black/10">
                                <img src={currentImageUrl} alt={`Slot ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAdditionalImage(index, !isAddingNew)}
                                  className="absolute inset-0 bg-slate-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <input 
                                  type="text"
                                  placeholder="Image URL..."
                                  value={currentImageUrl}
                                  onChange={(e) => handleAdditionalImageUrlChange(e.target.value, index, !isAddingNew)}
                                  className="w-full px-2.5 py-1.5 bg-white border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-[10px] font-bold"
                                />
                                <label className="flex items-center justify-center gap-1 py-1.5 bg-white hover:bg-slate-100 rounded-lg border border-dashed border-slate-300 cursor-pointer transition-all">
                                  <Upload className="w-3 h-3 text-slate-500" />
                                  <span className="text-[9px] font-bold text-slate-600">Upload</span>
                                  <input 
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleAdditionalImageUpload(e, index, !isAddingNew)}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Pricing & Inventory */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-black/5 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-black/5">
                    <DollarSign className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
                      3. Pricing & Stock Inventory (মূল্য ও স্টক)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">
                        Price (৳ BDT) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-sm text-slate-400">৳</span>
                        <input 
                          required
                          type="number"
                          min="0"
                          value={isAddingNew ? newProduct.price : (editingProduct?.price ?? 0)}
                          onChange={(e) => isAddingNew 
                            ? setNewProduct({...newProduct, price: Number(e.target.value)})
                            : setEditingProduct({...editingProduct!, price: Number(e.target.value)})
                          }
                          className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-black/5 rounded-2xl text-xs font-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">
                          Stock Quantity <span className="text-rose-500">*</span>
                        </label>
                        {((isAddingNew ? newProduct.stock : (editingProduct?.stock ?? 0)) === 0) ? (
                          <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">Out of Stock</span>
                        ) : ((isAddingNew ? newProduct.stock : (editingProduct?.stock ?? 0)) <= 5) ? (
                          <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Low Stock</span>
                        ) : (
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">In Stock</span>
                        )}
                      </div>
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
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-black/5 rounded-2xl text-xs font-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-end">
                      <div 
                        onClick={() => isAddingNew 
                          ? setNewProduct({...newProduct, islatest: !newProduct.islatest})
                          : setEditingProduct({...editingProduct!, islatest: !editingProduct?.islatest})
                        }
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          (isAddingNew ? newProduct.islatest : editingProduct?.islatest) 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                            : 'bg-gray-50 text-slate-700 border-black/5 hover:border-black/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className={`w-4 h-4 ${(isAddingNew ? newProduct.islatest : editingProduct?.islatest) ? 'text-amber-400' : 'text-slate-400'}`} />
                          <div>
                            <p className="text-xs font-black">Latest Showcase</p>
                            <p className="text-[9px] opacity-60">Show in home hero slider</p>
                          </div>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${
                          (isAddingNew ? newProduct.islatest : editingProduct?.islatest) ? 'bg-amber-400' : 'bg-black/20'
                        }`}>
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                            (isAddingNew ? newProduct.islatest : editingProduct?.islatest) ? 'left-4.5' : 'left-0.5'
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Logistics, Delivery & Services */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-black/5 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-black/5">
                    <Truck className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
                      4. Delivery & Service Logistics (ডেলিভারি ও সার্ভিস সেটিং)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">
                        Standard Delivery Charge (৳ BDT)
                      </label>
                      <input 
                        type="number"
                        min="0"
                        value={isAddingNew ? (newProduct.delivery_charge ?? 110) : (editingProduct?.delivery_charge ?? 110)}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, delivery_charge: Number(e.target.value)})
                          : setEditingProduct({...editingProduct!, delivery_charge: Number(e.target.value)})
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-black/5 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">
                          Min Days
                        </label>
                        <input 
                          type="number"
                          min="1"
                          value={isAddingNew ? (newProduct.delivery_days_min ?? 2) : (editingProduct?.delivery_days_min ?? 2)}
                          onChange={(e) => isAddingNew 
                            ? setNewProduct({...newProduct, delivery_days_min: Number(e.target.value)})
                            : setEditingProduct({...editingProduct!, delivery_days_min: Number(e.target.value)})
                          }
                          className="w-full px-4 py-2.5 bg-gray-50 border border-black/5 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">
                          Max Days
                        </label>
                        <input 
                          type="number"
                          min="1"
                          value={isAddingNew ? (newProduct.delivery_days_max ?? 5) : (editingProduct?.delivery_days_max ?? 5)}
                          onChange={(e) => isAddingNew 
                            ? setNewProduct({...newProduct, delivery_days_max: Number(e.target.value)})
                            : setEditingProduct({...editingProduct!, delivery_days_max: Number(e.target.value)})
                          }
                          className="w-full px-4 py-2.5 bg-gray-50 border border-black/5 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div 
                      onClick={() => isAddingNew 
                        ? setNewProduct({...newProduct, delivery_charge_active: !(newProduct.delivery_charge_active ?? true)})
                        : setEditingProduct({...editingProduct!, delivery_charge_active: !(editingProduct?.delivery_charge_active ?? true)})
                      }
                      className="p-3 bg-slate-50 border border-black/5 rounded-xl flex items-center justify-between cursor-pointer hover:border-black/20 transition-all"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">Standard Delivery</p>
                        <p className="text-[9px] text-slate-500">Show shipping options</p>
                      </div>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${
                        (isAddingNew ? (newProduct.delivery_charge_active ?? true) : (editingProduct?.delivery_charge_active ?? true)) ? 'bg-emerald-500' : 'bg-black/10'
                      }`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                          (isAddingNew ? (newProduct.delivery_charge_active ?? true) : (editingProduct?.delivery_charge_active ?? true)) ? 'left-4.5' : 'left-0.5'
                        }`} />
                      </div>
                    </div>

                    <div 
                      onClick={() => isAddingNew 
                        ? setNewProduct({...newProduct, cod_available: !(newProduct.cod_available ?? true)})
                        : setEditingProduct({...editingProduct!, cod_available: !(editingProduct?.cod_available ?? true)})
                      }
                      className="p-3 bg-slate-50 border border-black/5 rounded-xl flex items-center justify-between cursor-pointer hover:border-black/20 transition-all"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">Cash On Delivery</p>
                        <p className="text-[9px] text-slate-500">Enable COD payment</p>
                      </div>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${
                        (isAddingNew ? (newProduct.cod_available ?? true) : (editingProduct?.cod_available ?? true)) ? 'bg-emerald-500' : 'bg-black/10'
                      }`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                          (isAddingNew ? (newProduct.cod_available ?? true) : (editingProduct?.cod_available ?? true)) ? 'left-4.5' : 'left-0.5'
                        }`} />
                      </div>
                    </div>

                    <div 
                      onClick={() => isAddingNew 
                        ? setNewProduct({...newProduct, change_of_mind_available: !(newProduct.change_of_mind_available ?? true)})
                        : setEditingProduct({...editingProduct!, change_of_mind_available: !(editingProduct?.change_of_mind_available ?? true)})
                      }
                      className="p-3 bg-slate-50 border border-black/5 rounded-xl flex items-center justify-between cursor-pointer hover:border-black/20 transition-all"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">Change of Mind</p>
                        <p className="text-[9px] text-slate-500">Allow return policy</p>
                      </div>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${
                        (isAddingNew ? (newProduct.change_of_mind_available ?? true) : (editingProduct?.change_of_mind_available ?? true)) ? 'bg-emerald-500' : 'bg-black/10'
                      }`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                          (isAddingNew ? (newProduct.change_of_mind_available ?? true) : (editingProduct?.change_of_mind_available ?? true)) ? 'left-4.5' : 'left-0.5'
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Warranty & Seller Information */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-black/5 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-black/5">
                    <User className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
                      5. Warranty & Seller Profile (ওয়ারেন্টি ও সেলার প্রোফাইল)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div 
                      onClick={() => isAddingNew 
                        ? setNewProduct({...newProduct, warranty_available: !(newProduct.warranty_available ?? false)})
                        : setEditingProduct({...editingProduct!, warranty_available: !(editingProduct?.warranty_available ?? false)})
                      }
                      className="p-3 bg-slate-50 border border-black/5 rounded-xl flex items-center justify-between cursor-pointer hover:border-black/20 transition-all"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">Warranty Protection</p>
                        <p className="text-[9px] text-slate-500">Enable brand/store warranty</p>
                      </div>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${
                        (isAddingNew ? (newProduct.warranty_available ?? false) : (editingProduct?.warranty_available ?? false)) ? 'bg-emerald-500' : 'bg-black/10'
                      }`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                          (isAddingNew ? (newProduct.warranty_available ?? false) : (editingProduct?.warranty_available ?? false)) ? 'left-4.5' : 'left-0.5'
                        }`} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">
                        Warranty Duration / Details
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. 1 Year Official Brand Warranty"
                        value={isAddingNew ? (newProduct.warranty_duration || '') : (editingProduct?.warranty_duration || '')}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, warranty_duration: e.target.value})
                          : setEditingProduct({...editingProduct!, warranty_duration: e.target.value})
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-black/5 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-black/5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-black/40">Store Name</label>
                      <input 
                        type="text"
                        value={isAddingNew ? (newProduct.store_name || 'Buy More Save More Store') : (editingProduct?.store_name || 'Buy More Save More Store')}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, store_name: e.target.value})
                          : setEditingProduct({...editingProduct!, store_name: e.target.value})
                        }
                        className="w-full px-3 py-2 bg-gray-50 border border-black/5 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-black/40">Seller Rating</label>
                      <input 
                        type="text"
                        placeholder="e.g. 88%"
                        value={isAddingNew ? (newProduct.seller_rating || '88%') : (editingProduct?.seller_rating || '88%')}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, seller_rating: e.target.value})
                          : setEditingProduct({...editingProduct!, seller_rating: e.target.value})
                        }
                        className="w-full px-3 py-2 bg-gray-50 border border-black/5 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-black/40">Ship on Time</label>
                      <input 
                        type="text"
                        placeholder="e.g. 100%"
                        value={isAddingNew ? (newProduct.ship_on_time || '100%') : (editingProduct?.ship_on_time || '100%')}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, ship_on_time: e.target.value})
                          : setEditingProduct({...editingProduct!, ship_on_time: e.target.value})
                        }
                        className="w-full px-3 py-2 bg-gray-50 border border-black/5 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-black/40">Chat Response</label>
                      <input 
                        type="text"
                        placeholder="e.g. 95%"
                        value={isAddingNew ? (newProduct.chat_response_rate || 'Not enough data') : (editingProduct?.chat_response_rate || 'Not enough data')}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, chat_response_rate: e.target.value})
                          : setEditingProduct({...editingProduct!, chat_response_rate: e.target.value})
                        }
                        className="w-full px-3 py-2 bg-gray-50 border border-black/5 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-50/90 backdrop-blur-md p-4 rounded-2xl border border-black/5">
                  <button 
                    type="button"
                    onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                    className="px-6 py-3 bg-white border border-black/10 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving Product...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {isAddingNew ? 'Publish Product' : 'Save Changes'}
                      </>
                    )}
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
