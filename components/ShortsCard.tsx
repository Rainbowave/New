
import React, { useRef, useState } from 'react';
import { Play, Heart, MessageCircle, Send, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShortsCardProps {
    id: number | string;
    videoUrl?: string;
    thumbnailUrl?: string;
    title?: string;
    user: {
        username: string;
        avatar: string;
    };
    likes: number;
    comments: number;
}

export const ShortsCard: React.FC<ShortsCardProps> = ({ 
    id, videoUrl, thumbnailUrl, title, user, likes, comments 
}) => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleNavigate = () => {
        navigate('/shorts');
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const avatarUrl = user?.avatar || 'https://picsum.photos/50/50?random=user';
    const username = user?.username || 'User';

    return (
        <div 
            className="w-full max-w-sm mx-auto mb-10 relative aspect-[9/16] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer hover:border-brand-500/40 transition-all hover:scale-[1.01]"
            onClick={handleNavigate}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video 
                ref={videoRef}
                src={videoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                poster={thumbnailUrl}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                loop
                muted
                playsInline
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 pointer-events-none"></div>

            {/* Play Overlay Icon */}
            <div className={`absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                 <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                    <Play size={32} fill="currentColor" className="ml-1" />
                 </div>
            </div>

            {/* Top Badge */}
            <div className="absolute top-4 right-4 z-20">
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                    <Zap size={12} className="text-brand-500 fill-brand-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Short</span>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-brand-500 to-purple-600">
                        <img src={avatarUrl} className="w-full h-full rounded-full border-2 border-black object-cover" alt={username} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase italic tracking-wider leading-none mb-1">@{username}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Watch full video</p>
                    </div>
                </div>
                
                <p className="text-white text-sm font-medium line-clamp-2 mb-4 leading-relaxed drop-shadow-md">
                    {title}
                </p>
                
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                     <div className="flex gap-4">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
                             <Heart size={16} /> {likes}
                         </div>
                         <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
                             <MessageCircle size={16} /> {comments}
                         </div>
                     </div>
                     <div className="p-2 bg-white/10 rounded-full text-white hover:bg-brand-600 transition-colors">
                         <Send size={16} />
                     </div>
                </div>
            </div>
        </div>
    );
};
