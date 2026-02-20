
import React, { useState, useRef, useCallback, memo, useMemo } from 'react';
import { Play, MessageCircle, Gift, Bookmark, Flame, MoreHorizontal, Ticket, BarChart3, BarChart2, ShieldCheck, Video, Image as ImageIcon, Smartphone, FileText, Lock, Globe, Star, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { db } from '../services/db';
import { LazyImage } from './LazyImage';
import { authService } from '../services/authService';
import { EditPostModal } from './EditPostModal';
import { Watermark } from './Shared';

interface PollOption {
    id: string;
    label: string;
    votes: number;
    image?: string;
    isHeader?: boolean;
}

interface ImageMarker {
    id: string | number;
    x: number;
    y: number;
    label: string;
    votes: number;
}

interface PostCardProps {
    id: number | string;
    type: string;
    category?: string;
    date?: string;
    content?: string;
    imageUrl?: string;
    pollData?: { 
        question: string; 
        options: PollOption[]; 
        type?: 'standard' | 'ticket_pool';
        mode?: 'text' | 'media' | 'interactive';
        ticketPrice?: string;
        image?: string; 
        markers?: ImageMarker[]; 
        endsAt?: string;
        subtitle?: string; 
    };
    isPaid?: boolean;
    price?: string;
    points?: number;
    ownerId?: string;
    privacy?: string;
    author?: { username: string; avatar: string; displayName?: string; isVerified?: boolean; isLuciStar?: boolean; isPremium?: boolean; sexuality?: string };
    tags?: string[];
    isPromoted?: boolean;
    heat?: number;
    onTip: (id: number | string) => void;
    onCommentClick: (id: number | string) => void;
    onReport?: (id: number | string) => void;
    onBlock?: () => void;
    onNotInterested?: () => void;
    onDelete?: (id: number | string) => void;
    isDetailView?: boolean;
    compact?: boolean;
    masonry?: boolean;
    hideMoodBadge?: boolean; 
    isAdult?: boolean;
    hideTags?: boolean;
    imageHeight?: string;
    tipIcon?: string;
    hideUser?: boolean;
}

const getNumericId = (id: string | number): number => {
    if (typeof id === 'number') return id;
    const nums = id.replace(/\D/g, '');
    return nums ? parseInt(nums) : id.length;
};

const PostCardComponent: React.FC<PostCardProps> = ({ 
    id, 
    type, 
    category,
    date,
    content,
    imageUrl,
    pollData,
    isPaid = false,
    price,
    ownerId,
    privacy,
    author,
    tags = [],
    isPromoted = false,
    heat: initialHeat,
    onTip, 
    onCommentClick, 
    onDelete,
    isDetailView = false,
    compact = false,
    masonry = false,
    hideTags = false,
    imageHeight,
    hideUser = false,
}) => {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const isOwner = currentUser && ownerId && currentUser.id === ownerId;
    const isModerator = currentUser?.role === 'moderator' || currentUser?.role === 'admin';

    const numericId = getNumericId(id);
    const [heat, setHeat] = useState(initialHeat || (numericId * 123) % 999);
    const [commentCount] = useState((numericId * 7) % 50);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [unlocked, setUnlocked] = useState(!isPaid);
    const [isFollowing, setIsFollowing] = useState(false);
    
    // Poll State
    const [hasVoted, setHasVoted] = useState<string | number | null>(null);
    const [localPollOptions, setLocalPollOptions] = useState<PollOption[]>(pollData?.options || []);
    const [localMarkers, setLocalMarkers] = useState<ImageMarker[]>(pollData?.markers || []);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const mediaRef = useRef<HTMLVideoElement>(null);

    // Identity Logic
    const isAnonymous = privacy === 'anonymous';
    const fallbackUsername = `LUCI_STAR_${numericId % 100 === 0 ? 'ELITE' : ownerId || id}`;
    const fallbackAvatar = `https://picsum.photos/50/50?random=${id}`;

    const displayUsername = isAnonymous ? 'ANONYMOUS' : (author?.displayName || author?.username || fallbackUsername).toUpperCase();
    const displayHandle = isAnonymous ? '@hidden' : (author?.username ? `@${author.username}` : `@${fallbackUsername}`);
    // Safe access to author.avatar with optional chaining
    const displayAvatar = isAnonymous ? null : (author?.avatar || fallbackAvatar);
    const isVerified = author?.isVerified !== false; 

    const displayImage = imageUrl || pollData?.image || (id === 10001 ? "https://picsum.photos/id/10/800/800" : `https://picsum.photos/800/1000?random=${id}`);
    
    const postType = (type || 'photo').toUpperCase();
    const isVideo = postType === 'VIDEO';
    const isText = postType === 'TEXT' || postType === 'POST';
    const isPoll = !!pollData || postType === 'POLL';
    const isTicketPool = pollData?.type === 'ticket_pool';
    const isInteractivePoll = !!pollData?.markers;
    const isMediaPoll = pollData?.mode === 'media';
    const hasVideoPlayer = postType === 'SHORT' || isVideo;
    const displayPrice = price || "5.00";

    const totalVotes = useMemo(() => {
        if (isInteractivePoll) return localMarkers.reduce((acc, m) => acc + m.votes, 0);
        return localPollOptions.reduce((acc, opt) => acc + (opt.isHeader ? 0 : opt.votes), 0);
    }, [localPollOptions, localMarkers, isInteractivePoll]);

    const displayCategory = category || postType;

    // Filter tags to exclude category if duplicate, prioritize category as first tag
    const displayTags = useMemo(() => {
        const uniqueTags = tags.filter(t => t.replace('#','').toUpperCase() !== displayCategory.toUpperCase());
        return uniqueTags.length > 0 ? uniqueTags : [];
    }, [tags, displayCategory]);

    const handlePostClick = useCallback((e: React.MouseEvent) => {
        if (isPaid && !unlocked) return; 
        if (!isDetailView) {
            const target = e.target as HTMLElement;
            // Prevent navigation if clicking interactive elements
            if (!target.closest('button') && !target.closest('.interactive') && !target.closest('.poll-element')) {
                if (postType === 'COLLECTION' || postType === 'PRODUCT') navigate(`/collection/view/${id}`);
                else if (postType === 'COMIC') navigate(`/comic/${id}`);
                else if (isVideo) navigate(`/video/${id}`);
                else if (postType === 'SHORT') navigate(`/videos`); 
                else if (postType === 'RESOURCE') navigate(`/resource/${id}`);
                else if (isPoll) navigate(`/poll/${id}`);
                else navigate(`/post/${id}`);
            }
        }
    }, [navigate, id, isDetailView, postType, isVideo, isPoll, isPaid, unlocked]);

    const handleLike = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        const wasLiked = isLiked;
        setIsLiked(!wasLiked);
        setHeat(h => !wasLiked ? h + 1 : h - 1);
        try { await api.post(`/posts/${id}/like`, { liked: !wasLiked }); } catch (error) {}
    }, [id, isLiked]);

    const handleVote = (optionId: string | number) => {
        if (hasVoted) return;
        
        // Block voting on headers
        const option = localPollOptions.find(o => o.id === optionId);
        if (option?.isHeader) return;

        setHasVoted(optionId);
        if (isInteractivePoll) {
            setLocalMarkers(prev => prev.map(m => m.id === optionId ? { ...m, votes: m.votes + 1 } : m));
        } else {
            setLocalPollOptions(prev => prev.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt));
        }
    };

    const togglePlay = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (mediaRef.current) {
            if (mediaRef.current.paused) {
                mediaRef.current.play().catch(e => { if (e.name !== 'AbortError') console.warn(e); });
                setIsPlaying(true);
            } else {
                mediaRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, []);

    const handleViewProfile = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAnonymous) return;
        if (ownerId) navigate(`/profile/${ownerId}`);
        else navigate(`/profile/${displayHandle.replace('@', '').toLowerCase()}`);
    };

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFollowing(!isFollowing);
    };

    // Name Coloring Logic for Feed
    const getNameClass = () => {
        if (author?.isLuciStar) {
            // Check sexuality if available on author object
            const sexuality = author.sexuality || 'Other';
            if (sexuality.includes('Gay')) return "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-green-500 to-blue-500";
            if (sexuality.includes('Lesbian')) return "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-pink-500";
            if (sexuality.includes('Bi')) return "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500";
            if (sexuality.includes('Pan')) return "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400";
            if (sexuality.includes('Trans')) return "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-white";
            return "text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500"; // Default Gold
        }
        if (author?.isPremium) {
            return "text-gray-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]"; // Silver
        }
        return "text-white";
    };

    const renderPollContent = () => {
        if (!pollData) return null;
        const isTicket = pollData.type === 'ticket_pool';
        const isInteractive = !!pollData.markers;
        const isMedia = pollData.mode === 'media';
        const barColor = isTicket ? 'bg-yellow-900/40' : 'bg-brand-900/40'; 
        const activeBorder = isTicket ? 'border-yellow-500/50' : 'border-brand-500/50';

        return (
             <div className="w-full h-full bg-[#0a0a0a] p-6 flex flex-col justify-center relative overflow-hidden min-h-[300px] poll-element">
                 <div className="flex items-center gap-2 mb-4">
                     {isTicket && <span className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.2em] flex items-center gap-1"><Ticket size={12} strokeWidth={3} /> Ticket Pool</span>}
                     {isInteractive && <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-1"><BarChart2 size={12} strokeWidth={3} /> Map Vote</span>}
                     {isMedia && <span className="text-[9px] font-black text-purple-500 uppercase tracking-[0.2em] flex items-center gap-1"><ImageIcon size={12} strokeWidth={3} /> Media Vote</span>}
                     {!isTicket && !isInteractive && !isMedia && <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-1"><BarChart3 size={12} strokeWidth={3} /> Poll</span>}
                 </div>
                 
                 <h2 className={`text-2xl font-black ${isTicket ? 'text-yellow-500' : 'text-white'} italic uppercase tracking-tighter leading-[0.9] mb-2 drop-shadow-md line-clamp-3`}>{pollData.question}</h2>
                 
                 {(pollData.subtitle || content) && (
                     <div className="mb-4">
                        {pollData.subtitle && <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">{pollData.subtitle}</p>}
                        {content && !compact && <p className="text-sm text-gray-300 font-medium leading-relaxed max-w-lg">{content}</p>}
                     </div>
                 )}

                 {isInteractive && pollData.image ? (
                     <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 mb-4 bg-dark-900 group shadow-inner">
                         <LazyImage src={pollData.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                         {localMarkers.map(m => (
                             <div key={m.id} onClick={(e) => { e.stopPropagation(); handleVote(m.id); }} className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 hover:scale-110 transition-transform" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
                                 <div className="w-6 h-6 rounded-full bg-brand-600/90 backdrop-blur-sm border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-xl animate-in zoom-in">{m.votes > 0 ? m.votes : m.label}</div>
                             </div>
                         ))}
                     </div>
                 ) : isMedia ? (
                     <div className="grid grid-cols-2 gap-2 mb-4">
                         {localPollOptions.map(opt => {
                             const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                             const isSelected = hasVoted === opt.id;
                             return (
                                 <div key={opt.id} onClick={(e) => { e.stopPropagation(); handleVote(opt.id); }} className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer group transition-all ${isSelected ? activeBorder : 'border-white/10 hover:border-brand-500/50'}`}>
                                     {opt.image ? (
                                         <img src={opt.image} className="w-full h-full object-cover" alt={opt.label} />
                                     ) : (
                                         <div className="w-full h-full bg-dark-800 flex items-center justify-center text-gray-600"><ImageIcon size={24}/></div>
                                     )}
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                                          <span className="text-[10px] font-black text-white uppercase truncate">{opt.label}</span>
                                          {hasVoted && <span className="text-[9px] font-bold text-brand-500">{percent}%</span>}
                                     </div>
                                     {isSelected && <div className="absolute inset-0 bg-brand-500/20 pointer-events-none"></div>}
                                 </div>
                             )
                         })}
                     </div>
                 ) : (
                     <div className="space-y-2 w-full">
                         {localPollOptions.map(opt => {
                             if (opt.isHeader) return <div key={opt.id} className="pt-2 pb-1 text-[9px] font-black text-brand-500 uppercase tracking-widest border-b-2 border-brand-500/50 pb-0.5">{opt.label}</div>;

                             const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                             const isSelected = hasVoted === opt.id;
                             return (
                                 <div key={opt.id} onClick={(e) => { e.stopPropagation(); handleVote(opt.id); }} className={`relative h-10 w-full rounded-md border overflow-hidden cursor-pointer group transition-all ${isSelected ? activeBorder : 'border-white/10 hover:border-white/20'}`}>
                                     <div className={`absolute top-0 left-0 h-full ${barColor} transition-all duration-1000 ease-out`} style={{ width: `${hasVoted ? percent : 0}%` }}></div>
                                     <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                                         <span className="text-[10px] font-black text-white uppercase italic tracking-wide group-hover:text-white/90 transition-colors">{opt.label}</span>
                                         {hasVoted && <span className="text-[9px] font-black text-white">{percent}%</span>}
                                     </div>
                                 </div>
                             );
                         })}
                     </div>
                 )}
                 <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-2">
                     <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{totalVotes} Votes</div>
                     <div className="text-right"><div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Ends in {pollData.endsAt || '24H'}</div></div>
                 </div>
             </div>
        );
    };

    // --- COMPACT / GRID VIEW ---
    if (compact) {
        return (
            <div onClick={handlePostClick} className="group z-10 bg-dark-800 border border-white/5 w-full relative transition-all duration-300 overflow-hidden rounded-lg cursor-pointer break-inside-avoid shadow-sm hover:shadow-lg hover:border-brand-500/30 mb-3 flex flex-col h-full">
                {/* Smaller aspect ratio for mobile compact view */}
                <div className={`relative ${imageHeight ? imageHeight : (masonry ? 'w-full h-auto' : 'aspect-[4/3]')} bg-dark-900 overflow-hidden flex-1`}>
                    
                    {/* Only show User overlay if not hidden */}
                    {!pollData && !hideUser && (
                        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/90 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between pointer-events-none">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-[5px] overflow-hidden border shadow-lg ${author?.isLuciStar ? 'border-yellow-500' : author?.isPremium ? 'border-gray-300' : 'border-white/20'}`}>
                                    <img src={displayAvatar || ''} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                    <h3 className={`text-[10px] font-black uppercase italic tracking-tighter leading-none flex items-center gap-1 ${getNameClass()}`}>
                                        {displayUsername}
                                        {isVerified && <ShieldCheck size={8} className="text-red-500" fill="currentColor"/>}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Media */}
                    {pollData ? renderPollContent() : isText ? (
                         <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-dark-800 to-black min-h-[150px]">
                             <FileText size={24} className="text-gray-600 mb-2" />
                             <p className="text-white text-[10px] font-bold line-clamp-3 leading-relaxed tracking-wide">{content}</p>
                        </div>
                    ) : (
                        <LazyImage src={displayImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Content" />
                    )}
                    
                    {/* Title Overlay for Compact View */}
                    {!pollData && !isText && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-30">
                             <h4 className="text-white font-bold text-xs line-clamp-2 leading-tight drop-shadow-md">{content || displayCategory}</h4>
                             {(price && parseFloat(price) > 0) && (
                                <div className="text-yellow-500 font-black text-[10px] mt-1 tabular-nums flex items-center gap-1">{price} LSC</div>
                            )}
                             {!hideTags && displayTags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {displayTags.slice(0, 2).map((tag, index) => (
                                        <span key={index} className="text-[7px] font-bold text-gray-300 uppercase tracking-widest">
                                            #{tag.replace('#','')}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Footer removed for Compact View as requested, except for Polls which handle their own layout */}
            </div>
        );
    }
    
    // Standard View (Non-Compact) Logic follows...
    return (
        <div onClick={handlePostClick} className="group z-10 bg-[#0f0f11] border border-white/[0.05] hover:border-brand-500/20 mb-8 w-full relative transition-all duration-300 overflow-hidden rounded-md shadow-2xl">
            <EditPostModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} post={{ id, type, title: 'Edit', content, price, tags: [], thumbnailUrl: displayImage }} onSave={() => window.location.reload()} />
            
            {/* Media Section */}
            <div className={`media-container relative bg-black w-full flex items-center justify-center overflow-hidden cursor-pointer ${isText && !pollData ? 'min-h-[300px]' : 'h-[350px] md:h-auto md:aspect-[4/3]'}`}>
                {/* ... Hover Overlay Code ... */}
                <div className="absolute top-0 left-0 right-0 z-30 px-5 py-4 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="flex items-center gap-3 cursor-pointer pointer-events-auto" onClick={handleViewProfile}>
                        <div className={`w-10 h-10 rounded-[5px] overflow-hidden border shadow-lg relative ${author?.isLuciStar ? 'border-yellow-500' : author?.isPremium ? 'border-gray-300' : 'border-white/20'}`}>
                            <img src={displayAvatar || ''} className="w-full h-full object-cover" alt={displayUsername} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className={`text-sm font-black uppercase italic tracking-tighter leading-none drop-shadow-md ${getNameClass()}`}>
                                    {displayUsername}
                                </h3>
                                {isVerified && <div className="text-red-500 drop-shadow-md"><ShieldCheck size={12} fill="currentColor" className="text-red-500"/></div>}
                                {author?.isLuciStar && <Crown size={10} className="text-yellow-500 fill-yellow-500" />}
                                {author?.isPremium && !author?.isLuciStar && <Star size={10} className="text-gray-300 fill-gray-300" />}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest drop-shadow-md">
                                    {isPromoted ? 'SPONSORED' : `VERIFIED STAR • ${date ? date.toUpperCase() : 'JUST NOW'}`}
                                </p>
                                {!isAnonymous && privacy && privacy !== 'public' && (
                                     <span className="text-[8px] font-black uppercase tracking-widest bg-white/10 px-1.5 py-0.5 rounded text-white flex items-center gap-1 border border-white/10">
                                         <Lock size={8} /> {privacy === 'subscribers' ? 'Subs Only' : 'Private'}
                                     </span>
                                )}
                                {privacy === 'public' && <Globe size={10} className="text-gray-400" />}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 pointer-events-auto">
                        {!isOwner && (
                            <button 
                                onClick={handleFollow}
                                className={`px-4 py-1.5 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg ${isFollowing ? 'opacity-50' : ''}`}
                            >
                                {isFollowing ? 'Following' : 'Pride Up'}
                            </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className="text-white hover:text-gray-300 drop-shadow-md">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                {pollData ? (
                    <div className={`w-full h-full flex flex-col justify-center relative`}>{renderPollContent()}</div>
                ) : isText ? (
                     <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-dark-900 to-black">
                         <p className="text-white text-lg font-bold leading-relaxed max-w-lg">{content}</p>
                     </div>
                ) : hasVideoPlayer ? (
                    <video ref={mediaRef} src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" className="w-full h-full object-cover" loop muted={isMuted} playsInline onClick={togglePlay} />
                ) : (
                    <LazyImage src={displayImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]" alt="Content" />
                )}
                
                <Watermark className="bottom-4 right-4 z-20 pointer-events-none opacity-50" />
            </div>
            
            {/* Footer Actions & Caption */}
            <div className="bg-[#0f0f11] p-5 relative z-40 border-t border-white/[0.03]">
                <div className="flex justify-between items-center mb-4">
                     <div className="flex gap-6">
                         <button onClick={handleLike} className={`flex items-center gap-2 transition-all group/like interactive ${isLiked ? 'text-brand-500' : 'text-white hover:text-brand-500'}`}>
                             <Flame size={24} strokeWidth={1.5} fill={isLiked ? "currentColor" : "none"} className="group-active/like:scale-125 transition-transform" />
                             <span className="text-sm font-black tabular-nums">{heat.toLocaleString()}</span>
                         </button>
                         <button onClick={(e) => { e.stopPropagation(); onCommentClick(id); }} className="flex items-center gap-2 text-white hover:text-brand-500 transition-colors interactive">
                             <MessageCircle size={24} strokeWidth={1.5} />
                             <span className="text-sm font-black tabular-nums">{commentCount}</span>
                         </button>
                         <button onClick={(e) => { e.stopPropagation(); onTip(id); }} className="flex items-center gap-2 text-white hover:text-yellow-500 transition-colors interactive">
                             <Gift size={24} strokeWidth={1.5} />
                             <span className="text-sm font-black tabular-nums">12</span>
                         </button>
                     </div>
                     <button onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }} className={`transition-colors interactive ${isSaved ? 'text-brand-500' : 'text-white hover:text-brand-500'}`}>
                         <Bookmark size={24} strokeWidth={1.5} fill={isSaved ? "currentColor" : "none"} />
                     </button>
                </div>

                <div className="space-y-3">
                    <div className="text-sm text-gray-300 leading-relaxed cursor-pointer" onClick={handlePostClick}>
                        <span className={`font-black mr-2 uppercase italic tracking-tighter cursor-pointer hover:underline interactive ${getNameClass()}`} onClick={handleViewProfile}>
                            {displayUsername}
                        </span>
                        {content && !pollData && <span dangerouslySetInnerHTML={{ __html: content.replace(/#(\w+)/g, '<span class="text-brand-500 font-bold hover:underline cursor-pointer">#$1</span>') }} />}
                    </div>
                    
                    {!hideTags && displayTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 interactive pt-1">
                            {displayTags.map((tag, index) => {
                                const isSpecial = ['#COLLECTION', '#EXCLUSIVE', '#POLL'].includes('#'+tag.toUpperCase().replace('#',''));
                                return (
                                    <span 
                                        key={`${tag}-${index}`} 
                                        onClick={(e) => { e.stopPropagation(); navigate(`/tags/${tag.replace('#', '')}`); }}
                                        className={`text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest cursor-pointer transition-colors ${
                                            isSpecial 
                                            ? 'bg-brand-500/20 text-brand-500 border border-brand-500/50 hover:bg-brand-500 hover:text-white' 
                                            : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#252525] border border-white/5'
                                        }`}
                                    >
                                        {tag.replace('#', '')}
                                    </span>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const PostCard = memo(PostCardComponent);
