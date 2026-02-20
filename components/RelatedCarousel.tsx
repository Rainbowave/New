
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, Eye, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LazyImage } from './LazyImage';

interface RelatedItem {
    id: string | number;
    title: string;
    image: string;
    subtitle?: string;
    badge?: string;
    stats?: string;
    type?: 'comic' | 'post' | 'product';
    price?: string | number;
}

interface RelatedCarouselProps {
    title: string;
    items: RelatedItem[];
    type: 'comic' | 'post' | 'product';
}

export const RelatedCarousel: React.FC<RelatedCarouselProps> = ({ title, items, type }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleItemClick = (id: string | number) => {
        if (type === 'comic') navigate(`/comic/${id}`);
        else if (type === 'product') navigate(`/collection/product/${id}`);
        else navigate(`/post/${id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full py-8 border-t border-dark-700/50">
            <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {title}
                </h3>
                <div className="flex gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="p-2 bg-dark-800 rounded-full text-gray-400 hover:text-white hover:bg-dark-700 transition-colors border border-dark-700"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="p-2 bg-dark-800 rounded-full text-gray-400 hover:text-white hover:bg-dark-700 transition-colors border border-dark-700"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
            >
                {items.map((item, index) => (
                    <div 
                        key={`${item.id}-${index}`}
                        onClick={() => handleItemClick(item.id)}
                        className="min-w-[200px] w-[200px] md:min-w-[240px] md:w-[240px] snap-start bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-900/10 transition-all cursor-pointer group flex flex-col"
                    >
                        <div className={`relative overflow-hidden ${type === 'post' ? 'aspect-[4/5]' : 'aspect-square'}`}>
                            <LazyImage 
                                src={item.image} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                alt={item.title} 
                            />
                            {item.badge && (
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white border border-white/10">
                                    {item.badge}
                                </div>
                            )}
                            {item.price && (
                                <div className="absolute bottom-2 right-2 bg-brand-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
                                    {item.price} LSC
                                </div>
                            )}
                        </div>
                        
                        <div className="p-3 flex flex-col flex-1">
                            <h4 className="font-bold text-white text-sm line-clamp-1 mb-1 group-hover:text-brand-400 transition-colors">{item.title}</h4>
                            <p className="text-xs text-gray-500 mb-2 line-clamp-1">{item.subtitle}</p>
                            
                            <div className="mt-auto flex items-center justify-between text-xs font-medium text-gray-400 border-t border-dark-700/50 pt-2">
                                {type === 'product' ? (
                                    <span className="flex items-center gap-1 text-yellow-500"><Star size={10} fill="currentColor"/> 4.8</span>
                                ) : (
                                    <span className="flex items-center gap-1"><Heart size={10}/> {item.stats || '1.2K'}</span>
                                )}
                                {type === 'product' && <ShoppingBag size={12} />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
