/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Product, CartItem, UserAddress, Order, PaymentDetails, UserProfile, UserWallet, Coupon } from './types';
import { PRODUCTS, SAVED_ADDRESSES, CATEGORIES, DEFAULT_USER_PROFILE, MOCK_WALLET, MOCK_PAST_ORDERS, MOCK_COUPONS } from './data/mockData';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { BlinkitCategorySection } from './components/BlinkitCategorySection';
import { ProductRow } from './components/ProductRow';
import { CategoryView } from './components/CategoryView';
import { SearchOverlay } from './components/SearchOverlay';
import { CartDrawer } from './components/CartDrawer';
import { LocationModal } from './components/LocationModal';
import { ProductModal } from './components/ProductModal';
import { MobileCartBar } from './components/MobileCartBar';
import { Footer } from './components/Footer';
import { CheckoutPage } from './components/CheckoutPage';
import { PaymentPage } from './components/PaymentPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { AccountDrawer, AccountSubView } from './components/AccountDrawer';
import { AnimatedBackground } from './components/AnimatedBackground';
import Lenis from 'lenis';

type AppRoute = 'home' | 'checkout' | 'payment' | 'order-status';

export default function App() {
  // Navigation Route State
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');

  // Persistent User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('freshit_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Persistent Saved Addresses State
  const [addresses, setAddresses] = useState<UserAddress[]>(() => {
    try {
      const saved = localStorage.getItem('freshit_addresses');
      return saved ? JSON.parse(saved) : SAVED_ADDRESSES;
    } catch {
      return SAVED_ADDRESSES;
    }
  });

  const [currentAddress, setCurrentAddress] = useState<UserAddress>(addresses[0] || SAVED_ADDRESSES[0]);

  // Strict 25-Meter Geolocation Serviceability State
  const [isServiceable, setIsServiceable] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('freshit_geolocation');
      if (saved) {
        return JSON.parse(saved).isServiceable ?? true;
      }
    } catch {
      // fallback
    }
    return true;
  });

  // Persistent Wallet State
  const [wallet, setWallet] = useState<UserWallet>(() => {
    try {
      const saved = localStorage.getItem('freshit_wallet');
      return saved ? JSON.parse(saved) : MOCK_WALLET;
    } catch {
      return MOCK_WALLET;
    }
  });

  // Persistent Order History State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('freshit_orders');
      return saved ? JSON.parse(saved) : MOCK_PAST_ORDERS;
    } catch {
      return MOCK_PAST_ORDERS;
    }
  });

  // Active ongoing order being tracked
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Cart state
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({
    'prod-dbe-1': 2, // 2x Amul Milk
    'prod-vf-1': 1,  // 1x Hybrid Tomatoes
  });

  // UI Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [accountSubView, setAccountSubView] = useState<AccountSubView>('menu');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Checkout details
  const [checkoutTip, setCheckoutTip] = useState(10);
  const [checkoutNotes, setCheckoutNotes] = useState<string[]>(['Leave at door']);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Navigation & Filtering
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification for user actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('freshit_user', JSON.stringify(userProfile));
      localStorage.setItem('freshit_addresses', JSON.stringify(addresses));
      localStorage.setItem('freshit_wallet', JSON.stringify(wallet));
      localStorage.setItem('freshit_orders', JSON.stringify(orders));
    } catch {
      // fallback
    }
  }, [userProfile, addresses, wallet, orders]);

  // Synchronize route with browser history
  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    const path = route === 'home' ? '/' : `/${route}`;
    if (window.location.pathname !== path) {
      window.history.pushState({ route }, '', path);
    }
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: false, duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Ultra-Smooth Physics-Based Inertial Scrolling Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.2,
      infinite: false,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // Pause background smooth scroll when modal or drawer overlay is open
  const isAnyOverlayOpen = isCartOpen || isLocationModalOpen || isAccountDrawerOpen || !!selectedProduct;
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (!lenis) return;
    if (isAnyOverlayOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isAnyOverlayOpen]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (path === 'checkout') setCurrentRoute('checkout');
      else if (path === 'payment') setCurrentRoute('payment');
      else if (path.startsWith('order-status')) setCurrentRoute('order-status');
      else if (path.startsWith('account')) {
        setIsAccountDrawerOpen(true);
        if (path.includes('orders')) setAccountSubView('orders');
        else if (path.includes('addresses')) setAccountSubView('addresses');
        else if (path.includes('wallet')) setAccountSubView('wallet');
        else if (path.includes('coupons')) setAccountSubView('coupons');
        else setAccountSubView('menu');
        setCurrentRoute('home');
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartQuantities((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartQuantities((prev) => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  };

  const handleClearCart = () => {
    setCartQuantities({});
  };

  // Convert quantities into CartItem[]
  const cartItems: CartItem[] = useMemo(() => {
    return Object.entries(cartQuantities)
      .map(([id, qty]) => {
        const product = PRODUCTS.find((p) => p.id === id);
        return product ? { product, quantity: qty } : null;
      })
      .filter((item): item is CartItem => item !== null);
  }, [cartQuantities]);

  const cartCount = useMemo(() => {
    return Object.values(cartQuantities).reduce((sum, q) => sum + q, 0);
  }, [cartQuantities]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  // Grand total calculation for checkout/payment
  const grandTotal = useMemo(() => {
    const handling = cartCount > 0 ? 4 : 0;
    const delivery = cartTotal >= 149 || cartCount === 0 ? 0 : 25;
    const discount = appliedCoupon ? appliedCoupon.discountValue : 0;
    const computed = cartTotal + handling + delivery + checkoutTip - discount;
    return Math.max(0, computed);
  }, [cartTotal, cartCount, checkoutTip, appliedCoupon]);

  // Curated product slices for horizontal rails
  const hotDealsProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.discountPercentage >= 20);
  }, []);

  const freshDailyProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === 'Vegetables & Fruits');
  }, []);

  const dairyStaplesProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === 'Dairy, Bread & Eggs');
  }, []);

  const snacksDrinksProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === 'Snacks & Drinks');
  }, []);

  const pantryProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === 'Atta, Rice & Dal' || p.category === 'Oil, Ghee & Masala');
  }, []);

  // Reorder flow: repopulates cart from past order
  const handleReorder = (order: Order) => {
    setCartQuantities((prev) => {
      const next = { ...prev };
      order.items.forEach((it) => {
        next[it.product.id] = (next[it.product.id] || 0) + it.quantity;
      });
      return next;
    });
    showToast(`Added ${order.items.length} items from Order #${order.id.slice(-6)} back to your cart!`);
  };

  // Address operations
  const handleAddAddress = (newAddr: UserAddress) => {
    setAddresses((prev) => [newAddr, ...prev]);
    setCurrentAddress(newAddr);
    showToast(`Added new address: ${newAddr.label} (${newAddr.area})`);
  };

  const handleUpdateAddress = (updated: UserAddress) => {
    setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (currentAddress.id === updated.id) setCurrentAddress(updated);
    showToast(`Updated address: ${updated.label}`);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (currentAddress.id === id) {
      setCurrentAddress(addresses.find((a) => a.id !== id) || SAVED_ADDRESSES[0]);
    }
    showToast('Address removed successfully');
  };

  // Wallet operations
  const handleTopUpWallet = (amount: number) => {
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      giftCards: prev.giftCards + amount,
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: 'credit',
          amount,
          title: `Wallet Top-Up via UPI`,
          date: 'Just now',
          status: 'successful',
        },
        ...prev.transactions,
      ],
    }));
    showToast(`₹${amount} added successfully to your Freshit Money!`);
  };

  // Coupon application
  const handleApplyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
    showToast(`Promo code "${coupon.code}" applied: ${coupon.title}!`);
  };

  // Flow Handlers
  const handleProceedFromCartDrawer = (tip: number, notes: string[]) => {
    setCheckoutTip(tip);
    setCheckoutNotes(notes);
    setIsCartOpen(false);
    navigate('checkout');
  };

  const handleProceedToPayment = (tip: number, notes: string[]) => {
    setCheckoutTip(tip);
    setCheckoutNotes(notes);
    navigate('payment');
  };

  const handlePaymentSuccess = (paymentDetails: PaymentDetails) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: cartItems,
      itemTotal: cartTotal,
      handlingFee: 4,
      deliveryFee: cartTotal >= 149 ? 0 : 25,
      tip: checkoutTip,
      grandTotal: grandTotal,
      address: currentAddress,
      status: 'on_the_way',
      etaMinutes: 8,
      placedTimestamp: Date.now(),
      deliveryNotes: checkoutNotes,
      paymentDetails,
      deliveryPartner: {
        name: 'Vikram Singh',
        phone: '+91 98765 43210',
        vehicleNumber: 'DL-03-EK-4819',
        rating: 4.9,
        deliveriesCount: 1420,
      },
    };

    setActiveOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    setCartQuantities({}); // clear basket
    setAppliedCoupon(null);
    navigate('order-status');
  };

  const handleCancelOrder = (orderId: string) => {
    setActiveOrder(null);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'delivered' as const } : o))
    );
    showToast('Order was cancelled successfully.');
  };

  const handleOpenAccount = (subView: AccountSubView = 'menu') => {
    setAccountSubView(subView);
    setIsAccountDrawerOpen(true);
  };

  // 1. Render Checkout Page View
  if (currentRoute === 'checkout') {
    return (
      <div className="relative min-h-screen bg-transparent">
        <AnimatedBackground />
        <CheckoutPage
          cartItems={cartItems}
          cartCount={cartCount}
          currentAddress={currentAddress}
          onUpdateQuantity={handleUpdateQuantity}
          onSelectAddress={setCurrentAddress}
          onBackToShopping={() => navigate('home')}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>
    );
  }

  // 2. Render Payment Page View
  if (currentRoute === 'payment') {
    return (
      <div className="relative min-h-screen bg-transparent">
        <AnimatedBackground />
        <PaymentPage
          grandTotal={grandTotal}
          itemCount={cartCount}
          eta={currentAddress.eta}
          onBackToCheckout={() => navigate('checkout')}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    );
  }

  // 3. Render Order Status Tracking Page View
  if (currentRoute === 'order-status') {
    return (
      <div className="relative min-h-screen bg-transparent">
        <AnimatedBackground />
        <OrderTrackingPage
          order={activeOrder}
          onBackToHome={() => navigate('home')}
          onCancelOrder={handleCancelOrder}
        />
      </div>
    );
  }

  // 4. Default Storefront Home View
  return (
    <div className="min-h-screen flex flex-col bg-transparent relative font-['Satoshi',sans-serif] text-[#121212]">
      {/* Scroll-Reactive Animated Ambient Background */}
      <AnimatedBackground />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#121212] text-white text-xs font-bold shadow-xl border border-slate-700/50 flex items-center gap-2 animate-bounce font-['Clash_Display',sans-serif]">
          <span className="w-2 h-2 rounded-full bg-[#085E2B]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Sticky Global Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenAuthModal={() => handleOpenAccount('menu')}
        currentAddress={currentAddress}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoggedIn={isLoggedIn}
        userName={userProfile.name}
        onResetToHome={() => {
          setSelectedCategory(null);
          setSearchQuery('');
          navigate('home');
        }}
      />

      {/* Strict 25-Meter Hyper-Local Serviceability Warning Banner */}
      {!isServiceable && (
        <div className="bg-rose-700 text-white px-4 py-2.5 text-xs font-bold sticky top-16 md:top-20 z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-300" />
              <span>
                We deliver exclusively to PIN 712513 and under 25 meters of our store address (Kuntighat - Magra Rd, Naya Sarai, Chandrahati Bazar). Delivery unavailable at this location.
              </span>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="px-3 py-1 bg-white text-rose-800 rounded-lg text-xs font-black shadow-xs hover:bg-rose-50 cursor-pointer shrink-0"
            >
              Verify PIN &amp; Location
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-2 sm:pb-3">
        {searchQuery.trim() !== '' ? (
          /* Search Results View */
          <SearchOverlay
            query={searchQuery}
            onClear={() => setSearchQuery('')}
            products={PRODUCTS}
            cartQuantities={cartQuantities}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onProductClick={setSelectedProduct}
            onSelectSuggestion={(term) => setSearchQuery(term)}
          />
        ) : selectedCategory ? (
          /* Deep Category View with Subcategories */
          <CategoryView
            categoryName={selectedCategory}
            products={PRODUCTS}
            cartQuantities={cartQuantities}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onProductClick={setSelectedProduct}
            onBack={() => setSelectedCategory(null)}
            onSelectCategory={(name) => setSelectedCategory(name)}
          />
        ) : (
          /* Standard Curated Storefront */
          <>
            {/* 2. Hero Promotional Carousel Banner */}
            <HeroCarousel
              onSelectCategory={(catName) => setSelectedCategory(catName)}
            />

            {/* 3. Blinkit Categories Section (Grocery & Kitchen, Snacks & Drinks, Beauty & Personal Care, Household Essentials) */}
            <BlinkitCategorySection
              onSelectCategory={(catName) => setSelectedCategory(catName)}
            />

            {/* 4. Horizontal Product Sliders */}
            
            {/* Slider 1: Hot Deals */}
            <ProductRow
              title="Hot Deals & Mega Savings"
              subtitle="Crazy discounts up to 50% off on daily essentials"
              products={hotDealsProducts}
              cartQuantities={cartQuantities}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onProductClick={setSelectedProduct}
              onSeeAll={() => setSelectedCategory('Vegetables & Fruits')}
            />

            {/* Slider 2: Your Daily Fresh Needs */}
            <ProductRow
              title="Your Daily Fresh Needs"
              subtitle="Crisp vegetables and sweet orchard fruits harvested today"
              products={freshDailyProducts}
              cartQuantities={cartQuantities}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onProductClick={setSelectedProduct}
              onSeeAll={() => setSelectedCategory('Vegetables & Fruits')}
            />

            {/* Slider 3: Dairy, Bread & Breakfast */}
            <ProductRow
              title="Dairy, Bread & Eggs"
              subtitle="Morning fuel, protein packs & artisanal bakery"
              products={dairyStaplesProducts}
              cartQuantities={cartQuantities}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onProductClick={setSelectedProduct}
              onSeeAll={() => setSelectedCategory('Dairy, Bread & Eggs')}
            />

            {/* Slider 4: Snack It Away */}
            <ProductRow
              title="Snack It Away & Cold Sips"
              subtitle="Crunches, fizzy colas, and chocolates for the night owl"
              products={snacksDrinksProducts}
              cartQuantities={cartQuantities}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onProductClick={setSelectedProduct}
              onSeeAll={() => setSelectedCategory('Snacks & Drinks')}
            />

            {/* Slider 5: Kitchen Staples */}
            <ProductRow
              title="Atta, Rice, Dal & Cooking Oil"
              subtitle="Unpolished lentils, cold-pressed oils & traditional grains"
              products={pantryProducts}
              cartQuantities={cartQuantities}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onProductClick={setSelectedProduct}
              onSeeAll={() => setSelectedCategory('Atta, Rice & Dal')}
            />
          </>
        )}
      </main>

      {/* 5. Comprehensive Multi-Column Footer with Dark Theme & Google Map Widget */}
      <Footer onSelectCategory={(cat) => setSelectedCategory(cat)} />

      {/* Floating Mobile Cart Bar */}
      <MobileCartBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        currentAddress={currentAddress}
        onProceedToCheckout={handleProceedFromCartDrawer}
      />

      {/* Interactive Location Selector Modal with Strict 25m Geolocation Engine */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={setCurrentAddress}
        isServiceable={isServiceable}
        onUpdateServiceability={(serviceable) => setIsServiceable(serviceable)}
      />

      {/* Comprehensive User Account Drawer */}
      <AccountDrawer
        isOpen={isAccountDrawerOpen}
        onClose={() => setIsAccountDrawerOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(upd) => {
          setUserProfile(upd);
          showToast('Profile updated successfully!');
        }}
        onLogout={() => {
          setIsLoggedIn(false);
          setUserProfile({ name: 'Guest User', phone: '+91 00000 00000', email: '' });
          showToast('Logged out of Freshit');
        }}
        orders={orders}
        onReorder={handleReorder}
        onTrackOrder={(ord) => {
          setActiveOrder(ord);
          navigate('order-status');
        }}
        addresses={addresses}
        currentAddress={currentAddress}
        onSelectCurrentAddress={(addr) => {
          setCurrentAddress(addr);
          showToast(`Active delivery address set to ${addr.label}`);
        }}
        onAddAddress={handleAddAddress}
        onUpdateAddress={handleUpdateAddress}
        onDeleteAddress={handleDeleteAddress}
        wallet={wallet}
        onTopUpWallet={handleTopUpWallet}
        onApplyCoupon={handleApplyCoupon}
        initialSubView={accountSubView}
      />

      {/* Product Quick-View Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        quantity={selectedProduct ? cartQuantities[selectedProduct.id] || 0 : 0}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}
