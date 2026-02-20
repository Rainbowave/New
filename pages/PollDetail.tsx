
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, BarChart2, Ticket, Clock, CheckCircle, 
    Users, Share2, DollarSign, 
    ShieldCheck, Image as ImageIcon,
    MessageCircle, Heart, MoreHorizontal, Flame, Bookmark, Gift, Loader2, Info
} from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/authService';
import { DiscussionSection } from '../components/comments/DiscussionSection';
import { AdCard } from '../components/ads/AdCard';
import { TipModal } from '../components/TipModal';
import { LazyImage } from '../components/LazyImage'; 
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { db } from '../services/db';
import { ExploreMore } from '../components/ExploreMore';

interface PollOption {
    id: string;
    label: string;
    votes: number;
    image?: string;
}

interface Marker {
    id: string;
    x: number;
    y: number;
    label: string;
    votes: number;
}

export default function PollDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';

    const [loading, setLoading] = useState(true);
    const [poll, setPoll] = useState<any>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    
    // Interaction State
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [heat, setHeat] = useState(420);
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 600)); // Sim latency

            // Mock Data Generator
            let mockPoll: any = {};
            
            if (id === '1003') {
                mockPoll = {
                    id: '1003',
                    type: 'POLL',
                    pollType: 'ticket_pool',
                    question: "ENTER THE WEEKLY 5000 LSC POOL",
                    description: "WEEKEND JACKPOT",
                    options: [
                        { id: '1', label: '1X ENTRY TICKET', votes: 120 },
                        { id: '2', label: '5X BUNDLE ENTRY', votes: 45 },
                    ],
                    ticketPrice: "50",
                    totalVotes: 125,
                    endsAt: "24H",
                    user: { username: "LOTTERY_SYSTEM", displayName: "Lottery System", avatar: "https://picsum.photos/100/100?random=pool", isVerified: true },
                    jackpot: "5000 LSC",
                    timestamp: Date.now() - 7200000
                };
            } else if (id === '1005') {
                mockPoll = {
                    id: '1005',
                    type: 'POLL',
                    pollType: 'standard',
                    mode: 'interactive',
                    question: "WHERE DO WE DROP?",
                    description: "MAP STRATEGY",
                    image: "https://picsum.photos/1200/800?random=map",
                    markers: [
                        { id: 'm1', x: 20, y: 30, label: 'm1', votes: 120 },
                        { id: 'm2', x: 50, y: 50, label: 'm2', votes: 450 },
                        { id: 'm3', x: 80, y: 70, label: 'm3', votes: 80 }
                    ],
                    totalVotes: 650,
                    endsAt: "15M",
                    user: { username: "PRO_GAMER", displayName: "Tactician", avatar: "https://picsum.photos/100/100?random=inter", isVerified: true },
                    timestamp: Date.now() - 14400000
                };
            } else {
                mockPoll = {
                    id: '1002',
                    type: 'POLL',
                    pollType: 'standard',
                    mode: 'text',
                    question: "WHAT CONTENT FORMAT DO YOU PREFER?",
                    description: "CONTENT FEEDBACK",
                    options: [
                        { id: '1', label: 'CINEMATIC VIDEOS', votes: 150 },
                        { id: '2', label: 'SHORT CLIPS', votes: 320 },
                        { id: '3', label: 'LIVE STREAMS', votes: 80 }
                    ],
                    totalVotes: 550,
                    endsAt: "24H",
                    user: { username: "HUB_ADMIN", displayName: "Hub Admin", avatar: "https://picsum.photos/100/100?random=text", isVerified: true },
                    timestamp: Date.now() - 3600000
                };
            }
            
            setPoll(mockPoll);
            
            setComments([
                { id: 101, user: 'VoterOne', avatar: 'https://picsum.photos/50/50?random=c1', text: 'I voted for the first option!', time: '1h ago', likes: 12, score: 10 },
                { id: 102, user: 'Analyst', avatar: 'https://picsum.photos/50/50?random=c2', text: 'Interesting spread of results here.', time: '3h ago', score: 5, likes: 5 },
            ]);
            
            setLoading(false);
        };
        loadData();
    }, [id]);

    const fetchExplore = useCallback(async (cursor?: string) => {
        await new Promise(r => setTimeout(r, 600));
        
        // Fetch related polls with varied types for discovery
        const items = Array.from({ length: 12 }).map((_, i) => {
             // Cycle through different poll configurations
             const pollTypes = ['standard', 'ticket_pool'];
             const pollModes = ['text', 'media', 'interactive'];
             
             const currentType = pollTypes[i % pollTypes.length];
             const currentMode = pollModes[i % pollModes.length];
             
             return { 
                id: `explore_poll_${i}_${cursor}`,
                type: 'POLL', 
                timestamp: Date.now() - 3600000 * i, 
                category: 'Recommended', 
                userId: 'u_1005',
                content: `Discovery Poll #${(cursor ? parseInt(cursor) : 0) + i + 1}`,
                thumbnailUrl: `https://picsum.photos/600/800?random=${7000 + (cursor ? parseInt(cursor) : 0) + i}`,
                isAdult: isAdultMode,
                pollData: {
                     question: `Vote on Topic #${(cursor ? parseInt(cursor) : 0) + i + 1}`,
                     type: currentType, 
                     mode: currentMode,
                     subtitle: currentType === 'ticket_pool' ? 'Prize Pool Active' : 'Community Vote',
                     options: [
                         {id:'1', label:'Option A', votes: Math.floor(Math.random() * 500)}, 
                         {id:'2', label:'Option B', votes: Math.floor(Math.random() * 300)}
                     ],
                     ticketPrice: currentType === 'ticket_pool' ? "50" : undefined,
                     image: (currentMode === 'media' || currentMode === 'interactive') ? `https://picsum.photos/600/400?random=${8000 + i}` : undefined,
                     markers: currentMode === 'interactive' ? [
                        { id: 'm1', x: 20, y: 30, label: 'A', votes: 10 },
                        { id: 'm2', x: 70, y: 60, label: 'B', votes: 25 }
                     ] : undefined
                }
            };
        });

        const injectedItems = db.injectContent(items, 'relatedFeed');
        const nextCursor = (parseInt(cursor || '0') + 1).toString();
        
        return { items: injectedItems, nextCursor: nextCursor };
    }, [isAdultMode]);

    const { data: exploreItems, loading: exploreLoading } = useInfiniteScroll(fetchExplore);

    const handleVote = async (optionId: string) => {
        if (!optionId || isVoting) return;
        setIsVoting(true);
        setSelectedOption(optionId);
        await new Promise(r => setTimeout(r, 800));
        setPoll((prev: any) => {
            const isMarker = prev.mode === 'interactive';
            if (isMarker) {
                 return {
                    ...prev,
                    markers: prev.markers.map((m: any) => m.id === optionId ? { ...m, votes: m.votes + 1 } : m),
                    totalVotes: prev.totalVotes + 1
                }
            }
            return {
                ...prev,
                options: prev.options.map((opt: any) => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt),
                totalVotes: prev.totalVotes + 1
            };
        });
        setIsVoting(false);
    };
    
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    };

    if (loading || !poll) return <div className="min-h-screen bg-dark-850 flex items-center justify-center"><Loader2 className="animate-spin text-brand-500" size={40}/></div>;

    const isTicket = poll.pollType === 'ticket_pool';
    const isInteractive = poll.mode === 'interactive';
    const isMedia = poll.mode === 'media';
    const barColor = isTicket ? 'bg-yellow-900/40' : 'bg-brand-900/40'; 
    const activeBorder = isTicket ? 'border-yellow-500/50' : 'border-brand-500/50';

    return (
        <div className="min-h-screen bg-dark-850 text-[#f4f4f5] font-sans pb-32">
             <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={poll?.user?.displayName || 'Creator'} />
            
             <div className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-lg border-b border-white/5 h-16 flex items-center px-8 justify-between">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-4 text-white hover:text-brand-500 transition-all group"
                >
                    <ArrowLeft size={22} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-lg font-black tracking-tighter uppercase italic">Back</span>
                </button>
            </div>

            <div className="max-w-[1600px] mx-auto pt-8 px-4 md:px-10">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* LEFT: Main Content */}
                    <div className="flex-1 min-w-0 bg-dark-800 p-6 md:p-10 rounded-sm shadow-none border border-white/[0.03]">
                        
                        {/* Poll Visualization Area */}
                        <div className="flex justify-center mb-8">
                             <div className="w-full max-w-4xl bg-black rounded-sm overflow-hidden border border-white/[0.05] relative shadow-2xl p-8 md:p-12">
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    {isTicket && <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] flex items-center gap-1 bg-yellow-900/10 px-3 py-1 rounded-full border border-yellow-500/20"><Ticket size={12}/> Ticket Pool</span>}
                                    {isInteractive && <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-1 bg-red-900/10 px-3 py-1 rounded-full border border-red-500/20"><BarChart2 size={12}/> Interactive Map</span>}
                                    {isMedia && <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] flex items-center gap-1 bg-purple-900/10 px-3 py-1 rounded-full border border-purple-500/20"><ImageIcon size={12}/> Visual Vote</span>}
                                    {!isTicket && !isInteractive && !isMedia && <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10"><BarChart2 size={12}/> Community Poll</span>}
                                </div>

                                <h2 className={`text-3xl md:text-4xl font-black ${isTicket ? 'text-yellow-500' : 'text-white'} uppercase italic tracking-tighter leading-[0.9] mb-4 text-center`}>
                                    {poll.question}
                                </h2>
                                
                                {isInteractive ? (
                                     <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 mb-6 bg-dark-900 group shadow-inner mx-auto max-w-2xl">
                                         <LazyImage src={poll.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                         {poll.markers?.map((m: Marker) => (
                                             <div 
                                                key={m.id}
                                                onClick={() => handleVote(m.id)}
                                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 hover:scale-110 transition-transform"
                                                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                                             >
                                                 <div className="w-8 h-8 rounded-full bg-brand-600/90 backdrop-blur-sm border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-xl animate-in zoom-in">
                                                     {m.votes > 0 ? m.votes : m.label}
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                ) : (
                                    <div className="space-y-3 max-w-xl mx-auto">
                                        {poll.options.map((opt: PollOption) => {
                                            const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                                            const isSelected = selectedOption === opt.id;
                                            return (
                                                <div 
                                                    key={opt.id}
                                                    onClick={() => handleVote(opt.id)}
                                                    className={`relative w-full h-16 rounded-lg overflow-hidden border cursor-pointer group transition-all ${isSelected ? activeBorder : 'border-white/10 hover:border-white/30'} bg-dark-900`}
                                                >
                                                    <div 
                                                        className={`absolute inset-y-0 left-0 transition-all duration-1000 ${barColor}`} 
                                                        style={{ width: `${selectedOption || isVoting ? percent : 0}%` }}
                                                    ></div>
                                                    <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
                                                        <span className="font-black text-sm text-white uppercase tracking-wide italic">{opt.label}</span>
                                                        {(selectedOption || isVoting) && <span className="font-bold text-white text-xs">{percent}%</span>}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                                
                                <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-t border-white/5 pt-6 max-w-lg mx-auto">
                                    <span className="flex items-center gap-2"><Users size={12}/> {poll.totalVotes} Votes</span>
                                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                    <span className="flex items-center gap-2"><Clock size={12}/> Ends in {poll.endsAt}</span>
                                </div>
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
                        
                        <div className="mt-8 pt-4">
                             <DiscussionSection initialComments={comments} />
                        </div>
                    </div>

                    {/* RIGHT: Sidebar (Creator & Context) */}
                    <div className="w-full lg:w-[350px] space-y-6 shrink-0">
                         
                         {/* Creator Info Card */}
                         <div className="bg-dark-800 border border-white/[0.05] rounded-sm p-6 shadow-none">
                            <div className="flex items-center gap-5 mb-6 cursor-pointer" onClick={() => navigate(`/profile/${poll.user.username}`)}>
                                <div className="w-16 h-16 rounded-sm bg-gradient-to-br from-brand-main to-purple-600 p-[2px] shadow-none">
                                    <img src={poll.user.avatar} className="w-full h-full rounded-sm object-cover border-2 border-dark-800" alt="" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-white text-lg leading-none truncate mb-2 uppercase italic tracking-tighter">{poll.user.displayName}</h3>
                                    <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1">
                                        <ShieldCheck size={12} className="text-brand-500" /> Verified
                                    </p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setIsFollowing(!isFollowing)}
                                className={`w-full font-black py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] transition-all border shadow-lg ${isFollowing ? 'bg-dark-900 border-white/10 text-gray-400' : 'bg-white text-black hover:bg-brand-500 hover:text-white border-transparent'}`}
                            >
                                {isFollowing ? 'Following' : 'Join Pride'}
                            </button>

                             <div className="mt-8 pt-6 border-t border-white/5">
                                 <div className="flex items-center gap-2 mb-2 text-brand-500">
                                     <Info size={16} />
                                     <h4 className="text-[9px] font-black uppercase tracking-[0.4em]">Details</h4>
                                 </div>
                                 <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                     {poll.description}
                                 </p>
                             </div>
                         </div>
                         
                         {/* Sidebar Ad */}
                         <AdCard height="h-[300px]" className="w-full rounded-sm shadow-xl" title="Featured Partner" />
                    </div>
                </div>

                <ExploreMore items={exploreItems} loading={exploreLoading} onTip={() => {}} onItemClick={(id) => navigate(id.toString().includes('poll') ? `/poll/${id}` : `/post/${id}`)} />
            </div>
        </div>
    );
}
