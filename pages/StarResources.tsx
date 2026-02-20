
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, Loader2,
  Plus, ChevronDown, ChevronUp, FileText,
  BookOpen, TrendingUp, Search
} from 'lucide-react';
import { db } from '../services/db'; 
import { authService } from '../services/authService';
import { RightSidebar } from '../components/RightSidebar';
import { PostCard } from '../components/PostCard'; 
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal';
import { api } from '../services/api';
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

export default function StarResources() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All');
    
    // Local Search State
    const [searchQuery, setSearchQuery] = useState('');

    const [resources, setResources] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
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
                // Fetch Trends
                const trendsData = await api.get<any[]>('/trends/hashtags');
                setTrends(trendsData);
                
                // Mock Resources Data
                const mockResources = Array.from({ length: 30 }).map((_, i) => ({
                    id: `res_${i}`,
                    title: [
                        "Designing a Font From Scratch", 
                        "The Future of Creator Economy", 
                        "Monetizing Your Art", 
                        "Building a Loyal Fanbase",
                        "Streaming Setup Guide 2025"
                    ][i % 5] + ` - Vol. ${i+1}`,
                    thumbnailUrl: `https://picsum.photos/600/${[400, 500, 350][i % 3]}?random=res_${i}`,
                    category: ['Design', 'Growth', 'Tech', 'Inspiration', 'Business'][i % 5],
                    user: { 
                        username: `Author_${i}`, 
                        avatar: `https://picsum.photos/100/100?random=a_${i}`,
                        displayName: `Expert ${i}`
                    },
                    userId: `u_${i}`,
                    date: "2 days ago",
                    views: "12.5K",
                    type: 'RESOURCE', // Key type for PostCard and routing
                    isAdult: isAdultMode,
                    content: "Exclusive knowledge drop for the Pride."
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

    const handleAddToPride = () => {
        db.togglePrideTag(activeCategory);
        setAddedToPride(true);
    };

    // Category Hubs
    const HUBS = [
        { title: "All Knowledge", image: "https://picsum.photos/400/300?random=kb1", filter: 'All' },
        { title: "Design", image: "https://picsum.photos/400/300?random=kb2", filter: 'Design' },
        { title: "Growth", image: "https://picsum.photos/400/300?random=kb3", filter: 'Growth' },
        { title: "Tech", image: "https://picsum.photos/400/300?random=kb4", filter: 'Tech' },
        { title: "Business", image: "https://picsum.photos/400/300?random=kb5", filter: 'Business' },
        { title: "Inspiration", image: "https://picsum.photos/400/300?random=kb6", filter: 'Inspiration' },
        { title: "Events", image: "https://picsum.photos/400/300?random=kb7", filter: 'Events' },
        { title: "Community", image: "https://picsum.photos/400/300?random=kb8", filter: 'Community' },
        { title: "Tutorials", image: "https://picsum.photos/400/300?random=kb9", filter: 'Tutorials' },
        { title: "Safety", image: "https://picsum.photos/400/300?random=kb10", filter: 'Safety' },
    ];

    const displayedHubs = isHubsExpanded ? HUBS : HUBS.slice(0, 5);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-dark-850">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${selectedPostId}`} />
            <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={selectedPostId || 0} />

            <div className="flex-1 min-w-0 flex flex-col relative border-r border-white/[0.02]">
                
                {/* Full-width Sticky Header */}
                <div className="sticky top-0 z-30 bg-dark-950/95 backdrop-blur-xl border-b border-white/5 py-3 px-4 flex items-center justify-between gap-4">
                     <div className="flex items-center gap-3 md:hidden">
                        <div className="p-1 bg-brand-500/10 rounded-[5px] text-brand-500">
                             <BookOpen size={18} />
                         </div>
                         <h1 className="text-sm font-black text-white uppercase tracking-tighter">Knowledge</h1>
                    </div>

                    <div className="flex items-center overflow-x-auto no-scrollbar gap-2 flex-1 w-full pl-4 md:pl-0">
                         {HUBS.map(hub => (
                             <button
                                key={hub.title}
                                onClick={() => setActiveCategory(hub.filter)}
                                className={`px-5 py-2 text-[8px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap text-center rounded-[5px] border flex items-center gap-1.5 ${
                                    activeCategory === hub.filter 
                                    ? 'bg-brand-500 text-white border-brand-500 shadow-lg' 
                                    : 'bg-dark-800 text-gray-500 border-white/5 hover:bg-brand-second hover:text-white hover:border-brand-second'
                                }`}
                             >
                                 {activeCategory === hub.filter && <CheckCircle size={10} strokeWidth={3} />}
                                 {hub.filter}
                             </button>
                         ))}
                    </div>

                    {/* In-Page Search */}
                    <div className="relative group min-w-[200px] hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-500 transition-colors" size={14} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter knowledge..." 
                            className="w-full bg-dark-800 border border-white/10 rounded-[5px] py-2 pl-9 pr-4 text-xs text-white focus:border-brand-500 outline-none transition-all placeholder:text-gray-600 font-medium"
                        />
                    </div>
                </div>

                <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 pb-24">
                    {/* Visual Hubs Grid */}
                    <div className="mb-12">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 transition-all duration-500">
                            {displayedHubs.map((hub, i) => (
                                <HubCard 
                                    key={i} 
                                    title={hub.title} 
                                    image={hub.image}
                                    onClick={() => setActiveCategory(hub.filter)} 
                                />
                            ))}
                        </div>
                        
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
                    </div>

                    {/* Content Grid */}
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
                             <p className="text-xs font-black uppercase tracking-widest text-gray-500">No resources found.</p>
                        </div>
                    )}

                    {/* Explore More - Standardized 2-Col Grid */}
                    <div className="mt-12 border-t border-white/[0.03] pt-12">
                        <div className="flex items-center gap-3 mb-10">
                            <TrendingUp size={24} className="text-brand-500" />
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Top Knowledge</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Right Sidebar (Same as Home) */}
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
