import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, DollarSign, Wallet, ArrowUpRight, Video, Image, BookOpen, ShoppingBag, Gamepad2, Gift, Activity, PieChart, Target, Crown, X, CreditCard, Bitcoin, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { api } from '../services/api';

const earningsData = [
  { name: 'Mon', revenue: 400, tips: 240, subs: 160 },
  { name: 'Tue', revenue: 300, tips: 139, subs: 161 },
  { name: 'Wed', revenue: 200, tips: 980, subs: 220 },
  { name: 'Thu', revenue: 278, tips: 390, subs: 108 },
  { name: 'Fri', revenue: 189, tips: 480, subs: 409 },
  { name: 'Sat', revenue: 239, tips: 380, subs: 359 },
  { name: 'Sun', revenue: 349, tips: 430, subs: 319 },
];

const sourceData = [
  { name: 'Tips', value: 4000, color: '#ec4899' },
  { name: 'Subs', value: 3000, color: '#8b5cf6' },
  { name: 'Ads', value: 2000, color: '#10b981' },
  { name: 'Sales', value: 2780, color: '#f59e0b' },
];

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

const EarningsCard = ({ title, amount, subtext, icon: Icon, colorClass, btnText, onBtnClick }: any) => (
    <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl flex flex-col justify-between h-full shadow-lg">
        <div className="flex justify-between items-start mb-4">
             <div>
                 <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                 <h2 className={`text-3xl font-bold ${colorClass}`}>{amount}</h2>
             </div>
             {Icon && <div className={`p-2 rounded-lg ${subtext === 'Ready' ? 'bg-green-900/30 text-green-400' : 'bg-dark-700 text-gray-400'}`}>
                {typeof subtext === 'string' && subtext.length < 15 ? <span className="text-xs font-bold uppercase">{subtext}</span> : <Icon size={20} />}
             </div>}
        </div>
        
        {btnText && (
            <button onClick={onBtnClick} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-900/30">
                <Wallet size={18} /> {btnText}
            </button>
        )}
        {!btnText && subtext && subtext !== 'Ready' && subtext !== 'Processing' && (
            <p className="text-xs text-green-400 font-medium flex items-center gap-1">
                <ArrowUpRight size={14} /> {subtext}
            </p>
        )}
        {(subtext === 'Processing') && (
            <p className="text-xs text-gray-500 mt-auto">Available in 3-5 business days</p>
        )}
    </div>
);

const BreakdownItem = ({ label, amount, icon: Icon, color }: any) => (
    <div className="bg-dark-800 border border-dark-700 p-5 rounded-2xl">
        <div className="flex items-start gap-4 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            <div>
                <h4 className="font-bold text-white">{label}</h4>
                <p className="text-xs text-gray-500">12% of total</p>
            </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{amount}</h3>
        <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 w-1/3"></div>
        </div>
    </div>
);

export default function Earnings() {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawMethod, setWithdrawMethod] = useState<'stripe' | 'crypto'>('stripe');
    const [withdrawStep, setWithdrawStep] = useState(1);
    const [cryptoAddress, setCryptoAddress] = useState('');

    const handleWithdraw = async () => {
        setWithdrawStep(2);
        
        try {
            if (withdrawMethod === 'crypto') {
                // Call NowPayments Payout API
                await api.post('/payouts', {
                    amount: 3240.50, // Mock amount from UI
                    currency: 'usdt',
                    address: cryptoAddress || '0xMockUserAddress'
                });
            } else {
                // Simulate Stripe Connect
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            setWithdrawStep(3);
        } catch (e) {
            console.error("Withdrawal failed", e);
            alert("Withdrawal processing failed.");
            setWithdrawStep(1);
        }
    };

    const resetWithdraw = () => {
        setIsWithdrawModalOpen(false);
        setWithdrawStep(1);
        setCryptoAddress('');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10 px-4 md:px-6 relative">
            
            {/* Withdrawal Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                        <button onClick={resetWithdraw} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-dark-700"><X size={20}/></button>
                        
                        {withdrawStep === 1 && (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-6">Cash Out Funds</h2>
                                <div className="space-y-4 mb-6">
                                    <button 
                                        onClick={() => setWithdrawMethod('stripe')}
                                        className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${withdrawMethod === 'stripe' ? 'border-brand-500 bg-brand-900/10' : 'border-dark-600 bg-dark-900 hover:border-gray-500'}`}
                                    >
                                        <div className="p-2 bg-white rounded-lg text-brand-600"><CreditCard size={24} /></div>
                                        <div className="text-left flex-1">
                                            <div className="font-bold text-white">Bank Transfer (Stripe)</div>
                                            <div className="text-xs text-gray-400">1-3 Business Days</div>
                                        </div>
                                        {withdrawMethod === 'stripe' && <CheckCircle size={20} className="text-brand-500"/>}
                                    </button>

                                    <button 
                                        onClick={() => setWithdrawMethod('crypto')}
                                        className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${withdrawMethod === 'crypto' ? 'border-orange-500 bg-orange-900/10' : 'border-dark-600 bg-dark-900 hover:border-gray-500'}`}
                                    >
                                        <div className="p-2 bg-orange-500 rounded-lg text-white"><Bitcoin size={24} /></div>
                                        <div className="text-left flex-1">
                                            <div className="font-bold text-white">Crypto (NowPayments)</div>
                                            <div className="text-xs text-gray-400">Instant • USDT, BTC</div>
                                        </div>
                                        {withdrawMethod === 'crypto' && <CheckCircle size={20} className="text-orange-500"/>}
                                    </button>
                                </div>

                                {withdrawMethod === 'crypto' && (
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Wallet Address (USDT TRC20)</label>
                                        <input 
                                            type="text" 
                                            value={cryptoAddress}
                                            onChange={(e) => setCryptoAddress(e.target.value)}
                                            placeholder="Enter your wallet address" 
                                            className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 transition-colors"
                                        />
                                    </div>
                                )}

                                <div className="bg-dark-900 p-4 rounded-xl border border-dark-600 mb-6">
                                    <div className="flex justify-between mb-2 text-sm text-gray-400">
                                        <span>Withdraw Amount</span>
                                        <span>Available: 3,240.50</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-gray-500">$</span>
                                        <input type="number" defaultValue="3240.50" className="bg-transparent text-3xl font-black text-white w-full outline-none" />
                                    </div>
                                </div>

                                <button onClick={handleWithdraw} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg transition-colors">
                                    Withdraw Now
                                </button>
                            </>
                        )}

                        {withdrawStep === 2 && (
                            <div className="py-10 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <h3 className="text-xl font-bold text-white">Processing Request...</h3>
                                <p className="text-gray-400 text-sm mt-2">Connecting to {withdrawMethod === 'stripe' ? 'Stripe Connect' : 'NowPayments Payouts'}...</p>
                            </div>
                        )}

                        {withdrawStep === 3 && (
                            <div className="py-8 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Withdrawal Successful!</h3>
                                <p className="text-gray-400 mb-6">Your funds are on the way. Check your email for confirmation.</p>
                                <button onClick={resetWithdraw} className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-white font-bold rounded-xl transition-colors">
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* New Pro-Style Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 bg-gradient-to-r from-brand-900/50 to-purple-900/50 p-8 rounded-3xl border border-brand-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-brand-500/30">
                        <Crown size={12} fill="currentColor" /> Pro Suite Active
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2">Creator Earnings & Analytics</h1>
                    <p className="text-gray-300 max-w-xl">
                        Track your revenue, analyze audience growth, and manage payouts all in one place.
                    </p>
                </div>
                <div className="relative z-10 flex gap-4 mt-6 md:mt-0">
                    <button className="bg-white text-brand-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors shadow-xl flex items-center gap-2">
                        <Download size={18} /> Export Data
                    </button>
                </div>
                {/* Background Decor */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            </div>

            {/* Main Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EarningsCard 
                    title="Total Earnings" 
                    amount="12,450.00 LSC" 
                    subtext="+12.5% from last month" 
                    icon={TrendingUp} 
                    colorClass="text-white"
                />
                <EarningsCard 
                    title="Available Balance" 
                    amount="3,240.50 LSC" 
                    subtext="Ready"
                    colorClass="text-purple-400"
                    btnText="Withdraw"
                    onBtnClick={() => setIsWithdrawModalOpen(true)}
                />
                <EarningsCard 
                    title="Pending" 
                    amount="850.00 LSC" 
                    subtext="Processing" 
                    colorClass="text-gray-400"
                />
            </div>

            {/* Analytics Section (Moved from Pro) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
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
                            <AreaChart data={earningsData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#71717a" tick={{fontSize: 12}} />
                                <YAxis stroke="#71717a" tick={{fontSize: 12}} tickFormatter={(val) => `${val}`} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px'}} 
                                    itemStyle={{color: '#fff'}}
                                    formatter={(val) => `${val} LSC`}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Side Stats (Demographics & Location) */}
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

            {/* Sources Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-dark-700 pt-8">
                 <BreakdownItem label="Live Streams" amount="4,200.00 LSC" icon={Video} color="bg-red-600" />
                 <BreakdownItem label="Photos" amount="850.00 LSC" icon={Image} color="bg-blue-600" />
                 <BreakdownItem label="Comics" amount="1,200.00 LSC" icon={BookOpen} color="bg-purple-600" />
                 <BreakdownItem label="Collection Sales" amount="2,780.00 LSC" icon={ShoppingBag} color="bg-green-600" />
                 <BreakdownItem label="Games" amount="320.00 LSC" icon={Gamepad2} color="bg-orange-600" />
                 <BreakdownItem label="Tips & Gifts" amount="3,100.00 LSC" icon={Gift} color="bg-pink-600" />
            </div>
        </div>
    );
}