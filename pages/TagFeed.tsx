
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Hash, ArrowLeft, Loader2, Plus, Check, Trophy, Timer, Coins, Megaphone, FileText, CheckCircle, Video, Image as ImageIcon, Smartphone, BookOpen, Play, Users } from 'lucide-react';
import { api } from '../services/api';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PostCard } from '../components/PostCard';
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal';
import { RightSidebar } from '../components/RightSidebar';
import { CreatePostModal } from '../components/CreatePostModal';

export default function TagFeed() {
    const { tag } = useParams();
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    
    const [isPrided, setIsPrided] = useState(false);
    const [trends, setTrends] = useState<any[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [commentsModalOpen, setCommentsModalOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    
    // Tag Feed Bar Filters
    const [filter, setFilter] = useState('Top');

    const cleanTag = tag?.replace('#', '') || 'General';

    // Mock Campaign Data for the current tag
    const campaignDetails = {
        title: `${cleanTag} Challenge`,
        description: "Show us your best content fitting this theme. Whether it's photography, digital art, or a short film, we want to see your unique perspective.",
        requirements: [
            `Must use tag #${cleanTag}`,
            "Original content only",
            "Minimum 1080p resolution for video",
            "No AI-generated heavy edits (max 20%)"
        ],
        rewardPool: "5,000 LSC",
        endDate: "Oct 31, 2025"
    };

    useEffect(() => {
        // Check if this tag is already in user's pride
        const prideTags = db.getPrideTags();
        if (tag && prideTags.includes(`#${tag}`)) {
            setIsPrided(true);
        } else if (tag && prideTags.includes(tag)) {
             setIsPrided(true);
        }

        const fetchTrends = async () => {
            try {
                const trendsData = await api.get<any[]>('/trends/hashtags');
                setTrends(trendsData);
            } catch (e) { console.error(e); }
        };
        fetchTrends();
    }, [tag]);

    const handlePrideToggle = () => {
        if (!tag) return;
        const tagWithHash = tag.startsWith('#') ? tag : `#${tag}`;
        db.togglePrideTag(tagWithHash);
        setIsPrided(!isPrided);
    };

    const handleSubmitEntry = () => {
        if (!currentUser) {
            navigate('/auth/login');
            return;
        }
        setIsSubmitModalOpen(true);
    };

    const fetchFeed = useCallback(async (cursor?: string) => {
        try {
            const res = await api.get<{ items: any[], nextCursor?: string }>(`/feed?limit=12&cursor=${cursor || ''}&tag=${tag}&sort=${filter.toLowerCase()}`);
            
            // If API returns no items (common for specific tags in demo), generate mock content to populate the feed
            if (!res.items || res.items.length === 0) {
                const mockItems = Array.from({ length: 12 }).map((_, i) => ({
                    id: `tag_mock_${cleanTag}_${i}_${cursor || 0}`,
                    type: ['PHOTO', 'VIDEO', 'SHORT'][i % 3],
                    category: cleanTag,
                    title: `${cleanTag} Vibes #${i + 1}`,
                    content: `Exploring the best of #${cleanTag}. This is some auto-generated content for the feed.`,
                    thumbnailUrl: `https://picsum.photos/600/${i % 2 === 0 ? 800 : 450}?random=${cleanTag}${i}${cursor}`,
                    userId: `u_${i}`,
                    user: { 
                        username: `Creator_${i}`, 
                        displayName: `Artist ${i}`, 
                        avatar: `https://picsum.photos/50/50?random=u${i}`,
                        isVerified: i % 3 === 0
                    },
                    heat: Math.floor(Math.random() * 5000) + 100,
                    comments: Math.floor(Math.random() * 50),
                    timestamp: Date.now() - (i * 3600000),
                    isAdult: false
                }));
                return { items: mockItems, nextCursor: 'end' };
            }

            return res;
        } catch (e) {
            return { items: [], nextCursor: undefined };
        }
    }, [tag, filter, cleanTag]);

    const { data: feedItems, loading, refresh } = useInfiniteScroll(fetchFeed);

    useEffect(() => {
        refresh();
    }, [filter]);

    const feedFilters = ['Contest', 'Top', 'Recent'];

    return (
        <div className="relative w-full min-h-screen bg-dark-850 font-sans flex flex-col">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${selectedPostId}`} />
            <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={selectedPostId || 0} />
            
            {/* Contest Entry Modal */}
            {currentUser && (
                <CreatePostModal 
                    isOpen={isSubmitModalOpen} 
                    onClose={() => setIsSubmitModalOpen(false)} 
                    userAvatar={currentUser.avatarUrl}
                    userId={currentUser.id}
                    isPremium={currentUser.isPremium}
                    contentPreference={currentUser.contentPreference}
                    initialType="PHOTO"
                    initialTags={[`#${cleanTag}`, '#ContestEntry']}
                    onSuccess={() => {
                        setIsSubmitModalOpen(false);
                        refresh();
                        alert("Contest entry submitted successfully!");
                    }}
                    userRole={currentUser.role} 
                />
            )}

            {/* Header */}
            <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-md border-b border-white/5 px-6 py-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                                <Hash size={24} className="text-brand-500" /> {cleanTag}
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tag Feed</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handlePrideToggle}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                            isPrided 
                            ? 'bg-transparent border border-brand-500 text-brand-500' 
                            : 'bg-brand-500 text-white hover:bg-brand-600'
                        }`}
                    >
                        {isPrided ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                        {isPrided ? 'My Pride' : 'Add to Pride'}
                    </button>
                </div>

                {/* Tag Feed Bar */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {feedFilters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                                filter === f 
                                ? 'bg-white text-black border-white shadow-lg' 
                                : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white hover:bg-dark-700'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row relative flex-1 min-h-0">
                <div className="flex-1 min-w-0 bg-dark-850 p-4 md:p-8">
                    
                    {/* Main Campaign Container */}
                    <div className="mb-10 bg-dark-800 border border-brand-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl group">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 p-40 bg-brand-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity group-hover:opacity-100"></div>
                        
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-4">
                                        <Trophy size={12} /> Official Campaign
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-3 leading-none">
                                        {campaignDetails.title}
                                    </h2>
                                     <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400">
                                        <span className="flex items-center gap-1.5 text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                            <Coins size={14} className="text-yellow-500"/> Pool: {campaignDetails.rewardPool}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                            <Timer size={14} className="text-blue-500"/> Ends {campaignDetails.endDate}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSubmitEntry}
                                    className="w-full md:w-auto bg-brand-600 hover:bg-brand-500 text-white font-black py-4 px-8 rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-brand-900/30 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                                >
                                    <Megaphone size={16} /> Submit Entry
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
                                <div>
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <FileText size={14} className="text-brand-500"/> Brief
                                    </h4>
                                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                        {campaignDetails.description}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500"/> Requirements
                                    </h4>
                                    <ul className="space-y-3">
                                        {campaignDetails.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-bold">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 shadow-[0_0_5px_currentColor]"></div>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Layout Container */}
                    <div className="w-full pb-20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Users size={14} /> Contributors
                            </h3>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>

                        {feedItems.length === 0 && !loading ? (
                            <div className="py-20 text-center opacity-40 flex flex-col items-center">
                                <Hash size={48} className="mb-4 text-gray-500" />
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">No Posts Yet</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Be the first to post with #{cleanTag}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {feedItems.map((item: any, index) => (
                                    <div key={`${item.id}-${index}`} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <PostCard 
                                            id={item.id} 
                                            type={item.type || 'photo'} 
                                            category={item.category || item.type}
                                            date={new Date(item.timestamp).toLocaleDateString()}
                                            content={item.content}
                                            pollData={item.pollData}
                                            isPaid={item.privacy === 'paid'}
                                            price={item.price}
                                            ownerId={item.userId}
                                            author={item.user}
                                            isPromoted={item.isPromoted} 
                                            compact={true} 
                                            onTip={(id) => { setSelectedPostId(id); setTipModalOpen(true); }} 
                                            onCommentClick={(id) => { setSelectedPostId(id); setCommentsModalOpen(true); }} 
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {loading && <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-brand-500" size={32} /></div>}
                    </div>
                </div>

                {/* Sticky Right Sidebar - No Scroll */}
                <div className="hidden lg:block w-[350px] shrink-0">
                    <div className="sticky top-0 h-screen overflow-hidden border-l border-white/5 bg-[#141414]">
                        <RightSidebar trends={trends} onPromoteClick={() => {}} showAd={false} showFooter={false} />
                    </div>
                </div>
            </div>
        </div>
    );
}
