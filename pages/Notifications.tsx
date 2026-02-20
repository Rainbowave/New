
import React, { useState, useEffect } from 'react';
import { 
    Bell, Heart, UserPlus, MessageCircle, Star, 
    ShoppingBag, Video, Settings, Check, Loader2,
    Flame, Crown, UploadCloud, BarChart2, Globe,
    FileText, Zap, ChevronDown, MoreHorizontal,
    Trash2, EyeOff, User, DollarSign, Filter, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { db } from '../services/db';

type NotificationType = 'like' | 'comment' | 'subscription' | 'system' | 'gift' | 'shop' | 'upload' | 'reach' | 'post' | 'message';

interface Notification {
    id: number;
    type: NotificationType;
    user?: string;
    avatar?: string;
    content: string;
    time: string;
    read: boolean;
    image?: string;
    metadata?: {
        amount?: string;
        reachCount?: string;
        location?: string;
    };
}

export default function Notifications() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'social' | 'performance'>('all');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                // Mock notification data
                 const data: Notification[] = [
                    { 
                        id: 8, type: 'message', user: 'Gamer_King', 
                        avatar: 'https://picsum.photos/100/100?random=16',
                        content: 'sent you a private signal.', 
                        time: '2m ago', read: false 
                    },
                    { 
                        id: 1, type: 'reach', 
                        content: 'Your latest broadcast is trending in the', 
                        metadata: { location: 'Local Hub', reachCount: '10K' },
                        time: 'Just now', read: false 
                    },
                    { 
                        id: 2, type: 'subscription', user: 'Neon_Viper', 
                        avatar: 'https://picsum.photos/100/100?random=11',
                        content: 'has joined your Pride. Your monthly yield increased!', 
                        time: '12m ago', read: false 
                    },
                    { 
                        id: 3, type: 'upload', 
                        content: 'High-fidelity sync complete. Your video is now live in the Space.', 
                        image: 'https://picsum.photos/100/100?random=12',
                        time: '1h ago', read: true 
                    },
                    { 
                        id: 4, type: 'like', user: 'Cyber_Rose', 
                        avatar: 'https://picsum.photos/100/100?random=13',
                        content: 'added Heat to your latest content.', 
                        time: '2h ago', read: true 
                    },
                    { 
                        id: 5, type: 'comment', user: 'Pixel_Mancer', 
                        avatar: 'https://picsum.photos/100/100?random=14',
                        content: 'commented: "This algorithm is stunning!"', 
                        time: '4h ago', read: true 
                    },
                    { 
                        id: 6, type: 'gift', user: 'Shadow_Star', 
                        avatar: 'https://picsum.photos/100/100?random=15',
                        content: 'sent a direct signal boost of', 
                        metadata: { amount: '50.00' },
                        time: '1d ago', read: true 
                    },
                    { 
                        id: 7, type: 'reach', 
                        content: 'Global Discovery Alert: Your account reached', 
                        metadata: { reachCount: '50K' },
                        time: '2d ago', read: true 
                    }
                ];
                setNotifications(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setShowMenu(false);
    };
    
    const clearAll = () => {
        if(confirm('Clear all notifications?')) {
            setNotifications([]);
        }
        setShowMenu(false);
    };

    const handleNotificationClick = (note: Notification) => {
        setNotifications(prev => prev.map(n => n.id === note.id ? { ...n, read: true } : n));
        if (note.type === 'shop') navigate('/collection/orders');
        else if (note.type === 'subscription') navigate('/earnings');
        else if (note.type === 'message') navigate('/chat');
        else if (note.user) navigate(`/profile/${note.user.toLowerCase()}`);
        else navigate('/home');
    };

    const getIconInfo = (type: NotificationType) => {
        switch(type) {
            case 'like': return { icon: Flame, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
            case 'subscription': return { icon: Crown, color: 'text-brand-500', bg: 'bg-brand-500/10', border: 'border-brand-500/20' };
            case 'comment': return { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
            case 'upload': return { icon: UploadCloud, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
            case 'reach': return { icon: BarChart2, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
            case 'gift': return { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
            case 'shop': return { icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
            case 'post': return { icon: FileText, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
            case 'message': return { icon: MessageCircle, color: 'text-white', bg: 'bg-brand-second/10', border: 'border-brand-second/20' };
            default: return { icon: Bell, color: 'text-gray-500', bg: 'bg-dark-800', border: 'border-dark-700' };
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'social') return ['like', 'comment', 'subscription', 'gift', 'message'].includes(n.type);
        if (filter === 'performance') return ['upload', 'reach', 'system', 'post'].includes(n.type);
        return true;
    });

    return (
        <div className="max-w-5xl mx-auto py-10 px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none">Activity Hub</h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tracking community pulses and account performance.</p>
                </div>
                
                {/* Dropdown Menu */}
                <div className="relative">
                     <button 
                        onClick={() => setShowMenu(!showMenu)} 
                        className="flex items-center gap-2 px-5 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:text-white hover:border-white/20 transition-all text-gray-400"
                    >
                         <Filter size={14} /> Actions <ChevronDown size={12} className={`transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                     </button>
                     
                     {showMenu && (
                         <div className="absolute right-0 top-full mt-2 w-48 bg-dark-800 border border-dark-600 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 origin-top-right">
                             <button onClick={markAllRead} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 flex items-center gap-2">
                                 <Check size={14} /> Mark All Read
                             </button>
                             <button onClick={() => {navigate('/profile/me/settings'); setShowMenu(false);}} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 flex items-center gap-2">
                                 <Settings size={14} /> Settings
                             </button>
                             <div className="border-t border-white/5 my-1"></div>
                             <button onClick={clearAll} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 flex items-center gap-2">
                                 <Trash2 size={14} /> Clear All
                             </button>
                         </div>
                     )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar">
                {[
                    { id: 'all', label: 'All Updates' },
                    { id: 'social', label: 'Social' },
                    { id: 'performance', label: 'Performance' },
                ].map((f) => (
                    <button 
                        key={f.id} 
                        onClick={() => setFilter(f.id as any)}
                        className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filter === f.id ? 'bg-white text-black border-white shadow-lg' : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 className="animate-spin text-brand-500" size={48} />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] animate-pulse">Loading Updates...</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((note) => {
                            const { icon: Icon, color, bg, border } = getIconInfo(note.type);
                            return (
                                <div 
                                    key={note.id} 
                                    onClick={() => handleNotificationClick(note)}
                                    className={`group flex items-start gap-5 p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden hover:bg-dark-800/80 ${note.read ? 'bg-dark-900 border-white/[0.03]' : 'bg-dark-800 border-brand-500/20 shadow-none'}`}
                                >
                                    {!note.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500"></div>}
                                    
                                    <div className="relative shrink-0 mt-1">
                                        {/* Activity Hub Style Icons */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${border} border`}>
                                            <Icon size={24} className={color} />
                                        </div>
                                        
                                        {/* Avatar Mini Badge if User exists */}
                                        {note.avatar && (
                                            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-2 border-dark-800 overflow-hidden shadow-md">
                                                <img src={note.avatar} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="text-sm text-gray-200 leading-snug font-medium mb-1">
                                            {note.user && <span className="font-black text-white uppercase italic tracking-tighter mr-1.5 hover:underline" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${note.user}`); }}>@{note.user}</span>}
                                            <span className="text-gray-400">{note.content}</span>
                                            {note.metadata?.location && <span className="ml-1.5 font-black text-brand-second italic uppercase tracking-tighter">{note.metadata.location}</span>}
                                            {note.metadata?.reachCount && <span className="ml-1.5 font-black text-brand-second italic uppercase tracking-tighter">{note.metadata.reachCount} Views</span>}
                                            {note.metadata?.amount && <span className="ml-1.5 font-black text-yellow-500 italic tabular-nums tracking-tighter">{note.metadata.amount} LSC</span>}
                                        </div>
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{note.time}</p>
                                    </div>

                                    {note.image && (
                                        <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/5 group-hover:border-brand-500/30 transition-colors shadow-lg">
                                            <img src={note.image} className="w-full h-full object-cover" alt="Content" />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-2xl bg-dark-900/30">
                            <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700 opacity-30">
                                <Globe size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Community Clear</h3>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.4em] mt-2">No incoming updates detected.</p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center opacity-10">
                <span className="text-[7px] font-black text-white uppercase tracking-[2.5em]">High Fidelity Activity Node Active</span>
            </div>
        </div>
    );
}
