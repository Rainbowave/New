
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, Search as SearchIcon, Filter, Loader2, Tag, 
  Store, Megaphone, TrendingUp, Users, ArrowRight, Hash, Film, 
  ChevronRight, ChevronDown, ChevronUp, CheckCircle, Plus, Package, ExternalLink,
  Image as ImageIcon, Video, BookOpen, Shuffle, Gamepad2, Grid, Headphones, Sparkles, Heart, Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { RightSidebar } from '../components/RightSidebar';
import { CartDrawer } from '../components/cart/CartDrawer';
import { authService } from '../services/authService';
import { db } from '../services/db';

interface CollectionItem {
    id: number | string;
    name: string;
    price: string;
    category: string;
    image: string;
    creator: string;
    avatar: string;
    isPromoted?: boolean;
    type?: 'PRODUCT' | 'AD';
    link?: string;
    isAdult?: boolean; // Experience Mode
}

const ProductMasonryItem: React.FC<{ collection: CollectionItem, onAddToCart: (c: CollectionItem) => void, onClick: () => void }> = ({ collection, onAddToCart, onClick }) => {
    
    if (collection.type === 'AD') {
        return (
            <div onClick={() => window.open(collection.link || '#', '_blank')} className="break-inside-avoid mb-6 rounded-sm overflow-hidden border border-brand-500/20 bg-dark-800 relative group shadow-lg cursor-pointer">
                 <div className="absolute top-2 left-2 z-10 bg-white text-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest flex items-center gap-1 shadow-lg">
                    <Megaphone size={10} /> SPONSORED
                 </div>
                 <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1.5 rounded-sm"><ExternalLink size={12} className="text-white"/></div>
                 <img src={collection.image} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-all" alt="Ad" />
            </div>
        );
    }

    return (
        <div onClick={onClick} className={`break-inside-avoid mb-6 rounded-sm overflow-hidden relative group cursor-pointer transition-all border shadow-none ${collection.isPromoted ? 'bg-brand-900/5 border-2 border-brand-500/30 shadow-lg' : 'bg-dark-800 border-white/5 hover:border-brand-500'}`}>
            <div className={`relative w-full`}>
                <img src={collection.image} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 block" alt={collection.name} loading="lazy" />
                
                {/* Badges */}
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                    {collection.isPromoted && (
                        <div className="bg-brand-500 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-lg flex items-center gap-1">
                            <Sparkles size={10} /> Featured
                        </div>
                    )}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                     <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                        <h4 className="text-white font-black uppercase italic tracking-tight text-sm mb-1 truncate">{collection.name}</h4>
                        <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                             <img src={collection.avatar} className="w-4 h-4 rounded-full border border-white/20" alt="" />
                             {collection.creator}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-yellow-500 font-black text-xs">{collection.price} LSC</span>
                            <button onClick={(e) => { e.stopPropagation(); onAddToCart(collection); }} className="bg-white text-black p-2.5 rounded-full hover:bg-brand-500 hover:text-white transition-all shadow-2xl">
                                <ShoppingCart size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HubCard: React.FC<{ title: string, image: string, onClick?: () => void }> = ({ title, image, onClick }) => (
  <div 
    onClick={onClick} 
    className="relative w-full h-[80px] rounded-lg overflow-hidden cursor-pointer group border border-white/5 hover:border-brand-500/50 transition-all shadow-md"
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
    const canMonetize = currentUser?.userSettings?.canMonetize ?? (currentUser?.role === 'creator' || currentUser?.role === 'admin');
    const isAdultMode = currentUser?.contentPreference === 'adult';

    const [rawCollections, setRawCollections] = useState<CollectionItem[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isHubsExpanded, setIsHubsExpanded] = useState(false);
    const [addedToPride, setAddedToPride] = useState(false);
    
    useEffect(() => {
        const fetchInitial = async () => {
            setLoading(true);
            try {
                const [productData, trendsData] = await Promise.all([
                    api.get<any[]>('/products'),
                    api.get<any[]>('/trends/hashtags')
                ]);
                
                const formatted: CollectionItem[] = [];
                // Generate more mock data if needed
                const sourceData = productData && productData.length > 0 
                    ? [...productData, ...productData, ...productData, ...productData] 
                    : Array.from({length: 40});

                sourceData.forEach((p: any, i: number) => {
                    const heights = [400, 500, 600, 350, 450]; // Varied heights for masonry
                    const height = heights[i % heights.length];
                    
                    // Map generic categories to new specific ones for demo data
                    const demoCategories = ['Photos', 'Shorts & Live', 'Comics', 'Audio', 'RandomCam', 'Arcade'];
                    const mappedCategory = demoCategories[i % demoCategories.length];

                    formatted.push({
                        id: p?.id ? `${p.id}_${i}` : i,
                        name: p?.title || `Product ${i+1}`,
                        price: p?.price || "45.00",
                        category: mappedCategory, // Use mapped category
                        image: p?.thumbnailUrl || `https://picsum.photos/600/${height}?random=${i+200}`,
                        creator: p?.userId ? `Creator_${p.userId}` : 'Artist',
                        avatar: `https://picsum.photos/100/100?random=${i}`,
                        isPromoted: false, // Will be handled by injectContent
                        type: 'PRODUCT',
                        isAdult: isAdultMode // Strict Mode
                    });
                });

                // INJECT CONTENT
                const injectedCollection = db.injectContent(formatted, 'collection');

                setRawCollections(injectedCollection);
                setTrends(trendsData);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchInitial();
    }, [isAdultMode]);

    useEffect(() => {
        setAddedToPride(false);
    }, [filter]);

    const collections = useMemo(() => rawCollections.filter(p => {
        const matchesFilter = filter === 'All' || p.category === filter || p.type === 'AD';
        const matchesSearch = !searchQuery || (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    }), [rawCollections, filter, searchQuery]);

    const handleAddToCart = (c: CollectionItem) => {
        setIsCartOpen(true);
    };

    const handleAddToPride = () => {
        db.togglePrideTag(filter);
        setAddedToPride(true);
    };

    // Visual Hubs - Filtered by current category or general trending
    const HUBS = [
        { title: "New Drops", image: "https://picsum.photos/400/300?random=p1", filter: 'All' },
        { title: "Presets", image: "https://picsum.photos/400/300?random=p2", filter: 'Photos' },
        { title: "Overlays", image: "https://picsum.photos/400/300?random=p3", filter: 'Shorts & Live' },
        { title: "Volumes", image: "https://picsum.photos/400/300?random=p4", filter: 'Comics' },
        { title: "Filters", image: "https://picsum.photos/400/300?random=p5", filter: 'RandomCam' },
        { title: "Cheats", image: "https://picsum.photos/400/300?random=p6", filter: 'Arcade' },
        { title: "Skins", image: "https://picsum.photos/400/300?random=p7", filter: 'Arcade' },
        { title: "Prints", image: "https://picsum.photos/400/300?random=p8", filter: 'Photos' },
        { title: "Merch", image: "https://picsum.photos/400/300?random=p9", filter: 'All' },
        { title: "Sound FX", image: "https://picsum.photos/400/300?random=p10", filter: 'Audio' },
    ];

    const displayedHubs = isHubsExpanded ? HUBS : HUBS.slice(0, 5);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-dark-850">
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <div className="flex-1 min-w-0 flex flex-col relative">
                
                {/* Header Actions (Sticky) */}
                <div className="sticky top-0 z-40 bg-dark-950/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-brand-500/10 rounded-lg text-brand-500 hidden md:block">
                             <Film size={20} />
                         </div>
                         <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">Collection Hub</h1>
                    </div>
                    
                    <div className="flex gap-2">
                        {filter !== 'All' && (
                            <button 
                                onClick={handleAddToPride}
                                disabled={addedToPride}
                                className={`hidden md:flex flex-shrink-0 items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all shadow-lg ${
                                    addedToPride
                                    ? 'bg-transparent border-brand-500 text-brand-500 cursor-default'
                                    : 'bg-brand-500 hover:bg-brand-600 text-white border-brand-400'
                                }`}
                            >
                                {addedToPride ? <CheckCircle size={12} strokeWidth={3} /> : <Plus size={12} strokeWidth={3} />}
                                {addedToPride ? 'Saved' : 'Save Filter'}
                            </button>
                        )}
                        <button 
                            onClick={() => navigate('/collection/orders')} 
                            className="bg-white text-black font-black px-5 py-2 rounded-lg text-[10px] uppercase tracking-widest shadow-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                            <Package size={14} /> My Orders
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row flex-1">
                    {/* Main Grid Area */}
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                         
                        <div className="mb-6 flex">
                             <div className="relative group w-full max-w-md">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-500 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)} 
                                    placeholder="SEARCH VAULT..." 
                                    className="w-full bg-dark-800 border border-white/5 rounded-sm py-4 pl-12 pr-4 text-xs font-black text-white focus:border-brand-500 outline-none transition-all uppercase placeholder:text-[9px] placeholder:tracking-[0.3em]" 
                                />
                             </div>
                        </div>

                         {/* Hubs / Featured Filters */}
                        <div className="mb-10">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 transition-all duration-500">
                                {displayedHubs.map((hub, i) => (
                                    <HubCard 
                                        key={i} 
                                        title={hub.title} 
                                        image={hub.image}
                                        onClick={() => setFilter(hub.filter)} 
                                    />
                                ))}
                            </div>
                            {HUBS.length > 5 && (
                                <div className="mt-4 flex justify-center">
                                    <button 
                                        onClick={() => setIsHubsExpanded(!isHubsExpanded)}
                                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-800 hover:bg-dark-700 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all"
                                    >
                                        {isHubsExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                        {isHubsExpanded ? 'Less' : 'More'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                            {collections.map((item, index) => (
                                <ProductMasonryItem 
                                    key={`${item.id}-${index}`} 
                                    collection={item} 
                                    onAddToCart={handleAddToCart} 
                                    onClick={() => item.type !== 'AD' && navigate(`/collection/view/${item.id}`)} 
                                />
                            ))}
                        </div>
                        
                        {collections.length === 0 && !loading && (
                            <div className="py-20 text-center opacity-40 text-xs font-black uppercase tracking-widest text-gray-500 flex flex-col items-center gap-4">
                                 <Package size={48} />
                                 No items found in {filter}.
                            </div>
                        )}

                        {loading && <div className="py-20 flex justify-center shadow-none"><Loader2 className="animate-spin text-brand-500" /></div>}
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
