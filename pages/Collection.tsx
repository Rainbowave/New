import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, Search as SearchIcon, Loader2, Package, Film, Sparkles, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { RightSidebar } from '../components/RightSidebar';
import { CartDrawer } from '../components/cart/CartDrawer';
import { authService } from '../services/authService';
import { db } from '../services/db';
import { InterestHub, Interest } from '../components/InterestHub';
import { MasonryGrid } from '../components/MasonryGrid';

interface CollectionItem {
    id: number | string;
    name: string;
    price: string;
    category: string;
    image: string;
    creator: string;
    avatar: string;
    isPromoted?: boolean;
    type?: 'PRODUCT' | 'AD' | 'COLLECTION';
    link?: string;
    isAdult?: boolean;
}

const COLLECTION_FILTERS = ['All', 'Assets', 'Merch', 'Tools', 'Art', 'Music', '3D Models', 'Software', 'Services', 'Presets', 'Tutorials'];

// Hub Card Component
const HubCard: React.FC<{ title: string, image: string, onClick?: () => void }> = ({ title, image, onClick }) => (
  <div 
    onClick={onClick} 
    className="relative w-full h-[80px] rounded-[5px] overflow-hidden cursor-pointer group border border-white/5 hover:border-brand-500/50 transition-all shadow-md"
  >
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
          <h3 className="text-xs font-black text-white uppercase italic tracking-tighter drop-shadow-md">{title}</h3>
      </div>
  </div>
);

export default function Collection() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';

    const [rawCollections, setRawCollections] = useState<CollectionItem[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [isHubsExpanded, setIsHubsExpanded] = useState(false);
    
    useEffect(() => {
        const fetchInitial = async () => {
            setLoading(true);
            try {
                const [productData, trendsData, interestsData] = await Promise.all([
                    api.get<any[]>('/products'),
                    api.get<any[]>('/trends/hashtags'),
                    api.get<any[]>('/trends/tags?section=collection')
                ]);
                
                const formatted: CollectionItem[] = [];
                const sourceData = productData && productData.length > 0 ? [...productData, ...productData] : Array.from({length: 40});

                sourceData.forEach((p: any, i: number) => {
                    const height = [400, 500, 600, 350, 450][i % 5];
                    formatted.push({
                        id: p?.id ? `${p.id}_${i}` : i,
                        name: p?.title || `Product ${i+1}`,
                        price: p?.price || "45.00",
                        category: ['Assets', 'Merch', 'Tools', 'Art', 'Music'][i % 5],
                        image: p?.thumbnailUrl || `https://picsum.photos/600/${height}?random=${i+200}`,
                        creator: p?.userId ? `Creator_${p.userId}` : 'Artist',
                        avatar: `https://picsum.photos/100/100?random=${i}`,
                        isPromoted: i % 10 === 0, 
                        type: 'COLLECTION',
                        isAdult: isAdultMode
                    });
                });

                const injectedCollection = db.injectContent(formatted, 'collection');
                setRawCollections(injectedCollection);
                setTrends(trendsData);
                
                setInterests(interestsData.map((t: any) => ({
                    id: t.id,
                    title: t.tag,
                    image: t.image
                })));

            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchInitial();
    }, [isAdultMode]);

    const collections = useMemo(() => rawCollections.filter(p => {
        const matchesFilter = activeFilter === 'All' || p.category === activeFilter || p.type === 'AD';
        return matchesFilter;
    }), [rawCollections, activeFilter]);

    const handleAddToCart = () => {
        setIsCartOpen(true);
    };
    
    // Hubs for Visual Grid (using fetched interests)
    const displayedHubs = isHubsExpanded ? interests : interests.slice(0, 5);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-dark-850">
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <div className="flex-1 min-w-0 flex flex-col relative">
                {/* Single Row Filter Header */}
                <div className="sticky top-0 z-40 bg-dark-950/95 backdrop-blur-xl border-b border-white/5 py-3 px-6 flex items-center gap-4">
                    <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 mask-linear-fade">
                        {COLLECTION_FILTERS.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                                    activeFilter === filter 
                                    ? 'bg-brand-500 text-white border-brand-500 shadow-lg' 
                                    : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white hover:bg-dark-700'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    
                    {/* Right Arrow */}
                    <div className="shrink-0 text-gray-500 pl-2 bg-gradient-to-l from-dark-950 to-transparent">
                        <ChevronRight size={18} />
                    </div>

                    {/* Orders Button */}
                    <button 
                        onClick={() => navigate('/collection/orders')} 
                        className="bg-white text-black font-black px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-widest shadow-xl hover:bg-gray-200 transition-all flex items-center gap-2 whitespace-nowrap border border-white"
                    >
                        <Package size={14} /> My Orders
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1">
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                        
                         {/* Visual Categories Grid (Top of Page) */}
                        <div className="mb-12">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 transition-all duration-500">
                                {displayedHubs.map((hub, i) => (
                                    <HubCard 
                                        key={i} 
                                        title={hub.title} 
                                        image={hub.image}
                                        onClick={() => setActiveFilter(hub.title)} 
                                    />
                                ))}
                            </div>
                        </div>

                        {loading ? (
                             <div className="py-20 flex justify-center shadow-none"><Loader2 className="animate-spin text-brand-500" /></div>
                        ) : (
                             <MasonryGrid 
                                 items={collections} 
                                 onAddToCart={handleAddToCart}
                                 onTip={() => {}}
                                 onCommentClick={() => {}}
                             />
                        )}
                        
                        {collections.length === 0 && !loading && (
                            <div className="py-20 text-center opacity-40 text-xs font-black uppercase tracking-widest text-gray-500 flex flex-col items-center gap-4">
                                 <Package size={48} />
                                 No items found in {activeFilter}.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="hidden lg:block w-[300px] shrink-0 transition-all duration-300">
                <div className="sticky top-0 h-screen overflow-hidden border-l border-white/5 bg-[#141414]">
                    <RightSidebar trends={trends} onPromoteClick={() => {}} showAd={false} showFooter={false} category="collection" />
                </div>
            </div>
        </div>
    );
}