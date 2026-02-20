
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Users, MessageCircle, MapPin, Sparkles, Filter, Search } from 'lucide-react';
import { api } from '../services/api';
import { PostCard } from '../components/PostCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

interface DatingProps {
    currentUser?: any;
}

export default function Dating({ currentUser }: DatingProps) {
    const [activeTab, setActiveTab] = useState('Feed');
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchDatingContent = useCallback(async (cursor?: string) => {
        // Explicitly requesting dating content via existing feed API with filtering
        // In a real app, this might be a specific endpoint /api/dating/feed
        // Here we simulate by filtering the generic feed
        const response = await api.get<{ items: any[], nextCursor?: string }>(`/feed?limit=10&cursor=${cursor || ''}&type=All`);
        
        // Client-side filter simulation for demo purposes if backend isn't strict
        const datingItems = response.items.filter(item => !item.isAdult);
        
        return {
            items: datingItems,
            nextCursor: response.nextCursor
        };
    }, []);

    const { data: feedItems, loading, refresh } = useInfiniteScroll(fetchDatingContent, containerRef);

    useEffect(() => {
        refresh();
    }, [currentUser?.contentPreference]);

    return (
        <div className="min-h-screen bg-dark-900 pb-20">
            {/* Dating Header */}
            <div className="relative bg-gradient-to-b from-brand-second/20 to-dark-900 pt-10 pb-8 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-second/10 text-brand-second border border-brand-second/20 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                        <Heart size={12} fill="currentColor" /> Sanctuary Mode
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4">
                        Dating <span className="text-brand-second">Connection</span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-lg mx-auto text-sm leading-relaxed">
                        Find your player 2. Explore profiles, connect with creators, and build meaningful relationships in a safe environment.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                {/* Filters */}
                <div className="flex items-center gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
                     {['Feed', 'Matches', 'Nearby', 'Verified'].map(tab => (
                         <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === tab ? 'bg-white text-black border-white shadow-lg' : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white'}`}
                         >
                             {tab}
                         </button>
                     ))}
                </div>

                {/* Match Suggestions (Mock) */}
                {activeTab === 'Matches' && (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-in fade-in">
                         {[1, 2, 3, 4].map(i => (
                             <div key={i} className="bg-dark-800 border border-white/5 rounded-2xl p-4 text-center group hover:border-brand-second/50 transition-all cursor-pointer">
                                 <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-brand-second to-blue-500 mb-3">
                                     <img src={`https://picsum.photos/100/100?random=date_${i}`} className="w-full h-full rounded-full object-cover border-2 border-dark-800" alt="User" />
                                 </div>
                                 <h4 className="font-bold text-white text-sm">User_{i}</h4>
                                 <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 font-bold uppercase mt-1">
                                     <MapPin size={10} /> 5km Away
                                 </div>
                                 <button className="mt-3 w-full bg-white/5 hover:bg-brand-second hover:text-black text-brand-second font-black py-2 rounded-lg text-[9px] uppercase tracking-widest transition-all">
                                     Connect
                                 </button>
                             </div>
                         ))}
                     </div>
                )}

                {/* Content Feed */}
                <div className="space-y-8" ref={containerRef}>
                    {feedItems.map((item: any, index) => (
                        <PostCard 
                            key={`${item.id}-${index}`}
                            id={item.id}
                            type={item.type || 'PHOTO'}
                            category="Dating"
                            date="Just now"
                            content={item.content || item.title}
                            imageUrl={item.thumbnailUrl || item.url}
                            ownerId={item.userId}
                            author={item.user}
                            hideMoodBadge={true}
                            isAdult={false}
                            onTip={() => {}}
                            onCommentClick={() => {}}
                        />
                    ))}
                    {loading && (
                        <div className="py-10 flex justify-center">
                            <Loader2 className="animate-spin text-brand-second" size={32} />
                        </div>
                    )}
                    {!loading && feedItems.length === 0 && (
                        <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                            No dating content found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
