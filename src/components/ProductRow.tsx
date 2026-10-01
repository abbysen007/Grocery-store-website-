import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductRowProps {
  title: string;
  subtitle?: string;
  products: Product[];
  cartQuantities: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onProductClick: (product: Product) => void;
  onSeeAll?: () => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  title,
  subtitle,
  products,
  cartQuantities,
  onAddToCart,
  onUpdateQuantity,
  onProductClick,
  onSeeAll,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-10">
      {/* Row Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold font-['Clash_Display',sans-serif] text-[#121212] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 font-medium font-['Satoshi',sans-serif]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#085E2B] hover:text-[#064821] hover:underline cursor-pointer mr-2 font-['Satoshi',sans-serif]"
            >
              <span>see all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-white/60 bg-white/60 hover:bg-white/90 backdrop-blur-md text-slate-700 flex items-center justify-center shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-white/60 bg-white/60 hover:bg-white/90 backdrop-blur-md text-slate-700 flex items-center justify-center shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={rowRef}
        data-lenis-prevent
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={cartQuantities[product.id] || 0}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </section>
  );
};
