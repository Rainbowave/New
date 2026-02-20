
import React, { useState, useEffect } from 'react';
import { 
    Search, Shield, Ban, CheckCircle, Loader2, RefreshCw, 
    AlertCircle, AlertTriangle, Flag, ChevronLeft, ChevronRight, 
    Filter, Eye, Users, Unlock, Star, Briefcase, Crown, UserCog,
    PauseCircle, MessageCircle, Heart, Flame, Image as ImageIcon, Video, Smartphone,
    BarChart2, BookOpen, Radio, ShoppingBag, FileText, Gamepad2
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../../services/db';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';

interface AdminUser {
    id: string;
    username: string;
    email: string;
    displayName: string;
    role: UserRole;
    status: 'active' | 'banned' | 'suspended';
    joinedAt: string;
    avatarUrl: string;
    reportsCount?: number;
    verificationStatus: 'none' | 'pending' | 'verified' | 'rejected';
    walletBalance: number;
    isLuciStar?: boolean;
    isPremium?: boolean;
    contentPreference?: 'dating' | 'adult';
    moderatorSquad?: string; // e.g., 'PHOTO', 'VIDEO'
}

const ModeratorSquadCard = ({ title, count, icon: Icon, color, onClick }: any) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center p-6 bg-dark-800 border border-dark-700 rounded-[5px] hover:bg-dark-750 hover:border-brand-500/30 transition-all group text-center shadow-lg h-48 w-full"
    >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color} bg-opacity-10 border border-white/5 group-hover:scale-110 transition-transform mb-4`}>
            <Icon size={32} className={color.replace('bg-', 'text-')} />
        </div>
        <h4 className="font-bold text-white text-sm uppercase tracking-tight mb-1 group-hover:text-brand-500 transition-colors">{title} Squad</h4>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{count} Active Members</p>
    </button>
);

export default function AdminUsers() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlFilter = searchParams.get('filter');
    const squadFilter = searchParams.get('squad');
    
    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser?.role === 'admin'; 
    
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    
    // Global Context
    const [adminMode, setAdminMode] = useState<'dating' | 'naughty'>((localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating');

    useEffect(() => {
        const handleModeChange = () => {
             const mode = (localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating';
             setAdminMode(mode);
        };
        window.addEventListener('admin-mode-change', handleModeChange);
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, []);

    useEffect(() => {
        if (urlFilter === 'subscribed') {
            setRoleFilter('premium'); 
        } else if (urlFilter === 'moderators') {
            setRoleFilter('moderator');
        } else if (urlFilter === 'roles') {
            setRoleFilter('all');
        } else {
            setRoleFilter('all');
        }
    }, [urlFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            // STRICT FILTERING: Use DB Service with context
            const context = adminMode === 'naughty' ? 'adult' : 'dating';
            const data = db.getUsers(context);
            
            // Mock assigning squads for demo purposes if not present
            const enhancedData = data.map((u: any, i: number) => {
                if (u.role === 'moderator' && !u.moderatorSquad) {
                    const squads = ['PHOTO', 'VIDEO', 'SHORT', 'POST', 'COMIC', 'LIVE', 'COLLECTION', 'RESOURCE', 'ARCADE'];
                    return { ...u, moderatorSquad: squads[i % squads.length] };
                }
                return u;
            });

            setUsers(enhancedData as AdminUser[]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [adminMode]);

    const filteredUsers = users.filter(user => {
        // Search Filter
        const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
        
        // Role Filter
        let matchesRole = true;
        if (roleFilter === 'premium') matchesRole = !!user.isPremium;
        else if (roleFilter === 'moderator') matchesRole = user.role === 'moderator' || user.role === 'admin';
        else if (roleFilter !== 'all') matchesRole = user.role === roleFilter;

        // Squad Filter (If in Moderator View)
        let matchesSquad = true;
        if (roleFilter === 'moderator' && squadFilter) {
            matchesSquad = user.moderatorSquad === squadFilter;
        }

        // Status Filter
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus && matchesSquad;
    });

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSquadClick = (squadName: string) => {
        setSearchParams({ filter: 'moderators', squad: squadName });
    };

    const handleBackToSquads = () => {
        setSearchParams({ filter: 'moderators' }); // Removes squad param
    };

    // If Viewing Moderators AND No Squad Selected -> Show Squad Grid
    const showSquadGrid = roleFilter === 'moderator' && !squadFilter;

    // Counts for Grid
    const getSquadCount = (squad: string) => users.filter(u => u.role === 'moderator' && u.moderatorSquad === squad).length;

    const handleAction = (userId: string, type: 'warn' | 'suspend' | 'ban' | 'activate') => {
        if (type === 'warn') {
            const reason = prompt("Enter warning reason:", "Community guidelines violation");
            if (reason) {
                db.warnUser(userId, reason);
                alert(`Warning sent to @${userId}`);
            }
            return;
        }

        const newStatus = type === 'activate' ? 'active' : type === 'suspend' ? 'suspended' : 'banned';
        const confirmMsg = `${type.toUpperCase()} user @${userId}?`;

        if (window.confirm(confirmMsg)) {
            const updated = db.updateUser(userId, { status: newStatus });
            if (updated) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
                db.logAction('admin', `${newStatus}_user`, 'user', userId, `Admin ${type} action`);
            }
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1 flex items-center gap-3">
                        {squadFilter && <button onClick={handleBackToSquads} className="p-1 hover:bg-white/10 rounded-full mr-2"><ChevronLeft /></button>}
                        {roleFilter === 'premium' ? <Crown className="text-yellow-500" /> : 
                         roleFilter === 'moderator' ? <Shield className="text-blue-500" /> :
                         urlFilter === 'roles' ? <Briefcase className="text-brand-500" /> : null}
                        {squadFilter ? `${squadFilter} Squad` : 
                         roleFilter === 'premium' ? 'Subscribed Users' : 
                         roleFilter === 'moderator' ? 'Engagement Pride Teams' :
                         urlFilter === 'roles' ? 'Role Management' : 'User Management'}
                    </h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Database: <span className={adminMode === 'naughty' ? 'text-brand-500' : 'text-brand-second'}>{adminMode.toUpperCase()}</span> Only
                    </p>
                </div>
                <button onClick={fetchUsers} className="p-3 bg-dark-800 rounded-xl border border-white/5 text-gray-400 hover:text-white transition-all">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Render Squad Grid View */}
            {showSquadGrid ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <ModeratorSquadCard title="Photo" icon={ImageIcon} color="bg-blue-500" count={getSquadCount('PHOTO')} onClick={() => handleSquadClick('PHOTO')} />
                    <ModeratorSquadCard title="Video" icon={Video} color="bg-red-500" count={getSquadCount('VIDEO')} onClick={() => handleSquadClick('VIDEO')} />
                    <ModeratorSquadCard title="Shorts" icon={Smartphone} color="bg-purple-500" count={getSquadCount('SHORT')} onClick={() => handleSquadClick('SHORT')} />
                    <ModeratorSquadCard title="Posts & Polls" icon={BarChart2} color="bg-gray-500" count={getSquadCount('POST')} onClick={() => handleSquadClick('POST')} />
                    <ModeratorSquadCard title="Comics" icon={BookOpen} color="bg-yellow-500" count={getSquadCount('COMIC')} onClick={() => handleSquadClick('COMIC')} />
                    <ModeratorSquadCard title="Live" icon={Radio} color="bg-green-500" count={getSquadCount('LIVE')} onClick={() => handleSquadClick('LIVE')} />
                    <ModeratorSquadCard title="Collection" icon={ShoppingBag} color="bg-orange-500" count={getSquadCount('COLLECTION')} onClick={() => handleSquadClick('COLLECTION')} />
                    <ModeratorSquadCard title="Knowledge" icon={FileText} color="bg-cyan-500" count={getSquadCount('RESOURCE')} onClick={() => handleSquadClick('RESOURCE')} />
                    <ModeratorSquadCard title="Arcade" icon={Gamepad2} color="bg-pink-500" count={getSquadCount('ARCADE')} onClick={() => handleSquadClick('ARCADE')} />
                </div>
            ) : (
                /* Render User Table View */
                <>
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 shadow-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by name or email..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-dark-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-500" 
                            />
                        </div>
                        <div className="flex gap-2">
                             {/* Only show role dropdown if NOT in moderator view specifically */}
                             {roleFilter !== 'moderator' && (
                                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-dark-900 border border-white/5 text-xs font-bold text-white rounded-xl px-4 py-3 outline-none">
                                    <option value="all">All Roles</option>
                                    <option value="premium">Premium</option>
                                    <option value="user">Member</option>
                                    <option value="creator">Creator</option>
                                    <option value="moderator">Engagement Pride</option>
                                    <option value="admin">Admin</option>
                                </select>
                             )}
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-dark-900 border border-white/5 text-xs font-bold text-white rounded-xl px-4 py-3 outline-none">
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="banned">Banned</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-dark-900 text-[10px] text-gray-500 uppercase font-black tracking-widest border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-5">User</th>
                                    <th className="px-6 py-5">Context</th>
                                    <th className="px-6 py-5">{squadFilter ? 'Squad' : 'Role'}</th>
                                    <th className="px-6 py-5">Points Stats</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {paginatedUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img src={u.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
                                                    {u.verificationStatus === 'verified' && (
                                                        <div className="absolute -bottom-1 -right-1 bg-brand-500 text-white rounded-full p-0.5 border border-dark-800">
                                                            <CheckCircle size={8} strokeWidth={4} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                                        @{u.username}
                                                        {u.isLuciStar && <Star size={10} className="text-yellow-500 fill-yellow-500" />}
                                                        {u.isPremium && <Crown size={10} className="text-orange-400 fill-orange-400" />}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 w-fit ${u.contentPreference === 'adult' ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20' : 'bg-brand-second/10 text-brand-second border border-brand-second/20'}`}>
                                                {u.contentPreference === 'adult' ? <Flame size={10} fill="currentColor"/> : <Heart size={10} fill="currentColor"/>}
                                                {u.contentPreference === 'adult' ? 'Naughty' : 'Dating'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {squadFilter ? (
                                                <span className="text-[10px] font-bold bg-dark-900 px-2 py-1 rounded border border-white/10 text-gray-300">{u.moderatorSquad} TEAM</span>
                                            ) : (
                                                <div className="relative flex items-center">
                                                    <UserCog size={14} className="absolute left-2 text-gray-500" />
                                                    <select 
                                                        value={u.role} 
                                                        disabled 
                                                        className={`bg-dark-900 border border-white/5 rounded-lg py-1.5 pl-7 pr-2 text-[10px] font-black outline-none uppercase tracking-wider ${
                                                            u.role === 'admin' ? 'text-red-500' :
                                                            u.role === 'moderator' ? 'text-blue-400' :
                                                            u.role === 'creator' ? 'text-yellow-500' : 'text-gray-400'
                                                        }`}
                                                    >
                                                        <option value="user">Member</option>
                                                        <option value="creator">Creator</option>
                                                        <option value="moderator">Engagement Pride</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-xs font-bold text-white flex items-center gap-1">
                                                    <span className="text-green-400">{(u.walletBalance || 0).toLocaleString()}</span> Avail
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                u.status === 'active' ? 'bg-green-500/10 text-green-500' : 
                                                u.status === 'suspended' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                 <button 
                                                    onClick={() => handleAction(u.id, 'warn')}
                                                    className="p-2 text-gray-500 hover:text-yellow-500 transition-colors"
                                                    title="Send Warning"
                                                >
                                                    <MessageCircle size={16} />
                                                </button>
                                                
                                                {u.status === 'active' ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleAction(u.id, 'suspend')}
                                                            className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
                                                            title="Suspend User"
                                                        >
                                                            <PauseCircle size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAction(u.id, 'ban')}
                                                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                            title="Ban User"
                                                        >
                                                            <Ban size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleAction(u.id, 'activate')}
                                                        className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                                                        title="Activate User"
                                                    >
                                                        <Unlock size={16} />
                                                    </button>
                                                )}
                                                <button onClick={() => navigate(`/admin/users/${u.id}`)} className="p-2 text-gray-500 hover:text-white transition-colors" title="View Details">
                                                    <Eye size={16}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
