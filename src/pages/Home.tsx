import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Product } from '../types';
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
}

export default function Home({
  filteredAndSortedProducts,
  categories,
  selectedCategory,
  setSelectedCategory,
  setSortBy,
  setSearchQuery,
  latestProducts
}: HomeProps) {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % latestProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [latestProducts.length]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#FDFCFB]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=1920" 
            alt="Panjabi Fashion Designer Collection"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFCFB] via-[#FDFCFB]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-black mb-6 leading-[0.9]">
                Elegance in <br />
                <span className="italic font-serif text-amber-600">Tradition.</span>
              </h1>
              <p className="text-lg sm:text-xl text-black/60 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Discover our exclusive collection of premium Panjabis and authentic Attars. Crafted for elegance, designed for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="#shop"
                  className="inline-flex items-center justify-center px-10 py-5 bg-black text-white font-bold rounded-2xl hover:bg-black/90 transition-all group shadow-xl"
                >
                  Shop Collection
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>

            {/* Right Content - Automatic Product Slider */}
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
                  <div className="relative h-full w-full max-w-[320px] sm:max-w-[400px] mx-auto">
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
                            <span className="text-sm sm:text-lg font-black">৳{latestProducts[currentProductIndex].price.toFixed(0)}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-black text-black" />
                              <span className="text-xs font-bold">{latestProducts[currentProductIndex].rating}</span>
                            </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredAndSortedProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-2xl bg-black/5">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 py-3 bg-white text-black font-semibold rounded-xl translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg text-center">
                    View Details
                  </div>
                </div>
              </Link>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">{product.category}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold group-hover:text-black/60 transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center mt-1 space-x-1">
                    <Star className="w-3 h-3 fill-black text-black" />
                    <span className="text-xs font-medium">{product.rating}</span>
                  </div>
                </div>
                <p className="text-lg font-bold">৳{product.price.toFixed(0)}</p>
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

      {/* Newsletter */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Club</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="max-w-md mx-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-full focus:outline-none focus:border-white transition-colors"
            />
            <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors">
              Join
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
