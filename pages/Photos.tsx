
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import { db } from '../services/db';
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal'; 
import { RightSidebar } from '../components/RightSidebar';
import { authService } from '../services/authService';
import { MasonryGrid } from '../components/MasonryGrid';
import { InterestHub, Interest } from '../components/InterestHub';

const PHOTO_FILTERS = ['All', 'Portrait', 'Landscape', 'Abstract', 'Urban', 'Nature', 'Fashion', 'Editorial', 'B&W', 'Macro', 'Film', 'Digital'];

export default function Photos() {
    const [searchParams] = useSearchParams();
    const [activeFilter, setActiveFilter] = useState('All');
    
    const [rawPhotos, setRawPhotos] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [commentsModalOpen, setCommentsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);

    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';

    useEffect(() => {
        const loadPhotos = async () => {
            setLoading(true);
            try {
                await new Promise(r => setTimeout(r, 800));

                const generatedPhotos: any[] = Array.from({ length: 40 }).map((_, i) => {
                    const heights = [400, 500, 600, 800, 350, 450, 700];
                    const height = heights[i % heights.length];
                    const width = 600;
                    
                    return {
                        id: `gen_photo_${i}`,
                        title: `Visual Signal ${i + 1}`,
                        thumbnailUrl: `https://picsum.photos/${width}/${height}?random=${i + 500}`,
                        userId: `u_${(i % 10) + 1}`,
                        user: { username: `Creator_${(i % 10) + 1}`, avatar: `https://picsum.photos/100/100?random=${(i % 10) + 500}` },
                        isPromoted: false, 
                        type: 'PHOTO',
                        category: ['Portrait', 'Landscape', 'Abstract', 'Urban', 'Nature', 'Fashion'][i % 6],
                        isAdult: isAdultMode,
                        content: i % 3 === 0 ? "A stunning visual piece" : "Abstract concepts in light"
                    };
                });
                
                const injectedPhotos = db.injectContent(generatedPhotos, 'photos');
                setRawPhotos(injectedPhotos);
                
                // Fetch dynamic trends
                const [trendsData, interestsData] = await Promise.all([
                    api.get<any[]>('/trends/hashtags'),
                    api.get<any[]>('/trends/tags?section=photos')
                ]);
                
                setTrends(trendsData);
                // Map the trending tags to Interest objects
                const mappedInterests: Interest[] = interestsData.map((t: any) => ({
                    id: t.id,
                    title: t.tag,
                    image: t.image
                }));
                setInterests(mappedInterests);

            } catch (e) {
                console.error("Failed to load photos", e);
            } finally {
                setLoading(false);
            }
        };
        loadPhotos();
    }, [isAdultMode]);

    const photos = useMemo(() => {
        let filtered = rawPhotos;
        
        if (activeFilter !== 'All') {
            filtered = filtered.filter(p => p.category === activeFilter || p.type === 'AD');
        }
        
        return filtered;
    }, [rawPhotos, activeFilter]);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-dark-850">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${selectedPostId}`} />
            <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={selectedPostId || 0} />

            <div className="flex-1 min-w-0 flex flex-col relative">
                {/* Single Row Filter Header */}
                <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-white/5 py-3 px-4 md:px-10 flex items-center gap-4">
                    <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 mask-linear-fade">
                        {PHOTO_FILTERS.map(filter => (
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
                        <MasonryGrid 
                            items={photos} 
                            onTip={(id) => { setSelectedPostId(id); setTipModalOpen(true); }}
                            onCommentClick={(id) => { setSelectedPostId(id); setCommentsModalOpen(true); }}
                        />
                    )}
                    
                    {photos.length === 0 && !loading && (
                        <div className="py-20 text-center opacity-40">
                             <ImageIcon className="mx-auto mb-4 text-gray-500" size={48} />
                             <p className="text-xs font-black uppercase tracking-widest text-gray-500">No photos found.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="hidden lg:block w-[300px] shrink-0 transition-all duration-300">
                <div className="sticky top-0 h-screen overflow-hidden border-l border-white/5 bg-[#141414]">
                    <RightSidebar trends={trends} onPromoteClick={() => {}} showAd={false} showFooter={false} category="photos" />
                </div>
            </div>
        </div>
    );
}
