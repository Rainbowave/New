
import React from 'react';
import { ShoppingBag, Heart, Star, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CollectionCardProps {
    id: number | string;
    title?: string;
    imageUrl?: string;
    price?: string;
    user: {
        username: string;
        avatar: string;
        isVerified?: boolean;
    };
    likes: number;
    timestamp?: string;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ 
    id, title, imageUrl, price, user, likes, timestamp 
}) => {
    const navigate = useNavigate();
    const avatarUrl = user?.avatar || 'https://picsum.photos/50/50?random=user';
    const username = user?.username || 'User';

    return (
        <div className="bg-dark-800 border border-white/5 rounded-xl overflow-hidden mb-8 shadow-lg group hover:border-green-500/30 transition-all cursor-pointer" onClick={() => navigate(`/collection/view/${id}`)}>
            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-dark-900/30">
                <div className="flex items-center gap-3">
                    <img src={avatarUrl} className="w-10 h-10 rounded-full object-cover border border-white/10" alt={username} />
                    <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-1">
                            {username}
                            {user?.isVerified && <ShieldCheck size={12} className="text-blue-500" />}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Added to Collection</p>
                    </div>
                </div>
                <div className="text-[10px] text-gray-600 font-mono">{timestamp}</div>
            </div>

            <div className="relative aspect-square w-full bg-dark-900 overflow-hidden">
                 <img src={imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={title} />
                 
                 {/* Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                 
                 <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                     <div>
                         <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-yellow-500 border border-yellow-500/30 mb-2 w-fit">
                             {price ? `${price} LSC` : 'Free'}
                         </div>
                         <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">{title}</h3>
                     </div>
                 </div>

                 <div className="absolute top-4 right-4 bg-green-600 text-white p-2 rounded-full shadow-lg border border-white/10">
                     <ShoppingBag size={18} />
                 </div>
            </div>

            <div className="p-4 flex items-center justify-between bg-dark-800">
                 <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                     <span className="flex items-center gap-1"><Heart size={14} className="group-hover:text-red-500 transition-colors"/> {likes}</span>
                     <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500"/> 5.0</span>
                 </div>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-green-400 transition-colors">
                     View Shop <ArrowRight size={14} />
                 </button>
            </div>
        </div>
    );
};
