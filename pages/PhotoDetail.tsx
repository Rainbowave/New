
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
    ArrowLeft, Heart, MessageCircle, Gift, Bookmark, 
    Hash, Clock, Flame, Loader2, TrendingUp,
    MoreHorizontal, Share2, Download, Maximize2, X,
    ShieldCheck, Plus, Zap, Info, Package, FileText, Image as ImageIcon
} from 'lucide-react';
import { TipModal } from '../components/TipModal';
import { Watermark } from '../components/Shared';
import { PostCard } from '../components/PostCard';
import { AdCard } from '../components/ads/AdCard';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { DiscussionSection } from '../components/comments/DiscussionSection';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Lightbox } from '../components/media/Lightbox';
import { ExploreMore } from '../components/ExploreMore';
import { api } from '../services/api';

const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

export default function PhotoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';
    
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [heat, setHeat] = useState(354);
    const [isHeated, setIsHeated] = useState(false);
    const [savedCount, setSavedCount] = useState(8500);
    const [heatCount, setHeatCount] = useState(24100);
    
    // Comments
    const [comments, setComments] = useState<any[]>([]);
    
    // Collection Context
    const collectionId = searchParams.get('collectionId');
    const [collectionInfo, setCollectionInfo] = useState<any>(null);
    
    const postId = id || '10001';
    const imageUrl = `https://picsum.photos/1200/800?random=${postId}`;
    const creatorId = `u_${postId}`;

    useEffect(() => {
        const main = document.getElementById('main-content');
        if (main) main.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        
        setLoading(false);
        
        setComments([
            { id: 101, user: 'ArtLover', avatar: 'https://picsum.photos/50/50?random=c1', text: 'The composition is stunning!', time: '1h ago', likes: 12, score: 10 },
            { id: 102, user: 'LensMaster', avatar: 'https://picsum.photos/50/50?random=c2', text: 'Great use of lighting.', time: '3h ago', score: 5, likes: 5 },
            { id: 103, user: 'PixelFan', avatar: 'https://picsum.photos/50/50?random=c3', text: 'What camera did you use?', time: '4h ago', score: 2, likes: 1 },
            { id: 104, user: 'VibeCheck', avatar: 'https://picsum.photos/50/50?random=c4', text: 'Love this aesthetic.', time: '5h ago', score: 8, likes: 3 },
        ]);

        if (collectionId) {
             setCollectionInfo({
                 id: collectionId,
                 name: "EXCLUSIVE CREATOR ART BUNDLE",
                 itemsCount: 24,
                 price: "45.00"
             });
        }
    }, [postId, collectionId]);

    // Infinite Scroll for Related Photos (Explore More)
    const fetchRelated = useCallback(async (cursor?: string) => {
        await new Promise(r => setTimeout(r, 600));
        
        // Fetch similar photos
        const items = Array.from({ length: 12 }).map((_, i) => ({ 
            id: `explore_photo_${i}_${cursor}`,
            type: 'PHOTO', 
            timestamp: Date.now() - 3600000 * i, 
            category: 'Recommended', 
            userId: 'u_1005',
            content: `Related Photo ${(cursor ? parseInt(cursor) : 0) + i + 1}`,
            thumbnailUrl: `https://picsum.photos/600/800?random=${6000 + (cursor ? parseInt(cursor) : 0) + i}`,
            isAdult: isAdultMode
        }));

        const injectedItems = db.injectContent(items, 'relatedFeed');
        const nextCursor = (parseInt(cursor || '0') + 1).toString();
        
        return { items: injectedItems, nextCursor: nextCursor };
    }, [isAdultMode]);

    const { data: relatedPosts, loading: relatedLoading } = useInfiniteScroll(fetchRelated);

    return (
        <div className="min-h-screen bg-dark-850 text-[#f4f4f5] font-sans pb-32">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${postId}`} />
            <Lightbox isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} src={imageUrl} />

            <div className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-lg border-b border-white/5 h-16 flex items-center px-8 justify-between">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-4 text-white hover:text-brand-500 transition-all group"
                >
                    <ArrowLeft size={22} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-lg font-black tracking-tighter uppercase italic">Photo Details</span>
                </button>
            </div>

            <div className="max-w-[1600px] mx-auto pt-8 px-4 md:px-10">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* LEFT: Main Content (Image & Actions) */}
                    <div className="flex-1 min-w-0 bg-dark-800 p-6 md:p-10 rounded-sm shadow-none border border-white/[0.03]">
                        {/* Main Media Display - Limited to 50% width on Desktop */}
                        <div className="flex justify-center mb-4">
                            <div 
                                className="bg-dark-900 rounded-sm overflow-hidden border border-white/[0.05] relative group shadow-none w-full md:w-1/2 cursor-pointer mx-auto"
                                onClick={() => setIsLightboxOpen(true)}
                            >
                                <img 
                                    src={imageUrl} 
                                    className="w-full h-auto max-h-[80vh] object-contain transition-transform duration-1000" 
                                    alt="Main content" 
                                />
                                <div className="absolute top-2 left-2 bg-brand-600 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-lg">
                                     PHOTO
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                     <Maximize2 size={32} className="text-white drop-shadow-lg" />
                                </div>
                                <Watermark className="bottom-6 right-6 opacity-40 scale-75" />
                            </div>
                        </div>

                        {/* Description & Metadata */}
                        <div className="py-6 space-y-4">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Visual Signal #{postId}</h1>
                                    <p className="text-gray-400 text-sm font-medium">Captured in the moment.</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Uploaded</div>
                                    <div className="text-white font-bold text-xs">{formatDate(Date.now() - 7200000)}</div>
                                </div>
                             </div>
                             
                             {/* Tags */}
                             <div className="flex flex-wrap gap-2">
                                 {['#PHOTOGRAPHY', '#ART', '#DIGITAL', '#VISUAL', '#EXCLUSIVE'].map(tag => (
                                     <button 
                                        key={tag} 
                                        onClick={() => navigate(`/search?q=${tag.replace('#', '')}`)}
                                        className="bg-dark-700 hover:bg-brand-500 text-gray-300 hover:text-white px-3 py-1.5 rounded-sm text-[9px] font-black transition-all border border-white/5 uppercase tracking-widest"
                                     >
                                         {tag}
                                     </button>
                                 ))}
                             </div>
                        </div>

                        {/* Interactive Bar */}
                        <div className="flex items-center justify-between py-6 border-t border-b border-white/[0.03]">
                            <div className="flex items-center gap-8">
                                <button 
                                    onClick={() => { setIsLiked(!isLiked); setHeat(h => isLiked ? h-1 : h+1); }}
                                    className={`flex items-center gap-3 transition-all active:scale-90 hover:scale-110 ${isLiked ? 'text-brand-500' : 'text-white'}`}
                                >
                                    <Flame size={24} strokeWidth={1.5} fill={isLiked ? "currentColor" : "none"} />
                                    <span className="text-xl font-black italic tabular-nums tracking-tighter text-white">{heat.toLocaleString()}</span>
                                </button>
                                <button className="flex items-center gap-2 text-white hover:text-brand-500 transition-all active:scale-90 hover:scale-110">
                                    <MessageCircle size={24} strokeWidth={1.5} />
                                    <span className="text-sm font-black tabular-nums">{comments.length}</span>
                                </button>
                                <button 
                                    onClick={() => setTipModalOpen(true)}
                                    className="flex items-center gap-2 text-white hover:text-brand-500 transition-all active:scale-90 hover:scale-110"
                                >
                                    <Gift size={24} strokeWidth={1.5} />
                                    <span className="text-sm font-black tabular-nums">Tip</span>
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setIsSaved(!isSaved)}
                                    className={`transition-all active:scale-90 hover:scale-110 ${isSaved ? 'text-brand-500' : 'text-white'}`}
                                >
                                    <Bookmark size={24} strokeWidth={1.5} fill={isSaved ? "currentColor" : "none"} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                                    <Share2 size={24} />
                                </button>
                            </div>
                        </div>
                        
                        {/* Discussion */}
                        <div className="mt-8 pt-4">
                             <DiscussionSection initialComments={comments} />
                        </div>
                    </div>

                    {/* RIGHT: Sidebar (Creator & Context) */}
                    <div className="w-full lg:w-[350px] space-y-6 shrink-0">
                         
                         {/* Collection Context Card (New Feature) */}
                         {collectionInfo && (
                             <div 
                                className="mb-0 bg-dark-800 border border-brand-500/30 rounded-xl p-5 shadow-lg cursor-pointer hover:border-brand-500 transition-colors group"
                                onClick={() => navigate(`/collection/view/${collectionInfo.id}`)}
                             >
                                 <div className="flex items-center gap-2 mb-3 text-brand-500">
                                     <Package size={16} />
                                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Belongs to Collection</span>
                                 </div>
                                 <h4 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-brand-500 transition-colors">{collectionInfo.name}</h4>
                                 <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                                     <span>{collectionInfo.itemsCount} Items</span>
                                     <span className="text-white font-black">{collectionInfo.price} LSC</span>
                                 </div>
                             </div>
                         )}

                         {/* Creator Info Card */}
                         <div className="bg-dark-800 border border-white/[0.05] rounded-sm p-6 shadow-none">
                            <div className="flex items-center gap-5 mb-6 cursor-pointer" onClick={() => navigate(`/profile/Creator_${postId}`)}>
                                <div className="w-16 h-16 rounded-[5px] bg-gradient-to-br from-brand-main to-purple-600 p-[2px] shadow-none">
                                    <img src={`https://picsum.photos/100/100?random=${postId}`} className="w-full h-full rounded-[5px] object-cover border-2 border-dark-800" alt="" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-white text-lg leading-none truncate mb-2 uppercase italic tracking-tighter">Creator_{postId}</h3>
                                    <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1">
                                        <ShieldCheck size={12} className="text-brand-500" /> Verified
                                    </p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => navigate(`/profile/Creator_${postId}`)}
                                className="w-full bg-white text-black hover:bg-brand-500 hover:text-white font-black py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5 shadow-lg"
                            >
                                View Profile
                            </button>

                             {/* Context Block (Circle/Collection Simulation) */}
                             <div className="mt-8 pt-6 border-t border-white/5">
                                 <div className="flex items-center gap-2 mb-4 text-brand-500">
                                     <Package size={16} />
                                     <h4 className="text-[9px] font-black uppercase tracking-[0.4em]">In Collection</h4>
                                 </div>
                                 <div 
                                    className="bg-dark-900 p-4 rounded-sm border border-white/5 flex items-center gap-4 cursor-pointer hover:border-brand-500/50 transition-colors"
                                    onClick={() => navigate('/collection')}
                                 >
                                     <div className="w-10 h-10 rounded-[5px] bg-dark-800 flex items-center justify-center border border-white/10">
                                         <ImageIcon size={20} className="text-gray-500" />
                                     </div>
                                     <div>
                                         <h4 className="text-sm font-bold text-white leading-tight">Visual Arts Vol. 1</h4>
                                         <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">12 Items</span>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         
                         {/* Sidebar Ad */}
                         <AdCard height="h-[300px]" className="w-full rounded-sm shadow-xl" title="Featured Partner" />
                    </div>
                </div>

                {/* Explore More Container */}
                <ExploreMore items={relatedPosts} loading={relatedLoading} onTip={() => {}} onItemClick={(id) => navigate(`/photo/${id}`)} />
            </div>
        </div>
    );
}
