import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Heart, Share2, 
    ShieldCheck, Info, Package, 
    Loader2, Zap, TrendingUp, 
    FileText, Plus, ChevronDown, ChevronUp, LayoutGrid, Image as ImageIcon, Video,
    Flame, Bookmark, ChevronRight, ShoppingCart, Check, Lock
} from 'lucide-react';
import { CartDrawer } from '../../components/cart/CartDrawer';
import { authService } from '../../services/authService';
import { db } from '../../services/db';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { api } from '../../services/api';
import { ExploreMore } from '../../components/ExploreMore';
import { DiscussionSection } from '../../components/comments/DiscussionSection';

interface CollectionData {
    id: string;
    name: string;
    creator: string;
    avatar: string;
    price: string;
    category: string;
    description: string;
    mainImage: string;
    gallery: string[];
    rating: number;
    reviews: number;
    features: string[];
}

// Minimal Video Grid Item - No Text, Blurred, Locked
const VideoGridItem: React.FC<{ item: any }> = ({ item }) => (
    <div className="aspect-video bg-dark-900 rounded-lg border border-white/5 overflow-hidden relative group cursor-pointer hover:border-brand-500/50 transition-all">
        {/* Blurred Thumbnail */}
        <img 
            src={item.thumbnailUrl} 
            className="w-full h-full object-cover opacity-40 blur-sm scale-110 group-hover:scale-105 group-hover:opacity-30 transition-all duration-500" 
            alt="Locked Content" 
        />
        
        {/* Center Lock & Type Icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 mb-2 group-hover:scale-110 transition-transform">
                <Lock size={16} className="text-gray-300" />
            </div>
            <div className="flex items-center gap-1 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                <Video size={10} /> Video
            </div>
        </div>
    </div>
);

// Minimal Photo Grid Item - No Text, Blurred, Locked
const PhotoGridItem: React.FC<{ item: any }> = ({ item }) => (
    <div className="aspect-square bg-dark-900 rounded-lg border border-white/5 overflow-hidden relative group cursor-pointer hover:border-brand-500/50 transition-all">
        {/* Blurred Thumbnail */}
        <img 
            src={item.thumbnailUrl} 
            className="w-full h-full object-cover opacity-40 blur-sm scale-110 group-hover:scale-105 group-hover:opacity-30 transition-all duration-500" 
            alt="Locked Content" 
        />
        
        {/* Center Lock & Type Icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 mb-2 group-hover:scale-110 transition-transform">
                <Lock size={16} className="text-gray-300" />
            </div>
            <div className="flex items-center gap-1 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                <ImageIcon size={10} /> Photo
            </div>
        </div>
    </div>
);

export default function CollectionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';
    
    const [item, setItem] = useState<CollectionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    
    // Stats State
    const [isSaved, setIsSaved] = useState(false);
    const [heatCount, setHeatCount] = useState(24100);
    const [savedCount, setSavedCount] = useState(85000);
    const [isHeated, setIsHeated] = useState(false);
    
    // Mock Data
    const [bundleItems, setBundleItems] = useState<any[]>([]);
    const [isBundleExpanded, setIsBundleExpanded] = useState(false);

    useEffect(() => {
        // Scroll main content to top on navigation
        const main = document.getElementById('main-content');
        if (main) main.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        
        setLoading(true);
        
        // Simulate API Fetch
        setTimeout(() => {
            const mockItem: CollectionData = {
                id: id || '1',
                name: "EXCLUSIVE CREATOR ART BUNDLE",
                creator: "TOP_CREATOR",
                avatar: `https://picsum.photos/100/100?random=creator_${id}`,
                price: "45.00",
                category: "Featured",
                description: "A specialized pack featuring high-quality visual assets for your profile. This collection provides core community aesthetics for all verified fans and members.",
                mainImage: `https://picsum.photos/800/1000?random=${id}`, 
                gallery: [],
                rating: 4.9,
                reviews: 128,
                features: ["Total Items: 24", "File Type: Digital Download", "Verified: Yes"]
            };
            
            setItem(mockItem);

            // Mock Bundle Items (Items inside this collection) - Mixed Types
            const mockBundle = Array.from({ length: 12 }).map((_, i) => ({
                id: i + 100,
                // Title/Desc etc are available in data but NOT rendered in the grid components per request
                title: `Exclusive Content #${i + 1}`, 
                thumbnailUrl: `https://picsum.photos/300/${i % 2 === 0 ? '400' : '300'}?random=${i + 200}`,
                type: i < 4 ? 'VIDEO' : 'PHOTO', // First 4 are videos, rest photos
                userId: 'Creator_X',
            }));
            setBundleItems(mockBundle);
            
            setLoading(false);
        }, 600);
    }, [id]);

    // Infinite Scroll for Explore More
    const fetchExplore = useCallback(async (cursor?: string) => {
        await new Promise(r => setTimeout(r, 600));
        const products = await api.get<any[]>('/products');
        const baseItems = products || [];
        const mappedItems = baseItems.map((p, i) => ({
            ...p,
            id: `explore_${p.id || i}_${cursor || '0'}`, 
            type: 'COLLECTION', 
            content: p.title || p.name,
            imageUrl: p.thumbnailUrl || p.image,
            isAdult: isAdultMode
        }));

        const count = 12;
        const nextCursor = (parseInt(cursor || '0') + 1).toString();
        const slice = mappedItems.slice(0, count); 
        const injectedItems = db.injectContent(slice, 'exploreMore');
        
        return { items: injectedItems, nextCursor: nextCursor };
    }, [isAdultMode]);

    const { data: exploreItems, loading: exploreLoading } = useInfiniteScroll(fetchExplore);

    const handleAction = () => {
        if (item?.price === "0.00" || item?.price === "Free") {
            const bundleSection = document.getElementById('bundle-section');
            if (bundleSection) {
                bundleSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            setIsCartOpen(true);
        }
    };

    const handleToggleSave = () => {
        setIsSaved(!isSaved);
        setSavedCount(prev => isSaved ? prev - 1 : prev + 1);
    };

    const handleToggleHeat = () => {
        setIsHeated(!isHeated);
        setHeatCount(prev => isHeated ? prev - 1 : prev + 1);
    };

    if (loading) return <div className="min-h-screen bg-dark-850 flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-500 animate-spin" /></div>;
    if (!item) return null;

    const isFree = item.price === "0.00" || item.price === "Free";
    const videos = bundleItems.filter(i => i.type === 'VIDEO');
    const photos = bundleItems.filter(i => i.type === 'PHOTO');

    return (
        <div className="min-h-screen bg-dark-850 text-[#f4f4f5] font-sans pb-32">
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            
            {/* Header */}
            <div className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-lg border-b border-white/5 h-16 flex items-center px-8 justify-between">
                <button onClick={() => navigate('/collection')} className="flex items-center gap-4 text-white hover:text-brand-500 transition-all group">
                    <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-lg font-black tracking-tighter uppercase italic">Back to Shop</span>
                </button>
                <div className="flex gap-4">
                     <button onClick={() => setIsLiked(!isLiked)} className={`transition-all hover:scale-110 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
                        <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
                     </button>
                     <button className="text-gray-400 hover:text-white transition-all hover:scale-110">
                        <Share2 size={22} />
                    </button>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto pt-10 px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* LEFT: Main Media (Double Size) */}
                    <div className="lg:col-span-3 shrink-0">
                         <div className="w-full">
                             <div className="w-full h-[300px] bg-transparent relative rounded-sm overflow-hidden group shadow-2xl">
                                 <img src={item.mainImage} className="w-full h-full object-cover" alt={item.name} />
                                 <div className="absolute top-4 left-4 bg-brand-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-lg">
                                     FEATURED
                                 </div>
                                 <div className="absolute bottom-4 right-4 text-[20px] font-black text-white/50 uppercase tracking-widest select-none pointer-events-none">
                                     LUCISIN
                                 </div>
                             </div>
                         </div>
                    </div>

                    {/* RIGHT: Info & Actions (Flexible) */}
                    <div className="lg:col-span-9 min-w-0 space-y-8">
                         
                         <div>
                             <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-6">{item.name}</h1>
                             
                             <div className="flex items-center gap-8 border-b border-white/10 pb-8">
                                 <div 
                                    className="flex items-center gap-4 cursor-pointer group/creator"
                                    onClick={() => navigate(`/profile/${item.creator.toLowerCase()}`)}
                                 >
                                     <div className="w-12 h-12 rounded-sm bg-dark-800 p-0.5 border border-white/10 group-hover/creator:border-brand-500 transition-colors">
                                         <img src={item.avatar} className="w-full h-full object-cover rounded-sm" alt="Creator" />
                                     </div>
                                     <div>
                                         <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">Created By</div>
                                         <div className="text-base font-bold text-white flex items-center gap-1 group-hover/creator:text-brand-500 transition-colors">
                                             {item.creator} <ShieldCheck size={14} className="text-brand-500" />
                                         </div>
                                     </div>
                                 </div>
                                 
                                 <div className="flex gap-6">
                                     <button 
                                        onClick={handleToggleHeat}
                                        className="text-center group/stat hover:scale-105 transition-transform"
                                     >
                                         <div className={`text-lg font-black ${isHeated ? 'text-brand-500' : 'text-white'} flex items-center gap-1 justify-center`}>
                                            <Flame size={16} fill={isHeated ? "currentColor" : "none"} className={isHeated ? "text-brand-500" : "text-gray-400 group-hover/stat:text-brand-500"} />
                                            {heatCount.toLocaleString()}
                                         </div>
                                         <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Heat</div>
                                     </button>
                                     <button 
                                        onClick={handleToggleSave}
                                        className="text-center group/stat hover:scale-105 transition-transform"
                                     >
                                         <div className={`text-lg font-black ${isSaved ? 'text-brand-second' : 'text-white'} flex items-center gap-1 justify-center`}>
                                            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-brand-second" : "text-gray-400 group-hover/stat:text-brand-second"} />
                                            {savedCount.toLocaleString()}
                                         </div>
                                         <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Saved</div>
                                     </button>
                                 </div>
                             </div>
                         </div>
                         
                         {/* Streamlined Price/Action Section */}
                         <div className="flex items-center gap-8 py-6 my-6 border-y border-white/5">
                             <div>
                                 <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Price</div>
                                 <div className="text-3xl font-black text-white italic tracking-tighter leading-none">{item.price} <span className="text-sm text-gray-500 not-italic">LSC</span></div>
                             </div>
                             
                             <button 
                                onClick={handleAction}
                                className={`px-10 py-3 font-black rounded-sm uppercase tracking-[0.2em] text-xs shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 ${
                                    isFree 
                                    ? 'bg-white text-black hover:bg-brand-500 hover:text-white' 
                                    : 'bg-brand-600 text-white hover:bg-brand-500'
                                }`}
                             >
                                 {isFree ? (
                                    <>
                                        <Plus size={16} /> Add to Collection
                                    </>
                                 ) : (
                                    <>
                                        <Zap size={16} fill="currentColor" /> Buy Now
                                    </>
                                 )}
                             </button>
                         </div>

                         <div className="flex flex-col md:flex-row gap-6 items-start">
                             <div className="w-full md:w-56 shrink-0 bg-dark-900/50 border border-white/5 rounded-sm p-5 space-y-4">
                                 <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Info size={12} /> Specs
                                 </h4>
                                 <div className="flex justify-between items-center text-xs font-bold text-gray-400 border-b border-white/5 pb-2">
                                     <span className="uppercase tracking-widest flex items-center gap-2"><Package size={14}/> Items</span>
                                     <span className="text-white">{bundleItems.length}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                     <span className="uppercase tracking-widest flex items-center gap-2"><FileText size={14}/> Type</span>
                                     <span className="text-white italic">Mixed Media</span>
                                 </div>
                             </div>

                             <div className="flex-1 min-w-0">
                                 <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Description</h4>
                                 <p className="text-gray-300 text-sm leading-relaxed font-medium">
                                     {item.description}
                                 </p>
                                 <div className="flex flex-wrap gap-2 mt-6">
                                     {['#ART', '#DIGITAL', '#CREATIVE', '#COLLECTION', '#EXCLUSIVE'].map(tag => (
                                         <span key={tag} className="px-3 py-1.5 bg-dark-800 border border-white/5 rounded-sm text-[9px] font-black text-white uppercase tracking-widest hover:bg-brand-500 transition-colors cursor-pointer">
                                             {tag}
                                         </span>
                                     ))}
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
                
                {/* COLLECTION CONTENT (Renamed from Browse Bundle) */}
                <div className="mt-16 pt-16 border-t border-white/5">
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                        Collection Content
                    </h3>
                    
                    {/* VIDEOS GRID */}
                    {videos.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                <Video size={12}/> {videos.length} Videos
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {videos.map(vid => <VideoGridItem key={vid.id} item={vid} />)}
                            </div>
                        </div>
                    )}

                    {/* PHOTOS GRID */}
                    {photos.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                <ImageIcon size={12}/> {photos.length} Photos
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {photos.map(photo => <PhotoGridItem key={photo.id} item={photo} />)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Discussion/Reviews */}
                <div className="pt-8 border-t border-white/5 mt-12">
                    <DiscussionSection title="Reviews & Questions" />
                </div>

                {/* Explore More Section */}
                <ExploreMore items={exploreItems} loading={exploreLoading} onTip={() => {}} onItemClick={() => {}} />

            </div>
        </div>
    )
}