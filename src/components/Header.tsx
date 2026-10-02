import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, MapPin, ChevronDown, User, X, ShieldCheck } from 'lucide-react';
import { SEARCH_PLACEHOLDERS } from '../data/mockData';
import { UserAddress } from '../types';
import { FreshitLogo } from './FreshitLogo';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenLocationModal: () => void;
  onOpenAuthModal: () => void;
  currentAddress: UserAddress;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoggedIn: boolean;
  userName?: string;
  onResetToHome: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenLocationModal,
  onOpenAuthModal,
  currentAddress,
  searchQuery,
  onSearchChange,
  isLoggedIn,
  userName,
  onResetToHome,
  onOpenAdmin,
}) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for frosted glass blur enhancement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycling placeholder animation
  useEffect(() => {
    if (searchQuery.trim() !== '') return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [searchQuery]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F5ECD5]/70 backdrop-blur-2xl shadow-sm border-b border-[#E3D4B0]/60'
          : 'bg-[#F5ECD5]/55 backdrop-blur-xl border-b border-[#EADBB9]/50 shadow-2xs'
      }`}
    >
      {/* ========================================================
          DESKTOP VIEW (md and up): Single elegant full-width row
          ======================================================== */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 items-center justify-between gap-6">
        {/* Left: Signature Brand Vector Logo & Interactive Location Selector */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={onResetToHome}
            className="flex items-center group cursor-pointer text-left focus:outline-hidden"
            aria-label="Freshit Home"
          >
            <FreshitLogo size="md" />
          </button>

          {/* Interactive Location Selector Pill */}
          <button
            onClick={onOpenLocationModal}
            className="flex flex-col text-left py-1.5 px-3.5 rounded-xl bg-white/45 hover:bg-white/70 backdrop-blur-md border border-black/5 transition-all duration-200 cursor-pointer group focus:outline-hidden shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#121212]">
              <span className="w-2 h-2 rounded-full bg-[#085E2B] animate-pulse"></span>
              Delivery in {currentAddress.eta}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 line-clamp-1 max-w-[220px]">
              <MapPin className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              <span className="truncate">{currentAddress.area}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 group-hover:translate-y-0.5 transition-transform shrink-0" />
            </div>
          </button>
        </div>

        {/* Center: Search Bar with Cycling Animated Placeholder */}
        <div className="flex-1 max-w-xl mx-auto relative">
          <div className="relative flex items-center w-full h-12 bg-white/70 backdrop-blur-md rounded-xl border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] focus-within:bg-white/95 focus-within:border-[#085E2B] focus-within:ring-2 focus-within:ring-[#085E2B]/20 transition-all overflow-hidden">
            <div className="pl-3.5 pr-2 text-slate-400 pointer-events-none">
              <Search className="w-5 h-5 text-slate-500" />
            </div>

            <div className="relative flex-1 h-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-full bg-transparent pr-8 text-sm font-medium text-[#121212] placeholder-transparent focus:outline-hidden"
                aria-label="Search products"
              />

              {/* Animated Cycling Placeholder */}
              {!searchQuery && (
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none overflow-hidden select-none">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -16, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="text-sm font-medium text-slate-400"
                    >
                      Search &ldquo;{SEARCH_PLACEHOLDERS[placeholderIndex]}&rdquo;
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}

              {/* Clear button when typing */}
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Admin, Login & Dynamic Green Cart Button */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#14532D] text-white hover:bg-[#15803D] transition-colors shadow-xs cursor-pointer"
              title="Store Admin Panel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#86efac]" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold text-[#121212] hover:bg-black/10 transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-slate-800" />
            <span>{isLoggedIn ? (userName || 'My Account') : 'Login'}</span>
          </button>

          {/* Dynamic Green Cart Button: e.g. "0 items | ₹0" or "X items | ₹Y" */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onOpenCart}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-['Clash_Display',sans-serif] font-bold text-sm shadow-md transition-all duration-200 cursor-pointer ${
              cartCount > 0
                ? 'bg-[#085E2B] text-white hover:bg-[#064821] ring-2 ring-emerald-800/30'
                : 'bg-[#085E2B] text-white hover:bg-[#064821] border border-emerald-900/40'
            }`}
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            <span className="font-['Clash_Display',sans-serif] tracking-wide text-xs sm:text-sm">
              {cartCount === 0
                ? '0 items | ₹0'
                : `${cartCount} ${cartCount === 1 ? 'item' : 'items'} | ₹${cartTotal}`}
            </span>
          </motion.button>
        </div>
      </div>

      {/* ========================================================
          MOBILE VIEW (< md): High-Fidelity 2-Row Layout
          ======================================================== */}
      <div className="md:hidden px-3.5 pt-2.5 pb-3 space-y-2.5">
        {/* Mobile Row 1: Brand Logo, Location Selector & Quick Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand & Location Lockup */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={onResetToHome}
              className="cursor-pointer focus:outline-hidden shrink-0"
              aria-label="Freshit Home"
            >
              <FreshitLogo size="sm" />
            </button>

            {/* Vertical Divider */}
            <span className="w-px h-6 bg-[#E3D4B0] shrink-0" />

            {/* Clickable Location Card */}
            <button
              onClick={onOpenLocationModal}
              className="flex flex-col text-left min-w-0 flex-1 py-0.5 px-1.5 rounded-lg active:bg-black/10 transition-colors cursor-pointer focus:outline-hidden"
            >
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tight text-[#121212] leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#085E2B] animate-pulse"></span>
                <span>Delivery in {currentAddress.eta}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800 mt-0.5 leading-none">
                <span className="truncate max-w-[130px] sm:max-w-[170px]">{currentAddress.area}</span>
                <ChevronDown className="w-3 h-3 text-slate-700 shrink-0" />
              </div>
            </button>
          </div>

          {/* Right Mobile Actions: Admin, Profile & Dynamic Green Cart Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                aria-label="Admin Portal"
                className="w-9 h-9 rounded-xl bg-[#14532D] text-white flex items-center justify-center border border-emerald-800 shadow-2xs cursor-pointer"
                title="Admin Command Center"
              >
                <ShieldCheck className="w-4 h-4 text-[#86efac]" />
              </button>
            )}

            {/* Account / User Avatar */}
            <button
              onClick={onOpenAuthModal}
              aria-label="User Account"
              className="w-9 h-9 rounded-xl bg-white/70 active:bg-white text-slate-800 flex items-center justify-center border border-[#E3D4B0]/60 backdrop-blur-md shadow-2xs cursor-pointer"
            >
              {isLoggedIn ? (
                <span className="text-xs font-black text-[#085E2B]">
                  {userName ? userName.charAt(0).toUpperCase() : 'A'}
                </span>
              ) : (
                <User className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Dynamic Green Cart Button for Mobile */}
            <button
              onClick={onOpenCart}
              aria-label="Open Shopping Cart"
              className="h-9 px-2.5 rounded-xl font-['Clash_Display',sans-serif] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer bg-[#085E2B]/90 backdrop-blur-sm text-white ring-1 ring-emerald-900/40"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs font-extrabold tabular-nums">
                {cartCount === 0 ? '₹0' : `${cartCount} · ₹${cartTotal}`}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Row 2: Prominent Full-Width Search Input */}
        <div className="relative w-full">
          <div className="relative flex items-center w-full h-11 bg-white/70 backdrop-blur-md rounded-xl border border-black/10 shadow-xs focus-within:bg-white/95 focus-within:border-[#085E2B] focus-within:ring-2 focus-within:ring-[#085E2B]/20 transition-all overflow-hidden">
            <div className="pl-3 pr-2 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4 text-slate-500" />
            </div>

            <div className="relative flex-1 h-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-full bg-transparent pr-8 text-xs font-medium text-[#121212] placeholder-transparent focus:outline-hidden"
                placeholder="Search"
                aria-label="Search fresh groceries"
              />

              {/* Animated Cycling Placeholder */}
              {!searchQuery && (
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none overflow-hidden select-none">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="text-xs font-medium text-slate-400"
                    >
                      Search &ldquo;{SEARCH_PLACEHOLDERS[placeholderIndex]}&rdquo;
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}

              {/* Clear button when query is present */}
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

