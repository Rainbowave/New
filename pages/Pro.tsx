
import React from 'react';
import { 
    Activity, BarChart2, Users, DollarSign, Crown, Zap, 
    ArrowUpRight, Target, Shield, Download, PieChart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const FeatureCard = ({ icon: Icon, title, desc, color }: any) => (
    <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-500/50 transition-all">
        <div className={`absolute top-0 right-0 p-20 ${color} opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:opacity-10 transition-opacity`}></div>
        <div className={`w-12 h-12 rounded-xl ${color.replace('bg-', 'bg-').replace('500', '900/20')} flex items-center justify-center mb-4 ${color.replace('bg-', 'text-')}`}>
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
);

const ProStat = ({ label, value, trend, isUp }: any) => (
    <div className="bg-dark-900 border border-dark-600 p-4 rounded-xl">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-white">{value}</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${isUp ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                {isUp ? <ArrowUpRight size={10} /> : <ArrowUpRight size={10} className="rotate-90" />} {trend}
            </span>
        </div>
    </div>
);

const data = [
  { name: 'Mon', views: 4000, subs: 2400 },
  { name: 'Tue', views: 3000, subs: 1398 },
  { name: 'Wed', views: 2000, subs: 9800 },
  { name: 'Thu', views: 2780, subs: 3908 },
  { name: 'Fri', views: 1890, subs: 4800 },
  { name: 'Sat', views: 2390, subs: 3800 },
  { name: 'Sun', views: 3490, subs: 4300 },
];

export default function Pro() {
    return (
        <div className="max-w-7xl mx-auto py-8 px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 bg-gradient-to-r from-brand-900/50 to-purple-900/50 p-8 rounded-3xl border border-brand-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-brand-500/30">
                        <Crown size={12} fill="currentColor" /> Pro Suite Active
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2">Creator Professional Dashboard</h1>
                    <p className="text-gray-300 max-w-xl">
                        Unlock your full potential with advanced analytics, audience insights, and premium monetization tools.
                    </p>
                </div>
                <div className="relative z-10 flex gap-4 mt-6 md:mt-0">
                    <button className="bg-white text-brand-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors shadow-xl flex items-center gap-2">
                        <Download size={18} /> Export Data
                    </button>
                    <button className="bg-dark-900/50 text-white border border-white/20 font-bold py-3 px-6 rounded-xl hover:bg-dark-900/80 transition-colors backdrop-blur-md">
                        Settings
                    </button>
                </div>
                {/* Background Decor */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-dark-800 border border-dark-700 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="text-brand-500" /> Performance Overview
                        </h2>
                        <select className="bg-dark-900 border border-dark-600 text-white text-xs font-bold rounded-lg px-3 py-2 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <ProStat label="Total Views" value="842.5K" trend="+12.5%" isUp={true} />
                        <ProStat label="New Subscribers" value="3,240" trend="+5.2%" isUp={true} />
                        <ProStat label="Avg. Watch Time" value="14m 20s" trend="-1.4%" isUp={false} />
                    </div>

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#71717a" tick={{fontSize: 12}} />
                                <YAxis stroke="#71717a" tick={{fontSize: 12}} />
                                <Tooltip contentStyle={{backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px'}} />
                                <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <PieChart className="text-blue-500" size={18} /> Audience Demographics
                        </h2>
                        <div className="space-y-4">
                            {[
                                { label: '18-24', val: 45 },
                                { label: '25-34', val: 32 },
                                { label: '35-44', val: 15 },
                                { label: '45+', val: 8 },
                            ].map((d, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>{d.label}</span>
                                        <span>{d.val}%</span>
                                    </div>
                                    <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${d.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="text-red-500" size={18} /> Top Locations
                        </h2>
                        <div className="space-y-3">
                            {['United States', 'Germany', 'United Kingdom', 'Brazil'].map((loc, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{loc}</span>
                                    <span className="font-mono text-gray-500 font-bold">{50 - i * 10}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Pro Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard 
                        icon={Zap} 
                        title="AI Content Optimizer" 
                        desc="Automatically generate tags, titles, and descriptions optimized for high engagement." 
                        color="bg-yellow-500" 
                    />
                    <FeatureCard 
                        icon={Users} 
                        title="Audience Insights" 
                        desc="Deep dive into your follower behavior, peak activity times, and content preferences." 
                        color="bg-blue-500" 
                    />
                    <FeatureCard 
                        icon={Shield} 
                        title="Brand Safety" 
                        desc="Advanced moderation tools to keep your comment sections clean and sponsor-friendly." 
                        color="bg-green-500" 
                    />
                    <FeatureCard 
                        icon={DollarSign} 
                        title="Smart Pricing" 
                        desc="Dynamic pricing suggestions for your shop items based on market trends." 
                        color="bg-purple-500" 
                    />
                </div>
            </div>
        </div>
    );
}
