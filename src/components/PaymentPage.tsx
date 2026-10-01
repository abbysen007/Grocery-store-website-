import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Building2, 
  Banknote, 
  Check, 
  ChevronDown, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { PaymentType, PaymentDetails } from '../types';
import { FreshitLogo } from './FreshitLogo';

interface PaymentPageProps {
  grandTotal: number;
  itemCount: number;
  eta: string;
  onBackToCheckout: () => void;
  onPaymentSuccess: (details: PaymentDetails) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  grandTotal,
  itemCount,
  eta,
  onBackToCheckout,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentType>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred' | 'vpa'>('gpay');
  const [customVpa, setCustomVpa] = useState('');
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 8920 1842 9012');
  const [cardHolder, setCardHolder] = useState('Aarav Sharma');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('382');
  const [saveCard, setSaveCard] = useState(true);

  // Wallet & Netbanking
  const [selectedWallet, setSelectedWallet] = useState<'amazonpay' | 'mobikwik' | 'paytm'>('amazonpay');
  const [selectedBank, setSelectedBank] = useState<'HDFC' | 'ICICI' | 'SBI' | 'AXIS'>('HDFC');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('Securing 256-bit bank connection...');

  // Format card number with spaces
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleInitiatePayment = () => {
    setIsProcessing(true);
    setProcessingStage('Contacting payment gateway...');

    setTimeout(() => {
      setProcessingStage('Authenticating secure transaction...');
    }, 900);

    setTimeout(() => {
      setProcessingStage('Payment verified by bank!');
    }, 1800);

    setTimeout(() => {
      const details: PaymentDetails = {
        method: selectedMethod,
        providerTitle:
          selectedMethod === 'upi'
            ? selectedUpiApp === 'vpa'
              ? `UPI ID (${customVpa || 'instant@upi'})`
              : selectedUpiApp.toUpperCase()
            : selectedMethod === 'card'
            ? `Credit Card (ending in ${cardNumber.slice(-4) || '9012'})`
            : selectedMethod === 'wallet'
            ? `${selectedWallet.toUpperCase()} Wallet`
            : selectedMethod === 'netbanking'
            ? `${selectedBank} Net Banking`
            : 'Cash on Delivery (COD)',
        transactionId: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
        paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cardLast4: selectedMethod === 'card' ? cardNumber.slice(-4) : undefined,
      };

      setIsProcessing(false);
      onPaymentSuccess(details);
    }, 2400);
  };

  return (
    <div className="min-h-screen bg-transparent pb-24 font-['Satoshi',sans-serif]">
      {/* 1. Simplified Payment Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToCheckout}
              disabled={isProcessing}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <FreshitLogo size="sm" />

            <span className="h-4 w-px bg-slate-200 hidden sm:inline-block" />

            <span className="text-xs font-bold text-slate-500 hidden sm:inline-block font-['Clash_Display',sans-serif]">
              Select Payment Option
            </span>
          </div>

          {/* Amount Badge */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="block text-[10px] uppercase font-bold text-slate-400 leading-tight font-['Clash_Display',sans-serif]">
                To Pay
              </span>
              <span className="text-base font-bold text-[#085E2B] tabular-nums leading-tight font-['Clash_Display',sans-serif]">
                ₹{grandTotal}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[#085E2B]">
              <Lock className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Delivery speed reminder banner */}
        <div className="mb-6 p-4 rounded-2xl bg-[#FFF9E6] border border-amber-300/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#121212] font-bold font-['Clash_Display',sans-serif]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#085E2B] animate-pulse"></span>
            <span>Delivery guaranteed in {eta}</span>
          </div>
          <span className="text-slate-500 font-medium font-['Satoshi',sans-serif]">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in order
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Method Selector Accordion (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            {/* 1. UPI Payment Option */}
            <div
              className={`rounded-2xl border transition-all overflow-hidden ${
                selectedMethod === 'upi'
                  ? 'border-[#085E2B] bg-white shadow-sm ring-1 ring-[#085E2B]/20'
                  : 'border-black/[0.06] bg-white hover:border-slate-300'
              }`}
            >
              <div
                onClick={() => setSelectedMethod('upi')}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedMethod === 'upi'
                        ? 'bg-[#085E2B] text-white'
                        : 'bg-emerald-50 text-[#085E2B]'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-tight">
                      UPI (Google Pay, PhonePe, Paytm)
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium font-['Satoshi',sans-serif]">
                      Instant zero-charge payment via any UPI App
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'upi'
                      ? 'border-[#085E2B] bg-[#085E2B] text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedMethod === 'upi' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* UPI Sub-options when active */}
              {selectedMethod === 'upi' && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'gpay' as const, name: 'Google Pay', badge: 'Fastest' },
                      { id: 'phonepe' as const, name: 'PhonePe' },
                      { id: 'paytm' as const, name: 'Paytm UPI' },
                      { id: 'cred' as const, name: 'CRED' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-['Clash_Display',sans-serif] ${
                          selectedUpiApp === app.id
                            ? 'border-[#085E2B] bg-white font-bold text-[#121212] shadow-2xs ring-1 ring-[#085E2B]/20'
                            : 'border-slate-200 bg-white hover:bg-slate-100/70 text-slate-600 font-semibold'
                        }`}
                      >
                        <span className="block text-xs">{app.name}</span>
                        {app.badge && (
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1 rounded-sm">
                            {app.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Or Enter UPI ID */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('vpa')}
                      className={`text-xs font-bold text-left mb-1.5 cursor-pointer font-['Satoshi',sans-serif] ${
                        selectedUpiApp === 'vpa' ? 'text-[#085E2B]' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      + Or pay using any UPI ID (VPA)
                    </button>

                    {selectedUpiApp === 'vpa' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customVpa}
                          onChange={(e) => setCustomVpa(e.target.value)}
                          placeholder="e.g. username@okhdfcbank"
                          className="flex-1 h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-hidden focus:border-[#085E2B]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Credit / Debit Cards Option */}
            <div
              className={`rounded-2xl border transition-all overflow-hidden ${
                selectedMethod === 'card'
                  ? 'border-[#085E2B] bg-white shadow-sm ring-1 ring-[#085E2B]/20'
                  : 'border-black/[0.06] bg-white hover:border-slate-300'
              }`}
            >
              <div
                onClick={() => setSelectedMethod('card')}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedMethod === 'card'
                        ? 'bg-[#085E2B] text-white'
                        : 'bg-emerald-50 text-[#085E2B]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-tight">
                      Credit / Debit Card
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium font-['Satoshi',sans-serif]">
                      Visa, MasterCard, RuPay, Maestro &amp; Diners
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'card'
                      ? 'border-[#085E2B] bg-[#085E2B] text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedMethod === 'card' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* Card Form when active */}
              {selectedMethod === 'card' && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-['Clash_Display',sans-serif]">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="4532 8920 1842 9012"
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold tracking-wider focus:outline-hidden focus:border-[#085E2B]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-slate-400">
                        VISA / MC
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-['Clash_Display',sans-serif]">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-hidden focus:border-[#085E2B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-['Clash_Display',sans-serif]">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold tracking-wider text-center focus:outline-hidden focus:border-[#085E2B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-['Clash_Display',sans-serif]">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="3 digits"
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold tracking-wider text-center focus:outline-hidden focus:border-[#085E2B]"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="rounded text-[#085E2B] focus:ring-[#085E2B]"
                    />
                    <span>Save card securely for future purchases (RBI compliant)</span>
                  </label>
                </div>
              )}
            </div>

            {/* 3. Wallets Option */}
            <div
              className={`rounded-2xl border transition-all overflow-hidden ${
                selectedMethod === 'wallet'
                  ? 'border-[#085E2B] bg-white shadow-sm ring-1 ring-[#085E2B]/20'
                  : 'border-black/[0.06] bg-white hover:border-slate-300'
              }`}
            >
              <div
                onClick={() => setSelectedMethod('wallet')}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedMethod === 'wallet'
                        ? 'bg-[#085E2B] text-white'
                        : 'bg-emerald-50 text-[#085E2B]'
                    }`}
                  >
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-tight">
                      Wallets
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium font-['Satoshi',sans-serif]">
                      Amazon Pay, Mobikwik, Paytm Wallet
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'wallet'
                      ? 'border-[#085E2B] bg-[#085E2B] text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedMethod === 'wallet' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {selectedMethod === 'wallet' && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-2">
                  {[
                    { id: 'amazonpay' as const, name: 'Amazon Pay Balance', balance: '₹420 available' },
                    { id: 'mobikwik' as const, name: 'MobiKwik ZIP / Wallet', balance: 'Instant checkout' },
                    { id: 'paytm' as const, name: 'Paytm Wallet', balance: 'Linked to mobile' },
                  ].map((w) => (
                    <div
                      key={w.id}
                      onClick={() => setSelectedWallet(w.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        selectedWallet === w.id
                          ? 'border-[#085E2B] bg-white ring-1 ring-[#085E2B]/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[#121212] block font-['Clash_Display',sans-serif]">{w.name}</span>
                        <span className="text-[10px] text-slate-500 font-['Satoshi',sans-serif]">{w.balance}</span>
                      </div>
                      {selectedWallet === w.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#085E2B]" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Net Banking Option */}
            <div
              className={`rounded-2xl border transition-all overflow-hidden ${
                selectedMethod === 'netbanking'
                  ? 'border-[#085E2B] bg-white shadow-sm ring-1 ring-[#085E2B]/20'
                  : 'border-black/[0.06] bg-white hover:border-slate-300'
              }`}
            >
              <div
                onClick={() => setSelectedMethod('netbanking')}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedMethod === 'netbanking'
                        ? 'bg-[#085E2B] text-white'
                        : 'bg-emerald-50 text-[#085E2B]'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-tight">
                      Net Banking
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium font-['Satoshi',sans-serif]">
                      All Indian banks supported
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'netbanking'
                      ? 'border-[#085E2B] bg-[#085E2B] text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedMethod === 'netbanking' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {selectedMethod === 'netbanking' && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['HDFC', 'ICICI', 'SBI', 'AXIS'] as const).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer font-['Clash_Display',sans-serif] ${
                          selectedBank === b
                            ? 'border-[#085E2B] bg-white text-[#085E2B] ring-1 ring-[#085E2B]/20'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {b} Bank
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Cash on Delivery (COD) Option */}
            <div
              className={`rounded-2xl border transition-all overflow-hidden ${
                selectedMethod === 'cod'
                  ? 'border-[#085E2B] bg-white shadow-sm ring-1 ring-[#085E2B]/20'
                  : 'border-black/[0.06] bg-white hover:border-slate-300'
              }`}
            >
              <div
                onClick={() => setSelectedMethod('cod')}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedMethod === 'cod'
                        ? 'bg-[#085E2B] text-white'
                        : 'bg-emerald-50 text-[#085E2B]'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-['Clash_Display',sans-serif] text-[#121212] leading-tight">
                      Cash on Delivery (Pay on arrival)
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium font-['Satoshi',sans-serif]">
                      Pay cash or scan rider's UPI QR at your doorstep
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'cod'
                      ? 'border-[#085E2B] bg-[#085E2B] text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedMethod === 'cod' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Payment Summary Card (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-black/[0.04] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-4">
              <h3 className="text-sm font-bold font-['Clash_Display',sans-serif] text-[#121212] pb-2 border-b border-slate-100">
                Payment Summary
              </h3>

              <div className="space-y-2 text-xs font-['Satoshi',sans-serif]">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Mode:</span>
                  <span className="font-bold text-[#121212] uppercase font-['Clash_Display',sans-serif]">
                    {selectedMethod}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Speed:</span>
                  <span className="font-bold text-[#085E2B] font-['Clash_Display',sans-serif]">{eta}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Payable:</span>
                  <span className="text-xl font-bold text-[#085E2B] tabular-nums font-['Clash_Display',sans-serif]">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Secure payment button */}
              <button
                onClick={handleInitiatePayment}
                disabled={isProcessing}
                className="w-full py-4 px-4 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white font-['Clash_Display',sans-serif] font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer disabled:opacity-80"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{grandTotal}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-['Satoshi',sans-serif]">
                <ShieldCheck className="w-4 h-4 text-[#085E2B]" />
                <span>Bank-grade 256-bit encryption</span>
              </div>
            </div>

            {/* Promo banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold font-['Clash_Display',sans-serif] block">✨ Instant Cashback Offer</span>
              <p className="text-[11px] text-amber-800 leading-snug font-['Satoshi',sans-serif]">
                Get flat ₹25 Freshit Cashback on your next 8-minute delivery when paying via UPI!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Gateway Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#085E2B] flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <h3 className="text-base font-bold font-['Clash_Display',sans-serif] text-[#121212] mb-1">
                  Processing Payment
                </h3>
                <p className="text-xs text-slate-500 font-medium animate-pulse font-['Satoshi',sans-serif]">
                  {processingStage}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-[#121212] tabular-nums font-['Clash_Display',sans-serif]">
                Amount: ₹{grandTotal}
              </div>

              <p className="text-[10px] text-slate-400 font-['Satoshi',sans-serif]">
                Please do not press back or refresh this window...
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

