
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export interface Interest {
    id: string;
    title: string;
    image: string;
}

interface InterestHubProps {
    items: Interest[];
    onSelect: (title: string) => void;
    activeItem?: string;
    className?: string;
}

export const InterestHub: React.FC<InterestHubProps> = ({ items, onSelect, activeItem, className = '' }) => {
    const [displayItems, setDisplayItems] = useState<Interest[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setDisplayItems(items);
    }, [items]);

    const handleRefresh = (e: React.MouseEvent) => {
        e.stopPropagation();
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        setDisplayItems(shuffled);
    };

    // Collapse: Show 3 items + 1 Action Card
    // Expand: Show 7 items + 1 Action Card
    const visibleCount = isExpanded ? 7 : 3;
    const currentItems = displayItems.slice(0, visibleCount);

    return (
        <div className={`mb-8 ${className}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-500">
                {currentItems.map((item) => (
                    <div 
                        key={item.id}
                        onClick={() => onSelect(item.title)}
                        className={`relative h-32 rounded-xl overflow-hidden cursor-pointer group border transition-all shadow-lg ${
                            activeItem === item.title 
                            ? 'bg-dark-800 border-brand-500 ring-1 ring-brand-500' 
                            : 'bg-black border-white/5 hover:border-brand-500/50'
                        }`}
                    >
                        <img 
                            src={item.image} 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" 
                            alt={item.title} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-3 left-3">
                            <span className="text-white font-black uppercase italic tracking-tighter text-lg leading-none block drop-shadow-md">
                                {item.title}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-brand-500 transition-colors">
                                Explore
                            </span>
                        </div>
                    </div>
                ))}

                {/* Action Card */}
                <div 
                    onClick={isExpanded ? handleRefresh : () => setIsExpanded(true)}
                    className="relative h-32 rounded-xl overflow-hidden cursor-pointer group border border-white/10 bg-dark-800 hover:border-brand-500 transition-all shadow-lg flex flex-col items-center justify-center gap-2"
                >
                    <div className="w-10 h-10 rounded-full bg-dark-900 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        {isExpanded ? <RefreshCw size={18} /> : <Plus size={18} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {isExpanded ? 'Shuffle' : 'View More'}
                    </span>
                    {isExpanded && (
                         <div 
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                            className="absolute top-2 right-2 text-gray-500 hover:text-white p-1"
                         >
                             <ChevronUp size={14} />
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};
