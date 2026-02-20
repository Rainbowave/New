
import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Globe, Hash, HandHeart, Heart, Trophy, Flame, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { HashtagCard } from '../components/HashtagCard';

export default function Hashtags() {
    const [hashtags, setHashtags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'All' | 'Intimacy' | 'Contests'>('All');

    useEffect(() => {
        const fetchTags = async () => {
            setLoading(true);
            try {
                // 1. Fetch generic trends from API
                const apiData = await api.get<any[]>('/trends/hashtags');
                
                // 2. Define specific Intimacy Tags (Hardcoded for "Pride Up" section)
                const intimacyTags = [
                    { id: 'int_1', tag: '#Intimacy', count: '450K', trend: 'up', contestCount: 1, contesterCount: 1200, category: 'Intimacy' },
                    { id: 'int_2', tag: '#SafeSpace', count: '120K', trend: 'stable', contestCount: 0, contesterCount: 0, category: 'Intimacy' },
                    { id: 'int_3', tag: '#DeepConnect', count: '85K', trend: 'up', contestCount: 0, contesterCount: 0, category: 'Intimacy' },
                    { id: 'int_4', tag: '#CircleVibes', count: '210K', trend: 'up', contestCount: 1, contesterCount: 500, category: 'Intimacy' },
                    { id: 'int_5', tag: '#Vulnerable', count: '95K', trend: 'stable', contestCount: 0, contesterCount: 0, category: 'Intimacy' },
                    { id: 'int_6', tag: '#MyTruth', count: '300K', trend: 'down', contestCount: 0, contesterCount: 0, category: 'Intimacy' },
                    { id: 'int_7', tag: '#LoveLanguage', count: '1.2M', trend: 'up', contestCount: 2, contesterCount: 5000, category: 'Intimacy' },
                    { id: 'int_8', tag: '#SoulTies', count: '80K', trend: 'up', contestCount: 1, contesterCount: 300, category: 'Intimacy' },
                ];

                // 3. Define specific Global Contest Tags
                const contestTags = [
                    { id: 'con_1', tag: '#CreatorChallenge', count: '2.5M', trend: 'up', contestCount: 1, contesterCount: 15000, category: 'Contest' },
                    { id: 'con_2', tag: '#WeeklySpotlight', count: '800K', trend: 'stable', contestCount: 1, contesterCount: 3200, category: 'Contest' },
                    { id: 'con_3', tag: '#NewTalent', count: '150K', trend: 'up', contestCount: 1, contesterCount: 800, category: 'Contest' },
                    { id: 'con_4', tag: '#PrideContest', count: '500K', trend: 'up', contestCount: 1, contesterCount: 4500, category: 'Contest' },
                ];

                // 4. Map API data to match structure (General Tags)
                const genericTags = apiData.map((t, i) => ({ 
                    ...t, 
                    id: `gen_${t.id}_${i}`,
                    contestCount: Math.random() > 0.9 ? 1 : 0, // Randomly assign contests to generic tags
                    contesterCount: Math.random() > 0.9 ? Math.floor(Math.random() * 1000) : 0,
                    category: 'General'
                }));
                
                // Combine all unique tags
                // We use a Map to ensure unique tag names if duplicates exist across sources
                const combined = [...intimacyTags, ...contestTags, ...genericTags];
                const uniqueTags = Array.from(new Map(combined.map(item => [item.tag, item])).values());

                setHashtags(uniqueTags);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTags();
    }, []);

    const filteredTags = useMemo(() => {
        if (activeTab === 'All') return hashtags;
        if (activeTab === 'Intimacy') return hashtags.filter(t => t.category === 'Intimacy');
        if (activeTab === 'Contests') return hashtags.filter(t => t.contestCount > 0);
        return hashtags;
    }, [hashtags, activeTab]);

    return (
        <div className="min-h-screen bg-dark-900 pb-32">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-500 text-[10px] font-black uppercase tracking-widest mb-4">
                                <Hash size={12} className="text-brand-500" /> Curated Feeds
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                                Pride Up <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">Tags</span>
                            </h1>
                             <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2 max-w-lg">
                                Discover trending signals. Participate in intimacy circles and tag-based contests.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                             <button 
                                onClick={() => setActiveTab('All')}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === 'All' ? 'bg-white text-black border-white' : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white'}`}
                             >
                                 All Tags
                             </button>
                             <button 
                                onClick={() => setActiveTab('Intimacy')}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${activeTab === 'Intimacy' ? 'bg-brand-500 text-white border-brand-500' : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white'}`}
                             >
                                 <Heart size={12} fill="currentColor" /> Intimacy
                             </button>
                             <button 
                                onClick={() => setActiveTab('Contests')}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${activeTab === 'Contests' ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white'}`}
                             >
                                 <Trophy size={12} /> Active Contests
                             </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTags.map((tag) => (
                        <HashtagCard key={tag.id} tag={tag} />
                    ))}
                    {filteredTags.length === 0 && !loading && (
                        <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                            No tags found for this category.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
