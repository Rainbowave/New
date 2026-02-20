
import React, { useState, useEffect } from 'react';
import { 
    Save, Gift, AlertCircle, BarChart2, Upload, Heart, Users,
    Loader2, CheckCircle, Crown, Coins, Info, Plus, Trash2, Trophy, Calculator, Ticket,
    TrendingUp, Activity
} from 'lucide-react';
import { db } from '../../services/db';

const SettingCard = ({ title, icon: Icon, children, color = "text-brand-500", bgColor = "bg-brand-500/10", borderColor = "border-brand-500/20" }: any) => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl h-full flex flex-col group hover:border-brand-500/30 transition-all">
        <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
            <div className={`p-2 rounded-lg ${color} ${bgColor} ${borderColor} border`}>
                <Icon size={20} />
            </div>
            <h3 className="font-black text-white text-sm uppercase tracking-wide">{title}</h3>
        </div>
        <div className="space-y-5 flex-1">
            {children}
        </div>
    </div>
);

const InputGroup = ({ label, value, onChange, suffix, help }: { label: string, value: string | number, onChange: (val: string) => void, suffix?: string, help?: string }) => (
    <div className="mb-4">
        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
        <div className="relative">
            <input 
                type="number" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-dark-900 border border-white/5 rounded-lg px-4 py-3 text-white font-bold text-sm focus:border-brand-500 outline-none transition-all"
            />
            {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500 uppercase tracking-widest">{suffix}</span>}
        </div>
        {help && <p className="text-[9px] text-gray-600 mt-1.5 ml-1 font-medium">{help}</p>}
    </div>
);

// Defined Activity Profiles for simulation
const PROFILES = {
    conservative: { label: 'Conservative', posts: 0.5, likes: 20, comments: 2, views: 10, streams: 0.1 },
    moderate: { label: 'Moderate', posts: 2, likes: 50, comments: 10, views: 50, streams: 0.5 },
    aggressive: { label: 'High Velocity', posts: 5, likes: 200, comments: 50, views: 200, streams: 2 }
};

export default function AdminPointsSettings() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    // Simulation State
    const [activeProfile, setActiveProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

    useEffect(() => {
        const load = async () => {
            await new Promise(r => setTimeout(r, 600));
            setSettings(db.getPointsSettings());
            setLoading(false);
        };
        load();
    }, []);

    const handleChange = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: parseFloat(value) || value }));
    };
    
    const handleLevelChange = (index: number, field: string, value: any) => {
        const newLevels = [...settings.levels];
        newLevels[index] = { ...newLevels[index], [field]: field === 'name' ? value : parseFloat(value) };
        setSettings((prev: any) => ({ ...prev, levels: newLevels }));
    };

    const handleAddLevel = () => {
        const newId = settings.levels.length > 0 ? Math.max(...settings.levels.map((l: any) => l.id)) + 1 : 1;
        const lastXp = settings.levels.length > 0 ? settings.levels[settings.levels.length - 1].xp : 0;
        const newLevel = { 
            id: newId, 
            name: `Rank ${newId}`, 
            xp: lastXp + 5000, 
            lossRecovery: 0, 
            createBonus: 0, 
            postBonus: 0 
        };
        setSettings((prev: any) => ({ ...prev, levels: [...prev.levels, newLevel] }));
    };

    const handleRemoveLevel = (index: number) => {
        const newLevels = [...settings.levels];
        newLevels.splice(index, 1);
        setSettings((prev: any) => ({ ...prev, levels: newLevels }));
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        db.savePointsSettings(settings);
        setSuccess(true);
        setSaving(false);
        setTimeout(() => setSuccess(false), 3000);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toLocaleString();
    };

    // Calculate cost per single user per day based on profile
    const calculateDailyPerUser = () => {
        if (!settings) return 0;
        const p = PROFILES[activeProfile];
        const s = settings;
        
        let total = 0;
        // Weighted average of content creation types
        const avgPostReward = ((s.postGeneric || 0) + (s.postPhoto || 0) + (s.postShort || 0)) / 3;
        
        total += p.posts * avgPostReward;
        total += p.likes * (s.likeReward || 0);
        total += p.comments * (s.commentReward || 0);
        total += p.views * (s.videoWatchReward || 0);
        total += p.streams * (s.liveStreamReward || 0);
        
        return total;
    };

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;

    const dailyPerUser = calculateDailyPerUser();

    // Unit Economics Data
    const unitEconomics = [
        { label: '1k Posts', cost: (settings.postGeneric || 0) * 1000 },
        { label: '1k Likes', cost: (settings.likeReward || 0) * 1000 },
        { label: '1k Views', cost: (settings.videoWatchReward || 0) * 1000 },
        { label: '1k Comments', cost: (settings.commentReward || 0) * 1000 },
    ];

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
                        <Coins className="text-brand-500" size={32} />
                        Points System
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Define earning rates, rewards, and gamification logic.
                    </p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-brand-600 hover:bg-brand-500 text-white font-black py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Config
                </button>
            </div>

            {success && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4 mb-8 flex items-center gap-3 text-green-400 animate-in fade-in">
                    <CheckCircle size={20} />
                    <span className="font-bold">Points configuration updated successfully.</span>
                </div>
            )}

            {/* Row 1: Contest Rewards & Global Simulator */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                {/* Contest Rewards */}
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                        <div className="p-2 rounded-lg text-yellow-500 bg-yellow-500/10 border-yellow-500/20 border">
                            <Trophy size={20} />
                        </div>
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">Contest Rewards</h3>
                    </div>
                    
                    <div className="space-y-4">
                         <InputGroup label="User Upload" value={settings.contestUploadReward || 50} onChange={v => handleChange('contestUploadReward', v)} suffix="PTS" help="Points for submitting an entry." />
                         <div className="grid grid-cols-2 gap-4">
                              <InputGroup label="Heat (Like)" value={settings.contestHeatReward || 2} onChange={v => handleChange('contestHeatReward', v)} suffix="PTS" />
                              <InputGroup label="Comment" value={settings.contestCommentReward || 5} onChange={v => handleChange('contestCommentReward', v)} suffix="PTS" />
                         </div>
                         <InputGroup label="Viewer" value={settings.contestViewReward || 1} onChange={v => handleChange('contestViewReward', v)} suffix="PTS" help="Points for viewing contest entry." />
                    </div>
                </div>

                {/* Updated Simulator */}
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-6 border-b border-dark-700 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg text-blue-400 bg-blue-500/10 border-blue-500/20 border">
                                <Calculator size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-white text-sm uppercase tracking-wide">Cost Simulator</h3>
                                <p className="text-[9px] text-gray-500 font-bold uppercase">Based on current field values</p>
                            </div>
                        </div>
                        <select 
                            value={activeProfile}
                            onChange={(e) => setActiveProfile(e.target.value as any)}
                            className="bg-dark-900 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider outline-none focus:border-brand-500"
                        >
                            <option value="conservative">Conservative Profile</option>
                            <option value="moderate">Moderate Profile</option>
                            <option value="aggressive">High Velocity Profile</option>
                        </select>
                    </div>
                    
                    {/* Unit Economics (Per 1k Actions) */}
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        {unitEconomics.map((item, i) => (
                            <div key={i} className="bg-dark-900/50 rounded-lg p-2 border border-white/5 text-center">
                                <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{item.label}</span>
                                <span className="text-xs font-bold text-brand-400">{formatNumber(item.cost)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto">
                         <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead>
                                    <tr className="text-[9px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                                        <th className="pb-2 text-left">Timeline</th>
                                        <th className="pb-2 px-2">1k Users</th>
                                        <th className="pb-2 px-2">5k Users</th>
                                        <th className="pb-2 pl-2 text-white">10k Users</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs font-bold text-gray-300">
                                    <tr className="border-b border-white/5 group hover:bg-white/5">
                                        <td className="py-3 text-left text-gray-400 font-black uppercase text-[10px]">1 Day</td>
                                        <td className="py-3 px-2">{formatNumber(dailyPerUser * 1000)}</td>
                                        <td className="py-3 px-2">{formatNumber(dailyPerUser * 5000)}</td>
                                        <td className="py-3 pl-2 text-white font-black">{formatNumber(dailyPerUser * 10000)}</td>
                                    </tr>
                                    <tr className="border-b border-white/5 group hover:bg-white/5">
                                        <td className="py-3 text-left text-gray-400 font-black uppercase text-[10px]">1 Week</td>
                                        <td className="py-3 px-2">{formatNumber(dailyPerUser * 1000 * 7)}</td>
                                        <td className="py-3 px-2">{formatNumber(dailyPerUser * 5000 * 7)}</td>
                                        <td className="py-3 pl-2 text-white font-black">{formatNumber(dailyPerUser * 10000 * 7)}</td>
                                    </tr>
                                    <tr className="group hover:bg-white/5">
                                        <td className="py-3 text-left text-gray-400 font-black uppercase text-[10px]">1 Month</td>
                                        <td className="py-3 px-2">{formatNumber(dailyPerUser * 1000 * 30)}</td>
                                        <td className="py-3 px-2">{formatNumber(dailyPerUser * 5000 * 30)}</td>
                                        <td className="py-3 pl-2 text-white font-black">{formatNumber(dailyPerUser * 10000 * 30)}</td>
                                    </tr>
                                </tbody>
                            </table>
                         </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Content Creation, Engagement, Growth */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                 
                 {/* 1. Content Creation */}
                 <SettingCard title="Content Creation" icon={Upload} color="text-red-500" bgColor="bg-red-500/10" borderColor="border-red-500/20">
                    <InputGroup label="Standard Post" value={settings.postGeneric} onChange={v => handleChange('postGeneric', v)} suffix="PTS" />
                    <InputGroup label="Video Upload" value={settings.postVideo} onChange={v => handleChange('postVideo', v)} suffix="PTS" />
                    <InputGroup label="Live Stream" value={settings.liveStreamReward} onChange={v => handleChange('liveStreamReward', v)} suffix="PTS / 30M" />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Short" value={settings.postShort} onChange={v => handleChange('postShort', v)} suffix="PTS" />
                        <InputGroup label="Photo" value={settings.postPhoto} onChange={v => handleChange('postPhoto', v)} suffix="PTS" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <InputGroup label="Comic" value={settings.postComic} onChange={v => handleChange('postComic', v)} suffix="PTS" />
                        <InputGroup label="Collection" value={settings.postCollection} onChange={v => handleChange('postCollection', v)} suffix="PTS" />
                    </div>
                </SettingCard>

                {/* 2. Engagement Activity */}
                <SettingCard title="Engagement Activity" icon={Heart} color="text-pink-500" bgColor="bg-pink-500/10" borderColor="border-pink-500/20">
                    <InputGroup label="Collection Purchase" value={settings.collectionBuyReward} onChange={v => handleChange('collectionBuyReward', v)} suffix="PTS" />
                    <InputGroup label="Watch Stream" value={settings.streamWatchReward} onChange={v => handleChange('streamWatchReward', v)} suffix="PTS / 15M" />
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                        <InputGroup label="Watch Video" value={settings.videoWatchReward} onChange={v => handleChange('videoWatchReward', v)} suffix="PTS / VIEW" />
                        <InputGroup label="Read Article" value={settings.articleViewReward} onChange={v => handleChange('articleViewReward', v)} suffix="PTS / VIEW" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                        <InputGroup label="Like" value={settings.likeReward} onChange={v => handleChange('likeReward', v)} suffix="PTS" />
                        <InputGroup label="Comment" value={settings.commentReward} onChange={v => handleChange('commentReward', v)} suffix="PTS" />
                    </div>
                </SettingCard>

                {/* 3. Community Growth */}
                <SettingCard title="Community Growth" icon={Users} color="text-brand-second" bgColor="bg-brand-second/10" borderColor="border-brand-second/20">
                    <InputGroup label="Referral Reward" value={settings.referralReward} onChange={v => handleChange('referralReward', v)} suffix="PTS" />
                    <InputGroup label="Base Price for $1" value={settings.pointsPerDollar} onChange={v => handleChange('pointsPerDollar', v)} suffix="PTS" />
                    <InputGroup label="Daily Earning Cap" value={settings.dailyCap} onChange={v => handleChange('dailyCap', v)} suffix="PTS" />
                </SettingCard>
            </div>

            {/* Row 3: Tips, Fees, Polls */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* 4. Tips & Conversions */}
                <SettingCard title="Tips & Conversions" icon={Gift} color="text-pink-500" bgColor="bg-pink-500/10" borderColor="border-pink-500/20">
                    <InputGroup label="Tip Reward Rate" value={settings.tipRewardRate} onChange={v => handleChange('tipRewardRate', v)} suffix="PTS / $1" />
                </SettingCard>

                {/* 5. Fees & Limits */}
                <SettingCard title="Fees & Limits" icon={AlertCircle} color="text-red-500" bgColor="bg-red-500/10" borderColor="border-red-500/20">
                    <InputGroup label="% Tip Fee" value={settings.tipFee} onChange={v => handleChange('tipFee', v)} suffix="%" />
                    <InputGroup label="User Fee" value={settings.pollCreationFee} onChange={v => handleChange('pollCreationFee', v)} suffix="LSC" />
                    <InputGroup label="PreStar Commission" value={settings.prestarCommission} onChange={v => handleChange('prestarCommission', v)} suffix="%" help="Site cut from basic member earnings." />
                    <InputGroup label="LuciStar Commission" value={settings.lucistarCommission} onChange={v => handleChange('lucistarCommission', v)} suffix="%" help="Site cut from premium member earnings." />
                </SettingCard>
                
                {/* 6. Polls & Voting */}
                 <SettingCard title="Polls & Voting" icon={BarChart2} color="text-brand-500" bgColor="bg-brand-500/10" borderColor="border-brand-500/20">
                    <InputGroup label="Post Reward" value={settings.pollPostReward} onChange={v => handleChange('pollPostReward', v)} suffix="PTS" />
                    
                    <div className="pt-4 border-t border-white/5">
                        <label className="text-[10px] font-black text-white uppercase tracking-widest mb-3 block flex items-center gap-1"><Ticket size={12}/> Ticket Pool Distribution</label>
                        <div className="space-y-3">
                            <InputGroup label="User (Creator) Share" value={settings.pollUserShare} onChange={v => handleChange('pollUserShare', v)} suffix="%" />
                            <InputGroup label="Community (Winners) Share" value={settings.pollCommunityShare} onChange={v => handleChange('pollCommunityShare', v)} suffix="%" />
                            <InputGroup label="Site (Platform) Share" value={settings.pollSiteShare} onChange={v => handleChange('pollSiteShare', v)} suffix="%" />
                        </div>
                    </div>
                </SettingCard>

            </div>

            {/* Leveling System */}
            <div className="mt-8 bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6 border-b border-dark-700 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-900/20 rounded-lg text-yellow-500 border border-yellow-500/20">
                            <Crown size={20} />
                        </div>
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">Level Progression</h3>
                    </div>
                    <button 
                        onClick={handleAddLevel}
                        className="flex items-center gap-2 bg-dark-900 hover:bg-dark-700 border border-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-white transition-all hover:border-brand-500/50"
                    >
                        <Plus size={12} /> Add New Level
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-dark-700">
                                <th className="pb-4 pl-2">Level ID</th>
                                <th className="pb-4">Rank Name</th>
                                <th className="pb-4">XP Required</th>
                                <th className="pb-4">Loss Recovery %</th>
                                <th className="pb-4">Create Bonus %</th>
                                <th className="pb-4">Post Bonus %</th>
                                <th className="pb-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {settings.levels.map((level: any, i: number) => (
                                <tr key={level.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-2 font-mono text-gray-400 font-bold">{level.id}</td>
                                    <td className="py-4">
                                        <input 
                                            type="text" 
                                            value={level.name} 
                                            onChange={e => handleLevelChange(i, 'name', e.target.value)}
                                            className="bg-dark-900 border border-white/5 rounded px-3 py-2 text-xs font-bold text-white outline-none focus:border-brand-500 w-32"
                                        />
                                    </td>
                                    <td className="py-4">
                                        <input 
                                            type="number" 
                                            value={level.xp} 
                                            onChange={e => handleLevelChange(i, 'xp', e.target.value)}
                                            className="bg-dark-900 border border-white/5 rounded px-3 py-2 text-xs font-bold text-white outline-none focus:border-brand-500 w-24"
                                        />
                                    </td>
                                    <td className="py-4">
                                        <input 
                                            type="number" 
                                            value={level.lossRecovery} 
                                            onChange={e => handleLevelChange(i, 'lossRecovery', e.target.value)}
                                            className="bg-dark-900 border border-white/5 rounded px-3 py-2 text-xs font-bold text-white outline-none focus:border-brand-500 w-20"
                                        />
                                    </td>
                                    <td className="py-4">
                                        <input 
                                            type="number" 
                                            value={level.createBonus} 
                                            onChange={e => handleLevelChange(i, 'createBonus', e.target.value)}
                                            className="bg-dark-900 border border-white/5 rounded px-3 py-2 text-xs font-bold text-white outline-none focus:border-brand-500 w-20"
                                        />
                                    </td>
                                    <td className="py-4">
                                        <input 
                                            type="number" 
                                            value={level.postBonus} 
                                            onChange={e => handleLevelChange(i, 'postBonus', e.target.value)}
                                            className="bg-dark-900 border border-white/5 rounded px-3 py-2 text-xs font-bold text-white outline-none focus:border-brand-500 w-20"
                                        />
                                    </td>
                                    <td className="py-4 text-right pr-2">
                                        <button 
                                            onClick={() => handleRemoveLevel(i)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                            title="Remove Level"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
