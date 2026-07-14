import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingBag, ArrowLeft, Minus, Plus, MapPin, Truck, Heart, Clock, Shield, Info, X } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface ProductDetailsProps {
  products: Product[];
  addToCart: (product: Product, selectedAttr?: string, openCart?: boolean, quantity?: number) => void;
}

export default function ProductDetails({ products, addToCart }: ProductDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useAuth();
  
  const [selectedAttr, setSelectedAttr] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Delivery address states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [guestAddress, setGuestAddress] = useState('');
  const [newAddressInput, setNewAddressInput] = useState('');

  const product = products.find(p => String(p.id) === String(id));

  useEffect(() => {
    setSelectedImage(null);
    setSelectedAttr(null);
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-black text-white rounded-full"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  const handleSaveAddress = async (newAddr: string) => {
    if (currentUser && currentUser.id) {
      try {
        // Update profile in Supabase database
        const { error } = await supabase
          .from('profiles')
          .update({ address: newAddr })
          .eq('id', currentUser.id);

        if (error) throw error;

        // Sync with Auth metadata
        await supabase.auth.updateUser({
          data: { address: newAddr }
        });

        // Trigger context refresh
        if (refreshUser) {
          await refreshUser();
        }
      } catch (err) {
        console.error('Failed to update address in Supabase:', err);
      }
    } else {
      setGuestAddress(newAddr);
    }
    setShowAddressModal(false);
  };

  const getDeliveryDateRange = (minDays = 2, maxDays = 5) => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const minStr = minDate.toLocaleDateString('en-US', options);
    
    let maxStr = '';
    if (minDate.getMonth() === maxDate.getMonth()) {
      maxStr = maxDate.getDate().toString() + ' ' + maxDate.toLocaleDateString('en-US', { month: 'short' });
    } else {
      maxStr = maxDate.toLocaleDateString('en-US', options);
    }
    
    return `Get by ${minStr}-${maxStr}`;
  };

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const activeImage = selectedImage || product.image;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-black/60 hover:text-black mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Product Image & Gallery */}
        <div className="lg:col-span-4 flex flex-col gap-4 max-w-[420px] w-full mx-auto lg:mx-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gray-50 border border-black/5 shadow-md group"
          >
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-md animate-pulse">
                Low Stock
              </div>
            )}
          </motion.div>

          {/* Thumbnail Gallery (Daraz style) */}
          {allImages.length > 1 && (
            <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
              {allImages.map((imgUrl, idx) => {
                const isActive = imgUrl === activeImage;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 bg-white transition-all cursor-pointer ${
                      isActive ? 'border-amber-500 scale-95 shadow-sm' : 'border-black/5 hover:border-black/20'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 flex flex-col"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 bg-amber-600 text-white text-[8px] font-black uppercase tracking-[0.15em] rounded">Official Store</span>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-black/40">{product.category}</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-4 leading-snug">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-black/10'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-black tracking-widest">{product.rating}</span>
              </div>
              <div className="h-4 w-[1px] bg-black/10" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Verified Collection</span>
            </div>
          </div>

          <div className="mb-6 p-4 sm:p-5 bg-amber-50/30 rounded-2xl border border-amber-500/10">
            <div className="flex items-baseline gap-3 flex-wrap">
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-amber-600">৳{Number(product.price || 0).toFixed(0)}</p>
              {quantity > 1 && (
                <span className="text-xs sm:text-sm font-bold text-black/40 uppercase tracking-wider">
                  (৳{Number(product.price || 0).toFixed(0)} × {quantity} = <strong className="text-black/80">৳{(product.price * quantity).toFixed(0)}</strong>)
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${product.stock > 0 ? 'bg-white text-black border-black/5' : 'bg-red-50 text-red-700 border-red-100'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {product.stock > 0 ? `Inventory: ${product.stock} Units` : 'Stock Depleted'}
              </span>
            </div>
          </div>

          {/* Selection */}
          {(product.sizes?.length || product.volumes?.length) ? (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-black/80">
                {product.category === 'Panjabi' ? 'Select Size' : 'Select Volume'}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {product.category === 'Panjabi' ? (
                  product.sizes?.map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedAttr(size)}
                      className={`w-11 h-11 border rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        selectedAttr === size ? 'border-black bg-black text-white shadow-md' : 'border-black/10 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  product.volumes?.map(vol => (
                    <button 
                      key={vol} 
                      onClick={() => setSelectedAttr(vol)}
                      className={`px-3.5 h-11 border rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        selectedAttr === vol ? 'border-black bg-black text-white shadow-md' : 'border-black/10 hover:border-black'
                      }`}
                    >
                      {vol}
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : null}

          {/* Quantity Selector */}
          <div className="mb-6 flex items-center justify-between sm:justify-start gap-6 pt-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-black/80">Quantity</h3>
            <div className="flex items-center border border-black/10 rounded-xl bg-black/[0.02] p-1">
              <button 
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 active:scale-95 transition-all text-black/60 hover:text-black cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center font-black text-sm text-black">
                {quantity}
              </span>
              <button 
                type="button"
                onClick={() => {
                  const maxStock = product.stock !== undefined ? product.stock : 99;
                  setQuantity(prev => Math.min(maxStock > 0 ? maxStock : 99, prev + 1));
                }}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 active:scale-95 transition-all text-black/60 hover:text-black cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {product.stock !== undefined && product.stock > 0 && (
              <span className="text-[10px] font-bold text-black/40 uppercase tracking-wider">
                {product.stock} available
              </span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-black/80">Description</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button 
              onClick={() => {
                if ((product.sizes?.length || product.volumes?.length) && !selectedAttr) {
                  alert(`Please select a ${product.category === 'Panjabi' ? 'size' : 'volume'} first.`);
                  return;
                }
                addToCart(product, selectedAttr || undefined, false, quantity);
              }}
              className="flex-1 py-4 border-2 border-black rounded-xl font-black text-xs uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center group active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Add to Cart
            </button>
            <button 
              onClick={() => {
                if ((product.sizes?.length || product.volumes?.length) && !selectedAttr) {
                  alert(`Please select a ${product.category === 'Panjabi' ? 'size' : 'volume'} first.`);
                  return;
                }
                navigate('/checkout', { state: { expressProduct: product, selectedAttr: selectedAttr || undefined, quantity } });
              }}
              className="flex-1 py-4 bg-black hover:bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Express Buy Now
            </button>
          </div>
        </motion.div>

        {/* Daraz-Style Delivery, Return & Seller Info Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Delivery Options Card */}
          <div className="bg-gray-50/50 rounded-3xl p-5 border border-black/5 space-y-5">
            <div className="flex justify-between items-center text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Delivery Options</span>
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </div>

            {/* Address Row */}
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold leading-snug text-gray-800 break-words">
                  {currentUser?.address || guestAddress || 'Dhaka, Dhaka North, Banani'}
                </p>
                <button
                  onClick={() => {
                    setNewAddressInput(currentUser?.address || guestAddress || 'Dhaka, Dhaka North, Banani');
                    setShowAddressModal(true);
                  }}
                  className="text-[10px] font-black tracking-wider text-amber-600 hover:text-amber-700 transition-colors uppercase cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>

            <hr className="border-black/5" />

            {/* Standard Delivery Row */}
            {(product.delivery_charge_active ?? true) && (
              <div className="flex gap-3">
                <Truck className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-800">Standard Delivery</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {getDeliveryDateRange(product.delivery_days_min ?? 2, product.delivery_days_max ?? 5)}
                    </p>
                  </div>
                  <span className="text-xs font-black text-gray-900 flex-shrink-0">
                    ৳{(product.delivery_charge ?? 110)}
                  </span>
                </div>
              </div>
            )}

            {/* Cash on Delivery Row */}
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">
                  {(product.cod_available ?? true) ? 'Cash on Delivery Available' : 'Cash on Delivery are not Available now'}
                </p>
              </div>
            </div>
          </div>

          {/* Return & Warranty Card */}
          <div className="bg-gray-50/50 rounded-3xl p-5 border border-black/5 space-y-5">
            <div className="flex justify-between items-center text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Return & Warranty</span>
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </div>

            {/* Change of Mind Row */}
            <div className="flex gap-3">
              <Heart className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">
                  {(product.change_of_mind_available ?? true) ? 'Change of Mind Allowed' : 'Change of Mind Not Available'}
                </p>
              </div>
            </div>

            {/* Return Row */}
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">
                  {Number(product.easy_return_days ?? 14) > 0 
                    ? `${product.easy_return_days} Days Easy Return` 
                    : 'Return not available'}
                </p>
              </div>
            </div>

            {/* Warranty Row */}
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">
                  {(product.warranty_available ?? false) ? (product.warranty_duration || 'Warranty Available') : 'Warranty not available'}
                </p>
              </div>
            </div>
          </div>

          {/* Sold by Card */}
          <div className="bg-gray-50/50 rounded-3xl p-5 border border-black/5 space-y-4">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Sold by</p>
              <h4 className="text-sm font-black text-gray-800 truncate">
                {product.store_name || 'Buy More Save More Store'}
              </h4>
            </div>

            <hr className="border-black/5" />

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="space-y-1">
                <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 leading-tight">Positive Ratings</p>
                <p className="text-xs sm:text-sm font-black text-gray-800">
                  {product.seller_rating || '88%'}
                </p>
              </div>
              <div className="space-y-1 border-x border-black/5 px-1">
                <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 leading-tight">Ship on Time</p>
                <p className="text-xs sm:text-sm font-black text-gray-800">
                  {product.ship_on_time || '100%'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 leading-tight">Chat Response</p>
                <p className="text-xs sm:text-sm font-black text-gray-800 truncate">
                  {product.chat_response_rate || '95%'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Edit Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddressModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-black uppercase tracking-wider text-gray-900">Delivery Address</h3>
                <button 
                  onClick={() => setShowAddressModal(false)}
                  className="p-1 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Enter Delivery Address</label>
                  <textarea 
                    rows={3}
                    value={newAddressInput}
                    onChange={(e) => setNewAddressInput(e.target.value)}
                    placeholder="e.g. Dhaka, Dhaka North, Banani Road No. 12 - 19"
                    className="w-full px-4 py-3 bg-black/5 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black/15 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-3 border border-black/10 rounded-2xl text-xs font-bold hover:bg-black/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleSaveAddress(newAddressInput)}
                    className="flex-1 py-3 bg-black text-white rounded-2xl text-xs font-bold hover:bg-black/90 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Related Products or More Info could go here */}
    </div>
  );
}
