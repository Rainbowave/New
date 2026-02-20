
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Gift, Share2, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoCardProps {
    id: number | string;
    videoUrl?: string;
    thumbnailUrl?: string;
    title?: string;
    user: {
        username: string;
        avatar: string;
        isVerified?: boolean;
    };
    likes: number;
    comments: number;
    views?: number;
    timestamp?: string;
    onTip?: () => void;
    onCommentClick?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ 
    id, videoUrl, thumbnailUrl, title, user, likes, comments, views, timestamp, onTip, onCommentClick 
}) => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [localLikes, setLocalLikes] = useState(likes);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play().catch(() => {});
                setIsPlaying(true);
            }
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
        setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    const avatarUrl = user?.avatar || 'https://picsum.photos/50/50?random=user';
    const username = user?.username || 'User';

    return (
        <div className="bg-dark-800 border border-white/5 rounded-xl overflow-hidden mb-8 shadow-lg group">
            {/* Header */}
            <div className="px-4 py-3 flex justify-between items-center bg-dark-900/50">
                <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(`/profile/${username}`)}
                >
                    <img src={avatarUrl} className="w-10 h-10 rounded-full object-cover border border-white/10" alt={username} />
                    <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-1">
                            {username}
                            {user?.isVerified && <ShieldCheck size={12} className="text-blue-500" />}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{timestamp || 'Just now'}</p>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-white"><MoreHorizontal size={20} /></button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black cursor-pointer group/video" onClick={() => navigate(`/video/${id}`)}>
                <video 
                    ref={videoRef}
                    src={videoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                    poster={thumbnailUrl}
                    className="w-full h-full object-contain"
                    loop
                    muted={isMuted}
                    playsInline
                />
                
                {/* Custom Controls */}
                <div className="absolute bottom-4 right-4 flex gap-2 z-20 opacity-0 group-hover/video:opacity-100 transition-opacity">
                    <button onClick={togglePlay} className="p-2 bg-black/60 rounded-full text-white hover:bg-brand-600 transition-colors">
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button onClick={toggleMute} className="p-2 bg-black/60 rounded-full text-white hover:bg-brand-600 transition-colors">
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                </div>

                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                            <Play size={28} fill="white" className="ml-1 text-white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content Info */}
            <div className="p-4">
                <h3 className="font-bold text-white text-base mb-2 line-clamp-2 cursor-pointer hover:text-brand-500 transition-colors" onClick={() => navigate(`/video/${id}`)}>
                    {title}
                </h3>
                
                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                    <div className="flex items-center gap-6">
                        <button onClick={handleLike} className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
                            <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> {localLikes}
                        </button>
                        <button onClick={onCommentClick} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                            <MessageCircle size={18} /> {comments}
                        </button>
                        <button onClick={onTip} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-yellow-500 transition-colors">
                            <Gift size={18} /> Tip
                        </button>
                    </div>
                    <button className="text-gray-400 hover:text-white"><Share2 size={18} /></button>
                </div>
            </div>
        </div>
    );
};
