
import React from 'react';
import { BookOpen, Heart, MessageCircle, Star, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComicCardProps {
    id: number | string;
    title?: string;
    coverUrl?: string;
    user: {
        username: string;
        avatar: string;
        isVerified?: boolean;
    };
    likes: number;
    comments: number;
    episodes?: number;
    rating?: number;
    timestamp?: string;
    onTip?: () => void;
    onCommentClick?: () => void;
}

export const ComicCard: React.FC<ComicCardProps> = ({ 
    id, title, coverUrl, user, likes, comments, episodes = 1, rating = 5.0, timestamp, onTip, onCommentClick 
}) => {
    const navigate = useNavigate();
    const avatarUrl = user?.avatar || 'https://picsum.photos/50/50?random=user';
    const username = user?.username || 'User';

    return (
        <div className="bg-dark-800 border border-white/5 rounded-xl overflow-hidden mb-8 shadow-lg flex flex-col sm:flex-row h-auto sm:h-64 group cursor-pointer hover:border-brand-500/30 transition-all" onClick={() => navigate(`/comic/${id}`)}>
            {/* Cover Image (Portrait) */}
            <div className="w-full sm:w-48 shrink-0 relative overflow-hidden bg-dark-900">
                <img src={coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={title} />
                <div className="absolute top-2 left-2 bg-brand-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-widest">
                    Comic
                </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <img src={avatarUrl} className="w-6 h-6 rounded-full object-cover" alt={username} />
                        <span className="text-xs font-bold text-gray-300">@{username}</span>
                        {user?.isVerified && <ShieldCheck size={12} className="text-blue-500" />}
                        <span className="text-[10px] text-gray-600 ml-auto">{timestamp}</span>
                    </div>

                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2 line-clamp-2 leading-none group-hover:text-brand-500 transition-colors">
                        {title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4">
                        <span className="flex items-center gap-1 bg-dark-900 px-2 py-1 rounded border border-white/5">
                            <BookOpen size={12} className="text-brand-400" /> {episodes} Episodes
                        </span>
                        <span className="flex items-center gap-1 bg-dark-900 px-2 py-1 rounded border border-white/5">
                            <Star size={12} className="text-yellow-500 fill-yellow-500" /> {rating}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold group/act">
                            <Heart size={16} className="group-hover/act:text-red-500 transition-colors" /> {likes}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold group/act">
                            <MessageCircle size={16} className="group-hover/act:text-blue-500 transition-colors" /> {comments}
                        </div>
                    </div>
                    <button className="bg-white text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-colors">
                        Read Now
                    </button>
                </div>
            </div>
        </div>
    );
};
