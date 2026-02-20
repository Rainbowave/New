
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TipModal } from '../components/TipModal';
import { User } from '../types';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PostCard } from '../components/PostCard';
import { AdCard } from '../components/ads/AdCard';
import { CommentsModal } from '../components/comments/CommentsModal';
import { PromoteModal } from '../components/PromoteModal';
import { RightSidebar } from '../components/RightSidebar';
import { api } from '../services/api';
import { Loader2, UserPlus, Heart, Users } from 'lucide-react';

interface HomeProps {
    user: User;
}

const formatDate = (timestamp: number) => {
    const diff = (Date.now() - timestamp) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(timestamp).toLocaleDateString();
};

const ProfilePromoCard = ({ user, onClick }: { user: string, onClick: () => void }) => (
    <div className="bg-dark-800 border border-brand-500/30 p-5 rounded-lg mb-8 shadow-xl shadow-brand-900/10 relative overflow-hidden group hover:border-brand-500 transition-all cursor-pointer" onClick={onClick}>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-brand-600/90 px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest text-white z-10">
            <UserPlus size={10} /> Suggested
        </div>
        <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-[5px] p-0.5 bg-gradient-to-tr from-brand-500 to-purple-500 shadow-lg">
                <img src={`https://picsum.photos/100/100?random=${user}`} className="w-full h-full rounded-[5px] object-cover border-2 border-dark-900" alt={user} />
            </div>
            <div>
                <h4 className="font-black text-white text-sm uppercase italic tracking-tight mb-0.5">@{user}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">New Creator • 12.5K Reach</p>
                <button className="bg-white text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-colors">
                    View Profile
                </button>
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/20 to-transparent pointer-events-none"></div>
    </div>
);

// Updated Filter Tags: Replaced 'Polls' with 'Tickets'
const FILTER_TAGS = ['Trending', 'Newest', 'Prided Up', 'Intimacies', 'Circles', 'Tickets'];

export default function Home({ user }: HomeProps) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Trending');
    const [trends, setTrends] = useState<any[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [commentsModalOpen, setCommentsModalOpen] = useState(false);
    const [promoteModalOpen, setPromoteModalOpen] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const trendsData = await api.get<any[]>('/trends/hashtags');
                setTrends(trendsData || []);
            } catch (e) { console.error(e); }
        };
        loadInitialData();
    }, [user.contentPreference]);

    const fetchFeed = useCallback(async (cursor?: string) => {
        let typeParam = 'All';
        let sortParam = 'trending';

        if (activeTab === 'Trending') { typeParam = 'Trending'; sortParam = 'trending'; }
        if (activeTab === 'Newest') { typeParam = 'All'; sortParam = 'newest'; }
        if (activeTab === 'Prided Up') { typeParam = 'Pride'; sortParam = 'trending'; }
        if (activeTab === 'Tickets') { typeParam = 'POLL'; sortParam = 'trending'; } // Maps to POLL type
        if (activeTab === 'Intimacies' || activeTab === 'Circles') { typeParam = 'All'; sortParam = 'trending'; }

        const response = await api.get<{ items: any[], nextCursor?: string }>(`/feed?limit=10&cursor=${cursor || ''}&type=${typeParam}&sort=${sortParam}`);
        let items = response.items || [];
        
        if (activeTab === 'Tickets') {
            items = items.filter((i: any) => i.type === 'POLL' || i.pollData);
        }
        if (activeTab === 'Newest') {
             items.sort((a: any, b: any) => b.timestamp - a.timestamp);
        }

        if (!cursor) {
             const demoMix = items.length > 0 ? [...items] : [];

             if (activeTab === 'Trending' || activeTab === 'Newest') {
                 // ... (Rest of injected demo content remains same)
                 const photoCard = {
                     id: 'feed_photo_1',
                     type: 'PHOTO',
                     content: "Just captured this amazing sunset in the cyberpunk district. The neon reflections are unreal tonight. #photography #cyberpunk #cityscape",
                     thumbnailUrl: 'https://picsum.photos/800/800?random=photo_feed_1',
                     user: { username: "NeonVis", displayName: "Visual Artist", avatar: "https://picsum.photos/100/100?random=nv", isVerified: true },
                     heat: 3400,
                     tags: ['photography', 'cyberpunk', 'cityscape'],
                     timestamp: Date.now() - 1200000
                 };
                 
                 const videoCard = {
                    id: 'feed_video_mock',
                    type: 'VIDEO',
                    title: 'Cinematic Travel Vlog: Neon City',
                    content: 'Exploring the nightlife in 4K. The atmosphere is incredible. #travel #vlog #4k',
                    thumbnailUrl: 'https://picsum.photos/800/450?random=vid_mock',
                    user: { username: "Vlog_Star", displayName: "Traveler", avatar: "https://picsum.photos/100/100?random=vs", isVerified: true },
                    heat: 5400,
                    tags: ['travel', 'vlog', '4k'],
                    timestamp: Date.now() - 3600000
                };

                const shortCard = {
                    id: 'feed_short_mock',
                    type: 'SHORT',
                    title: 'Quick Drawing Tip',
                    content: 'How to shade in 30 seconds! ✏️ #art #tutorial #shorts',
                    thumbnailUrl: 'https://picsum.photos/400/700?random=short_mock',
                    user: { username: "Art_Daily", displayName: "Sketcher", avatar: "https://picsum.photos/100/100?random=ss" },
                    heat: 12000,
                    tags: ['art', 'tutorial', 'shorts'],
                    timestamp: Date.now() - 7200000
                };

                const comicCard = {
                    id: 'feed_comic_mock',
                    type: 'COMIC',
                    title: 'The Cyber Chronicles: Ep 1',
                    content: 'Read the first chapter of my new sci-fi series. #comic #webtoon #scifi',
                    thumbnailUrl: 'https://picsum.photos/600/800?random=comic_mock',
                    user: { username: "Ink_Master", displayName: "Comic Pro", avatar: "https://picsum.photos/100/100?random=cs", isVerified: true },
                    heat: 3200,
                    tags: ['comic', 'webtoon', 'scifi'],
                    timestamp: Date.now() - 10800000
                };

                const collectionCard = {
                    id: 'feed_coll_mock',
                    type: 'COLLECTION',
                    title: 'Pro Asset Pack Vol. 1',
                    content: 'High-res textures for your projects. Available now! #assets #design',
                    thumbnailUrl: 'https://picsum.photos/600/600?random=coll_mock',
                    user: { username: "Asset_Store", displayName: "Digital Goods", avatar: "https://picsum.photos/100/100?random=cls" },
                    price: "15.00",
                    heat: 600,
                    tags: ['assets', 'design', 'store'],
                    timestamp: Date.now() - 14400000
                };

                const ticketPollCard = {
                    id: 'feed_poll_ticket',
                    type: 'POLL',
                    user: { username: "LOTTERY_SYSTEM", displayName: "Jackpot", avatar: "https://picsum.photos/100/100?random=pool", isVerified: true },
                    pollData: {
                        question: "ENTER THE WEEKLY 5000 LSC POOL",
                        subtitle: "WEEKEND JACKPOT",
                        options: [
                            { id: '1', label: '1X ENTRY TICKET', votes: 120 },
                            { id: '2', label: '5X BUNDLE ENTRY', votes: 45 },
                        ],
                        type: 'ticket_pool',
                        ticketPrice: "50",
                        endsAt: "24H"
                    },
                    tags: ['LOTTO', 'WIN'],
                    timestamp: Date.now() - 500000
                };

                const interactivePollCard = {
                    id: 'feed_poll_map',
                    type: 'POLL',
                    user: { username: "STRATEGY_LEAD", displayName: "Map Tactician", avatar: "https://picsum.photos/100/100?random=map", isVerified: true },
                    pollData: {
                        question: "WHERE DO WE DROP?",
                        subtitle: "MAP STRATEGY VOTE",
                        type: 'standard',
                        mode: 'interactive',
                        image: "https://picsum.photos/1200/800?random=map_base",
                        markers: [
                            { id: '1', x: 20, y: 30, label: 'Sector A', votes: 120 },
                            { id: '2', x: 50, y: 50, label: 'Central Hub', votes: 450 },
                            { id: '3', x: 80, y: 70, label: 'Outpost', votes: 80 }
                        ],
                        endsAt: "15M"
                    },
                    tags: ['GAMING', 'STRATEGY'],
                    timestamp: Date.now() - 300000
                };
                
                const resourceCard = {
                    id: 'feed_res_mock',
                    type: 'RESOURCE',
                    title: 'Creator Growth Guide 2025',
                    content: 'Learn how to maximize your reach on LuciSin. #guide #tips',
                    thumbnailUrl: 'https://picsum.photos/800/500?random=res_mock',
                    user: { username: "Platform_Guide", displayName: "LuciSin Team", avatar: "https://picsum.photos/100/100?random=rs", isVerified: true },
                    heat: 8900,
                    category: "Knowledge",
                    tags: ['guide', 'tips', 'growth'],
                    timestamp: Date.now() - 14400000
                };

                demoMix.splice(0, 0, photoCard);
                demoMix.splice(2, 0, videoCard);
                demoMix.splice(3, 0, ticketPollCard);
                demoMix.splice(5, 0, shortCard);
                demoMix.splice(6, 0, interactivePollCard);
                demoMix.splice(7, 0, comicCard);
                demoMix.splice(8, 0, collectionCard);
                demoMix.splice(9, 0, resourceCard);
             }

             if (activeTab === 'Intimacies') {
                 items.length = 0; 
                 
                 const intimacyMocks = Array.from({ length: 5 }).map((_, i) => ({
                    id: `intimacy_post_${i}`,
                    type: 'PHOTO',
                    content: `Sharing a vulnerable moment with my close circle. 🤍 #intimacy #connection`,
                    thumbnailUrl: `https://picsum.photos/800/1000?random=intimacy_${i}`,
                    user: { username: `Soul_Connect_${i}`, displayName: `Deep Diver`, avatar: `https://picsum.photos/100/100?random=int_${i}`, isVerified: true },
                    heat: 500 + (i * 50),
                    tags: ['Intimacy', 'Deep', 'Connection'],
                    timestamp: Date.now() - (i * 3600000),
                    isAdult: true 
                 }));
                 items.push(...intimacyMocks);
                 demoMix.length = 0;
                 demoMix.push(...intimacyMocks);
             }

             if (activeTab === 'Circles') {
                 items.length = 0;
                 const circleMocks = Array.from({ length: 5 }).map((_, i) => ({
                    id: `circle_update_${i}`,
                    type: 'POST', 
                    title: `Circle Update: Neon Nights`,
                    content: `Hey everyone in the Neon Nights circle! We have a new event starting this Friday. Don't miss out! 🌃 #circle #community`,
                    user: { username: `Circle_Admin_${i}`, displayName: `Circle Lead`, avatar: `https://picsum.photos/100/100?random=cir_${i}`, isVerified: true },
                    heat: 120 + (i * 10),
                    tags: ['Circle', 'Update', 'Event'],
                    timestamp: Date.now() - (i * 7200000),
                    category: 'Community'
                 }));
                 items.push(...circleMocks);
                 demoMix.length = 0;
                 demoMix.push(...circleMocks);
             }

             return { items: demoMix, nextCursor: response.nextCursor };
        }
        
        return { items, nextCursor: response.nextCursor };
    }, [activeTab]);

    const { data: feedItems, loading, refresh } = useInfiniteScroll(fetchFeed);

    useEffect(() => {
        refresh();
    }, [activeTab, user.contentPreference]);

    const handlePostClick = (item: any) => {
        if (item.type === 'POLL') navigate(`/poll/${item.id}`);
        else if (item.type === 'COLLECTION' || item.type === 'PRODUCT') navigate(`/collection/view/${item.id}`);
        else if (item.type === 'COMIC') navigate(`/comic/${item.id}`);
        else if (item.type === 'RESOURCE') navigate(`/knowledge/${item.id}`);
        else if (item.type === 'VIDEO') navigate(`/video/${item.id}`);
        else if (item.type === 'SHORT') navigate(`/videos`);
        else if (item.type === 'PHOTO') navigate(`/photo/${item.id}`);
        else navigate(`/post/${item.id}`);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-dark-850">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${selectedPostId}`} />
            <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={selectedPostId || 0} />
            <PromoteModal isOpen={promoteModalOpen} onClose={() => setPromoteModalOpen(false)} mode="hashtag" />
            
            <div className="flex-1 min-w-0 flex flex-col relative border-r border-white/[0.02]">
                <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-white/5 py-3 px-4 md:px-8">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-linear-fade pb-1">
                        {FILTER_TAGS.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveTab(filter)}
                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2 ${
                                    activeTab === filter 
                                    ? 'bg-brand-500 text-white border-brand-500 shadow-lg' 
                                    : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white hover:bg-dark-700'
                                }`}
                            >
                                {filter === 'Intimacies' && <Heart size={12} fill="currentColor" />}
                                {filter === 'Circles' && <Users size={12} />}
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-2xl mx-auto p-4 md:p-8 pb-20 mt-4">
                    <div key={`${activeTab}`} className="space-y-12">
                        {feedItems.map((item: any, index) => (
                            <div key={`${item.id}-${index}`} className={item.isNew ? "animate-in fade-in slide-in-from-top-4 duration-1000" : ""}>
                                {item.type === 'AD' ? (
                                    <AdCard id={`ad_${item.id}`} />
                                ) : item.type === 'AD_PROFILE' ? (
                                    <ProfilePromoCard 
                                        user={item.user} 
                                        onClick={() => navigate(`/profile/${item.user}`)}
                                    />
                                ) : (
                                    <div onClick={() => handlePostClick(item)}>
                                        <PostCard 
                                            id={item.id} 
                                            type={item.type || 'photo'} 
                                            category={item.category || item.type}
                                            date={formatDate(item.timestamp)}
                                            content={item.content || item.title}
                                            imageUrl={item.thumbnailUrl || item.url}
                                            pollData={item.pollData}
                                            isPaid={item.privacy === 'paid' || (item.price && parseFloat(item.price) > 0)}
                                            price={item.price}
                                            ownerId={item.userId}
                                            privacy={item.privacy}
                                            author={item.user}
                                            tags={item.tags}
                                            isPromoted={item.isPromoted} 
                                            onTip={(id) => { setSelectedPostId(id); setTipModalOpen(true); }} 
                                            onCommentClick={(id) => { setSelectedPostId(id); setCommentsModalOpen(true); }} 
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {feedItems.length === 0 && !loading && (
                            <div className="py-20 text-center opacity-40 text-xs font-black uppercase tracking-widest text-gray-500">
                                No content found for these filters.
                            </div>
                        )}
                        
                        {loading && <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-brand-500" size={32} /></div>}
                    </div>
                </div>
            </div>

            <div className="hidden lg:block w-[300px] shrink-0 transition-all duration-300">
                <div className="sticky top-0 h-screen overflow-hidden border-l border-white/5 bg-[#141414]">
                    <RightSidebar trends={trends} onPromoteClick={() => setPromoteModalOpen(true)} showAd={false} showFooter={false} category="general" />
                </div>
            </div>
        </div>
    );
}
