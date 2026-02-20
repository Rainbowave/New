
import React, { useState, useEffect } from 'react';
import { 
    Users, DollarSign, Settings, Crown, Zap, Heart, Flame, Trophy,
    ShieldCheck, Eye, Activity, ShieldAlert, Flag, UserX, AlertTriangle,
    CheckCircle, XCircle, Briefcase, UserCheck, LayoutGrid, List,
    Shield, Ban, ArrowRight, FileText, Image as ImageIcon, Video, Smartphone,
    BookOpen, ShoppingBag, Radio, ChevronRight, Clock, MapPin, Gamepad2, BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';

const MetricCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <div className="bg-dark-800 border border-dark-700 p-5 rounded-[5px] shadow-lg relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-8 ${color.replace('text-', 'bg-').replace('500', '500/5')} rounded-full blur-2xl -mr-4 -mt-4 transition-opacity opacity-50 group-hover:opacity-100`}></div>
        <div className="flex justify-between items-start mb-3 relative z-10">
            <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-black text-white tabular-nums">{value}</h3>
            </div>
            <div className={`p-2 rounded-[5px] ${color.replace('text-', 'bg-').replace('500', '500/10')} ${color} border border-white/5`}>
                <Icon size={20} />
            </div>
        </div>
        {subtext && <p className="text-[9px] font-bold text-gray-400 relative z-10">{subtext}</p>}
    </div>
);

const ModerationContainer = ({ title, icon: Icon, color, link, count, children }: any) => {
    const navigate = useNavigate();
    return (
        <div className="bg-dark-800 border border-dark-700 rounded-[5px] flex flex-col h-full shadow-xl hover:border-brand-500/30 transition-all group overflow-hidden">
            <div className="p-5 border-b border-dark-700 bg-dark-900/30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-[5px] ${color.replace('text-', 'bg-').replace('500', '500/10')} ${color} border border-white/5`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">{title}</h3>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{count} Pending</p>
                    </div>
                </div>
                <button onClick={() => navigate(link)} className="text-gray-500 hover:text-white transition-colors">
                    <ArrowRight size={18} />
                </button>
            </div>
            
            <div className="flex-1 p-4 bg-dark-800 flex flex-col gap-2 overflow-y-auto max-h-[300px] custom-scrollbar">
                {children}
            </div>

            <div className="p-3 border-t border-dark-700 bg-dark-900/30">
                <button 
                    onClick={() => navigate(link)}
                    className="w-full py-2 bg-dark-700 hover:bg-dark-600 rounded-[5px] text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                    View All {title}
                </button>
            </div>
        </div>
    );
};

const ContentTeamCard = ({ title, icon: Icon, link, color }: any) => {
    const navigate = useNavigate();
    return (
        <button 
            onClick={() => navigate(link)}
            className="flex items-center gap-4 p-4 bg-dark-800 border border-dark-700 rounded-[5px] hover:bg-dark-750 hover:border-brand-500/30 transition-all group text-left w-full shadow-lg"
        >
            <div className={`w-12 h-12 rounded-[5px] flex items-center justify-center ${color} bg-opacity-10 border border-white/5 group-hover:scale-110 transition-transform`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm uppercase tracking-tight mb-0.5 group-hover:text-brand-500 transition-colors">{title} Team</h4>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Manage Content</p>
            </div>
            <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
        </button>
    );
};

export default function AdminCommunity() {
    const [population, setPopulation] = useState({ total: 0, creators: 0, viewers: 0, moderators: 0 });
    
    // Data for containers
    const [verifications, setVerifications] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [suspensions, setSuspensions] = useState<any[]>([]);

    const [adminMode, setAdminMode] = useState<'dating' | 'naughty'>((localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating');

    useEffect(() => {
        const handleModeChange = () => {
             setAdminMode(localStorage.getItem('admin_view_mode') as 'dating' | 'naughty' || 'dating');
        };
        window.addEventListener('admin-mode-change', handleModeChange);
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            // Fetch users strictly based on context
            const context = adminMode === 'naughty' ? 'adult' : 'dating';
            const allUsers = db.getUsers(context);

            // Calculate Population Stats for the specific context
            const modsList = allUsers.filter((u: any) => u.role === 'moderator' || u.role === 'admin');
            
            setPopulation({
                total: allUsers.length,
                creators: Math.floor(allUsers.length * 0.15),
                viewers: Math.floor(allUsers.length * 0.85),
                moderators: modsList.length
            });

            // Load Context-Aware Data
            const verifs = db.getVerificationRequests(context).slice(0, 5);
            const reps = db.getReports(context).filter((r: any) => r.status === 'pending').slice(0, 5);
            const logs = db.getLogs(context).filter((l: any) => l.action.includes('suspend') || l.action.includes('ban')).slice(0, 5);
            
            setVerifications(verifs);
            setReports(reps);
            setSuspensions(logs);
        };
        loadData();
    }, [adminMode]);

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in pb-32">
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2 flex items-center gap-3">
                        <Users className="text-brand-500" size={32} />
                        Community Overview
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Population health, safety operations, and engagement teams for <span className={adminMode === 'naughty' ? 'text-brand-500' : 'text-brand-second'}>{adminMode.toUpperCase()}</span>.
                    </p>
                </div>
                <div className="flex bg-dark-800 p-1 rounded-lg border border-dark-600">
                    <div className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${adminMode === 'dating' ? 'bg-brand-second text-black' : 'text-gray-500'}`}>
                        <Heart size={12} fill={adminMode === 'dating' ? "currentColor" : "none"} /> Dating Context
                    </div>
                    <div className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${adminMode === 'naughty' ? 'bg-brand-500 text-white' : 'text-gray-500'}`}>
                        <Flame size={12} fill={adminMode === 'naughty' ? "currentColor" : "none"} /> Naughty Context
                    </div>
                </div>
            </div>

            {/* Population Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in slide-in-from-bottom-2">
                <MetricCard 
                    title="Active Creators" 
                    value={population.creators} 
                    subtext={`${((population.creators / (population.total || 1)) * 100).toFixed(1)}% of userbase`} 
                    icon={Zap} 
                    color="text-yellow-500" 
                />
                <MetricCard 
                    title="Audience Base" 
                    value={population.viewers} 
                    subtext="Registered Viewers" 
                    icon={Eye} 
                    color="text-blue-500" 
                />
                <MetricCard 
                    title="Safety Team" 
                    value={population.moderators} 
                    subtext="Mods & Admins" 
                    icon={ShieldCheck} 
                    color="text-green-500" 
                />
                <MetricCard 
                    title="Total Members" 
                    value={population.total} 
                    subtext={`Global ${adminMode.charAt(0).toUpperCase() + adminMode.slice(1)} Population`} 
                    icon={Users} 
                    color={adminMode === 'naughty' ? 'text-brand-500' : 'text-brand-second'} 
                />
            </div>
            
            {/* Moderation Operations */}
            <div className="mb-12">
                <h3 className="font-black text-white text-lg uppercase italic tracking-wider flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                    <Shield size={20} className="text-blue-500" /> Moderation Operations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                    
                    {/* Verification Queue */}
                    <ModerationContainer title="Verification" icon={UserCheck} color="text-green-500" count={verifications.length} link="/admin/verification">
                        {verifications.map((v, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-dark-900 rounded-[5px] border border-white/5 hover:bg-dark-950 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-[10px] font-black text-gray-500 border border-white/10">
                                        {v.user[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white">@{v.user}</div>
                                        <div className="text-[9px] text-gray-500 font-bold uppercase">{v.type}</div>
                                    </div>
                                </div>
                                <span className="text-[9px] text-gray-600 font-mono">{v.date || 'New'}</span>
                            </div>
                        ))}
                        {verifications.length === 0 && <div className="text-center py-8 text-[10px] text-gray-600 uppercase font-bold">Queue Empty</div>}
                    </ModerationContainer>

                    {/* Report Center */}
                    <ModerationContainer title="User Reports" icon={Flag} color="text-yellow-500" count={reports.length} link="/admin/reports">
                        {reports.map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-dark-900 rounded-[5px] border border-white/5 hover:bg-dark-950 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${r.priority === 'high' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                    <div>
                                        <div className="text-xs font-bold text-white">{r.reason}</div>
                                        <div className="text-[9px] text-gray-500 font-bold uppercase">@{r.user} • {r.type}</div>
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-gray-600 bg-dark-800 px-2 py-0.5 rounded border border-white/5">{r.priority?.toUpperCase() || 'LOW'}</span>
                            </div>
                        ))}
                        {reports.length === 0 && <div className="text-center py-8 text-[10px] text-gray-600 uppercase font-bold">All Clear</div>}
                    </ModerationContainer>

                    {/* Suspension Team */}
                    <ModerationContainer title="Suspensions" icon={Ban} color="text-red-500" count={suspensions.length} link="/admin/suspensions">
                        {suspensions.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-dark-900 rounded-[5px] border border-white/5 hover:bg-dark-950 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-full bg-red-900/20 text-red-500"><UserX size={12}/></div>
                                    <div>
                                        <div className="text-xs font-bold text-white">@{s.targetId}</div>
                                        <div className="text-[9px] text-gray-500 font-bold uppercase">{s.action.replace('_', ' ')}</div>
                                    </div>
                                </div>
                                <span className="text-[9px] text-gray-600 font-mono">{new Date(s.timestamp).toLocaleDateString()}</span>
                            </div>
                        ))}
                        {suspensions.length === 0 && <div className="text-center py-8 text-[10px] text-gray-600 uppercase font-bold">No Actions</div>}
                    </ModerationContainer>
                </div>
            </div>

            {/* Content Engagement Teams */}
            <div className="mb-10">
                <h3 className="font-black text-white text-lg uppercase italic tracking-wider flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                    <Activity size={20} className="text-purple-500" /> Content Engagement Teams
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    <ContentTeamCard title="Photo" icon={ImageIcon} color="bg-blue-500" link="/admin/users?filter=moderators&squad=PHOTO" />
                    <ContentTeamCard title="Video" icon={Video} color="bg-red-500" link="/admin/users?filter=moderators&squad=VIDEO" />
                    <ContentTeamCard title="Shorts" icon={Smartphone} color="bg-purple-500" link="/admin/users?filter=moderators&squad=SHORT" />
                    <ContentTeamCard title="Post & Polls" icon={BarChart2} color="bg-gray-500" link="/admin/users?filter=moderators&squad=POST" />
                    <ContentTeamCard title="Comics" icon={BookOpen} color="bg-yellow-500" link="/admin/users?filter=moderators&squad=COMIC" />
                    <ContentTeamCard title="Live" icon={Radio} color="bg-green-500" link="/admin/users?filter=moderators&squad=LIVE" />
                    <ContentTeamCard title="Collection" icon={ShoppingBag} color="bg-orange-500" link="/admin/users?filter=moderators&squad=COLLECTION" />
                    <ContentTeamCard title="Knowledge" icon={FileText} color="bg-cyan-500" link="/admin/users?filter=moderators&squad=RESOURCE" />
                    <ContentTeamCard title="Arcade" icon={Gamepad2} color="bg-pink-500" link="/admin/users?filter=moderators&squad=ARCADE" />
                </div>
            </div>
        </div>
    );
}
