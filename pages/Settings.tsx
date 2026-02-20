
import React, { useState, useEffect, useRef } from 'react';
import { 
    User, Shield, Bell, Lock, Camera, 
    Heart, Flame, Wallet, History,
    Check, Loader2, Globe, Sparkles, Plus, Trash2,
    DollarSign, Tag, Crown, Info, Eye, 
    ChevronRight, Scan, CheckCircle, Banknote, 
    ArrowDownToLine, Users as UsersIcon, Languages, Moon, Sun, 
    Image as ImageIcon, ShieldCheck, Save, Settings as SettingsIcon, 
    AlertCircle, RefreshCw, Zap, ChevronDown, Calendar, FileText, 
    CreditCard, Bitcoin, MapPin, AlignLeft, X, EyeOff, MessageSquare, ShieldAlert,
    Search as SearchIcon, Clock, UserMinus, MessageCircle, ShieldX,
    Radio, Coins, Filter, EyeOff as HideIcon, Hash, Fingerprint, ShieldEllipsis,
    Smartphone, UploadCloud, Timer, XCircle, BrainCircuit, ArrowLeft,
    CheckSquare, Terminal, LayoutList, BellRing, Rainbow, Activity, Flag, HelpCircle, UserPlus, Smile,
    Gift, Coffee, Gem, Star, Radar, Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User as UserType, NotificationPreferences } from '../types';
import { db } from '../services/db';
import { analyzeVerificationProof } from '../services/geminiService';

interface SettingsProps {
    currentUser?: UserType;
}

const LOCATIONS = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Brazil', 'Japan', 'South Korea', 'Italy', 'Spain', 'Mexico', 'India', 'Other'];
const LANGUAGES = ['English', 'Spanish', 'Arabic', 'French', 'German', 'Portuguese', 'Japanese', 'Korean', 'Chinese', 'Hindi'];
const PRONOUNS = ['She/Her', 'He/Him', 'They/Them', 'Ask Me', 'Other'];
const SEXUALITIES = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Asexual', 'Queer', 'Other'];
const GENDERS = ['Man', 'Woman', 'Non-binary', 'Transgender', 'Other'];

const AVAILABLE_TAGS = ['Gaming', 'Art', 'Cosplay', 'ASMR', 'Vlogging', 'Music', 'Fitness', 'Cooking', 'Tech', 'Comics', 'Photography', 'Alternative', 'Fashion'];

// Unified Config for Identity Flags/Gradients (Matches Register.tsx)
const IDENTITY_CONFIG: any = {
    'Man': { emoji: '👨', desc: 'He/Him' },
    'Woman': { emoji: '👩', desc: 'She/Her' },
    'Non-binary': { emoji: '🧑', desc: 'They/Them' },
    'Transgender': { emoji: '🏳️‍⚧️', desc: 'Trans' },
    'Other': { emoji: '🌈', desc: 'Custom' }
};

const SEXUALITY_CONFIG: any = {
    'Straight': { gradient: 'bg-gradient-to-b from-gray-900 via-gray-600 to-white', desc: 'Heterosexual' },
    'Gay': { gradient: 'bg-gradient-to-b from-teal-500 via-green-400 to-blue-500', desc: 'Gay' },
    'Lesbian': { gradient: 'bg-gradient-to-b from-orange-500 via-white to-pink-600', desc: 'Lesbian' },
    'Bisexual': { gradient: 'bg-gradient-to-b from-pink-600 via-purple-500 to-blue-600', desc: 'Bisexual' },
    'Pansexual': { gradient: 'bg-gradient-to-b from-pink-500 via-yellow-400 to-blue-400', desc: 'Pansexual' },
    'Asexual': { gradient: 'bg-gradient-to-b from-black via-gray-400 to-purple-800', desc: 'Asexual' },
    'Queer': { gradient: 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500', desc: 'Queer' },
    'Other': { gradient: 'bg-gradient-to-br from-gray-700 to-gray-500', desc: 'Other' }
};

interface PricingPlan {
    id: string;
    name: string;
    price: string;
    duration: 'day' | 'month' | 'year';
}

export default function Settings({ currentUser }: SettingsProps) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile'); 
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    
    // Check Permissions
    const canMonetize = currentUser?.userSettings?.canMonetize ?? (currentUser?.role === 'creator' || currentUser?.role === 'admin');
    
    // Tag Search State
    const [tagSearchInput, setTagSearchInput] = useState('');
    
    // Verification State
    const [verificationStep, setVerificationStep] = useState(1);
    const [generatedCode, setGeneratedCode] = useState('');
    const [expiryTime, setExpiryTime] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifError, setVerifError] = useState<string | null>(null);

    const [spaceMode, setSpaceMode] = useState<'dating' | 'naughty'>(
        (currentUser?.contentPreference as any) === 'adult' ? 'naughty' : 'dating'
    );

    // Tip Icons State - Multi slots
    const [tipIcons, setTipIcons] = useState<Record<string, string>>({
        '50': '',
        '100': '',
        '200': '',
        '500': '',
        '1000': ''
    });

    // Dynamic Subscription Pricing State
    const [pricingPlans, setPricingPlans] = useState<{dating: PricingPlan[], naughty: PricingPlan[]}>({
        dating: [
            { id: 'd1', duration: 'day', name: '24h Pass', price: '4.99' },
            { id: 'd2', duration: 'month', name: 'Dating Member', price: '14.99' },
            { id: 'd3', duration: 'year', name: 'Soulmate Tier', price: '129.99' }
        ],
        naughty: [
            { id: 'n1', duration: 'day', name: 'Quick Thrill', price: '9.99' },
            { id: 'n2', duration: 'month', name: 'Naughty VIP', price: '29.99' },
            { id: 'n3', duration: 'year', name: 'Ultimate Desire', price: '299.99' }
        ]
    });

    // Core Profile Data
    const [profileData, setProfileData] = useState({
        displayName: currentUser?.displayName || '',
        username: currentUser?.username || '',
        description: currentUser?.description || '',
        naughtyDescription: currentUser?.naughtyDescription || '', 
        location: currentUser?.location || 'United States',
        language: currentUser?.language || 'English',
        pronouns: currentUser?.pronouns || 'He/Him',
        sexuality: currentUser?.sexuality || 'Straight',
        gender: currentUser?.gender || 'Man',
        tags: currentUser?.tags || [] as string[],
        avatar: currentUser?.avatarUrl || '',
        background: currentUser?.backgroundUrl || ''
    });
    
    // Discovery Preferences
    const [discoveryPrefs, setDiscoveryPrefs] = useState({
        interestedIn: ['Woman'] as string[],
        preferredOrientations: ['Straight', 'Bisexual'] as string[],
        maxDistance: 50, // km
        preferredLanguage: 'English',
        preferredCountry: 'United States',
        subscriberOnly: false
    });

    // Integrated Privacy & Security
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: currentUser?.profileVisibility || 'public',
        appearInSearch: currentUser?.appearInSearch ?? true,
        showOnlineStatus: currentUser?.showOnlineStatus ?? true,
        messageFrom: currentUser?.messageFrom || 'everyone',
        showPronouns: currentUser?.showPronouns ?? true,
        showSexuality: currentUser?.showSexuality ?? false,
        vaultProtection: currentUser?.vaultProtection ?? true,
        watermarkEnabled: currentUser?.watermarkEnabled ?? true,
        deletionMonths: currentUser?.deletionMonths || 6
    });

    // Notification Preferences
    const [notificationSettings, setNotificationSettings] = useState<NotificationPreferences>({
        newSubscriptions: true,
        tips: true,
        ppvUnlocks: true,
        messages: true,
        comments: true,
        newContent: true,
        liveStatus: true,
        expiringSubscriptions: true,
        upcomingRenewals: true,
        allowCrossMode: false,
        ...currentUser?.notificationPreferences
    });

    useEffect(() => {
        let interval: any;
        if (expiryTime) {
            interval = setInterval(() => {
                const diff = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
                setTimeLeft(diff);
                if (diff <= 0) {
                    setGeneratedCode('');
                    setExpiryTime(null);
                    setVerificationStep(1);
                    setProofFile(null);
                    setProofPreview(null);
                    clearInterval(interval);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [expiryTime]);

    const handleGenerateCode = () => {
        const randomX = Math.random().toString(36).substring(2, 6).toUpperCase();
        const randomY = Math.random().toString(36).substring(2, 6).toUpperCase();
        const code = `${currentUser?.id.toUpperCase() || 'USER'}-${randomX}-${randomY}`;
        setGeneratedCode(code);
        setExpiryTime(Date.now() + 10 * 60 * 1000); 
        setVerifError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProofFile(file);
            setProofPreview(URL.createObjectURL(file));
        }
    };
    
    // New handler for tip icons
    const handleTipIconUpload = (amount: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setTipIcons(prev => ({ ...prev, [amount]: url }));
        }
    };

    const handleStartVerification = async () => {
        if (!proofFile) return;
        setIsVerifying(true);
        setVerifError(null);
        try {
            const result = await analyzeVerificationProof(proofFile, generatedCode);
            if (result.verified) {
                db.updateUser(currentUser!.id, { verificationStatus: 'verified', isVerified: true });
                setSuccessMessage('Verification Complete.');
                setGeneratedCode('');
                setExpiryTime(null);
                setProofFile(null);
                setProofPreview(null);
                setVerificationStep(1);
            } else {
                setVerifError(result.reason || 'Verification failed. Ensure face and code are clearly visible.');
            }
        } catch (e) {
            setVerifError('Security check failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleUpdatePlan = (id: string, field: keyof PricingPlan, value: string) => {
        setPricingPlans(prev => ({
            ...prev,
            [spaceMode]: prev[spaceMode].map(plan => plan.id === id ? { ...plan, [field]: value } : plan)
        }));
    };

    const handleAddPlan = () => {
        const newPlan: PricingPlan = {
            id: `plan_${Date.now()}`,
            name: 'New Package',
            price: '0.00',
            duration: 'month'
        };
        setPricingPlans(prev => ({
            ...prev,
            [spaceMode]: [...prev[spaceMode], newPlan]
        }));
    };

    const handleRemovePlan = (id: string) => {
        setPricingPlans(prev => ({
            ...prev,
            [spaceMode]: prev[spaceMode].filter(plan => plan.id !== id)
        }));
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleNotificationToggle = (key: keyof NotificationPreferences) => {
        setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async (section: string) => {
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 800));
            // In a real app, we would save the pricingPlans to the DB here
            db.updateUser(currentUser!.id, { 
                ...profileData, 
                ...privacySettings,
                // tipIcon removed, saving tipIcons map instead if backend supported
                notificationPreferences: notificationSettings,
                contentPreference: spaceMode === 'naughty' ? 'adult' : spaceMode
            });
            
            setSuccessMessage(`${section} settings updated.`);
            setTimeout(() => setSuccessMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };
    
    // Tag Handling
    const handleAddTag = (tag: string) => {
        if (!profileData.tags.includes(tag)) {
            setProfileData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
        setTagSearchInput('');
    };

    const handleRemoveTag = (tag: string) => {
        setProfileData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };
    
    // Discovery Toggle Handling
    const toggleDiscoveryList = (key: 'interestedIn' | 'preferredOrientations', value: string) => {
        setDiscoveryPrefs(prev => {
            const list = prev[key];
            if (list.includes(value)) {
                return { ...prev, [key]: list.filter(i => i !== value) };
            } else {
                return { ...prev, [key]: [...list, value] };
            }
        });
    };

    const ToggleRow = ({ label, desc, active, onClick, icon: Icon }: any) => (
        <div className="flex items-center justify-between py-5 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-4">
                {Icon && <div className={active ? (spaceMode === 'naughty' ? 'text-brand-500' : 'text-brand-second') : 'text-gray-600'}><Icon size={20} /></div>}
                <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-tight">{label}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{desc}</p>
                </div>
            </div>
            <button 
                onClick={onClick}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 border border-white/10 ${active ? (spaceMode === 'naughty' ? 'bg-brand-500' : 'bg-brand-second') : 'bg-dark-900'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${active ? 'left-7' : 'left-1'}`}></div>
            </button>
        </div>
    );

    const SettingRow = ({ label, children, help, icon: Icon }: any) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b border-white/5 last:border-0">
            <div className="flex flex-col">
                <label className="text-[11px] font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-gray-400" />} {label}
                </label>
                {help && <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">{help}</p>}
            </div>
            <div className="md:col-span-2">
                {children}
            </div>
        </div>
    );

    if (!currentUser) return null;

    // Theme colors based on active mode
    const modeColor = spaceMode === 'naughty' ? 'text-brand-500' : 'text-brand-second';
    const modeBg = spaceMode === 'naughty' ? 'bg-brand-500' : 'bg-brand-second';
    const modeBorder = spaceMode === 'naughty' ? 'border-brand-500' : 'border-brand-second';

    // Tabs List for Mobile/Top Nav
    const tabsList = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'interests', label: 'Interests', icon: Hash },
        { id: 'alerts', label: 'Alerts', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
        ...(canMonetize ? [{ id: 'monetize', label: 'Monetize', icon: DollarSign }] : []),
        { id: 'verify', label: 'Verify', icon: ShieldCheck },
        { id: 'theme', label: 'Theme', icon: Moon },
    ];

    return (
        <div className="min-h-screen bg-dark-850">
            <div className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-white/5 px-4 md:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"><ArrowLeft size={20}/></button>
                    <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <SettingsIcon size={24} className="text-brand-500" /> Settings
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {successMessage && <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest hidden md:block">{successMessage}</div>}
                    <button 
                        onClick={() => handleSave(activeTab.toUpperCase())}
                        className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-brand-500 hover:text-white transition-all shadow-lg"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                    </button>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-4 md:p-8 flex flex-col gap-10">
                <div className="flex-1">
                    {/* Top Tab Bar */}
                    <div className="flex items-center gap-2 mb-6 p-1 bg-dark-800/50 rounded-xl border border-white/5 w-full overflow-x-auto no-scrollbar">
                         {tabsList.map(tab => (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                             >
                                 <tab.icon size={12} /> {tab.label}
                             </button>
                         ))}
                         
                         {/* Mode Switcher inside bar */}
                         <div className="ml-auto flex items-center gap-2 pl-4 border-l border-white/5">
                            <button 
                                onClick={() => setSpaceMode('dating')}
                                className={`p-2 rounded-lg transition-all ${spaceMode === 'dating' ? 'bg-brand-second text-black' : 'text-gray-600 hover:text-white'}`}
                                title="Dating Mode"
                            >
                                <Heart size={14} fill={spaceMode === 'dating' ? 'currentColor' : 'none'} />
                            </button>
                            <button 
                                onClick={() => setSpaceMode('naughty')}
                                className={`p-2 rounded-lg transition-all ${spaceMode === 'naughty' ? 'bg-brand-500 text-white' : 'text-gray-600 hover:text-white'}`}
                                title="Naughty Mode"
                            >
                                <Flame size={14} fill={spaceMode === 'naughty' ? 'currentColor' : 'none'} />
                            </button>
                         </div>
                    </div>

                    {activeTab === 'profile' && (
                        <div className="animate-in fade-in duration-500 bg-dark-800 border border-white/5 rounded-sm p-6 md:p-10">
                            <h3 className="text-xl font-black text-white mb-10 uppercase italic tracking-tighter flex items-center gap-3">
                                {spaceMode === 'naughty' ? <Flame className="text-brand-500" /> : <Heart className="text-brand-second" />} 
                                {spaceMode === 'naughty' ? 'Naughty Profile' : 'Dating Profile'}
                            </h3>
                            
                            {/* Manage Content Button */}
                            <div className="flex justify-between items-center bg-dark-900 border border-white/5 p-4 rounded-xl mb-6">
                                <div>
                                    <h4 className="font-bold text-white text-sm">Content Studio</h4>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase mt-1">Manage your posts and uploads</p>
                                </div>
                                <button onClick={() => navigate('/manage-content')} className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all">
                                    Open Manager
                                </button>
                            </div>

                            <SettingRow label="Profile Images">
                                <div className="flex gap-6 items-center">
                                    <div className="w-24 h-24 rounded-sm bg-dark-900 overflow-hidden relative group border border-white/5">
                                        <img src={profileData.avatar} className="w-full h-full object-cover" alt="" />
                                        <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><Camera size={20}/></button>
                                    </div>
                                    <div className="flex-1 h-24 rounded-sm bg-dark-900 overflow-hidden relative group border border-white/5">
                                        <img src={profileData.background || 'https://picsum.photos/800/200?random=bg'} className="w-full h-full object-cover opacity-40" alt="" />
                                        <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><ImageIcon size={20}/></button>
                                    </div>
                                </div>
                            </SettingRow>

                            <SettingRow label="Account Details">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1 block ml-1">Username</label>
                                            <div className="relative group">
                                                <input type="text" value={profileData.username} onChange={e => setProfileData({...profileData, username: e.target.value})} placeholder="Username" className="w-full bg-dark-900 border border-white/5 p-4 text-sm text-white focus:border-brand-500 outline-none" />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"><SearchIcon size={14} /></span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1 block ml-1">User ID</label>
                                            <div className="relative group">
                                                <input type="text" value={currentUser.id} readOnly className="w-full bg-black/40 border border-white/5 p-4 text-sm text-gray-500 outline-none cursor-not-allowed font-mono" />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700"><Fingerprint size={14} /></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1 block ml-1">Display Name</label>
                                        <input type="text" value={profileData.displayName} onChange={e => setProfileData({...profileData, displayName: e.target.value})} placeholder="Display Name" className="w-full bg-dark-900 border border-white/5 p-4 text-sm text-white focus:border-brand-500 outline-none" />
                                    </div>
                                </div>
                            </SettingRow>

                            <SettingRow label="Bio Description" help={`Set a bio specifically for your ${spaceMode === 'naughty' ? 'Naughty' : 'Dating'} presence.`}>
                                <textarea 
                                    value={spaceMode === 'naughty' ? profileData.naughtyDescription : profileData.description} 
                                    onChange={e => setProfileData({...profileData, [spaceMode === 'naughty' ? 'naughtyDescription' : 'description']: e.target.value})} 
                                    placeholder={`Tell the ${spaceMode === 'naughty' ? 'Naughty' : 'Dating'} community about yourself...`} 
                                    className="w-full bg-dark-900 border border-white/5 p-4 text-sm text-white focus:border-brand-500 outline-none min-h-[120px] resize-none" 
                                />
                            </SettingRow>

                            <SettingRow label="Identity & Preference">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-3 block ml-1">Pronouns</label>
                                        <div className="flex flex-wrap gap-2">
                                            {PRONOUNS.map(p => (
                                                <button 
                                                    key={p} 
                                                    onClick={() => setProfileData({...profileData, pronouns: p})}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${profileData.pronouns === p ? 'bg-white text-black border-white' : 'bg-dark-900 text-gray-500 border-white/5 hover:text-white'}`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Gender - Emojis */}
                                    <div>
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-3 block ml-1">Gender Identity</label>
                                        <div className="flex flex-wrap gap-2">
                                            {GENDERS.map(g => {
                                                const config = IDENTITY_CONFIG[g] || IDENTITY_CONFIG['Other'];
                                                const isSelected = profileData.gender === g;
                                                return (
                                                    <button 
                                                        key={g} 
                                                        onClick={() => setProfileData({...profileData, gender: g})}
                                                        className={`relative overflow-hidden px-4 py-2 rounded-lg text-left transition-all border group ${isSelected ? 'border-brand-500 bg-brand-900/10 scale-105' : 'border-white/5 bg-dark-900 hover:border-white/20'}`}
                                                    >
                                                        <div className="relative z-10 flex items-center gap-2">
                                                            <span className="text-xl">{config.emoji}</span>
                                                            <span className="text-[10px] font-black text-white uppercase tracking-wider">{g}</span>
                                                            {isSelected && <CheckCircle size={10} className="text-brand-500" />}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Sexuality - Flags */}
                                    <div>
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-3 block ml-1">Orientation</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {SEXUALITIES.map(s => {
                                                const config = SEXUALITY_CONFIG[s] || SEXUALITY_CONFIG['Other'];
                                                const isSelected = profileData.sexuality === s;
                                                return (
                                                    <button 
                                                        key={s} 
                                                        onClick={() => setProfileData({...profileData, sexuality: s})}
                                                        className={`relative overflow-hidden w-full h-12 rounded-lg text-left transition-all border group ${isSelected ? 'border-white ring-2 ring-brand-500/50 scale-[1.02] shadow-xl' : 'border-transparent hover:scale-[1.01]'}`}
                                                    >
                                                        {/* Flag Strip Background */}
                                                        <div className={`absolute inset-0 ${config.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                                                        
                                                        <div className="relative px-4 h-full flex items-center justify-between z-10">
                                                            <div>
                                                                <span className="text-sm font-black text-white uppercase tracking-wide block drop-shadow-md">{s}</span>
                                                                <span className="text-[8px] font-bold text-white/90 uppercase tracking-widest drop-shadow-sm">{config.desc}</span>
                                                            </div>
                                                            {isSelected && <div className="bg-white text-black rounded-full p-1"><CheckCircle size={12}/></div>}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </SettingRow>
                            
                            <SettingRow label="Location & Language">
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <select value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} className="w-full bg-dark-900 border border-white/5 p-4 text-sm text-white focus:border-brand-500 outline-none">
                                        {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                    <select value={profileData.language} onChange={e => setProfileData({...profileData, language: e.target.value})} className="w-full bg-dark-900 border border-white/5 p-4 text-sm text-white focus:border-brand-500 outline-none">
                                        {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                                    </select>
                                </div>
                            </SettingRow>
                        </div>
                    )}
                    
                    {activeTab === 'interests' && (
                         <div className="animate-in fade-in duration-500 bg-dark-800 border border-white/5 rounded-sm p-6 md:p-10">
                            <h3 className="text-xl font-black text-white mb-6 uppercase italic tracking-tighter flex items-center gap-3">
                                <Hash className="text-brand-500" /> Discovery & Tags
                            </h3>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">
                                Configure how you are found and what you want to see.
                            </p>

                            {/* Tag Management */}
                            <SettingRow label="Your Tags" help="Tags that help your profile be discovered in global searches and community suggestions.">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input 
                                            type="text" 
                                            value={tagSearchInput}
                                            onChange={(e) => setTagSearchInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && tagSearchInput.trim()) {
                                                    e.preventDefault();
                                                    handleAddTag(tagSearchInput.trim());
                                                }
                                            }}
                                            placeholder="Find or add new tags..." 
                                            className="w-full bg-dark-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-brand-500 outline-none transition-all placeholder:text-gray-600" 
                                        />
                                        {tagSearchInput && (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                <button 
                                                    onClick={() => handleAddTag(tagSearchInput.trim())}
                                                    className="bg-brand-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg hover:bg-brand-600 transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-2 min-h-[50px] p-4 bg-dark-900/50 rounded-xl border border-white/5">
                                        {profileData.tags.length === 0 && <span className="text-xs text-gray-600 p-2 italic">No tags selected. Add some above.</span>}
                                        {profileData.tags.map(tag => (
                                            <span 
                                                key={tag} 
                                                className="bg-brand-500/10 text-brand-500 border border-brand-500/20 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 group hover:bg-brand-500/20 transition-colors"
                                            >
                                                {tag}
                                                <button onClick={() => handleRemoveTag(tag)} className="hover:text-white transition-colors">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </SettingRow>

                            {/* Discovery Preferences */}
                            <div className="mt-12 pt-10 border-t border-white/5">
                                <h3 className="text-lg font-black text-white mb-8 uppercase italic tracking-tighter flex items-center gap-3">
                                    <Radar className="text-blue-500" size={24} /> Matching & Discovery
                                </h3>
                                
                                <SettingRow label="Interested In" help="Show me people who identify as..." icon={UsersIcon}>
                                     <div className="flex flex-wrap gap-2">
                                         {GENDERS.map(g => (
                                             <button 
                                                 key={g}
                                                 onClick={() => toggleDiscoveryList('interestedIn', g)}
                                                 className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${discoveryPrefs.interestedIn.includes(g) ? 'bg-blue-600 text-white border-blue-500' : 'bg-dark-900 text-gray-500 border-white/5 hover:text-white'}`}
                                             >
                                                 {g}
                                             </button>
                                         ))}
                                     </div>
                                </SettingRow>

                                <SettingRow label="Preferred Orientations" help="Filter matches by their orientation." icon={Heart}>
                                     <div className="flex flex-wrap gap-2">
                                         {SEXUALITIES.map(s => (
                                             <button 
                                                 key={s}
                                                 onClick={() => toggleDiscoveryList('preferredOrientations', s)}
                                                 className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${discoveryPrefs.preferredOrientations.includes(s) ? 'bg-pink-600 text-white border-pink-500' : 'bg-dark-900 text-gray-500 border-white/5 hover:text-white'}`}
                                             >
                                                 {s}
                                             </button>
                                         ))}
                                     </div>
                                </SettingRow>

                                <SettingRow label="Location Radius" help="Maximum distance for matches." icon={MapPin}>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="range" 
                                            min="1" max="500" 
                                            value={discoveryPrefs.maxDistance} 
                                            onChange={(e) => setDiscoveryPrefs({...discoveryPrefs, maxDistance: parseInt(e.target.value)})}
                                            className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                        />
                                        <span className="text-white font-bold text-sm min-w-[60px]">{discoveryPrefs.maxDistance} km</span>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <select 
                                            value={discoveryPrefs.preferredCountry}
                                            onChange={(e) => setDiscoveryPrefs({...discoveryPrefs, preferredCountry: e.target.value})}
                                            className="w-full bg-dark-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none"
                                        >
                                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                        <select 
                                            value={discoveryPrefs.preferredLanguage}
                                            onChange={(e) => setDiscoveryPrefs({...discoveryPrefs, preferredLanguage: e.target.value})}
                                            className="w-full bg-dark-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none"
                                        >
                                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                </SettingRow>
                                
                                <SettingRow label="Exclusive Access" help="Limit visibility to subscribed users." icon={Crown}>
                                    <ToggleRow 
                                        label="Subscribed Only Mode" 
                                        desc="Only show profiles I subscribe to, or verified creators." 
                                        active={discoveryPrefs.subscriberOnly} 
                                        onClick={() => setDiscoveryPrefs({...discoveryPrefs, subscriberOnly: !discoveryPrefs.subscriberOnly})} 
                                        icon={Lock}
                                    />
                                </SettingRow>
                            </div>
                         </div>
                    )}
                    
                    {activeTab === 'alerts' && (
                        <div className="animate-in fade-in duration-500 bg-dark-800 border border-white/5 rounded-sm p-6 md:p-10">
                            <h3 className="text-xl font-black text-white mb-10 uppercase italic tracking-tighter flex items-center gap-3">
                                <Bell className="text-brand-500" /> Notifications
                            </h3>

                            <div className="mb-10 pb-10 border-b border-white/5">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Creator Updates</h4>
                                <div className="space-y-2">
                                    <ToggleRow 
                                        label="New Subscriptions" 
                                        desc="Alert when a new member joins your Pride." 
                                        active={notificationSettings.newSubscriptions} 
                                        onClick={() => handleNotificationToggle('newSubscriptions')} 
                                        icon={Crown}
                                    />
                                    <ToggleRow 
                                        label="Tips & Gifts" 
                                        desc="Notifications for direct support and coin transfers." 
                                        active={notificationSettings.tips} 
                                        onClick={() => handleNotificationToggle('tips')} 
                                        icon={Coins}
                                    />
                                    <ToggleRow 
                                        label="PPV Unlocks" 
                                        desc="Alerts when paid content is accessed." 
                                        active={notificationSettings.ppvUnlocks} 
                                        onClick={() => handleNotificationToggle('ppvUnlocks')} 
                                        icon={Lock}
                                    />
                                </div>
                            </div>

                            <div className="mb-10 pb-10 border-b border-white/5">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Community Activity</h4>
                                <div className="space-y-2">
                                    <ToggleRow 
                                        label="Direct Messages" 
                                        desc="Incoming chat requests and messages." 
                                        active={notificationSettings.messages} 
                                        onClick={() => handleNotificationToggle('messages')} 
                                        icon={MessageSquare}
                                    />
                                    <ToggleRow 
                                        label="Comments & Replies" 
                                        desc="Engagement on your posts and responses." 
                                        active={notificationSettings.comments} 
                                        onClick={() => handleNotificationToggle('comments')} 
                                        icon={MessageCircle}
                                    />
                                    <ToggleRow 
                                        label="Content Alerts" 
                                        desc="New posts from stars you follow." 
                                        active={notificationSettings.newContent} 
                                        onClick={() => handleNotificationToggle('newContent')} 
                                        icon={Zap}
                                    />
                                    <ToggleRow 
                                        label="Live Status" 
                                        desc="When followed users start broadcasting." 
                                        active={notificationSettings.liveStatus} 
                                        onClick={() => handleNotificationToggle('liveStatus')} 
                                        icon={Radio}
                                    />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">System & Billing</h4>
                                <div className="space-y-2">
                                    <ToggleRow 
                                        label="Expiring Subscriptions" 
                                        desc="Alerts before memberships end." 
                                        active={notificationSettings.expiringSubscriptions} 
                                        onClick={() => handleNotificationToggle('expiringSubscriptions')} 
                                        icon={Clock}
                                    />
                                    <ToggleRow 
                                        label="Upcoming Renewals" 
                                        desc="Notices for automatic billing cycles." 
                                        active={notificationSettings.upcomingRenewals} 
                                        onClick={() => handleNotificationToggle('upcomingRenewals')} 
                                        icon={RefreshCw}
                                    />
                                    <ToggleRow 
                                        label="Cross-Mode Alerts" 
                                        desc="Allow Naughty notifications while in Dating mode (Privacy Risk)." 
                                        active={notificationSettings.allowCrossMode} 
                                        onClick={() => handleNotificationToggle('allowCrossMode')} 
                                        icon={ShieldAlert}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'privacy' && (
                        <div className="animate-in fade-in duration-500 bg-dark-800 border border-white/5 rounded-sm p-6 md:p-10">
                            <h3 className="text-xl font-black text-white mb-10 uppercase italic tracking-tighter flex items-center gap-3">
                                <Shield className="text-brand-500" /> Privacy & Security Settings
                            </h3>

                            <div className="mb-10 pb-10 border-b border-white/5">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Privacy Settings</h4>
                                
                                <SettingRow label="Profile Visibility" help="Control who can locate your profile." icon={Eye}>
                                    <select 
                                        value={privacySettings.profileVisibility} 
                                        onChange={e => setPrivacySettings({...privacySettings, profileVisibility: e.target.value as any})}
                                        className="w-full bg-dark-900 border border-white/5 p-4 text-sm text-white focus:border-brand-500 outline-none"
                                    >
                                        <option value="public">Public</option>
                                        <option value="followers">Pride Only (Following)</option>
                                        <option value="private">Restricted Access (Private)</option>
                                    </select>
                                </SettingRow>

                                <SettingRow label="Message Requests" help="Who can initiate a direct connection with you?" icon={MessageCircle}>
                                    <select 
                                        value={privacySettings.messageFrom} 
                                        onChange={e => setPrivacySettings({...privacySettings, messageFrom: e.target.value as any})}
                                        className="w-full bg-dark-900 border border-white/5 p-4 text-sm text-white focus:border-brand-500 outline-none"
                                    >
                                        <option value="everyone">Every User</option>
                                        <option value="followers">Pride Members Only</option>
                                        <option value="verified">Verified Stars Only</option>
                                    </select>
                                </SettingRow>

                                <div className="mt-4 space-y-2">
                                    <ToggleRow 
                                        label="Global Search" 
                                        desc="Allow your profile to appear in global searches." 
                                        active={privacySettings.appearInSearch} 
                                        onClick={() => setPrivacySettings({...privacySettings, appearInSearch: !privacySettings.appearInSearch})} 
                                        icon={SearchIcon}
                                    />
                                    <ToggleRow 
                                        label="Online Status" 
                                        desc="Show active status to other members." 
                                        active={privacySettings.showOnlineStatus} 
                                        onClick={() => setPrivacySettings({...privacySettings, showOnlineStatus: !privacySettings.showOnlineStatus})} 
                                        icon={Radio}
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-10 pb-10 border-b border-white/5">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Account Security</h4>
                                
                                <ToggleRow 
                                    label="Content Protection" 
                                    desc="Block screenshots and direct extraction on all media assets." 
                                    active={privacySettings.vaultProtection} 
                                    onClick={() => setPrivacySettings({...privacySettings, vaultProtection: !privacySettings.vaultProtection})} 
                                    icon={ShieldCheck}
                                />
                                <ToggleRow 
                                    label="Watermark Overlays" 
                                    desc="Inject dynamic watermarks on all visual content for protection." 
                                    active={privacySettings.watermarkEnabled} 
                                    onClick={() => setPrivacySettings({...privacySettings, watermarkEnabled: !privacySettings.watermarkEnabled})} 
                                    icon={ShieldEllipsis}
                                />
                                <ToggleRow 
                                    label="Reveal Pronouns" 
                                    desc="Display preferred identifiers on your public profile." 
                                    active={privacySettings.showPronouns} 
                                    onClick={() => setPrivacySettings({...privacySettings, showPronouns: !privacySettings.showPronouns})} 
                                    icon={UsersIcon}
                                />
                                <ToggleRow 
                                    label="Reveal Sexuality" 
                                    desc="Display sexuality metrics on your profile details." 
                                    active={privacySettings.showSexuality} 
                                    onClick={() => setPrivacySettings({...privacySettings, showSexuality: !privacySettings.showSexuality})} 
                                    icon={Flame}
                                />
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                                    <ShieldX size={14} /> Delete Account
                                </h4>
                                
                                <SettingRow label="Deletion Schedule" help="Set wait period before account data is permanently deleted." icon={Clock}>
                                    <div className="flex items-center gap-6">
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max="24"
                                            value={privacySettings.deletionMonths} 
                                            onChange={(e) => setPrivacySettings({...privacySettings, deletionMonths: parseInt(e.target.value)})} 
                                            className="w-24 bg-dark-900 border border-white/5 p-4 text-sm text-white text-center focus:border-red-500 outline-none font-black" 
                                        />
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Month Cooling Period</span>
                                    </div>
                                </SettingRow>

                                <button className="mt-8 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] border border-red-500/30 transition-all flex items-center justify-center gap-2">
                                    <Trash2 size={16} /> Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'monetize' && canMonetize && (
                        <div className="animate-in fade-in duration-500 bg-dark-800 border border-white/5 rounded-sm p-6 md:p-10">
                            
                            {/* CUSTOM TIP ICONS SECTION */}
                            <div className="bg-dark-800 border border-white/5 rounded-sm p-10 mb-8">
                                <h3 className="text-xl font-black text-white mb-6 uppercase italic tracking-tighter flex items-center gap-3">
                                    <Gift className={modeColor} /> Custom Tip Icons
                                </h3>
                                
                                <div className="bg-dark-900/50 p-6 rounded-2xl border border-white/5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">
                                        Customize the icons users see when tipping specific amounts.
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {['50', '100', '200', '500', '1000'].map((amount) => (
                                            <div key={amount} className="flex flex-col items-center gap-3">
                                                <div 
                                                    className="w-16 h-16 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-white/5 transition-all relative overflow-hidden group"
                                                    onClick={() => document.getElementById(`tip-upload-${amount}`)?.click()}
                                                >
                                                    <input 
                                                        type="file" 
                                                        id={`tip-upload-${amount}`} 
                                                        className="hidden" 
                                                        accept="image/*"
                                                        onChange={(e) => handleTipIconUpload(amount, e)}
                                                    />
                                                    {tipIcons[amount] ? (
                                                        <img src={tipIcons[amount]} className="w-full h-full object-contain p-2" alt={amount} />
                                                    ) : (
                                                        <div className="text-gray-600 group-hover:text-white transition-colors">
                                                            {amount === '50' && <Heart size={20} />}
                                                            {amount === '100' && <Star size={20} />}
                                                            {amount === '200' && <Zap size={20} />}
                                                            {amount === '500' && <Gem size={20} />}
                                                            {amount === '1000' && <Crown size={20} />}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{amount} LSC</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[9px] text-gray-500 font-bold mt-6 uppercase tracking-widest italic">
                                        * Upload PNG or SVG for best results. Defaults will be used if no custom icon is set.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-start mb-10 border-t border-white/5 pt-10">
                                <div>
                                    <h3 className="text-xl font-black text-white mb-4 uppercase italic tracking-tighter flex items-center gap-3">
                                        <DollarSign className={modeColor} /> Subscription Plans
                                    </h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                        Configure subscription tiers for your <span className={modeColor}>{spaceMode.toUpperCase()}</span> profile.
                                    </p>
                                </div>
                                <div className={`px-4 py-2 rounded border border-white/10 text-[10px] font-black uppercase tracking-widest ${spaceMode === 'naughty' ? 'text-brand-500 bg-brand-500/10' : 'text-brand-second bg-brand-second/10'}`}>
                                    Context: {spaceMode}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {pricingPlans[spaceMode].map((plan) => (
                                    <div key={plan.id} className={`p-6 bg-dark-900/50 rounded-2xl border transition-all relative group ${modeBorder} border-opacity-30 hover:border-opacity-100`}>
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                                            
                                            {/* Plan Name */}
                                            <div className="md:col-span-5">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 mb-2 block">Plan Name</label>
                                                <input 
                                                    type="text" 
                                                    value={plan.name}
                                                    onChange={(e) => handleUpdatePlan(plan.id, 'name', e.target.value)}
                                                    className="w-full bg-dark-800 border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-bold outline-none focus:border-white/30"
                                                    placeholder="e.g. VIP Access"
                                                />
                                            </div>

                                            {/* Price */}
                                            <div className="md:col-span-3">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 mb-2 block">Price (LSC)</label>
                                                <div className="relative">
                                                    <input 
                                                        type="number" 
                                                        value={plan.price}
                                                        onChange={(e) => handleUpdatePlan(plan.id, 'price', e.target.value)}
                                                        className="w-full bg-dark-800 border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-mono font-bold outline-none focus:border-white/30"
                                                        placeholder="0.00"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-600 uppercase">LSC</span>
                                                </div>
                                            </div>

                                            {/* Duration */}
                                            <div className="md:col-span-3">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 mb-2 block">Duration</label>
                                                <select 
                                                    value={plan.duration}
                                                    onChange={(e) => handleUpdatePlan(plan.id, 'duration', e.target.value as any)}
                                                    className="w-full bg-dark-800 border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-bold outline-none focus:border-white/30 appearance-none"
                                                >
                                                    <option value="day">24 Hours</option>
                                                    <option value="month">30 Days</option>
                                                    <option value="year">365 Days</option>
                                                </select>
                                            </div>

                                            {/* Remove Button */}
                                            <div className="md:col-span-1 flex justify-end">
                                                <button 
                                                    onClick={() => handleRemovePlan(plan.id)}
                                                    className="p-4 bg-dark-800 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-xl transition-all border border-white/10 hover:border-red-500/30"
                                                    title="Remove Plan"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add New Package Button */}
                                <button 
                                    onClick={handleAddPlan}
                                    className={`w-full py-6 rounded-2xl border-2 border-dashed flex items-center justify-center gap-3 transition-all group ${spaceMode === 'naughty' ? 'border-brand-500/30 hover:border-brand-500 hover:bg-brand-500/5 text-brand-500' : 'border-brand-second/30 hover:border-brand-second hover:bg-brand-second/5 text-brand-second'}`}
                                >
                                    <Plus size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest">Add New Package</span>
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'verify' && (
                        <div className="animate-in fade-in duration-500 bg-dark-800 border border-white/5 rounded-sm p-6 md:p-10">
                             <h3 className="text-xl font-black text-white mb-10 uppercase italic tracking-tighter flex items-center gap-3">
                                <ShieldCheck className="text-brand-500" /> Verification
                            </h3>
                             <div className="space-y-12">
                                {currentUser.isVerified && verificationStep === 1 && (
                                    <div className="mb-10 text-center py-10 bg-brand-500/5 rounded-3xl border border-brand-500/20 animate-in zoom-in duration-500">
                                        <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle size={32} className="text-brand-500" />
                                        </div>
                                        <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">Account Verified</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">Your account is fully verified with the global Pride.</p>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-4 px-2 mb-10">
                                    <div className={`flex items-center gap-3 ${verificationStep === 1 ? 'text-white' : 'text-gray-500'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black border ${verificationStep >= 1 ? 'bg-brand-500 border-brand-500 text-white' : 'bg-dark-900 border-white/10'}`}>1</div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Generate Code</span>
                                    </div>
                                    <div className="h-px bg-white/10 flex-1"></div>
                                    <div className={`flex items-center gap-3 ${verificationStep === 2 ? 'text-white' : 'text-gray-500'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black border ${verificationStep >= 2 ? 'bg-brand-500 border-brand-500 text-white' : 'bg-dark-900 border-white/10'}`}>2</div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Submit Proof</span>
                                    </div>
                                </div>
                                
                                {verificationStep === 1 && (
                                    <div className="p-10 rounded-2xl border-2 border-dashed border-white/5 bg-dark-900/50 flex flex-col items-center text-center animate-in slide-in-from-right duration-500">
                                        
                                        {!generatedCode ? (
                                            <div className="space-y-6 max-w-md mx-auto">
                                                <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-2xl">
                                                    <Lock size={32} className="text-gray-400" />
                                                </div>
                                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Initialize Verification</h4>
                                                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                                    To ensure community safety, you must verify your identity. This process generates a unique, time-sensitive code for you to use in a selfie.
                                                </p>
                                                <button 
                                                    onClick={handleGenerateCode}
                                                    className="bg-white text-black font-black px-12 py-5 rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-brand-500 hover:text-white transition-all active:scale-95 flex items-center gap-3 mx-auto shadow-xl"
                                                >
                                                    <Zap size={16} /> Generate Security Code
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full max-w-lg mx-auto space-y-10 animate-in fade-in">
                                                <div className="relative bg-gradient-to-br from-dark-800 to-black p-8 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-20 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                                    <div className="relative z-10 flex flex-col items-center">
                                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Security Token</span>
                                                        <code className="text-5xl font-mono font-black text-white tracking-widest uppercase text-shadow-lg">{generatedCode}</code>
                                                        <div className="mt-6 flex items-center gap-3 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                                                            <Timer size={14} className="text-red-500 animate-pulse" />
                                                            <span className="font-mono font-bold text-red-500 tabular-nums text-xs">
                                                                Expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start gap-4 text-left p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                                                    <Info size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                                                    <div className="space-y-1">
                                                        <h5 className="text-xs font-black text-yellow-500 uppercase tracking-widest">Instruction</h5>
                                                        <p className="text-yellow-200/80 text-xs font-medium leading-relaxed">
                                                            Write the code above clearly on a piece of paper. You will need to hold it visible in your photo for the next step.
                                                        </p>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => setVerificationStep(2)}
                                                    className="bg-brand-500 text-white font-black px-12 py-5 rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-brand-600 transition-all flex items-center gap-3 mx-auto shadow-xl hover:scale-105"
                                                >
                                                    I Have The Code <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {verificationStep === 2 && (
                                     <div className="p-10 rounded-2xl border-2 border-dashed border-white/5 bg-dark-900/50 flex flex-col items-center text-center animate-in slide-in-from-right duration-500">
                                          <div 
                                                className={`aspect-[3/4] w-64 bg-dark-800 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center relative overflow-hidden transition-all group ${proofFile ? 'border-emerald-500/50 bg-emerald-900/5' : 'border-white/10 hover:border-brand-500/50 hover:bg-dark-900 cursor-pointer'}`}
                                                onClick={() => !proofFile && document.getElementById('verification-file')?.click()}
                                            >
                                                <input id="verification-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                {proofPreview ? (
                                                    <>
                                                        <img src={proofPreview} className="w-full h-full object-cover" alt="Verification proof" />
                                                        {isVerifying && (
                                                            <div className="absolute inset-0 bg-brand-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-in fade-in">
                                                                <BrainCircuit size={48} className="text-brand-500 animate-pulse mb-4" />
                                                                <p className="text-xs font-black text-white uppercase tracking-[0.2em] animate-pulse">Analyzing Biometrics...</p>
                                                            </div>
                                                        )}
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setProofFile(null); setProofPreview(null); }}
                                                            className="absolute top-4 right-4 p-3 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors z-20"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                            <UploadCloud size={32} className="text-gray-400 group-hover:text-brand-500" />
                                                        </div>
                                                        <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Tap to Upload Selfie</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="mt-8 flex gap-4">
                                                 <button onClick={() => setVerificationStep(1)} className="text-gray-400 text-xs font-bold uppercase hover:text-white">Back</button>
                                                 <button onClick={handleStartVerification} disabled={!proofFile || isVerifying} className="bg-brand-500 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest disabled:opacity-50">Submit Proof</button>
                                            </div>
                                     </div>
                                )}
                             </div>
                        </div>
                    )}

                    {activeTab === 'theme' && (
                        <div className="animate-in fade-in duration-500 bg-dark-800 border border-white/5 rounded-sm p-6 md:p-10">
                            <h3 className="text-xl font-black text-white mb-10 uppercase italic tracking-tighter flex items-center gap-3">
                                <Moon className="text-brand-500" /> Theme Settings
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => { if(theme==='light') toggleTheme(); }} className={`p-10 border-2 rounded-sm flex flex-col items-center gap-6 transition-all ${theme === 'dark' ? 'border-brand-500 bg-brand-500/5' : 'border-white/5 bg-dark-900'}`}>
                                    <Moon size={48} className={theme === 'dark' ? 'text-brand-500' : 'text-gray-700'} />
                                    <span className="font-black uppercase italic text-white tracking-widest text-sm">Dark Theme</span>
                                </button>
                                <button onClick={() => { if(theme==='dark') toggleTheme(); }} className={`p-10 border-2 rounded-sm flex flex-col items-center gap-6 transition-all ${theme === 'light' ? 'border-brand-500 bg-brand-500/5' : 'border-white/5 bg-dark-900'}`}>
                                    <Sun size={48} className={theme === 'light' ? 'text-brand-500' : 'text-gray-700'} />
                                    <span className="font-black uppercase italic text-white tracking-widest text-sm">Light Theme</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
