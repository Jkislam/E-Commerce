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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-2xl group"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110"
            referrerPolicy="no-referrer"
          />
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-8 right-8 px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse">
              Low Stock
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col py-4"
        >
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-black text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-md">Official</span>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-black/30">{product.category}</p>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6 leading-none italic">{product.name}</h1>
            <div className="flex items-center space-x-6">
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

          <div className="mb-10">
            <div className="flex items-baseline gap-4">
              <p className="text-5xl font-black tracking-tighter">৳{Number(product.price || 0).toFixed(0)}</p>
              <p className="text-sm font-bold text-black/20 line-through decoration-black/20 decoration-2 italic">৳{(Number(product.price || 0) * 1.2).toFixed(0)}</p>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mt-2">Free Delivery Today</p>
          </div>

          {/* Stock Status */}
          <div className="mb-10">
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 ${product.stock > 0 ? 'bg-white text-black border-black/5' : 'bg-red-50 text-red-700 border-red-100'}`}>
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {product.stock > 0 ? `Inventory: ${product.stock} Units` : 'Stock Depleted'}
              </span>
            </div>
          </div>

          {/* Selection */}
          {(product.sizes?.length || product.volumes?.length) ? (
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
                {product.category === 'Panjabi' ? 'Select Size' : 'Select Volume'}
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.category === 'Panjabi' ? (
                  product.sizes?.map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedAttr(size)}
                      className={`w-12 h-12 border rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        selectedAttr === size ? 'border-black bg-black text-white shadow-lg' : 'border-black/10 hover:border-black'
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
                      className={`px-4 h-12 border rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        selectedAttr === vol ? 'border-black bg-black text-white shadow-lg' : 'border-black/10 hover:border-black'
                      }`}
                    >
                      {vol}
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : null}

          <div className="mb-10">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Description</h3>
            <p className="text-black/60 leading-relaxed mb-6">
              {product.description} This premium {product.category.toLowerCase()} is crafted with the finest materials to ensure both comfort and style. Perfect for special occasions or daily elegance.
            </p>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest">Specifications</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-black/60">
                <li className="flex justify-between border-b border-black/5 pb-2">
                  <span className="font-medium text-black/40">Material</span>
                  <span>Premium Quality</span>
                </li>
                <li className="flex justify-between border-b border-black/5 pb-2">
                  <span className="font-medium text-black/40">Origin</span>
                  <span>Authentic Source</span>
                </li>
                <li className="flex justify-between border-b border-black/5 pb-2">
                  <span className="font-medium text-black/40">Fit</span>
                  <span>Regular / Slim</span>
                </li>
                <li className="flex justify-between border-b border-black/5 pb-2">
                  <span className="font-medium text-black/40">Care</span>
                  <span>Hand Wash Recommended</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 py-8 border-y border-black/5">
            <div className="flex flex-col items-center text-center">
              <Truck className="w-6 h-6 mb-2 text-black/60" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Free Shipping</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-6 h-6 mb-2 text-black/60" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Authentic Product</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="w-6 h-6 mb-2 text-black/60" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Easy Returns</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 mt-auto">
            <button 
              onClick={() => {
                if ((product.sizes?.length || product.volumes?.length) && !selectedAttr) {
                  alert(`Please select a ${product.category === 'Panjabi' ? 'size' : 'volume'} first.`);
                  return;
                }
                addToCart(product, selectedAttr || undefined);
              }}
              className="flex-1 py-5 border-[3px] border-black rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500 flex items-center justify-center group active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
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
              className="flex-1 py-5 bg-black text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-600 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95 translate-y-[-2px] hover:translate-y-[-4px]"
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
