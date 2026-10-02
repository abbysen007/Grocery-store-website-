import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Star, ShieldCheck, Plus, Minus, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  quantity: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  quantity,
  onAddToCart,
  onUpdateQuantity,
}) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-2xl bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-white/90 backdrop-blur-xs rounded-full shadow-2xs hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Left: Product Image */}
            <div className="relative bg-white/40 backdrop-blur-md p-8 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100/60">
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <Clock className="w-3 h-3 text-emerald-700" />
                  {product.eta}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F5ECD5] border border-[#E5D5AE] text-[#121212] text-xs font-extrabold shadow-2xs font-['Clash_Display',sans-serif]">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              <img
                src={product.image || product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';
                }}
                className="w-full max-h-[260px] object-contain mix-blend-multiply"
              />
            </div>

            {/* Right: Details & Purchase */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 font-['Clash_Display',sans-serif]">
                  {product.category} {product.subcategory ? `· ${product.subcategory}` : ''}
                </span>

                <h2 className="text-lg sm:text-2xl font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-snug">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-['Satoshi',sans-serif]">
                    {product.weight}
                  </span>
                  {product.rating && (
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">
                        ({product.reviewsCount} reviews)
                      </span>
                    </div>
                  )}
                </div>

                <div className="my-4 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-600 leading-relaxed font-medium font-['Satoshi',sans-serif]">
                    {product.description}
                  </p>
                </div>

                {/* Key Features */}
                {product.keyFeatures && (
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 font-['Clash_Display',sans-serif]">
                      Why Choose This
                    </span>
                    {product.keyFeatures.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs text-slate-700 font-medium font-['Satoshi',sans-serif]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#085E2B] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {product.shelfLife && (
                  <div className="text-xs text-slate-500 mb-2 font-['Satoshi',sans-serif]">
                    <span className="font-bold text-slate-700">Shelf Life: </span>
                    {product.shelfLife}
                  </div>
                )}
              </div>

              {/* Bottom Sticky Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-semibold font-['Satoshi',sans-serif]">Total Price</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-['Clash_Display',sans-serif] text-[#121212] tabular-nums">
                      ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs font-normal text-slate-400 line-through tabular-nums font-['Satoshi',sans-serif]">
                        MRP ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* ADD Button or Counter */}
                <div className="w-28 h-10">
                  {quantity === 0 ? (
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full h-full rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-['Clash_Display',sans-serif] font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                    >
                      ADD TO CART
                    </button>
                  ) : (
                    <div className="w-full h-full flex items-center justify-between bg-[#085E2B] text-white rounded-xl px-2 shadow-xs font-bold text-sm">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="p-1 hover:bg-[#064821] rounded active:scale-90 transition-all cursor-pointer"
                      >
                        <Minus className="w-4 h-4 stroke-[3]" />
                      </button>
                      <span className="text-sm font-bold font-['Clash_Display',sans-serif] tabular-nums">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="p-1 hover:bg-[#064821] rounded active:scale-90 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
