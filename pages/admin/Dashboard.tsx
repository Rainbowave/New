
import React, { useState, useEffect } from 'react';
import { 
    Users, DollarSign, Activity, 
    Crown, TrendingUp, ImageIcon,
    Smartphone, BookOpen, ShoppingBag, Heart, Flame,
    BarChart2, Video, Radio, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { db } from '../../services/db';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }: any) => (
    <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-white/10 transition-all">
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
        <div className="relative z-10">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
            {trend && (
                <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    <span>{trend === 'up' ? '▲' : '▼'} {trendValue}</span>
                    <span className="text-gray-600">vs last 24h</span>
                </div>
            )}
        </div>
        <div className={`p-3.5 rounded-xl ${color} bg-opacity-10 border border-white/5 relative z-10`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
);

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'traffic'|'revenue'>('revenue');
    const [realTrafficData, setRealTrafficData] = useState<any[]>([]);
    
    // Interactive State
    const [adminMode, setAdminMode] = useState<'dating' | 'naughty'>((localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating');

    useEffect(() => {
        // Listen to global context change from Sidebar
        const handleModeChange = () => {
            const mode = (localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating';
            setAdminMode(mode);
            setRealTrafficData(generateTraffic(mode)); 
        };
        
        window.addEventListener('admin-mode-change', handleModeChange);
        
        // Initial Load
        setRealTrafficData(generateTraffic(adminMode));
        
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, [adminMode]);

    // Generate realistic traffic data curve (24h) based on mode
    const generateTraffic = (mode: string) => {
        const data = [];
        const base = mode === 'naughty' ? 8000 : 5000; 
        for (let i = 0; i < 24; i++) {
            const amplitude = 3000;
            const noise = Math.random() * 500 - 250;
            const hourValue = Math.sin(((i - 8) / 24) * 2 * Math.PI) * amplitude + base + noise;
            
            data.push({
                name: `${i.toString().padStart(2, '0')}:00`,
                uv: Math.max(1000, Math.floor(hourValue)), 
                pv: Math.max(2000, Math.floor(hourValue * 1.5 + (Math.random() * 500))), 
            });
        }
        return data;
    };
    
    // Dynamic Section Visitors based on Mode
    const getSectionVisitors = () => {
        const base = adminMode === 'naughty' ? 1.5 : 1;
        return [
            { name: 'Live', value: 450000 * base, color: '#ef4444', icon: Radio },
            { name: 'Videos', value: 380000 * base, color: '#db2777', icon: Video },
            { name: 'Shorts', value: 340000 * base, color: '#ec4899', icon: Smartphone },
            { name: 'Photos', value: 210000 * base, color: '#3b82f6', icon: ImageIcon },
            { name: 'Polls', value: 180000 * base, color: '#eab308', icon: BarChart2 },
            { name: 'Comics', value: 125000 * base, color: '#8b5cf6', icon: BookOpen },
            { name: 'Collections', value: 42000 * base, color: '#10b981', icon: ShoppingBag },
        ];
    };

    return (
        <div className="p-6 max-w-[1800px] mx-auto min-h-screen flex flex-col gap-8 animate-in fade-in">
            
            {/* 1. Header / KPI Section */}
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Overview</h1>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${adminMode === 'dating' ? 'bg-brand-second/10 text-brand-second border-brand-second/20' : 'bg-brand-500/10 text-brand-500 border-brand-500/20'}`}>
                        {adminMode} Context
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard 
                        title="Total Revenue" 
                        value={adminMode === 'dating' ? "4.5M LSC" : "12.8M LSC"} 
                        icon={DollarSign} 
                        color="bg-green-600" 
                        trend="up" 
                        trendValue={adminMode === 'dating' ? "8.4%" : "14.2%"} 
                    />
                    <StatCard 
                        title="Daily Earnings" 
                        value={adminMode === 'dating' ? "124K LSC" : "315K LSC"} 
                        icon={TrendingUp} 
                        color="bg-yellow-500" 
                        trend="up" 
                        trendValue={adminMode === 'dating' ? "15%" : "22%"} 
                    />
                    <StatCard 
                        title="New Signups" 
                        value={adminMode === 'dating' ? "1,292" : "2,450"} 
                        icon={Users} 
                        color="bg-blue-600" 
                        trend="up" 
                        trendValue="5%" 
                    />
                    <StatCard 
                        title="Active Subs" 
                        value={adminMode === 'dating' ? "8,904" : "15,200"} 
                        icon={Crown} 
                        color="bg-purple-600" 
                        trend={adminMode === 'dating' ? "up" : "flat"} 
                        trendValue="Stable" 
                    />
                    <StatCard 
                        title="Poll Engagement" 
                        value={adminMode === 'dating' ? "45.2K" : "89.5K"} 
                        icon={BarChart2} 
                        color="bg-orange-500" 
                        trend="up" 
                        trendValue="12%" 
                    />
                </div>
            </div>

            {/* 2. Main Performance Chart (Expanded) */}
            <div className="w-full">
                <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl flex flex-col h-[400px] shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-white text-lg uppercase italic tracking-tight">Platform Performance (24h)</h3>
                        <div className="flex bg-dark-900 p-1 rounded-lg border border-dark-600">
                            {['revenue', 'traffic'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={realTrafficData}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={activeTab === 'revenue' ? '#10b981' : '#a10a39'} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={activeTab === 'revenue' ? '#10b981' : '#a10a39'} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }} itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
                                <Area type="monotone" dataKey={activeTab === 'revenue' ? 'pv' : 'uv'} stroke={activeTab === 'revenue' ? '#10b981' : '#a10a39'} fill="url(#colorUv)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            {/* 3. Split Row: Engagement & Visitors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Poll Economics Overview */}
                <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl h-full">
                    <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                            <BarChart2 size={20} className="text-brand-500" /> Poll Economics
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${adminMode === 'dating' ? 'bg-brand-second/10 text-brand-second' : 'bg-brand-500/10 text-brand-500'}`}>
                            {adminMode.toUpperCase()} ACTIVITY
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5">
                             <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Win Pool Volume</div>
                             <div className="text-2xl text-white font-black">{adminMode === 'dating' ? '450K' : '820K'} LSC</div>
                         </div>
                         <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5">
                             <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Fee Revenue (Site)</div>
                             <div className="text-2xl text-green-500 font-black">{adminMode === 'dating' ? '45K' : '90K'} LSC</div>
                         </div>
                         <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5">
                             <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Engagement Share</div>
                             <div className="text-2xl text-blue-400 font-black">{adminMode === 'dating' ? '22.5K' : '45K'} LSC</div>
                         </div>
                         <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5">
                             <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Active Tickets</div>
                             <div className="text-2xl text-white font-black">{adminMode === 'dating' ? '8,500' : '15,200'}</div>
                         </div>
                    </div>
                </div>

                {/* Section Visitors Breakdown */}
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl h-80 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-white text-sm uppercase italic tracking-wider flex items-center gap-2">
                            <Eye size={16} className="text-blue-500" /> Section Visitors
                        </h3>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getSectionVisitors()} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                <XAxis type="number" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                                <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} width={70} />
                                <Tooltip cursor={{fill: '#27272a'}} contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }} itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => `${Number(value).toLocaleString()} Visits`} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {getSectionVisitors().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
