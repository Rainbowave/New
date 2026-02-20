
import React from 'react';
import { Lock, Crown } from 'lucide-react';

interface PostCardLockedProps {
    id: number;
    price: string;
    onUnlock: () => void;
}

export const PostCardLocked: React.FC<PostCardLockedProps> = ({ id, price, onUnlock }) => {
    return (
        <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700 mb-8 shadow-black/20">
            <div className="p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gray-700 overflow-hidden">
                    <img src={`https://picsum.photos/id/${(id * 5) % 100}/100/100`} className="w-full h-full object-cover" alt="User" />
                </div>
                <div>
                    <h4 className="font-bold text-white text-base">Creator {id}</h4>
                    <span className="text-xs text-gray-500 font-medium">Subscribers Only</span>
                </div>
            </div>
            
            <div className="relative aspect-video bg-dark-900 overflow-hidden group">
                {/* Blurred Content */}
                <img 
                    src={`https://picsum.photos/800/450?random=${id}`} 
                    className="w-full h-full object-cover blur-xl scale-110 opacity-50" 
                    alt="Locked" 
                />
                
                {/* Lock Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
                    <div className="w-16 h-16 bg-dark-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-4 border border-white/10 shadow-xl">
                        <Lock size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Exclusive Content</h3>
                    <p className="text-gray-300 text-sm mb-6 max-w-xs">This post is available for subscribers or by one-time unlock.</p>
                    
                    <button 
                        onClick={onUnlock}
                        className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-900/40 flex items-center gap-2 transition-transform hover:scale-105"
                    >
                        <Crown size={18} /> Unlock for {price}
                    </button>
                </div>
            </div>
            
            <div className="p-4 bg-dark-800/50 text-center">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Premium Access Required</p>
            </div>
        </div>
    );
};
