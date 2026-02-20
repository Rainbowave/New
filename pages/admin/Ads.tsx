
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    Layout, Video, Maximize, List, Play, Hash, CheckCircle, 
    Smartphone, Image as ImageIcon, BookOpen, ShoppingBag, 
    Save, Loader2, Globe, Shield, Flame, Target,
    Megaphone, TrendingUp, Search, Home, Move, Code, FileText, Radio, Layers, Compass,
    Check, X, PauseCircle, MousePointer2
} from 'lucide-react';
import { db } from '../../services/db';

const Toggle = ({ checked, onChange, label, desc, disabled }: any) => (
    <div className={`flex items-center justify-between py-4 border-b border-dark-700 last:border-0 ${disabled ? 'opacity-60' : ''}`}>
        <div className="pr-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-tight">{label}</h4>
            {desc && <p className="text-xs text-gray-500 mt-1 font-medium">{desc}</p>}
        </div>
        <button 
            onClick={() => !disabled && onChange(!checked)} 
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0 ${checked ? 'bg-brand-600' : 'bg-dark-600'}`}
            disabled={disabled}
        >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${checked ? 'left-7' : 'left-1'}`}></div>
        </button>
    </div>
);

const AdSectionCard = ({ title, icon: Icon, config, onChange }: any) => {
    // Safety check for config
    const safeConfig = config || { enabled: false };

    return (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-brand-500/30 transition-all">
             {/* Header */}
             <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-3">
                     <div className="p-2 bg-dark-900 border border-white/5 rounded-lg text-brand-500">
                         <Icon size={20} />
                     </div>
                     <h3 className="font-bold text-white text-base uppercase tracking-tight">{title}</h3>
                 </div>
                 <button 
                    onClick={() => onChange('enabled', !safeConfig.enabled)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${safeConfig.enabled ? 'bg-brand-600' : 'bg-dark-700'}`}
                >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${safeConfig.enabled ? 'left-6' : 'left-1'}`}></div>
                </button>
             </div>

             <div className={`space-y-5 transition-opacity ${safeConfig.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                 {/* Content Source */}
                 <div>
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Target size={12} /> Content Source
                     </label>
                     <select 
                        value={safeConfig.contentSource || 'mixed'}
                        onChange={(e) => onChange('contentSource', e.target.value)}
                        className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-brand-500"
                     >
                         <option value="mixed">Mixed (System Ads & User Content)</option>
                         <option value="system_only">System Ads Only</option>
                         <option value="user_only">User Content Only</option>
                     </select>
                     <p className="text-[9px] text-gray-600 mt-1">Determines what creates the injections.</p>
                 </div>

                 {/* Component Size */}
                 <div>
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Layout size={12} /> Component Size
                     </label>
                     <select 
                        value={safeConfig.componentSize || 'auto'}
                        onChange={(e) => onChange('componentSize', e.target.value)}
                        className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-brand-500"
                     >
                         <option value="auto">Auto / Responsive</option>
                         <option value="fixed_small">Fixed Small (300x250)</option>
                         <option value="fixed_large">Fixed Large (336x280)</option>
                     </select>
                 </div>

                 {/* Ad Code */}
                 <div>
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Code size={12} /> Ad Code / Script
                     </label>
                     <textarea 
                        value={safeConfig.adCode || ''}
                        onChange={(e) => onChange('adCode', e.target.value)}
                        placeholder="<!-- Paste ad network code here -->"
                        className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-xs text-white font-mono h-24 outline-none focus:border-brand-500 resize-none"
                     />
                 </div>

                 {/* Start Position */}
                 <div>
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Move size={12} /> Start Position (First Ad)
                     </label>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <span className="text-[9px] text-gray-600 block mb-1">Min Index (2-8)</span>
                             <input 
                                type="number" 
                                value={safeConfig.startPos?.min || 2}
                                onChange={(e) => onChange('startPos', { ...safeConfig.startPos, min: parseInt(e.target.value) })}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white font-bold text-xs"
                             />
                         </div>
                         <div>
                             <span className="text-[9px] text-gray-600 block mb-1">Max Index (2-8)</span>
                             <input 
                                type="number" 
                                value={safeConfig.startPos?.max || 5}
                                onChange={(e) => onChange('startPos', { ...safeConfig.startPos, max: parseInt(e.target.value) })}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white font-bold text-xs"
                             />
                         </div>
                     </div>
                     <p className="text-[9px] text-gray-600 mt-1">First ad injects randomly between these items.</p>
                 </div>

                 {/* Spacing */}
                 <div>
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Hash size={12} /> Spacing Between Ads
                     </label>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <span className="text-[9px] text-gray-600 block mb-1">Min Items (4-8)</span>
                             <input 
                                type="number" 
                                value={safeConfig.spacing?.min || 5}
                                onChange={(e) => onChange('spacing', { ...safeConfig.spacing, min: parseInt(e.target.value) })}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white font-bold text-xs"
                             />
                         </div>
                         <div>
                             <span className="text-[9px] text-gray-600 block mb-1">Max Items (4-8)</span>
                             <input 
                                type="number" 
                                value={safeConfig.spacing?.max || 10}
                                onChange={(e) => onChange('spacing', { ...safeConfig.spacing, max: parseInt(e.target.value) })}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white font-bold text-xs"
                             />
                         </div>
                     </div>
                     <p className="text-[9px] text-gray-600 mt-1">Content count between subsequent ads.</p>
                 </div>
             </div>
        </div>
    );
};

export default function AdminAds() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'placements';
    
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [specialAdsMode, setSpecialAdsMode] = useState<'dating' | 'naughty'>('dating');
    
    // Real Promotions Data
    const [campaigns, setCampaigns] = useState<any[]>([]);

    useEffect(() => {
        const mode = (localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating';
        setSpecialAdsMode(mode);
        
        const handleModeChange = () => {
             const newMode = (localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating';
             setSpecialAdsMode(newMode);
        };
        window.addEventListener('admin-mode-change', handleModeChange);

        const load = async () => {
            await new Promise(r => setTimeout(r, 600));
            const data = db.getSiteSettings();
            setSettings(data);
            
            // Load Campaigns
            const promos = db.getPromotions();
            setCampaigns(promos);
            
            setLoading(false);
        };
        load();
        
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, []);

    const updateSpecialConfig = (section: string, key: string, value: any) => {
        if (!settings?.contentAds?.[specialAdsMode]) return;
        
        const newSettings = {
            ...settings,
            contentAds: {
                ...settings.contentAds,
                [specialAdsMode]: {
                    ...settings.contentAds[specialAdsMode],
                    [section]: {
                        ...(settings.contentAds[specialAdsMode][section] || {}),
                        [key]: value
                    }
                }
            }
        };
        setSettings(newSettings);
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        db.saveSiteSettings(settings);
        setSaving(false);
        alert('Ads configuration updated.');
    };

    const handleTabClick = (tab: string) => {
        setSearchParams({ tab });
    };

    const handleCampaignAction = (id: string, action: 'active' | 'paused' | 'rejected') => {
        db.updatePromotionStatus(id, action);
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: action } : c));
    };

    if (loading || !settings) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;

    const accentColor = specialAdsMode === 'dating' ? 'text-brand-second' : 'text-brand-500';
    
    // Safe access helpers
    const currentModeSettings = settings?.contentAds?.[specialAdsMode] || {};
    const bannersConfig = currentModeSettings.banners || {};
    const feedConfig = currentModeSettings.feedInjection || {};
    const highImpactConfig = currentModeSettings.highImpact || {};
    const videoConfig = currentModeSettings.videoMedia || {};
    const postDetailConfig = currentModeSettings.postDetail || {};

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2 flex items-center gap-3">
                        <Globe className="text-brand-500" size={32} />
                        Ad Network Config
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Manage placements for <span className={`${accentColor}`}>{specialAdsMode.toUpperCase()}</span> context.
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-brand-600 hover:bg-brand-500 text-white font-black py-2 px-8 rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Config
                    </button>
                </div>
            </div>

             {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 bg-dark-800 p-1 rounded-xl border border-dark-700 w-fit overflow-x-auto">
                {[
                    { id: 'placements', label: 'Placements', icon: Layout },
                    { id: 'content_config', label: 'Content Config', icon: Video },
                    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-dark-700'}`}
                    >
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* --- PLACEMENTS TAB --- */}
            {activeTab === 'placements' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                    
                    {/* Primary Feeds Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AdSectionCard 
                            title="Main Home Feed" 
                            icon={Home} 
                            config={currentModeSettings.homeFeed || {}} 
                            onChange={(key: string, val: any) => updateSpecialConfig('homeFeed', key, val)} 
                        />
                        <AdSectionCard 
                            title="Shorts Feed" 
                            icon={Smartphone} 
                            config={currentModeSettings.shortsFeed || {}} 
                            onChange={(key: string, val: any) => updateSpecialConfig('shortsFeed', key, val)} 
                        />
                        <AdSectionCard 
                            title="Search Results" 
                            icon={Search} 
                            config={currentModeSettings.searchResults || {}} 
                            onChange={(key: string, val: any) => updateSpecialConfig('searchResults', key, val)} 
                        />
                         <AdSectionCard 
                            title="Video Feed" 
                            icon={Video} 
                            config={currentModeSettings.videosFeed || {}} 
                            onChange={(key: string, val: any) => updateSpecialConfig('videosFeed', key, val)} 
                        />
                         <AdSectionCard 
                            title="Photo Gallery" 
                            icon={ImageIcon} 
                            config={currentModeSettings.photosFeed || {}} 
                            onChange={(key: string, val: any) => updateSpecialConfig('photosFeed', key, val)} 
                        />
                         <AdSectionCard 
                            title="Comic Reader" 
                            icon={BookOpen} 
                            config={currentModeSettings.comicsFeed || {}} 
                            onChange={(key: string, val: any) => updateSpecialConfig('comicsFeed', key, val)} 
                        />
                         <AdSectionCard 
                            title="Collection Hub" 
                            icon={ShoppingBag} 
                            config={currentModeSettings.collectionFeed || {}} 
                            onChange={(key: string, val: any) => updateSpecialConfig('collectionFeed', key, val)} 
                        />
                         <AdSectionCard 
                            title="Knowledge Book" 
                            icon={FileText} 
                            config={currentModeSettings.resourceFeed || {}} 
                            onChange={(key: string, val: any) => updateSpecialConfig('resourceFeed', key, val)} 
                        />
                         <AdSectionCard 
                            title="Live Channels" 
                            icon={Radio} 
                            config={currentModeSettings.liveFeed || {}} 
                            onChange={(key: string, val: any) => updateSpecialConfig('liveFeed', key, val)} 
                        />
                         <AdSectionCard 
                            title="Explore More" 
                            icon={Compass} 
                            config={currentModeSettings.exploreMore || {}} 
                            onChange={(key: string, val: any) => updateSpecialConfig('exploreMore', key, val)} 
                        />
                    </div>
                </div>
            )}

            {/* --- CONTENT CONFIG TAB --- */}
            {activeTab === 'content_config' && (
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
                    {/* LEFT: DISPLAY & BANNERS + FEED INJECTION */}
                    <div>
                        <h4 className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${accentColor}`}>
                            <Layout size={16} /> Display & Banners
                        </h4>
                        <div className="bg-dark-900 border border-dark-600 p-8 rounded-2xl relative overflow-hidden mb-6">
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="font-bold text-white flex items-center gap-2">Global Banners</h4>
                                <Toggle 
                                    checked={bannersConfig.enabled} 
                                    onChange={(v: boolean) => updateSpecialConfig('banners', 'enabled', v)}
                                />
                            </div>
                            
                            <div className={`space-y-6 ${!bannersConfig.enabled ? 'opacity-40 pointer-events-none' : ''}`}>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Placement Locations</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['HOME FEED', 'POST', 'VIDEO', 'PHOTO', 'COLLECTION', 'COMIC', 'LIVE'].map(loc => {
                                            const locKey = loc.toLowerCase().replace(' ', '');
                                            const isChecked = bannersConfig.locations?.includes(locKey) || bannersConfig.locations?.includes(loc.toLowerCase()); 
                                            
                                            return (
                                                <button 
                                                    key={loc}
                                                    onClick={() => {
                                                        const current = bannersConfig.locations || [];
                                                        const key = loc.toLowerCase();
                                                        const newLocs = current.includes(key) ? current.filter((l: string) => l !== key) : [...current, key];
                                                        updateSpecialConfig('banners', 'locations', newLocs);
                                                    }}
                                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${isChecked ? `bg-brand-500 text-white border-brand-500` : 'bg-dark-800 text-gray-500 border-dark-700 hover:border-gray-400 hover:text-white'}`}
                                                >
                                                    {loc}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Refresh Rate (Sec)</label>
                                        <input 
                                            type="number" 
                                            value={bannersConfig.refreshRate || 60} 
                                            onChange={(e) => updateSpecialConfig('banners', 'refreshRate', parseInt(e.target.value))} 
                                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Content Overlay</label>
                                        <div className="flex items-center gap-3 h-full">
                                            <Toggle 
                                                checked={bannersConfig.contentOverlay} 
                                                onChange={(v: boolean) => updateSpecialConfig('banners', 'contentOverlay', v)}
                                                label="" // Inline toggle
                                            />
                                            <span className="text-xs font-bold text-gray-400">Show small ad over playing content</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <h4 className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 mt-8 ${accentColor}`}>
                             <Layers size={16} /> Feed Injection Settings
                        </h4>
                        <div className="bg-dark-900 border border-dark-600 p-8 rounded-2xl relative overflow-hidden">
                             <div className="flex justify-between items-center mb-8">
                                <h4 className="font-bold text-white flex items-center gap-2">Native In-Feed</h4>
                                <Toggle 
                                    checked={feedConfig.enabled} 
                                    onChange={(v: boolean) => updateSpecialConfig('feedInjection', 'enabled', v)}
                                />
                            </div>
                             <div className={`space-y-6 ${!feedConfig.enabled ? 'opacity-40 pointer-events-none' : ''}`}>
                                 <div>
                                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Injection Type</label>
                                     <select 
                                         value={feedConfig.type}
                                         onChange={(e) => updateSpecialConfig('feedInjection', 'type', e.target.value)}
                                         className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none focus:border-brand-500"
                                     >
                                         <option value="native">Native Card Style</option>
                                         <option value="banner">Banner Style</option>
                                         <option value="text">Text Link Only</option>
                                     </select>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Timeline Frequency</label>
                                        <input 
                                            type="number" 
                                            value={feedConfig.frequencyVal || 5} 
                                            onChange={(e) => updateSpecialConfig('feedInjection', 'frequencyVal', parseInt(e.target.value))} 
                                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500" 
                                            placeholder="Every X posts"
                                        />
                                        <p className="text-[9px] text-gray-600 mt-1">Insert ad every X items.</p>
                                     </div>
                                     <div>
                                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Label Text</label>
                                         <input 
                                             type="text"
                                             value={feedConfig.label}
                                             onChange={(e) => updateSpecialConfig('feedInjection', 'label', e.target.value)}
                                             className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500" 
                                         />
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* RIGHT: HIGH IMPACT & VIDEO MEDIA & POST DETAIL */}
                    <div>
                        <h4 className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${accentColor}`}>
                            <Maximize size={16} /> High Impact
                        </h4>
                        
                        {/* Popups */}
                        <div className="bg-dark-900 border border-dark-600 p-8 rounded-2xl relative overflow-hidden mb-6">
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="font-bold text-white flex items-center gap-2">Pop-outs / Interstitials</h4>
                                <Toggle 
                                    checked={highImpactConfig.enabled} 
                                    onChange={(v: boolean) => updateSpecialConfig('highImpact', 'enabled', v)}
                                />
                            </div>
                            <div className={`space-y-6 ${!highImpactConfig.enabled ? 'opacity-40 pointer-events-none' : ''}`}>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Trigger Event</label>
                                    <select 
                                        value={highImpactConfig.trigger || 'entry'}
                                        onChange={(e) => updateSpecialConfig('highImpact', 'trigger', e.target.value)}
                                        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none focus:border-brand-500"
                                    >
                                        <option value="entry">Session Start (Entry)</option>
                                        <option value="click">First Click</option>
                                        <option value="exit">Exit Intent</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                     <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Frequency (Per Session)</label>
                                        <input 
                                            type="number" 
                                            value={highImpactConfig.frequency || 1} 
                                            onChange={(e) => updateSpecialConfig('highImpact', 'frequency', parseInt(e.target.value))} 
                                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Timeout (Min)</label>
                                        <input 
                                            type="number" 
                                            value={highImpactConfig.timeout || 30} 
                                            onChange={(e) => updateSpecialConfig('highImpact', 'timeout', parseInt(e.target.value))} 
                                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <h4 className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 mt-8 ${accentColor}`}>
                            <Video size={16} /> Video & Media
                        </h4>

                        {/* Video Media (Pre-Roll) */}
                        <div className="bg-dark-900 border border-dark-600 p-8 rounded-2xl relative overflow-hidden mb-6">
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="font-bold text-white flex items-center gap-2">Video Pre-Roll</h4>
                                <Toggle 
                                    checked={videoConfig.enabled} 
                                    onChange={(v: boolean) => updateSpecialConfig('videoMedia', 'enabled', v)}
                                />
                            </div>
                            <div className={`grid grid-cols-2 gap-6 ${!videoConfig.enabled ? 'opacity-40 pointer-events-none' : ''}`}>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Ad Duration (Sec)</label>
                                    <input 
                                        type="number" 
                                        value={videoConfig.duration} 
                                        onChange={(e) => updateSpecialConfig('videoMedia', 'duration', parseInt(e.target.value))} 
                                        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Skip After (Sec)</label>
                                    <input 
                                        type="number" 
                                        value={videoConfig.skipAfter} 
                                        onChange={(e) => updateSpecialConfig('videoMedia', 'skipAfter', parseInt(e.target.value))} 
                                        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500" 
                                    />
                                </div>
                                <div className="col-span-2">
                                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Pre-Roll Frequency</label>
                                     <input 
                                        type="number" 
                                        value={videoConfig.injectionFrequency || 3} 
                                        onChange={(e) => updateSpecialConfig('videoMedia', 'injectionFrequency', parseInt(e.target.value))} 
                                        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500" 
                                        placeholder="Every X videos"
                                     />
                                </div>
                                <div className="col-span-2">
                                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Target Players</label>
                                     <div className="flex gap-3">
                                         {['Live', 'Video', 'Shorts'].map(target => {
                                             const isActive = videoConfig.targets?.includes(target.toLowerCase());
                                             return (
                                                 <button 
                                                    key={target}
                                                    onClick={() => {
                                                        const current = videoConfig.targets || [];
                                                        const key = target.toLowerCase();
                                                        const newTargets = current.includes(key) ? current.filter((t: string) => t !== key) : [...current, key];
                                                        updateSpecialConfig('videoMedia', 'targets', newTargets);
                                                    }}
                                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${isActive ? `bg-brand-500 text-white border-brand-500` : 'bg-dark-800 text-gray-500 border-dark-700 hover:border-gray-400 hover:text-white'}`}
                                                 >
                                                     {target}
                                                 </button>
                                             )
                                         })}
                                     </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-dark-700">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold text-white flex items-center gap-2">Shorts Feed Ads</h4>
                                    <Toggle 
                                        checked={videoConfig.shortsAds} 
                                        onChange={(v: boolean) => updateSpecialConfig('videoMedia', 'shortsAds', v)}
                                    />
                                </div>
                                <div className={`grid grid-cols-2 gap-6 ${!videoConfig.shortsAds ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Ad Style</label>
                                        <select 
                                            value={videoConfig.shortsAdType || 'overlay'}
                                            onChange={(e) => updateSpecialConfig('videoMedia', 'shortsAdType', e.target.value)}
                                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none focus:border-brand-500"
                                        >
                                            <option value="overlay">Overlay (Bottom)</option>
                                            <option value="interstitial">Interstitial (Full Screen)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">On-Play Overlay</label>
                                        <div className="flex items-center gap-3 h-full">
                                            <Toggle 
                                                checked={videoConfig.overlayEnabled} 
                                                onChange={(v: boolean) => updateSpecialConfig('videoMedia', 'overlayEnabled', v)}
                                                label="" 
                                            />
                                            <span className="text-xs font-bold text-gray-400">Show small ad on play</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEW: Post Detail Page Config */}
                        <h4 className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 mt-8 ${accentColor}`}>
                            <MousePointer2 size={16} /> Post Detail Page
                        </h4>
                        <div className="bg-dark-900 border border-dark-600 p-8 rounded-2xl relative overflow-hidden">
                             <div className="flex justify-between items-center mb-8">
                                <h4 className="font-bold text-white flex items-center gap-2">Detail Page Ads</h4>
                                <Toggle 
                                    checked={postDetailConfig.enabled} 
                                    onChange={(v: boolean) => updateSpecialConfig('postDetail', 'enabled', v)}
                                />
                            </div>
                             <div className={`space-y-6 ${!postDetailConfig.enabled ? 'opacity-40 pointer-events-none' : ''}`}>
                                 <div>
                                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Target Audience</label>
                                     <select 
                                         value={postDetailConfig.target || 'all'}
                                         onChange={(e) => updateSpecialConfig('postDetail', 'target', e.target.value)}
                                         className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none focus:border-brand-500"
                                     >
                                         <option value="all">All Visitors</option>
                                         <option value="non-subscriber">Non-Subscribers Only</option>
                                         <option value="guest">Guests Only</option>
                                     </select>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">View Frequency</label>
                                        <input 
                                            type="number" 
                                            value={postDetailConfig.frequency || 1} 
                                            onChange={(e) => updateSpecialConfig('postDetail', 'frequency', parseInt(e.target.value))} 
                                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-brand-500" 
                                            placeholder="Every X views"
                                        />
                                     </div>
                                     <div>
                                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Ad Format</label>
                                         <select 
                                            value={postDetailConfig.type || 'banner'}
                                            onChange={(e) => updateSpecialConfig('postDetail', 'type', e.target.value)}
                                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none focus:border-brand-500"
                                         >
                                             <option value="banner">Static Banner</option>
                                             <option value="popup">Pop-up Modal</option>
                                             <option value="native">Native Content Block</option>
                                         </select>
                                     </div>
                                 </div>
                             </div>
                        </div>

                    </div>
                </div>
            )}

            {/* --- CAMPAIGNS TAB --- */}
            {activeTab === 'campaigns' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden shadow-lg">
                        <table className="w-full text-left">
                             <thead className="bg-dark-900 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-dark-700">
                                 <tr>
                                     <th className="px-6 py-4">User</th>
                                     <th className="px-6 py-4">Type</th>
                                     <th className="px-6 py-4">Budget</th>
                                     <th className="px-6 py-4">Reach</th>
                                     <th className="px-6 py-4">Status</th>
                                     <th className="px-6 py-4 text-right">Actions</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-white/5 text-sm">
                                 {campaigns.map(c => (
                                     <tr key={c.id} className="hover:bg-white/5 transition-colors">
                                         <td className="px-6 py-4 font-bold text-white">
                                             <div className="flex flex-col">
                                                 <span>@{c.user}</span>
                                                 <span className="text-[9px] text-gray-500 font-normal">{c.id}</span>
                                             </div>
                                         </td>
                                         <td className="px-6 py-4 text-gray-400">
                                             <span className="flex items-center gap-2">
                                                 {c.targetType === 'hashtag' && <Hash size={12}/>}
                                                 {c.targetType === 'post' && <ImageIcon size={12}/>}
                                                 {c.targetType === 'profile' && <Target size={12}/>}
                                                 {c.targetType}
                                             </span>
                                         </td>
                                         <td className="px-6 py-4 text-white font-mono">${c.budget}</td>
                                         <td className="px-6 py-4 text-white font-mono flex items-center gap-1"><TrendingUp size={12} className="text-green-500"/> {c.reach || 0}</td>
                                         <td className="px-6 py-4">
                                             <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                                                 c.status === 'active' ? 'bg-green-500/20 text-green-500' : 
                                                 c.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                                                 c.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                                                 'bg-gray-700 text-gray-400'
                                             }`}>
                                                 {c.status}
                                             </span>
                                         </td>
                                         <td className="px-6 py-4 text-right">
                                             <div className="flex justify-end gap-2">
                                                 {c.status === 'pending' && (
                                                     <>
                                                         <button onClick={() => handleCampaignAction(c.id, 'active')} className="p-1.5 bg-green-900/20 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors"><Check size={14}/></button>
                                                         <button onClick={() => handleCampaignAction(c.id, 'rejected')} className="p-1.5 bg-red-900/20 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"><X size={14}/></button>
                                                     </>
                                                 )}
                                                 {c.status === 'active' && (
                                                     <button onClick={() => handleCampaignAction(c.id, 'paused')} className="p-1.5 bg-yellow-900/20 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition-colors"><PauseCircle size={14}/></button>
                                                 )}
                                                 {c.status === 'paused' && (
                                                      <button onClick={() => handleCampaignAction(c.id, 'active')} className="p-1.5 bg-green-900/20 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors"><Play size={14}/></button>
                                                 )}
                                             </div>
                                         </td>
                                     </tr>
                                 ))}
                                 {campaigns.length === 0 && (
                                     <tr>
                                         <td colSpan={6} className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">No active campaigns found.</td>
                                     </tr>
                                 )}
                             </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
