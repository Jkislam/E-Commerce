import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, XCircle, LogOut, ShoppingBag, ChevronRight, MapPin } from 'lucide-react';
import { User, Order } from '../types';

interface ProfileProps {
  currentUser: User | null;
  orders: Order[];
  onLogout: () => void;
}

export default function Profile({ currentUser, orders, onLogout }: ProfileProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const userOrders = orders.filter(o => o.customerEmail === currentUser?.email);

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
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                {currentUser.name[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentUser.name}</h2>
                <p className="text-sm text-black/40">{currentUser.email}</p>
                {currentUser.address && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-black/60">
                    <MapPin className="w-3 h-3" />
                    <span>{currentUser.address}</span>
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
                        <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Total Amount</p>
                        <p className="font-bold text-sm">৳{order.total}</p>
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
    </div>
  );
}
