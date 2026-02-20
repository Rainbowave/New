
import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { Heart, MessageCircle, Play, Volume2, VolumeX, Bookmark, Share2, Gift, TrendingUp, Music, Loader2, Megaphone, UserPlus, Check, ArrowLeft, Flame, Video, Smartphone, LayoutGrid, Clock, MoreVertical, Filter, Users, ExternalLink, ChevronRight, X } from 'lucide-react';
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { db } from '../services/db';
import { Watermark } from '../components/Shared';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { RightSidebar } from '../components/RightSidebar';
import { AdCard } from '../components/ads/AdCard';
import { InterestHub, Interest } from '../components/InterestHub';
import { api } from '../services/api';

interface ShortVideo {
    id: number | string;
    url?: string;
    user?: string;
    userId?: string;
    userAvatar?: string;
    desc?: string;
    likes?: number;
    comments?: number;
    thumbnail?: string;
    isAd?: boolean;
    duration?: string;
    views?: string;
    type?: string;
    title?: string;
    link?: string;
    isPromoted?: boolean;
    isAdult?: boolean; 
    category?: string;
}

const VIDEO_FILTERS = ['All', 'Gaming', 'Vlog', 'Tech', 'Music', 'Cinema', 'React', 'Sports', 'Education', 'Comedy'];

const VideoGridItem: React.FC<{ video: ShortVideo, onClick: () => void }> = ({ video, onClick }) => {
    if (video.type === 'AD') {
         return (
            <div onClick={() => window.open(video.link, '_blank')} className="group cursor-pointer flex flex-col gap-3 h-full">
                <div className="relative aspect-video rounded-[5px] overflow-hidden bg-dark-800 border-2 border-brand-500/30 group-hover:border-brand-500 transition-all shadow-lg">
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
                </div>
            </div>
        );
    }

    return (
        <div onClick={onClick} className="group cursor-pointer flex flex-col gap-3">
            <div className={`relative aspect-video rounded-[5px] overflow-hidden bg-dark-800 border group-hover:border-brand-500/50 transition-all shadow-lg ${video.isPromoted ? 'border-brand-500/40 bg-brand-900/5' : 'border-white/5'}`}>
                <img src={video.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" alt={video.desc} />
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-black text-white border border-white/10 uppercase tracking-widest">
                    {video.duration || '10:24'}
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
};

const SingleShort = memo(({ video, isActive, isMuted, toggleMute, onTip, onComment }: any) => {
    // Simplified Mock for brevity, assumes standard implementation
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => { if (isActive) videoRef.current?.play().catch(() => {}); else videoRef.current?.pause(); }, [isActive]);
    
    if (video.type === 'AD') return <div className="snap-item w-full h-full bg-dark-900 flex items-center justify-center text-white">Ad Placeholder</div>;

    return (
        <div className="snap-item relative h-full w-full bg-black flex items-center justify-center shrink-0">
             <video ref={videoRef} src={video.url} className="h-full w-full object-cover" loop muted={isMuted} playsInline poster={video.thumbnail} />
             <div className="absolute inset-0 pointer-events-none">
                 <Watermark />
                 <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20 pointer-events-auto">
                    <button onClick={toggleMute} className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white">{isMuted ? <VolumeX/> : <Volume2/>}</button>
                    <button onClick={onComment} className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white"><MessageCircle/></button>
                 </div>
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
  const [activeFilter, setActiveFilter] = useState('All');
  
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isAdultMode = currentUser?.contentPreference === 'adult';
  const [trends, setTrends] = useState<any[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);

  useEffect(() => {
      const load = async () => {
          const [trendsData, interestsData] = await Promise.all([
             api.get<any[]>('/trends/hashtags'),
             api.get<any[]>('/trends/tags?section=videos')
          ]);
          setTrends(trendsData);
          setInterests(interestsData.map((t: any) => ({
              id: t.id,
              title: t.tag,
              image: t.image
          })));
      };
      load();
  }, []);

  const fetchContent = useCallback(async (cursor?: string) => {
      await new Promise(r => setTimeout(r, 600));
      const count = viewMode === 'videos' ? 60 : 15; 
      
      const generatedItems: ShortVideo[] = Array.from({ length: count }).map((_, idx) => ({
          id: `vid_${idx}_${Date.now()}`,
          url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          user: ['Sarah_Noir', 'GamerKing', 'TechWiz'][idx % 3],
          userId: `${idx % 5}`,
          userAvatar: `https://picsum.photos/100/100?random=${idx % 5}`,
          desc: viewMode === 'videos' ? `Video Title ${idx+1}` : `Short Clip #${idx}`,
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 50),
          thumbnail: `https://picsum.photos/1280/720?random=vid_thumb_${idx}`,
          duration: "10:00",
          views: "15K",
          type: viewMode === 'videos' ? 'VIDEO' : 'SHORT',
          isAdult: isAdultMode,
          category: ['Gaming', 'Vlog', 'Tech', 'Music'][idx % 4]
      }));

      const injectedItems = db.injectContent(generatedItems, viewMode === 'videos' ? 'videos' : 'shorts');
      
      return { items: injectedItems, nextCursor: 'end' };
  }, [viewMode, isAdultMode]);

  const { data: content, loading, refresh } = useInfiniteScroll<ShortVideo>(fetchContent, containerRef);

  useEffect(() => { refresh(); }, [isAdultMode]);

  // Client-side Filtering
  const filteredContent = useMemo(() => {
      return content.filter(item => {
          const matchCategory = activeFilter === 'All' || item.category === activeFilter || item.type === 'AD';
          return matchCategory;
      });
  }, [content, activeFilter]);

  // Scroll Observer for Shorts
  useEffect(() => {
      if (viewMode !== 'shorts') return;
      const observer = new IntersectionObserver(
          (entries) => {
              entries.forEach((entry) => {
                  if (entry.isIntersecting) setActiveIndex(Number(entry.target.getAttribute('data-index')));
              });
          },
          { threshold: 0.6, root: containerRef.current }
      );
      setTimeout(() => {
          document.querySelectorAll('.snap-item').forEach((item) => observer.observe(item));
      }, 100);
      return () => observer.disconnect();
  }, [filteredContent, viewMode]);

  return (
    <div className="flex flex-col w-full h-full bg-dark-900 relative">
        <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={content[activeIndex]?.user || 'Creator'} />
        {commentsModalOpen && <CommentsModal isOpen={true} onClose={() => setCommentsModalOpen(false)} postId={content[activeIndex]?.id || 0} variant="embedded" />}

        {/* Top Header */}
        <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-white/5 py-3 px-4 md:px-10 flex items-center justify-between gap-4 shrink-0">
            <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 mask-linear-fade">
                {VIDEO_FILTERS.map(filter => (
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

            <div className="flex items-center gap-4 shrink-0">
                <div className="text-gray-500">
                    <ChevronRight size={18} />
                </div>
                <div className="flex bg-dark-800 p-1 rounded-[5px] border border-white/5">
                    <button onClick={() => setViewMode('videos')} className={`flex items-center gap-2 px-4 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'videos' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                        <LayoutGrid size={14} /> Videos
                    </button>
                    <button onClick={() => setViewMode('shorts')} className={`flex items-center gap-2 px-4 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'shorts' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                        <Smartphone size={14} /> Shorts
                    </button>
                </div>
            </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex overflow-hidden relative">
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                 {viewMode === 'shorts' ? (
                    <div ref={containerRef} className="snap-container flex-1 bg-black no-scrollbar flex flex-col h-full overflow-y-scroll snap-y snap-mandatory relative">
                        {filteredContent.map((video, index) => (
                            <div key={`${video.id}-${index}`} data-index={index} className="h-full w-full snap-start shrink-0">
                                <SingleShort 
                                    video={video} 
                                    isActive={index === activeIndex} 
                                    isMuted={isMuted} 
                                    toggleMute={(e: any) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                                    onTip={() => setTipModalOpen(true)}
                                    onComment={() => setCommentsModalOpen(true)}
                                />
                            </div>
                        ))}
                        {loading && <div className="h-full w-full flex items-center justify-center bg-black"><Loader2 size={32} className="animate-spin text-brand-500" /></div>}
                        {!loading && filteredContent.length === 0 && (
                             <div className="h-full w-full flex items-center justify-center bg-black text-gray-500 text-xs font-black uppercase tracking-widest">
                                No shorts found.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto no-scrollbar bg-dark-900 p-4 md:p-8">
                        <div className="max-w-[1600px] mx-auto">
                            {/* Interest Hub */}
                            <InterestHub 
                                items={interests} 
                                onSelect={setActiveFilter} 
                                activeItem={activeFilter} 
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
                                {filteredContent.map((video, i) => (
                                    <VideoGridItem 
                                        key={`${video.id}-grid-${i}`}
                                        video={video} 
                                        onClick={() => video.type !== 'AD' && navigate(`/video/${video.id}`)} 
                                    />
                                ))}
                            </div>
                            {loading && <div className="py-20 flex justify-center"><Loader2 size={32} className="animate-spin text-brand-500" /></div>}
                            {!loading && filteredContent.length === 0 && <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">No videos found.</div>}
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <div className="hidden xl:block w-[320px] shrink-0 border-l border-white/5 h-full">
                 <RightSidebar 
                    trends={trends} 
                    onPromoteClick={() => {}} 
                    showAd={true} 
                    category="videos" 
                />
            </div>
        </div>
    </div>
  );
}
