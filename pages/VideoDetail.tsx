
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
    Play, Pause, Volume2, VolumeX, Maximize, Settings, 
    ThumbsUp, ThumbsDown, Share2, MoreHorizontal, 
    MessageCircle, Gift, ShieldCheck, Users, Package, ImageIcon
} from 'lucide-react';
import { authService } from '../services/authService';
import { TipModal } from '../components/TipModal';
import { useSEO } from '../hooks/useSEO';
import { AdCard } from '../components/ads/AdCard';
import { DiscussionSection } from '../components/comments/DiscussionSection';
import { db } from '../services/db';

// Updated Related Card Component
const RelatedVideoCard: React.FC<{ video: any, onClick: () => void }> = ({ video, onClick }) => (
    <div 
        onClick={onClick} 
        className="flex flex-col gap-2 group cursor-pointer overflow-hidden hover:bg-white/5 transition-all p-2 rounded-xl w-full"
    >
        <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-black shrink-0 border border-white/5 group-hover:border-brand-500/50">
            <img src={video.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={video.title} />
            <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                {video.duration}
            </div>
        </div>
        <div className="flex-1 min-w-0 px-1 pb-1">
            <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-brand-500 transition-colors mb-1.5">
                {video.title}
            </h4>
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                <p className="hover:text-white transition-colors font-bold text-gray-400">{video.creator}</p>
                <div className="flex items-center gap-1">
                    <span>{video.views} views</span>
                    <span>•</span>
                    <span>{video.date}</span>
                </div>
            </div>
        </div>
    </div>
);

export default function VideoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const currentUser = authService.getCurrentUser();

    // Collection Context
    const collectionId = searchParams.get('collectionId');
    const [collectionInfo, setCollectionInfo] = useState<any>(null);

    // State
    const [video, setVideo] = useState<any>(null);
    const [related, setRelated] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isTipOpen, setIsTipOpen] = useState(false);
    
    // Comments
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        // Mock Data Fetch
        setLoading(true);
        setTimeout(() => {
            const mockVideo = {
                id: id,
                title: "Cyberpunk City: Night Walk 4K - Ambient Sounds & Neon Lights",
                description: "Experience the futuristic vibes of Neo-Tokyo in this immersive 4K walk. Listen to the rain, see the neon lights reflecting on the wet pavement, and get lost in the atmosphere.\n\nEquipment used:\n- Camera: Sony A7S III\n- Lens: 24mm GM\n\n#cyberpunk #4k #ambience #neon",
                url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                creator: {
                    id: "u_cyber_walker",
                    name: "Cyber Walker",
                    avatar: `https://picsum.photos/100/100?random=cw`,
                    subscribers: "125K"
                },
                views: "1.2M",
                date: "2 days ago",
                likes: "45K",
                tags: ["#cyberpunk", "#4k", "#travel"]
            };

            const mockRelated = Array.from({ length: 12 }).map((_, i) => ({
                id: `rel_${i}`,
                title: `Atmospheric Journey Part ${i + 1}: ${['Rain', 'Snow', 'Sun', 'Fog'][i % 4]}`,
                thumbnail: `https://picsum.photos/300/250?random=${i + 100}`, 
                duration: "12:45",
                creator: "Cyber Walker",
                views: `${Math.floor(Math.random() * 500)}K`,
                date: "1 week ago",
                type: 'VIDEO' // Default
            }));
            
            // Inject Ads into Related List
            const mixedRelated = db.injectContent(mockRelated, 'relatedFeed');

            const mockCommentsList = [
                { id: 1, user: 'NeonFan', text: 'This is absolutely stunning visually.', time: '2h ago', likes: 12, score: 10, avatar: 'https://picsum.photos/50/50?random=c1' },
                { id: 2, user: 'TechHead', text: 'What color grading settings did you use?', time: '5h ago', likes: 8, score: 5, avatar: 'https://picsum.photos/50/50?random=c2' },
                { id: 3, user: 'VibeCheck', text: 'Perfect background for coding.', time: '1d ago', likes: 45, score: 20, avatar: 'https://picsum.photos/50/50?random=c3' },
            ];

            setVideo(mockVideo);
            setRelated(mixedRelated);
            setComments(mockCommentsList);

            if (collectionId) {
                // Mock Collection Fetch
                setCollectionInfo({
                    id: collectionId,
                    name: "EXCLUSIVE CREATOR ART BUNDLE",
                    itemsCount: 24,
                    price: "45.00"
                });
            }

            setLoading(false);
        }, 800);

        window.scrollTo(0, 0);
    }, [id, collectionId]);

    // SEO
    useSEO(
        video ? `${video.title} | LuciSin Video` : 'Video | LuciSin',
        video?.description || 'Watch exclusive video content on LuciSin.',
        video?.tags ? video.tags.map((t: string) => t.replace('#', '')) : ['video', 'streaming'],
        video ? `https://picsum.photos/1200/800?random=${video.id}` : undefined,
        'video.other'
    );

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

    if (loading) return (
        <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f0f11] text-white">
            <TipModal isOpen={isTipOpen} onClose={() => setIsTipOpen(false)} creatorName={video.creator.name} />

            <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
                
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* LEFT COLUMN: Video Player & Info */}
                    <div className="flex-1 min-w-0">
                        {/* Video Player */}
                        <div className="w-full mb-6">
                            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 group">
                                <video 
                                    ref={videoRef}
                                    src={video.url} 
                                    className="w-full h-full object-contain"
                                    onClick={togglePlay}
                                    poster={`https://picsum.photos/1200/800?random=${video.id}`}
                                />
                                
                                {/* Custom Controls Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-6">
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
                                            <Maximize size={24} />
                                        </button>
                                    </div>
                                </div>
                                
                                {!isPlaying && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-24 h-24 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                            <Play size={48} fill="white" className="ml-2 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metadata & Description */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight mb-4 leading-snug">
                                {video.title}
                            </h1>
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
                                <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                                    <span className="text-white font-bold">{video.views} views</span>
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                                    <span>{video.date}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex bg-dark-800 rounded-full p-1.5 border border-white/10">
                                        <button 
                                            onClick={() => setIsLiked(!isLiked)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-sm font-bold ${isLiked ? 'bg-white text-black' : 'text-gray-300 hover:bg-white/10'}`}
                                        >
                                            <ThumbsUp size={18} /> {video.likes}
                                        </button>
                                        <div className="w-px h-8 bg-white/10 my-auto mx-1"></div>
                                        <button className="px-5 py-2.5 rounded-full text-gray-300 hover:bg-white/10 hover:text-white transition-all">
                                            <ThumbsDown size={18} />
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-2 px-5 py-4 bg-dark-800 hover:bg-dark-700 rounded-full text-sm font-bold border border-white/10 transition-colors">
                                        <Share2 size={18} /> Share
                                    </button>
                                    <button onClick={() => setIsTipOpen(true)} className="flex items-center gap-2 px-5 py-4 bg-brand-900/20 hover:bg-brand-900/40 rounded-full text-sm font-bold border border-brand-500/30 transition-colors text-brand-400">
                                        <Gift size={18} /> Tip
                                    </button>
                                    <button className="p-4 bg-dark-800 hover:bg-dark-700 rounded-full text-gray-300 border border-white/10 transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Creator Info */}
                            <div className="bg-dark-800/30 rounded-2xl p-6 border border-white/5 mb-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-5 cursor-pointer" onClick={() => navigate(`/profile/${video.creator.id}`)}>
                                        <div className="w-16 h-16 rounded-[5px] bg-gradient-to-tr from-brand-600 to-purple-600 p-[3px]">
                                            <img src={video.creator.avatar} className="w-full h-full rounded-[5px] object-cover border-4 border-[#0f0f11]" alt="" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-xl flex items-center gap-2">
                                                {video.creator.name}
                                                <ShieldCheck size={18} className="text-brand-500" fill="currentColor" />
                                            </h3>
                                            <p className="text-sm text-gray-500 font-medium">{video.creator.subscribers} Pride Members</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsSubscribed(!isSubscribed)}
                                        className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${isSubscribed ? 'bg-dark-800 text-gray-300 border border-white/10 hover:bg-dark-700' : 'bg-white text-black hover:bg-gray-200 shadow-lg'}`}
                                    >
                                        {isSubscribed ? 'Following' : 'Join Pride'}
                                    </button>
                                </div>

                                <p className="text-sm text-gray-300 leading-loose whitespace-pre-wrap pl-2 border-l-2 border-brand-500/50">
                                    {video.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {video.tags.map((tag: string) => (
                                        <span 
                                            key={tag} 
                                            onClick={() => navigate(`/tags/${tag.replace('#', '')}`)}
                                            className="text-xs font-bold text-brand-400 bg-brand-900/10 px-3 py-1.5 rounded-lg border border-brand-500/20 cursor-pointer hover:bg-brand-900/30"
                                        >
                                            #{tag.replace('#','')}
                                        </span>
                                    ))}
                                </div>

                                {/* Ad Banner - Inside Content Area */}
                                <div className="mt-8">
                                    <AdCard height="h-[90px]" className="w-full rounded-xl" title="Sponsor Spotlight" />
                                </div>
                            </div>

                            {/* Discussion Section Integration */}
                            <div className="mt-10 pt-8 border-t border-white/5">
                                <DiscussionSection initialComments={comments} title="Video Discussion" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Up Next Grid */}
                    <div className="w-full lg:w-[350px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 pt-12 lg:pt-0 lg:pl-8">
                        
                         {/* Collection Context Card (New Feature) */}
                         {collectionInfo && (
                             <div 
                                className="mb-8 bg-dark-800 border border-brand-500/30 rounded-xl p-5 shadow-lg cursor-pointer hover:border-brand-500 transition-colors group"
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
                        
                        <div className="mb-8 flex flex-col gap-6 items-center lg:items-start">
                             <AdCard height="h-[250px]" className="w-[300px] rounded-xl shadow-xl" title="Sponsored" />
                        </div>

                        <h3 className="font-black text-white uppercase italic tracking-widest text-sm mb-6 flex items-center gap-2">
                            Up Next
                        </h3>
                        <div className="flex flex-col gap-6">
                            {related.map((item, idx) => (
                                <React.Fragment key={item.id}>
                                    {item.type === 'AD' ? (
                                        <AdCard 
                                            height="h-[180px]" 
                                            className="w-full rounded-xl mb-2" 
                                            title={item.title || "Recommended"} 
                                            imageUrl={item.thumbnailUrl} 
                                        />
                                    ) : (
                                        <RelatedVideoCard 
                                            video={item} 
                                            onClick={() => navigate(`/video/${item.id}`)} 
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-4 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
                            Load More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
