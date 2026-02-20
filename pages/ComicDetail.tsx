
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Star, BookOpen, TrendingUp, ChevronDown, Edit2, Loader2 } from 'lucide-react';
import { PostCard } from '../components/PostCard'; 
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal';
import { AdCard } from '../components/ads/AdCard';
import { DiscussionSection } from '../components/comments/DiscussionSection';
import { authService } from '../services/authService';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { db } from '../services/db';

// Mock Data
const mockComicData = {
    id: 1,
    title: "Absolute Batman #1",
    series: "Absolute Batman",
    description: "Without the mansion... without the money... without the butler... what's left is the Absolute Dark Knight! Witness the beginning of a new legend in this groundbreaking series.",
    cover: "https://picsum.photos/600/900?random=1",
    rating: 4.8,
    votes: 1240,
    metadata: {
        categories: ['Superhero', 'Action', 'Dark', 'Noir', 'Detective'],
        artists: ['Nick Dragotta'],
        groups: ['DC Comics', 'Black Label'],
        parodies: [],
        pages: 32
    },
    chapters: [
        { id: 101, number: 1, title: "The Fall", date: "Oct 24, 2024", pages: 32, isRead: true },
        { id: 102, number: 2, title: "The Rise", date: "Nov 10, 2024", pages: 28, isRead: false },
        { id: 103, number: 3, title: "The Knight", date: "Nov 24, 2024", pages: 30, isRead: false },
        { id: 104, number: 4, title: "Shadows", date: "Dec 08, 2024", pages: 31, isRead: false },
        { id: 105, number: 5, title: "Vengeance", date: "Dec 22, 2024", pages: 29, isRead: false },
    ]
};

const mockComments = [
    { id: 1, user: 'ComicFan99', avatar: 'https://picsum.photos/50/50?random=10', text: 'This art style is absolutely insane! The noir vibes are perfect.', time: '2h ago', score: 24 },
    { id: 2, user: 'BatLover', avatar: 'https://picsum.photos/50/50?random=11', text: 'Finally a fresh take on the origin story. Can\'t wait for chapter 2.', time: '5h ago', score: 12 },
    { id: 3, user: 'ReaderX', avatar: 'https://picsum.photos/50/50?random=12', text: 'Does anyone know when the next volume drops?', time: '1d ago', score: 5 },
];

export default function ComicDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Removed ref here to let hook find the main scroll container
    // const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [commentsModalOpen, setCommentsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        // Scroll main content to top on navigation
        const main = document.getElementById('main-content');
        if (main) main.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        
        setTimeout(() => setLoading(false), 500);
    }, []);

    // Infinite Scroll for Related Comics
    const fetchRelated = useCallback(async (cursor?: string) => {
        await new Promise(r => setTimeout(r, 600));
        const count = 12;
        const nextCursor = cursor ? parseInt(cursor) + count : count;
        
        const items = Array.from({ length: count }).map((_, i) => ({
            id: 8000 + (cursor ? parseInt(cursor) : 0) + i,
            title: `Related Comic Series ${(cursor ? parseInt(cursor) : 0) + i + 1}`,
            subtitle: "DC Comics",
            thumbnailUrl: `https://picsum.photos/300/450?random=${(cursor ? parseInt(cursor) : 0) + i + 20}`,
            stats: "15K Likes",
            type: 'COMIC',
            isAdult: false
        }));

        // Inject Ads using "exploreMore" context to link with Admin Dashboard Preference
        const injectedItems = db.injectContent(items, 'exploreMore');
        
        return { items: injectedItems, nextCursor: nextCursor.toString() };
    }, []);

    // No ref passed = hook uses #main-content automatically
    const { data: relatedComics, loading: relatedLoading } = useInfiniteScroll(fetchRelated);

    if (loading) return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent text-white font-sans relative">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${selectedPostId}`} />
            <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={selectedPostId || 0} />

            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12">
                
                {/* Navigation & Actions */}
                <div className="flex justify-between items-center mb-8">
                    <button 
                        onClick={() => navigate('/comics')} 
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-white/5 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/10"
                    >
                        <ArrowLeft size={20} /> <span className="font-bold text-sm">Back to Comics</span>
                    </button>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsLiked(!isLiked)}
                            className={`p-3 rounded-full backdrop-blur-md transition-all ${isLiked ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'}`}
                        >
                            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                        </button>
                        <button className="p-3 rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white backdrop-blur-md transition-colors">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row gap-12 mb-16">
                    {/* Left: Cover Art (Reduced Size per request) */}
                    <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-6">
                        <div className="relative group rounded-xl shadow-2xl shadow-black/50 overflow-hidden aspect-[2/3]">
                            <img 
                                src={mockComicData.cover} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                                alt="Cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <button onClick={() => navigate(`/comics/read/${id}`)} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                                    <BookOpen size={20} /> Start Reading
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/5 divide-x divide-white/10">
                            <div className="text-center px-2">
                                <div className="text-2xl font-black text-yellow-500 flex items-center justify-center gap-1">
                                    4.8 <Star size={16} fill="currentColor" />
                                </div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Rating</div>
                            </div>
                            <div className="text-center px-2">
                                <div className="text-2xl font-black text-white">1.2K</div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Votes</div>
                            </div>
                            <div className="text-center px-2">
                                <div className="text-2xl font-black text-white">{mockComicData.chapters.length}</div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Chapters</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info & Chapters */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
                                {mockComicData.title}
                            </h1>
                            <p className="text-lg text-gray-300 leading-relaxed mb-6 font-light border-l-4 border-brand-500 pl-4">
                                {mockComicData.description}
                            </p>
                            
                            <div className="space-y-3 bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-sm mb-8">
                                <div className="flex flex-wrap items-baseline gap-2">
                                    <span className="text-sm font-bold text-gray-400 w-24">Categories:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {mockComicData.metadata.categories.map(tag => (
                                            <span key={tag} className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-md transition-colors cursor-pointer border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-baseline gap-2">
                                    <span className="text-sm font-bold text-gray-400 w-24">Artists:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {mockComicData.metadata.artists.map(artist => (
                                            <span key={artist} className="bg-brand-900/30 text-brand-300 hover:bg-brand-900/50 text-xs font-bold px-3 py-1 rounded-md transition-colors cursor-pointer border border-brand-500/20">
                                                {artist}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chapters List */}
                        <div className="border border-white/10 rounded-xl bg-[#0f0e10] overflow-hidden mb-8 shadow-2xl shadow-black/50">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#131214]">
                                <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                                    Chapters
                                </h3>
                                <div className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer hover:text-white transition-colors uppercase font-bold tracking-wider">
                                    Sort: Oldest <ChevronDown size={12} />
                                </div>
                            </div>
                            
                            <div className="flex flex-col">
                                {mockComicData.chapters.map(chapter => (
                                    <div 
                                        key={chapter.id} 
                                        className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-all group cursor-pointer"
                                        onClick={() => navigate(`/comics/read/${id}`)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 text-sm font-bold">Chapter {chapter.number}</span>
                                                <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">Vol. 1</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center text-[10px] font-bold text-blue-400 border border-blue-500/30">
                                                    Ep
                                                </div>
                                                <span className="font-bold text-white text-sm group-hover:text-brand-400 transition-colors">{chapter.title}</span>
                                            </div>
                                        </div>
                                        
                                        <button className="px-6 py-2 bg-[#1a191c] hover:bg-white text-white hover:text-black border border-white/10 hover:border-white font-bold rounded-lg text-sm transition-all shadow-lg min-w-[120px]">
                                            Read
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Banner Ad after Chapters */}
                        <div className="mb-12 flex justify-center">
                             <AdCard height="h-[90px]" className="w-[724px] rounded-xl" title="Series Sponsor" />
                        </div>
                    </div>
                </div>

                {/* Bottom: Comments + Ad Sidebar */}
                <div className="border-t border-white/10 pt-12 mb-20 flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 min-w-0">
                        {/* Discussion Section Reused from PostDetail */}
                        <DiscussionSection initialComments={mockComments} title="Series Discussion" />
                    </div>
                    
                    {/* Comment Sidebar Ad - Standardized Style */}
                    <div className="w-full lg:w-[500px] shrink-0">
                        <AdCard height="h-[600px]" className="w-full lg:w-[500px] rounded-xl shadow-xl sticky top-24" title="Featured Partner" />
                    </div>
                </div>

                {/* Explore More - Standardized 6-Col Grid with Infinite Scroll */}
                <div className="border-t border-white/10 pt-12">
                     <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-2 uppercase italic tracking-tighter">
                        <TrendingUp className="text-brand-500" /> More Like This
                     </h3>
                     <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                         {relatedComics.map((comic) => (
                             <PostCard 
                                key={comic.id}
                                id={comic.id}
                                type="COMIC"
                                imageUrl={comic.thumbnailUrl}
                                content={comic.title}
                                ownerId={comic.subtitle}
                                compact={true}
                                hideTags={true}
                                onTip={(id) => { setSelectedPostId(id); setTipModalOpen(true); }}
                                onCommentClick={(id) => { setSelectedPostId(id); setCommentsModalOpen(true); }}
                             />
                         ))}
                     </div>
                     {relatedLoading && (
                         <div className="py-12 flex justify-center">
                             <Loader2 className="animate-spin text-brand-500" size={24} />
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
}
