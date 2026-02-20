
import React from 'react';
import { Loader2, Compass, ShoppingBag, Video, Image as ImageIcon, Smartphone, BookOpen, FileText, Flame } from 'lucide-react';
import { AdCard } from './ads/AdCard';
import { useNavigate } from 'react-router-dom';

interface ExploreMoreProps {
    items: any[];
    loading: boolean;
    onItemClick?: (id: number | string) => void;
    onTip?: (id: number | string) => void;
    label?: string;
}

export const ExploreMore: React.FC<ExploreMoreProps> = ({ items, loading, onItemClick, onTip, label = "Discovery" }) => {
    const navigate = useNavigate();

    const handleItemClick = (item: any) => {
        if (item.type === 'PRODUCT' || item.type === 'COLLECTION') navigate(`/collection/view/${item.id}`);
        else if (item.type === 'COMIC') navigate(`/comic/${item.id}`);
        else if (item.type === 'RESOURCE') navigate(`/knowledge/${item.id}`);
        else if (item.type === 'VIDEO') navigate(`/video/${item.id}`);
        else if (item.type === 'SHORT') navigate(`/videos`);
        else if (item.type === 'PHOTO') navigate(`/photo/${item.id}`);
        else navigate(`/post/${item.id}`);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video size={12} />;
            case 'SHORT': return <Smartphone size={12} />;
            case 'COMIC': return <BookOpen size={12} />;
            case 'COLLECTION': 
            case 'PRODUCT': return <ShoppingBag size={12} />;
            case 'RESOURCE': return <FileText size={12} />;
            default: return <ImageIcon size={12} />;
        }
    };

    return (
        <div className="mt-20 pb-20 border-t border-white/[0.03] pt-20 relative">
             <div className="absolute top-0 left-0 -mt-3 bg-dark-900 px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2 border border-white/5 rounded-full">
                <Compass size={12} /> {label} Section
            </div>

            {/* Masonry Layout - Fixed 250px Columns */}
            <div className="columns-[250px] gap-4 space-y-4 w-full">
                {items && items.map((item, index) => {
                    if (!item) return null;

                    // --- AD RENDER ---
                    if (item.type === 'AD') {
                        return (
                             <div key={`${item.id}-${index}`} className="break-inside-avoid mb-4 flex justify-center w-full">
                                <div className="w-full max-w-[300px] h-[250px]">
                                    <AdCard 
                                        height="h-full" 
                                        className="w-full h-full rounded-2xl shadow-lg border border-white/5" 
                                        title={item.title || "Sponsored"} 
                                        imageUrl={item.thumbnailUrl} 
                                    />
                                </div>
                             </div>
                        );
                    }
                    
                    // Safe avatar access
                    const userAvatar = item.user?.avatar || item.author?.avatar || 'https://picsum.photos/50/50';
                    const userName = item.user?.username || item.author?.username || 'Creator';

                    // --- CONTENT RENDER ---
                    return (
                         <div key={`${item.id}-${index}`} className="break-inside-avoid mb-4">
                            <div 
                                onClick={() => handleItemClick(item)}
                                className="relative group rounded-xl overflow-hidden cursor-pointer w-full bg-dark-900 border border-white/5 hover:border-brand-500/50 transition-all shadow-md"
                            >
                                <img 
                                    src={item.imageUrl || item.thumbnailUrl || item.url || item.image} 
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                                    alt={item.title || item.name} 
                                />
                                
                                {/* Badges */}
                                {(item.price && parseFloat(item.price) > 0) ? (
                                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-white font-black text-[10px] shadow-lg z-10 border border-white/10">
                                        {item.price} LSC
                                    </div>
                                ) : null}
                                 
                                 <div className="absolute top-2 left-2 p-1.5 bg-black/40 backdrop-blur rounded-full text-white/90 z-10 border border-white/5">
                                    {getTypeIcon(item.type)}
                                </div>
                                
                                {/* Overlay Title & Info on Hover - Clean Style */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
                                    <h4 className="text-white font-bold text-sm line-clamp-2 mb-3 leading-tight">{item.title || item.name || item.content}</h4>
                                    
                                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                        <div className="flex items-center gap-2 group/user hover:opacity-100 transition-opacity">
                                            <img 
                                                src={userAvatar} 
                                                className="w-5 h-5 rounded-full border border-white/20 group-hover/user:border-brand-500 transition-colors" 
                                                alt=""
                                            />
                                            <span className="text-[10px] font-bold text-gray-300 group-hover/user:text-white truncate max-w-[80px]">
                                                {userName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-black text-brand-500">
                                            <Flame size={10} fill="currentColor" /> {item.heat || 'New'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </div>
                    );
                })}
            </div>
            
            {loading && (
                 <div className="py-12 flex justify-center">
                     <Loader2 className="animate-spin text-brand-500" size={24} />
                 </div>
            )}
        </div>
    );
};
