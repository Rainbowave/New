
import React, { useMemo } from 'react';
import { AdCard } from './ads/AdCard';
import { useNavigate } from 'react-router-dom';
import { Video, Image as ImageIcon, BookOpen, ShoppingBag, Smartphone, Flame, FileText, BarChart2 } from 'lucide-react';
import { PostCard } from './PostCard';

interface MasonryGridProps {
    items: any[];
    onTip?: (id: number | string) => void;
    onCommentClick?: (id: number | string) => void;
    onAddToCart?: (item: any) => void;
    className?: string;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ items, onTip, onCommentClick, onAddToCart, className }) => {
    const navigate = useNavigate();

    // Inject Ad logic to ensure one appears on the first row (e.g., at index 1)
    const displayItems = useMemo(() => {
        if (!items) return [];
        const copy = [...items];
        // Check if we have items and if there's already an ad in the first 3 spots
        const hasEarlyAd = copy.slice(0, 3).some(i => i.type === 'AD');
        
        if (copy.length > 2 && !hasEarlyAd) {
            // Inject Ad at index 1 (2nd item)
            copy.splice(1, 0, { type: 'AD', id: 'system_injected_ad', isInjected: true });
        }
        return copy;
    }, [items]);

    const handleItemClick = (item: any) => {
        if (item.type === 'PRODUCT' || item.type === 'COLLECTION') navigate(`/collection/view/${item.id}`);
        else if (item.type === 'COMIC') navigate(`/comic/${item.id}`);
        else if (item.type === 'RESOURCE') navigate(`/knowledge/${item.id}`);
        else if (item.type === 'VIDEO') navigate(`/video/${item.id}`);
        else if (item.type === 'SHORT') navigate(`/videos`);
        else if (item.type === 'PHOTO') navigate(`/photo/${item.id}`);
        else if (item.type === 'POLL') navigate(`/poll/${item.id}`);
        else navigate(`/post/${item.id}`);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video size={10} />;
            case 'SHORT': return <Smartphone size={10} />;
            case 'COMIC': return <BookOpen size={10} />;
            case 'COLLECTION': 
            case 'PRODUCT': return <ShoppingBag size={10} />;
            case 'RESOURCE': return <FileText size={10} />;
            case 'POLL': return <BarChart2 size={10} />;
            default: return <ImageIcon size={10} />;
        }
    };

    // Updated gridClass: 'columns-2' for mobile with 'gap-2' (8px) to fit 2 items comfortably. 
    // Larger screens get larger gaps.
    const gridClass = className || "columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 md:gap-4 w-full px-0.5";

    return (
        <div className={gridClass}>
            {displayItems.map((item, index) => {
                if (!item) return null;

                // --- AD CARD RENDER ---
                if (item.type === 'AD') {
                    return (
                        <div key={`${item.id}-${index}`} className="break-inside-avoid mb-2 md:mb-4 flex justify-center w-full mx-auto">
                            <div className="w-full h-[180px] sm:h-[250px] shrink-0">
                                <AdCard 
                                    height="h-full" 
                                    className="w-full rounded-xl shadow-lg border border-white/5" 
                                    title="Sponsored" 
                                    imageUrl={item.thumbnailUrl} 
                                />
                            </div>
                        </div>
                    );
                }

                const isVisual = ['PHOTO', 'VIDEO', 'SHORT', 'COMIC', 'COLLECTION', 'PRODUCT', 'RESOURCE'].includes(item.type);
                
                // Safe avatar access
                const userAvatar = item.user?.avatar || item.author?.avatar || item.avatar || 'https://picsum.photos/50/50';
                const userName = item.user?.username || item.author?.username || item.creator || 'Creator';

                // --- VISUAL CONTENT CARD (Overlay Style) ---
                if (isVisual) {
                    return (
                        <div key={`${item.id}-${index}`} className="break-inside-avoid mb-2 md:mb-4 w-full">
                            <div 
                                onClick={() => handleItemClick(item)}
                                className="relative group rounded-xl overflow-hidden cursor-pointer w-full bg-dark-900 border border-white/5 hover:border-brand-500/50 transition-all shadow-md"
                            >
                                {/* Main Image */}
                                <img 
                                    src={item.thumbnailUrl || item.url || item.image || item.imageUrl} 
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                                    alt={item.title || item.name || item.content} 
                                    loading="lazy"
                                />
                                
                                {/* Top Badges (Always Visible) */}
                                {(item.price && parseFloat(item.price) > 0) ? (
                                    <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-white font-black text-[8px] shadow-lg z-10 border border-white/10">
                                        {item.price}
                                    </div>
                                ) : null}
                                 
                                 <div className="absolute top-1.5 left-1.5 p-1 bg-black/40 backdrop-blur rounded-full text-white/90 z-10 border border-white/5">
                                    {getTypeIcon(item.type)}
                                </div>
                                
                                {/* Hover Overlay - Titles here only, removed heat */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 md:p-3 z-20">
                                    <h4 className="text-white font-bold text-[10px] md:text-xs line-clamp-2 mb-2 leading-tight">
                                        {item.title || item.name || item.content}
                                    </h4>
                                    
                                    <div className="flex items-center justify-between border-t border-white/10 pt-2">
                                        {/* User Info */}
                                        <div className="flex items-center gap-1.5 group/user hover:opacity-100 transition-opacity">
                                            <img 
                                                src={userAvatar} 
                                                className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border border-white/20 group-hover/user:border-brand-500 transition-colors" 
                                                alt=""
                                            />
                                            <span className="text-[8px] md:text-[9px] font-bold text-gray-300 group-hover/user:text-white truncate max-w-[60px]">
                                                {userName}
                                            </span>
                                        </div>
                                        
                                        {/* Cart (only for products) */}
                                        <div className="flex items-center gap-2">
                                            {onAddToCart && (item.type === 'PRODUCT' || item.type === 'COLLECTION') && (
                                                 <button 
                                                     onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                                                     className="p-1 bg-white text-black rounded-full hover:bg-brand-500 hover:text-white transition-colors"
                                                     title="Add to Cart"
                                                 >
                                                     <ShoppingBag size={10} />
                                                 </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                // --- TEXT/POLL CARD (Render directly via PostCard logic to show UI) ---
                return (
                    <div key={`${item.id}-${index}`} className="break-inside-avoid mb-2 md:mb-4 w-full">
                        <PostCard 
                            id={item.id}
                            type={item.type || 'POST'}
                            category={item.category || item.type}
                            content={item.title || item.content}
                            pollData={item.pollData}
                            author={item.user || item.author}
                            ownerId={item.userId}
                            price={item.price}
                            compact={true}
                            masonry={true}
                            isAdult={item.isAdult}
                            onTip={(id) => onTip && onTip(id)}
                            onCommentClick={(id) => onCommentClick && onCommentClick(id)}
                        />
                    </div>
                );
            })}
        </div>
    );
};
