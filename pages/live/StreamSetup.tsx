
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Lock, Globe, DollarSign, Copy, Check, Shield, RefreshCw, Users, Target, Info, AlertCircle, Clock, Heart, Trophy, StopCircle, Tag, Bell, X, History, BarChart2, BellRing, Crown } from 'lucide-react';
import { authService } from '../../services/authService';

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
    <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <h3 className={`text-2xl font-black tabular-nums ${color}`}>{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-dark-900 border border-white/5 ${color.replace('text-', 'text-opacity-80 ')}`}>
            <Icon size={24} />
        </div>
    </div>
);

const TipperRow = ({ rank, user, amount }: { rank: number, user: string, amount: string }) => (
    <div className="flex items-center justify-between p-3 bg-dark-900/50 rounded-xl border border-white/5 hover:border-brand-500/30 transition-all">
        <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${rank === 1 ? 'bg-yellow-500 text-black' : rank === 2 ? 'bg-gray-400 text-black' : rank === 3 ? 'bg-orange-500 text-black' : 'bg-dark-800 text-gray-500'}`}>
                {rank}
            </div>
            <span className="font-bold text-white text-sm">{user}</span>
        </div>
        <span className="font-black text-brand-400 text-xs">{amount} LSC</span>
    </div>
);

const PastStreamRow = ({ title, date, viewers, heat, pride, revenue }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors last:border-0 items-center">
        <div className="col-span-4">
            <h4 className="font-bold text-white text-sm truncate">{title}</h4>
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-wider">{date}</span>
        </div>
        <div className="col-span-2 flex items-center gap-1.5 text-xs font-bold text-gray-300">
            <Users size={12} className="text-blue-500" /> {viewers}
        </div>
        <div className="col-span-2 flex items-center gap-1.5 text-xs font-bold text-gray-300">
            <Heart size={12} className="text-red-500" /> {heat}
        </div>
        <div className="col-span-2 flex items-center gap-1.5 text-xs font-bold text-gray-300">
            <Crown size={12} className="text-brand-500" /> {pride}
        </div>
        <div className="col-span-2 text-right font-black text-yellow-500 text-sm tabular-nums">
            {revenue} LSC
        </div>
    </div>
);

export default function StreamSetup() {
    const navigate = useNavigate();
    const [streamTitle, setStreamTitle] = useState('My Awesome Stream');
    const [privacy, setPrivacy] = useState<'public' | 'private' | 'paid'>('public');
    
    // Config States
    const [price, setPrice] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [prideInterval, setPrideInterval] = useState(15);
    const [ticketGoal, setTicketGoal] = useState('');
    const [minTier, setMinTier] = useState('1');
    const [notifySubs, setNotifySubs] = useState(true);

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [copied, setCopied] = useState(false);
    const [streamKey, setStreamKey] = useState('');
    
    // Live State
    const [isLive, setIsLive] = useState(false);
    const [duration, setDuration] = useState(0);
    const [stats, setStats] = useState({
        viewers: 0,
        likes: 0,
        tips: 0,
        pride: 0
    });

    const currentUser = authService.getCurrentUser();
    const canMonetize = currentUser?.userSettings?.canMonetize ?? (currentUser?.role === 'creator' || currentUser?.role === 'admin');
    const maxQuality = currentUser?.creatorSettings?.maxStreamQuality || '720p';

    const rtmpUrl = "rtmp://ingest.lucisin.com/app";

    useEffect(() => {
        generateKey();
    }, []);

    useEffect(() => {
        // Auto-set price for Ticket mode if empty
        if (privacy === 'paid' && !price) {
            setPrice('50'); // Default Ticket Price
        }
    }, [privacy]);

    useEffect(() => {
        let timer: any;
        let sim: any;

        if (isLive) {
            timer = setInterval(() => setDuration(d => d + 1), 1000);
            
            // Simulate engagement
            sim = setInterval(() => {
                setStats(prev => ({
                    viewers: Math.min(prev.viewers + Math.floor(Math.random() * 5), 5000),
                    likes: prev.likes + Math.floor(Math.random() * 12),
                    tips: prev.tips + (Math.random() > 0.8 ? Math.floor(Math.random() * 50) : 0),
                    pride: prev.pride + Math.floor(Math.random() * 2)
                }));
            }, 2000);
        }

        return () => {
            clearInterval(timer);
            clearInterval(sim);
        };
    }, [isLive]);

    const generateKey = () => {
        const randomKey = `live_${Math.floor(Math.random() * 9999)}_` + Math.random().toString(36).substring(2, 15);
        setStreamKey(randomKey);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(streamKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const toggleLive = () => {
        if (!isLive) {
            // Start Stream
            setStats({ viewers: 0, likes: 0, tips: 0, pride: 0 });
            setDuration(0);
            setIsLive(true);
        } else {
            // End Stream
            if (window.confirm("End the broadcast?")) {
                setIsLive(false);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-[1600px] mx-auto py-10 px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2 flex items-center gap-3">
                        <Video className="text-red-500" size={36} /> Stream Dashboard
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Configure your signal and monitor performance.
                    </p>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isLive ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-dark-800 border-dark-600 text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                        {isLive ? 'On Air' : 'Offline'}
                    </div>
                    
                    <button 
                        onClick={toggleLive}
                        className={`px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 ${isLive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                    >
                        {isLive ? <><StopCircle size={18}/> End Stream</> : <><Video size={18}/> Go Live</>}
                    </button>
                </div>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={Clock} label="Duration" value={formatTime(duration)} color="text-white" />
                <StatCard icon={Users} label="Live Viewers" value={stats.viewers.toLocaleString()} color="text-blue-400" />
                <StatCard icon={Heart} label="Heat Generated" value={stats.likes.toLocaleString()} color="text-red-500" />
                <StatCard icon={DollarSign} label="Session Revenue" value={`${stats.tips.toLocaleString()} LSC`} color="text-yellow-500" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                
                {/* Left Column: Config & Connection */}
                <div className="xl:col-span-2 space-y-8">
                    
                    {/* Stream Settings */}
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <Video size={20} className="text-gray-400" />
                            <h2 className="text-lg font-bold text-white uppercase">Broadcast Settings</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Stream Title</label>
                                <input 
                                    type="text" 
                                    value={streamTitle}
                                    onChange={e => setStreamTitle(e.target.value)}
                                    placeholder="Enter an engaging title..." 
                                    className="w-full bg-dark-900 border border-dark-600 rounded-xl p-4 text-white font-bold focus:border-brand-500 outline-none transition-all disabled:opacity-50"
                                    disabled={isLive}
                                />
                            </div>

                            {/* Tag Input */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Tag size={12} /> Tags
                                </label>
                                <div className="bg-dark-900 border border-dark-600 rounded-xl p-2 flex flex-wrap gap-2 focus-within:border-brand-500 transition-colors">
                                    {tags.map(tag => (
                                        <span key={tag} className="bg-brand-500/20 text-brand-500 px-2 py-1 rounded text-[10px] font-black uppercase flex items-center gap-1">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-white"><X size={10} /></button>
                                        </span>
                                    ))}
                                    <input 
                                        type="text" 
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder={tags.length === 0 ? "Add tags (Enter)" : ""}
                                        className="bg-transparent text-white text-xs font-bold outline-none flex-1 p-2"
                                        disabled={isLive}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Access Level</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button onClick={() => setPrivacy('public')} disabled={isLive} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${privacy === 'public' ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-900 border-dark-600 text-gray-400 hover:text-white'}`}>
                                            <Globe size={18} /> <span className="text-[10px] font-black uppercase">Public</span>
                                        </button>
                                        <button onClick={() => canMonetize && setPrivacy('private')} disabled={!canMonetize || isLive} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${privacy === 'private' ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-900 border-dark-600 text-gray-500'} ${!canMonetize ? 'opacity-50' : 'hover:text-white'}`}>
                                            <Lock size={18} /> <span className="text-[10px] font-black uppercase">Subs</span>
                                        </button>
                                        <button onClick={() => canMonetize && setPrivacy('paid')} disabled={!canMonetize || isLive} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${privacy === 'paid' ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-900 border-dark-600 text-gray-500'} ${!canMonetize ? 'opacity-50' : 'hover:text-white'}`}>
                                            <DollarSign size={18} /> <span className="text-[10px] font-black uppercase">Ticket</span>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="md:col-span-8">
                                    {/* Conditional Settings based on Access Level */}
                                    {privacy === 'public' && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Audience</label>
                                                <div className="relative">
                                                    <Target className="absolute left-3 top-3.5 text-gray-500" size={16} />
                                                    <input 
                                                        type="text" 
                                                        value={targetAudience}
                                                        onChange={e => setTargetAudience(e.target.value)}
                                                        placeholder="e.g. Gamers, Night Owls" 
                                                        className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-3 text-white focus:border-brand-500 outline-none font-bold disabled:opacity-50"
                                                        disabled={isLive}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">Pride Reminder <Clock size={12}/></label>
                                                <input 
                                                    type="number" 
                                                    value={prideInterval}
                                                    onChange={e => setPrideInterval(Number(e.target.value))}
                                                    className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white focus:border-brand-500 outline-none font-bold disabled:opacity-50"
                                                    disabled={isLive}
                                                />
                                                <span className="text-[9px] text-gray-600 uppercase font-bold mt-1 block">Minutes</span>
                                            </div>
                                        </div>
                                    )}

                                    {privacy === 'private' && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">Min Tier <Lock size={12}/></label>
                                                <select 
                                                    value={minTier}
                                                    onChange={e => setMinTier(e.target.value)}
                                                    className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white focus:border-brand-500 outline-none font-bold disabled:opacity-50"
                                                    disabled={isLive}
                                                >
                                                    <option value="1">Tier 1 (Spark)</option>
                                                    <option value="2">Tier 2 (Flame)</option>
                                                    <option value="3">Tier 3 (Inferno)</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center h-full pt-6">
                                                <div 
                                                    className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${notifySubs ? 'bg-brand-500/10 border-brand-500' : 'bg-dark-900 border-dark-600'}`}
                                                    onClick={() => !isLive && setNotifySubs(!notifySubs)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <BellRing size={18} className={notifySubs ? 'text-brand-500' : 'text-gray-500'} />
                                                        <span className={`text-xs font-bold uppercase tracking-wide ${notifySubs ? 'text-brand-500' : 'text-gray-500'}`}>Notify Subs</span>
                                                    </div>
                                                    <div className={`w-8 h-4 rounded-full relative transition-colors ${notifySubs ? 'bg-brand-500' : 'bg-dark-700'}`}>
                                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${notifySubs ? 'left-4.5' : 'left-0.5'}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {privacy === 'paid' && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                                            <div>
                                                <label className="block text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <DollarSign size={14} /> Ticket Price (LSC)
                                                </label>
                                                <input 
                                                    type="number" 
                                                    value={price}
                                                    onChange={e => setPrice(e.target.value)}
                                                    placeholder="Amount" 
                                                    className="w-full bg-dark-900 border border-yellow-500/50 rounded-xl py-3 pl-4 pr-3 text-yellow-500 focus:border-yellow-500 outline-none font-black text-lg disabled:opacity-50"
                                                    disabled={isLive}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <Trophy size={14} /> Ticket Goal
                                                </label>
                                                <input 
                                                    type="number" 
                                                    value={ticketGoal}
                                                    onChange={e => setTicketGoal(e.target.value)}
                                                    placeholder="Target Sales" 
                                                    className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white focus:border-brand-500 outline-none font-bold disabled:opacity-50"
                                                    disabled={isLive}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Connection Info */}
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl">
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <Shield size={20} className="text-gray-400" />
                                <h2 className="text-lg font-bold text-white uppercase">Connection Keys</h2>
                            </div>
                            <button onClick={generateKey} disabled={isLive} className="text-brand-500 hover:text-white transition-colors disabled:opacity-50"><RefreshCw size={16} /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Server URL</label>
                                <div className="flex items-center gap-2 bg-dark-900 p-4 rounded-xl border border-dark-600">
                                    <code className="text-xs text-white flex-1 overflow-hidden text-ellipsis font-mono">{rtmpUrl}</code>
                                    <button className="text-gray-400 hover:text-white" onClick={() => navigator.clipboard.writeText(rtmpUrl)}><Copy size={16} /></button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Stream Key (Keep Private)</label>
                                <div className="flex items-center gap-2 bg-dark-900 p-4 rounded-xl border border-dark-600">
                                    <code className="text-xs text-white flex-1 overflow-hidden text-ellipsis font-mono blur-sm hover:blur-none transition-all">{streamKey}</code>
                                    <button onClick={handleCopy} className={`text-gray-400 hover:text-white ${copied ? 'text-green-500' : ''}`}>
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg text-[10px] text-blue-300 font-bold uppercase tracking-wide mt-2">
                                <Info size={14} /> Quality Cap: {maxQuality} (Upgrade to unlock 4K)
                            </div>
                        </div>
                    </div>
                    
                    {/* Recent Broadcasts */}
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <History size={20} className="text-gray-400" />
                            <h2 className="text-lg font-bold text-white uppercase">Recent Broadcasts</h2>
                        </div>
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[600px]">
                                <PastStreamRow title="Late Night Gaming" date="Yesterday" viewers="1.2k" heat="45k" pride="20" revenue="450" />
                                <PastStreamRow title="Chill Chat & Vibe" date="Oct 24" viewers="850" heat="12k" pride="5" revenue="120" />
                                <PastStreamRow title="Exclusive Q&A" date="Oct 20" viewers="2.4k" heat="89k" pride="150" revenue="2,400" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Top Tippers */}
                <div className="xl:col-span-1">
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl h-full">
                        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                            <Trophy size={20} className="text-yellow-500" />
                            <h2 className="text-lg font-black text-white uppercase italic tracking-tighter">Top Supporters</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {isLive ? (
                                <>
                                    <TipperRow rank={1} user="CryptoWhale" amount="5,000" />
                                    <TipperRow rank={2} user="Sarah_Noir" amount="2,400" />
                                    <TipperRow rank={3} user="GamerKing" amount="1,200" />
                                    <TipperRow rank={4} user="Viewer_99" amount="500" />
                                    <TipperRow rank={5} user="AnonUser" amount="250" />
                                </>
                            ) : (
                                <div className="py-20 text-center opacity-30 flex flex-col items-center">
                                    <Trophy size={48} className="mb-4 text-gray-500" />
                                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Waiting for signal...</p>
                                </div>
                            )}
                        </div>

                        {isLive && (
                             <div className="mt-8 pt-8 border-t border-white/5">
                                 <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Live Feed</h4>
                                 <div className="space-y-3 text-xs text-gray-400 font-medium">
                                     <p><span className="text-white font-bold">User_123</span> subscribed!</p>
                                     <p><span className="text-white font-bold">Neon_Fan</span> tipped 50 LSC</p>
                                     <p><span className="text-white font-bold">Mod_Bot</span>: Welcome everyone!</p>
                                 </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
