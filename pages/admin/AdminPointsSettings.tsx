
import React, { useState, useEffect } from 'react';
import { 
    Save, Gift, AlertCircle, BarChart2, Upload, Heart, Users,
    Loader2, CheckCircle, Crown, Coins, Plus, Trash2, Trophy, Ticket,
    Calculator, Info, Activity, User, DollarSign
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

// Cost Input Group: Takes Cost Per 1k ($) and converts to Points
// Formula: Points = (Cost / 1000) * PointsPerDollar
const CostInputGroup = ({ label, settingKey, pointsValue, pointsPerDollar, onChange, help }: any) => {
    // Calculate initial Cost per 1k Actions based on current points settings
    // Reverse Formula: Cost = (Points * 1000) / PointsPerDollar
    const calculateCost = (pts: number, ppd: number) => {
        if (!ppd) return '0.000';
        return ((pts * 1000) / ppd).toFixed(3);
    };

    const [localCost, setLocalCost] = useState(calculateCost(pointsValue, pointsPerDollar));

    useEffect(() => {
         setLocalCost(calculateCost(pointsValue, pointsPerDollar));
    }, [pointsValue, pointsPerDollar]);

    const handleCostChange = (val: string) => {
        setLocalCost(val);
        const cost = parseFloat(val);
        if (!isNaN(cost)) {
            // Convert CPM ($) to Points per Action
            const newPoints = (cost / 1000) * pointsPerDollar;
            onChange(settingKey, newPoints);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
            <div className="relative group">
                <input 
                    type="number" 
                    value={localCost}
                    onChange={(e) => handleCostChange(e.target.value)}
                    className="w-full bg-dark-900 border border-white/5 rounded-lg px-8 py-3 text-white font-bold text-sm focus:border-brand-500 outline-none transition-all"
                    step="0.001"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-green-500">$</span>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
                     <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Cost / 1k</span>
                     <span className="text-[9px] font-bold text-brand-500">{pointsValue.toFixed(2)} Pts</span>
                </div>
            </div>
            {help && <p className="text-[9px] text-gray-600 mt-1.5 ml-1 font-medium">{help}</p>}
        </div>
    );
};

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

export default function AdminPointsSettings() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userLiquidity, setUserLiquidity] = useState(0);

    useEffect(() => {
        const load = async () => {
            await new Promise(r => setTimeout(r, 600));
            setSettings(db.getPointsSettings());
            
            // Calculate User Liquidity (Total Points in Circulation)
            const allUsers = db.getUsers();
            // Assuming user object has walletBalance, if not default to 0
            const totalPoints = allUsers.reduce((acc: number, user: any) => acc + (user.walletBalance || 0), 0);
            setUserLiquidity(totalPoints);
            
            setLoading(false);
        };
        load();
    }, []);

    const handleChange = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: parseFloat(value) || value }));
    };
    
    // Handler for the cost-based inputs
    const handlePointsChange = (key: string, value: number) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
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

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;

    const ppd = settings.pointsPerDollar || 100;
    const liabilityValue = userLiquidity / ppd;

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
                        <Coins className="text-brand-500" size={32} />
                        Points System
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Define earning rates based on Cost Per Thousand (CPM) logic.
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
            
            {/* Liquidity Simulator Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-center">
                     <div className="absolute right-0 top-0 p-32 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                     <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="font-black text-white text-sm uppercase tracking-wide flex items-center gap-2">
                             <Activity size={18} className="text-blue-500"/> Economy Pulse
                        </h3>
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-dark-900 px-2 py-1 rounded border border-white/5">
                            Real-time Simulation
                        </span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-8 relative z-10">
                         <div>
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">User Liquidity</p>
                             <h2 className="text-4xl font-black text-white tabular-nums tracking-tight">{userLiquidity.toLocaleString()}</h2>
                             <p className="text-[9px] text-gray-500 mt-2 font-medium">Total points held in user wallets.</p>
                         </div>
                         <div className="border-l border-white/5 pl-8">
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Liability Value</p>
                             <h2 className="text-4xl font-black text-green-400 tabular-nums tracking-tight">${liabilityValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
                             <p className="text-[9px] text-gray-500 mt-2 font-medium">Fiat equivalent based on current PPD.</p>
                         </div>
                     </div>
                </div>
                
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl flex flex-col">
                    <h3 className="font-black text-white text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
                        <Calculator size={18} className="text-yellow-500"/> Cost Basis
                    </h3>
                    <div className="flex-1 flex flex-col justify-center">
                        <InputGroup 
                            label="Points per $1.00 USD" 
                            value={settings.pointsPerDollar} 
                            onChange={v => handleChange('pointsPerDollar', v)} 
                            suffix="PTS" 
                            help="Global exchange rate. Affects all CPM calculations and liability."
                        />
                        <div className="mt-4 p-4 bg-dark-900 rounded-xl border border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Single Point Value</span>
                            <span className="text-xl font-black text-white tabular-nums">${(1/ppd).toFixed(5)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Content Creation, Engagement, Growth (Cost Based Inputs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                 
                 {/* 1. Content Creation */}
                 <SettingCard title="Content Creation (Cost per 1k)" icon={Upload} color="text-red-500" bgColor="bg-red-500/10" borderColor="border-red-500/20">
                    <CostInputGroup label="Standard Post" settingKey="postGeneric" pointsValue={settings.postGeneric} pointsPerDollar={ppd} onChange={handlePointsChange} />
                    <CostInputGroup label="Video Upload" settingKey="postVideo" pointsValue={settings.postVideo} pointsPerDollar={ppd} onChange={handlePointsChange} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <CostInputGroup label="Short" settingKey="postShort" pointsValue={settings.postShort} pointsPerDollar={ppd} onChange={handlePointsChange} />
                        <CostInputGroup label="Photo" settingKey="postPhoto" pointsValue={settings.postPhoto} pointsPerDollar={ppd} onChange={handlePointsChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <CostInputGroup label="Comic" settingKey="postComic" pointsValue={settings.postComic || 0} pointsPerDollar={ppd} onChange={handlePointsChange} />
                        <CostInputGroup label="Collection" settingKey="postCollection" pointsValue={settings.postCollection || 0} pointsPerDollar={ppd} onChange={handlePointsChange} />
                    </div>
                </SettingCard>

                {/* 2. Engagement Activity */}
                <SettingCard title="Engagement Activity (Cost per 1k)" icon={Heart} color="text-pink-500" bgColor="bg-pink-500/10" borderColor="border-pink-500/20">
                    <CostInputGroup label="Like Action" settingKey="likeReward" pointsValue={settings.likeReward} pointsPerDollar={ppd} onChange={handlePointsChange} />
                    <CostInputGroup label="Comment Action" settingKey="commentReward" pointsValue={settings.commentReward} pointsPerDollar={ppd} onChange={handlePointsChange} />
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                        <CostInputGroup label="Watch Video" settingKey="videoWatchReward" pointsValue={settings.videoWatchReward} pointsPerDollar={ppd} onChange={handlePointsChange} />
                        <CostInputGroup label="Read Article" settingKey="articleViewReward" pointsValue={settings.articleViewReward} pointsPerDollar={ppd} onChange={handlePointsChange} />
                    </div>
                    
                    <div className="pt-2 border-t border-white/5">
                        <CostInputGroup label="Live Stream Watch (15m)" settingKey="streamWatchReward" pointsValue={settings.streamWatchReward || 0} pointsPerDollar={ppd} onChange={handlePointsChange} />
                    </div>
                </SettingCard>

                {/* 3. Community Growth */}
                <SettingCard title="Growth & Caps" icon={Users} color="text-brand-second" bgColor="bg-brand-second/10" borderColor="border-brand-second/20">
                    <CostInputGroup label="Referral Reward" settingKey="referralReward" pointsValue={settings.referralReward} pointsPerDollar={ppd} onChange={handlePointsChange} help="Cost per 1000 referrals" />
                    <div className="mt-8 pt-6 border-t border-white/5">
                         <InputGroup label="Daily Earning Cap" value={settings.dailyCap} onChange={v => handleChange('dailyCap', v)} suffix="PTS" />
                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-1"><Info size={12}/> Max daily cost: ${((settings.dailyCap/ppd)).toFixed(2)} / user</p>
                    </div>
                </SettingCard>
            </div>

            {/* Row 3: Tips, Fees, Polls */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* 4. Tips & Conversions */}
                <SettingCard title="Tips & Conversions" icon={Gift} color="text-pink-500" bgColor="bg-pink-500/10" borderColor="border-pink-500/20">
                    <InputGroup label="Tip Reward Rate" value={settings.tipRewardRate} onChange={v => handleChange('tipRewardRate', v)} suffix="PTS / $1" help="Points given to user for every $1 tipped."/>
                </SettingCard>

                {/* 5. Fees & Limits */}
                <SettingCard title="Fees & Limits" icon={AlertCircle} color="text-red-500" bgColor="bg-red-500/10" borderColor="border-red-500/20">
                    <InputGroup label="% Tip Fee" value={settings.tipFee} onChange={v => handleChange('tipFee', v)} suffix="%" />
                    <InputGroup label="Poll Creation Fee" value={settings.pollCreationFee} onChange={v => handleChange('pollCreationFee', v)} suffix="LSC" />
                </SettingCard>
                
                {/* 6. Polls & Voting */}
                 <SettingCard title="Polls & Voting (Cost per 1k)" icon={BarChart2} color="text-brand-500" bgColor="bg-brand-500/10" borderColor="border-brand-500/20">
                    <CostInputGroup label="Post Poll Reward" settingKey="pollPostReward" pointsValue={settings.pollPostReward} pointsPerDollar={ppd} onChange={handlePointsChange} />
                    
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
