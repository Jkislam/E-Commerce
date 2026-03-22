import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, CheckCircle2, Truck, CreditCard, MapPin } from 'lucide-react';
import { CartItem, Order, User } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  cartTotal: number;
  clearCart: () => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => Order;
  currentUser: User | null;
}

export default function Checkout({ cart, cartTotal, clearCart, placeOrder, currentUser }: CheckoutProps) {
  const navigate = useNavigate();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderInfo, setOrderInfo] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    phone: '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    city: '',
    area: '',
    paymentMethod: 'cod'
  });

  if (cart.length === 0 && !isOrderPlaced) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order = placeOrder({
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      customerAddress: `${formData.address}, ${formData.area}, ${formData.city}`,
      items: cart,
      total: cartTotal,
    });

    setOrderInfo(order);
    setIsOrderPlaced(true);
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
          Thank you for shopping with AL-Hurumah. Your order ID is <span className="font-bold text-black">{orderInfo.id}</span>. You can track your order in your profile.
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
            <div className="pt-4 border-t border-black/5 flex justify-between text-base font-bold">
              <span>Total Paid:</span>
              <span>৳{cartTotal.toFixed(0)}</span>
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
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-black/60 hover:text-black mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <h1 className="text-3xl font-bold mb-8">Delivery Details</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="pt-6 border-t border-black/5">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`relative flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-black bg-black/5' : 'border-black/5 hover:border-black/20'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <Truck className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-bold text-sm">Cash on Delivery</p>
                    <p className="text-[10px] text-black/40">Pay when you receive</p>
                  </div>
                </label>
                <label className={`relative flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'online' ? 'border-black bg-black/5' : 'border-black/5 hover:border-black/20'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="online" 
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <CreditCard className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-bold text-sm">Online Payment</p>
                    <p className="text-[10px] text-black/40">bKash / Nagad / Card</p>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-black/90 transition-all shadow-xl mt-8"
            >
              Place Order • ৳{cartTotal.toFixed(0)}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-black/5 rounded-3xl p-8 sticky top-32">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-black/5 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
                    <p className="text-xs text-black/40 mt-1">{item.quantity} × ৳{item.price.toFixed(0)}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="font-bold text-sm">৳{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-black/5">
              <div className="flex justify-between text-sm">
                <span className="text-black/40">Subtotal</span>
                <span className="font-bold">৳{cartTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/40">Shipping</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t border-black/5">
                <span>Total</span>
                <span>৳{cartTotal.toFixed(0)}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl">
                <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Delivery within 2-3 days in Dhaka, 3-5 days outside Dhaka.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
