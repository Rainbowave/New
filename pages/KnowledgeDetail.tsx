
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Clock, MessageCircle, Share2, Facebook, Twitter, Linkedin, 
    Heart, Eye, ChevronUp, ChevronDown, Reply, Gift, Send, MoreHorizontal, 
    TrendingUp, BarChart2, Loader2, PlayCircle, FileText, Lock, CheckCircle
} from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal';
import { api } from '../services/api';
import { db } from '../services/db';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { AdCard } from '../components/ads/AdCard';

interface Comment {
    id: number;
    user: string;
    avatar: string;
    text: string;
    time: string;
    score: number;
    hasVoted?: 'up' | 'down' | null;
}

export default function KnowledgeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // State for interactions
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [commentsModalOpen, setCommentsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);
    
    // Poll State for Article
    const [hasPoll, setHasPoll] = useState(true); 

    // Mock Data
    const resource = {
        title: "Designing a Font From Scratch and Submitting it to Google",
        image: "https://picsum.photos/1200/600?random=res1",
        category: "Design",
        author: "Emma Green",
        authorAvatar: "https://picsum.photos/50/50?random=a1",
        date: "2 days ago",
        readTime: "8 min",
        views: "12.5K",
        likes: "854",
        tags: ['Typography', 'Google Fonts', 'Creative'],
        curriculum: [
            { id: 1, title: "Introduction to Type Design", type: 'video', duration: "5:00", status: 'completed' },
            { id: 2, title: "Sketching Your Ideas", type: 'video', duration: "12:30", status: 'completed' },
            { id: 3, title: "Digitizing in Glyphs App", type: 'video', duration: "45:00", status: 'current' },
            { id: 4, title: "Understanding Kerning Pairs", type: 'article', duration: "10 min", status: 'locked' },
            { id: 5, title: "Exporting & Validation", type: 'video', duration: "15:00", status: 'locked' },
            { id: 6, title: "Google Fonts Submission API", type: 'article', duration: "8 min", status: 'locked' },
        ],
        content: `
            <p class="mb-6 text-lg text-gray-300 font-medium">Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing (leading), and letter-spacing (tracking), and adjusting the space between pairs of letters (kerning).</p>
            
            <h3 class="text-2xl font-black text-white uppercase italic tracking-tight mb-4 mt-8">The Process</h3>
            <p class="mb-6 text-gray-400">Designing a font is a long journey. It starts with sketches, often on paper. You need to define the "DNA" of your typeface. Is it a serif or sans-serif? Is it geometric or humanist? What is the x-height? These decisions will guide every glyph you draw.</p>
            <p class="mb-6 text-gray-400">Once digitizing begins, tools like Glyphs, FontLab, or RoboFont become your best friends. You'll spend hours tweaking Bézier curves to get that perfect curve.</p>
            
            <div class="my-8 border-l-4 border-brand-500 pl-6 py-2 italic text-gray-300 text-xl font-serif">
                "Typeface design is not about drawing letters, it's about drawing the white space between them."
            </div>

            <h3 class="text-2xl font-black text-white uppercase italic tracking-tight mb-4 mt-8">Google Fonts Submission</h3>
            <p class="mb-6 text-gray-400">Submitting to Google Fonts requires adherence to strict technical standards. Your font must be open source (OFL), contain a minimum character set, and pass validation checks using tools like FontBakery.</p>
            <p class="text-gray-400">The reward? Millions of websites potentially using your creation.</p>
        `
    };
    
    // Mock Poll Data
    const pollData = {
        question: "Which font tool do you prefer?",
        options: [
            { id: '1', label: 'Glyphs', votes: 450 },
            { id: '2', label: 'FontLab', votes: 200 },
            { id: '3', label: 'RoboFont', votes: 80 }
        ]
    };

    // Comment State
    const [comments, setComments] = useState<Comment[]>([
        { id: 1, user: "TypeLover99", avatar: "https://picsum.photos/50/50?random=c1", text: "FontLab is definitely harder to learn than Glyphs, but worth it for the python scripting capabilities.", time: "2h ago", score: 45, hasVoted: null },
        { id: 2, user: "DesignHero", avatar: "https://picsum.photos/50/50?random=c2", text: "Great article! I submitted my first font last year.", time: "5h ago", score: 12, hasVoted: null },
        { id: 3, user: "NewbieDev", avatar: "https://picsum.photos/50/50?random=c3", text: "Is there a free alternative to Glyphs?", time: "1d ago", score: 8, hasVoted: null },
        { id: 4, user: "TypographyMaster", avatar: "https://picsum.photos/50/50?random=c4", text: "Don't forget about kerning pairs! Most crucial step.", time: "1d ago", score: 156, hasVoted: 'up' }, 
    ]);
    const [commentInput, setCommentInput] = useState('');

    useEffect(() => {
        const main = document.getElementById('main-content');
        if (main) main.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        setComments(prev => [...prev].sort((a,b) => b.score - a.score));
    }, [id]);

    const handleVote = (id: number, type: 'up' | 'down') => {
        setComments(prev => prev.map(c => {
            if (c.id !== id) return c;
            
            let newScore = c.score;
            let newVote = c.hasVoted;

            if (c.hasVoted === type) {
                newScore = type === 'up' ? c.score - 1 : c.score + 1;
                newVote = null;
            } else if (c.hasVoted) {
                newScore = type === 'up' ? c.score + 2 : c.score - 2;
                newVote = type;
            } else {
                newScore = type === 'up' ? c.score + 1 : c.score - 1;
                newVote = type;
            }
            return { ...c, score: newScore, hasVoted: newVote };
        }).sort((a,b) => b.score - a.score)); 
    };

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput.trim()) return;
        const newComment: Comment = {
            id: Date.now(),
            user: "You",
            avatar: "https://picsum.photos/50/50?random=me",
            text: commentInput,
            time: "Just now",
            score: 0,
            hasVoted: 'up'
        };
        setComments([newComment, ...comments]);
        setCommentInput('');
    };

    // Infinite Scroll for Related Resources
    const fetchRelated = useCallback(async (cursor?: string) => {
        await new Promise(r => setTimeout(r, 600));
        const count = 3; // Reduced to 3 for compact "half size" look
        const nextCursor = cursor ? parseInt(cursor) + count : count;
        
        const items = Array.from({ length: count }).map((_, i) => ({
            id: 9000 + (cursor ? parseInt(cursor) : 0) + i,
            type: 'RESOURCE',
            title: `Design Principle #${(cursor ? parseInt(cursor) : 0) + i + 1}`,
            content: "Deep dive into visual design...",
            thumbnailUrl: `https://picsum.photos/600/400?random=${(cursor ? parseInt(cursor) : 0) + i + 900}`,
            user: { username: "Design_Guru", avatar: "", displayName: "Guru" },
            category: "Design",
            timestamp: Date.now() - (i * 86400000)
        }));

        // No Ad Injection for this compact section to maintain grid integrity
        return { items: items, nextCursor: nextCursor.toString() };
    }, []);

    const { data: relatedResources, loading: relatedLoading } = useInfiniteScroll(fetchRelated);

    return (
        <div className="flex flex-col min-h-screen bg-dark-850 text-[#f4f4f5] font-sans pb-32">
             <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${selectedPostId}`} />
             <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={selectedPostId || 0} />

             {/* Header */}
             <div className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-lg border-b border-white/5 h-16 flex items-center px-8">
                <button 
                    onClick={() => navigate('/knowledge-book')} 
                    className="flex items-center gap-4 text-white hover:text-brand-500 transition-all group"
                >
                    <ArrowLeft size={22} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-lg font-black tracking-tighter uppercase italic">Knowledge Article</span>
                </button>
            </div>

            <div className="max-w-[1200px] mx-auto w-full px-6 py-12">
                
                {/* Title Section */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[900px] mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-[1.1]">
                        {resource.title}
                    </h1>
                </div>

                {/* Main Grid: Curriculum (Left) + Image (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                    
                    {/* Curriculum Sidebar */}
                    <div className="lg:col-span-4 h-fit">
                        <div className="bg-dark-900 border border-white/5 rounded-2xl overflow-hidden sticky top-24">
                            <div className="p-3 border-b border-white/5 bg-dark-950/50">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={12} className="text-brand-500" /> Curriculum
                                </h3>
                            </div>
                            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                {resource.curriculum.map((item, index) => (
                                    <div 
                                        key={item.id} 
                                        className={`p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer group flex items-center gap-3 ${item.status === 'current' ? 'bg-brand-500/10' : ''}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full flex items-center justify-center border shrink-0 ${item.status === 'completed' ? 'bg-green-500 border-green-500 text-black' : item.status === 'current' ? 'border-brand-500 text-brand-500' : 'border-white/20 text-gray-500'}`}>
                                            {item.status === 'completed' ? <CheckCircle size={8} /> : <div className="w-1 h-1 bg-current rounded-full" />}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <h4 className={`text-[10px] font-bold ${item.status === 'current' ? 'text-brand-500' : item.status === 'locked' ? 'text-gray-500' : 'text-white'}`}>
                                                {(index + 1).toString().padStart(2, '0')}. {item.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                {item.type === 'video' ? <PlayCircle size={10} /> : <FileText size={10} />}
                                                {item.status === 'locked' && <Lock size={10} />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="lg:col-span-8">
                        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                            <img src={resource.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={resource.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-60"></div>
                        </div>
                    </div>
                </div>

                {/* User Info & Metadata (Moved Below Image) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-y border-white/5 py-6 mb-12 bg-dark-900/30 px-6 rounded-xl">
                    <div className="flex items-center gap-4">
                        <img src={resource.authorAvatar} className="w-12 h-12 rounded-[5px] border-2 border-brand-500/20" alt={resource.author} />
                        <div>
                            <span className="text-white font-black uppercase tracking-wide block text-sm leading-none mb-1">{resource.author}</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{resource.date}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:gap-8">
                        <div className="flex items-center gap-2">
                             {resource.tags.map(tag => (
                                <span key={tag} className="text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-dark-800 border border-white/5 px-2 py-1 rounded hover:text-white hover:border-brand-500 transition-all cursor-pointer">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                        <div className="flex items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-brand-500"/> {resource.readTime}</span>
                            <span className="flex items-center gap-1.5"><Eye size={14} className="text-brand-500"/> {resource.views}</span>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-p:text-gray-300 prose-p:leading-8 prose-a:text-brand-500 mb-16">
                        <div dangerouslySetInnerHTML={{ __html: resource.content }}></div>
                    </div>
                    
                    {/* Mid-Content Ad Injection */}
                    <div className="mb-16">
                        <AdCard height="h-[250px]" className="w-full rounded-2xl shadow-xl" title="Industry Partner" />
                    </div>

                    {/* Poll Section */}
                    {hasPoll && (
                        <div className="my-12 bg-dark-900 border border-white/5 rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center gap-2 mb-6 text-brand-500 font-black text-xs uppercase tracking-widest">
                                <BarChart2 size={16} /> Interactive Poll
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-6 italic">{pollData.question}</h4>
                            <div className="space-y-4">
                                {pollData.options.map(opt => (
                                    <div key={opt.id} className="relative group cursor-pointer">
                                        <div className="absolute inset-y-0 left-0 bg-brand-900/30 rounded-lg transition-all" style={{ width: `${(opt.votes / 730) * 100}%` }}></div>
                                        <div className="relative p-4 border border-white/5 rounded-lg flex justify-between items-center hover:bg-white/5 transition-colors">
                                            <span className="font-bold text-sm text-white uppercase tracking-wide">{opt.label}</span>
                                            <span className="text-xs font-black text-brand-500">{Math.round((opt.votes / 730) * 100)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                730 Votes • Ends in 2 Days
                            </div>
                        </div>
                    )}

                    {/* Discussion Area */}
                    <div className="mt-20 pt-12 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-10">
                            <MessageCircle size={24} className="text-brand-500" />
                            <h3 className="font-black text-white uppercase tracking-widest text-lg">Discussion ({comments.length})</h3>
                        </div>
                        
                        <form onSubmit={handlePostComment} className="mb-12 flex gap-4">
                            <div className="w-12 h-12 rounded-[5px] bg-brand-600 flex items-center justify-center font-black text-white text-xs shrink-0 border-2 border-dark-900 shadow-lg">YOU</div>
                            <div className="flex-1 relative">
                                <textarea 
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    placeholder="Add to the discussion..." 
                                    className="w-full bg-dark-800 border border-white/10 rounded-xl p-5 text-white text-sm focus:border-brand-500 outline-none resize-none min-h-[120px] shadow-inner font-medium"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!commentInput.trim()}
                                    className="absolute bottom-4 right-4 bg-brand-600 hover:bg-brand-500 text-white p-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                        
                        <div className="space-y-8">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex gap-5 group animate-in slide-in-from-bottom-2 duration-300">
                                    <img src={comment.avatar} className="w-12 h-12 rounded-[5px] border border-white/10 shrink-0 object-cover" alt={comment.user} />
                                    
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-white text-sm uppercase tracking-wide">{comment.user}</span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{comment.time}</span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-300 text-sm leading-relaxed mb-4 font-medium">
                                            {comment.text}
                                        </p>
                                        
                                        <div className="flex items-center gap-6">
                                             <div className="flex items-center bg-dark-900 rounded-lg p-1 border border-white/5">
                                                 <button 
                                                    onClick={() => handleVote(comment.id, 'up')}
                                                    className={`p-1.5 hover:bg-white/10 rounded ${comment.hasVoted === 'up' ? 'text-brand-500' : 'text-gray-400'}`}
                                                >
                                                     <ChevronUp size={16} />
                                                 </button>
                                                 <span className={`text-xs font-black w-8 text-center tabular-nums ${comment.score > 0 ? 'text-brand-500' : comment.score < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                                     {comment.score}
                                                 </span>
                                                 <button 
                                                    onClick={() => handleVote(comment.id, 'down')}
                                                    className={`p-1.5 hover:bg-white/10 rounded ${comment.hasVoted === 'down' ? 'text-red-500' : 'text-gray-400'}`}
                                                >
                                                     <ChevronDown size={16} />
                                                 </button>
                                             </div>
                                             <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                                                 <Reply size={14} /> Reply
                                             </button>
                                             <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-yellow-500 transition-colors uppercase tracking-widest">
                                                 <Gift size={14} /> Tip
                                             </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Knowledge - Compact 3-Card Grid */}
                <div className="mt-24 border-t border-white/[0.03] pt-20">
                     <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3 uppercase italic tracking-tighter">
                        <TrendingUp className="text-brand-500" size={28} /> Related Knowledge
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {relatedResources.map((res) => {
                             // Handle ADs if any (though fetchRelated excludes them for this specific view to maintain layout)
                             if (res.type === 'AD') {
                                 return (
                                     <div key={res.id} className="h-full">
                                         <AdCard height="h-full min-h-[250px]" className="w-full rounded-2xl shadow-xl" title={res.title || "Sponsored"} imageUrl={res.thumbnailUrl} />
                                     </div>
                                 );
                             }
                             
                             return (
                                 <PostCard 
                                    key={res.id}
                                    id={res.id}
                                    type={res.type || "RESOURCE"} 
                                    category={res.category}
                                    imageUrl={res.thumbnailUrl}
                                    content={res.title}
                                    ownerId={res.user?.displayName} 
                                    author={res.user} 
                                    compact={true}
                                    hideTags={true}
                                    hideMoodBadge={true}
                                    imageHeight="h-40" // Half size visual style
                                    onTip={(id) => { setSelectedPostId(id); setTipModalOpen(true); }}
                                    onCommentClick={(id) => { setSelectedPostId(id); setCommentsModalOpen(true); }}
                                 />
                             );
                         })}
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
