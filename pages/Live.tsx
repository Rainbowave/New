
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Radio, Users, Video, Tag, ArrowRight, Sparkles, Loader2, Search, CheckCircle, X, SkipForward, ExternalLink, Trophy, Gift, Lock, Heart, Flame, Pause, DollarSign, Timer, Play, MoreHorizontal, ChevronRight } from 'lucide-react';
import { TipModal } from '../components/TipModal';
import { LiveChat } from '../components/LiveChat';
import Hls from 'hls.js';
import { api } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Watermark } from '../components/Shared';
import { RightSidebar } from '../components/RightSidebar';
import { db } from '../services/db';
import { AdCard } from '../components/ads/AdCard';
import { CommentsModal } from '../components/comments/CommentsModal'; 

interface Stream {
    id: number;
    title: string;
    streamer: string;
    viewers: number;
    thumbnail: string;
    avatar: string;
    category: string;
    tags: string[];
    isLive: boolean;
    hlsUrl: string;
    isPaid?: boolean;
    isAdult?: boolean;
    price?: string;
}

const LIVE_FILTERS = ['All', 'Just Chatting', 'Gaming', 'Music', 'Esports', 'IRL', 'Creative', 'Education', 'Sports', 'Charity', 'Special Events'];

const LiveStreamCard: React.FC<{ stream: Stream, onClick: () => void }> = ({ stream, onClick }) => (
    <div onClick={onClick} className="group cursor-pointer flex flex-col gap-3">
        <div className="relative aspect-video rounded-[5px] overflow-hidden bg-dark-800 border border-white/5 group-hover:border-brand-500/50 transition-all shadow-lg">
            <img src={stream.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" alt={stream.title} />
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-black text-white border border-white/10 uppercase tracking-widest flex items-center gap-1">
                <Users size={10} /> {stream.viewers.toLocaleString()}
            </div>
            {stream.isPaid && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-20 group-hover:bg-black/40 transition-colors">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mb-2 border border-yellow-500/30">
                        <Lock size={18} className="text-yellow-500" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-yellow-600 px-3 py-1 rounded shadow-lg">Tip to Watch</span>
                </div>
            )}
            {!stream.isPaid && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="w-12 h-12 bg-brand-600/90 rounded-full flex items-center justify-center text-white shadow-xl backdrop-blur-sm">
                        <Video size={20} fill="currentColor" className="ml-1" />
                    </div>
                </div>
            )}
        </div>
        <div className="px-1 flex gap-3">
             <div className="shrink-0 relative">
                 <img src={stream.avatar} className="w-9 h-9 rounded-full object-cover border border-white/10" alt={stream.streamer} />
                 {stream.isLive && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-dark-900 rounded-full"></div>}
             </div>
             <div className="flex-1 min-w-0">
                 <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-brand-500 transition-colors">{stream.title}</h3>
                 <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider hover:text-white transition-colors">{stream.streamer}</span>
                     <span className="text-[10px] text-gray-600">•</span>
                     <span className="text-[10px] text-gray-500">{stream.category}</span>
                 </div>
             </div>
        </div>
    </div>
);

const PreRollAd = ({ onComplete }: { onComplete: () => void }) => {
    const [timeLeft, setTimeLeft] = useState(15);
    const [canSkip, setCanSkip] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        const skipTimer = setTimeout(() => setCanSkip(true), 5000);
        return () => {
            clearInterval(timer);
            clearTimeout(skipTimer);
        };
    }, [onComplete]);

    return (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
            <div className="absolute top-4 right-4 flex items-center gap-4">
                <div className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded border border-white/10">Ad : {timeLeft}s</div>
                {canSkip && (
                    <button onClick={onComplete} className="flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-sm text-xs font-bold hover:bg-gray-200 transition-colors">Skip <SkipForward size={12} /></button>
                )}
            </div>
            <div className="w-full h-full relative group">
                <img src="https://picsum.photos/1200/800?random=ad_preroll" className="w-full h-full object-cover opacity-60" alt="Advertisement" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/20">
                    <span className="bg-brand-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest mb-4">Sponsored</span>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg">Unlock Premium Experience</h2>
                    <button className="bg-brand-500 hover:bg-brand-600 text-white font-black py-3 px-8 rounded-sm uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl transition-all">Learn More <ExternalLink size={14} /></button>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-brand-500 transition-all duration-1000 ease-linear" style={{ width: `${((15 - timeLeft) / 15) * 100}%` }}></div>
            </div>
        </div>
    );
};

export default function Live() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false); 
  const [streams, setStreams] = useState<Stream[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Ad State
  const [showPreRoll, setShowPreRoll] = useState(false);
  const [adConfig, setAdConfig] = useState<any>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState(true); 
  const [isLocked, setIsLocked] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(30);

  useEffect(() => {
      const loadInitial = async () => {
          setLoading(true);
          try {
              const [streamData, trendsData] = await Promise.all([
                  api.get<Stream[]>('/live'),
                  api.get<any[]>('/trends/hashtags')
              ]);
              
              const enhancedStreams = streamData.map((s, i) => ({
                  ...s,
                  isPaid: i % 5 === 0,
                  price: (i % 5 === 0) ? '50.00' : undefined,
                  isAdult: s.isAdult
              }));

              setStreams(enhancedStreams);
              setTrends(trendsData);
              
              const settings = db.getSiteSettings();
              const videoAds = settings.contentAds?.dating?.videoMedia as any;
              const liveAdEnabled = videoAds?.enabled && (videoAds?.targets?.includes('live') || videoAds?.targets?.includes('Live'));
              const liveAdConfig = { enabled: !!liveAdEnabled };
              setAdConfig(liveAdConfig);

              if (enhancedStreams.length > 0 && !activeStream) {
                  const first = enhancedStreams[0];
                  setActiveStream(first);
                  if (first.isPaid) setIsLocked(true);
                  else if (liveAdConfig.enabled) setShowPreRoll(true);
              }
          } catch (e) { console.error(e); } finally { setLoading(false); }
      };
      loadInitial();
  }, []);

  const handleStreamClick = (stream: Stream) => {
      setActiveStream(stream);
      setPreviewTimeLeft(30);
      setIsPreviewing(false);

      if (stream.isPaid) {
          setIsLocked(true);
          setShowPreRoll(false); 
          if(videoRef.current) videoRef.current.pause();
      } else {
          setIsLocked(false);
          if (adConfig?.enabled && Math.random() > 0.7) {
              setShowPreRoll(true);
          } else {
              setShowPreRoll(false);
              if(videoRef.current) videoRef.current.play().catch(() => {});
          }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtering based on Category and Search
  const filteredStreams = useMemo(() => {
      return streams.filter(s => {
          const matchCategory = activeFilter === 'All' || s.category === activeFilter;
          const matchSearch = !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.streamer.toLowerCase().includes(searchQuery.toLowerCase());
          return matchCategory && matchSearch;
      });
  }, [streams, activeFilter, searchQuery]);

  // Player Logic
  useEffect(() => {
    if (!activeStream || showPreRoll || (isLocked && !isPreviewing)) return; 
    
    const hlsUrl = activeStream.hlsUrl;
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    
    if (Hls.isSupported() && videoRef.current) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hlsRef.current = hls; hls.loadSource(hlsUrl); hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => { 
            if(isPlaying) videoRef.current?.play().catch(e => console.log(e)); 
        });
    }
  }, [activeStream, showPreRoll, isLocked, isPreviewing]);

  useEffect(() => {
      let interval: any;
      if (isPreviewing && previewTimeLeft > 0) {
          interval = setInterval(() => {
              setPreviewTimeLeft(prev => {
                  if (prev <= 1) {
                      setIsPreviewing(false);
                      setIsLocked(true);
                      if (videoRef.current) videoRef.current.pause();
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [isPreviewing, previewTimeLeft]);

  const handleUnlock = () => {
      if (window.confirm(`Unlock full stream for ${activeStream?.price} LSC?`)) {
          setIsLocked(false);
          setIsPreviewing(false);
          if (videoRef.current) videoRef.current.play();
      }
  };

  const handleStartPreview = () => {
      setIsLocked(false); 
      setIsPreviewing(true);
      setPreviewTimeLeft(30);
      if (videoRef.current) videoRef.current.play();
  };

  const togglePlayback = () => {
      if (videoRef.current) {
          if (isPlaying) videoRef.current.pause();
          else videoRef.current.play();
          setIsPlaying(!isPlaying);
      }
  };

  return (
    <div className="max-w-full mx-auto min-h-screen bg-dark-850">
       <TipModal isOpen={isTipModalOpen} onClose={() => setIsTipModalOpen(false)} creatorName={activeStream?.streamer || 'Streamer'} />
       <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={0} />

       <div className="flex flex-col lg:flex-row min-h-screen">
           <div className="flex-1 min-w-0 flex flex-col relative">
                
                {/* Filter Header with Permanent Search */}
                <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-white/5 py-3 px-4 md:px-10 flex items-center gap-4 justify-between">
                    <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 mask-linear-fade">
                        {LIVE_FILTERS.map(filter => (
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
                    {/* Persistent Search Bar */}
                    <div className="shrink-0 relative">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find stream..." 
                            className="w-48 bg-dark-800 border border-white/10 rounded-full py-1.5 pl-4 pr-4 text-xs text-white focus:border-brand-500 outline-none transition-all placeholder:text-gray-500 font-medium"
                        />
                    </div>
                </div>

                <div className="px-4 md:px-10 py-8">
                    {/* Active Stream Player */}
                    <div className="flex justify-between items-center mb-6 px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-sm bg-brand-500 p-[2px] shadow-xl"><img src={activeStream?.avatar} className="w-full h-full rounded-sm border-2 border-dark-900 object-cover" alt="" /></div>
                            <div>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{activeStream?.title || "Loading Stream..."}</h1>
                                <p className="text-[10px] text-brand-500 font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                                    {activeStream?.streamer} • {(activeStream?.viewers || 0).toLocaleString()} Watching
                                </p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/live/setup')} className="bg-brand-600 hover:bg-brand-500 px-6 py-2.5 rounded-sm text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-brand-900/20 transition-all"><Radio size={16} /> Stream Dashboard</button>
                    </div>

                    <div className="flex flex-col xl:flex-row h-auto xl:h-[640px] gap-6 mb-16">
                        <div className="flex-1 bg-black rounded-sm overflow-hidden relative group shadow-2xl border border-white/5 flex items-center justify-center min-h-[400px]">
                            {/* Overlays */}
                            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 pointer-events-none">
                                <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
                                <span className="text-white font-black uppercase text-[10px] tracking-widest bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">LIVE SIGNAL</span>
                            </div>
                            
                            {/* Controls Overlay */}
                            <div className="absolute top-4 right-4 z-30 flex gap-2">
                                <button onClick={() => setIsTipModalOpen(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg transition-transform hover:scale-105 pointer-events-auto">
                                    <Gift size={12} /> Gift
                                </button>
                                <button className="bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 pointer-events-auto transition-colors">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>

                            {showPreRoll ? (
                                <PreRollAd onComplete={() => setShowPreRoll(false)} />
                            ) : (isLocked && !isPreviewing) ? (
                                <div className="absolute inset-0 bg-dark-900/90 backdrop-blur-xl z-20 flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border-2 border-white/10"><Lock size={40} className="text-yellow-500" /></div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Premium Stream</h2>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Unlock full access to continue watching.</p>
                                    <div className="flex gap-4">
                                        <button onClick={handleStartPreview} className="bg-white/10 hover:bg-white/20 text-white font-black py-3 px-6 rounded-sm text-xs uppercase tracking-widest border border-white/10 transition-all">Preview (30s)</button>
                                        <button onClick={handleUnlock} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 px-8 rounded-sm text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2"><DollarSign size={14} /> Unlock {activeStream?.price} LSC</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Watermark />
                                    <video ref={videoRef} className="w-full h-full object-contain cursor-pointer" controls={false} playsInline muted poster={activeStream?.thumbnail} onClick={togglePlayback} />
                                    {!isPlaying && !isLocked && !showPreRoll && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 z-10">
                                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl"><Play size={40} fill="white" className="ml-2" /></div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
                                        <button onClick={togglePlayback} className="p-2 bg-black/60 rounded-full text-white hover:bg-brand-600 transition-colors">{isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="w-full xl:w-[400px] bg-dark-800 rounded-sm overflow-hidden flex flex-col border border-white/5 shadow-xl shrink-0 h-[500px] xl:h-auto"><LiveChat isLive={!showPreRoll && !isLocked} streamId={activeStream?.id} /></div>
                    </div>

                    {/* Live Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12 px-2">
                        {filteredStreams.map((stream) => (
                             <LiveStreamCard 
                                key={stream.id} 
                                stream={stream} 
                                onClick={() => handleStreamClick(stream)} 
                             />
                        ))}
                        {filteredStreams.length === 0 && !loading && (
                            <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-dark-700 rounded-xl">
                                {searchQuery ? `No live streams found matching "${searchQuery}"` : `No live streams found in "${activeFilter}".`}
                            </div>
                        )}
                    </div>
                    {loading && <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-500" /></div>}
               </div>
           </div>

           {/* Right Sidebar - Using Category Specific Data */}
           <div className="hidden lg:block w-[300px] shrink-0 transition-all duration-300">
               <div className="sticky top-0 h-screen overflow-hidden border-l border-white/5 bg-[#141414]">
                   <RightSidebar trends={trends} onPromoteClick={() => {}} showAd={false} showFooter={false} category="live" />
               </div>
           </div>
       </div>
    </div>
  );
}