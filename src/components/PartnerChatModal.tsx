import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bike, ShieldCheck, CheckCheck } from 'lucide-react';

interface PartnerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  vehicleNumber: string;
}

interface Message {
  id: string;
  sender: 'user' | 'rider';
  text: string;
  time: string;
}

export const PartnerChatModal: React.FC<PartnerChatModalProps> = ({
  isOpen,
  onClose,
  partnerName,
  vehicleNumber,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'rider',
      text: `Hi Aarav! I have picked up your groceries from Sector 29 dark store. On my way!`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    'Please leave it at the door',
    'Do not ring the bell',
    'Call when you reach the gate',
    'Take the lift to 4th floor',
  ];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: text.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Rider automated reply simulation
    setTimeout(() => {
      const riderReply: Message = {
        id: String(Date.now() + 1),
        sender: 'rider',
        text: 'Noted! Following your instructions.',
        time: 'Just now',
      };
      setMessages((prev) => [...prev, riderReply]);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 overflow-hidden z-10 flex flex-col h-[520px] font-['Satoshi',sans-serif]"
          >
            {/* Header */}
            <div className="p-4 bg-[#121212] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#085E2B] text-white font-bold text-sm flex items-center justify-center font-['Clash_Display',sans-serif]">
                  VS
                </div>
                <div>
                  <h3 className="text-sm font-bold font-['Clash_Display',sans-serif] leading-tight">
                    Chat with {partnerName}
                  </h3>
                  <span className="text-[11px] text-emerald-400 block font-medium">
                    EV Scooter · {vehicleNumber}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${
                      msg.sender === 'user'
                        ? 'bg-[#085E2B] text-white rounded-br-none shadow-xs'
                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="p-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => sendMessage(reply)}
                  className="px-2.5 py-1 rounded-full border border-slate-200 text-[10px] font-bold text-slate-700 whitespace-nowrap hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type instructions for delivery partner..."
                className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-[#085E2B]"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-[#085E2B] hover:bg-[#064821] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
