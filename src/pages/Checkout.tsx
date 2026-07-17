import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, CheckCircle2, Truck, CreditCard, Rocket } from 'lucide-react';
import { CartItem, Order, User, AppSettings } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  cartTotal: number;
  clearCart: () => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdat'>, shouldClearCart?: boolean) => Promise<Order>;
  currentUser: User | null;
  settings: AppSettings;
}

export default function Checkout({ cart, cartTotal, clearCart, placeOrder, currentUser, settings }: CheckoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<1 | 2>(1);

  const expressProduct = location.state?.expressProduct;
  const expressAttr = location.state?.selectedAttr;
  const expressQuantity = location.state?.quantity || 1;

  const activeCart = expressProduct ? [{
    ...expressProduct,
    quantity: expressQuantity,
    selectedAttr: expressAttr
  } as CartItem] : cart;

  const activeTotal = expressProduct ? Number(expressProduct.price || 0) * expressQuantity : cartTotal;

  const deliveryCharge = activeCart.reduce((sum, item) => {
    const isActive = item.delivery_charge_active ?? true;
    if (isActive) {
      return sum + (item.delivery_charge ?? 110);
    }
    return sum;
  }, 0);

  const grandTotal = activeTotal + deliveryCharge;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderInfo, setOrderInfo] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    phone: '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    city: '',
    area: '',
    paymentMethod: 'Cash on Delivery' as Order['paymentmethod'],
    transactionId: ''
  });

  if (activeCart.length === 0 && !isOrderPlaced) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-black/20" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-black/40 mb-8 text-center max-w-xs">Add some products to your cart before checking out.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-black text-white rounded-full font-bold"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const order = await placeOrder({
        customername: formData.fullName,
        customeremail: formData.email,
        customerphone: formData.phone,
        customeraddress: `${formData.address}, ${formData.area}, ${formData.city}`,
        items: activeCart,
        total: grandTotal,
        paymentmethod: formData.paymentMethod,
        transactionid: formData.paymentMethod !== 'Cash on Delivery' ? formData.transactionId : undefined,
      }, !expressProduct);

      if (order) {
        setOrderInfo(order);
        setIsOrderPlaced(true);
        // Scroll to top to see confirmation
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      // Detailed error for stock issues or general failures
      alert(error.message || 'দুঃখিত, অর্ডারটি সফল হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন বা আপনার ইন্টারনেট সংযোগ চেক করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isOrderPlaced && orderInfo) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
        <p className="text-black/60 mb-8 max-w-md">
          Thank you for shopping with {settings.brandName || 'AL-Hurumah'}. Your order ID is <span className="font-bold text-black">{orderInfo.id}</span>. You can track your order in your profile.
        </p>
        <div className="bg-black/5 p-6 rounded-2xl mb-8 w-full max-w-sm text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Order Summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold">{formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span className="font-bold">{formData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="font-bold uppercase">{formData.paymentMethod}</span>
            </div>
            {formData.transactionId && (
              <div className="flex justify-between">
                <span>TrxID:</span>
                <span className="font-bold">{formData.transactionId}</span>
              </div>
            )}
            <div className="pt-4 border-t border-black/5 flex justify-between text-base font-bold">
              <span>Total Paid:</span>
              <span>৳{Number(grandTotal || 0).toFixed(0)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/profile')}
            className="px-10 py-4 bg-black text-white rounded-full font-bold hover:bg-black/90 transition-all shadow-xl"
          >
            Track Order
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-10 py-4 border-2 border-black rounded-full font-bold hover:bg-black/5 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => {
            if (step === 1) {
              const productId = expressProduct?.id || (activeCart.length > 0 ? activeCart[0].id : null);
              if (productId) {
                navigate(`/product/${productId}`, { state: { openCart: true } });
              } else {
                navigate('/', { state: { openCart: true } });
              }
            } else {
              prevStep();
            }
          }}
          className="flex items-center text-sm font-medium text-black/60 hover:text-black transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {step === 1 ? 'Back to Cart' : 'Back to Delivery'}
        </button>

        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${step === 1 ? 'bg-black text-white' : 'bg-green-500 text-white'}`}>
            {step === 1 ? '1' : <CheckCircle2 className="w-4 h-4" />}
          </div>
          <div className="w-8 h-[2px] bg-black/10" />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${step === 2 ? 'bg-black text-white' : 'bg-black/5 text-black/20'}`}>
            2
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl font-bold mb-8">Delivery Details</h1>
              
              <form onSubmit={nextStep} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">Full Name</label>
                    <input 
                      required
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-5 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">Phone Number</label>
                    <input 
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-5 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Email Address (Optional)</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="w-full px-5 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Full Delivery Address</label>
                  <textarea 
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="House no, Road no, Village/Area"
                    className="w-full px-5 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">City</label>
                    <input 
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Dhaka"
                      className="w-full px-5 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">Area/Post Code</label>
                    <input 
                      required
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="e.g. Dhanmondi"
                      className="w-full px-5 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-black/90 transition-all shadow-xl mt-8"
                >
                  Continue to Payment
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-800">Select Payment Method</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Daraz-style Payment Tabs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-2.5 rounded-2xl border border-black/5">
                  {[
                    { 
                      id: 'Cash on Delivery', 
                      label: 'Cash on Delivery',
                      brandText: 'COD',
                      brandColor: 'text-[#0088cc]',
                      bgAccent: 'bg-[#0088cc]/5',
                      activeBorder: 'border-[#0088cc]',
                      activeRing: 'ring-[#0088cc]/10',
                      renderIcon: (active: boolean) => (
                        <div className={`w-14 h-10 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-[#0088cc]/10 text-[#0088cc]' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'}`}>
                          <Truck className="w-5 h-5" />
                        </div>
                      )
                    },
                    { 
                      id: 'bKash', 
                      label: 'bKash',
                      brandText: 'bKash',
                      brandColor: 'text-[#e2136e]',
                      bgAccent: 'bg-[#e2136e]/5',
                      activeBorder: 'border-[#e2136e]',
                      activeRing: 'ring-[#e2136e]/10',
                      renderIcon: () => (
                        <div className="w-14 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white p-1 select-none">
                          <img 
                            src="/image/bKash%20Logo.png" 
                            alt="bKash" 
                            className="h-full w-full object-contain pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )
                    },
                    { 
                      id: 'Nagad', 
                      label: 'Nagad',
                      brandText: 'নগদ',
                      brandColor: 'text-[#f57224]',
                      bgAccent: 'bg-[#f57224]/5',
                      activeBorder: 'border-[#f57224]',
                      activeRing: 'ring-[#f57224]/10',
                      renderIcon: () => (
                        <div className="w-14 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white p-1 select-none">
                          <img 
                            src="/image/Nagad%20Logo.png" 
                            alt="Nagad" 
                            className="h-full w-full object-contain pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )
                    },
                    { 
                      id: 'Rocket', 
                      label: 'Rocket',
                      brandText: 'Rocket',
                      brandColor: 'text-[#8c348d]',
                      bgAccent: 'bg-[#8c348d]/5',
                      activeBorder: 'border-[#8c348d]',
                      activeRing: 'ring-[#8c348d]/10',
                      renderIcon: () => (
                        <div className="w-14 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white p-1 select-none">
                          <img 
                            src="/image/Rocket%20Logo.png" 
                            alt="Rocket" 
                            className="h-full w-full object-contain pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )
                    }
                  ].map((method) => {
                    const isSelected = formData.paymentMethod === method.id;
                    return (
                      <label 
                        key={method.id}
                        className={`group relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all select-none text-center ${
                          isSelected 
                            ? `bg-white ${method.activeBorder} shadow-sm ring-4 ${method.activeRing}` 
                            : 'bg-white border-transparent hover:bg-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value={method.id} 
                          checked={isSelected}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        
                        {method.renderIcon(isSelected)}

                        <span className={`font-bold text-xs mt-2.5 transition-colors ${isSelected ? 'text-black' : 'text-black/50 group-hover:text-black/70'}`}>
                          {method.label}
                        </span>

                        {/* Tiny active indicator badge */}
                        {isSelected && (
                          <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${method.brandColor.replace('text-', 'bg-')}`} />
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Unified Detail Panel inspired by Daraz */}
                <div className="bg-white border border-black/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                  {formData.paymentMethod === 'Cash on Delivery' ? (
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-gray-800">Please ensure the following before you proceed:</p>
                      <ul className="text-xs text-gray-600 space-y-3 pl-1">
                        <li className="flex gap-2">
                          <span className="font-bold text-gray-400">1.</span>
                          <span>You have to pay the rider <strong>৳{Number(grandTotal || 0).toFixed(0)}</strong> in cash when the delivery is received.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-gray-400">2.</span>
                          <span>Please ensure your phone number <strong className="font-mono">{formData.phone}</strong> is reachable during the delivery window.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-gray-400">3.</span>
                          <span>Double check your shipping address: <strong>{formData.address}, {formData.area}, {formData.city}</strong>.</span>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="space-y-4">
                        <p className="text-sm font-bold text-gray-800">Please ensure the following before you proceed:</p>
                        <ul className="text-xs text-gray-600 space-y-3 pl-1">
                          <li className="flex gap-2">
                            <span className="font-bold text-gray-400">1.</span>
                            <span>Please send <strong>৳{Number(grandTotal || 0).toFixed(0)}</strong> to our {formData.paymentMethod} number: <strong className="text-black bg-black/5 px-2 py-0.5 rounded text-sm select-all">{settings?.paymentNumbers[formData.paymentMethod as keyof AppSettings['paymentNumbers']] || 'N/A'}</strong>.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-gray-400">2.</span>
                            <span>After completing the transaction, enter the Transaction ID in the input field below to verify your payment.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-gray-400">3.</span>
                            <span>Please double check that you are sending the money to our official account.</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-black/5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Transaction ID</label>
                        <input 
                          required
                          type="text"
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleInputChange}
                          placeholder="Enter your Transaction ID (e.g. 9J28K9L2)"
                          className="w-full px-5 py-4 bg-black/5 border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224]/30 focus:border-[#f57224] focus:bg-white transition-all font-mono text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Primary Pay Now Action Button inside the active panel */}
                  <div className="pt-4 border-t border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-xs text-black/40 order-2 md:order-1 uppercase tracking-wider font-bold">
                      Secure Checkout Powered by {settings.brandName || 'AL-Hurumah'}
                    </p>
                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="order-1 md:order-2 px-12 py-4 bg-[#f57224] hover:bg-[#e05e13] text-white rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-3 w-full md:w-auto"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay Now`
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-black/5 rounded-3xl p-8 sticky top-32">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
              {activeCart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-black/5 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
                    <p className="text-xs text-black/40 mt-1">{item.quantity} × ৳{Number(item.price || 0).toFixed(0)}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="font-bold text-sm">৳{(Number(item.price || 0) * item.quantity).toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-black/5">
              <div className="flex justify-between text-sm">
                <span className="text-black/40">Subtotal</span>
                <span className="font-bold">৳{Number(activeTotal || 0).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/40">Delivery Charge</span>
                <span className="font-bold text-gray-900">
                  {deliveryCharge > 0 ? `৳${deliveryCharge.toFixed(0)}` : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t border-black/5">
                <span>Total</span>
                <span>৳{Number(grandTotal || 0).toFixed(0)}</span>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
