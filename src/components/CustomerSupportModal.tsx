import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Headphones, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  Clock, 
  X 
} from 'lucide-react';

interface CustomerSupportModalProps {
  onBack: () => void;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({ onBack }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'Hello! I am Priya from Freshit 24x7 Customer Care. How may I help you with your 8-minute delivery today?',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const faqs = [
    {
      q: 'How does Freshit guarantee delivery in 8 minutes?',
      a: 'We operate a dense network of high-tech local dark stores within 1.5 to 2 km of your location. Orders are picked and packed in under 2 minutes, and our dedicated electric scooter fleet delivers the remaining distance instantly.',
    },
    {
      q: 'What if an item is damaged or missing?',
      a: 'Freshit provides a zero-questions-asked refund policy. Go to Your Orders -> Report Issue, and the refund is credited back to your Freshit Wallet within 60 seconds.',
    },
    {
      q: 'How is cold chain maintained for milk and dairy?',
      a: 'All dairy, paneer, and eggs are stored in temperature-controlled deep refrigerators (2-4°C) inside our dark stores and transported in insulated thermal carrier bags.',
    },
    {
      q: 'Can I cancel an order once placed?',
      a: 'Orders can only be cancelled before they leave the dark store (within ~90 seconds of placing). Once dispatched, the rider is already on their way.',
    },
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: chatInput.trim(),
      time: 'Just now',
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent' as const,
          text: 'Thank you for reaching out! Our dispatch team at the Sector 29 dark store has been notified. We will resolve this within 2 minutes.',
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold font-['Clash_Display',sans-serif] text-[#121212]">Help &amp; Customer Support</h2>
            <span className="text-[11px] text-slate-500 font-medium">
              24x7 resolution for all grocery and delivery queries
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsLiveChatOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#085E2B] border border-emerald-200 text-xs font-bold transition-colors cursor-pointer font-['Clash_Display',sans-serif]"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat with Us</span>
        </button>
      </div>

      {/* Support Quick Contact Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#085E2B] flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-[#121212] block text-xs font-['Clash_Display',sans-serif]">
              Direct Helpline &amp; Emergency Escalation
            </span>
            <span className="text-[11px] text-slate-500">
              Average reply time: under 45 seconds
            </span>
          </div>
        </div>

        <button
          onClick={() => {}}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-[#121212] text-xs shadow-2xs cursor-pointer flex items-center gap-1.5 font-['Clash_Display',sans-serif]"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#085E2B]" />
          <span>Call 1800-200-8899</span>
        </button>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-['Clash_Display',sans-serif]">
          Frequently Asked Questions
        </h3>

        {faqs.map((faq, idx) => {
          const isOpen = activeFaq === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <button
                onClick={() => setActiveFaq(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-[#121212] cursor-pointer hover:bg-slate-50/50"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-4 pb-4 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Live Chat Modal */}
      <AnimatePresence>
        {isLiveChatOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLiveChatOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 overflow-hidden z-10 flex flex-col h-[520px] font-['Satoshi',sans-serif]"
            >
              {/* Top Header */}
              <div className="p-4 bg-[#121212] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#085E2B] text-white font-bold flex items-center justify-center text-xs font-['Clash_Display',sans-serif]">
                    FC
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-['Clash_Display',sans-serif] leading-tight">Freshit Support</h3>
                    <span className="text-[10px] text-emerald-400 font-medium">Online · Priya (Customer Care)</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsLiveChatOpen(false)}
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        m.sender === 'user'
                          ? 'bg-[#085E2B] text-white rounded-br-none shadow-xs font-medium'
                          : 'bg-white text-[#121212] rounded-bl-none border border-slate-200 shadow-2xs font-medium'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Describe your issue or question..."
                  className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-[#085E2B]"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white flex items-center justify-center cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
