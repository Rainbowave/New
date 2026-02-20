
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Shield, CheckCircle, DollarSign, Ban, Unlock,
    Loader2, Wallet, Flag, Zap, ShieldCheck, 
    User, Crown, Trash2, Video, Lock, Server, Star, Briefcase, 
    Smartphone, Image as ImageIcon, BookOpen, ShoppingBag, Gamepad2, Shuffle,
    Check, X, Activity, AlertTriangle, Home, LayoutGrid, Eye, MessageCircle, FileText,
    CreditCard, Calendar, MapPin, Mail, Globe, Clock, History, Key, RefreshCw, Edit2, Save, Users,
    Send
} from 'lucide-react';
import { db } from '../../services/db';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';

// Mock Data Generators for Admin View
const generateTransactions = () => Array.from({ length: 8 }).map((_, i) => ({
    id: `TX-${1000 + i}`,
    type: ['Deposit', 'Withdrawal', 'Subscription', 'Tip', 'Game Win'][i % 5],
    amount: (Math.random() * 500).toFixed(2),
    status: i === 0 ? 'Pending' : 'Completed',
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    method: ['Stripe', 'Crypto', 'Wallet'][i % 3]
}));

const generateLogs = () => Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    event: ['Login', 'Password Change', '2FA Enabled', 'Email Verified'][i % 4],
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
    location: 'New York, US',
    date: new Date(Date.now() - i * 10000000).toLocaleString()
}));

const generateUserContent = () => Array.from({ length: 6 }).map((_, i) => ({
    id: 500 + i,
    type: ['PHOTO', 'VIDEO', 'SHORT', 'COMIC'][i % 4],
    title: `User Upload #${i + 1}`,
    thumbnail: `https://picsum.photos/300/200?random=${i + 500}`,
    views: Math.floor(Math.random() * 5000),
    status: 'Public'
}));

export default function AdminUserDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    
    // Core User State
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});

    // Subscription State
    const [subTier, setSubTier] = useState('free');
    const [subPeriod, setSubPeriod] = useState('month');

    // Data States
    const [transactions, setTransactions] = useState<any[]>([]);
    const [securityLogs, setSecurityLogs] = useState<any[]>([]);
    const [userContent, setUserContent] = useState<any[]>([]);
    const [walletAmount, setWalletAmount] = useState('');

    useEffect(() => {
        if (id) {
            // Simulate API fetch delay
            setTimeout(() => {
                const data = db.getUser(id) as any;
                if (data) {
                    setUser(data);
                    setEditForm({
                        displayName: data.displayName,
                        description: data.description,
                        gender: data.gender || '',
                        pronouns: data.pronouns || '',
                        location: data.location || '',
                        email: data.email,
                        role: data.role
                    });
                    
                    // Set initial sub state
                    if (data.isPremium) {
                        setSubTier('lucistar');
                    } else {
                        setSubTier('free');
                    }

                    // Load Mock Data
                    setTransactions(generateTransactions());
                    setSecurityLogs(generateLogs());
                    setUserContent(generateUserContent());
                } else {
                    navigate('/admin/users');
                }
                setLoading(false);
            }, 600);
        }
    }, [id, navigate]);

    const handleSaveProfile = () => {
        if (!user) return;
        const updatedUser = { ...user, ...editForm };
        db.updateUser(user.id, updatedUser);
        setUser(updatedUser);
        setIsEditing(false);
        db.logAction('admin', 'update_profile', 'user', user.id, 'Admin manual edit');
    };

    const handleUpdateSubscription = () => {
        if (!user) return;
        const isPremium = subTier !== 'free';
        // In a real app, calculate expiry based on subPeriod
        const updated = db.updateUser(user.id, { isPremium, role: isPremium ? 'creator' : 'user' }); // Simple toggle logic for demo
        setUser(updated);
        alert(`Subscription updated to ${subTier.toUpperCase()} (${subPeriod}).`);
    };

    const handlePasswordReset = () => {
        if (window.confirm(`Send password reset email to ${user.email}?`)) {
            // Simulate API call
            setTimeout(() => {
                alert(`Reset link sent to ${user.email}`);
                db.logAction('admin', 'reset_password', 'user', user.id, 'Manual reset trigger');
            }, 500);
        }
    };

    const handleBalanceUpdate = (type: 'add' | 'remove') => {
        if (!walletAmount) return;
        const amount = parseFloat(walletAmount);
        if (isNaN(amount)) return;
        
        const adjustment = type === 'add' ? amount : -amount;
        if (window.confirm(`${type.toUpperCase()} ${amount} LSC from user wallet?`)) {
            const newBalance = db.updateWallet(user.id, adjustment);
            setUser({ ...user, walletBalance: newBalance });
            setWalletAmount('');
            
            // Add to local transaction list for feedback
            setTransactions(prev => [{
                id: `ADJ-${Date.now()}`,
                type: `Admin ${type === 'add' ? 'Credit' : 'Debit'}`,
                amount: amount.toFixed(2),
                status: 'Completed',
                date: new Date().toLocaleDateString(),
                method: 'System'
            }, ...prev]);
        }
    };

    const handleBanUser = () => {
        const newStatus = user.status === 'active' ? 'banned' : 'active';
        if (window.confirm(`${newStatus === 'banned' ? 'Ban' : 'Unban'} @${user.username}?`)) {
            const updated = db.updateUser(user.id, { status: newStatus });
            setUser(updated);
            db.logAction('admin', `${newStatus}_user`, 'user', user.id, 'Manual status change');
        }
    };

    if (loading || !user) return <div className="flex h-screen items-center justify-center bg-dark-900"><Loader2 className="animate-spin text-brand-500" size={48} /></div>;

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 min-h-screen pb-20">
            
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/users')} className="p-2 bg-dark-800 rounded-full text-gray-400 hover:text-white border border-white/5 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                            User Management
                            <span className="text-xs not-italic font-bold bg-dark-800 text-gray-400 px-2 py-1 rounded border border-white/10 tracking-widest">{user.id}</span>
                        </h1>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${isEditing ? 'bg-brand-600 text-white' : 'bg-dark-800 text-gray-300 border border-white/10 hover:text-white'}`}
                    >
                        {isEditing ? <Save size={14}/> : <Edit2 size={14}/>}
                        {isEditing ? 'Editing Mode' : 'Edit Profile'}
                    </button>
                    <button 
                        onClick={handleBanUser}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${user.status === 'active' ? 'bg-red-900/20 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-green-600 text-white hover:bg-green-500'}`}
                    >
                        {user.status === 'active' ? <Ban size={14}/> : <Unlock size={14}/>}
                        {user.status === 'active' ? 'Ban User' : 'Unban User'}
                    </button>
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* Left Column: Identity Card */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden shadow-xl relative group">
                        {/* Cover */}
                        <div className="h-32 bg-dark-900 relative">
                             {user.backgroundUrl && <img src={user.backgroundUrl} className="w-full h-full object-cover opacity-50" alt="" />}
                             <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent"></div>
                        </div>
                        
                        {/* Avatar & Info */}
                        <div className="px-6 pb-6 relative -mt-12">
                            <div className="flex justify-between items-end mb-4">
                                <div className="w-24 h-24 rounded-2xl p-1 bg-dark-800 border border-white/5 shadow-2xl relative">
                                    <img src={user.avatarUrl} className="w-full h-full rounded-xl object-cover" alt="" />
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-dark-800 flex items-center justify-center ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {user.status === 'active' ? <Check size={12} className="text-black" /> : <X size={12} className="text-white" />}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                        <Briefcase size={10} /> {user.role}
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Joined {new Date(user.joinedAt).toLocaleDateString()}</div>
                                </div>
                            </div>

                            {isEditing ? (
                                <div className="space-y-4 animate-in fade-in">
                                    <div>
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Display Name</label>
                                        <input 
                                            type="text" 
                                            value={editForm.displayName} 
                                            onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                                            className="w-full bg-dark-900 border border-white/10 rounded p-2 text-sm text-white focus:border-brand-500 outline-none font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            value={editForm.email} 
                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                            className="w-full bg-dark-900 border border-white/10 rounded p-2 text-sm text-white focus:border-brand-500 outline-none font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Gender</label>
                                            <input type="text" value={editForm.gender} onChange={(e) => setEditForm({...editForm, gender: e.target.value})} className="w-full bg-dark-900 border border-white/10 rounded p-2 text-xs text-white" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Pronouns</label>
                                            <input type="text" value={editForm.pronouns} onChange={(e) => setEditForm({...editForm, pronouns: e.target.value})} className="w-full bg-dark-900 border border-white/10 rounded p-2 text-xs text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Bio</label>
                                        <textarea 
                                            value={editForm.description} 
                                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                            className="w-full bg-dark-900 border border-white/10 rounded p-2 text-xs text-white focus:border-brand-500 outline-none resize-none h-20"
                                        />
                                    </div>
                                    <button onClick={handleSaveProfile} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-3 rounded-lg uppercase tracking-widest text-xs transition-all">Save Changes</button>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-xl font-black text-white">{user.displayName}</h2>
                                    <p className="text-sm text-gray-400 font-medium mb-4">@{user.username}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-dark-900/50 p-3 rounded-lg border border-white/5">
                                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Users size={10}/> Followers</div>
                                            <div className="text-lg font-black text-white">{user.followers?.toLocaleString() || 0}</div>
                                        </div>
                                        <div className="bg-dark-900/50 p-3 rounded-lg border border-white/5">
                                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Star size={10}/> Rating</div>
                                            <div className="text-lg font-black text-white">4.9/5</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-xs text-gray-300">
                                            <Mail size={14} className="text-gray-500" /> {user.email}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-300">
                                            <MapPin size={14} className="text-gray-500" /> {user.location || 'Unknown Location'}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-300">
                                            <Activity size={14} className="text-gray-500" /> {user.gender || 'Not specified'} ({user.pronouns})
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Status Card */}
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldCheck size={14} /> Account Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-dark-900/50 rounded-lg border border-white/5">
                                <span className="text-xs font-bold text-gray-300">Email Verified</span>
                                {user.isVerified ? <CheckCircle size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />}
                            </div>
                            <div className="flex justify-between items-center p-3 bg-dark-900/50 rounded-lg border border-white/5">
                                <span className="text-xs font-bold text-gray-300">Identity Verified</span>
                                {user.verificationStatus === 'verified' ? <CheckCircle size={16} className="text-green-500" /> : <span className="text-[10px] font-bold text-yellow-500 uppercase">Pending</span>}
                            </div>
                            <div className="flex justify-between items-center p-3 bg-dark-900/50 rounded-lg border border-white/5">
                                <span className="text-xs font-bold text-gray-300">2FA Enabled</span>
                                <CheckCircle size={16} className="text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Tabs */}
                <div className="xl:col-span-8">
                    <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
                        
                        {/* Tabs Navigation */}
                        <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'overview', icon: LayoutGrid, label: 'Content' },
                                { id: 'financials', icon: Wallet, label: 'Financials' },
                                { id: 'billing', icon: CreditCard, label: 'Billing & Subs' },
                                { id: 'security', icon: Lock, label: 'Security' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-8 py-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-dark-900/50 text-white border-b-2 border-brand-500' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    <tab.icon size={14} /> {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-8 flex-1">
                            
                            {/* --- CONTENT TAB --- */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-in fade-in">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Published Assets</h3>
                                        <div className="flex gap-2">
                                            <span className="bg-dark-900 px-3 py-1 rounded text-[10px] font-bold text-gray-400 border border-white/5">{userContent.length} Items</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {userContent.map((item) => (
                                            <div key={item.id} className="group relative aspect-video bg-dark-900 rounded-xl overflow-hidden border border-white/5 cursor-pointer">
                                                <img src={item.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" alt="" />
                                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[8px] font-black text-white uppercase">
                                                    {item.type}
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                                    <p className="text-xs font-bold text-white truncate">{item.title}</p>
                                                    <div className="flex justify-between mt-1">
                                                        <span className="text-[9px] text-gray-400 flex items-center gap-1"><Eye size={10}/> {item.views}</span>
                                                        <span className="text-[9px] text-green-400 font-bold">{item.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center">
                                        <button className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest border-b border-gray-700 hover:border-white pb-0.5 transition-all">
                                            View All Content
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* --- FINANCIALS TAB --- */}
                            {activeTab === 'financials' && (
                                <div className="space-y-8 animate-in fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-dark-900/50 border border-white/5 p-6 rounded-2xl">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Balance</div>
                                            <div className="text-3xl font-black text-white tabular-nums flex items-center gap-1">
                                                {(user.walletBalance || 0).toLocaleString()} <span className="text-lg text-brand-500">LSC</span>
                                            </div>
                                        </div>
                                        <div className="bg-dark-900/50 border border-white/5 p-6 rounded-2xl">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Earned</div>
                                            <div className="text-3xl font-black text-green-500 tabular-nums">45,200 <span className="text-lg">LSC</span></div>
                                        </div>
                                        <div className="bg-dark-900/50 border border-white/5 p-6 rounded-2xl">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Pending Payouts</div>
                                            <div className="text-3xl font-black text-yellow-500 tabular-nums">1,200 <span className="text-lg">LSC</span></div>
                                        </div>
                                    </div>

                                    <div className="bg-dark-900/30 border border-white/5 rounded-2xl p-6">
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Zap size={14} /> Manual Adjustment
                                        </h3>
                                        <div className="flex gap-4">
                                            <div className="relative flex-1">
                                                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"/>
                                                <input 
                                                    type="number" 
                                                    value={walletAmount}
                                                    onChange={(e) => setWalletAmount(e.target.value)}
                                                    placeholder="Enter amount" 
                                                    className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white font-bold focus:border-brand-500 outline-none"
                                                />
                                            </div>
                                            <button onClick={() => handleBalanceUpdate('add')} className="px-6 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black text-xs uppercase tracking-widest">Credit</button>
                                            <button onClick={() => handleBalanceUpdate('remove')} className="px-6 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest">Debit</button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Transaction History</h3>
                                        <div className="border border-white/5 rounded-2xl overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead className="bg-dark-900 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                    <tr>
                                                        <th className="px-6 py-4">ID</th>
                                                        <th className="px-6 py-4">Type</th>
                                                        <th className="px-6 py-4">Amount</th>
                                                        <th className="px-6 py-4">Method</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5 text-xs font-bold text-gray-300">
                                                    {transactions.map((tx) => (
                                                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                                            <td className="px-6 py-4 font-mono text-gray-500">{tx.id}</td>
                                                            <td className="px-6 py-4 text-white">{tx.type}</td>
                                                            <td className={`px-6 py-4 ${tx.type.includes('Withdrawal') || tx.type.includes('Debit') ? 'text-red-400' : 'text-green-400'}`}>
                                                                {tx.type.includes('Withdrawal') || tx.type.includes('Debit') ? '-' : '+'}{tx.amount}
                                                            </td>
                                                            <td className="px-6 py-4">{tx.method}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 rounded text-[9px] uppercase tracking-widest ${tx.status === 'Completed' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'}`}>{tx.status}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-gray-500">{tx.date}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- BILLING & SUBS TAB --- */}
                            {activeTab === 'billing' && (
                                <div className="space-y-8 animate-in fade-in">
                                    <div className="bg-gradient-to-r from-brand-900/20 to-purple-900/20 border border-brand-500/20 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">Manage Subscription</h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Current Plan: <span className="text-white">{subTier === 'free' ? 'Free Member' : subTier === 'lucistar' ? 'LuciStar Premium' : 'PreStar'}</span>
                                            </p>
                                        </div>
                                        <div className="flex gap-3 bg-dark-900/50 p-2 rounded-xl border border-white/5">
                                            <select 
                                                value={subTier}
                                                onChange={(e) => setSubTier(e.target.value)}
                                                className="bg-dark-800 text-white text-xs font-bold rounded-lg px-3 py-2 outline-none border border-white/10"
                                            >
                                                <option value="free">Free Tier</option>
                                                <option value="prestar">PreStar</option>
                                                <option value="lucistar">LuciStar</option>
                                            </select>
                                            <select 
                                                value={subPeriod}
                                                onChange={(e) => setSubPeriod(e.target.value)}
                                                className="bg-dark-800 text-white text-xs font-bold rounded-lg px-3 py-2 outline-none border border-white/10"
                                            >
                                                <option value="month">Monthly</option>
                                                <option value="3months">3 Months</option>
                                                <option value="year">Yearly</option>
                                            </select>
                                            <button 
                                                onClick={handleUpdateSubscription}
                                                className="bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all"
                                            >
                                                Update Plan
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Payment Methods</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-dark-900 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-brand-500/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center"><CreditCard size={18} /></div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">Visa •••• 4242</div>
                                                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Expires 12/28</div>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest bg-brand-500/10 px-2 py-1 rounded">Default</span>
                                            </div>
                                            <div className="p-4 bg-dark-900 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-brand-500/50 opacity-60 hover:opacity-100 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-8 bg-[#003087] rounded flex items-center justify-center text-white italic font-black">Pay</div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">PayPal</div>
                                                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Connected</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- SECURITY TAB --- */}
                            {activeTab === 'security' && (
                                <div className="space-y-8 animate-in fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-dark-900/50 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <ShieldCheck size={24} className="text-green-500" />
                                                <h4 className="font-black text-white uppercase tracking-wider text-sm">Security Status</h4>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                                    <span>Email Verified</span>
                                                    <span className="text-green-400 flex items-center gap-1"><Check size={12}/> Yes</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                                    <span>Phone Verified</span>
                                                    <span className="text-green-400 flex items-center gap-1"><Check size={12}/> Yes</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                                    <span>2-Factor Auth</span>
                                                    <span className="text-yellow-500 flex items-center gap-1">Disabled</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={handlePasswordReset}
                                                className="w-full mt-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Send size={12}/> Send Password Reset
                                            </button>
                                        </div>

                                        <div className="p-6 bg-dark-900/50 rounded-2xl border border-white/5">
                                             <div className="flex items-center gap-3 mb-4">
                                                <Key size={24} className="text-blue-500" />
                                                <h4 className="font-black text-white uppercase tracking-wider text-sm">Active Sessions</h4>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-2 bg-dark-800 rounded-lg border border-white/5">
                                                    <div className="text-gray-500"><Smartphone size={16} /></div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-white">iPhone 14 Pro</div>
                                                        <div className="text-[10px] text-gray-500">New York, US • Active Now</div>
                                                    </div>
                                                </div>
                                                 <div className="flex items-center gap-3 p-2 bg-dark-800 rounded-lg border border-white/5 opacity-60">
                                                    <div className="text-gray-500"><Globe size={16} /></div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-white">Chrome (Windows)</div>
                                                        <div className="text-[10px] text-gray-500">New York, US • 2h ago</div>
                                                    </div>
                                                    <button className="text-red-500 text-[10px] font-bold uppercase hover:underline">Revoke</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Access Logs</h3>
                                        <div className="border border-white/5 rounded-2xl overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead className="bg-dark-900 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                    <tr>
                                                        <th className="px-6 py-4">Event</th>
                                                        <th className="px-6 py-4">Location</th>
                                                        <th className="px-6 py-4">IP Address</th>
                                                        <th className="px-6 py-4 text-right">Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5 text-xs font-bold text-gray-300">
                                                    {securityLogs.map((log) => (
                                                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                                            <td className="px-6 py-4 text-white">{log.event}</td>
                                                            <td className="px-6 py-4">{log.location}</td>
                                                            <td className="px-6 py-4 font-mono text-gray-500">{log.ip}</td>
                                                            <td className="px-6 py-4 text-right text-gray-500">{log.date}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
