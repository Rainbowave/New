
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Flame, Lock, Zap, ShieldCheck, Play, Key } from 'lucide-react';
import { api } from '../services/api';
import { PostCard } from '../components/PostCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

interface NaughtyProps {
    currentUser?: any;
}

export default function Naughty({ currentUser }: NaughtyProps) {
    const [activeTab, setActiveTab] = useState('Feed');
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchAdultContent = useCallback(async (cursor?: string) => {
        // Explicit request to the feed API but relying on the backend (mocked in db) to return adult content
        // In the mock implementation, we filter by preference/mode in the API layer, so the 'type' param is just for categorization
        const response = await api.get<{ items: any[], nextCursor?: string }>(`/feed?limit=10&cursor=${cursor || ''}&type=All`);
        
        // Ensure we are only displaying items that match the current mode if the API leak happens
        // But mainly relying on the API to respect the current user's mode preference set in localStorage
        const naughtyItems = response.items.filter(item => item.isAdult);
        
        return {
            items: naughtyItems,
            nextCursor: response.nextCursor
        };
    }, []);

    const { data: feedItems, loading, refresh } = useInfiniteScroll(fetchAdultContent, containerRef);

    useEffect(() => {
        refresh();
    }, [currentUser?.contentPreference]);

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* Naughty Header */}
            <div className="relative bg-gradient-to-b from-brand-900/40 to-black pt-12 pb-10 px-6 border-b border-brand-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-pulse">
                        <Flame size={12} fill="currentColor" /> 18+ Playground
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4 text-shadow-lg shadow-brand-900">
                        Naughty <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-red-600">Unfiltered</span>
                    </h1>
                    <p className="text-brand-100/60 font-medium max-w-lg mx-auto text-sm leading-relaxed">
                        Exclusive, uncensored content from top creators. Privacy is paramount in the playground.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 pt-8">
                {/* Filters */}
                <div className="flex items-center gap-4 mb-8 overflow-x-auto no-scrollbar pb-2 justify-center">
                     {['Feed', 'Exclusive', 'Live Cam', 'Private'].map(tab => (
                         <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === tab ? 'bg-brand-600 text-white border-brand-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-dark-900 text-gray-500 border-white/10 hover:text-white hover:border-brand-500/50'}`}
                         >
                             {tab}
                         </button>
                     ))}
                </div>

                {/* Exclusive Teaser */}
                {activeTab === 'Exclusive' && (
                    <div className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-brand-900/20 to-black border border-brand-500/30 text-center relative overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 bg-[url('https://picsum.photos/1200/400?blur=10')] opacity-20 bg-cover bg-center"></div>
                        <div className="relative z-10">
                            <Lock size={40} className="mx-auto text-brand-500 mb-4" />
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Premium Vault Access</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Unlock 500+ Exclusive Photos & Videos</p>
                            <button className="bg-white text-black font-black px-8 py-3 rounded-full uppercase tracking-widest text-xs hover:bg-brand-500 hover:text-white transition-all shadow-xl">
                                Get Access
                            </button>
                        </div>
                    </div>
                )}

                {/* Content Feed */}
                <div className="space-y-12" ref={containerRef}>
                    {feedItems.length > 0 ? (
                        feedItems.map((item: any, index) => (
                            <PostCard 
                                key={`${item.id}-${index}`}
                                id={item.id}
                                type={item.type || 'PHOTO'}
                                category="Naughty"
                                date="Just now"
                                content={item.content || item.title}
                                imageUrl={item.thumbnailUrl || item.url}
                                ownerId={item.userId}
                                author={item.user}
                                isPaid={item.isPaid}
                                price={item.price}
                                hideMoodBadge={true}
                                isAdult={true}
                                onTip={() => {}}
                                onCommentClick={() => {}}
                            />
                        ))
                    ) : !loading && (
                        <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                             No content available in this mode yet.
                        </div>
                    )}
                    
                    {loading && (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="animate-spin text-brand-500" size={40} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
