
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, Loader2,
  ChevronDown, ChevronUp, FileText,
  BookOpen, TrendingUp, Search
} from 'lucide-react';
import { db } from '../services/db'; 
import { authService } from '../services/authService';
import { RightSidebar } from '../components/RightSidebar';
import { api } from '../services/api';
import { Interest, InterestHub } from '../components/InterestHub';
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal';
import { MasonryGrid } from '../components/MasonryGrid';

// Hub Card Component
const HubCard: React.FC<{ title: string, image: string, onClick?: () => void }> = ({ title, image, onClick }) => (
  <div 
    onClick={onClick} 
    className="relative w-full h-[80px] rounded-[5px] overflow-hidden cursor-pointer group border border-white/5 hover:border-brand-500/50 transition-all shadow-md"
  >
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
          <h3 className="text-xs font-black text-white uppercase italic tracking-tighter drop-shadow-md">{title}</h3>
      </div>
  </div>
);

export default function KnowledgeBook() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All');
    
    // Local Search State
    const [searchQuery, setSearchQuery] = useState('');

    const [resources, setResources] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHubsExpanded, setIsHubsExpanded] = useState(false);
    const [addedToPride, setAddedToPride] = useState(false);
    
    // Interaction State
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [commentsModalOpen, setCommentsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);

    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';

    // Data Loading
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch Trends & Dynamic Interests (Using photos section for interests as requested)
                const [trendsData, interestsData] = await Promise.all([
                    api.get<any[]>('/trends/hashtags'),
                    api.get<any[]>('/trends/tags?section=photos')
                ]);
                
                setTrends(trendsData);
                setInterests(interestsData.map((t: any) => ({
                    id: t.id,
                    title: t.tag,
                    image: t.image
                })));
                
                // Mock Resources Data
                const mockResources = Array.from({ length: 30 }).map((_, i) => ({
                    id: `res_${i}`,
                    title: [
                        "Designing a Font From Scratch", 
                        "The Future of Creator Economy", 
                        "Monetizing Your Art: A Strategic Approach", 
                        "Building a Loyal Fanbase from Zero", 
                        "The Ultimate Streaming Setup Guide",
                        "Understanding Color Theory for Digital Artists"
                    ][i % 5] + ` - Vol. ${i+1}`,
                    thumbnailUrl: `https://picsum.photos/600/${[400, 500, 350][i % 3]}?random=res_${i}`,
                    category: ['Design', 'Growth', 'Tech', 'Inspiration', 'Business'][i % 5],
                    user: { 
                        username: `Author_${i}`, 
                        avatar: `https://picsum.photos/100/100?random=a_${i}`,
                        displayName: `Expert ${i + 1}`
                    },
                    userId: `u_${i}`,
                    date: "Oct 24, 2025",
                    readTime: `${Math.floor(Math.random() * 10) + 3} min read`,
                    type: 'RESOURCE',
                    isAdult: isAdultMode,
                    content: "Learn the essential strategies and techniques required to master this skill. This comprehensive guide covers everything from the basics to advanced professional workflows used by industry leaders. We dive deep into practical applications."
                }));

                // Inject Ads
                const injectedResources = db.injectContent(mockResources, 'homeFeed'); 
                setResources(injectedResources);
                
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        loadData();
    }, [isAdultMode]);

    useEffect(() => {
        setAddedToPride(false);
    }, [activeCategory]);

    const filteredResources = useMemo(() => {
        let filtered = resources;
        
        if (activeCategory !== 'All') {
            filtered = filtered.filter(r => r.category === activeCategory || r.type === 'AD');
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(r => r.title && r.title.toLowerCase().includes(lowerQuery));
        }

        return filtered;
    }, [resources, activeCategory, searchQuery]);

    // Hubs for Visual Grid (using fetched interests)
    const displayedHubs = isHubsExpanded ? interests : interests.slice(0, 5);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-dark-850">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${selectedPostId}`} />
            <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={selectedPostId || 0} />

            <div className="flex-1 min-w-0 flex flex-col relative border-r border-white/[0.02]">
                
                {/* Header - Tags Navigation */}
                <div className="sticky top-0 z-30 bg-dark-950/95 backdrop-blur-xl border-b border-white/5 py-3 px-6 flex items-center gap-4 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-linear-fade w-full">
                         <button
                            onClick={() => setActiveCategory('All')}
                            className={`px-4 py-1.5 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${activeCategory === 'All' ? 'bg-white text-black border-white' : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white'}`}
                        >
                            All
                        </button>
                        {interests.map(hub => (
                             <button
                                key={hub.title}
                                onClick={() => setActiveCategory(hub.title)}
                                className={`px-4 py-1.5 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                                    activeCategory === hub.title 
                                    ? 'bg-brand-500 text-white border-brand-500 shadow-lg' 
                                    : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white hover:border-white/20'
                                }`}
                             >
                                 {hub.title}
                             </button>
                         ))}
                    </div>
                </div>

                <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-24">
                    
                    {/* Visual Categories Grid (Top of Page) */}
                    <div className="mb-12">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 transition-all duration-500">
                            {displayedHubs.map((hub, i) => (
                                <HubCard 
                                    key={i} 
                                    title={hub.title} 
                                    image={hub.image}
                                    onClick={() => setActiveCategory(hub.title)} 
                                />
                            ))}
                        </div>
                        
                        {interests.length > 5 && (
                            <div className="mt-4 flex justify-center">
                                <button 
                                    onClick={() => setIsHubsExpanded(!isHubsExpanded)}
                                    className="flex items-center gap-2 px-6 py-2 rounded-[5px] bg-dark-800 hover:bg-dark-700 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105"
                                >
                                    {isHubsExpanded ? (
                                        <>Show Less <ChevronUp size={12} /></>
                                    ) : (
                                        <>View More Topics <ChevronDown size={12} /></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content Grid using MasonryGrid */}
                    {loading ? (
                        <div className="py-20 flex justify-center shadow-none"><Loader2 className="animate-spin text-brand-500" /></div>
                    ) : (
                        <MasonryGrid 
                            items={filteredResources}
                            onTip={(id) => { setSelectedPostId(id); setTipModalOpen(true); }}
                            onCommentClick={(id) => { setSelectedPostId(id); setCommentsModalOpen(true); }}
                        />
                    )}
                    
                    {filteredResources.length === 0 && !loading && (
                        <div className="py-20 text-center opacity-40">
                             <FileText className="mx-auto mb-4 text-gray-500" size={48} />
                             <p className="text-xs font-black uppercase tracking-widest text-gray-500">No resources found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Right Sidebar */}
            <div className="hidden lg:block w-[300px] shrink-0 transition-all duration-300">
                <div className="sticky top-0 h-screen overflow-hidden border-l border-white/5 bg-[#141414]">
                    <RightSidebar 
                        trends={trends} 
                        onPromoteClick={() => {}} 
                        showAd={false} 
                        showFooter={false} 
                        category="general" 
                    />
                </div>
            </div>
        </div>
    );
}
