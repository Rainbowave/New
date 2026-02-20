
import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Download, Calendar, PieChart, RefreshCw, AlertCircle, Loader2, Undo2, ShoppingBag, FileText, Check, X, Clock, Globe, Megaphone, Coins, Building } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { useSearchParams } from 'react-router-dom';

interface Transaction {
    id: string;
    type: string;
    user: string;
    amount: string;
    status: 'Completed' | 'Processing' | 'Failed' | 'Refunded';
    date: string;
    isPositive: boolean;
    canRefund?: boolean;
}

interface WithdrawalRequest {
    id: string;
    user: string;
    method: string;
    amount: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export default function AdminFinance() {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') as any || 'overview';
    const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'subscriptions' | 'withdrawals' | 'requests'>(initialTab);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    
    // Data
    const [trendData, setTrendData] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

    useEffect(() => {
        const tab = searchParams.get('tab') as any;
        if (tab && tab !== 'ads') {
            setActiveTab(tab);
        } else {
             setActiveTab('overview');
        }
    }, [searchParams]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Overview Data
            setTrendData([
                { name: 'Mon', revenue: 42000 },
                { name: 'Tue', revenue: 38000 },
                { name: 'Wed', revenue: 55000 },
                { name: 'Thu', revenue: 48000 },
                { name: 'Fri', revenue: 65000 },
                { name: 'Sat', revenue: 58000 },
                { name: 'Sun', revenue: 72000 },
            ]);

            setTransactions([
                { id: '#TX-94821', type: 'Subscription', user: 'user_123', amount: '+9.99 LSC', status: 'Completed', date: '2 mins ago', isPositive: true, canRefund: true },
                { id: '#TX-94822', type: 'Payout', user: 'creator_88', amount: '-450.00 LSC', status: 'Processing', date: '15 mins ago', isPositive: false },
                { id: '#TX-94823', type: 'Site Fee', user: 'Platform', amount: '+2.50 LSC', status: 'Completed', date: '20 mins ago', isPositive: true },
                { id: '#TX-94824', type: 'Ad Revenue', user: 'ExoClick', amount: '+1250.00 LSC', status: 'Completed', date: '1 hour ago', isPositive: true },
                { id: '#TX-94825', type: 'Tip', user: 'fan_01', amount: '+50.00 LSC', status: 'Completed', date: '2 hours ago', isPositive: true },
            ]);

            setWithdrawals([
                { id: 'W-1023', user: 'tech_queen', method: 'PayPal', amount: '$450.00', date: 'Oct 24', status: 'Pending' },
                { id: 'W-1024', user: 'gamer_pro', method: 'Crypto (ETH)', amount: '$1,200.00', date: 'Oct 24', status: 'Pending' },
                { id: 'W-1022', user: 'artist_jay', method: 'Bank Transfer', amount: '$85.00', date: 'Oct 23', status: 'Approved' },
                { id: 'W-1025', user: 'stream_king', method: 'Crypto (USDT)', amount: '$3,500.00', date: 'Oct 25', status: 'Pending' },
            ]);

        } catch (err) {
            setError("Failed to load financial data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleWithdrawalAction = async (id: string, action: 'Approved' | 'Rejected') => {
        setProcessingId(id);
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
            setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: action } : w));
        } finally {
            setProcessingId(null);
        }
    };

    // Filter withdrawals for the specific tab view
    const pendingRequests = withdrawals.filter(w => w.status === 'Pending');
    const allWithdrawals = withdrawals; // Could be filtered by history if needed

    const tabs = ['overview', 'transactions', 'subscriptions', 'withdrawals', 'requests'];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-1 capitalize">Finance: {activeTab === 'requests' ? 'Payout Requests' : activeTab}</h1>
                <div className="flex gap-2 bg-dark-800 p-1 rounded-xl border border-dark-700 overflow-x-auto no-scrollbar max-w-[600px]">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-brand-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 size={48} className="text-brand-500 animate-spin" />
                </div>
            ) : (
                <>
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                                            <h3 className="text-3xl font-black text-white">482,900.00 LSC</h3>
                                        </div>
                                        <div className="bg-green-500/10 p-2.5 rounded-xl text-green-500">
                                            <DollarSign size={24} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-green-400 font-bold relative z-10">
                                        <ArrowUpRight size={16} /> +12.5% <span className="text-gray-500 font-medium ml-1">vs last month</span>
                                    </div>
                                </div>
                                
                                <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Withdrawals</p>
                                            <h3 className="text-3xl font-black text-white">32,400.00 LSC</h3>
                                        </div>
                                        <div className="bg-yellow-500/10 p-2.5 rounded-xl text-yellow-500">
                                            <Clock size={24} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-yellow-500 font-bold relative z-10">
                                        {pendingRequests.length} Requests Waiting
                                    </div>
                                </div>

                                <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Platform Fees (Net)</p>
                                            <h3 className="text-3xl font-black text-white">162,500.00 LSC</h3>
                                        </div>
                                        <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-500">
                                            <Building size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 h-96">
                                <h3 className="text-lg font-bold text-white mb-6">Revenue Trend</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                        <XAxis dataKey="name" stroke="#71717a" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke="#71717a" tick={{fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} axisLine={false} tickLine={false} dx={-10} />
                                        <Tooltip contentStyle={{backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', color: '#fff'}} />
                                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                         <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-xl">
                            <table className="w-full text-left">
                                <thead className="bg-dark-900 text-xs text-gray-500 uppercase font-bold border-b border-dark-700">
                                    <tr>
                                        <th className="px-6 py-4">Transaction ID</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">User / Source</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-700 text-sm">
                                    {transactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-dark-700/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-400 font-mono">{tx.id}</td>
                                            <td className="px-6 py-4 font-bold text-white">
                                                <span className={`flex items-center gap-2 ${['Site Fee', 'Ad Revenue'].includes(tx.type) ? 'text-brand-400' : 'text-white'}`}>
                                                    {tx.type === 'Site Fee' && <Building size={14} />}
                                                    {tx.type === 'Ad Revenue' && <Megaphone size={14} />}
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{tx.user}</td>
                                            <td className={`px-6 py-4 font-black ${tx.isPositive ? 'text-green-400' : 'text-white'}`}>
                                                {tx.amount}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                                                    tx.status === 'Completed' ? 'bg-green-900/30 text-green-400' : 
                                                    tx.status === 'Processing' ? 'bg-yellow-900/30 text-yellow-400' : 
                                                    'bg-red-900/30 text-red-400'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-500 text-xs font-bold uppercase tracking-wider">{tx.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {(activeTab === 'withdrawals' || activeTab === 'requests') && (
                        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-xl">
                             <div className="p-4 bg-dark-900 border-b border-dark-700 flex justify-between items-center">
                                 <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                     {activeTab === 'requests' ? 'Pending Approval Queue' : 'Withdrawal History'}
                                 </h3>
                                 <div className="text-xs font-bold text-gray-500">
                                     {activeTab === 'requests' ? pendingRequests.length : allWithdrawals.length} Records
                                 </div>
                             </div>
                            <table className="w-full text-left">
                                <thead className="bg-dark-900 text-xs text-gray-500 uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Method</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-700 text-sm">
                                    {(activeTab === 'requests' ? pendingRequests : allWithdrawals).map(w => (
                                        <tr key={w.id} className="hover:bg-dark-700/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-400 font-mono">{w.id}</td>
                                            <td className="px-6 py-4 font-bold text-white">{w.user}</td>
                                            <td className="px-6 py-4 text-gray-300">{w.method}</td>
                                            <td className="px-6 py-4 font-black text-yellow-500">{w.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                                                    w.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-400 animate-pulse' : 
                                                    w.status === 'Approved' ? 'bg-green-900/30 text-green-400' : 
                                                    'bg-red-900/30 text-red-400'
                                                }`}>
                                                    {w.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {w.status === 'Pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleWithdrawalAction(w.id, 'Approved')}
                                                            disabled={processingId === w.id}
                                                            className="p-1.5 bg-green-600 rounded hover:bg-green-500 text-white disabled:opacity-50 transition-colors shadow-lg"
                                                            title="Approve"
                                                        >
                                                            {processingId === w.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16}/>}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleWithdrawalAction(w.id, 'Rejected')}
                                                            disabled={processingId === w.id}
                                                            className="p-1.5 bg-red-600 rounded hover:bg-red-500 text-white disabled:opacity-50 transition-colors shadow-lg"
                                                            title="Reject"
                                                        >
                                                            <X size={16}/>
                                                        </button>
                                                    </div>
                                                )}
                                                {w.status !== 'Pending' && <span className="text-xs text-gray-600 font-mono">{w.date}</span>}
                                            </td>
                                        </tr>
                                    ))}
                                    {(activeTab === 'requests' ? pendingRequests : allWithdrawals).length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">No records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'subscriptions' && (
                        <div className="text-center py-20 text-gray-500 border-2 border-dashed border-dark-700 rounded-2xl bg-dark-800/30">
                            <Globe size={48} className="mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-white mb-2 uppercase italic tracking-tighter capitalize">{activeTab} Data</h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No data available for this report period.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
