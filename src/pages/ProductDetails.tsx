import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsProps {
  products: Product[];
  addToCart: (product: Product, selectedAttr?: string) => void;
}

export default function ProductDetails({ products, addToCart }: ProductDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedAttr, setSelectedAttr] = useState<string | null>(null);
  const product = products.find(p => String(p.id) === String(id));

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-black/60 hover:text-black mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative aspect-square max-w-[420px] w-full rounded-3xl overflow-hidden bg-gray-50 border border-black/5 shadow-md group mx-auto lg:mx-0"
        >
          <img 
            src={product.image} 
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

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col"
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
            <div className="flex items-baseline gap-3">
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-amber-600">৳{Number(product.price || 0).toFixed(0)}</p>
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

          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-black/80">Description</h3>
            <p className="text-sm text-black/60 leading-relaxed mb-5">
              {product.description}
            </p>
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-black/80">Specifications</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-black/65">
                <li className="flex justify-between border-b border-black/5 pb-1.5">
                  <span className="font-medium text-black/40">Material</span>
                  <span>Premium Quality</span>
                </li>
                <li className="flex justify-between border-b border-black/5 pb-1.5">
                  <span className="font-medium text-black/40">Origin</span>
                  <span>Authentic Source</span>
                </li>
                <li className="flex justify-between border-b border-black/5 pb-1.5">
                  <span className="font-medium text-black/40">Fit</span>
                  <span>Regular / Slim</span>
                </li>
                <li className="flex justify-between border-b border-black/5 pb-1.5">
                  <span className="font-medium text-black/40">Care</span>
                  <span>Hand Wash Recommended</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-6 py-6 border-y border-black/5">
            <div className="flex flex-col items-center text-center">
              <Truck className="w-5 h-5 mb-1.5 text-black/60" />
              <p className="text-[9px] font-bold uppercase tracking-widest">Free Shipping</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-5 h-5 mb-1.5 text-black/60" />
              <p className="text-[9px] font-bold uppercase tracking-widest">Authentic Product</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="w-5 h-5 mb-1.5 text-black/60" />
              <p className="text-[9px] font-bold uppercase tracking-widest">Easy Returns</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button 
              onClick={() => {
                if ((product.sizes?.length || product.volumes?.length) && !selectedAttr) {
                  alert(`Please select a ${product.category === 'Panjabi' ? 'size' : 'volume'} first.`);
                  return;
                }
                addToCart(product, selectedAttr || undefined);
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
                addToCart(product, selectedAttr || undefined);
                navigate('/checkout');
              }}
              className="flex-1 py-4 bg-black hover:bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Express Buy Now
            </button>
          </div>
        </motion.div>
      </div>

      {/* Related Products or More Info could go here */}
    </div>
  );
}
