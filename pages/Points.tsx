
import React, { useState } from 'react';
import { 
    Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, 
    CreditCard, Settings, RefreshCw, Shield, Lock, 
    Users, MapPin, Activity, Calendar, Download, 
    ChevronDown, ChevronUp, Plus, Send, Zap,
    Play, Image, MessageCircle, Gift, LayoutGrid,
    CheckCircle, X, Search, Globe, Smartphone,
    PieChart, DollarSign, Database, Loader2, Coins,
    Crown, ShoppingBag, Gamepad2, BarChart2, Save, FileText,
    Target, Award, Terminal, Video, ChevronLeft, ChevronRight, Star,
    Medal, Flame, Heart, Radio, Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

// --- Types ---

type Tab = 'STATISTICS' | 'VAULT';
type HistoryFilter = 'ALL' | 'BUY' | 'SUB' | 'POST' | 'TIP' | 'REF' | 'COLL' | 'GAME' | 'LIVE' | 'SHORT' | 'PHOTO' | 'COMIC';

interface Transaction {
    id: string;
    type: HistoryFilter;
    source: string;
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
    date: string;
    refId: string;
}

// --- Mock Data ---

const performanceData = [
    { date: 'Mon', yield: 12500 },
    { date: 'Tue', yield: 18200 },
    { date: 'Wed', yield: 15400 },
    { date: 'Thu', yield: 22100 },
    { date: 'Fri', yield: 28500 },
    { date: 'Sat', yield: 35200 },
    { date: 'Sun', yield: 31800 },
];

const audienceData = [
    { name: '18-24', value: 35 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 15 },
    { name: '45+', value: 5 },
];

const mockTransactions: Transaction[] = [
    { id: 'tx_1', type: 'BUY', source: 'Points Pack (Medium)', amount: 5000, status: 'Completed', date: 'Oct 24, 10:30 AM', refId: 'ORD-9912' },
    { id: 'tx_2', type: 'SUB', source: 'Sub: @Sarah_Noir', amount: -499, status: 'Completed', date: 'Oct 23, 2:15 PM', refId: 'SUB-8821' },
    { id: 'tx_3', type: 'POST', source: 'Post Revenue', amount: 850, status: 'Completed', date: 'Oct 22, 9:00 AM', refId: 'REV-1120' },
    { id: 'tx_4', type: 'TIP', source: 'Tip to @GamerPro', amount: -100, status: 'Completed', date: 'Oct 21, 6:45 PM', refId: 'TIP-3341' },
    { id: 'tx_5', type: 'REF', source: 'Referral Bonus', amount: 500, status: 'Completed', date: 'Oct 20, 1:20 PM', refId: 'REF-5592' },
    { id: 'tx_6', type: 'COLL', source: 'Collection Sale', amount: 4500, status: 'Completed', date: 'Oct 19, 4:10 PM', refId: 'SLS-9921' },
    { id: 'tx_7', type: 'GAME', source: 'Arcade: Cosmic Dice', amount: 250, status: 'Completed', date: 'Oct 19, 11:00 AM', refId: 'GM-1222' },
    { id: 'tx_8', type: 'LIVE', source: 'Stream Revenue', amount: 1200, status: 'Completed', date: 'Oct 18, 9:00 PM', refId: 'STR-2211' },
    { id: 'tx_9', type: 'SHORT', source: 'Shorts Fund', amount: 350, status: 'Completed', date: 'Oct 18, 12:00 PM', refId: 'SHT-1102' },
];

// --- Sub-Components ---

const VaultDashboard = () => (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-800 to-dark-900 border border-white/10 shadow-2xl mb-8 group">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 p-8 space-y-8">
            
            {/* Header: Rank & Global Progress */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                     <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-brand-900/20 transform group-hover:scale-105 transition-transform duration-500">
                        <Crown size={40} fill="currentColor" />
                     </div>
                     <div>
                         <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">Diamond Hands</h2>
                         <div className="flex items-center gap-3">
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Top 5%</span>
                         </div>
                     </div>
                </div>

                <div className="w-full md:max-w-md">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Activity size={12}/> Level</span>
                        <span className="text-sm font-black text-white tabular-nums">3,450 <span className="text-gray-600">/</span> 5,000 XP</span>
                    </div>
                    <div className="w-full h-3 bg-dark-950 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                        <div className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 w-[69%] shadow-[0_0_20px_rgba(161,10,57,0.5)]"></div>
                    </div>
                </div>
            </div>

            {/* Unified Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Skill Levels (XP Breakdown) */}
                <div className="space-y-4">
                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Star size={12} /> Skills
                    </h4>
                    
                    {/* Create */}
                    <div className="bg-dark-900/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Image size={16} /></div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-[10px] font-black text-white uppercase">Create</span>
                                <span className="text-[9px] font-bold text-blue-400 tabular-nums">1,500 / 2,500</span>
                            </div>
                            <div className="h-1.5 bg-dark-950 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[60%]"></div></div>
                        </div>
                    </div>

                    {/* Social */}
                    <div className="bg-dark-900/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><MessageCircle size={16} /></div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-[10px] font-black text-white uppercase">Social</span>
                                <span className="text-[9px] font-bold text-purple-400 tabular-nums">1,250 / 1,500</span>
                            </div>
                            <div className="h-1.5 bg-dark-950 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[83%]"></div></div>
                        </div>
                    </div>

                    {/* Play */}
                    <div className="bg-dark-900/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><Gamepad2 size={16} /></div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-[10px] font-black text-white uppercase">Play</span>
                                <span className="text-[9px] font-bold text-yellow-400 tabular-nums">700 / 1,000</span>
                            </div>
                            <div className="h-1.5 bg-dark-950 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 w-[70%]"></div></div>
                        </div>
                    </div>
                </div>

                {/* 2. Impact Metrics */}
                <div className="space-y-4">
                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Heart size={12} /> Impact
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-dark-900/40 rounded-xl border border-white/5 text-center">
                            <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Heat</span>
                            <div className="flex items-center justify-center gap-1 text-xl font-black text-white">
                                24.5K <Flame size={14} className="text-orange-500" fill="currentColor" />
                            </div>
                        </div>
                        <div className="p-3 bg-dark-900/40 rounded-xl border border-white/5 text-center">
                            <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Comments</span>
                            <div className="flex items-center justify-center gap-1 text-xl font-black text-white">
                                8.2K <MessageCircle size={14} className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-dark-900/40 rounded-xl p-3 border border-white/5">
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-2">Content</span>
                        <div className="flex justify-between items-center gap-2">
                             <div className="flex flex-col items-center gap-1"><Video size={14} className="text-pink-400"/><span className="text-[9px] font-bold text-white">85</span></div>
                             <div className="w-px h-6 bg-white/5"></div>
                             <div className="flex flex-col items-center gap-1"><Image size={14} className="text-blue-400"/><span className="text-[9px] font-bold text-white">142</span></div>
                             <div className="w-px h-6 bg-white/5"></div>
                             <div className="flex flex-col items-center gap-1"><ShoppingBag size={14} className="text-green-400"/><span className="text-[9px] font-bold text-white">12</span></div>
                             <div className="w-px h-6 bg-white/5"></div>
                             <div className="flex flex-col items-center gap-1"><FileText size={14} className="text-yellow-400"/><span className="text-[9px] font-bold text-white">40</span></div>
                        </div>
                    </div>
                </div>

                {/* 3. Economy & Arcade */}
                <div className="space-y-4">
                     <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Coins size={12} /> Arcade
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                         <div className="p-3 bg-green-900/10 border border-green-500/20 rounded-xl flex flex-col justify-between h-20">
                             <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Winnings</span>
                             <span className="text-xl font-black text-white">+13.1K</span>
                         </div>
                         <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-xl flex flex-col justify-between h-20">
                             <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">Losses</span>
                             <span className="text-xl font-black text-white">-2.1K</span>
                         </div>
                    </div>
                    <div className="bg-dark-900/40 rounded-xl p-3 border border-white/5 flex justify-between items-center">
                        <div>
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Net PnL</span>
                            <span className="text-lg font-black text-brand-400">+11,000 LSC</span>
                        </div>
                        <div className="text-right">
                             <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Played</span>
                             <span className="text-sm font-bold text-white">1,240 Rounds</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
);

const MetricCard = ({ label, value, subValue, icon: Icon, active = false }: any) => (
    <div className={`p-6 rounded-2xl border transition-all group hover:bg-dark-700 hover:border-white/10 ${active ? 'bg-brand-900/10 border-brand-500/50' : 'bg-dark-800 border-white/5'}`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg transition-all duration-300 ${active ? 'bg-brand-500 text-white group-hover:bg-white group-hover:text-brand-500' : 'bg-dark-900 text-gray-400 group-hover:bg-white group-hover:text-brand-500'}`}>
                <Icon size={20} />
            </div>
            {subValue && (
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${subValue.startsWith('+') ? 'text-green-400 border-green-500/20 bg-green-500/10' : 'text-gray-500 border-white/10'}`}>
                    {subValue}
                </span>
            )}
        </div>
        <div className="space-y-1">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block">{label}</span>
            <span className="text-2xl font-black text-white tabular-nums tracking-tight">{value}</span>
        </div>
    </div>
);

const SourceCard = ({ title, amount, growth, icon: Icon, colorClass }: any) => (
    <div className="bg-dark-800 border border-white/5 rounded-xl p-5 hover:bg-dark-700 hover:border-white/10 transition-all group cursor-pointer">
        <div className="flex items-center gap-4 mb-4">
            <div className={`w-10 h-10 rounded-lg bg-dark-900 border border-white/5 flex items-center justify-center text-gray-400 group-hover:bg-white ${colorClass} transition-all duration-300`}>
                <Icon size={18} />
            </div>
            <div>
                <h4 className="font-bold text-white text-sm uppercase tracking-tight">{title}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-[10px] font-black text-green-500">{growth}</span>
                </div>
            </div>
        </div>
        <div className="flex justify-between items-end border-t border-white/5 pt-4">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Revenue</span>
            <span className="text-lg font-black text-white tabular-nums">{amount}</span>
        </div>
    </div>
);

const EarningCard = ({ title, amount, icon: Icon, colorClass }: any) => (
    <div className="bg-dark-800 border border-white/5 rounded-xl p-6 flex items-center justify-between hover:bg-dark-700 transition-all cursor-pointer group hover:border-white/10">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-dark-900 rounded-xl flex items-center justify-center text-gray-500 border border-white/10 group-hover:bg-white ${colorClass} transition-all duration-300`}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">{title}</h4>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Selectable card</span>
            </div>
        </div>
        <div className="text-right">
            <span className="text-yellow-500 font-black text-base tabular-nums">+{amount} LSC</span>
        </div>
    </div>
);

const MilestoneCard = ({ title, description, cost, icon: Icon, colorClass, canRedeem, onRedeem }: any) => (
    <div className="bg-dark-800 border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:bg-dark-700 hover:border-white/10 transition-all flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 bg-dark-900 rounded-xl flex items-center justify-center text-gray-400 border border-white/10 shadow-lg group-hover:bg-white ${colorClass} transition-all duration-300`}>
                <Icon size={24} />
            </div>
            <span className="text-yellow-500 font-black text-sm tabular-nums">{cost.toLocaleString()} LSC</span>
        </div>
        
        <div className="flex-1">
            <h4 className="font-black text-white text-sm uppercase italic tracking-tighter mb-1 relative z-10">{title}</h4>
            <p className="text-[10px] text-gray-500 font-medium mb-4 leading-relaxed line-clamp-2">{description}</p>
        </div>
        
        <button 
            onClick={onRedeem}
            disabled={!canRedeem}
            className={`w-full py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                canRedeem 
                ? 'bg-white text-black hover:bg-brand-500 hover:text-white shadow-lg cursor-pointer' 
                : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
            }`}
        >
            {canRedeem ? 'Claim Reward' : 'Insufficient Points'}
        </button>
    </div>
);

const CashOutConfig = ({ name, icon: Icon, fee, time, enabled, defaultDetails }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEnabled, setIsEnabled] = useState(enabled);
    const [details, setDetails] = useState(defaultDetails || '');

    return (
        <div className={`rounded-xl border transition-all duration-300 ${isExpanded ? 'bg-dark-900 border-brand-500/30' : 'bg-dark-800 border-white/10'}`}>
            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isEnabled ? 'bg-brand-900/20 text-brand-500' : 'bg-dark-700 text-gray-600'}`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">{name}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500">
                            <span>Fee: {fee}</span>
                            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isEnabled && !isExpanded && <span className="text-[9px] font-black text-green-500 uppercase tracking-widest px-2 py-1 bg-green-900/20 rounded border border-green-500/20">Active</span>}
                    <button className="text-gray-400 hover:text-white transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>
            
            {isExpanded && (
                <div className="px-4 pb-4 pt-0 space-y-4 border-t border-white/5 mt-2 animate-in slide-in-from-top-2">
                    <div className="pt-4">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Configuration Details</label>
                        <input 
                            type="text" 
                            value={details} 
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder={name === 'Crypto (USDT)' ? 'Wallet Address (TRC20)' : name === 'PayPal' ? 'PayPal Email' : 'Account Number'}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:border-brand-500 outline-none" 
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEnabled(!isEnabled)}>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${isEnabled ? 'bg-brand-500' : 'bg-dark-600'}`}>
                                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isEnabled ? 'left-4.5' : 'left-0.5'}`}></div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Enable Method</span>
                        </div>
                        <button className="bg-white text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <Save size={12} /> Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AcquireCreditsModal = ({ isOpen, onClose }: any) => {
    const [selectedPack, setSelectedPack] = useState(2);
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    const packs = [
        { id: 1, amount: 500, bonus: 0, price: 4.99 },
        { id: 2, amount: 1200, bonus: 200, price: 9.99, popular: true },
        { id: 3, amount: 3500, bonus: 1000, price: 24.99 },
        { id: 4, amount: 8000, bonus: 3000, price: 49.99 },
    ];

    const handlePurchase = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            onClose();
            alert("Credits acquired successfully!");
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-black text-white uppercase italic tracking-tighter text-xl">Acquire Credits</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-white" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {packs.map(pack => (
                            <div 
                                key={pack.id} 
                                onClick={() => setSelectedPack(pack.id)}
                                className={`p-4 rounded-xl border-2 cursor-pointer relative transition-all ${selectedPack === pack.id ? 'bg-brand-900/20 border-brand-500' : 'bg-dark-800 border-white/5 hover:border-white/20'}`}
                            >
                                {pack.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Best Value</div>}
                                <div className="text-center">
                                    <div className="text-2xl font-black text-white mb-1">{pack.amount.toLocaleString()}</div>
                                    {pack.bonus > 0 && <div className="text-[10px] font-bold text-brand-400 uppercase mb-2">+{pack.bonus} Bonus</div>}
                                    <div className={`text-sm font-bold py-1 px-3 rounded-lg inline-block ${selectedPack === pack.id ? 'bg-brand-500 text-white' : 'bg-dark-700 text-gray-400'}`}>${pack.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-dark-800 rounded-xl p-4 border border-white/5 mt-6">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-400 font-bold">Payment Method</span>
                            <span className="text-white font-bold flex items-center gap-2"><CreditCard size={14}/> Visa •••• 4242</span>
                        </div>
                        <div className="h-px bg-white/5 my-3"></div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-white font-black uppercase italic">Total</span>
                            <span className="text-brand-500 font-black">${packs.find(p => p.id === selectedPack)?.price}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handlePurchase}
                        disabled={processing}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} fill="currentColor" />}
                        {processing ? 'Processing...' : 'Confirm Transaction'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Points() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('STATISTICS');
    const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('ALL');
    const [isAcquireOpen, setIsAcquireOpen] = useState(false);
    
    // Pagination States
    const [earnPage, setEarnPage] = useState(0);
    const [rewardPage, setRewardPage] = useState(0);
    const itemsPerPage = 4;

    // Mock Values
    const metrics = {
        generated: 1245000,
        available: 482900,
        locked: 32400,
        cashed: 729700
    };

    // Extended Mock Data for Pagination
    const earnItems = [
        { title: "Ad Views", amount: "150", icon: Play, colorClass: "group-hover:text-blue-500" },
        { title: "Stream View", amount: "500", icon: Video, colorClass: "group-hover:text-red-500" },
        { title: "New Followers", amount: "1,200", icon: Users, colorClass: "group-hover:text-purple-500" },
        { title: "Checkpoint", amount: "50", icon: Target, colorClass: "group-hover:text-green-500" },
        { title: "Daily Login", amount: "100", icon: Calendar, colorClass: "group-hover:text-yellow-500" },
        { title: "Share Post", amount: "250", icon: Send, colorClass: "group-hover:text-cyan-500" },
        { title: "Referral", amount: "2,000", icon: Users, colorClass: "group-hover:text-brand-500" },
        { title: "Game Win", amount: "5,000", icon: Gamepad2, colorClass: "group-hover:text-orange-500" },
    ];

    const rewardItems = [
        { id: 1, title: "Lucistar Status", description: "Get the verified badge and premium profile features.", cost: 5000, icon: Crown, colorClass: "group-hover:text-yellow-500" },
        { id: 2, title: "Profile Badges", description: "Exclusive badges to display on your profile.", cost: 800, icon: Award, colorClass: "group-hover:text-blue-500" },
        { id: 3, title: "Profile Boost", description: "Boost your profile visibility for 24 hours.", cost: 1500, icon: Zap, colorClass: "group-hover:text-purple-500" },
        { id: 4, title: "Custom Theme", description: "Unlock custom color themes for your profile.", cost: 2000, icon: Terminal, colorClass: "group-hover:text-pink-500" },
        { id: 5, title: "1 Month Premium", description: "Access premium content for 30 days.", cost: 10000, icon: Star, colorClass: "group-hover:text-amber-500" },
        { id: 6, title: "Chat Color", description: "Change your username color in chat.", cost: 500, icon: MessageCircle, colorClass: "group-hover:text-emerald-500" },
        { id: 7, title: "Sticker Pack", description: "Exclusive animated stickers for chat.", cost: 300, icon: ShoppingBag, colorClass: "group-hover:text-indigo-500" },
        { id: 8, title: "Username Change", description: "One-time username change token.", cost: 5000, icon: Settings, colorClass: "group-hover:text-gray-400" },
    ];

    const handleRedeem = (item: any) => {
        alert(`Redeeming ${item.title} for ${item.cost} LSC`);
    };

    // Pagination Logic
    const totalEarnPages = Math.ceil(earnItems.length / itemsPerPage);
    const visibleEarnItems = earnItems.slice(earnPage * itemsPerPage, (earnPage + 1) * itemsPerPage);

    const totalRewardPages = Math.ceil(rewardItems.length / itemsPerPage);
    const visibleRewardItems = rewardItems.slice(rewardPage * itemsPerPage, (rewardPage + 1) * itemsPerPage);

    return (
        <div className="min-h-screen bg-dark-900 text-white font-sans selection:bg-brand-500/30 pb-20">
            <AcquireCreditsModal isOpen={isAcquireOpen} onClose={() => setIsAcquireOpen(false)} />

            {/* Header - Transparent Background per user request */}
            <div className="sticky top-0 z-40 bg-transparent">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Glossy Icon for Vault */}
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-500 bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none text-white">My Vault</h1>
                        </div>
                    </div>
                    <div className="flex bg-dark-800 p-1 rounded-lg border border-white/5">
                        <button 
                            onClick={() => setActiveTab('STATISTICS')}
                            className={`px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'STATISTICS' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Statistics
                        </button>
                        <button 
                            onClick={() => setActiveTab('VAULT')}
                            className={`px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'VAULT' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Vault
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
                
                {/* --- STATISTICS SECTION --- */}
                {activeTab === 'STATISTICS' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Performance Chart - Left 2/3 */}
                            <div className="lg:col-span-2 bg-dark-800 border border-white/5 rounded-2xl p-8 shadow-xl">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                                            <Activity className="text-brand-500" /> Activity Trend
                                        </h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Growth trends over last 7 days</p>
                                    </div>
                                    <select className="bg-dark-900 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white px-4 py-2 rounded-lg outline-none focus:border-brand-500">
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                    </select>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={performanceData}>
                                            <defs>
                                                <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#a10a39" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#a10a39" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                                            <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                            <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} dx={-10} />
                                            <Tooltip 
                                                contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px'}}
                                                itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                                                cursor={{stroke: '#3f3f46', strokeWidth: 1}}
                                            />
                                            <Area type="monotone" dataKey="yield" stroke="#a10a39" strokeWidth={3} fillOpacity={1} fill="url(#yieldGradient)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Financial Protocol - Right 1/3 (Beside Chart) */}
                            <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                                        <Wallet className="text-green-500" /> Wallet
                                    </h3>
                                    <button 
                                        onClick={() => setIsAcquireOpen(true)}
                                        className="text-[9px] font-black uppercase bg-brand-600 text-white px-3 py-1.5 rounded hover:bg-brand-500 transition-all flex items-center gap-1"
                                    >
                                        <Plus size={10} /> Buy Points
                                    </button>
                                </div>
                                <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                                    <CashOutConfig 
                                        name="Crypto (USDT)" 
                                        icon={Zap} 
                                        fee="0.5%" 
                                        time="Instant" 
                                        enabled={true} 
                                        defaultDetails="TC...x9z"
                                    />
                                </div>
                                <div className="pt-6 mt-4 border-t border-white/5">
                                    <button className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <ArrowUpRight size={16} /> Withdraw Funds
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Source Grid (All 10 Channels) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SourceCard title="Subscription" amount="125,000" growth="+5%" icon={Crown} colorClass="group-hover:text-yellow-500" />
                            <SourceCard title="Direct Tips" amount="85,000" growth="+22%" icon={Gift} colorClass="group-hover:text-pink-500" />
                            <SourceCard title="Referrals" amount="5,000" growth="+8%" icon={Users} colorClass="group-hover:text-green-500" />
                            <SourceCard title="Engagement" amount="12,400" growth="+10%" icon={BarChart2} colorClass="group-hover:text-blue-500" />
                            <SourceCard title="Live" amount="420,500" growth="+15%" icon={Play} colorClass="group-hover:text-red-500" />
                            <SourceCard title="Shorts" amount="150,200" growth="+5%" icon={Smartphone} colorClass="group-hover:text-purple-500" />
                            <SourceCard title="Photos" amount="45,200" growth="+3%" icon={Image} colorClass="group-hover:text-cyan-500" />
                            <SourceCard title="Comics" amount="38,100" growth="+12%" icon={FileText} colorClass="group-hover:text-orange-500" />
                            <SourceCard title="Collection" amount="45,200" growth="+18%" icon={ShoppingBag} colorClass="group-hover:text-emerald-500" />
                            <SourceCard title="Arcade" amount="12,500" growth="-2%" icon={Gamepad2} colorClass="group-hover:text-indigo-500" />
                        </div>

                        {/* Analytics Grid: Locations & Demographics */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Top Locations */}
                            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Globe size={16} className="text-blue-500" /> Top Locations
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { country: 'United States', amount: '240,000', pct: 45 },
                                        { country: 'United Kingdom', amount: '120,000', pct: 25 },
                                        { country: 'Germany', amount: '85,000', pct: 15 },
                                        { country: 'Brazil', amount: '35,000', pct: 8 }
                                    ].map((loc, i) => (
                                        <div key={i} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 text-[10px] font-black text-gray-600">#{i+1}</div>
                                                <div className="font-bold text-gray-300 text-sm">{loc.country}</div>
                                            </div>
                                            <div className="flex items-center gap-4 flex-1 justify-end">
                                                <div className="w-full max-w-xs h-1.5 bg-dark-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-brand-500" style={{ width: `${loc.pct}%` }}></div>
                                                </div>
                                                <div className="text-right w-24">
                                                    <div className="text-xs font-black text-white">{loc.amount}</div>
                                                    <div className="text-[8px] font-bold text-gray-500">{loc.pct}% CONTRIB.</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Demographics */}
                            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Users size={16} className="text-purple-500" /> Demographics
                                </h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={audienceData}>
                                            <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                            <Tooltip cursor={{fill: '#27272a'}} contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px'}} />
                                            <Bar dataKey="value" fill="#a10a39" radius={[4, 4, 0, 0]}>
                                                {audienceData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 1 ? '#a10a39' : '#3f3f46'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-center mt-4">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Primary Audience: 25-34 Years</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VAULT SECTION --- */}
                {activeTab === 'VAULT' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* Unified Vault Dashboard - NEW */}
                        <VaultDashboard />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Earn Points */}
                            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                                        <Zap className="text-yellow-500" /> Earn Points
                                    </h3>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setEarnPage(Math.max(0, earnPage - 1))}
                                            disabled={earnPage === 0}
                                            className="p-2 bg-dark-900 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-700 transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setEarnPage(Math.min(totalEarnPages - 1, earnPage + 1))}
                                            disabled={earnPage >= totalEarnPages - 1}
                                            className="p-2 bg-dark-900 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-700 transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[220px]">
                                    {visibleEarnItems.map((item, idx) => (
                                        <EarningCard key={idx} {...item} />
                                    ))}
                                </div>
                            </div>

                            {/* Rewards */}
                            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                                        <Target className="text-brand-500" /> Rewards
                                    </h3>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setRewardPage(Math.max(0, rewardPage - 1))}
                                            disabled={rewardPage === 0}
                                            className="p-2 bg-dark-900 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-700 transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setRewardPage(Math.min(totalRewardPages - 1, rewardPage + 1))}
                                            disabled={rewardPage >= totalRewardPages - 1}
                                            className="p-2 bg-dark-900 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-700 transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
                                    {visibleRewardItems.map((item) => (
                                        <MilestoneCard 
                                            key={item.id}
                                            {...item}
                                            canRedeem={metrics.available >= item.cost}
                                            onRedeem={() => handleRedeem(item)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Activity Log */}
                        <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden min-h-[500px] flex flex-col">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <RefreshCw size={16} className="text-gray-500" /> Activity Log
                                </h3>
                                <div className="flex bg-dark-900 p-1 rounded-lg overflow-x-auto no-scrollbar max-w-[600px] gap-1">
                                    {['ALL', 'BUY', 'SUB', 'POST', 'TIP', 'REF', 'COLL', 'GAME', 'LIVE', 'SHORT', 'PHOTO', 'COMIC'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setHistoryFilter(f as HistoryFilter)}
                                            className={`px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${historyFilter === f ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="divide-y divide-white/[0.03]">
                                {mockTransactions.filter(t => historyFilter === 'ALL' || t.type === historyFilter).map((tx) => (
                                    <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:bg-white group-hover:border-white ${
                                                tx.type === 'BUY' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                                                tx.type === 'SUB' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
                                                tx.type === 'POST' ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' :
                                                tx.type === 'TIP' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                                tx.type === 'REF' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                tx.type === 'COLL' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                                tx.type === 'GAME' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500' :
                                                tx.type === 'LIVE' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                'bg-gray-500/10 border-gray-500/20 text-gray-400'
                                            }`}>
                                                {tx.type === 'BUY' ? <Plus size={18} /> : 
                                                 tx.type === 'SUB' ? <Crown size={18} /> : 
                                                 tx.type === 'POST' ? <Image size={18} /> :
                                                 tx.type === 'TIP' ? <Gift size={18} /> :
                                                 tx.type === 'REF' ? <Users size={18} /> :
                                                 tx.type === 'COLL' ? <ShoppingBag size={18} /> :
                                                 tx.type === 'GAME' ? <Gamepad2 size={18} /> :
                                                 tx.type === 'LIVE' ? <Video size={18} /> :
                                                 tx.type === 'SHORT' ? <Smartphone size={18} /> :
                                                 tx.type === 'PHOTO' ? <Image size={18} /> :
                                                 tx.type === 'COMIC' ? <FileText size={18} /> :
                                                 <ArrowUpRight size={18} />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white mb-0.5">{tx.source}</div>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                                    <span>{tx.date}</span>
                                                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                                    <span className="font-mono">{tx.refId}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm font-black tabular-nums ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                                                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} LSC
                                            </div>
                                            <div className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${
                                                tx.status === 'Completed' ? 'text-green-500' :
                                                tx.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'
                                            }`}>
                                                {tx.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
