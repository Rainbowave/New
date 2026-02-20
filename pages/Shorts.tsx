
import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { Heart, MessageCircle, Play, Volume2, VolumeX, Bookmark, Share2, Gift, Search, Hash, TrendingUp, Music, Loader2, Megaphone, UserPlus, Check, ArrowLeft, X, Flame, Video, Smartphone, LayoutGrid, Clock, MoreVertical, Filter, Users, CheckCircle, ChevronDown, ChevronUp, ChevronRight, ExternalLink } from 'lucide-react';
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal';
import { api } from '../services/api';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { db } from '../services/db';
import { Watermark } from '../components/Shared';
import { useNavigate } from 'react-router-dom';
import { RightSidebar } from '../components/RightSidebar';
import { AdCard } from '../components/ads/AdCard';

interface ShortVideo {
    id: number | string;
    url?: string;
    user?: string;
    userId?: string;
    userAvatar?: string;
    desc?: string;
    likes?: number;
    comments?: number;
    isLiked?: boolean;
    isSaved?: boolean;
    tags?: string[];
    thumbnail?: string;
    isAd?: boolean;
    // For long form
    duration?: string;
    views?: string;
    date?: string;
    type?: string;
    title?: string;
    link?: string;
    isPromoted?: boolean;
}

const VideoHubCard: React.FC<{ title: string; image: string; onClick: () => void }> = ({ title, image, onClick }) => (
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

// --- LONG FORM VIDEO CARD ---
const VideoGridItem: React.FC<{ video: ShortVideo, onClick: () => void }> = ({ video, onClick }) => {
    // Handle AD
    if (video.type === 'AD') {
         return (
            <div onClick={() => window.open(video.link, '_blank')} className="group cursor-pointer flex flex-col gap-3 h-full">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-dark-800 border-2 border-brand-500/30 group-hover:border-brand-500 transition-all shadow-lg">
                    <div className="absolute top-2 left-2 z-10 bg-white text-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest flex items-center gap-1 shadow-lg">
                        <Megaphone size={10} /> SPONSORED
                    </div>
                    <img src={video.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Ad" />
                     <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur p-1 rounded-sm text-white border border-white/10">
                        <ExternalLink size={12} />
                    </div>
                </div>
                 <div className="px-1">
                     <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-brand-500 transition-colors">{video.title || video.desc}</h3>
                     <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Promoted Partner</p>
                </div>
            </div>
        );
    }

    return (
        <div onClick={onClick} className="group cursor-pointer flex flex-col gap-3">
            <div className={`relative aspect-video rounded-xl overflow-hidden bg-dark-800 border group-hover:border-brand-500/50 transition-all shadow-lg ${video.isPromoted ? 'border-brand-500/40 bg-brand-900/5 ring-1 ring-brand-500/20' : 'border-white/5'}`}>
                <img src={video.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" alt={video.desc} />
                
                {video.isPromoted && (
                    <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest flex items-center gap-1 shadow-lg">
                        <Flame size={10} fill="currentColor" /> FEATURED
                    </div>
                )}
                
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-black text-white border border-white/10 uppercase tracking-widest">
                    {video.duration || '10:24'}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-brand-600/90 rounded-full flex items-center justify-center text-white shadow-xl backdrop-blur-sm">
                        <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                </div>
            </div>
            <div className="px-1">
                 <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-brand-500 transition-colors">{video.desc}</h3>
                 <div className="flex items-center gap-2 mt-2">
                     <img src={video.userAvatar} className="w-5 h-5 rounded-full" alt="" />
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{video.user}</span>
                     <span className="text-[10px] text-gray-600">•</span>
                     <span className="text-[10px] text-gray-500">{video.views} views</span>
                 </div>
            </div>
        </div>
    );
}

// --- VERTICAL SHORT COMPONENT ---
const SingleShort = memo(({ 
    video, 
    isActive, 
    isMuted, 
    toggleMute, 
    onTip, 
    onComment 
}: { 
    video: ShortVideo, 
    isActive: boolean, 
    isMuted: boolean, 
    toggleMute: (e: React.MouseEvent) => void,
    onTip: () => void,
    onComment: () => void
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [video.url]);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;
        
        // Skip autoplay logic for Ads if implemented differently
        if (video.type === 'AD') return;

        let playPromise: Promise<void> | undefined;

        if (isActive) {
            videoEl.currentTime = 0;
            const playVideo = () => {
                playPromise = videoEl.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => setIsPlaying(true))
                        .catch(e => {
                            // Suppress AbortError which happens on fast scroll
                            if (e.name !== 'AbortError') {
                                console.warn("Autoplay failed", e);
                            }
                            setIsPlaying(false);
                        });
                }
            };

            if (videoEl.readyState >= 3) {
                playVideo();
            } else {
                videoEl.addEventListener('canplay', playVideo, { once: true });
                return () => videoEl.removeEventListener('canplay', playVideo);
            }
        } else {
            videoEl.pause();
            setIsPlaying(false);
        }
    }, [isActive, video.type]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };
    
    // RENDER AD FOR SHORTS FEED
    if (video.type === 'AD') {
         return (
             <div className="snap-item relative h-full w-full bg-dark-900 flex items-center justify-center shrink-0">
                 <div className="relative w-full max-w-md h-full flex flex-col">
                     <img src={video.thumbnail} className="w-full h-full object-cover opacity-60" alt="Ad" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 flex flex-col justify-between p-8">
                         <div className="flex justify-between items-start">
                             <div className="bg-white text-black px-3 py-1 rounded-sm text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                                <Megaphone size={12} /> Sponsored
                             </div>
                             <div className="bg-black/40 p-2 rounded-full"><ExternalLink size={20} className="text-white"/></div>
                         </div>
                         <div className="mb-20">
                             <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4 drop-shadow-lg">{video.title || "Featured Partner"}</h2>
                             <p className="text-gray-200 font-bold text-sm mb-6 drop-shadow-md">Check out this exclusive offer from our partners.</p>
                             <button 
                                onClick={() => window.open(video.link, '_blank')}
                                className="w-full bg-white text-black font-black py-4 rounded-full uppercase tracking-widest text-xs hover:bg-brand-500 hover:text-white transition-all shadow-xl"
                             >
                                 Learn More
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
         );
    }

    return (
        <div className="snap-item relative h-full w-full bg-black flex items-center justify-center shrink-0">
            <video 
                ref={videoRef}
                src={video.url}
                className="h-full w-full object-cover md:object-contain bg-black"
                loop
                muted={isMuted}
                playsInline
                onClick={togglePlay}
                poster={video.thumbnail}
            />

            <div className="absolute inset-0 pointer-events-none">
                <Watermark />
                
                {video.isPromoted && (
                    <div className="absolute top-4 right-4 pointer-events-auto z-20 bg-yellow-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                        <Flame size={12} fill="currentColor" /> Featured
                    </div>
                )}

                <div className="absolute top-4 left-4 pointer-events-auto z-20">
                    <button onClick={toggleMute} className="p-3 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors shadow-sm">
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                </div>

                <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20 pointer-events-auto">
                    <div className="flex flex-col items-center gap-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                            className="w-12 h-12 bg-dark-800/60 hover:bg-dark-700 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 group backdrop-blur-sm shadow-none"
                        >
                            <Flame size={28} className={`${isLiked ? 'text-brand-500' : 'text-white'} transition-colors`} fill={isLiked ? "currentColor" : "none"} />
                        </button>
                        <span className="text-xs font-black text-white tabular-nums drop-shadow-md">{video.likes}</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
                        <button onClick={onComment} className="w-12 h-12 bg-dark-800/60 hover:bg-dark-700 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 backdrop-blur-sm shadow-none">
                            <MessageCircle size={28} />
                        </button>
                        <span className="text-xs font-black text-white tabular-nums drop-shadow-md">{video.comments}</span>
                    </div>

                    <button onClick={onTip} className="w-10 h-10 flex items-center justify-center text-white hover:text-brand-400 transition-transform hover:scale-110 active:scale-95 drop-shadow-md">
                        <Gift size={24} />
                    </button>

                    <button className="w-12 h-12 bg-dark-800/60 hover:bg-dark-700 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 backdrop-blur-sm shadow-none">
                        <Share2 size={28} />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-auto pb-20 md:pb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-sm border-2 border-white/30 overflow-hidden cursor-pointer shadow-none">
                            <img src={video.userAvatar} className="w-full h-full object-cover" alt={video.user} />
                        </div>
                        <div className="flex items-center gap-3">
                            <h3 className="font-black text-white text-base uppercase italic tracking-tighter hover:underline cursor-pointer shadow-none">@{video.user}</h3>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsFollowing(!isFollowing); }}
                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm transition-all shadow-none flex items-center gap-1.5 ${isFollowing ? 'bg-transparent border border-white/20 text-white' : 'bg-red-600 text-white'}`}
                            >
                                {isFollowing ? <Check size={10} strokeWidth={4}/> : <UserPlus size={10} strokeWidth={4}/>}
                                {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
                            </button>
                        </div>
                    </div>
                    <p className="text-white text-sm mb-3 line-clamp-2 drop-shadow-md max-w-[85%] font-medium">
                        {video.desc}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-brand-400 font-black uppercase tracking-[0.2em]">
                        <Music size={14} className="animate-spin-slow" />
                        <span className="truncate max-w-[200px]">Original Audio</span>
                    </div>
                </div>

                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="bg-black/30 p-6 rounded-full backdrop-blur-md border border-white/10 shadow-none">
                            <Play size={48} fill="white" className="text-white ml-2 shadow-none" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default function Videos() {
  const [viewMode, setViewMode] = useState<'shorts' | 'videos'>('videos');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isHubsExpanded, setIsHubsExpanded] = useState(false);
  const navigate = useNavigate();
  const [trends, setTrends] = useState<any[]>([]);
  
  // Categories for header
  const categories = ['All', 'Gaming', 'Comedy', 'Vlog', 'Tech', 'Music', 'Cinema', 'React', 'Sports', 'Education', 'Documentary', 'Lifestyle', 'Tutorials'];

  // Video Visual Hubs - Expanded for new grid
  const VIDEO_HUBS = [
    { title: "Trending", image: "https://picsum.photos/400/250?random=v1", filter: "Trending" },
    { title: "Gaming", image: "https://picsum.photos/400/250?random=v2", filter: "Gaming" },
    { title: "Tech", image: "https://picsum.photos/400/250?random=v3", filter: "Tech" },
    { title: "Vlog", image: "https://picsum.photos/400/250?random=v4", filter: "Vlog" },
    { title: "Music", image: "https://picsum.photos/400/250?random=v5", filter: "Music" },
    { title: "Cinema", image: "https://picsum.photos/400/250?random=v6", filter: "Cinema" },
    { title: "Sports", image: "https://picsum.photos/400/250?random=v7", filter: "Sports" },
    { title: "Edu", image: "https://picsum.photos/400/250?random=v8", filter: "Education" },
    { title: "Comedy", image: "https://picsum.photos/400/250?random=v9", filter: "Comedy" },
    { title: "News", image: "https://picsum.photos/400/250?random=v10", filter: "News" },
    { title: "Travel", image: "https://picsum.photos/400/250?random=v11", filter: "Travel" },
    { title: "Food", image: "https://picsum.photos/400/250?random=v12", filter: "Food" },
    { title: "ASMR", image: "https://picsum.photos/400/250?random=v13", filter: "ASMR" },
    { title: "DIY", image: "https://picsum.photos/400/250?random=v14", filter: "DIY" },
    { title: "Review", image: "https://picsum.photos/400/250?random=v15", filter: "Review" },
  ];
  
  const displayedHubs = isHubsExpanded ? VIDEO_HUBS.slice(0, 15) : VIDEO_HUBS.slice(0, 5);

  // Mock Related Videos for Sidebar
  const relatedVideos = useMemo(() => {
      // Mock data related to the current activeCategory or user's feed context
      return Array.from({ length: 10 }).map((_, i) => ({
          id: `rel_vid_${i}`,
          thumbnail: `https://picsum.photos/200/300?random=rv_${i}`,
          desc: `${activeCategory === 'All' ? 'Random' : activeCategory} Clip #${i+1}`,
          user: `Creator_${i}`,
          userAvatar: `https://picsum.photos/50/50?random=ra_${i}`,
          views: `${Math.floor(Math.random() * 50) + 1}K`,
          // Add URL for playback if needed
          url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`
      }));
  }, [activeCategory]);

  // Fetch Trends for Sidebar
  useEffect(() => {
     const getTrends = async () => {
         try {
             const data = await api.get<any[]>('/trends/hashtags');
             setTrends(data);
         } catch (e) { console.error(e); }
     };
     getTrends();
  }, []);

  // Data Fetching
  const fetchContent = useCallback(async (cursor?: string) => {
      await new Promise(r => setTimeout(r, 600));
      
      const count = viewMode === 'videos' ? 60 : 15; 
      
      // Generate standard items
      const generatedItems: ShortVideo[] = Array.from({ length: count }).map((_, idx) => ({
          id: `vid_${idx}_${Date.now()}`,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          user: ['Sarah_Noir', 'GamerKing', 'TechWiz', 'ArtVibes', 'FoodieX'][idx % 5],
          userId: `${idx % 5}`,
          userAvatar: `https://picsum.photos/100/100?random=${idx % 5}`,
          desc: viewMode === 'videos' ? `Episode ${idx + 1}: ${['Ultimate Guide', 'Behind Scenes', 'Live Reaction', 'Tutorial', 'Vlog'].sort(() => 0.5 - Math.random())[0]} - ${['Amazing', 'Shocking', 'Cool', 'Secret', 'Exclusive'].sort(() => 0.5 - Math.random())[0]}` : `Short Clip #${idx}`,
          likes: Math.floor(Math.random() * 10000),
          comments: Math.floor(Math.random() * 500),
          thumbnail: `https://picsum.photos/1280/720?random=vid_thumb_${idx}`,
          duration: viewMode === 'videos' ? `${Math.floor(Math.random() * 15) + 2}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}` : undefined,
          views: `${(Math.random() * 900).toFixed(1)}K`,
          type: viewMode === 'videos' ? 'VIDEO' : 'SHORT'
      }));

      // INJECT CONTENT (Ads & Promos)
      const injectedItems = db.injectContent(generatedItems, viewMode === 'videos' ? 'videos' : 'shorts');
      
      return { items: injectedItems, nextCursor: 'end' };
  }, [viewMode]);

  const { data: content, loading, addNewItems, refresh } = useInfiniteScroll<ShortVideo>(fetchContent, containerRef);

  // Observer for Shorts scrolling
  useEffect(() => {
      if (viewMode !== 'shorts') return;
      
      const observer = new IntersectionObserver(
          (entries) => {
              entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                      const index = Number(entry.target.getAttribute('data-index'));
                      setActiveIndex(index);
                  }
              });
          },
          { threshold: 0.6, root: containerRef.current }
      );
      // Wait for DOM update
      setTimeout(() => {
          const items = document.querySelectorAll('.snap-item');
          items.forEach((item) => observer.observe(item));
      }, 100);
      
      return () => observer.disconnect();
  }, [content, viewMode]);

  // Reset scroll when switching views
  useEffect(() => {
      if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [viewMode]);

  // Handle Sidebar Video Click
  const handleSidebarVideoClick = (video: any) => {
      if (viewMode === 'shorts') {
          // Check if video is already in content
          const existingIndex = content.findIndex(c => c.id === video.id);
          
          if (existingIndex !== -1) {
              // Scroll to it
              const el = containerRef.current?.children[existingIndex] as HTMLElement;
              el?.scrollIntoView({ behavior: 'smooth' });
              setActiveIndex(existingIndex);
          } else {
              // Add to top and scroll
              const newVideo: ShortVideo = {
                  id: video.id,
                  url: video.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                  user: video.user,
                  userId: video.userId || 'unknown',
                  userAvatar: video.userAvatar,
                  desc: video.desc,
                  likes: 0,
                  comments: 0,
                  thumbnail: video.thumbnail,
                  views: video.views
              };
              addNewItems([newVideo]);
              // Wait for render then scroll
              setTimeout(() => {
                 if (containerRef.current) {
                     containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                     setActiveIndex(0);
                 }
              }, 100);
          }
      } else {
          // In video grid mode, navigate to detail
          navigate(`/video/${video.id}`);
      }
  };

  return (
    <div className="flex flex-col w-full h-full bg-dark-900 relative">
        <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={content[activeIndex]?.user || 'Creator'} />
        
        {commentsModalOpen && (
            <div className="absolute inset-0 z-50 flex animate-in slide-in-from-left duration-300">
                <div className="w-full md:w-[400px] h-full bg-dark-950 border-r border-white/5 shadow-none flex flex-col">
                    <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-dark-950">
                        <button onClick={() => setCommentsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-white">
                            <ArrowLeft size={20} />
                        </button>
                        <h3 className="font-black text-white text-lg uppercase italic tracking-tighter">Comments</h3>
                    </div>
                    <div className="flex-1 relative bg-dark-950">
                        <CommentsModal isOpen={true} onClose={() => {}} postId={content[activeIndex]?.id || 0} variant="embedded" />
                    </div>
                </div>
                <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setCommentsModalOpen(false)}></div>
            </div>
        )}

        {/* --- TOP HEADER (Sticky) --- */}
        <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-white/5 px-4 md:px-10 py-3 flex items-center justify-between gap-4 shrink-0">
            {/* Tag Filter */}
            <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 mask-linear-fade">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border transition-all whitespace-nowrap ${
                            activeCategory === cat 
                            ? 'bg-brand-500 text-white border-brand-500 shadow-lg' 
                            : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white hover:border-white/20'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* View Toggle */}
            <div className="flex bg-dark-800 p-1 rounded-xl border border-white/5 shrink-0 ml-4">
                <button 
                    onClick={() => setViewMode('videos')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'videos' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                    <LayoutGrid size={14} /> Videos
                </button>
                <button 
                    onClick={() => setViewMode('shorts')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'shorts' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                    <Smartphone size={14} /> Shorts
                </button>
            </div>
        </div>

        {/* --- MAIN CONTENT LAYOUT --- */}
        <div className="flex-1 flex overflow-hidden relative">
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                 {viewMode === 'shorts' ? (
                    // --- SHORTS VIEW (Snap Feed) ---
                    <div ref={containerRef} className="snap-container flex-1 bg-black no-scrollbar flex flex-col h-full overflow-y-scroll snap-y snap-mandatory relative">
                        {content.map((video, index) => (
                            <div key={`${video.id}-${index}`} data-index={index} className="h-full w-full snap-start shrink-0">
                                <SingleShort 
                                    video={video} 
                                    isActive={index === activeIndex} 
                                    isMuted={isMuted} 
                                    toggleMute={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                                    onTip={() => setTipModalOpen(true)}
                                    onComment={() => setCommentsModalOpen(true)}
                                />
                            </div>
                        ))}
                        {content.length === 0 && !loading && (
                            <div className="h-full w-full flex items-center justify-center bg-black text-gray-500 text-xs font-black uppercase tracking-widest">
                                No shorts found.
                            </div>
                        )}
                        {loading && <div className="h-full w-full flex items-center justify-center bg-black"><Loader2 size={32} className="animate-spin text-brand-500" /></div>}
                    </div>
                ) : (
                    // --- VIDEOS VIEW (Grid Layout) ---
                    <div className="flex-1 overflow-y-auto no-scrollbar bg-dark-900 p-4 md:p-8">
                        
                        {/* Video Category Hubs Grid (Updated to 5 Cols & Expandable) */}
                        <div className="mb-12">
                            <div className="grid grid-cols-5 gap-4 mb-6">
                               {displayedHubs.map((hub) => (
                                   <VideoHubCard key={hub.title} title={hub.title} image={hub.image} onClick={() => setActiveCategory(hub.filter)} />
                               ))}
                            </div>
                            <div className="flex justify-center">
                                <button 
                                    onClick={() => setIsHubsExpanded(!isHubsExpanded)}
                                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-dark-800 hover:bg-dark-700 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105"
                                >
                                    {isHubsExpanded ? (
                                        <>Show Less <ChevronUp size={12} /></>
                                    ) : (
                                        <>View More Categories <ChevronDown size={12} /></>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="max-w-[1600px] mx-auto">
                            <div className="flex justify-end mb-4">
                                <button className="flex items-center gap-2 bg-dark-900 hover:bg-dark-800 px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors border border-white/5">
                                    <Filter size={14} /> Filter
                                </button>
                            </div>

                            {/* Grid Content with centralized injection (already in 'content' from fetchContent) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
                                {content.map((video, i) => (
                                    <VideoGridItem 
                                        key={`${video.id}-grid-${i}`}
                                        video={video} 
                                        onClick={() => video.type !== 'AD' && navigate(`/video/${video.id}`)} 
                                    />
                                ))}
                            </div>
                            
                            {content.length === 0 && !loading && (
                                <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                                    No videos found.
                                </div>
                            )}
                            
                            {loading && (
                                <div className="py-20 flex justify-center">
                                    <Loader2 size={32} className="animate-spin text-brand-500" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Sidebar for Shorts/Videos Page with custom 'shorts_related' category */}
            <div className="hidden xl:block w-[320px] shrink-0 border-l border-white/5 h-full">
                <RightSidebar 
                    trends={trends} 
                    onPromoteClick={() => {}} 
                    showAd={true} 
                    category="shorts_related" 
                    relatedVideos={relatedVideos}
                    onVideoClick={handleSidebarVideoClick}
                />
            </div>

        </div>
    );
}
