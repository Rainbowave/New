
import React, { useState, useEffect, useMemo } from 'react';
import { 
    ShieldAlert, Search, RefreshCw, AlertTriangle, User, 
    ChevronRight, ExternalLink, Calendar, MessageCircle, X,
    Eye, Ban, MessageSquare, Loader2, Filter, ArrowDown, ArrowUp,
    FileText, Image as ImageIcon, DollarSign, LayoutGrid, Flame, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';

interface Report {
    id: number;
    type: string;
    reason: string;
    user: string;
    contentPreview: string;
    status: 'pending' | 'resolved';
    timestamp: string;
    details?: string;
    priority?: 'low' | 'medium' | 'high';
    context?: 'dating' | 'adult';
}

interface UserReportGroup {
    username: string;
    avatar: string;
    totalReports: number;
    lastReportDate: string;
    highestPriority: 'low' | 'medium' | 'high';
    reports: Report[];
    context: 'dating' | 'adult';
}

type SortOrder = 'newest' | 'oldest' | 'priority';
type ReportFilter = 'all' | 'content' | 'chat' | 'finance';

export default function AdminReports() {
    const navigate = useNavigate();
    const [userGroups, setUserGroups] = useState<UserReportGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserReportGroup | null>(null);
    
    // Admin Mode & Filters
    const [adminMode, setAdminMode] = useState<'dating' | 'naughty'>((localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating');
    const [activeTab, setActiveTab] = useState<ReportFilter>('all');
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

    useEffect(() => {
        const handleModeChange = () => {
             setAdminMode(localStorage.getItem('admin_view_mode') as 'dating' | 'naughty' || 'dating');
        };
        window.addEventListener('admin-mode-change', handleModeChange);
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        setSelectedUser(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Get reports from DB Filtered by Context
            const context = adminMode === 'naughty' ? 'adult' : 'dating';
            const dbReports = db.getReports(context) as unknown as Report[];
            
            const groups: Record<string, UserReportGroup> = {};
            
            dbReports.forEach((report) => {
                if (!groups[report.user]) {
                    groups[report.user] = {
                        username: report.user,
                        avatar: `https://picsum.photos/100/100?random=${report.user}`,
                        totalReports: 0,
                        lastReportDate: report.timestamp,
                        highestPriority: 'low',
                        reports: [],
                        context: report.context || context
                    };
                }
                
                groups[report.user].reports.push(report);
                groups[report.user].totalReports++;
                
                // Update Date if newer
                if (new Date(report.timestamp) > new Date(groups[report.user].lastReportDate)) {
                    groups[report.user].lastReportDate = report.timestamp;
                }
                
                // Update Priority
                const currentPri = groups[report.user].highestPriority;
                if (report.priority === 'high') groups[report.user].highestPriority = 'high';
                else if (report.priority === 'medium' && currentPri !== 'high') groups[report.user].highestPriority = 'medium';
            });

            setUserGroups(Object.values(groups).sort((a,b) => b.totalReports - a.totalReports));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [adminMode]);

    const filteredGroups = useMemo(() => {
        return userGroups.filter(g => {
            const matchesSearch = g.username.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [userGroups, search]);

    // Process reports for the Detail View
    const processedDetailReports = useMemo(() => {
        if (!selectedUser) return [];
        let data = [...selectedUser.reports];

        // 1. Filter
        if (activeTab === 'content') {
            data = data.filter(r => ['Post', 'Photo', 'Video', 'Short', 'Comic'].includes(r.type));
        } else if (activeTab === 'chat') {
            data = data.filter(r => ['Comment', 'Message', 'Chat'].includes(r.type));
        } else if (activeTab === 'finance') {
            data = data.filter(r => ['Payment', 'Tip', 'Subscription', 'Refund'].includes(r.type));
        }

        // 2. Sort
        data.sort((a, b) => {
            if (sortOrder === 'newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            if (sortOrder === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            if (sortOrder === 'priority') {
               const pMap = { high: 3, medium: 2, low: 1, undefined: 0 };
               return (pMap[b.priority || 'low'] || 0) - (pMap[a.priority || 'low'] || 0);
            }
            return 0;
        });

        return data;
    }, [selectedUser, activeTab, sortOrder]);

    const handleBanUser = (username: string) => {
        if (confirm(`Are you sure you want to ban @${username}? This will suspend their access.`)) {
            db.updateUser(username, { status: 'banned' });
            alert(`User @${username} has been banned.`);
        }
    };

    const getPriorityColor = (p: string) => {
        if (p === 'high') return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (p === 'medium') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    };

    const getTypeIcon = (type: string) => {
        if (['Payment', 'Tip'].includes(type)) return <DollarSign size={14} />;
        if (['Comment', 'Message'].includes(type)) return <MessageSquare size={14} />;
        return <FileText size={14} />;
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-10 shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2 flex items-center gap-3">
                        <ShieldAlert className="text-brand-500" size={32} />
                        User Report Center
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Context: <span className={adminMode === 'naughty' ? 'text-brand-500' : 'text-brand-second'}>{adminMode.toUpperCase()}</span> Violations
                    </p>
                </div>
                <button onClick={fetchReports} className="p-3 bg-dark-800 rounded-xl border border-white/5 text-gray-400 hover:text-white transition-all">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="flex gap-6 h-full min-h-0">
                {/* Left Column: User List */}
                <div className={`${selectedUser ? 'w-1/2 hidden lg:flex' : 'w-full'} flex flex-col bg-dark-800 border border-dark-700 rounded-2xl shadow-xl transition-all duration-300`}>
                    <div className="p-6 border-b border-dark-700">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search reported users..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-dark-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-500 font-bold" 
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {loading ? (
                            <div className="py-20 text-center flex justify-center"><Loader2 className="animate-spin text-brand-500" /></div>
                        ) : filteredGroups.length === 0 ? (
                            <div className="py-20 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">No active reports in this context.</div>
                        ) : (
                            filteredGroups.map(group => (
                                <div 
                                    key={group.username}
                                    onClick={() => setSelectedUser(group)}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer group hover:bg-dark-700/50 ${selectedUser?.username === group.username ? 'bg-brand-900/10 border-brand-500/50' : 'bg-dark-900/30 border-white/5'}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <img src={group.avatar} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                                            <div>
                                                <h4 className={`font-bold text-sm ${selectedUser?.username === group.username ? 'text-brand-400' : 'text-white'}`}>@{group.username}</h4>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{group.totalReports} Active Reports</p>
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${getPriorityColor(group.highestPriority)}`}>
                                            {group.highestPriority} Risk
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                                        <div className="flex items-center gap-1.5">
                                            {group.context === 'adult' ? <Flame size={10} className="text-brand-500" fill="currentColor"/> : <Heart size={10} className="text-brand-second" fill="currentColor"/>}
                                            {group.context === 'adult' ? 'Naughty' : 'Dating'}
                                        </div>
                                        <div className="flex items-center gap-1 group-hover:text-white transition-colors">
                                            View Details <ChevronRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Detail View */}
                {selectedUser && (
                    <div className="w-full lg:w-1/2 flex flex-col bg-dark-800 border border-dark-700 rounded-2xl shadow-xl animate-in slide-in-from-right duration-300">
                        {/* User Header */}
                        <div className="p-6 border-b border-dark-700 flex justify-between items-start bg-dark-900/50 rounded-t-2xl">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedUser(null)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-gray-400"><ChevronRight className="rotate-180" size={20} /></button>
                                <img src={selectedUser.avatar} className="w-16 h-16 rounded-2xl border-2 border-white/10" alt="" />
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">@{selectedUser.username}</h2>
                                    <button 
                                        onClick={() => navigate(`/admin/users/${selectedUser.username}`)}
                                        className="text-[10px] font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 uppercase tracking-widest mt-1"
                                    >
                                        Full Profile <ExternalLink size={10} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleBanUser(selectedUser.username)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-all" 
                                    title="Ban User"
                                >
                                    <Ban size={20} />
                                </button>
                                <button 
                                    onClick={() => setSelectedUser(null)} 
                                    className="hidden lg:block p-2 hover:bg-white/5 text-gray-500 hover:text-white rounded-lg transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Filters & Sorting */}
                        <div className="p-4 border-b border-dark-700 bg-dark-900/30 flex flex-col gap-4">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {[
                                    { id: 'all', label: 'All', icon: LayoutGrid },
                                    { id: 'content', label: 'Media', icon: ImageIcon },
                                    { id: 'chat', label: 'Comms', icon: MessageCircle },
                                    { id: 'finance', label: 'Finance', icon: DollarSign },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as ReportFilter)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                                            activeTab === tab.id 
                                            ? 'bg-white text-black border-white shadow-lg' 
                                            : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white'
                                        }`}
                                    >
                                        <tab.icon size={12} /> {tab.label}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    <Filter size={12} /> {processedDetailReports.length} Items Found
                                </div>
                                <div className="flex bg-dark-900 rounded-lg p-0.5 border border-white/5">
                                    <button 
                                        onClick={() => setSortOrder('newest')}
                                        className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${sortOrder === 'newest' ? 'bg-dark-700 text-white' : 'text-gray-600 hover:text-white'}`}
                                    >
                                        Newest
                                    </button>
                                    <button 
                                        onClick={() => setSortOrder('priority')}
                                        className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all flex items-center gap-1 ${sortOrder === 'priority' ? 'bg-dark-700 text-white' : 'text-gray-600 hover:text-white'}`}
                                    >
                                        Severity <ArrowDown size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Report List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-dark-900/20">
                            {processedDetailReports.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 opacity-30">
                                    <ShieldAlert size={32} className="mb-2" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">No reports in this category</p>
                                </div>
                            ) : (
                                processedDetailReports.map((report) => (
                                    <div key={report.id} className="bg-dark-900 border border-white/5 rounded-xl p-5 shadow-sm hover:border-white/10 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${report.priority === 'high' ? 'bg-red-500 animate-pulse' : report.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                                                <div className="flex items-center gap-2">
                                                    <span className="p-1 bg-white/5 rounded text-gray-400">{getTypeIcon(report.type)}</span>
                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">{report.reason}</span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">{new Date(report.timestamp).toLocaleString()}</span>
                                        </div>
                                        
                                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 mb-4">
                                            <div className="flex items-start gap-3">
                                                {['Comment', 'Message'].includes(report.type) ? (
                                                    <div className="w-10 h-10 bg-dark-800 rounded flex items-center justify-center shrink-0 border border-white/5">
                                                        <MessageSquare size={16} className="text-gray-400" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 bg-black rounded overflow-hidden shrink-0 border border-white/5">
                                                        {report.contentPreview.startsWith('http') ? (
                                                            <img src={report.contentPreview} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-gray-600 bg-dark-800">N/A</div>
                                                        )}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                        {report.type} Preview
                                                    </p>
                                                    <p className="text-xs text-gray-300 italic">"{report.details || report.contentPreview}"</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <button className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/5 transition-colors">
                                                Ignore
                                            </button>
                                            <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors">
                                                Take Action
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
