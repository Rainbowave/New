
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
    Search as SearchIcon, Users, Grid, Hash, Filter, Loader2, 
    Video, Image as ImageIcon, BookOpen, ShoppingBag, 
    Flame, Heart, FileText, Smartphone, Radio, ChevronRight, LayoutGrid,
    Plus, Check
} from 'lucide-react';
import { api } from '../services/api';
import { db } from '../services/db';
import { MasonryGrid } from '../components/MasonryGrid';
import { authService } from '../services/authService';
import { PostCard } from '../components/PostCard';

const SEARCH_FILTERS = [
    { id: 'everything', label: 'Top Content', icon: LayoutGrid },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'photos', label: 'Photos', icon: ImageIcon },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'shorts', label: 'Shorts', icon: Smartphone },
    { id: 'comics', label: 'Comics', icon: BookOpen },
    { id: 'collection', label: 'Collections', icon: ShoppingBag }
];

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'everything';
    
    const [groupedResults, setGroupedResults] = useState<Record<string, any[]>>({});
    const [allItems, setAllItems] = useState<any[]>([]); 
    const [loading, setLoading] = useState(false);
    const [isFallback, setIsFallback] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);

    // Initialize search state from URL query to persist it
    const [searchQuery, setSearchQuery] = useState(query);

    // Pride State
    const [isPrided, setIsPrided] = useState(false);

    const currentUser = authService.getCurrentUser();
    const isNaughtyMode = currentUser?.contentPreference === 'adult';
    const accentColor = isNaughtyMode ? 'text-brand-500' : 'text-brand-second';
    
    // Sync local state if URL changes externally
    useEffect(() => {
        setSearchQuery(query);
    }, [query]);

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${category}`);
        }
    };

    useEffect(() => {
        // Check Pride Status
        if (query && query.startsWith('#')) {
             const tag = query;
             const prideTags = db.getPrideTags();
             setIsPrided(prideTags.includes(tag));
        } else {
            setIsPrided(false);
        }

        const fetchResults = async () => {
            setLoading(true);
            setIsFallback(false);
            await new Promise(r => setTimeout(r, 600));

            // 1. Fetch Real + Seeded Content
            let allContent = db.getPosts();

            // 2. Generate Extra Mock Data for dense search results
            const extraMocks = Array.from({ length: 60 }).map((_, i) => ({
                id: `search_gen_${i}`,
                type: ['PHOTO', 'VIDEO', 'SHORT', 'COMIC', 'COLLECTION'][i % 5],
                title: `Search Result ${i}`,
                content: `Content matching ${query || 'trending'}...`,
                thumbnailUrl: `https://picsum.photos/600/${[800, 600, 900, 750, 500][i % 5]}?random=search_${i}`,
                user: { username: `Creator_${i}`, avatar: `https://picsum.photos/50/50?random=u_${i}`, displayName: `Artist ${i}`, isVerified: i % 3 === 0 },
                price: i % 6 === 0 ? '5.00' : undefined,
                heat: Math.floor(Math.random() * 5000),
                isAdult: false,
                category: 'General',
                tags: query ? [query.replace('#',''), 'Trending'] : ['Trending', 'Viral'],
                timestamp: Date.now() - (i * 100000)
            }));
            
            // 3. Generate Mock Creators
            const mockCreators = Array.from({ length: 15 }).map((_, i) => ({
                id: `creator_${i}`,
                type: 'AD_PROFILE', 
                user: { username: `Creator_${i+1}`, displayName: `Top Creator ${i+1}`, avatar: `https://picsum.photos/100/100?random=c_${i}`, isVerified: true },
                content: `Top creator matching ${query}`,
                isAdult: false,
                thumbnailUrl: `https://picsum.photos/100/100?random=c_${i}`
            }));

            // 4. Generate Specific Post Mocks
            const specificPostMocks = [
                 // Text Post
                 {
                    id: 'search_post_text',
                    type: 'POST',
                    title: 'Platform Update: Arcade Mode Live',
                    content: "We've just launched the new Arcade section! Earn LSC by playing games. Check the leaderboard to see who's on top. 🎮 #update #arcade #gaming",
                    user: { username: 'System', displayName: 'LuciSin Team', avatar: 'https://picsum.photos/50/50?random=sys', isVerified: true },
                    heat: 5400,
                    comments: 320,
                    tags: ['Update', 'Arcade', 'Gaming'],
                    timestamp: Date.now(),
                    isAdult: false
                },
                // ... (Other specific mocks remain same structure, ensure tags are present)
            ];

            allContent = [...allContent, ...extraMocks, ...mockCreators];

            // 5. Filter by Query & Mode
            let searchResults = allContent.filter((p: any) => {
                // Strict Mode Filtering
                if (!isNaughtyMode && p.isAdult) return false;
                
                // Exclude RESOURCES if any snuck in from DB
                if (p.type === 'RESOURCE') return false;

                if (!query) return true; // Show all if no query (Trending view)

                const username = p.user?.username || (typeof p.user === 'string' ? p.user : '');
                const t = p.title || '';
                const c = p.content || '';
                const cat = p.category || '';
                const tags = p.tags || [];

                const searchStr = `${t} ${c} ${tags.join(' ')} ${cat} ${username}`.toLowerCase();
                return searchStr.includes(query.toLowerCase());
            });

            // Fallback if no results
            if (searchResults.length === 0) {
                setIsFallback(true);
                searchResults = allContent
                    .filter((p: any) => (!isNaughtyMode ? !p.isAdult : true) && p.type !== 'RESOURCE')
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 20);
            }

            // 6. Group Results for specific tabs
            const groups: Record<string, any[]> = {
                shorts: [],
                photos: [],
                videos: [],
                comics: [],
                collection: [],
                posts: specificPostMocks 
            };

            searchResults.forEach((item: any) => {
                if (item.type === 'SHORT') groups.shorts.push(item);
                else if (item.type === 'PHOTO') groups.photos.push(item);
                else if (item.type === 'VIDEO') groups.videos.push(item);
                else if (item.type === 'COMIC') groups.comics.push(item);
                else if (item.type === 'COLLECTION' || item.type === 'PRODUCT') groups.collection.push(item);
            });

            setGroupedResults(groups);
            
            // Set all items for Masonry Grid ("All Results" View)
            setAllItems([...specificPostMocks, ...searchResults]);
            
            setLoading(false);
        };
        
        fetchResults();
    }, [query, isNaughtyMode]);

    const handlePrideToggle = () => {
        if (!query || !query.startsWith('#')) return;
        db.togglePrideTag(query);
        setIsPrided(!isPrided);
    };

    const getActiveList = () => {
        switch(category) {
            case 'shorts': return groupedResults.shorts || [];
            case 'photos': return groupedResults.photos || [];
            case 'videos': return groupedResults.videos || [];
            case 'comics': return groupedResults.comics || [];
            case 'collection': return groupedResults.collection || [];
            case 'posts': return groupedResults.posts || []; 
            case 'everything': return allItems;
            default: return [];
        }
    };
    
    const updateCategory = (cat: string) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('category', cat);
            return newParams;
        });
    };

    return (
        <div className="min-h-screen bg-dark-900 pb-20 overflow-x-hidden">
             <div className="sticky top-0 z-40 bg-dark-950/95 backdrop-blur-md border-b border-white/5">
                 <div className="max-w-[1600px] mx-auto px-6 py-4">
                     <div className="mb-2">
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4 flex-1">
                                <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter shrink-0">
                                    {query ? `Results: ` : 'Discover'}
                                </h1>
                                {/* Search Input Persists and is Editable */}
                                <div className="relative max-w-md w-full">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearchSubmit}
                                        placeholder="Search tags, creators..." 
                                        className="w-full bg-dark-800 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:border-brand-500 outline-none transition-all placeholder:text-gray-600 font-bold"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden md:block">
                                    {loading ? 'Scanning...' : `${getActiveList().length} Items`}
                                </span>
                                
                                {query.startsWith('#') && (
                                    <button 
                                        onClick={handlePrideToggle}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                                            isPrided 
                                            ? 'bg-transparent border border-brand-500 text-brand-500' 
                                            : 'bg-brand-500 text-white hover:bg-brand-600'
                                        }`}
                                    >
                                        {isPrided ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                                        {isPrided ? 'My Pride' : 'Pride Up'}
                                    </button>
                                )}
                            </div>
                         </div>

                         {/* Filter Tabs */}
                         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                            {SEARCH_FILTERS.map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => updateCategory(filter.id)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 border ${
                                        category === filter.id 
                                        ? 'bg-brand-500 text-white border-brand-500 shadow-lg' 
                                        : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white hover:bg-dark-700'
                                    }`}
                                >
                                    <filter.icon size={14} />
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                     </div>
                 </div>
             </div>

             <div className="max-w-[1600px] mx-auto px-6 py-6">
                 {loading ? (
                     <div className="flex justify-center py-20"><Loader2 className={`animate-spin ${accentColor}`} size={40} /></div>
                 ) : (
                     <>
                        <div className="w-full">
                            {isFallback && category === 'everything' && (
                                <div className="mb-8 p-4 bg-dark-800 border border-white/5 rounded-xl text-center">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No exact matches found. Showing suggested content:</p>
                                </div>
                            )}
                            
                            {category === 'posts' ? (
                                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                                     {getActiveList().map((item, index) => (
                                        <div key={`${item.id}-${index}`} className="break-inside-avoid mb-4">
                                            <PostCard 
                                                id={item.id}
                                                type={item.type}
                                                content={item.content}
                                                pollData={item.pollData}
                                                author={item.user}
                                                heat={item.heat}
                                                date={new Date(item.timestamp).toLocaleDateString()}
                                                compact={true}
                                                masonry={true}
                                                hideTags={false} // Ensure tags are shown in search results
                                                tags={item.tags} // Pass tags explicitly if available
                                                onTip={(id) => setSelectedPostId(id)}
                                                onCommentClick={(id) => setSelectedPostId(id)}
                                            />
                                        </div>
                                     ))}
                                </div>
                            ) : (
                                <MasonryGrid 
                                    items={getActiveList()} 
                                    onTip={(id) => setSelectedPostId(id)}
                                    onCommentClick={(id) => setSelectedPostId(id)}
                                    className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 w-full"
                                />
                            )}
                        </div>
                        
                        {!loading && getActiveList().length === 0 && !isFallback && (
                             <div className="text-center py-20 opacity-50">
                                 <SearchIcon size={48} className="mx-auto mb-4 text-gray-600" />
                                 <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                                 <p className="text-sm text-gray-500">Try adjusting your filters</p>
                             </div>
                        )}
                     </>
                 )}
             </div>
        </div>
    );
}
