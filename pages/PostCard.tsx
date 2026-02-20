import React, { useState, useRef, useCallback, memo } from 'react';
import { Play, Heart, MessageCircle, Gift, Bookmark, User, ShieldCheck, Plus, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Watermark } from './Shared';
import { api } from '../services/api';
import { LazyImage } from './LazyImage';

interface PostCardProps {
    id: number;
    type: string;
    onTip: (id: number) => void;
    onCommentClick: (id: number) => void;
    onReport?: (id: number) => void;
    onBlock?: () => void;
    onNotInterested?: () => void;
    isDetailView?: boolean;
}

const PostCardComponent: React.FC<PostCardProps> = ({ 
    id, 
    type, 
    onTip, 
    onCommentClick, 
    onReport,
    onBlock,
    onNotInterested,
    isDetailView = false 
}) => {
    const navigate = useNavigate();
    const [heat, setHeat] = useState((id * 123) % 999);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const mediaRef = useRef<HTMLVideoElement>(null);

    const isVisionarySample = id === 10001;
    const username = isVisionarySample ? "CREATOR_10001" : `USER_${id}`;
    const avatarUrl = isVisionarySample ? "https://picsum.photos/100/100?id=10" : `https://picsum.photos/100/100?random=${id + 50}`;
    const caption = isVisionarySample 
        ? "Sharing new high-quality #content with the #community." 
        : "Initial protocol established. Heat levels rising. #post #verified";
    const postTags = isVisionarySample 
        ? ['#CREATIVE', '#COMMUNITY', '#QUALITY']
        : ['#POST', '#PLATFORM', '#MEMBER'];

    const handlePostClick = useCallback((e: React.MouseEvent) => {
        if (!isDetailView) {
            const target = e.target as HTMLElement;
            if (!target.closest('button') && !target.closest('.user-link') && !target.closest('.hashtag')) {
                navigate(`/post/${id}`);
            }
        }
    }, [navigate, id, isDetailView]);

    const handleLike = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        const wasLiked = isLiked;
        setIsLiked(!wasLiked);
        setHeat(h => !wasLiked ? h + 1 : h - 1);
        try { await api.post(`/posts/${id}/like`, { liked: !wasLiked }); } catch (error) {}
    }, [id, isLiked]);

    const togglePlay = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (mediaRef.current) {
            if (mediaRef.current.paused) {
                mediaRef.current.play().catch(e => console.warn(e));
                setIsPlaying(true);
            } else {
                mediaRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, []);

    const handleViewProfile = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/profile/${username.toLowerCase()}`);
    };

    const handleSubscribe = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSubscribed(!isSubscribed);
    };

    const renderCaption = useCallback((text: string) => {
        return text.split(/(#\w+)/g).map((part, i) => {
            if (part.startsWith('#')) {
                return (
                    <span 
                        key={i} 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/search?q=${part.slice(1)}`);
                        }}
                        className="hashtag text-brand-500 hover:underline cursor-pointer font-bold transition-colors"
                    >
                        {part}
                    </span>
                );
            }
            return part;
        });
    }, [navigate]);

    return (
        <div 
            onClick={handlePostClick}
            className="group bg-black border border-white/[0.05] hover:border-brand-500/20 mb-8 w-full relative transition-all duration-300 overflow-hidden rounded-sm"
        >
            <div className="media-container relative bg-[#050505] w-full aspect-square md:aspect-[4/3] flex items-center justify-center overflow-hidden cursor-pointer">
                <div className="absolute top-0 left-0 right-0 z-20 px-5 py-4 flex items-center justify-between bg-black/50 backdrop-blur-md transition-opacity group-hover:bg-black/60">
                    <div className="flex items-center gap-3 cursor-pointer user-link" onClick={handleViewProfile}>
                        <div className="w-10 h-10 rounded-sm border border-brand-500/30 overflow-hidden shadow-lg">
                            <img src={avatarUrl} className="w-full h-full object-cover" alt="User" />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-black text-white uppercase italic tracking-tighter flex items-center gap-1.5 leading-none mb-1">
                                {username}
                                <ShieldCheck size={14} className="text-blue-400" fill="currentColor" />
                            </h4>
                            <p className="text-[8px] text-white/70 font-black uppercase tracking-[0.2em]">Verified Member</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSubscribe}
                        className={`px-4 py-1.5 rounded-sm font-black text-[9px] uppercase tracking-[0.15em] transition-all border ${
                            isSubscribed 
                            ? 'bg-transparent border-white/20 text-white/60' 
                            : 'bg-white text-black hover:bg-brand-500 hover:text-white border-white'
                        }`}
                    >
                        {isSubscribed ? 'Following' : 'Follow'}
                    </button>
                </div>

                {type === 'video' ? (
                    <div className="relative w-full h-full">
                        <video ref={mediaRef} src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" className="w-full h-full object-cover" loop muted={isMuted} onClick={togglePlay} playsInline />
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10" onClick={togglePlay}>
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
                                    <Play fill="white" size={24} className="ml-1" />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <LazyImage 
                        src={isVisionarySample ? "https://picsum.photos/id/10/800/800" : `https://picsum.photos/800/1000?random=${id}`} 
                        className="w-full h-full object-cover block" 
                        alt="Content" 
                    />
                )}
                
                <div className="absolute bottom-4 right-4 z-10 pointer-events-none select-none opacity-80">
                    <span className="text-xl font-black text-white tracking-widest uppercase italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-display">
                        LUCISIN
                    </span>
                </div>
            </div>

            <div className="px-5 py-4 bg-black">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={handleLike} className={`transition-all hover:scale-110 p-1 flex items-center gap-3 ${isLiked ? 'text-red-500' : 'text-gray-100'}`}>
                            <Flame size={26} strokeWidth={1.5} fill={isLiked ? "currentColor" : "none"} />
                            <span className="text-sm font-black italic tabular-nums tracking-tighter">{heat.toLocaleString()}</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onCommentClick(id); }} className="text-gray-100 hover:text-white transition-all hover:scale-110 p-1">
                            <MessageCircle size={26} strokeWidth={1.5} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onTip(id); }} className="text-gray-100 hover:text-brand-400 transition-all hover:scale-110 p-1">
                            <Gift size={26} strokeWidth={1.5} />
                        </button>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }} className={`transition-all hover:scale-110 p-1 ${isSaved ? 'text-brand-500' : 'text-gray-100'}`}>
                        <Bookmark size={26} strokeWidth={1.5} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                </div>

                <div className="text-[14px] text-gray-100 leading-relaxed">
                    <div className="mb-2">
                        <span onClick={handleViewProfile} className="font-extrabold italic mr-2 uppercase tracking-tighter cursor-pointer hover:text-brand-400 transition-colors">{username}</span>
                        <span className="font-medium text-gray-200">{renderCaption(caption)}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {postTags.map((tag, index) => (
                            <span 
                                key={index} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/search?q=${tag.replace('#', '')}`);
                                }}
                                className="text-brand-500 font-extrabold text-[11px] uppercase tracking-wider hover:underline cursor-pointer transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PostCard = memo(PostCardComponent);