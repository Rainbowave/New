
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Trash2, Edit2, Filter, 
    Image as ImageIcon, Video, BookOpen, ShoppingBag, 
    Eye, Heart, MessageCircle,
    Loader2, Megaphone, Plus, CheckSquare, X, FileText,
    BarChart2, Zap, LayoutGrid, Clock, Maximize2, Layers,
    Smartphone, Grid, Clapperboard, Film, Flame, FolderPlus,
    MoreHorizontal
} from 'lucide-react';
import { authService } from '../services/authService';
import { db } from '../services/db';
import { CreatePostModal, PostType } from '../components/CreatePostModal';
import { PromoteModal } from '../components/PromoteModal';
import { EditPostModal } from '../components/EditPostModal';
import { PostCard } from '../components/PostCard';

// Map Site Sections to Post Types for filtering
const SECTION_FILTERS = [
    { label: 'All Content', value: 'ALL', icon: LayoutGrid },
    { label: 'Photos', value: 'PHOTO', icon: ImageIcon },
    { label: 'Videos', value: 'VIDEO', icon: Film },
    { label: 'Shorts', value: 'SHORT', icon: Smartphone },
    { label: 'Comics', value: 'COMIC', icon: BookOpen },
    { label: 'Collection', value: 'COLLECTION', icon: ShoppingBag },
    { label: 'Knowledge', value: 'RESOURCE', icon: FileText },
    { label: 'Live', value: 'LIVE', icon: Clapperboard },
];

export default function ManageContent() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';
    const accentColor = isAdultMode ? 'text-brand-500' : 'text-brand-second';
    
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Creation State
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const [createType, setCreateType] = useState<PostType>('PHOTO');
    
    const [filterType, setFilterType] = useState('ALL');
    
    // Editing State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);

    // Promote Modal State
    const [showPromote, setShowPromote] = useState(false);
    const [promoteTarget, setPromoteTarget] = useState<string | null>(null);

    const fetchPosts = async () => {
        setLoading(true);
        // Simulate API fetch of user's own content
        await new Promise(r => setTimeout(r, 600));
        const userPosts = db.getUserPosts(currentUser?.id || '');
        setPosts(userPosts);
        setLoading(false);
    };

    // Use ID to stabilize dependency and prevent infinite loops
    useEffect(() => {
        fetchPosts();
    }, [currentUser?.id]);

    const handleDelete = (id: number | string) => {
        if(confirm("Are you sure you want to delete this content?")) {
            db.deletePost(id);
            setPosts(prev => prev.filter(p => p.id !== id));
        }
    };

    const handlePromoteClick = (id: string | number) => {
        setPromoteTarget(id.toString());
        setShowPromote(true);
    };

    const handleEditClick = (post: any) => {
        setSelectedPost(post);
        setIsEditOpen(true);
    };

    const filteredPosts = posts.filter(p => filterType === 'ALL' || (filterType === 'COLLECTION' ? (p.type === 'PRODUCT' || p.type === 'COLLECTION') : p.type === filterType));

    if (!currentUser) return null;

    // --- RENDER CREATE MODE (In-Page) ---
    if (viewMode === 'create') {
        return (
            <div className="min-h-screen bg-dark-900 flex flex-col">
                <CreatePostModal 
                    isOpen={true} 
                    onClose={() => setViewMode('list')} 
                    userAvatar={currentUser.avatarUrl}
                    userId={currentUser.id}
                    isPremium={currentUser.isPremium}
                    contentPreference={currentUser.contentPreference} 
                    initialType={createType}
                    variant='page'
                    onSuccess={() => { setViewMode('list'); fetchPosts(); }}
                    userRole={currentUser.role}
                />
            </div>
        );
    }

    // --- RENDER LIST MODE ---
    return (
        <div className="min-h-screen bg-dark-900 pb-24">
             {/* Header */}
            <div className="border-b border-white/5 bg-dark-900/50 backdrop-blur sticky top-0 z-40">
                 <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                                <LayoutGrid size={24} className={accentColor} /> 
                                {isAdultMode ? 'Naughty Studio' : 'Content Studio'}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
                
                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-dark-800 border border-white/5 p-4 rounded-[5px]">
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Content</div>
                        <div className="text-xl md:text-2xl font-black text-white">{posts.length}</div>
                    </div>
                    <div className="bg-dark-800 border border-white/5 p-4 rounded-[5px]">
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Views</div>
                        <div className="text-xl md:text-2xl font-black text-white">{(posts.reduce((acc, p) => acc + (p.views || 0), 0) / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="bg-dark-800 border border-white/5 p-4 rounded-[5px]">
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Heat Generated</div>
                        <div className="text-xl md:text-2xl font-black text-white">{(posts.reduce((acc, p) => acc + (p.heat || 0), 0) / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="bg-dark-800 border border-white/5 p-4 rounded-[5px]">
                         <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Avg Engagement</div>
                         <div className="text-xl md:text-2xl font-black text-brand-500">4.2%</div>
                    </div>
                </div>
                
                {/* Modals for non-creation actions */}
                <PromoteModal 
                    isOpen={showPromote}
                    onClose={() => setShowPromote(false)}
                    mode="post"
                />
                
                <EditPostModal 
                    isOpen={isEditOpen} 
                    onClose={() => setIsEditOpen(false)} 
                    post={selectedPost} 
                    onSave={fetchPosts}
                />

                {/* Content Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                     <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 w-full">
                        {SECTION_FILTERS.map(section => (
                            <button 
                                key={section.value}
                                onClick={() => setFilterType(section.value)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filterType === section.value ? 'bg-white text-black border-white shadow-lg' : 'text-gray-500 hover:text-white bg-dark-800 border-white/5'}`}
                            >
                                <section.icon size={12} /> {section.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid - Recalculated for Mobile (1 col), Tablet (2-3 col), Desktop (4-5 col) */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-500" size={32} /></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            
                            {/* "Create New" Card */}
                            <div 
                                onClick={() => setViewMode('create')}
                                className="bg-brand-600/10 border border-brand-500/20 rounded-[5px] flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-brand-600/20 hover:border-brand-500 transition-all group h-full min-h-[300px] shadow-lg shadow-brand-900/10"
                            >
                                <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl shadow-brand-600/30">
                                    <Plus size={28} className="text-white" />
                                </div>
                                <h3 className="font-black text-white uppercase italic tracking-tighter text-xl mb-1 text-center">New Drop</h3>
                                <p className="text-[9px] font-bold text-brand-200 uppercase tracking-[0.2em] text-center">Upload & Monetize</p>
                            </div>

                            {/* Existing Content Cards */}
                            {filteredPosts.map(post => (
                                <div key={post.id} className="relative group">
                                     <PostCard 
                                        id={post.id}
                                        type={post.type}
                                        category={post.category}
                                        date={new Date(post.timestamp).toLocaleDateString()}
                                        content={post.title || post.content}
                                        imageUrl={post.thumbnailUrl || post.url}
                                        ownerId={post.userId}
                                        author={post.user}
                                        price={post.price}
                                        compact={true}
                                        masonry={true}
                                        isAdult={post.isAdult}
                                        onTip={() => {}} 
                                        onCommentClick={() => {}}
                                    />
                                    
                                    {/* Overlay Manager Controls - Visible on Hover (Desktop) or always accessible if mobile logic added */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-2 z-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(post); }} className="p-2 bg-black/80 backdrop-blur rounded-full text-white hover:bg-brand-500 transition-colors shadow-lg border border-white/10">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handlePromoteClick(post.id); }} className="p-2 bg-black/80 backdrop-blur rounded-full text-white hover:bg-brand-500 transition-colors shadow-lg border border-white/10">
                                            <Megaphone size={14} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }} className="p-2 bg-black/80 backdrop-blur rounded-full text-white hover:bg-red-500 transition-colors shadow-lg border border-white/10">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
