
import React, { useState } from 'react';
import { Heart, Star, Sparkles, Gift, Crown, X, Coins, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
}

export const TipModal = ({ isOpen, onClose, creatorName }: TipModalProps) => {
  if (!isOpen) return null;
  
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const presets = [
    { amount: 50, image: '💖', label: 'Heart', color: 'from-pink-500 to-rose-600' },
    { amount: 100, image: '⭐', label: 'Star', color: 'from-yellow-400 to-orange-500' },
    { amount: 200, image: '🚀', label: 'Rocket', color: 'from-blue-400 to-indigo-600' },
    { amount: 500, image: '💎', label: 'Gem', color: 'from-cyan-400 to-blue-500' },
    { amount: 1000, image: '👑', label: 'Crown', color: 'from-amber-400 to-yellow-600' },
  ];

  const handleSendTip = async () => {
      const amount = selectedAmount || Number(customAmount);
      if (!amount || amount <= 0) return;

      setIsProcessing(true);
      try {
          await api.post('/transactions/tip', { amount, recipient: creatorName });
          alert(`Successfully sent ${amount} LSC to ${creatorName}!`);
          onClose();
      } catch (e) {
          console.error("Tip failed", e);
          alert("Failed to send tip. Please try again.");
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 hover:bg-dark-700 rounded-xl transition-colors">
          <X size={20} />
        </button>
        
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 italic">Send a Gift</h2>
            <p className="text-sm text-gray-400">Support <span className="text-brand-400 font-bold">{creatorName}</span> with a tip!</p>
        </div>
        
        <div className="grid grid-cols-5 gap-3 mb-8">
          {presets.map((preset) => (
            <button
              key={preset.amount}
              onClick={() => { setSelectedAmount(preset.amount); setCustomAmount(''); }}
              className={`group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all relative overflow-hidden ${
                selectedAmount === preset.amount 
                  ? `bg-dark-700 border-transparent ring-2 ring-brand-500 scale-110 z-10` 
                  : 'bg-dark-900 border-dark-700 hover:bg-dark-700 hover:border-dark-500'
              }`}
            >
              <div className={`text-3xl transition-transform group-hover:scale-125 duration-300`}>
                  {preset.image}
              </div>
              <span className={`text-xs font-black transition-colors ${selectedAmount === preset.amount ? 'text-yellow-500' : 'text-gray-400'}`}>
                  {preset.amount}
              </span>
              
              {selectedAmount === preset.amount && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${preset.color} opacity-10 pointer-events-none`}></div>
              )}
            </button>
          ))}
        </div>
        
        <div className="relative mb-6 flex items-center">
           <div className="h-px bg-dark-700 flex-1"></div>
           <span className="px-3 text-xs text-gray-500 font-bold uppercase tracking-wider">Or custom amount</span>
           <div className="h-px bg-dark-700 flex-1"></div>
        </div>

        <div className="mb-8">
           <div className="relative group">
              <div className="absolute left-4 top-3.5 flex items-center gap-2 pointer-events-none">
                  <Coins className="text-gray-500 group-focus-within:text-brand-500 transition-colors" size={18} />
                  <span className="w-px h-4 bg-dark-600"></span>
              </div>
              <input 
                type="number" 
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                placeholder="Enter LucisinCoin amount"
                className="w-full bg-dark-900 border border-dark-700 rounded-xl py-3 pl-14 pr-4 text-white font-bold focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:font-normal"
              />
           </div>
        </div>
        
        <button 
            onClick={handleSendTip}
            disabled={isProcessing || (!selectedAmount && !customAmount)}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
        >
            {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Gift size={20} className={selectedAmount || customAmount ? 'animate-bounce' : ''} />}
            <span>{isProcessing ? 'Sending...' : 'Send Gift'}</span>
        </button>
      </div>
    </div>
  );
};
