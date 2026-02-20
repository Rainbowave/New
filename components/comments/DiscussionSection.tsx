
import React, { useState, useEffect } from 'react';
import { 
    MessageCircle, Send, ChevronUp, ChevronDown, Reply, Gift, MoreHorizontal 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdCard } from '../ads/AdCard';

interface Comment {
    id: number;
    user: string;
    avatar: string;
    text: string;
    time: string;
    score: number;
    hasVoted?: 'up' | 'down' | null;
}

interface DiscussionSectionProps {
    initialComments?: Comment[];
    title?: string;
}

export const DiscussionSection: React.FC<DiscussionSectionProps> = ({ 
    initialComments = [],
    title = "Discussion"
}) => {
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [commentInput, setCommentInput] = useState('');
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

    useEffect(() => {
        // Sort by score initially if provided
        if (initialComments.length > 0) {
            setComments([...initialComments].sort((a, b) => b.score - a.score));
        } else {
             // Mock default comments if none provided
             const defaultComments: Comment[] = [
                { id: 1, user: "TypeLover99", avatar: "https://picsum.photos/50/50?random=c1", text: "This is exactly what I was looking for!", time: "2h ago", score: 45, hasVoted: null },
                { id: 2, user: "DesignHero", avatar: "https://picsum.photos/50/50?random=c2", text: "Great insights here.", time: "5h ago", score: 12, hasVoted: null },
                { id: 3, user: "NewbieDev", avatar: "https://picsum.photos/50/50?random=c3", text: "Can you make a video on this?", time: "1d ago", score: 8, hasVoted: null },
                { id: 4, user: "AdTarget", avatar: "https://picsum.photos/50/50?random=c4", text: "Loving the new updates to the platform.", time: "30m ago", score: 5, hasVoted: null },
                { id: 5, user: "CreatorFan", avatar: "https://picsum.photos/50/50?random=c5", text: "Wait, the tip icon is customizable now? Awesome!", time: "10m ago", score: 20, hasVoted: 'up' },
            ];
             setComments(defaultComments.sort((a,b) => b.score - a.score));
        }
    }, [initialComments]);

    const handleVote = (id: number, type: 'up' | 'down') => {
        setComments(prev => prev.map(c => {
            if (c.id !== id) return c;
            
            let newScore = c.score;
            let newVote = c.hasVoted;

            if (c.hasVoted === type) {
                // Toggle off
                newScore = type === 'up' ? c.score - 1 : c.score + 1;
                newVote = null;
            } else if (c.hasVoted) {
                // Switch vote
                newScore = type === 'up' ? c.score + 2 : c.score - 2;
                newVote = type;
            } else {
                // New vote
                newScore = type === 'up' ? c.score + 1 : c.score - 1;
                newVote = type;
            }
            return { ...c, score: newScore, hasVoted: newVote };
        }).sort((a,b) => b.score - a.score)); // Auto-sort by score float to top
    };

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput.trim()) return;
        const newComment: Comment = {
            id: Date.now(),
            user: "You",
            avatar: "https://picsum.photos/50/50?random=me",
            text: commentInput,
            time: "Just now",
            score: 0,
            hasVoted: 'up' // Auto upvote own comment
        };
        setComments([newComment, ...comments]);
        setCommentInput('');
    };
    
    const handleReplySubmit = (e: React.FormEvent, commentId: number) => {
        e.preventDefault();
        alert(`Reply submitted for comment ${commentId}`);
        setActiveReplyId(null);
    };

    const CommentItem = ({ comment }: { comment: Comment }) => (
        <div className="flex-1 bg-dark-800/50 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span 
                        className="font-bold text-white text-sm cursor-pointer hover:text-brand-500 hover:underline"
                        onClick={() => navigate(`/profile/${comment.user}`)}
                    >
                        {comment.user}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{comment.time}</span>
                </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {comment.text}
            </p>
            
            {/* Action Bar */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex items-center gap-4">
                        <button 
                        onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                    >
                            <Reply size={14} /> Reply
                        </button>
                        <button className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-yellow-500 transition-colors">
                            <Gift size={14} /> Tip
                        </button>
                </div>
                
                <div className="flex items-center gap-2">
                        <div className="flex items-center bg-dark-900 rounded-lg p-1 border border-white/5">
                            <button 
                            onClick={() => handleVote(comment.id, 'up')}
                            className={`p-1 hover:bg-white/10 rounded ${comment.hasVoted === 'up' ? 'text-brand-500' : 'text-gray-400'}`}
                        >
                                <ChevronUp size={16} />
                            </button>
                            <span className={`text-xs font-black w-6 text-center tabular-nums ${comment.score > 0 ? 'text-brand-500' : comment.score < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                {comment.score}
                            </span>
                            <button 
                            onClick={() => handleVote(comment.id, 'down')}
                            className={`p-1 hover:bg-white/10 rounded ${comment.hasVoted === 'down' ? 'text-red-500' : 'text-gray-400'}`}
                        >
                                <ChevronDown size={16} />
                            </button>
                        </div>
                        <button className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            {/* Reply Input with 20px gap (ml-5) */}
            {activeReplyId === comment.id && (
                <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-4 ml-5 pl-4 border-l-2 border-white/10 animate-in fade-in slide-in-from-top-2">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Write a reply..."
                            className="w-full bg-dark-900 border border-white/5 rounded-lg py-2 pl-3 pr-10 text-xs text-white focus:border-brand-500 outline-none"
                            autoFocus
                        />
                        <button type="submit" className="absolute right-2 top-1.5 text-gray-400 hover:text-brand-500">
                            <Send size={12} />
                        </button>
                    </div>
                </form>
            )}
        </div>
    );

    // Split comments for ad placement logic
    // Logic: Render all comments except last 2. Then render last 2 in a group with Ad.
    const splitIndex = Math.max(0, comments.length - 2);
    const mainComments = comments.slice(0, splitIndex);
    const bottomComments = comments.slice(splitIndex);

    return (
        <div className="pt-8">
            <div className="flex items-center gap-3 mb-8">
                <MessageCircle size={24} className="text-brand-500" />
                <h3 className="font-black text-white uppercase tracking-widest text-lg">{title} ({comments.length})</h3>
            </div>
            
            {/* Comment Input */}
            <form onSubmit={handlePostComment} className="mb-10 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center font-black text-white text-xs shrink-0 border-2 border-dark-900 shadow-lg">YOU</div>
                <div className="flex-1 relative">
                    <textarea 
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Add to the discussion..." 
                        className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-brand-500 outline-none resize-none min-h-[100px] shadow-inner"
                    />
                    <button 
                        type="submit" 
                        disabled={!commentInput.trim()}
                        className="absolute bottom-3 right-3 bg-brand-600 hover:bg-brand-500 text-white p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
            
            <div className="space-y-6">
                {/* Main List */}
                {mainComments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group animate-in slide-in-from-bottom-2 duration-300">
                         <div 
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate(`/profile/${comment.user}`)}
                        >
                            <img src={comment.avatar} className="w-10 h-10 rounded-full border border-white/10 shrink-0" alt={comment.user} />
                        </div>
                        <CommentItem comment={comment} />
                    </div>
                ))}

                {/* Bottom Group with Ad - Side by Side */}
                {bottomComments.length > 0 && (
                     <div className="flex flex-col xl:flex-row gap-6">
                         <div className="flex-1 space-y-6">
                             {bottomComments.map((comment) => (
                                 <div key={comment.id} className="flex gap-4 group animate-in slide-in-from-bottom-2 duration-300">
                                     <div 
                                         className="cursor-pointer hover:opacity-80 transition-opacity"
                                         onClick={() => navigate(`/profile/${comment.user}`)}
                                     >
                                         <img src={comment.avatar} className="w-10 h-10 rounded-full border border-white/10 shrink-0" alt={comment.user} />
                                     </div>
                                     <CommentItem comment={comment} />
                                 </div>
                             ))}
                         </div>
                         
                         {/* Right Side Ad - Visible when there are bottom comments */}
                         <div className="shrink-0 w-full xl:w-[300px]">
                              <AdCard height="h-full min-h-[250px]" className="w-full rounded-xl shadow-lg border border-brand-500/20" title="Community Sponsor" />
                         </div>
                     </div>
                )}
            </div>
        </div>
    );
};
