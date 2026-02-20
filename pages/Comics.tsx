
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, BookOpen } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { db } from '../services/db';
import { RightSidebar } from '../components/RightSidebar';
import { authService } from '../services/authService';
import { MasonryGrid } from '../components/MasonryGrid';
import { InterestHub, Interest } from '../components/InterestHub';

const COMIC_FILTERS = ['All', 'Action', 'Romance', 'Fantasy', 'Sci-Fi', 'Horror', 'Slice of Life', 'Superhero', 'Noir', 'Comedy', 'Drama', 'Mystery'];

export default function Comics() {
    const [searchParams] = useSearchParams();
    const [activeFilter, setActiveFilter] = useState('All');

    const [rawComics, setRawComics] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [loading, setLoading] = useState(true);

    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';

    const loadComics = useCallback(async () => {
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 800));

            const generatedComics: any[] = Array.from({ length: 24 }).map((_, i) => {
                 const height = i % 2 === 0 ? 500 : 400;
                 return {
                    id: `comic_${i}`,
                    title: `Visual Novel ${i + 1}`,
                    thumbnailUrl: `https://picsum.photos/400/${height}?random=${i + 600}`,
                    userId: `u_${(i % 5) + 1}`,
                    user: { username: `Creator_${(i % 5) + 1}`, avatar: `https://picsum.photos/100/100?random=${(i % 5) + 600}` },
                    category: ['Action', 'Romance', 'Fantasy', 'Sci-Fi'][i % 4],
                    episodes: Math.floor(Math.random() * 50) + 1,
                    type: 'COMIC',
                    isAdult: isAdultMode,
                    content: `An exciting story about ${['heroes', 'love', 'dragons', 'space'][i % 4]} and adventure.`
                };
            });

            const injectedComics = db.injectContent(generatedComics, 'comicReader');
            setRawComics(injectedComics);
            
            // Dynamic Trends
            const [trendsData, interestsData] = await Promise.all([
                 api.get<any[]>('/trends/hashtags'),
                 api.get<any[]>('/trends/tags?section=comics')
            ]);
            
            setTrends(trendsData);
            setInterests(interestsData.map((t: any) => ({
                id: t.id,
                title: t.tag,
                image: t.image
            })));

        } catch (e) { console.error(e); } finally { setLoading(false); }
    }, [isAdultMode]);

    useEffect(() => {
        loadComics();
    }, [loadComics]);

    const comics = useMemo(() => {
        let filtered = rawComics;
        
        if (activeFilter !== 'All') {
            filtered = filtered.filter(p => p.category === activeFilter || p.type === 'AD');
        }

        return filtered;
    }, [rawComics, activeFilter]);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-dark-850">
            <div className="flex-1 min-w-0 flex flex-col relative">
                {/* Single Row Filter Header */}
                <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-white/5 py-3 px-4 md:px-10 flex items-center gap-4">
                    <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 mask-linear-fade">
                        {COMIC_FILTERS.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                                    activeFilter === filter 
                                    ? 'bg-brand-500 text-white border-brand-500 shadow-lg' 
                                    : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white hover:bg-dark-700'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 md:p-10 pb-24">
                     {/* Interest Hub */}
                    <InterestHub 
                        items={interests} 
                        onSelect={setActiveFilter} 
                        activeItem={activeFilter} 
                    />

                    {loading ? (
                        <div className="py-20 flex justify-center shadow-none"><Loader2 className="animate-spin text-brand-500" /></div>
                    ) : (
                        <MasonryGrid items={comics} onTip={() => {}} onCommentClick={() => {}} />
                    )}

                    {comics.length === 0 && !loading && (
                        <div className="py-20 text-center opacity-40">
                             <BookOpen className="mx-auto mb-4 text-gray-500" size={48} />
                             <p className="text-xs font-black uppercase tracking-widest text-gray-500">No comics found.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="hidden lg:block w-[300px] shrink-0 transition-all duration-300">
                <div className="sticky top-0 h-screen overflow-hidden border-l border-white/5 bg-[#141414]">
                    <RightSidebar trends={trends} onPromoteClick={() => {}} showAd={false} showFooter={false} category="comics" />
                </div>
            </div>
        </div>
    );
}
