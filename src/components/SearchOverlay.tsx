import React from 'react';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface SearchOverlayProps {
  query: string;
  onClear: () => void;
  products: Product[];
  cartQuantities: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onProductClick: (product: Product) => void;
  onSelectSuggestion: (term: string) => void;
}

const POPULAR_SEARCHES = ['Amul Milk', 'Atta 5kg', 'Onion', 'Potato', 'Maggi', 'Brown Eggs', 'Butter', 'Coke Zero'];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  query,
  onClear,
  products,
  cartQuantities,
  onAddToCart,
  onUpdateQuantity,
  onProductClick,
  onSelectSuggestion,
}) => {
  const trimmed = query.trim().toLowerCase();

  const matchingProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(trimmed) ||
      p.category.toLowerCase().includes(trimmed) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(trimmed))
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6">
      {/* Search Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-[#085E2B]" />
          <h2 className="text-base sm:text-lg font-bold font-['Clash_Display',sans-serif] text-[#121212]">
            Showing results for &ldquo;<span className="text-[#085E2B]">{query}</span>&rdquo;
          </h2>
          <span className="text-xs text-slate-500 font-semibold font-['Satoshi',sans-serif]">
            ({matchingProducts.length} items found)
          </span>
        </div>

        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#121212] bg-slate-100 px-3 py-1.5 rounded-xl cursor-pointer font-['Satoshi',sans-serif]"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear Search</span>
        </button>
      </div>

      {/* Quick Suggestion Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
        <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-amber-500" />
          Trending:
        </span>
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            onClick={() => onSelectSuggestion(term)}
            className="text-xs font-medium text-slate-700 bg-white/50 hover:bg-white/80 backdrop-blur-md border border-white/60 px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Results Grid or Empty State */}
      {matchingProducts.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/70 p-12 text-center mt-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No products found matching &ldquo;{query}&rdquo;
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Check the spelling or try searching for everyday items like milk, bread, eggs, or fresh vegetables.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Milk', 'Tomatoes', 'Eggs', 'Chips'].map((suggest) => (
              <button
                key={suggest}
                onClick={() => onSelectSuggestion(suggest)}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#085E2B] text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                Search &ldquo;{suggest}&rdquo;
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mt-4">
          {matchingProducts.map((product) => (
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
      )}
    </div>
  );
};
