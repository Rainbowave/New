import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
    ArrowLeft, Heart, MessageCircle, Gift, Bookmark, 
    Hash, Clock, Flame, Loader2, TrendingUp,
    MoreHorizontal, Share2, Maximize2, ShieldCheck, 
    Package, FileText, Image as ImageIcon, Video, Smartphone,
    BarChart2, Zap, Play, Pause, Volume2, VolumeX, Edit2, Trash2, Settings
} from 'lucide-react';
import { TipModal } from '../components/TipModal';
import { Watermark } from '../components/Shared';
import { AdCard } from '../components/ads/AdCard';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { EditPostModal } from '../components/EditPostModal';
import { useSEO } from '../hooks/useSEO';
import { DiscussionSection } from '../components/comments/DiscussionSection';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { ExploreMore } from '../components/ExploreMore';
import { Lightbox } from '../components/media/Lightbox';
import { api } from '../services/api';

const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';
    
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [heat, setHeat] = useState(354);
    
    // Video Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Comments
    const [comments, setComments] = useState<any[]>([]);
    
    // Additional Post Data (Mock)
    const [pollData, setPollData] = useState<any>(null);
    
    // Collection Context
    const collectionId = searchParams.get('collectionId');
    const [collectionInfo, setCollectionInfo] = useState<any>(null);

    const postId = id || '10001';
    // Determine type based on ID for demo purposes, in real app this comes from DB/API
    const numericId = parseInt(postId as string) || 0;
    const isVideo = numericId % 3 === 0;
    const isPoll = numericId % 4 === 0;
    
    const imageUrl = `https://picsum.photos/1200/800?random=${postId}`;
    const creatorName = `Creator_${postId}`;

    const rawCaption = isVideo
        ? "Exploring new algorithmic boundaries in the sanctuary. #tech #visuals #art #design #future #cyber #neon #glitch #render #3d #octane #blender #cinema4d"
        : "New protocol is active! Check it out. 🔥 #update #verified #news #community #platform #lucisin #social #media";

    const cleanCaption = useMemo(() => rawCaption.replace(/#\w+/g, '').trim(), [rawCaption]);
    
    const seoTitle = isVideo ? "Exploring new boundaries" : "New Protocol Active";
    const seoTags = useMemo(() => {
        const matches = rawCaption.match(/#\w+/g);
        return matches ? matches.map(t => t.replace('#', '')) : ['post', 'content', 'lucisin'];
    }, [rawCaption]);

    useSEO(
        `${seoTitle} | LuciSin`,
        cleanCaption,
        seoTags,
        imageUrl,
        'article'
    );

    useEffect(() => {
        const main = document.getElementById('main-content');
        if (main) main.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        
        setLoading(false);
        
        // Mock Poll Injection for demo
        if (isPoll) {
            setPollData({
                question: 'Rate this content',
                options: [
                    { id: '1', label: 'Amazing', votes: 120 },
                    { id: '2', label: 'Good', votes: 45 },
                    { id: '3', label: 'Okay', votes: 10 }
                ],
                type: 'standard',
                mode: 'text'
            });
        }
        
        // Mock Comments
        setComments([
            { id: 101, user: 'FanOne', avatar: 'https://picsum.photos/50/50?random=c1', text: 'This is incredible work!', time: '1h ago', likes: 12, score: 10 },
            { id: 102, user: 'CriticX', avatar: 'https://picsum.photos/50/50?random=c2', text: 'Love the composition here.', time: '3h ago', score: 5 },
        ]);

        if (collectionId) {
             setCollectionInfo({
                 id: collectionId,
                 name: "EXCLUSIVE CREATOR ART BUNDLE",
                 itemsCount: 24,
                 price: "45.00"
             });
        }
    }, [postId, collectionId, isPoll]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch((e) => {
                        if (e.name !== 'AbortError') console.error("Play error", e);
                        setIsPlaying(false);
                    });
            }
        }
    };

    // Infinite Scroll for Related Posts
    const fetchRelated = useCallback(async (cursor?: string) => {
        await new Promise(r => setTimeout(r, 600));
        
        const items = Array.from({ length: 12 }).map((_, i) => ({ 
            id: `explore_post_${i}_${cursor}`,
            type: i % 2 === 0 ? 'PHOTO' : 'VIDEO', 
            timestamp: Date.now() - 3600000 * i, 
            category: 'Recommended', 
            userId: 'u_1005',
            content: `Related Content ${(cursor ? parseInt(cursor) : 0) + i + 1}`,
            thumbnailUrl: `https://picsum.photos/600/800?random=${8000 + (cursor ? parseInt(cursor) : 0) + i}`,
            isAdult: isAdultMode
        }));

        const injectedItems = db.injectContent(items, 'relatedFeed');
        const nextCursor = (parseInt(cursor || '0') + 1).toString();
        
        return { items: injectedItems, nextCursor: nextCursor };
    }, [isAdultMode]);

    const { data: relatedPosts, loading: relatedLoading } = useInfiniteScroll(fetchRelated);

    const postType = isVideo ? 'VIDEO' : isPoll ? 'POLL' : 'PHOTO';

    return (
        <div className="min-h-screen bg-dark-850 text-[#f4f4f5] font-sans pb-32">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={creatorName} />
            <Lightbox isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} src={imageUrl} />
            
            <EditPostModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                post={{ 
                    id: parseInt(postId as string), 
                    type: postType,
                    title: `Post ${postId}`, 
                    content: rawCaption, 
                    tags: seoTags, 
                    thumbnailUrl: imageUrl 
                }} 
                onSave={() => window.location.reload()} 
            />

            {/* Details Reverse Bar (Back Navigation) */}
            <div className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-white/5 h-14 md:h-16 flex items-center px-4 md:px-8 justify-between shadow-lg">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-3 text-white hover:text-brand-500 transition-all group"
                >
                    <ArrowLeft size={20} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-black tracking-tighter uppercase italic hidden md:inline">Back</span>
                    <span className="text-sm font-black tracking-tighter uppercase italic md:hidden">Return</span>
                </button>
                <div className="flex gap-2">
                     <button onClick={() => setIsEditModalOpen(true)} className="p-2 bg-dark-800 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors border border-white/5">
                        <Edit2 size={16} />
                    </button>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto pt-6 px-4 md:px-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    
                    {/* LEFT: Main Content (Image & Actions) - Full width mobile */}
                    <div className="w-full lg:flex-1 min-w-0 bg-dark-800 p-4 md:p-10 rounded-[5px] shadow-none border border-white/[0.03]">
                        
                        {/* Main Media Display */}
                        <div className="flex justify-center mb-6">
                            <div className="w-full max-w-4xl bg-black rounded-[5px] overflow-hidden border border-white/[0.05] relative group shadow-2xl">
                                {pollData ? (
                                     <div className="p-8 md:p-12 text-center bg-dark-900/50">
                                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 text-[10px] font-black uppercase tracking-widest mb-6">
                                            <BarChart2 size={12} /> Public Poll
                                         </div>
                                         <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-8">{pollData.question}</h2>
                                         <div className="space-y-3 max-w-md mx-auto">
                                            {pollData.options.map((opt: any) => (
                                                <button key={opt.id} className="w-full p-4 bg-dark-800 hover:bg-dark-700 border border-white/5 rounded-xl text-left text-sm font-bold text-white transition-colors flex justify-between group/opt">
                                                    <span>{opt.label}</span>
                                                    <span className="text-brand-500 opacity-0 group-hover/opt:opacity-100 transition-opacity">Vote</span>
                                                </button>
                                            ))}
                                         </div>
                                         <div className="mt-8 text-xs text-gray-500 font-bold uppercase tracking-widest">
                                             Total Votes: 175
                                         </div>
                                     </div>
                                ) : isVideo ? (
                                    <div className="aspect-video relative group/video">
                                         <video 
                                            ref={videoRef}
                                            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
                                            className="w-full h-full object-contain"
                                            onClick={togglePlay}
                                            poster={imageUrl}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity flex items-center gap-6">
                                            <button onClick={togglePlay} className="text-white hover:text-brand-500 transition-colors transform hover:scale-110">
                                                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                                            </button>
                                            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group/bar">
                                                <div className="h-full bg-brand-500 w-1/3 relative">
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover/bar:scale-100 transition-transform"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => { 
                                                    if(videoRef.current) videoRef.current.muted = !isMuted; 
                                                    setIsMuted(!isMuted); 
                                                }} className="text-white hover:text-gray-300">
                                                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                                </button>
                                                <button className="text-white hover:text-gray-300">
                                                    <Settings size={24} />
                                                </button>
                                                <button onClick={() => {
                                                    if(videoRef.current) videoRef.current.requestFullscreen();
                                                }} className="text-white hover:text-gray-300">
                                                    <Maximize2 size={24} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {!isPlaying && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-20 h-20 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                                    <Play size={40} fill="white" className="ml-2 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div 
                                        className="relative group cursor-pointer"
                                        onClick={() => setIsLightboxOpen(true)}
                                    >
                                        <img 
                                            src={imageUrl} 
                                            className="w-full h-auto max-h-[80vh] object-contain mx-auto" 
                                            alt="Main content" 
                                        />
                                        <div className="absolute top-2 left-2 bg-brand-600 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-lg">
                                             {postType}
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                                             <div className="bg-black/60 p-3 rounded-full text-white backdrop-blur-md">
                                                <Maximize2 size={24} />
                                             </div>
                                        </div>
                                        <Watermark className="bottom-6 right-6 opacity-40 scale-75" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description & Metadata */}
                        <div className="py-6 space-y-4">
                             <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">
                                        {isPoll ? 'Community Poll' : `Content Signal #${postId}`}
                                    </h1>
                                    <p className="text-gray-300 text-sm font-medium leading-relaxed whitespace-pre-wrap max-w-3xl">
                                        {cleanCaption}
                                    </p>
                                </div>
                                <div className="text-left md:text-right shrink-0">
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Uploaded</div>
                                    <div className="text-white font-bold text-xs">{formatDate(Date.now() - 7200000)}</div>
                                </div>
                             </div>
                             
                             {/* Tags */}
                             <div className="flex flex-wrap gap-2">
                                 {seoTags.map(tag => (
                                     <button 
                                        key={tag} 
                                        onClick={() => navigate(`/tags/${tag.replace('#', '')}`)}
                                        className="bg-dark-700 hover:bg-brand-500 text-gray-300 hover:text-white px-3 py-1.5 rounded-sm text-[9px] font-black transition-all border border-white/5 uppercase tracking-widest"
                                     >
                                         #{tag}
                                     </button>
                                 ))}
                             </div>
                        </div>

                        {/* Interactive Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-t border-b border-white/[0.03] gap-6 sm:gap-0">
                            <div className="flex items-center gap-6 md:gap-8">
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

                    {/* RIGHT: Sidebar (Creator & Context) - Stacks on mobile */}
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
                         <div className="bg-dark-800 border border-white/[0.05] rounded-[5px] p-6 shadow-none">
                            <div className="flex items-center gap-5 mb-6 cursor-pointer" onClick={() => navigate(`/profile/Creator_${postId}`)}>
                                <div className="w-16 h-16 rounded-sm bg-gradient-to-br from-brand-main to-purple-600 p-[2px] shadow-none">
                                    <img src={`https://picsum.photos/100/100?random=${postId}`} className="w-full h-full rounded-sm object-cover border-2 border-dark-800" alt="" />
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
                                className="w-full bg-white text-black hover:bg-brand-500 hover:text-white font-black py-3 rounded-[5px] text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5 shadow-lg"
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
                                     <div className="w-10 h-10 rounded-sm bg-dark-800 flex items-center justify-center border border-white/10">
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
                         <AdCard height="h-[300px]" className="w-full rounded-[5px] shadow-xl" title="Featured Partner" />
                    </div>
                </div>

                {/* Explore More Container */}
                <ExploreMore items={relatedPosts} loading={relatedLoading} onTip={() => {}} onItemClick={(id) => navigate(`/photo/${id}`)} />
            </div>
        </div>
    );
}