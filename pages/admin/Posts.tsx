
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    FileText, Image as ImageIcon, Video, Search, Filter, 
    MoreVertical, Trash2, Eye, MessageCircle, Heart, Loader2, 
    Star, Plus, BookOpen, ShoppingBag, FolderPlus, X, Edit2,
    ArrowUp, ArrowDown, ChevronsUpDown, BarChart, Clock, Zap, Gamepad2, CheckSquare,
    Users, LayoutGrid, MousePointerClick, Save, ArrowLeft, Smartphone, Clapperboard, Film,
    Flame, BarChart2, Upload, Hash, Trophy
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { db } from '../../services/db';
import { CreatePostModal, PostType } from '../../components/CreatePostModal';
import { authService } from '../../services/authService';

interface ExtendedPost {
    id: number | string;
    type: string;
    title: string;
    content?: string;
    thumbnailUrl?: string;
    userId: string;
    timestamp: number;
    price?: string;
    size?: string;
    heat: number;
    comments: number;
    views: number;
    isTrending: boolean;
    category?: string;
    tags?: string[];
    isAdult?: boolean;
}

// Mini Chart for Time Stats
const TimeConsumptionChart = ({ color }: { color: string }) => {
    const data = [
        { day: 'Mon', val: 24 },
        { day: 'Tue', val: 35 },
        { day: 'Wed', val: 28 },
        { day: 'Thu', val: 45 },
        { day: 'Fri', val: 42 },
        { day: 'Sat', val: 55 },
        { day: 'Sun', val: 48 },
    ];

    return (
        <div className="h-20 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 8, fill: '#71717a'}} interval={0} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '10px' }} 
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: '#ffffff20' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="val" 
                        stroke={color} 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill={`url(#gradient-${color.replace('#', '')})`} 
                        isAnimationActive={true} 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const ContentStatsPanel = ({ posts, type }: { posts: ExtendedPost[], type: string }) => {
    // Calculate Stats
    const totalUploads = posts.length;
    const totalHeat = posts.reduce((acc, p) => acc + (p.heat || 0), 0);
    const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
    // Counts tags specific to the filtered posts passed in props
    const uniqueTags = new Set(posts.flatMap(p => p.tags || [])).size;
    const activeContests = Math.floor(totalUploads * 0.08); // Mock metric based on volume

    const themeColor = useMemo(() => {
        switch(type) {
            case 'VIDEO': return '#ef4444'; // Red
            case 'SHORT': return '#a855f7'; // Purple
            case 'PHOTO': return '#3b82f6'; // Blue
            case 'COMIC': return '#eab308'; // Yellow
            case 'COLLECTION': case 'PRODUCT': return '#f97316'; // Orange
            case 'RESOURCE': return '#06b6d4'; // Cyan
            case 'POST': return '#6b7280'; // Gray
            default: return '#8b5cf6';
        }
    }, [type]);

    const avgTime = useMemo(() => {
        switch(type) {
            case 'VIDEO': return "18m 24s";
            case 'SHORT': return "0m 52s";
            case 'PHOTO': return "0m 12s";
            case 'COMIC': return "6m 15s";
            case 'COLLECTION': case 'PRODUCT': return "2m 30s";
            case 'RESOURCE': return "4m 45s";
            case 'POST': return "1m 10s";
            default: return "3m 20s";
        }
    }, [type]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 animate-in slide-in-from-top-4">
             {/* Uploads */}
             <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl shadow-lg relative overflow-hidden group hover:border-white/10 transition-all">
                 <div className="absolute top-0 right-0 p-8 bg-blue-500/5 rounded-full blur-xl -mr-4 -mt-4 group-hover:bg-blue-500/10 transition-colors"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Upload size={10}/> Total Upload</p>
                 <h3 className="text-2xl font-black text-white">{totalUploads}</h3>
             </div>
             
             {/* Heat */}
             <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl shadow-lg relative overflow-hidden group hover:border-white/10 transition-all">
                 <div className="absolute top-0 right-0 p-8 bg-red-500/5 rounded-full blur-xl -mr-4 -mt-4 group-hover:bg-red-500/10 transition-colors"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Flame size={10} className="text-red-500"/> Engagement Heat</p>
                 <h3 className="text-2xl font-black text-white">{(totalHeat / 1000).toFixed(1)}k</h3>
             </div>

             {/* Visitors */}
             <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl shadow-lg relative overflow-hidden group hover:border-white/10 transition-all">
                 <div className="absolute top-0 right-0 p-8 bg-green-500/5 rounded-full blur-xl -mr-4 -mt-4 group-hover:bg-green-500/10 transition-colors"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Eye size={10} className="text-green-500"/> Visitors</p>
                 <h3 className="text-2xl font-black text-white">{(totalViews / 1000).toFixed(1)}k</h3>
             </div>

             {/* #Tags (Renamed from Topics) */}
             <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl shadow-lg relative overflow-hidden group hover:border-white/10 transition-all">
                 <div className="absolute top-0 right-0 p-8 bg-purple-500/5 rounded-full blur-xl -mr-4 -mt-4 group-hover:bg-purple-500/10 transition-colors"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Hash size={10} className="text-purple-500"/> #Tags</p>
                 <h3 className="text-2xl font-black text-white">{uniqueTags}</h3>
             </div>

             {/* Contest */}
             <div className="bg-dark-800 border border-dark-700 p-5 rounded-xl shadow-lg relative overflow-hidden group hover:border-white/10 transition-all">
                 <div className="absolute top-0 right-0 p-8 bg-yellow-500/5 rounded-full blur-xl -mr-4 -mt-4 group-hover:bg-yellow-500/10 transition-colors"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Trophy size={10} className="text-yellow-500"/> Contest</p>
                 <h3 className="text-2xl font-black text-white">{activeContests}</h3>
             </div>

             {/* Avg Time Consumed Chart */}
             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between group hover:border-white/10 transition-all">
                 <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0 flex items-center gap-1"><Clock size={10}/> Avg Time Consumed (Week)</p>
                    <h3 className="text-lg font-black text-white">{avgTime}</h3>
                 </div>
                 <TimeConsumptionChart color={themeColor} />
             </div>
        </div>
    );
};

export default function AdminPosts() {
    const [searchParams] = useSearchParams();
    const typeFilter = searchParams.get('type') || 'ALL'; 
    const currentUser = authService.getCurrentUser();
    
    const [posts, setPosts] = useState<ExtendedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // Category Filtering
    const [blogCategories, setBlogCategories] = useState<string[]>([]);
    const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
    const [newCategory, setNewCategory] = useState('');
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    
    // Global Mode State (via LocalStorage + Event Listener)
    const [contentMode, setContentMode] = useState<'dating' | 'naughty'>((localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating');
    
    // Sorting
    const [sortConfig, setSortConfig] = useState<{ key: keyof ExtendedPost | 'sizeVal', direction: 'asc' | 'desc' }>({ key: 'timestamp', direction: 'desc' });

    // Mode State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); 
    const [editPost, setEditPost] = useState<ExtendedPost | null>(null);

    const fetchContent = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        
        let allPosts = db.getPosts();
        
        // Filter by Mode (Dating vs Naughty)
        const isAdultMode = contentMode === 'naughty';
        // Relax check to allow admins to see mixed if needed, but default to strict
        allPosts = allPosts.filter((p: any) => !!p.isAdult === isAdultMode);
        
        // Filter based on type param
        if (typeFilter !== 'ALL') {
            if (typeFilter === 'POST') {
                 // Regular posts + Polls often grouped here if generic
                 allPosts = allPosts.filter((p: any) => p.type === 'POST' || p.type === 'TEXT' || p.type === 'POLL');
            } else if (typeFilter === 'PRODUCT' || typeFilter === 'COLLECTION') {
                allPosts = allPosts.filter((p: any) => p.type === 'PRODUCT' || p.type === 'COLLECTION');
            } else {
                allPosts = allPosts.filter((p: any) => p.type === typeFilter);
            }
        }

        const processedPosts = allPosts.map((p: any) => ({
            ...p,
            size: p.size || `${(Math.random() * 500 + 10).toFixed(1)} MB`,
            priceVal: parseFloat(p.price || '0'),
            sizeVal: parseFloat((p.size || '0').split(' ')[0])
        }));

        setPosts(processedPosts);
        
        if (typeFilter === 'RESOURCE') {
            setBlogCategories(db.getBlogCategories());
        }
        
        setLoading(false);
    };

    useEffect(() => {
        const handleModeChange = () => {
            const newMode = localStorage.getItem('admin_view_mode') as 'dating' | 'naughty';
            if (newMode) setContentMode(newMode);
        };
        window.addEventListener('admin-mode-change', handleModeChange);

        fetchContent();
        setActiveCategoryFilter('ALL');
        setIsEditing(false); 
        
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, [typeFilter, contentMode]);

    // Sorting Logic
    const handleSort = (key: keyof ExtendedPost | 'sizeVal' | 'priceVal') => {
        setSortConfig(current => ({
            key: key as any,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedPosts = useMemo(() => {
        let filtered = posts.filter(p => 
            (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
        );

        if (activeCategoryFilter !== 'ALL') {
            filtered = filtered.filter(p => p.category === activeCategoryFilter);
        }

        return filtered.sort((a: any, b: any) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [posts, search, sortConfig, activeCategoryFilter]);

    const handleDelete = (id: number | string) => {
        if (window.confirm("Permanently delete this content? This action cannot be undone.")) {
            db.deletePost(id);
            setPosts(prev => prev.filter(p => p.id !== id));
            db.logAction('admin', 'delete_content', typeFilter, id.toString(), 'Deleted via Admin Console');
            if (isEditing) setIsEditing(false);
        }
    };

    const handleEdit = (post: any) => {
        setEditPost(post);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSaveEdit = () => {
        if (editPost) {
             db.updatePost(editPost.id, editPost);
             setPosts(prev => prev.map(p => p.id === editPost.id ? editPost : p));
             setIsEditing(false);
             setEditPost(null);
             alert("Content updated successfully.");
        }
    };

    const handleToggleTrending = (id: number | string) => {
        const post = posts.find(p => p.id === id);
        if (post) {
            const newVal = !post.isTrending;
            db.updatePost(id, { isTrending: newVal });
            setPosts(prev => prev.map(p => p.id === id ? { ...p, isTrending: newVal } : p));
        }
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            db.addBlogCategory(newCategory.trim());
            setBlogCategories(prev => [...prev, newCategory.trim()]);
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (cat: string) => {
        if (window.confirm(`Delete category "${cat}"?`)) {
            db.removeBlogCategory(cat);
            setBlogCategories(prev => prev.filter(c => c !== cat));
        }
    };

    const getIcon = (type: string) => {
        switch(type) {
            case 'PHOTO': return <ImageIcon size={24} />;
            case 'SHORT': return <Smartphone size={24} />;
            case 'VIDEO': return <Film size={24} />;
            case 'COMIC': return <BookOpen size={24} />;
            case 'RESOURCE': return <FileText size={24} />;
            case 'PRODUCT': case 'COLLECTION': return <ShoppingBag size={24} />;
            case 'GAME': return <Gamepad2 size={24} />;
            case 'LIVE': return <Video size={24} />;
            case 'POLL': return <BarChart2 size={24} />;
            default: return <FileText size={24} />;
        }
    };

    const getTitle = () => {
        switch(typeFilter) {
            case 'RESOURCE': return 'Star Resources';
            case 'VIDEO': return 'Video Library';
            case 'SHORT': return 'Shorts Feed';
            case 'PHOTO': return 'Photo Gallery';
            case 'COMIC': return 'Comic Series';
            case 'PRODUCT': return 'Collections';
            case 'COLLECTION': return 'Collections';
            case 'GAME': return 'Arcade Games';
            case 'LIVE': return 'Live Streams';
            case 'POST': return 'Community Posts & Polls';
            default: return 'All Content';
        }
    };

    const getCreateType = (): PostType | undefined => {
        if (typeFilter === 'RESOURCE') return 'RESOURCE';
        if (typeFilter === 'VIDEO') return 'VIDEO';
        if (typeFilter === 'SHORT') return 'SHORT';
        if (typeFilter === 'PHOTO') return 'PHOTO';
        if (typeFilter === 'COMIC') return 'COMIC';
        if (typeFilter === 'PRODUCT' || typeFilter === 'COLLECTION') return 'COLLECTION';
        if (typeFilter === 'POST') return 'POST';
        return undefined;
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (sortConfig.key !== column) return <ChevronsUpDown size={12} className="text-gray-600" />;
        return sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-brand-500" /> : <ArrowDown size={12} className="text-brand-500" />;
    };

    // --- IN-PAGE EDITOR COMPONENT (Reused) ---
    const PostEditor = () => {
        if (!editPost) return null;
        return (
            <div className="bg-dark-800 border border-brand-500/30 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                     <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                         <Edit2 size={24} className="text-brand-500"/> Edit {editPost.type}
                     </h2>
                     <button onClick={() => setIsEditing(false)} className="p-2 bg-dark-900 rounded-full text-gray-400 hover:text-white">
                         <X size={20}/>
                     </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="space-y-6">
                         <div>
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Title / Headline</label>
                             <input 
                                type="text" 
                                value={editPost.title} 
                                onChange={(e) => setEditPost({...editPost, title: e.target.value})}
                                className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500"
                             />
                         </div>
                         <div>
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Content / Description</label>
                             <textarea 
                                value={editPost.content} 
                                onChange={(e) => setEditPost({...editPost, content: e.target.value})}
                                className="w-full h-48 bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white font-medium outline-none focus:border-brand-500 resize-none"
                             />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Price (LSC)</label>
                                 <input 
                                    type="text" 
                                    value={editPost.price} 
                                    onChange={(e) => setEditPost({...editPost, price: e.target.value})}
                                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500"
                                    placeholder="0.00"
                                 />
                             </div>
                             <div>
                                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Category</label>
                                 <input 
                                    type="text" 
                                    value={editPost.category} 
                                    onChange={(e) => setEditPost({...editPost, category: e.target.value})}
                                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500"
                                 />
                             </div>
                         </div>
                     </div>
                     
                     <div className="space-y-6">
                         <div className="aspect-video bg-dark-900 rounded-xl border border-white/5 overflow-hidden relative group">
                             <img src={editPost.thumbnailUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="Preview" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <span className="bg-black/60 backdrop-blur px-3 py-1 rounded text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">Media Preview</span>
                             </div>
                         </div>
                         
                         <div>
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Tags</label>
                             <div className="flex flex-wrap gap-2 p-3 bg-dark-900 rounded-xl border border-dark-600 min-h-[50px]">
                                 {editPost.tags?.map((tag, i) => (
                                     <span key={i} className="bg-brand-500/10 text-brand-500 px-2 py-1 rounded-lg text-[10px] font-bold uppercase border border-brand-500/20">{tag}</span>
                                 ))}
                                 <input type="text" placeholder="+ Add tag" className="bg-transparent text-white text-xs outline-none w-20" />
                             </div>
                         </div>

                         <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl border border-white/5">
                             <div className="flex items-center gap-2">
                                 <Star size={16} className={editPost.isTrending ? 'text-yellow-500' : 'text-gray-500'} />
                                 <span className="text-xs font-bold text-white uppercase">Trending Status</span>
                             </div>
                             <button 
                                onClick={() => setEditPost({...editPost, isTrending: !editPost.isTrending})}
                                className={`w-10 h-5 rounded-full relative transition-colors ${editPost.isTrending ? 'bg-yellow-500' : 'bg-dark-700'}`}
                             >
                                 <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${editPost.isTrending ? 'left-5.5' : 'left-0.5'}`}></div>
                             </button>
                         </div>
                     </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/5">
                    <button onClick={() => handleDelete(editPost.id)} className="px-6 py-3 rounded-xl bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all">
                         Delete Content
                    </button>
                    <button onClick={handleSaveEdit} className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in">
            <CreatePostModal 
                isOpen={isCreateOpen} 
                onClose={() => setIsCreateOpen(false)} 
                userAvatar={currentUser?.avatarUrl || ''}
                userId={currentUser?.id || 'admin'}
                initialType={getCreateType()}
                userRole='admin'
                onSuccess={() => { setIsCreateOpen(false); fetchContent(); }}
            />

            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div className="flex items-center gap-4">
                    {isEditing ? (
                        <button onClick={() => setIsEditing(false)} className="p-3 bg-dark-800 rounded-xl border border-white/5 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                    ) : (
                        <div className="p-3 bg-brand-500/10 rounded-xl text-brand-500 border border-brand-500/20">
                            {getIcon(typeFilter === 'ALL' ? 'RESOURCE' : typeFilter)}
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-black text-white mb-1 capitalize">
                            {isEditing ? 'Editor Mode' : getTitle()}
                        </h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                            {isEditing ? 'Modify details and settings.' : `Manage ${typeFilter === 'ALL' ? 'global' : typeFilter.toLowerCase()} content.`}
                        </p>
                    </div>
                </div>
                
                {!isEditing && (
                    <div className="flex gap-2">
                         <div className="flex bg-dark-900 p-1 rounded-lg border border-dark-600 px-3 items-center">
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-2">Context:</span>
                             <span className={`text-[10px] font-black uppercase tracking-widest ${contentMode === 'dating' ? 'text-brand-second' : 'text-brand-500'}`}>
                                 {contentMode}
                             </span>
                         </div>

                        {typeFilter === 'RESOURCE' && (
                            <button 
                                onClick={() => setShowCategoryManager(!showCategoryManager)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${showCategoryManager ? 'bg-white text-black' : 'bg-dark-800 text-gray-400 hover:text-white border border-white/5'}`}
                            >
                                <FolderPlus size={16} /> Manage Sections
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            {/* NEW STATS PANEL ABOVE SEARCH BAR */}
            {!isEditing && posts.length > 0 && (
                <ContentStatsPanel posts={posts} type={typeFilter} />
            )}

            {/* --- EDITOR OR TABLE VIEW --- */}
            {isEditing ? (
                <PostEditor />
            ) : (
                <>
                    {/* Category Manager (Resources) */}
                    {showCategoryManager && typeFilter === 'RESOURCE' && (
                        <div className="bg-dark-800 border border-dark-600 p-6 rounded-2xl mb-8 animate-in slide-in-from-top-4">
                            <h3 className="font-bold text-white text-sm uppercase mb-4 flex items-center gap-2"><FolderPlus size={16} className="text-brand-500"/> Star Resource Sections</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {blogCategories.map(cat => (
                                    <div key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-dark-900 border border-white/10 rounded-lg text-xs font-bold text-gray-300">
                                        {cat}
                                        <button onClick={() => handleRemoveCategory(cat)} className="hover:text-red-500"><X size={12}/></button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 max-w-sm">
                                <input 
                                    type="text" 
                                    value={newCategory} 
                                    onChange={(e) => setNewCategory(e.target.value)} 
                                    placeholder="New Section Name" 
                                    className="flex-1 bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white text-xs focus:border-brand-500 outline-none"
                                />
                                <button onClick={handleAddCategory} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold">Add</button>
                            </div>
                        </div>
                    )}
                    
                    {/* Filters & Search */}
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" size={18} />
                                <input 
                                    type="text" 
                                    placeholder={`Search ${getTitle().toLowerCase()}...`}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-dark-900 text-white text-sm font-bold w-full rounded-xl py-3 pl-12 pr-4 outline-none border border-white/5 focus:border-brand-500 placeholder:text-gray-600 transition-colors"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-dark-900 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors" title="Filter">
                                    <Filter size={18} />
                                </button>
                            </div>
                        </div>

                        {typeFilter === 'RESOURCE' && (
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => setActiveCategoryFilter('ALL')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategoryFilter === 'ALL' ? 'bg-brand-500 text-white border-brand-500' : 'bg-dark-900 text-gray-500 border-white/5'}`}>All Sections</button>
                                {blogCategories.map(cat => (
                                    <button key={cat} onClick={() => setActiveCategoryFilter(cat)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategoryFilter === cat ? 'bg-brand-500 text-white border-brand-500' : 'bg-dark-900 text-gray-500 border-white/5'}`}>{cat}</button>
                                ))}
                            </div>
                        )}

                        {/* Table */}
                        <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden min-h-[400px]">
                            {loading ? (
                                <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-500" size={40} /></div>
                            ) : sortedPosts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-center opacity-50">
                                    <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-4 text-gray-500 border border-white/5">
                                        {getIcon(typeFilter)}
                                    </div>
                                    <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">No Content Found</h3>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Try switching mode or filters</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-dark-800 text-[10px] text-gray-500 uppercase font-black tracking-widest border-b border-dark-700">
                                        <tr>
                                            <th className="px-6 py-4 cursor-pointer hover:text-white group" onClick={() => handleSort('title')}>
                                                <div className="flex items-center gap-1">Content Asset <SortIcon column="title" /></div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer hover:text-white group" onClick={() => handleSort('priceVal')}>
                                                <div className="flex items-center gap-1">Price <SortIcon column="priceVal" /></div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer hover:text-white group" onClick={() => handleSort('timestamp')}>
                                                <div className="flex items-center gap-1">Metadata <SortIcon column="timestamp" /></div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer hover:text-white group" onClick={() => handleSort('heat')}>
                                                <div className="flex items-center gap-1">Engagement <SortIcon column="heat" /></div>
                                            </th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-700">
                                        {sortedPosts.map((post, idx) => (
                                            <tr key={idx} className="hover:bg-dark-800/50 transition-colors group">
                                                <td className="px-6 py-4 w-72">
                                                    <div className="flex gap-4 items-center">
                                                        <div className="w-12 h-12 bg-black rounded-lg overflow-hidden border border-white/10 relative shrink-0">
                                                            {post.thumbnailUrl ? (
                                                                <img src={post.thumbnailUrl} className="w-full h-full object-cover" alt="Post" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-600">{getIcon(post.type)}</div>
                                                            )}
                                                            {post.isTrending && (
                                                                <div className="absolute top-0.5 right-0.5 bg-yellow-500 text-black p-0.5 rounded shadow">
                                                                    <Star size={8} fill="currentColor" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-white text-sm line-clamp-1 mb-0.5 hover:text-brand-500 cursor-pointer" onClick={() => handleEdit(post)}>{post.title || 'Untitled'}</div>
                                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                                                {post.type} {post.category && `• ${post.category}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {post.price ? (
                                                        <div className="text-xs text-green-400 font-black tabular-nums">{post.price} LSC</div>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-600 font-bold uppercase">Free</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-xs text-gray-300 font-bold mb-0.5">@{post.userId}</div>
                                                    <div className="text-[9px] text-gray-500 font-mono">{new Date(post.timestamp).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
                                                        <span className="flex items-center gap-1" title="Heat"><Heart size={12} className="text-red-500"/> {post.heat || 0}</span>
                                                        <span className="flex items-center gap-1" title="Comments"><MessageCircle size={12}/> {post.comments || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleToggleTrending(post.id)}
                                                            className={`p-1.5 rounded-lg transition-colors ${post.isTrending ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'text-gray-400 hover:text-yellow-500 hover:bg-dark-700'}`}
                                                            title={post.isTrending ? "Remove Trending" : "Make Trending"}
                                                        >
                                                            <Star size={14} fill={post.isTrending ? "currentColor" : "none"} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleEdit(post)} 
                                                            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" 
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14}/>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(post.id)} 
                                                            className="p-1.5 hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors" 
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14}/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
