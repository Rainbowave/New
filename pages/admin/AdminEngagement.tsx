
import React, { useState, useEffect } from 'react';
import { 
    Trophy, BarChart2, Coins, Crown, Users, TrendingUp,
    Gift, AlertCircle, Save, Loader2, CheckCircle,
    Calendar, Flag, Heart, Eye, Activity,
    Image as ImageIcon, Video, Smartphone, BookOpen, ShoppingBag, Radio, DollarSign,
    Plus, Trash2, X, Settings, Hash, Search, Filter, Zap, CheckSquare
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { db } from '../../services/db';

const TagStatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-dark-900 border border-white/5 rounded-xl p-4 flex items-center justify-between">
        <div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-xl font-black text-white">{value}</h4>
        </div>
        <div className={`p-2 rounded-lg ${color} bg-opacity-10 border border-white/5`}>
            <Icon size={16} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
);

const ContestCard = ({ contest, onDelete }: any) => (
    <div className="bg-dark-900 border border-white/5 rounded-xl p-4 flex flex-col justify-between group hover:border-brand-500/30 transition-all">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-yellow-500 border border-yellow-500/30">
                    <Trophy size={18} />
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">{contest.title}</h4>
                    <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{contest.hashtag}</span>
                </div>
            </div>
            <button onClick={() => onDelete(contest.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
            </button>
        </div>
        <div className="space-y-2 mb-4">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wide border-b border-white/5 pb-1">
                <span>Reward Pool</span>
                <span className="text-white">{contest.rewardPool} LSC</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                <span>Ends</span>
                <span className="text-white">{new Date(contest.endDate).toLocaleDateString()}</span>
            </div>
             {contest.requirements && contest.requirements.length > 0 && (
                <div className="pt-2">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Requirements</p>
                    <div className="flex flex-wrap gap-1">
                        {contest.requirements.slice(0, 2).map((r: string, i: number) => (
                            <span key={i} className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-gray-300 border border-white/5">{r}</span>
                        ))}
                        {contest.requirements.length > 2 && <span className="text-[8px] text-gray-500">+{contest.requirements.length - 2} more</span>}
                    </div>
                </div>
            )}
        </div>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${contest.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-700/20 text-gray-500'}`}>
                {contest.status}
            </span>
            <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-[8px] text-gray-500">
                        <Users size={10} />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default function AdminEngagement() {
    const [activeTab, setActiveTab] = useState('overview');
    const [settings, setSettings] = useState<any>(null);
    const [pointsSettings, setPointsSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [adminMode, setAdminMode] = useState<string>(localStorage.getItem('admin_view_mode') || 'dating');

    // Contests State
    const [contests, setContests] = useState<any[]>([]);
    const [isCreateContestOpen, setIsCreateContestOpen] = useState(false);
    const [newContest, setNewContest] = useState({ 
        title: '', 
        hashtag: '#', 
        rewardPool: '', 
        days: 7, 
        description: '',
        requirements: [] as string[]
    });
    const [reqInput, setReqInput] = useState('');

    useEffect(() => {
        const handleModeChange = () => {
            setAdminMode(localStorage.getItem('admin_view_mode') || 'dating');
        };
        window.addEventListener('admin-mode-change', handleModeChange);

        const load = async () => {
            await new Promise(r => setTimeout(r, 600));
            setSettings(db.getSiteSettings());
            setPointsSettings(db.getPointsSettings());
            setContests(db.getContests());
            setLoading(false);
        };
        load();
        
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        db.saveSiteSettings(settings);
        db.savePointsSettings(pointsSettings);
        setSuccess(true);
        setSaving(false);
        setTimeout(() => setSuccess(false), 3000);
    };

    const handleAddRequirement = () => {
        if (!reqInput.trim()) return;
        setNewContest(prev => ({ ...prev, requirements: [...prev.requirements, reqInput.trim()] }));
        setReqInput('');
    };

    const handleRemoveRequirement = (index: number) => {
        setNewContest(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }));
    };

    const handleCreateContest = () => {
        if (!newContest.title || !newContest.rewardPool) return;
        
        // Reward Pool Cap Check
        let pool = parseInt(newContest.rewardPool);
        if (pool > 5000) pool = 5000;

        const contestData = {
            title: newContest.title,
            hashtag: newContest.hashtag.startsWith('#') ? newContest.hashtag : `#${newContest.hashtag}`,
            rewardPool: pool,
            description: newContest.description,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + newContest.days * 86400000).toISOString(),
            requirements: newContest.requirements.length > 0 ? newContest.requirements : ['Must include tag', 'Original content'],
            participants: []
        };
        
        db.createContest(contestData);
        setContests(prev => [...prev, { ...contestData, id: Date.now(), status: 'active' }]);
        setIsCreateContestOpen(false);
        setNewContest({ title: '', hashtag: '#', rewardPool: '', days: 7, description: '', requirements: [] });
    };

    const handleDeleteContest = (id: number) => {
        if(confirm('Delete this contest?')) {
            setContests(prev => prev.filter(c => c.id !== id));
            // In real app, call db.deleteContest(id)
        }
    };

    // Helper to update Leaderboard Prizes
    const updateLeaderboardPrize = (place: 'first'|'second'|'third', value: string) => {
        const modeKey = adminMode === 'adult' ? 'naughty' : 'dating';
        const newSettings = { ...settings };
        if (!newSettings.leaderboard) newSettings.leaderboard = { dating: {}, naughty: {} };
        if (!newSettings.leaderboard[modeKey]) newSettings.leaderboard[modeKey] = {};
        
        newSettings.leaderboard[modeKey][place] = parseInt(value) || 0;
        setSettings(newSettings);
    };

    // Helper to update Points
    const updatePoints = (key: string, val: string) => {
        setPointsSettings({ ...pointsSettings, [key]: parseInt(val) || 0 });
    };

    if (loading || !settings) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;

    // --- Dynamic Monetization Logic for Chart ---
    const AD_RATES = { banner: 0.40, popup: 1.50, video: 3.50, native: 0.80 };
    const getSectionMetrics = () => {
        const base = adminMode === 'adult' ? 1.5 : 1; 
        const isNaughty = adminMode === 'adult';
        const sections = [
            { name: 'Live', traffic: 450000 * base, color: '#ef4444', ads: ['video', 'banner'] },
            { name: 'Videos', traffic: 380000 * base, color: '#db2777', ads: ['video', 'banner', 'native'] },
            { name: 'Shorts', traffic: 340000 * base, color: '#ec4899', ads: ['popup', 'native'] },
            { name: 'Photos', traffic: 210000 * base, color: '#3b82f6', ads: ['banner', 'popup'] },
            { name: 'Polls', traffic: 180000 * base, color: '#eab308', ads: ['native'] },
            { name: 'Comics', traffic: 125000 * base, color: '#8b5cf6', ads: ['banner'] },
            { name: 'Collections', traffic: 42000 * base, color: '#10b981', ads: ['native'] },
        ];
        return sections.map(sec => {
            let blendedCPM = 0;
            sec.ads.forEach((adType: any) => blendedCPM += (AD_RATES as any)[adType] || 0);
            if (isNaughty) blendedCPM *= 1.2;
            return { ...sec, revenue: (sec.traffic / 1000) * blendedCPM, cpm: blendedCPM };
        });
    };
    const sectionMetrics = getSectionMetrics();
    const totalRevenue = sectionMetrics.reduce((acc, curr) => acc + curr.revenue, 0);

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in pb-32">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
                        <Heart className="text-brand-500" size={32} />
                        Engagement Manager
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Gamification, Contests, and Community Economics ({adminMode.toUpperCase()}).
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-dark-800 p-1 rounded-xl border border-dark-700">
                        {['overview', 'leaderboard', 'contests', 'settings'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-brand-600 hover:bg-brand-500 text-white font-black py-2 px-6 rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-[10px]"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Config
                    </button>
                </div>
            </div>

            {success && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4 mb-8 flex items-center gap-3 text-green-400 animate-in fade-in">
                    <CheckCircle size={20} />
                    <span className="font-bold">Engagement configuration updated successfully.</span>
                </div>
            )}
            
            {/* --- OVERVIEW --- */}
            {activeTab === 'overview' && (
                 <div className="space-y-8 animate-in slide-in-from-bottom-4">
                     {/* System Activity */}
                     <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl">
                         <h3 className="font-black text-white text-lg uppercase mb-4 flex items-center gap-2"><Activity size={20} className="text-blue-500"/> System Activity</h3>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <TagStatCard label="Active Contests" value={contests.filter(c=>c.status==='active').length} icon={Flag} color="bg-orange-500" />
                             <TagStatCard label="Total Votes" value="1.2M" icon={BarChart2} color="bg-purple-500" />
                             <TagStatCard label="Ad Revenue (Est)" value={`$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={DollarSign} color="bg-green-500" />
                             <TagStatCard label="Ad Impressions" value={`${(sectionMetrics.reduce((a,c)=>a+c.traffic,0)/1000000).toFixed(1)}M`} icon={Eye} color="bg-blue-500" />
                         </div>
                     </div>

                     {/* Traffic & Revenue Charts */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl flex flex-col h-[500px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-white text-sm uppercase italic tracking-wider flex items-center gap-2">
                                    <Eye size={16} className="text-blue-500" /> Traffic Distribution
                                </h3>
                            </div>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sectionMetrics} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                        <XAxis type="number" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                                        <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} width={70} />
                                        <Tooltip 
                                            cursor={{fill: '#27272a'}} 
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }} 
                                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }} 
                                            formatter={(value) => `${Number(value).toLocaleString()} Visits`} 
                                        />
                                        <Bar dataKey="traffic" radius={[0, 4, 4, 0]} barSize={20}>
                                            {sectionMetrics.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl h-[500px] flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-white text-sm uppercase italic tracking-wider flex items-center gap-2">
                                    <DollarSign size={16} className="text-green-500" /> Monetization Intelligence
                                </h3>
                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-dark-900 px-3 py-1 rounded border border-white/5">
                                    Based on Active Ads
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-auto custom-scrollbar rounded-xl border border-white/5 bg-dark-900/30">
                                <table className="w-full text-left">
                                    <thead className="bg-dark-900 text-[9px] font-black text-gray-500 uppercase tracking-widest sticky top-0 z-10">
                                        <tr>
                                            <th className="py-3 px-4">Section</th>
                                            <th className="py-3 px-4">Traffic (24h)</th>
                                            <th className="py-3 px-4">Active Ad Units</th>
                                            <th className="py-3 px-4 text-right">Blended CPM</th>
                                            <th className="py-3 px-4 text-right">Est. Daily Rev</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-xs font-bold text-gray-300">
                                        {sectionMetrics.map((sec, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 flex items-center gap-3">
                                                    {sec.name}
                                                </td>
                                                <td className="py-4 px-4 text-white tabular-nums">{sec.traffic.toLocaleString()}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-1">
                                                        {sec.ads.map((ad: any) => (
                                                            <span key={ad} className="text-[8px] uppercase font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                                                                {ad}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right tabular-nums text-yellow-500">${sec.cpm.toFixed(2)}</td>
                                                <td className="py-4 px-4 text-right tabular-nums text-green-400 font-black">${sec.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-dark-900/80 border-t border-white/10">
                                        <tr>
                                            <td colSpan={4} className="py-3 px-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Projected Revenue (24h)</td>
                                            <td className="py-3 px-4 text-right text-lg font-black text-white">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                     </div>
                 </div>
            )}

            {/* --- LEADERBOARD --- */}
            {activeTab === 'leaderboard' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-white text-lg uppercase italic tracking-tight flex items-center gap-2">
                                <Crown className="text-yellow-500" size={20}/> Weekly Prizes
                            </h3>
                            <div className="px-3 py-1 rounded bg-dark-900 border border-white/5 text-[10px] font-bold text-gray-400 uppercase">
                                Context: {adminMode.toUpperCase()}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { place: 'Top 3 (1-3)', key: 'first', color: 'text-yellow-500', icon: Trophy },
                                { place: 'Top 20 (4-20)', key: 'second', color: 'text-gray-300', icon: Trophy },
                                { place: 'Top 50 (21-50)', key: 'third', color: 'text-orange-500', icon: Trophy },
                            ].map(item => {
                                const modeKey = adminMode === 'adult' ? 'naughty' : 'dating';
                                const val = settings.leaderboard?.[modeKey]?.[item.key] || 0;
                                return (
                                    <div key={item.key} className="bg-dark-900/50 rounded-xl p-6 border border-white/5 relative group">
                                        <item.icon className={`absolute top-4 right-4 ${item.color} opacity-20`} size={48} />
                                        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${item.color}`}>{item.place}</p>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={val}
                                                onChange={(e) => updateLeaderboardPrize(item.key as any, e.target.value)}
                                                className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-3 text-white font-black text-xl outline-none focus:border-brand-500"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">LSC</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl">
                        <h3 className="font-black text-white text-lg uppercase italic tracking-tight mb-4">Current Leaders Preview</h3>
                        <div className="overflow-hidden rounded-xl border border-white/5">
                            <table className="w-full text-left">
                                <thead className="bg-dark-900 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-4">Rank</th>
                                        <th className="p-4">User</th>
                                        <th className="p-4 text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm font-bold text-gray-300">
                                    {[1,2,3,4,5].map(i => (
                                        <tr key={i} className="hover:bg-white/5">
                                            <td className="p-4">#{i}</td>
                                            <td className="p-4 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-700"></div> User_{i}
                                            </td>
                                            <td className="p-4 text-right tabular-nums text-white">{(10000 - i * 500).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CONTESTS --- */}
            {activeTab === 'contests' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-white text-lg uppercase italic tracking-tight flex items-center gap-2">
                            <Flag className="text-orange-500" size={20}/> Active Campaigns
                        </h3>
                        <button 
                            onClick={() => setIsCreateContestOpen(!isCreateContestOpen)}
                            className="bg-white text-black px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all flex items-center gap-2"
                        >
                            <Plus size={14} /> Create Contest
                        </button>
                    </div>

                    {isCreateContestOpen && (
                        <div className="bg-dark-800 border border-brand-500/50 rounded-2xl p-6 shadow-2xl mb-8 animate-in fade-in slide-in-from-top-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Title</label>
                                    <input type="text" value={newContest.title} onChange={e => setNewContest({...newContest, title: e.target.value})} className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-bold outline-none focus:border-brand-500" placeholder="e.g. Summer Vibes" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Hashtag</label>
                                    <input type="text" value={newContest.hashtag} onChange={e => setNewContest({...newContest, hashtag: e.target.value})} className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-bold outline-none focus:border-brand-500" placeholder="#summer" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Reward Pool (LSC)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            max="5000"
                                            value={newContest.rewardPool} 
                                            onChange={e => setNewContest({...newContest, rewardPool: e.target.value})} 
                                            className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-bold outline-none focus:border-brand-500" 
                                            placeholder="5000" 
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-500 uppercase">Max 5000</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Duration (Days)</label>
                                    <input type="number" value={newContest.days} onChange={e => setNewContest({...newContest, days: parseInt(e.target.value)})} className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-bold outline-none focus:border-brand-500" placeholder="7" />
                                </div>

                                {/* Dynamic Requirements */}
                                <div className="md:col-span-2">
                                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Requirements</label>
                                     <div className="flex gap-2 mb-3">
                                         <input 
                                             type="text" 
                                             value={reqInput}
                                             onChange={(e) => setReqInput(e.target.value)}
                                             placeholder="e.g. Must include video..." 
                                             className="flex-1 bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-bold outline-none focus:border-brand-500"
                                             onKeyDown={(e) => e.key === 'Enter' && handleAddRequirement()}
                                         />
                                         <button onClick={handleAddRequirement} className="bg-dark-700 hover:bg-dark-600 text-white px-4 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                                             <Plus size={14} /> Add
                                         </button>
                                     </div>
                                     <div className="flex flex-wrap gap-2">
                                         {newContest.requirements.map((req, idx) => (
                                             <div key={idx} className="flex items-center gap-2 bg-dark-900 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300">
                                                 <CheckSquare size={12} className="text-brand-500" />
                                                 {req}
                                                 <button onClick={() => handleRemoveRequirement(idx)} className="text-gray-500 hover:text-red-500 ml-1"><X size={12}/></button>
                                             </div>
                                         ))}
                                         {newContest.requirements.length === 0 && <span className="text-[10px] text-gray-500 italic px-1">No requirements added yet.</span>}
                                     </div>
                                </div>

                                <div className="md:col-span-2">
                                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Description</label>
                                     <textarea value={newContest.description} onChange={e => setNewContest({...newContest, description: e.target.value})} className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-medium outline-none focus:border-brand-500 h-24 resize-none" placeholder="Contest rules and details..."></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsCreateContestOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white">Cancel</button>
                                <button onClick={handleCreateContest} className="px-6 py-2 bg-brand-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-brand-500">Launch</button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {contests.map(contest => (
                            <ContestCard key={contest.id} contest={contest} onDelete={handleDeleteContest} />
                        ))}
                        {contests.length === 0 && <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase text-xs tracking-widest border-2 border-dashed border-dark-700 rounded-xl">No active contests.</div>}
                    </div>
                </div>
            )}

            {/* --- SETTINGS (Engagement Specific) --- */}
            {activeTab === 'settings' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                     <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl">
                        <h3 className="font-black text-white text-lg uppercase italic tracking-tight mb-6 flex items-center gap-2">
                            <Zap className="text-yellow-500" size={20}/> Reward Configuration
                        </h3>
                        <p className="text-xs text-gray-400 mb-6">Quickly adjust engagement rewards from here. These sync with the main Points Settings.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             <div>
                                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Like Reward</label>
                                 <div className="relative">
                                     <input type="number" value={pointsSettings?.likeReward || 0} onChange={(e) => updatePoints('likeReward', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white font-bold outline-none focus:border-brand-500" />
                                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">PTS</span>
                                 </div>
                             </div>
                             <div>
                                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Comment Reward</label>
                                 <div className="relative">
                                     <input type="number" value={pointsSettings?.commentReward || 0} onChange={(e) => updatePoints('commentReward', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white font-bold outline-none focus:border-brand-500" />
                                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">PTS</span>
                                 </div>
                             </div>
                             <div>
                                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Contest Entry</label>
                                 <div className="relative">
                                     <input type="number" value={pointsSettings?.contestUploadReward || 0} onChange={(e) => updatePoints('contestUploadReward', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white font-bold outline-none focus:border-brand-500" />
                                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">PTS</span>
                                 </div>
                             </div>
                        </div>
                     </div>
                </div>
            )}
        </div>
    );
}
