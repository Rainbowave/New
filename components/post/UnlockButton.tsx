import React from 'react';
import { Lock, Loader2 } from 'lucide-react';

interface UnlockButtonProps {
    price: number;
    currency?: string;
    onUnlock: () => void;
    isLoading?: boolean;
}

export const UnlockButton: React.FC<UnlockButtonProps> = ({ 
    price, 
    currency = 'LSC', 
    onUnlock, 
    isLoading = false 
}) => {
    return (
        <button 
            onClick={(e) => { e.stopPropagation(); onUnlock(); }}
            disabled={isLoading}
            className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
        >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            <span>Unlock for {price} {currency}</span>
        </button>
    );
};