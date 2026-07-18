import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Product, AppSettings } from '../types';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';

interface HomeProps {
  filteredAndSortedProducts: Product[];
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  setSortBy: (sort: 'price-asc' | 'price-desc' | 'rating' | 'default') => void;
  setSearchQuery: (query: string) => void;
  latestProducts: Product[];
  settings: AppSettings;
}

export default function Home({
  filteredAndSortedProducts,
  categories,
  selectedCategory,
  setSelectedCategory,
  setSortBy,
  setSearchQuery,
  latestProducts,
  settings
}: HomeProps) {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    if (latestProducts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % latestProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [latestProducts.length]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#FDFCFB]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={settings.hero?.image || "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=1920"} 
            alt="Panjabi Fashion Designer Collection"
            className="w-full h-full object-cover object-[center_25%] opacity-70 lg:opacity-85"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFCFB] via-[#FDFCFB]/70 to-transparent lg:from-[#FDFCFB] lg:via-[#FDFCFB]/65 lg:to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold tracking-tight text-black mb-6 leading-tight break-words">
                {settings.hero?.titleLine1 || "Elegance in"} <br />
                <span className="italic font-serif text-amber-600 block mt-4 transform rotate-[-2deg] origin-left">{settings.hero?.titleLine2 || "Tradition."}</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-black/60 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                {settings.hero?.description || "Discover our exclusive collection of premium Panjabis and authentic Attars. Crafted for elegance, designed for you."}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <a 
                  href="#shop"
                  className="group relative inline-flex items-center justify-center px-10 py-5 bg-black text-white font-bold rounded-2xl overflow-hidden transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-95"
                >
                  <span className="relative z-10 flex items-center">
                    Explore Collection
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </a>
              </div>
            </motion.div>

            {/* Right Content - Automatic Product Slider */}
            {latestProducts.length > 0 && latestProducts[currentProductIndex] && (
              <div className="relative block h-[400px] sm:h-[500px] mt-12 lg:mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={latestProducts[currentProductIndex].id}
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 1.1, x: -50 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <div className="relative h-full w-full max-w-[340px] sm:max-w-[460px] mx-auto">
                      {/* Decorative Elements */}
                      <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-100 rounded-full -z-10 blur-2xl opacity-60" />
                      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/5 rounded-full -z-10 blur-3xl" />
                      
                      <Link to={`/product/${latestProducts[currentProductIndex].id}`} className="block h-full group">
                        <div className="relative h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white">
                          <img 
                            src={latestProducts[currentProductIndex].image} 
                            alt={latestProducts[currentProductIndex].name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Floating Info Card */}
                          <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-1">Latest Arrival</p>
                            <h3 className="text-base sm:text-xl font-bold text-black mb-1 sm:mb-2">{latestProducts[currentProductIndex].name}</h3>
                            <div className="flex justify-between items-center">
                              <span className="text-sm sm:text-lg font-black">৳{Number(latestProducts[currentProductIndex].price || 0).toFixed(0)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Slider Indicators */}
                      <div className="absolute -right-6 sm:-right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                        {latestProducts.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentProductIndex(idx)}
                            className={`w-1 sm:w-1.5 transition-all duration-500 rounded-full ${
                              idx === currentProductIndex ? 'h-6 sm:h-8 bg-black' : 'h-2 sm:h-3 bg-black/20 hover:bg-black/40'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Featured Products</h2>
            <p className="text-black/50 text-sm sm:text-base">Explore our latest arrivals and bestsellers.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-2 bg-black/5 p-1 rounded-full">
              {categories.slice(0, 3).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-white text-black shadow-sm' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
              
              {categories.length > 3 && (
                <div className="relative group">
                  <button className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                    categories.slice(3).includes(selectedCategory)
                      ? 'bg-white text-black shadow-sm'
                      : 'text-black/60 hover:text-black'
                  }`}>
                    <span>More</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute right-0 sm:right-auto sm:left-0 mt-1 w-40 bg-white border border-black/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right sm:origin-top-left scale-95 group-hover:scale-100 z-50 p-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {categories.slice(3).map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)} 
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                          selectedCategory === cat ? 'bg-black/5 font-bold' : 'hover:bg-black/5'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative group w-full sm:w-auto">
              <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-black/5 rounded-full text-xs font-medium hover:bg-black/10 transition-colors w-full sm:w-auto">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort By</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-black/5 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 p-2">
                <button onClick={() => setSortBy('default')} className="w-full text-left px-3 py-2 text-xs hover:bg-black/5 rounded-lg">Default</button>
                <button onClick={() => setSortBy('price-asc')} className="w-full text-left px-3 py-2 text-xs hover:bg-black/5 rounded-lg">Price: Low to High</button>
                <button onClick={() => setSortBy('price-desc')} className="w-full text-left px-3 py-2 text-xs hover:bg-black/5 rounded-lg">Price: High to Low</button>
                <button onClick={() => setSortBy('rating')} className="w-full text-left px-3 py-2 text-xs hover:bg-black/5 rounded-lg">Top Rated</button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-14">
          {filteredAndSortedProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group cursor-pointer"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[4/4.6] mb-4 overflow-hidden rounded-3xl sm:rounded-[2rem] bg-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[7px] font-black uppercase tracking-widest shadow-sm">
                    {product.category}
                  </div>
                </div>
              </Link>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end px-1 gap-2">
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 truncate group-hover:text-amber-600 transition-colors duration-300">{product.name}</h3>
                  </Link>
                  
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg sm:text-xl md:text-2xl font-black tracking-tight italic text-amber-600 sm:text-black">৳{Number(product.price || 0).toFixed(0)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-black/40 italic">No products found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 text-sm font-semibold underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}
