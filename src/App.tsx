/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  Routes, 
  Route, 
  Link,
  Navigate,
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
import { Product, CartItem, Order, AppSettings } from './types';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { currentUser, logout, loading: authLoading, refreshUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('al_hurumah_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'default'>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaultSettings: AppSettings = {
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
      seoKeywords: 'AL-Hurumah, Panjabi, Attar, Traditional Wear, Fragrances, Premium Panjabi, Authentic Attar',
      aboutText1: 'Founded in 2024, AL-Hurumah began with a simple yet profound vision: to bridge the gap between traditional craftsmanship and contemporary style. Our journey started in the heart of the artisan community, where we discovered the timeless beauty of hand-stitched Panjabis and the mystical allure of organic Attars.',
      aboutText2: 'We believe that clothing and fragrance are more than just products; they are reflections of identity and culture. That\'s why we source only the finest materials—from premium Egyptian cotton to the rarest essential oils—ensuring that every piece carries the legacy of quality.',
      aboutMission: 'To preserve and promote traditional artistry by crafting premium attire and fragrances that inspire confidence and celebrate authenticity in a modern world.',
      aboutVision: 'To become a global symbol of refined traditionalism, where every thread and scent tells a story of heritage, quality, and timeless grace.',
      contactEmail: 'concierge@alhurumah.com',
      contactPhone: '+880 1234 567890',
      contactAddress: 'Gulshan-2, Dhaka',
      contactHours: '10:00 AM - 09:00 PM',
      contactImageTop: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2000',
      contactImageBottom: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000'
    };

    const saved = localStorage.getItem('al_hurumah_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
      } catch (e) {
        console.error('Failed to parse settings');
      }
    }
    return defaultSettings;
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

    try {
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
      if(s && s.parentNode) s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      // @ts-ignore
      if ((window as any).fbq) {
        (window as any).fbq('init', pixelId);
        (window as any).fbq('track', 'PageView');
      }
    } catch (e) {
      console.warn("Meta Pixel injection failed", e);
    }
  }, [settings.metaPixelId]);

  // Fetch products from Supabase on Mount
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 2; // Reduced from 3 for faster failure recovery

    const loadData = async (retry = 0) => {
      if (!isSubscribed) return;
      
      // Only set global loading for the first time or if products list is empty
      if (retry === 0 && products.length === 0) setDataLoading(true);
      setDataError(null);
      
      // Safety timeout: force loading to false after 20 seconds
      const timeoutId = setTimeout(() => {
        if (isSubscribed) {
          setDataLoading(false);
          if (products.length === 0) {
            setDataError("Connection is slow. Showing fallback products.");
            // Fallback to local constants if remote fails
            setProducts(PRODUCTS.map(p => ({
              ...p,
              id: String(p.id),
              islatest: (p as any).islatest || false,
              stock: (p as any).stock || 0
            })) as Product[]);
          }
        }
      }, 10000);

      try {
        console.log(`Fetching data... (Attempt ${retry + 1}/${maxRetries})`);
        
        // Exponential backoff for retries
        if (retry > 0) {
          const delay = Math.pow(2, retry) * 1000;
          await new Promise(r => setTimeout(r, delay));
        }

        // Load settings from Supabase
        try {
          const { data: settingsData, error: settingsError } = await supabase
            .from('site_settings')
            .select('*')
            .eq('id', 'global_settings')
            .single();
          
          if (!settingsError && settingsData && isSubscribed) {
            console.log('Successfully fetched settings from Supabase:', settingsData);
            let loadedSettings: Partial<AppSettings> = {};
            
            // Check if it's the old schema with nested JSON
            if ('settings' in settingsData && settingsData.settings) {
              loadedSettings = settingsData.settings;
            } else {
              // Otherwise, map from individual columns
              loadedSettings = {
                brandName: settingsData.brand_name,
                categories: settingsData.categories,
                paymentNumbers: {
                  bKash: settingsData.bkash_number || '',
                  Nagad: settingsData.nagad_number || '',
                  Rocket: settingsData.rocket_number || '',
                },
                hero: {
                  image: settingsData.hero_image || '',
                  titleLine1: settingsData.hero_title_line_1 || '',
                  titleLine2: settingsData.hero_title_line_2 || '',
                  description: settingsData.hero_description || '',
                },
                footerDescription: settingsData.footer_description,
                metaPixelId: settingsData.meta_pixel_id,
                seoKeywords: settingsData.seo_keywords,
                aboutText1: settingsData.about_text_1,
                aboutText2: settingsData.about_text_2,
                aboutMission: settingsData.about_mission,
                aboutVision: settingsData.about_vision,
                contactEmail: settingsData.contact_email,
                contactPhone: settingsData.contact_phone,
                contactAddress: settingsData.contact_address,
                contactHours: settingsData.contact_hours,
                contactImageTop: settingsData.contact_image_top,
                contactImageBottom: settingsData.contact_image_bottom,
              };
            }
            setSettings(prev => ({ ...prev, ...loadedSettings }));
          } else if (settingsError && settingsError.code !== 'PGRST116') {
            console.log('Settings table may not be initialized yet:', settingsError);
          }
        } catch (settingsErr) {
          console.log('Failed to fetch settings from Supabase, using localStorage:', settingsErr);
        }

        // Use a persistent health check or just wrap the select in a shorter timeout if possible
        // But Supabase client doesn't support easy per-request timeouts
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) {
          // If it's a specific Supabase error like "Failed to fetch" (network error)
          throw productsError;
        }

        if (isSubscribed && productsData) {
          console.log(`Successfully fetched ${productsData.length} products.`);
          setProducts(productsData.map(p => ({
            ...p,
            id: p.id,
            name: p.name || 'Unknown Product',
            price: Number(p.price) || 0,
            rating: Number(p.rating) || 0,
            category: p.category || 'Uncategorized',
            image: p.image || '',
            description: p.description || '',
            islatest: p.is_latest ?? p.details?.is_latest ?? false,
            sizes: p.details?.sizes,
            volumes: p.details?.volumes,
            stock: Number(p.details?.stock) || 0,
            images: p.details?.images || []
          })));
        }

        if (currentUser && isSubscribed) {
          // Fetch the user's cart from user_carts table
          try {
            const { data: cartData, error: cartError } = await supabase
              .from('user_carts')
              .select('items')
              .eq('user_id', currentUser.id)
              .maybeSingle();

            if (!cartError && cartData && cartData.items && isSubscribed) {
              const dbCart = cartData.items as CartItem[];
              if (dbCart.length > 0) {
                // Merge local cart and DB cart
                setCart(prev => {
                  const merged = [...prev];
                  dbCart.forEach(dbItem => {
                    const existing = merged.find(
                      item => item.id === dbItem.id && item.selectedAttr === dbItem.selectedAttr
                    );
                    if (existing) {
                      existing.quantity = Math.max(existing.quantity, dbItem.quantity);
                    } else {
                      merged.push(dbItem);
                    }
                  });
                  return merged;
                });
              }
            } else if (cartError) {
              console.log('Error fetching cart from database (user_carts table may not be initialized yet):', cartError);
            }
          } catch (cartErr) {
            console.log('Failed to fetch cart from DB:', cartErr);
          }

          let query = supabase.from('orders').select('*, order_items(*)');
          if (currentUser.role !== 'admin' && currentUser.id) {
            query = query.eq('user_id', currentUser.id);
          }

          const { data: ordersData, error: ordersError } = await query.order('created_at', { ascending: false });
          if (ordersError) throw ordersError;
          
          if (isSubscribed && ordersData) {
            setOrders(ordersData.map(o => ({
              id: o.id,
              customername: o.customer_name,
              customeremail: o.customer_email,
              customerphone: o.customer_phone,
              customeraddress: o.customer_address,
              total: Number(o.total || 0),
              status: o.status,
              paymentmethod: o.payment_method || 'Cash on Delivery',
              transactionid: o.transaction_id,
              createdat: o.created_at,
              items: o.order_items?.map((item: any) => ({
                id: item.product_id,
                name: item.product_name,
                quantity: item.quantity,
                price: Number(item.price || 0),
                selectedAttr: item.selected_attr,
                image: item.image_url || ''
              })) || []
            } as Order)));
          }
        }
        
        // If we reached here, loading succeeded
        setDataLoading(false);
      } catch (err: any) {
        const errorMessage = err.message || String(err);
        const isNetworkError = errorMessage.includes('Failed to fetch') || errorMessage.includes('network');
        
        if (isNetworkError) {
          console.warn(`Data fetch connection issue (Attempt ${retry + 1}): ${errorMessage}`);
        } else {
          console.error(`Data fetch error (Attempt ${retry + 1}):`, errorMessage);
        }
        
        // Immediately load fallback products on first failure so page is not empty during retries
        if (isSubscribed && products.length === 0) {
          console.log("Loading static products fallback immediately due to fetch failure.");
          setProducts(PRODUCTS.map(p => ({
            ...p,
            id: String(p.id),
            islatest: (p as any).islatest || false,
            stock: (p as any).stock || 0
          })) as Product[]);
        }

        if (isSubscribed && retry < maxRetries - 1) {
          console.log(`Scheduling retry ${retry + 2}...`);
          clearTimeout(timeoutId);
          await loadData(retry + 1);
          return;
        }

        if (isSubscribed) {
          const userFriendlyError = isNetworkError 
            ? "Network connection issue. Showing fallback product catalog."
            : `System error: ${errorMessage}`;
            
          setDataError(userFriendlyError);
          setDataLoading(false);
        }
      } finally {
        clearTimeout(timeoutId);
        if (isSubscribed && retry === 0) {
          setDataLoading(false);
        }
      }
    };

    let isSubscribed = true;
    if (!authLoading) {
      loadData();
    }
    return () => { isSubscribed = false; };
  }, [currentUser, authLoading]);

  // Sync settings to localStorage and Supabase (if user is admin)
  useEffect(() => {
    localStorage.setItem('al_hurumah_settings', JSON.stringify(settings));

    const syncToSupabaseSettings = async () => {
      if (currentUser?.role === 'admin') {
        try {
          const flatRow = {
            id: 'global_settings',
            brand_name: settings.brandName,
            categories: settings.categories,
            bkash_number: settings.paymentNumbers?.bKash,
            nagad_number: settings.paymentNumbers?.Nagad,
            rocket_number: settings.paymentNumbers?.Rocket,
            hero_image: settings.hero?.image,
            hero_title_line_1: settings.hero?.titleLine1,
            hero_title_line_2: settings.hero?.titleLine2,
            hero_description: settings.hero?.description,
            footer_description: settings.footerDescription,
            meta_pixel_id: settings.metaPixelId,
            seo_keywords: settings.seoKeywords,
            about_text_1: settings.aboutText1,
            about_text_2: settings.aboutText2,
            about_mission: settings.aboutMission,
            about_vision: settings.aboutVision,
            contact_email: settings.contactEmail,
            contact_phone: settings.contactPhone,
            contact_address: settings.contactAddress,
            contact_hours: settings.contactHours,
            contact_image_top: settings.contactImageTop,
            contact_image_bottom: settings.contactImageBottom,
            updated_at: new Date().toISOString()
          };

          const { error } = await supabase
            .from('site_settings')
            .upsert(flatRow);
          
          if (error) {
            console.warn('Upserting with flat columns failed. Please run the SQL schema in Supabase to create the flat site_settings table columns:', error);
          } else {
            console.log('Successfully synced settings to Supabase flat columns.');
          }
        } catch (err) {
          console.error('Error during Supabase settings sync:', err);
        }
      }
    };

    syncToSupabaseSettings();
  }, [settings, currentUser]);

  // Sync cart to localStorage and Supabase (if user is logged in)
  useEffect(() => {
    localStorage.setItem('al_hurumah_cart', JSON.stringify(cart));

    const syncCartToSupabase = async () => {
      if (currentUser?.id) {
        try {
          const { error } = await supabase
            .from('user_carts')
            .upsert({
              user_id: currentUser.id,
              items: cart,
              updated_at: new Date().toISOString()
            });

          if (error) {
            console.warn('Failed to sync cart to database (user_carts table may not be initialized yet):', error);
          }
        } catch (err) {
          console.error('Error during Supabase cart sync:', err);
        }
      }
    };

    // 500ms debounce to prevent spamming the DB with queries while updating quantities
    const timer = setTimeout(() => {
      syncCartToSupabase();
    }, 500);

    return () => clearTimeout(timer);
  }, [cart, currentUser]);

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

  const categories = ['All', ...(settings?.categories || [])];

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

  const removeFromCart = (productId: string | number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string | number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const deleteProduct = async (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
      } else {
        alert('Failed to delete product: ' + error.message);
      }
    }
  };

  const bulkDeleteProducts = async (ids: (number | string)[]) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} products?`)) {
      const { error } = await supabase.from('products').delete().in('id', ids);
      if (!error) {
        setProducts(prev => prev.filter(p => !ids.map(String).includes(String(p.id))));
      } else {
        alert('Failed to delete products: ' + error.message);
      }
    }
  };

  const resetProducts = () => {
    if (window.confirm('Are you sure you want to reset all products to default? This will delete all your changes.')) {
      setProducts(PRODUCTS);
      localStorage.removeItem('al_hurumah_products');
    }
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'status' | 'createdat'>) => {
    const userId = currentUser?.id || null;

    try {
      // Prepare items for RPC - mapping fields to database column names
      const orderItems = orderData.items.map(item => ({
        p_id: item.id,
        p_name: item.name,
        p_qty: item.quantity,
        p_price: Number(item.price || 0),
        p_attr: item.selectedAttr || null,
        p_image: item.image || null
      }));

      // Call Atomic RPC function in Supabase
      // This handles: Order entry, Order Items entry, and Stock deduction in ONE transaction
      const { data, error } = await supabase.rpc('create_order_v1', {
        p_user_id: userId,
        p_customer_name: orderData.customername,
        p_customer_email: orderData.customeremail,
        p_customer_phone: orderData.customerphone,
        p_customer_address: orderData.customeraddress,
        p_total: Number(orderData.total || 0),
        p_payment_method: orderData.paymentmethod,
        p_transaction_id: orderData.transactionid || null,
        p_order_items: orderItems
      });

      if (error) {
        // Handle specific stock error or general error
        if (error.message.includes('Insufficient stock')) {
          throw new Error('দুঃখিত, কিছু প্রোডাক্টের পর্যাপ্ত স্টক নেই। অনুগ্রহ করে আপনার কার্ট চেক করুন।');
        }
        throw error;
      }

      if (!data) throw new Error('অর্ডার প্রসেস করতে সমস্যা হয়েছে।');

      const newOrder: Order = {
        ...orderData,
        id: data.order_id,
        status: 'Pending',
        createdat: data.created_at,
      };
      
      setOrders(prev => [newOrder, ...prev]);
      
      // Update local products stock state to reflect changes immediately
      setProducts(prev => prev.map(p => {
        const orderedItem = orderData.items.find(item => item.id === p.id);
        if (orderedItem) {
          return { ...p, stock: Math.max(0, (p.stock || 0) - orderedItem.quantity) };
        }
        return p;
      }));

      clearCart();
      return newOrder;
    } catch (err: any) {
      console.error('Order placement exception:', err);
      throw err; 
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } else {
      alert('Failed to update order: ' + error.message);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (!error) {
        setOrders(prev => prev.filter(order => order.id !== orderId));
      } else {
        alert('Failed to delete order: ' + error.message);
      }
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
  }, [cart]);

  const latestProducts = useMemo(() => {
    const selectedLatest = products.filter(p => p.islatest);
    if (selectedLatest.length > 0) return selectedLatest;
    // Fallback to first 5 products if none are marked as latest
    return products.slice(0, 5);
  }, [products]);

  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const adminNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Analytics', href: '/admin?view=analytics' },
    { name: 'Inventory', href: '/admin?view=inventory' },
    { name: 'Orders', href: '/admin?view=orders' },
    { name: 'Users', href: '/admin?view=users' },
    { name: 'Settings', href: '/admin?view=settings' }
  ];

  const mainNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/#shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  if (authLoading || (dataLoading && products.length === 0)) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-black/5 border-t-black rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 animate-pulse">
          {authLoading ? 'Initializing Secure Connection...' : `Loading ${settings.brandName || 'AL-Hurumah'}`}
        </p>
        
        <div className="mt-8 max-w-xs animate-in fade-in duration-1000" style={{ animationDelay: '10s', animationFillMode: 'both' }}>
          <p className="text-xs text-black/30 mb-4">
            {dataError ? (
              <span className="text-red-500/60 block font-bold mb-2">{dataError}</span>
            ) : null}
            {authLoading 
              ? 'Authentication is taking longer than expected. This could be due to a slow connection or a service issue.'
              : 'Wait while we fetch the latest products for you.'}
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-black/5 rounded-full text-[10px] font-bold hover:bg-black/10 transition-colors"
            >
              Retry Connection
            </button>
            {authLoading && (
              <button 
                onClick={() => {
                  alert('The connection is being forced. Please wait a moment...');
                }}
                className="text-[10px] text-black/40 font-bold hover:text-black"
              >
                Continue as Guest
              </button>
            )}
          </div>
        </div>
        
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-in {
            animation: fadeIn 1s ease-in forwards;
          }
        `}</style>
      </div>
    );
  }
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
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 group cursor-pointer">
                  {settings.logo && (
                    <img src={settings.logo} alt={settings.brandName || 'Logo'} className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                  )}
                  <span className="text-2xl font-bold tracking-tighter text-black">{settings.brandName || 'AL-Hurumah'}.</span>
                </Link>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center space-x-10">
                {(isAdminPage ? adminNavLinks : mainNavLinks).map((link) => (
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
                {!isAdminPage && (
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
                )}
              </div>

              {/* Mobile/Tablet menu button */}
              <div className="lg:hidden flex items-center space-x-1 sm:space-x-2">
                {!isAdminPage && (
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
                )}
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
                    <div className="flex items-center gap-2">
                      {settings.logo && (
                        <img src={settings.logo} alt={settings.brandName || 'Logo'} className="h-8 w-auto object-contain" />
                      )}
                      <span className="text-2xl font-bold tracking-tighter text-black">{settings.brandName || 'AL-Hurumah'}.</span>
                    </div>
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
                      {(isAdminPage ? adminNavLinks : mainNavLinks).map((item, i) => (
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
                            <p className="font-bold text-sm">৳{(Number(item.price || 0) * item.quantity).toFixed(0)}</p>
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
                      <span className="text-xl font-bold">৳{Number(cartTotal || 0).toFixed(0)}</span>
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
            <Route path="/shop" element={
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
            <Route path="/profile" element={<Profile currentUser={currentUser} isAuthLoading={authLoading} orders={orders} onLogout={async () => { await logout(); clearCart(); }} onUpdateUser={refreshUser} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About settings={settings} />} />
            <Route path="/contact" element={<Contact settings={settings} />} />
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
                <div className="mb-6 flex items-center gap-2">
                  {settings.logo && (
                    <img src={settings.logo} alt={settings.brandName || 'Logo'} className="h-10 w-auto object-contain" />
                  )}
                  <span className="text-2xl font-bold tracking-tighter block">{settings.brandName || 'AL-Hurumah'}.</span>
                </div>
                <p className="text-sm text-black/50 leading-relaxed whitespace-pre-wrap">
                  {settings.footerDescription || 'Your destination for premium traditional wear and authentic fragrances. We bring you the finest Panjabis and Attars from around the world.'}
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Shop</h4>
                <ul className="space-y-4 text-sm text-black/50">
                  {(settings?.categories || []).map(cat => (
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
                  <li><Link to="/about" className="hover:text-black transition-colors">Our Story</Link></li>
                  <li><Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
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

