
import React, { useState, useEffect } from 'react';
import { 
    Heart, Lock, Users, Hash, BarChart2, ShieldCheck, 
    MessageCircle, ArrowRight, Activity, Plus, ChevronLeft,
    Image as ImageIcon, MoreHorizontal, Sparkles, ChevronDown,
    Filter, LayoutGrid, Shield, CheckCircle, Send, Crown, Circle,
    Globe, Search, UserPlus, Info, Flame, Eye, SortAsc, Trophy, Coins, FileText, Megaphone, Play,
    Palette, Gamepad2, Calendar, ShoppingBag, Coffee, MapPin, Clock, Calendar as CalendarIcon,
    AlertCircle, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { PostCard } from '../components/PostCard';
import { DiscussionSection } from '../components/comments/DiscussionSection';
import { SubscriptionModal } from '../components/SubscriptionModal'; 
import { authService } from '../services/authService';

const GroupCard = ({ id, name, members, image, isPrivate, onClick, isJoined }: any) => (
    <div 
        onClick={onClick}
        className={`bg-dark-800 border border-white/5 rounded-lg p-3 flex items-center gap-4 cursor-pointer group hover:border-brand-500/30 transition-all ${isJoined ? 'border-brand-500/30 bg-brand-900/10' : ''}`}
    >
        <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-brand-500 to-purple-600 shrink-0">
            <img src={image} className="w-full h-full rounded-full object-cover border-2 border-dark-900" alt={name} />
            {isPrivate && (
                <div className="absolute -bottom-1 -right-1 bg-dark-900 rounded-full p-1 border border-white/10">
                    <Lock size={8} className="text-gray-400" />
                </div>
            )}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-sm truncate">{name}</h4>
            <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">
                <Users size={10} /> {members.toLocaleString()}
            </div>
        </div>
        {isJoined && <CheckCircle size={14} className="text-brand-500" />}
    </div>
);

// --- NEW GROUP DETAIL VIEW ---

const GroupDetailView = ({ group, onClose }: { group: any, onClose: () => void }) => {
    const navigate = useNavigate();
    const [sort, setSort] = useState('Newest');
    const [isJoined, setIsJoined] = useState(false);
    const [activeTab, setActiveTab] = useState('Group Feed');
    
    // Generate Mock Posts for Group Feed
    const groupPosts = Array.from({ length: 24 }).map((_, i) => ({
        id: i + 2000,
        type: ['PHOTO', 'POST', 'VIDEO'][i % 3],
        content: `Community update ${i+1}: Sharing some thoughts on today's topic.`,
        thumbnailUrl: i % 3 !== 1 ? `https://picsum.photos/400/600?random=gp_${i}` : undefined,
        user: { username: `Member_${i}`, avatar: `https://picsum.photos/50/50?random=u${i}` },
        heat: Math.floor(Math.random() * 500),
        comments: 12,
        timestamp: Date.now() - i * 3600000,
        isAdult: true 
    }));

    // Generate Mock Events
    const groupEvents = [
        { id: 1, title: 'Weekly Mixer', date: 'Fri, Oct 28', time: '8:00 PM', location: 'Voice Lounge', host: 'Admin_Sarah', description: 'Join us for our weekly community hangout and chat.' },
        { id: 2, title: 'Art Showcase', date: 'Sat, Oct 29', time: '2:00 PM', location: 'Gallery Channel', host: 'Mod_Art', description: 'Show off your latest creations and get feedback.' },
        { id: 3, title: 'Movie Night', date: 'Sun, Oct 30', time: '9:00 PM', location: 'Stream Room', host: 'CinemaBot', description: 'Watching: Cyberpunk Edgerunners (Ep 1-3).' },
    ];

    const handleJoin = () => {
        setIsJoined(!isJoined);
    };
    
    const handlePostClick = (postId: number) => {
        // Link to PhotoDetail layout as requested for intimacy content
        navigate(`/photo/${postId}?layout=intimacy`);
    };

    return (
        <div className="animate-in fade-in zoom-in-95 duration-300 w-full">
            {/* 1. Header Banner */}
            <div className="relative h-[320px] rounded-xl overflow-hidden group w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                <img src={group.image} className="w-full h-full object-cover" alt="Banner" />
                
                {/* Back Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-6 left-6 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md p-2 rounded-full text-white transition-colors border border-white/10"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Group Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-wrap items-end justify-between gap-6">
                    <div className="flex items-end gap-6">
                        <div className="w-32 h-32 rounded-xl border-4 border-dark-900 overflow-hidden shadow-2xl relative bg-dark-800">
                            <img src={group.image} className="w-full h-full object-cover" alt="Avatar" />
                        </div>
                        <div className="mb-2">
                            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">{group.name}</h1>
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-300">
                                <span className="flex items-center gap-1"><Users size={14} className="text-brand-500" /> {group.members.toLocaleString()} Members</span>
                                <span className="flex items-center gap-1"><Activity size={14} className="text-green-500" /> Very Active</span>
                                {group.isPrivate && <span className="flex items-center gap-1"><Lock size={14} className="text-yellow-500" /> Private</span>}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleJoin}
                        className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg transition-all ${isJoined ? 'bg-dark-800 text-white border border-white/20' : 'bg-white text-black hover:bg-brand-500 hover:text-white'}`}
                    >
                        {isJoined ? 'Joined' : 'Join Circle'}
                    </button>
                </div>
            </div>

            {/* 2. Feed & Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
                
                {/* Left: Main Content (3 Cols) */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                         <div className="flex gap-4">
                             {['Group Feed', 'Events', 'Circle Info'].map(tab => (
                                 <button 
                                    key={tab} 
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-colors ${activeTab === tab ? 'text-brand-500 border-brand-500' : 'text-gray-500 border-transparent hover:text-white'}`}
                                 >
                                     {tab}
                                 </button>
                             ))}
                         </div>
                         {activeTab === 'Group Feed' && (
                             <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                 Sort by <span className="text-white flex items-center gap-1 cursor-pointer">{sort} <ChevronDown size={12}/></span>
                             </div>
                         )}
                    </div>

                    {/* Content Views */}
                    {activeTab === 'Group Feed' && (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {groupPosts.map((post: any) => (
                                <div 
                                    key={post.id} 
                                    onClick={() => handlePostClick(post.id)}
                                    className="cursor-pointer hover:opacity-90 transition-opacity"
                                >
                                    <PostCard 
                                        id={post.id}
                                        type={post.type}
                                        content={post.content}
                                        imageUrl={post.thumbnailUrl}
                                        author={post.user}
                                        compact={true}
                                        hideTags={true}
                                        hideMoodBadge={true}
                                        imageHeight="h-28" // Even smaller than previous
                                        isAdult={true}
                                        onTip={() => {}}
                                        onCommentClick={() => {}}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'Events' && (
                        <div className="space-y-6">
                            {/* Moderator Tools Section */}
                            <div className="bg-dark-800 border border-brand-500/20 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-500/10 rounded-lg text-brand-500">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Moderator Actions</h4>
                                        <p className="text-[10px] text-gray-500">Manage community calendar</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2">
                                    <Plus size={12} /> Post Event
                                </button>
                            </div>

                            {/* Events List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {groupEvents.map(event => (
                                    <div key={event.id} className="bg-dark-800 border border-white/5 rounded-xl p-5 hover:border-brand-500/30 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-dark-900 border border-white/5 rounded-lg px-3 py-2 text-center min-w-[60px]">
                                                <span className="block text-[10px] font-black text-red-500 uppercase tracking-widest">{event.date.split(',')[0]}</span>
                                                <span className="block text-lg font-black text-white">{event.date.split(' ')[2]}</span>
                                            </div>
                                            <button className="text-gray-500 hover:text-white"><MoreHorizontal size={16}/></button>
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-brand-500 transition-colors">{event.title}</h4>
                                        <div className="space-y-2 text-xs text-gray-400 mb-4">
                                            <div className="flex items-center gap-2"><Clock size={14} className="text-brand-500"/> {event.time}</div>
                                            <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-500"/> {event.location}</div>
                                            <div className="flex items-center gap-2"><User size={14} className="text-purple-500"/> Hosted by {event.host}</div>
                                        </div>
                                        <p className="text-xs text-gray-500 italic border-l-2 border-white/10 pl-3 mb-4">{event.description}</p>
                                        <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                            RSVP Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Circle Info' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                             <div className="bg-dark-800 border border-white/5 rounded-xl p-8">
                                 <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-4 flex items-center gap-2">
                                     <Info size={18} className="text-brand-500"/> Circle Manifesto
                                 </h3>
                                 <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                                     Welcome to the {group.name}. This space is dedicated to open expression, mutual respect, and connecting with like-minded individuals. We encourage sharing art, thoughts, and experiences that align with our core values.
                                 </p>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div>
                                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Community Identity</h4>
                                         <div className="flex flex-wrap gap-2">
                                             {['LGBTQ+', 'Safe Space', 'Dating', 'Naughty', 'Verified', '18+'].map(tag => (
                                                 <span key={tag} className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded text-[10px] font-black uppercase tracking-widest">
                                                     {tag}
                                                 </span>
                                             ))}
                                         </div>
                                     </div>
                                     <div>
                                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Vibe Check</h4>
                                         <div className="flex flex-wrap gap-2">
                                             {['Chill', 'Supportive', 'Creative', 'Respectful'].map(tag => (
                                                 <span key={tag} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-[10px] font-black uppercase tracking-widest">
                                                     {tag}
                                                 </span>
                                             ))}
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="bg-dark-800 border border-white/5 rounded-xl p-6">
                                     <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                         <Shield size={16} className="text-green-500"/> Guardians (Admins)
                                     </h3>
                                     <div className="space-y-3">
                                         {[1, 2, 3].map(i => (
                                             <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                                 <img src={`https://picsum.photos/50/50?random=admin${i}`} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                                                 <div>
                                                     <div className="text-xs font-bold text-white">Admin_User_{i}</div>
                                                     <div className="text-[9px] text-gray-500 uppercase tracking-wider">Circle Leader</div>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                                 
                                 <div className="bg-dark-800 border border-white/5 rounded-xl p-6">
                                     <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                         <AlertCircle size={16} className="text-red-500"/> Rules
                                     </h3>
                                     <ul className="space-y-3 text-xs text-gray-400 font-medium">
                                         <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div> No harassment or hate speech.</li>
                                         <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div> Respect privacy and consent.</li>
                                         <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div> No spam or self-promotion without approval.</li>
                                         <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div> Keep content relevant to the circle theme.</li>
                                     </ul>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Right: Info Sidebar (1 Col) - Simplified */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-dark-800 border border-white/5 rounded-xl p-6 sticky top-24">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">Quick Stats</h4>
                        <div className="space-y-4">
                             <div className="flex justify-between items-center text-xs">
                                 <span className="text-gray-500">Established</span>
                                 <span className="text-white font-bold">Oct 2024</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                                 <span className="text-gray-500">Access</span>
                                 <span className="text-yellow-500 font-bold uppercase">{group.isPrivate ? 'Private' : 'Public'}</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                                 <span className="text-gray-500">Posts Today</span>
                                 <span className="text-green-500 font-bold">+124</span>
                             </div>
                        </div>
                        <div className="h-px bg-white/5 my-6"></div>
                        <button className="w-full py-3 rounded-lg bg-white text-black hover:bg-brand-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all">
                            Invite Friends
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Intimacy() {
    const navigate = useNavigate();
    const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
    const [filter, setFilter] = useState('All');
    
    // Generate Groups
    const groups = Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        name: `Sanctuary Circle ${i+1}`,
        members: Math.floor(Math.random() * 5000) + 100,
        image: `https://picsum.photos/200/200?random=group_${i}`,
        isPrivate: i % 3 === 0,
        category: ['Social', 'Art', 'Support', 'Events', 'Makeup', 'Fashion', 'Lifestyle'][i % 7]
    }));

    const filteredGroups = groups.filter(g => filter === 'All' || g.category === filter);

    // Circle Categories Data
    const categoryStats = [
        { id: 'All', label: 'All Circles', members: '850K', icon: Globe, color: 'from-blue-400 to-indigo-500' },
        { id: 'Social', label: 'Social', members: '240K', icon: MessageCircle, color: 'from-pink-500 to-rose-500' },
        { id: 'Art', label: 'Art', members: '95K', icon: Palette, color: 'from-purple-500 to-violet-500' },
        { id: 'Support', label: 'Support', members: '45K', icon: Heart, color: 'from-red-500 to-orange-500' },
        { id: 'Events', label: 'Events', members: '28K', icon: Calendar, color: 'from-yellow-400 to-amber-500' },
        { id: 'Makeup', label: 'Makeup', members: '62K', icon: Sparkles, color: 'from-fuchsia-400 to-pink-400' },
        { id: 'Fashion', label: 'Fashion', members: '88K', icon: ShoppingBag, color: 'from-emerald-400 to-teal-500' },
        { id: 'Lifestyle', label: 'Lifestyle', members: '110K', icon: Coffee, color: 'from-orange-400 to-amber-500' },
    ];

    // Active Tag Contests
    const activeContests = [
        {
            id: 1,
            title: 'Deep Connections',
            rewardPool: 2500,
            hashtag: '#IntimacyChallenge',
            bg: 'from-purple-600 to-blue-600'
        },
        {
            id: 2,
            title: 'Circle Vibes',
            rewardPool: 1500,
            hashtag: '#CircleVibes',
            bg: 'from-pink-600 to-rose-600'
        },
        {
            id: 3,
            title: 'Safe Space Stories',
            rewardPool: 1000,
            hashtag: '#SafeSpace',
            bg: 'from-emerald-600 to-teal-600'
        },
        {
            id: 4,
            title: 'Night Owls',
            rewardPool: 500,
            hashtag: '#LateNight',
            bg: 'from-orange-600 to-red-600'
        }
    ];

    return (
        <div className="min-h-screen bg-dark-900 pb-20">
            {selectedGroup ? (
                <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
                    <GroupDetailView group={selectedGroup} onClose={() => setSelectedGroup(null)} />
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-brand-500/10 rounded-lg text-brand-500">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Intimacy Circles</h1>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Safe spaces for deeper connection</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => navigate('/intimacy/create')}
                                className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                            >
                                <Plus size={14} /> Create Circle
                            </button>
                        </div>
                    </div>

                    <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-10">
                        
                        {/* Circle Category Bar */}
                        <div className="overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 md:mx-0 md:px-0">
                            <div className="flex gap-6 min-w-max">
                                {categoryStats.map(cat => {
                                    const isActive = filter === cat.id;
                                    return (
                                        <button 
                                            key={cat.id} 
                                            onClick={() => setFilter(cat.id)}
                                            className="flex flex-col items-center gap-3 group min-w-[80px]"
                                        >
                                            <div className={`p-[2px] rounded-full bg-gradient-to-tr ${isActive ? cat.color : 'from-dark-700 to-dark-800 group-hover:from-dark-600 group-hover:to-dark-700'} transition-all`}>
                                                <div className="w-16 h-16 rounded-full bg-dark-900 flex items-center justify-center border-4 border-dark-900 relative shadow-lg">
                                                     <cat.icon size={22} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'} />
                                                     {isActive && <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <span className={`block text-[10px] font-black uppercase tracking-wider mb-0.5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{cat.label}</span>
                                                <span className="block text-[9px] font-bold text-gray-600 tabular-nums">{cat.members}</span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Active Tag Contests Container Bar */}
                        <div className="mb-6 border-t border-b border-white/5 py-8">
                            <div className="flex items-center gap-2 mb-6 px-1">
                                <Trophy size={18} className="text-yellow-500" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Tag Contests</h3>
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {activeContests.map((contest) => (
                                    <div 
                                        key={contest.id}
                                        className="min-w-[240px] bg-dark-800 border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-white/20 transition-all shadow-lg"
                                        onClick={() => navigate(`/tags/${contest.hashtag.replace('#', '')}`)}
                                    >
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${contest.bg} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-white">
                                                    <Hash size={16} />
                                                </div>
                                                <span className="text-[10px] font-black bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded border border-yellow-500/20">
                                                    {contest.rewardPool.toLocaleString()} LSC
                                                </span>
                                            </div>
                                            
                                            <h4 className="text-lg font-black text-white italic tracking-tighter mb-1">{contest.hashtag}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-4 truncate">{contest.title}</p>
                                            
                                            <button className="w-full py-2 bg-white text-black hover:bg-brand-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
                                                <Megaphone size={12} /> Join Contest
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Search Control */}
                        <div className="flex justify-end mb-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-lg border border-white/5">
                                <Search size={14} className="text-gray-500"/>
                                <input type="text" placeholder="Find a circle..." className="bg-transparent text-xs text-white placeholder-gray-600 outline-none w-32 font-bold" />
                            </div>
                        </div>

                        {/* Groups Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredGroups.map(group => (
                                <GroupCard 
                                    key={group.id} 
                                    {...group} 
                                    isJoined={false}
                                    onClick={() => setSelectedGroup(group)} 
                                />
                            ))}
                            {filteredGroups.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                                    No circles found in {filter}.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
