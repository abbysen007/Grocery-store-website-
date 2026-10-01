import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Plus, Minus, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onProductClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onAddToCart,
  onUpdateQuantity,
  onProductClick,
}) => {
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateQuantity(product.id, quantity - 1);
  };

  const discountPercent =
    product.discountPercentage ||
    (product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  return (
    <div
      onClick={() => onProductClick(product)}
      className="group relative flex flex-col justify-between w-full min-w-[170px] max-w-[210px] sm:min-w-[190px] sm:max-w-[220px] bg-white/55 backdrop-blur-md rounded-2xl border border-white/75 hover:border-[#085E2B]/30 hover:bg-white/75 p-3 sm:p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer select-none"
    >
      {/* Top Badges & Delivery ETA */}
      <div className="relative w-full">
        <div className="flex items-center justify-between gap-1 mb-2">
          {/* Delivery ETA pill in Deep Action Green */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#085E2B]/10 border border-[#085E2B]/20 text-[10px] font-extrabold text-[#085E2B] tracking-tight font-['Satoshi',sans-serif]">
            <Clock className="w-2.5 h-2.5 text-[#085E2B]" />
            {product.deliveryTime || product.eta || '8 mins'}
          </span>

          {/* Discount badge in bright beige */}
          {(product.discount || discountPercent > 0) && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#F5ECD5]/90 backdrop-blur-xs text-[#121212] border border-[#E5D5AE] font-['Clash_Display',sans-serif] text-[10px] font-bold tracking-tight shadow-2xs">
              {product.discount || `${discountPercent}% OFF`}
            </span>
          )}
        </div>

        {/* Product Media */}
        <div className="relative w-full aspect-square flex items-center justify-center p-2 rounded-xl bg-white/40 backdrop-blur-xs border border-white/60 overflow-hidden mb-3">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-106 transition-transform duration-300"
          />

          {/* Quick rating if available */}
          {product.rating && (
            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/80 backdrop-blur-xs text-[10px] font-bold text-slate-800 shadow-2xs border border-white/60">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Unit / Weight text */}
          <div className="text-[11px] font-medium text-slate-500 mb-1 tracking-tight font-['Satoshi',sans-serif]">
            {product.weight}
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-[13px] font-semibold text-[#121212] leading-snug line-clamp-2 min-h-[34px] group-hover:text-[#085E2B] transition-colors font-['Satoshi',sans-serif]">
            {product.name}
          </h3>
        </div>

        {/* Price & Add to Cart Section */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Price Stack in Clash Display */}
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">
              ₹{product.price}
            </span>
            {((product.mrp || product.originalPrice) > product.price) && (
              <span className="text-[11px] font-normal text-slate-400 line-through tabular-nums font-['Satoshi',sans-serif]">
                ₹{product.mrp || product.originalPrice}
              </span>
            )}
          </div>

          {/* Action Button: ADD vs Stepper in Deep Green #085E2B */}
          <div className="w-[84px] h-[34px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {quantity === 0 ? (
                <motion.button
                  key="add-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleAdd}
                  className="w-full h-full flex items-center justify-center rounded-xl border-2 border-[#085E2B] bg-white/75 backdrop-blur-xs text-[#085E2B] hover:bg-[#085E2B] hover:text-white text-xs font-['Clash_Display',sans-serif] font-bold uppercase tracking-wider shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  ADD
                </motion.button>
              ) : (
                <motion.div
                  key="qty-stepper"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  className="w-full h-full flex items-center justify-between bg-[#085E2B] text-white rounded-xl px-1.5 shadow-xs font-bold text-xs"
                >
                  <button
                    onClick={handleDecrement}
                    className="p-1 hover:bg-[#064821] rounded-md active:scale-90 transition-all cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                  <span className="text-xs font-extrabold tabular-nums px-1 font-['Clash_Display',sans-serif]">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="p-1 hover:bg-[#064821] rounded-md active:scale-90 transition-all cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

