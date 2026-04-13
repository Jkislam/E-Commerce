/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  Routes, 
  Route, 
  Link,
  useLocation
} from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Facebook, 
  Twitter, 
  Instagram, 
  Github,
  Plus,
  Minus,
  Trash2,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from './constants';
import { Product, CartItem, Order, User, AppSettings } from './types';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Login from './pages/Login';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('al_hurumah_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('al_hurumah_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('al_hurumah_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'default'>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('al_hurumah_settings');
    if (saved) return JSON.parse(saved);
    return {
      categories: ['Panjabi', 'Attar'],
      paymentNumbers: {
        bKash: '017XXXXXXXX',
        Nagad: '018XXXXXXXX',
        Rocket: '019XXXXXXXX'
      },
      hero: {
        image: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=1920',
        titleLine1: 'Elegance in',
        titleLine2: 'Tradition.',
        description: 'Discover our exclusive collection of premium Panjabis and authentic Attars. Crafted for elegance, designed for you.'
      },
      brandName: 'AL-Hurumah',
      footerDescription: 'Your destination for premium traditional wear and authentic fragrances. We bring you the finest Panjabis and Attars from around the world.',
      metaPixelId: '',
      seoKeywords: 'AL-Hurumah, Panjabi, Attar, Traditional Wear, Fragrances, Premium Panjabi, Authentic Attar'
    };
  });

  // Update document title and SEO meta tags when settings change
  useEffect(() => {
    // Update Title
    document.title = settings.brandName || 'AL-Hurumah';

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', settings.footerDescription || 'Your destination for premium traditional wear and authentic fragrances. We bring you the finest Panjabis and Attars from around the world.');
    }

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', settings.seoKeywords || 'AL-Hurumah, Panjabi, Attar, Traditional Wear, Fragrances, Premium Panjabi, Authentic Attar');
    }
  }, [settings.brandName, settings.footerDescription, settings.seoKeywords]);

  // Inject Meta Pixel
  useEffect(() => {
    if (!settings.metaPixelId) return;

    const pixelId = settings.metaPixelId;

    // @ts-ignore
    !function(f,b,e,v,n,t,s)
    // @ts-ignore
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    // @ts-ignore
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    // @ts-ignore
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    // @ts-ignore
    n.queue=[];t=b.createElement(e);t.async=!0;
    // @ts-ignore
    t.src=v;s=b.getElementsByTagName(e)[0];
    // @ts-ignore
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    // @ts-ignore
    fbq('init', pixelId);
    // @ts-ignore
    fbq('track', 'PageView');
  }, [settings.metaPixelId]);

  // Sync products to localStorage
  useEffect(() => {
    localStorage.setItem('al_hurumah_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('al_hurumah_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('al_hurumah_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('al_hurumah_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('al_hurumah_user');
    }
  }, [currentUser]);

  // Close mobile menu on scroll (with threshold)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (isMenuOpen && Math.abs(currentScrollY - lastScrollY) > 50) {
        setIsMenuOpen(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const categories = ['All', ...settings.categories];

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, sortBy, selectedCategory]);

  const addToCart = (product: Product, selectedAttr?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedAttr === selectedAttr);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedAttr === selectedAttr) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedAttr }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const deleteProduct = (id: number) => {
    const targetId = Number(id);
    setProducts(prev => prev.filter(p => Number(p.id) !== targetId));
  };

  const bulkDeleteProducts = (ids: number[]) => {
    const targetIds = ids.map(id => Number(id));
    setProducts(prev => prev.filter(p => !targetIds.includes(Number(p.id))));
  };

  const resetProducts = () => {
    if (window.confirm('Are you sure you want to reset all products to default? This will delete all your changes.')) {
      setProducts(PRODUCTS);
      localStorage.removeItem('al_hurumah_products');
    }
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const deleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const latestProducts = useMemo(() => {
    const selectedLatest = products.filter(p => p.isLatest);
    if (selectedLatest.length > 0) return selectedLatest;
    // Fallback to first 5 products if none are marked as latest
    return products.slice(0, 5);
  }, [products]);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/20 backdrop-blur-xl border border-black/5 rounded-2xl px-6 h-16 flex justify-between items-center shadow-sm">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold tracking-tighter text-black cursor-pointer">{settings.brandName || 'AL-Hurumah'}.</Link>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center space-x-10">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Shop', href: '/#shop' },
                  { name: 'About', href: '#' },
                  { name: 'Contact', href: '#' }
                ].map((link) => (
                  <Link 
                    key={link.name}
                    to={link.href} 
                    className="text-[11px] uppercase tracking-[0.2em] font-bold text-black/60 hover:text-black transition-colors nav-link-ltr"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Search and Cart */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30 group-focus-within:text-black transition-colors" />
                  <input 
                    type="text" 
                    placeholder="SEARCH"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-black/5 rounded-xl text-[10px] font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-black/10 w-32 transition-all focus:w-48 placeholder:text-black/20"
                  />
                </div>
                <div className="h-4 w-[1px] bg-black/10 mx-2" />
                <Link 
                  to={currentUser ? "/profile" : "/login"} 
                  className="p-2 hover:bg-black/5 rounded-full transition-all active:scale-95 group relative flex items-center justify-center"
                  title={currentUser ? "Profile" : "Login"}
                >
                  {currentUser?.photourl ? (
                    <img src={currentUser.photourl} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                  {currentUser && !currentUser.photourl && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </Link>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 hover:bg-black/5 rounded-full transition-all active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile/Tablet menu button */}
              <div className="lg:hidden flex items-center space-x-1 sm:space-x-2">
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 active:scale-90 transition-transform"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 active:scale-90 transition-transform"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet menu drawer */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
                />
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-full max-w-[300px] bg-white z-[70] shadow-2xl flex flex-col lg:hidden"
                >
                  <div className="p-6 border-b border-black/5 flex justify-between items-center">
                    <span className="text-2xl font-bold tracking-tighter text-black">{settings.brandName || 'AL-Hurumah'}.</span>
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="flex items-center gap-4 p-4 bg-black/5 rounded-2xl">
                      <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                        {currentUser?.photourl ? (
                          <img src={currentUser.photourl} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <UserIcon className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        {currentUser ? (
                          <>
                            <p className="font-bold text-sm">{currentUser.name}</p>
                            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-[10px] font-bold text-black/40 uppercase tracking-widest hover:text-black transition-colors">View Profile</Link>
                          </>
                        ) : (
                          <>
                            <p className="font-bold text-sm">Welcome Guest</p>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-[10px] font-bold text-black/40 uppercase tracking-widest hover:text-black transition-colors">Login / Sign Up</Link>
                          </>
                        )}
                      </div>
                    </div>

                    <nav className="space-y-6">
                      {[
                        { name: 'Home', href: '/' },
                        { name: 'Shop', href: '/#shop' },
                        { name: 'About', href: '#' },
                        { name: 'Contact', href: '#' }
                      ].map((item, i) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Link
                            to={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-2xl font-bold hover:text-black/60 transition-colors"
                          >
                            {item.name}
                          </Link>
                        </motion.div>
                      ))}
                    </nav>

                    <div className="pt-8 border-t border-black/5">
                      <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-4">Search</p>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                        <input 
                          type="text" 
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-black/5 rounded-xl text-sm focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-8 border-t border-black/5">
                      <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-4">Follow Us</p>
                      <div className="flex space-x-4">
                        <a href="#" className="p-3 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
                        <a href="#" className="p-3 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
                        <a href="#" className="p-3 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border-t border-black/5 bg-gray-50/50">
                    <p className="text-xs text-black/40 leading-relaxed">
                      © 2026 {settings.brandName || 'AL-Hurumah'}. All rights reserved. <br />
                      Curating the finest essentials.
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </header>

        {/* Cart Drawer */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-white z-[70] shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-black/5 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Your Cart ({cartCount})</h2>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-black/20" />
                      </div>
                      <div>
                        <p className="font-medium">Your cart is empty</p>
                        <p className="text-sm text-black/40">Start adding some items to your collection.</p>
                      </div>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="px-8 py-3 bg-black text-white rounded-full text-sm font-semibold"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-24 h-24 bg-black/5 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-sm">{item.name}</h3>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-black/20 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-black/40">{item.category}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center border border-black/10 rounded-lg">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1.5 hover:bg-black/5 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1.5 hover:bg-black/5 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="font-bold text-sm">৳{(item.price * item.quantity).toFixed(0)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t border-black/5 bg-gray-50/50 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-black/50">Subtotal</span>
                      <span className="text-xl font-bold">৳{cartTotal.toFixed(0)}</span>
                    </div>
                    <p className="text-[10px] text-black/40 text-center">Shipping and taxes calculated at checkout.</p>
                    <Link 
                      to="/checkout" 
                      onClick={() => setIsCartOpen(false)}
                      className="block w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-black/90 transition-all shadow-lg text-center"
                    >
                      Checkout Now
                    </Link>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="pt-24 sm:pt-28">
          <Routes>
            <Route path="/" element={
              <Home 
                filteredAndSortedProducts={filteredAndSortedProducts}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setSortBy={setSortBy}
                setSearchQuery={setSearchQuery}
                latestProducts={latestProducts}
                settings={settings}
              />
            } />
            <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} cartTotal={cartTotal} clearCart={clearCart} placeOrder={placeOrder} currentUser={currentUser} settings={settings} />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} orders={orders} onLogout={logout} onUpdateUser={updateUser} />} />
            <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
            <Route path="/admin" element={
              <Admin 
                products={products} 
                setProducts={setProducts} 
                onDelete={deleteProduct}
                onBulkDelete={bulkDeleteProducts}
                onReset={resetProducts}
                orders={orders}
                updateOrderStatus={updateOrderStatus}
                onDeleteOrder={deleteOrder}
                settings={settings}
                setSettings={setSettings}
              />
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-black/5 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-1">
                <span className="text-2xl font-bold tracking-tighter mb-6 block">{settings.brandName || 'AL-Hurumah'}.</span>
                <p className="text-sm text-black/50 leading-relaxed whitespace-pre-wrap">
                  {settings.footerDescription || 'Your destination for premium traditional wear and authentic fragrances. We bring you the finest Panjabis and Attars from around the world.'}
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Shop</h4>
                <ul className="space-y-4 text-sm text-black/50">
                  {settings.categories.map(cat => (
                    <li key={cat}>
                      <Link 
                        to="/#shop" 
                        onClick={() => setSelectedCategory(cat)}
                        className="hover:text-black transition-colors"
                      >
                        {cat} Collection
                      </Link>
                    </li>
                  ))}
                  <li><a href="#" className="hover:text-black transition-colors">Gift Sets</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">New Arrivals</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Support</h4>
                <ul className="space-y-4 text-sm text-black/50">
                  <li><a href="#" className="hover:text-black transition-colors">Shipping Policy</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Returns & Exchanges</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">FAQs</a></li>
                  <li><Link to="/admin" className="hover:text-black transition-colors">Admin Panel</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
                  <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
                  <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
                  <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all"><Github className="w-4 h-4" /></a>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-black/40">© 2026 {settings.brandName || 'AL-Hurumah'}. All rights reserved.</p>
              <div className="flex space-x-6 text-xs text-black/40">
                <Link to="/admin" className="hover:text-black">Admin Login</Link>
                <a href="#" className="hover:text-black">Privacy Policy</a>
                <a href="#" className="hover:text-black">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

