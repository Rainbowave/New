
import React, { useState } from 'react';
import { X, Check, Crown, Zap, Star, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  avatarUrl: string;
  basePrice?: string;
}

export const SubscriptionModal = ({ isOpen, onClose, creatorName, avatarUrl, basePrice = "4.99" }: SubscriptionModalProps) => {
  if (!isOpen) return null;

  const [selectedTier, setSelectedTier] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);

  const tiers = [
    { id: '1', name: 'Spark Tier', duration: '1 Month', price: basePrice, save: '', icon: Star },
    { id: '3', name: 'Flame Tier', duration: '3 Months', price: (parseFloat(basePrice) * 3 * 0.85).toFixed(2), save: '15%', icon: Zap },
    { id: '12', name: 'Inferno Tier', duration: '1 Year', price: (parseFloat(basePrice) * 12 * 0.80).toFixed(2), save: '20%', icon: Crown },
  ];

  const handleSubscribe = async () => {
      setIsProcessing(true);
      try {
          await api.post('/transactions/subscribe', { tier: selectedTier, creator: creatorName });
          setTimeout(() => {
              setIsProcessing(false);
              onClose();
              alert(`Successfully subscribed to ${creatorName}!`);
          }, 1500);
      } catch (e) {
          setIsProcessing(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-dark-800 border border-dark-700 rounded-3xl w-full max-w-lg overflow-hidden relative shadow-2xl flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10">
          <X size={20} />
        </button>

        <div className="p-8 text-center bg-gradient-to-b from-brand-900/20 to-dark-800 border-b border-white/5">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-4 p-1 bg-gradient-to-tr from-brand-500 to-yellow-500 shadow-xl">
                <img src={avatarUrl} className="w-full h-full rounded-xl object-cover border-2 border-dark-900" alt={creatorName} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">Subscribe to {creatorName}</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unlock exclusive content & benefits</p>
        </div>

        <div className="p-8 space-y-4">
            {tiers.map((tier) => (
                <div 
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group ${selectedTier === tier.id ? 'bg-brand-500/10 border-brand-500 shadow-lg shadow-brand-900/20' : 'bg-dark-900 border-white/5 hover:border-white/20'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedTier === tier.id ? 'bg-brand-500 text-white' : 'bg-dark-800 text-gray-500 group-hover:text-white'}`}>
                            <tier.icon size={20} fill={selectedTier === tier.id ? "currentColor" : "none"} />
                        </div>
                        <div>
                            <h4 className={`text-sm font-black uppercase tracking-tight ${selectedTier === tier.id ? 'text-white' : 'text-gray-300'}`}>{tier.name}</h4>
                            <p className="text-xs font-bold text-gray-500">{tier.duration}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-black text-white italic tabular-nums">${tier.price}</div>
                        {tier.save && <div className="text-[9px] font-black text-green-400 bg-green-900/20 px-2 py-0.5 rounded uppercase">Save {tier.save}</div>}
                    </div>
                    {selectedTier === tier.id && (
                        <div className="absolute top-1/2 -translate-y-1/2 -left-3 bg-brand-500 rounded-full p-1 border-4 border-dark-800 shadow-lg">
                            <Check size={12} className="text-white" strokeWidth={4} />
                        </div>
                    )}
                </div>
            ))}
        </div>

        <div className="p-6 bg-dark-900 border-t border-white/5">
            <button 
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Crown size={16} fill="currentColor" />}
                {isProcessing ? 'Processing...' : 'Confirm Subscription'}
            </button>
            <p className="text-center text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-4">Recurring billing • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
};
