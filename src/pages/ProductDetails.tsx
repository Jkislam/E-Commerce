import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

export default function ProductDetails({ products, addToCart }: ProductDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedAttr, setSelectedAttr] = useState<string | null>(null);
  const product = products.find(p => p.id === Number(id));

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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-[4/5] rounded-3xl overflow-hidden bg-black/5"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-black/40 mb-2">{product.category}</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-black text-black' : 'text-black/10'}`} 
                  />
                ))}
                <span className="ml-2 text-sm font-bold">{product.rating}</span>
              </div>
              <div className="h-4 w-[1px] bg-black/10" />
              <span className="text-sm text-black/40">120+ Reviews</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-3xl font-bold text-black">৳{product.price.toFixed(0)}</p>
            <p className="text-sm text-black/40 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Stock Status */}
          <div className="mb-8">
            <span className={`text-xs font-bold px-4 py-2 rounded-xl border ${product.stock > 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {product.stock > 0 ? `In Stock: ${product.stock} units available` : 'Currently Out of Stock'}
            </span>
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

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 py-4 border-2 border-black rounded-2xl font-bold hover:bg-black hover:text-white transition-all flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/90 transition-all shadow-xl"
            >
              Buy Now
            </button>
          </div>
        </motion.div>
      </div>

      {/* Related Products or More Info could go here */}
    </div>
  );
}
