

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Save, Globe, Lock, Video, ShoppingBag, 
    FileText, Loader2, CheckCircle, 
    Smartphone, Zap, Image as ImageIcon, 
    BookOpen, Search, Palette, Sparkles, Gift,
    Settings, Layout, Link as LinkIcon, Download,
    ToggleRight, ToggleLeft, PenTool, Plus, X, Shuffle, LayoutTemplate, Hash,
    AlertCircle, Clock, MessageCircle, Shield, Smile, Heart, Crown, Gamepad2,
    DollarSign, Trophy, Flame, Layers, Monitor,
    ShieldCheck, Tag, Megaphone, Calendar, Share2, Crop, Languages,
    AlignLeft, Grid, Eye, Home, Users, Flag, Trash2, Edit2, Star, BarChart2, Ticket, ExternalLink,
    AlertTriangle, Mail, Send, Twitter, Instagram, Youtube, Facebook,
    Bot, Type, Sliders, Box, MessageSquare, Move,
    BarChart, UserCheck, Ticket as TicketIcon, Coins
} from 'lucide-react';
import { db } from '../../services/db';
import { seoService } from '../../services/seoService';

const Toggle = ({ checked, onChange, label, desc, disabled, activeColor = 'bg-brand-600' }: any) => (
    <div className={`flex items-center justify-between py-4 border-b border-dark-700 last:border-0 ${disabled ? 'opacity-60' : ''}`}>
        <div className="pr-4">
            <h4 className="font-bold text-white text-sm tracking-tight">{label}</h4>
            {desc && <p className="text-xs text-gray-500 mt-1 font-medium">{desc}</p>}
        </div>
        <button 
            onClick={() => !disabled && onChange(!checked)} 
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0 ${checked ? activeColor : 'bg-dark-600'}`}
            disabled={disabled}
        >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${checked ? 'left-7' : 'left-1'}`}></div>
        </button>
    </div>
);

const SettingSection = ({ title, subtitle, icon: Icon, children, color = "text-brand-400", bgColor = "bg-brand-900/20", borderColor = "border-brand-500/20", headerAction }: any) => (
    <div className="bg-dark-800 border border-dark-700 rounded-[5px] p-8 mb-6 shadow-xl animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-dark-700 pb-6 gap-4">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-[5px] shadow-lg border ${bgColor} ${color} ${borderColor}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-xl text-white tracking-tight">{title}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{subtitle || 'Configuration Protocol'}</p>
                </div>
            </div>
            {headerAction && <div className="w-full md:w-auto">{headerAction}</div>}
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const TextInput = ({ label, value, onChange, help, icon: InputIcon, placeholder }: any) => (
    <div>
        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">
            {InputIcon && <InputIcon size={14} className="text-brand-500" />} {label}
        </label>
        <div className="relative group">
            <input 
                type="text" 
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-dark-900 border border-dark-600 rounded-[5px] px-5 py-3.5 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all group-hover:border-brand-500/50 font-bold placeholder:text-gray-700"
            />
        </div>
        {help && <p className="text-[9px] text-gray-500 mt-2 ml-1 font-bold uppercase tracking-wider italic">{help}</p>}
    </div>
);

const TextAreaInput = ({ label, value, onChange, help, icon: InputIcon, placeholder, monospace }: any) => (
    <div>
        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">
            {InputIcon && <InputIcon size={14} className="text-brand-500" />} {label}
        </label>
        <div className="relative group">
            <textarea 
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className={`w-full bg-dark-900 border border-dark-600 rounded-[5px] px-5 py-3.5 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all group-hover:border-brand-500/50 font-bold resize-none placeholder:text-gray-700 ${monospace ? 'font-mono text-xs' : ''}`}
            />
        </div>
        {help && <p className="text-[9px] text-gray-500 mt-2 ml-1 font-bold uppercase tracking-wider italic">{help}</p>}
    </div>
);

const AgendaList = ({ items, onAdd, onRemove, placeholder, title, icon: Icon, colorClass, addButtonColor }: any) => {
    const [newItem, setNewItem] = useState('');
    const [newImage, setNewImage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddItem = () => {
        if (!newItem) return;
        const itemObj = { label: newItem, image: newImage };
        onAdd(itemObj);
        setNewItem('');
        setNewImage('');
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setNewImage(url);
        }
    };

    return (
        <div className="bg-dark-900 border border-dark-700 rounded-[5px] p-4 relative group">
            <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-[5px] bg-opacity-10 border border-white/5 ${colorClass.replace('text-', 'bg-')}`}>
                         <Icon size={16} className={colorClass} />
                     </div>
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">{title}</span>
                 </div>
                 <button 
                    onClick={handleAddItem}
                    className={`px-4 py-1.5 rounded-[5px] text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1 transition-all hover:scale-105 active:scale-95 ${addButtonColor}`}
                 >
                     <Plus size={10} strokeWidth={4} /> Add New
                 </button>
            </div>

            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                {items.map((item: any, i: number) => {
                    const label = typeof item === 'string' ? item : item.label;
                    const img = typeof item === 'string' ? null : item.image;
                    
                    return (
                        <div key={i} className="flex items-center justify-between p-3 bg-dark-800 border border-white/5 rounded-[5px] group/item hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                {img ? (
                                    <img src={img} alt="" className="w-6 h-6 rounded-sm object-cover bg-dark-900 border border-white/10" />
                                ) : (
                                    <div className="w-6 h-6 rounded-sm bg-dark-900 border border-white/10 flex items-center justify-center text-gray-600">
                                        <ImageIcon size={12} />
                                    </div>
                                )}
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{label}</span>
                            </div>
                            <button onClick={() => onRemove(i)} className="text-gray-600 hover:text-red-500 transition-colors"><X size={12} /></button>
                        </div>
                    )
                })}
                {items.length === 0 && <span className="text-[10px] text-gray-600 italic px-2 font-medium">No items configured.</span>}
            </div>

            <div className="flex gap-2">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-[5px] bg-dark-800 border border-dark-600 flex items-center justify-center cursor-pointer hover:border-brand-500 hover:text-white text-gray-500 transition-all shrink-0 overflow-hidden"
                    title="Add Image Icon"
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                    {newImage ? <img src={newImage} className="w-full h-full object-cover" alt="Preview" /> : <ImageIcon size={16} />}
                </div>
                <input 
                    type="text" 
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-dark-800 border border-dark-600 rounded-[5px] px-4 py-2.5 text-[10px] font-bold text-white focus:border-brand-500 outline-none transition-colors placeholder:text-gray-600"
                    onKeyDown={(e) => { if(e.key === 'Enter'){ handleAddItem(); }}}
                />
            </div>
        </div>
    );
};

const CardConfig = ({ title, cardData, onChange, colorClass }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            onChange('image', url);
        }
    };

    return (
        <div className="bg-dark-900 border border-dark-600 rounded-[5px] p-6 relative group hover:border-white/10 transition-colors">
            <h4 className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${colorClass}`}>
                {title} Card
            </h4>
            
            <div className="space-y-4">
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 bg-dark-800 border-2 border-dashed border-white/5 rounded-[5px] flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-colors relative overflow-hidden group/img"
                 >
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                     {cardData.image ? (
                         <img src={cardData.image} className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" alt={title} />
                     ) : (
                         <div className="flex flex-col items-center text-gray-600">
                             <ImageIcon size={24} />
                             <span className="text-[9px] font-black uppercase mt-2">Upload Visual</span>
                         </div>
                     )}
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-[9px] font-black text-white uppercase tracking-widest">Change Image</span>
                     </div>
                 </div>

                 <input 
                    type="text" 
                    value={cardData.title || ''}
                    onChange={(e) => onChange('title', e.target.value)}
                    placeholder="Card Title"
                    className="w-full bg-dark-800 border border-white/5 rounded-[5px] px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-brand-500"
                />
                 <textarea 
                    value={cardData.desc || ''}
                    onChange={(e) => onChange('desc', e.target.value)}
                    placeholder="Short Description"
                    className="w-full bg-dark-800 border border-white/5 rounded-[5px] px-4 py-2.5 text-xs text-white font-medium outline-none focus:border-brand-500 resize-none h-20"
                />
            </div>
        </div>
    );
};

// Restricted to English as default per request
const PRESET_LANGUAGES = [
    'English (US)', 'English (UK)'
];

const MODULE_LIST = [
    { key: 'landingPage', label: 'Landing Page', icon: LayoutTemplate },
    { key: 'liveStreaming', label: 'Live Streaming', icon: Video },
    { key: 'shorts', label: 'Shorts', icon: Smartphone },
    { key: 'photos', label: 'Photos', icon: ImageIcon },
    { key: 'comics', label: 'Comics', icon: BookOpen },
    { key: 'collection', label: 'Collection', icon: ShoppingBag },
    { key: 'blog', label: 'Blog', icon: FileText },
    { key: 'arcade', label: 'Arcade', icon: Gamepad2 },
    { key: 'randomCam', label: 'Random Cam', icon: Shuffle },
    { key: 'intimacy', label: 'Intimacy', icon: Heart },
    { key: 'engagementPoints', label: 'Engagement Points', icon: Coins },
    { key: 'subscription', label: 'Subscription', icon: Crown },
    { key: 'promotions', label: 'Promotions', icon: Megaphone },
    { key: 'aiAssistant', label: 'AI Assistant', icon: Bot },
    { key: 'verification', label: 'Verification', icon: UserCheck },
    { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { key: 'level', label: 'Level', icon: BarChart },
    { key: 'poll', label: 'Poll', icon: BarChart2 },
    { key: 'ticket', label: 'Ticket', icon: TicketIcon },
];

export default function AdminSiteSettings() {
    const { section } = useParams<{ section: string }>();
    const navigate = useNavigate();
    
    const activeSection = section || 'general';
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
    
    // SEO Sub-tab State
    const [activeSeoTab, setActiveSeoTab] = useState<'global' | 'sections' | 'performance'>('global');

    // Team Search
    const [teamSearch, setTeamSearch] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            await new Promise(r => setTimeout(r, 600));
            const data = db.getSiteSettings();
            setSettings(data);
            setLoading(false);
        };
        loadSettings();
    }, [activeSection]);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await new Promise(r => setTimeout(r, 1000));
            db.saveSiteSettings(settings);
            
            db.logAction('admin', 'update_site_settings', 'system', 'global', `Updated ${activeSection} configuration`);
            setMessage({ type: 'success', text: 'Configuration synchronized successfully.' });
            
            if (activeSection === 'appearance') {
                window.location.reload();
            }
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to synchronize.' });
        } finally {
            setSaving(false);
        }
    };
    
    const updateNested = (parent: string, key: string, value: any) => {
         setSettings({
            ...settings,
            [parent]: {
                ...settings[parent],
                [key]: value
            }
        });
    };

    const updateDeepNested = (path: string[], value: any) => {
        const newSettings = JSON.parse(JSON.stringify(settings));
        let current = newSettings;
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) current[path[i]] = {};
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        setSettings(newSettings);
    };
    
    const updateAgendaList = (listKey: string, newList: any[]) => {
        setSettings({
            ...settings,
            agenda: {
                ...settings.agenda,
                [listKey]: newList
            }
        });
    };

    const getPageTitle = () => {
        switch(activeSection) {
            case 'general': return 'Site Settings';
            case 'seo': return 'SEO & Performance';
            case 'appearance': return 'Appearance';
            case 'modules': return 'Modules';
            case 'agenda': return 'Agenda & Landing';
            case 'team': return 'Team & Communication';
            default: return 'Site Settings';
        }
    };

    // Mock mods for team section
    const moderators = db.getUsers().filter(u => u.role === 'moderator' || u.role === 'admin');
    const displayMods = moderators.length > 0 ? moderators : Array.from({length: 6}).map((_, i) => ({
        id: `mod_${i}`,
        displayName: `Moderator ${i+1}`,
        role: 'moderator',
        avatarUrl: `https://picsum.photos/100/100?random=mod_${i}`
    }));

    if (loading) return (
        <div className="flex justify-center items-center h-[50vh]">
            <Loader2 className="animate-spin text-brand-500" size={48} />
        </div>
    );
    
    return (
        <div className="p-8 max-w-[1600px] mx-auto flex flex-col gap-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">{getPageTitle()}</h1>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Global configuration and parameters.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-8 rounded-[5px] flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Config
                    </button>
                </div>
            </div>

            <div className="flex-1 min-w-0">
                {message && (
                    <div className={`p-5 rounded-[5px] mb-8 flex items-center gap-4 animate-in slide-in-from-top-4 border ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-red-900/20 text-red-400 border-red-500/30'}`}>
                        {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        <span className="font-bold uppercase tracking-widest text-xs">{message.text}</span>
                        <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100 transition-opacity"><X size={18}/></button>
                    </div>
                )}

                <div className="w-full">
                    
                    {/* --- GENERAL SETTINGS --- */}
                    {activeSection === 'general' && (
                        <div className="space-y-8 animate-in fade-in">
                            <SettingSection 
                                title="Brand Identity" 
                                subtitle="Configuration Protocol" 
                                icon={LayoutTemplate} 
                                color="text-red-500" 
                                bgColor="bg-red-500/10" 
                                borderColor="border-red-500/20"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <TextInput 
                                        label="Platform Name" 
                                        value={settings.general.siteName} 
                                        onChange={(v: string) => updateNested('general', 'siteName', v)} 
                                        placeholder="LuciSin" 
                                        icon={Layout} 
                                    />
                                    <TextInput 
                                        label="Favicon URL" 
                                        value={settings.general.favicon} 
                                        onChange={(v: string) => updateNested('general', 'favicon', v)} 
                                        placeholder="https://example.com/favicon.ico" 
                                        icon={ImageIcon} 
                                        help="URL for the browser tab icon (32x32 recommended)"
                                    />
                                    <TextInput 
                                        label="Main Logo URL" 
                                        value={settings.general.logoUrl} 
                                        onChange={(v: string) => updateNested('general', 'logoUrl', v)} 
                                        placeholder="https://example.com/logo.png" 
                                        icon={ImageIcon} 
                                        help="Main site logo for header and footer."
                                    />
                                    <TextInput 
                                        label="Link Sharing Background (OG:Image)" 
                                        value={settings.seo.socialImage} 
                                        onChange={(v: string) => updateNested('seo', 'socialImage', v)} 
                                        placeholder="https://..." 
                                        icon={Share2} 
                                        help="Default image displayed when sharing the site link on social media."
                                    />
                                    
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">
                                            <Languages size={14} className="text-brand-500" /> Default Language (System)
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                            {PRESET_LANGUAGES.map(lang => {
                                                const isSelected = settings.general.defaultLanguage === lang;
                                                return (
                                                    <button
                                                        key={lang}
                                                        onClick={() => updateNested('general', 'defaultLanguage', lang)}
                                                        className={`px-4 py-3 rounded-[5px] text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                                            isSelected 
                                                            ? 'bg-brand-600 text-white border-brand-500 shadow-lg' 
                                                            : 'bg-dark-900 text-gray-400 border-dark-600 hover:text-white hover:border-brand-500/50'
                                                        }`}
                                                    >
                                                        {lang}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <p className="text-[9px] text-gray-500 mt-2 ml-1 font-bold uppercase tracking-wider italic">
                                            Note: Additional languages for users are configured in the "Agenda" section.
                                        </p>
                                    </div>

                                    <div className="col-span-1 md:col-span-2">
                                         <TextAreaInput 
                                            label="Site Description" 
                                            value={settings.general.description} 
                                            onChange={(v: string) => updateNested('general', 'description', v)} 
                                            placeholder="The ultimate creator platform..." 
                                            icon={FileText} 
                                            help="Used for meta tags and footer description."
                                        />
                                    </div>
                                </div>
                            </SettingSection>

                            <SettingSection 
                                title="Social Connections" 
                                subtitle="Network Integration" 
                                icon={Share2} 
                                color="text-blue-500" 
                                bgColor="bg-blue-500/10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {['Twitter', 'Instagram', 'Youtube', 'Facebook', 'Discord'].map(social => (
                                        <TextInput 
                                            key={social}
                                            label={social} 
                                            value={settings.socials[social.toLowerCase()]} 
                                            onChange={(v: string) => updateNested('socials', social.toLowerCase(), v)} 
                                            placeholder={`https://${social.toLowerCase()}.com/...`} 
                                            icon={LinkIcon} 
                                        />
                                    ))}
                                </div>
                            </SettingSection>
                        </div>
                    )}
                    
                    {/* --- AGENDA (IDENTITY & LANDING & REGIONS) --- */}
                    {activeSection === 'agenda' && (
                        <div className="space-y-8 animate-in fade-in">
                             
                             {/* Identity Definitions */}
                             <SettingSection 
                                title="Identity Definitions" 
                                subtitle="Configuration Protocol" 
                                icon={Users} 
                                color="text-purple-500" 
                                bgColor="bg-purple-500/10"
                             >
                                 <div className="space-y-6">
                                     <AgendaList 
                                        title="GENDERS" 
                                        items={settings.agenda.genders || []} 
                                        onAdd={(item: any) => updateAgendaList('genders', [...settings.agenda.genders, item])}
                                        onRemove={(idx: number) => updateAgendaList('genders', settings.agenda.genders.filter((_: any, i: number) => i !== idx))}
                                        placeholder="Add Gender..."
                                        icon={Users}
                                        colorClass="text-purple-400"
                                        addButtonColor="bg-pink-600 hover:bg-pink-500"
                                     />
                                     <AgendaList 
                                        title="PRONOUNS" 
                                        items={settings.agenda.pronouns || []} 
                                        onAdd={(item: any) => updateAgendaList('pronouns', [...settings.agenda.pronouns, item])}
                                        onRemove={(idx: number) => updateAgendaList('pronouns', settings.agenda.pronouns.filter((_: any, i: number) => i !== idx))}
                                        placeholder="Add Pronoun..."
                                        icon={Type}
                                        colorClass="text-purple-400"
                                        addButtonColor="bg-pink-600 hover:bg-pink-500"
                                     />
                                 </div>
                             </SettingSection>

                             {/* Orientation & Flags */}
                             <SettingSection 
                                title="Orientation & Flags" 
                                subtitle="Configuration Protocol" 
                                icon={Flag} 
                                color="text-yellow-500" 
                                bgColor="bg-yellow-500/10"
                             >
                                 <p className="text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-widest">Configure Pride Flags displayed on Landing & Profile. Upload icons for each.</p>
                                 <AgendaList 
                                    title="ORIENTATIONS" 
                                    items={settings.agenda.orientations || []} 
                                    onAdd={(item: any) => updateAgendaList('orientations', [...settings.agenda.orientations, item])}
                                    onRemove={(idx: number) => updateAgendaList('orientations', settings.agenda.orientations.filter((_: any, i: number) => i !== idx))}
                                    placeholder="Add Orientation..."
                                    icon={Flag}
                                    colorClass="text-yellow-500"
                                    addButtonColor="bg-pink-600 hover:bg-pink-500"
                                 />
                             </SettingSection>
                             
                             {/* Region & Language Selection for Register Page */}
                             <SettingSection 
                                title="Regions & Languages" 
                                subtitle="Localization Protocol" 
                                icon={Globe} 
                                color="text-green-500" 
                                bgColor="bg-green-500/10"
                             >
                                 <p className="text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-widest">
                                     Define available regions for user registration. Users will see content tailored to their selected region.
                                 </p>
                                 <AgendaList 
                                    title="ACTIVE REGIONS" 
                                    items={settings.agenda.regions || []} 
                                    onAdd={(item: any) => updateAgendaList('regions', [...(settings.agenda.regions || []), item])}
                                    onRemove={(idx: number) => updateAgendaList('regions', (settings.agenda.regions || []).filter((_: any, i: number) => i !== idx))}
                                    placeholder="Add Region (e.g. Spanish, French)..."
                                    icon={Globe}
                                    colorClass="text-green-500"
                                    addButtonColor="bg-green-600 hover:bg-green-500"
                                 />
                             </SettingSection>

                             {/* Universes (Interests) */}
                             <SettingSection 
                                title="Universes (Interests)" 
                                subtitle="Configuration Protocol" 
                                icon={Grid} 
                                color="text-blue-500" 
                                bgColor="bg-blue-500/10"
                             >
                                 <p className="text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-widest">Manage interest categories. Use Image URLs for rich display in the Interest Hub.</p>
                                 <AgendaList 
                                    title="INTERESTS" 
                                    items={settings.agenda.interests || []} 
                                    onAdd={(item: any) => updateAgendaList('interests', [...settings.agenda.interests, item])}
                                    onRemove={(idx: number) => updateAgendaList('interests', settings.agenda.interests.filter((_: any, i: number) => i !== idx))}
                                    placeholder="Add Universe..."
                                    icon={Grid}
                                    colorClass="text-blue-500"
                                    addButtonColor="bg-pink-600 hover:bg-pink-500"
                                 />
                             </SettingSection>

                             {/* LANDING PAGE CONFIG MOVED HERE */}
                             <SettingSection 
                                title="Landing: Hero Section" 
                                subtitle="First Impressions" 
                                icon={Video} 
                                color="text-brand-500" 
                                bgColor="bg-brand-900/20" 
                                borderColor="border-brand-500/20"
                            >
                                <TextInput 
                                    label="Hero Video URL" 
                                    value={settings.landing?.heroVideo} 
                                    onChange={(v: string) => updateNested('landing', 'heroVideo', v)} 
                                    placeholder="https://..." 
                                    icon={Video} 
                                    help="Background video loop for the main landing hero."
                                />
                            </SettingSection>

                            <SettingSection 
                                title="Landing: The Movement" 
                                subtitle="Mission Statement" 
                                icon={Move} 
                                color="text-blue-400" 
                                bgColor="bg-blue-900/20" 
                                borderColor="border-blue-500/20"
                            >
                                <div className="space-y-6">
                                    <TextInput 
                                        label="Section Title" 
                                        value={settings.landing?.movementTitle} 
                                        onChange={(v: string) => updateNested('landing', 'movementTitle', v)} 
                                        placeholder="The Movement" 
                                        icon={Type} 
                                    />
                                    <TextAreaInput 
                                        label="Description Text" 
                                        value={settings.landing?.movementDesc} 
                                        onChange={(v: string) => updateNested('landing', 'movementDesc', v)} 
                                        placeholder="Description..." 
                                        icon={FileText} 
                                    />
                                </div>
                            </SettingSection>

                            <SettingSection 
                                title="Landing: Experience Cards" 
                                subtitle="Mode Selection" 
                                icon={Grid} 
                                color="text-purple-400" 
                                bgColor="bg-purple-900/20" 
                                borderColor="border-purple-500/20"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <CardConfig 
                                        title="Dating" 
                                        colorClass="text-brand-second" 
                                        cardData={settings.landing?.datingCard || {}} 
                                        onChange={(field: string, val: string) => updateDeepNested(['landing', 'datingCard', field], val)} 
                                    />
                                    <CardConfig 
                                        title="Naughty" 
                                        colorClass="text-brand-500" 
                                        cardData={settings.landing?.naughtyCard || {}} 
                                        onChange={(field: string, val: string) => updateDeepNested(['landing', 'naughtyCard', field], val)} 
                                    />
                                </div>
                            </SettingSection>
                        </div>
                    )}
                    
                    {/* ... (Rest of sections like SEO, Theme, Modules, Team remain unchanged) ... */}
                    {activeSection === 'seo' && (
                        <div className="space-y-6 animate-in fade-in">
                             {/* Sub Navigation */}
                             <div className="flex gap-2 mb-4 bg-dark-800 p-1 rounded-[5px] border border-dark-700 w-fit">
                                 {['global', 'sections', 'performance'].map((tab) => (
                                     <button
                                        key={tab}
                                        onClick={() => setActiveSeoTab(tab as any)}
                                        className={`px-6 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all ${
                                            activeSeoTab === tab 
                                            ? 'bg-brand-500 text-white shadow-lg' 
                                            : 'text-gray-500 hover:text-white hover:bg-dark-700'
                                        }`}
                                     >
                                         {tab}
                                     </button>
                                 ))}
                             </div>

                             {/* Global Content */}
                             {activeSeoTab === 'global' && (
                                <div className="space-y-8">
                                    <div className="bg-dark-800 border border-dark-700 rounded-[5px] p-8 shadow-xl">
                                        <div className="grid grid-cols-1 gap-6">
                                             <TextInput 
                                                label="Default Title Template" 
                                                value={settings.seo.titleTemplate} 
                                                onChange={(v: string) => updateNested('seo', 'titleTemplate', v)} 
                                                placeholder="{{title}} | LuciSin" 
                                                icon={Type} 
                                             />
                                             <TextAreaInput 
                                                label="Meta Description" 
                                                value={settings.seo.description} 
                                                onChange={(v: string) => updateNested('seo', 'description', v)} 
                                                placeholder="Description..." 
                                                icon={FileText} 
                                             />
                                             <div className="p-4 bg-dark-900 border border-dark-600 rounded-[5px]">
                                                <Toggle 
                                                    label="Enable Canonical Tags" 
                                                    desc="Prevents duplicate content issues." 
                                                    checked={settings.seo.enableCanonical} 
                                                    onChange={(v: boolean) => updateNested('seo', 'enableCanonical', v)} 
                                                />
                                             </div>
                                             <div className="p-4 bg-dark-900 border border-dark-600 rounded-[5px]">
                                                <Toggle 
                                                    label="Tag-Based SEO URLs" 
                                                    desc="Enhance visibility by appending tags to URL paths." 
                                                    checked={settings.seo.tagBasedUrls} 
                                                    onChange={(v: boolean) => updateNested('seo', 'tagBasedUrls', v)} 
                                                />
                                             </div>
                                        </div>
                                    </div>

                                    <div className="bg-dark-800 border border-dark-700 rounded-[5px] p-8 shadow-xl">
                                         <div className="flex items-center gap-3 mb-6">
                                             <Bot className="text-yellow-500" size={24}/>
                                             <h3 className="font-bold text-white">Crawlers & Sitemap</h3>
                                         </div>
                                         <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Sitemap</label>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex gap-2">
                                                        <div className="flex-1 bg-dark-900 border border-dark-600 rounded-[5px] px-5 py-3.5 text-white text-sm font-bold flex items-center gap-3">
                                                            <FileText size={16} className="text-gray-500"/>
                                                            sitemap.xml
                                                            <span className="text-[10px] text-gray-600 font-normal ml-auto">Auto-generated daily</span>
                                                        </div>
                                                        <button onClick={() => seoService.downloadSitemap()} className="bg-dark-800 border border-white/10 hover:border-brand-500 text-white font-bold px-6 rounded-[5px] text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                                                             <Download size={14}/> Download
                                                        </button>
                                                    </div>
                                                    <p className="text-[9px] text-gray-500 font-medium italic pl-1">
                                                        Built off {settings.general.siteName} direct /sitemap.xml
                                                    </p>
                                                </div>
                                            </div>

                                            <TextAreaInput 
                                                label="Robots.txt" 
                                                value={settings.seo.robotsTxt} 
                                                onChange={(v: string) => updateNested('seo', 'robotsTxt', v)} 
                                                placeholder="User-agent: * ..." 
                                                icon={FileText} 
                                                monospace={true}
                                            />
                                         </div>
                                    </div>
                                </div>
                             )}

                             {/* Sections Content */}
                             {activeSeoTab === 'sections' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { key: 'live', label: 'Live Streams Settings', icon: Video },
                                        { key: 'shorts', label: 'Shorts Settings', icon: Smartphone },
                                        { key: 'photos', label: 'Photos Settings', icon: ImageIcon },
                                        { key: 'comics', label: 'Comics Settings', icon: BookOpen },
                                        { key: 'collection', label: 'Collection Settings', icon: ShoppingBag },
                                        { key: 'games', label: 'Arcade Games Settings', icon: Gamepad2 },
                                        { key: 'blog', label: 'Knowledge Book Settings', icon: FileText }
                                    ].map((section) => (
                                        <div key={section.key} className="bg-dark-800 border border-dark-700 rounded-[5px] p-6 shadow-xl hover:border-brand-500/30 transition-all">
                                            <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                                                <div className="p-2 rounded-[5px] shadow-lg border bg-brand-900/20 text-brand-500 border-brand-500/20">
                                                    <section.icon size={20}/>
                                                </div>
                                                <h3 className="font-bold text-white uppercase tracking-tight">{section.label}</h3>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-dark-900 p-3 rounded-[5px] border border-dark-600">
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Enable Indexing</label>
                                                        <Toggle 
                                                            checked={settings.seo.sections[section.key]?.index} 
                                                            onChange={(v: boolean) => updateDeepNested(['seo', 'sections', section.key, 'index'], v)}
                                                            label=""
                                                        />
                                                    </div>
                                                    <div className="bg-dark-900 p-3 rounded-[5px] border border-dark-600">
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Auto No-Index</label>
                                                        <Toggle 
                                                            checked={settings.seo.sections[section.key]?.autoNoIndex} 
                                                            onChange={(v: boolean) => updateDeepNested(['seo', 'sections', section.key, 'autoNoIndex'], v)}
                                                            label=""
                                                        />
                                                    </div>
                                                </div>

                                                <TextInput 
                                                    label="Title Template" 
                                                    value={settings.seo.sections[section.key]?.title} 
                                                    onChange={(v: string) => updateDeepNested(['seo', 'sections', section.key, 'title'], v)} 
                                                    placeholder="{{title}} | LuciSin" 
                                                    icon={Type} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             )}

                             {/* Performance Content */}
                             {activeSeoTab === 'performance' && (
                                <div className="space-y-8">
                                    <div className="bg-dark-800 border border-dark-700 rounded-[5px] p-8 shadow-xl">
                                         <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Zap className="text-blue-500" size={20}/> Media Optimization</h3>
                                         <div className="space-y-2">
                                             <Toggle 
                                                label="Video Compressor" 
                                                desc="Automatically compress videos to 720p/1080p on upload to save bandwidth." 
                                                checked={settings.performance?.media?.videoCompressor} 
                                                onChange={(v: boolean) => updateDeepNested(['performance', 'media', 'videoCompressor'], v)} 
                                             />
                                             <Toggle 
                                                label="Lazy Load Images" 
                                                desc="Only load images when they enter the viewport." 
                                                checked={settings.performance?.media?.lazyLoad} 
                                                onChange={(v: boolean) => updateDeepNested(['performance', 'media', 'lazyLoad'], v)} 
                                             />
                                             <Toggle 
                                                label="CDN Edge Caching" 
                                                desc="Cache static assets on edge nodes for faster global access." 
                                                checked={settings.performance?.media?.cdnCaching} 
                                                onChange={(v: boolean) => updateDeepNested(['performance', 'media', 'cdnCaching'], v)} 
                                             />
                                         </div>
                                    </div>

                                    <div className="bg-dark-800 border border-dark-700 rounded-[5px] p-8 shadow-xl">
                                         <h3 className="font-bold text-white mb-6 flex items-center gap-2"><ShieldCheck className="text-purple-500" size={20}/> Content Watermarking</h3>
                                         <div className="space-y-6">
                                             <Toggle 
                                                label="Enable Watermark Overlay" 
                                                desc="Automatically apply text overlay to uploaded media." 
                                                checked={settings.performance?.watermark?.enabled} 
                                                onChange={(v: boolean) => updateDeepNested(['performance', 'watermark', 'enabled'], v)} 
                                             />
                                             
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                 <TextInput 
                                                    label="Watermark Text" 
                                                    value={settings.performance?.watermark?.text} 
                                                    onChange={(v: string) => updateDeepNested(['performance', 'watermark', 'text'], v)} 
                                                    placeholder="LuciSin" 
                                                    icon={Type} 
                                                 />
                                                 <div>
                                                     <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Position</label>
                                                     <div className="relative">
                                                         <select 
                                                            value={settings.performance?.watermark?.position || 'Bottom Right'}
                                                            onChange={(e) => updateDeepNested(['performance', 'watermark', 'position'], e.target.value)}
                                                            className="w-full bg-dark-900 border border-dark-600 rounded-[5px] px-5 py-3.5 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none font-bold appearance-none"
                                                         >
                                                             <option value="Bottom Right">Bottom Right</option>
                                                             <option value="Bottom Left">Bottom Left</option>
                                                             <option value="Top Right">Top Right</option>
                                                             <option value="Top Left">Top Left</option>
                                                             <option value="Center">Center</option>
                                                         </select>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                    </div>
                                </div>
                             )}
                        </div>
                    )}

                    {/* --- THEME (APPEARANCE) --- */}
                    {activeSection === 'appearance' && (
                        <div className="space-y-8 animate-in fade-in">
                            <SettingSection title="Theme Engine" subtitle="Visual Logic" icon={Palette} color="text-purple-500" bgColor="bg-purple-500/10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Mode Protocol</label>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => updateNested('appearance', 'mode', 'auto')}
                                                className={`flex-1 py-4 rounded-[5px] border-2 transition-all ${settings.appearance.mode === 'auto' ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-dark-600 bg-dark-900 text-gray-500'}`}
                                            >
                                                <div className="font-bold uppercase text-xs mb-1">Auto Seasonal</div>
                                                <div className="text-[9px]">Syncs with calendar events</div>
                                            </button>
                                            <button 
                                                onClick={() => updateNested('appearance', 'mode', 'manual')}
                                                className={`flex-1 py-4 rounded-[5px] border-2 transition-all ${settings.appearance.mode === 'manual' ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-dark-600 bg-dark-900 text-gray-500'}`}
                                            >
                                                <div className="font-bold uppercase text-xs mb-1">Manual Override</div>
                                                <div className="text-[9px]">Static theme selection</div>
                                            </button>
                                        </div>
                                    </div>

                                    {settings.appearance.mode === 'manual' && (
                                         <div>
                                             <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Select Theme</label>
                                             <select 
                                                 value={settings.appearance.manualTheme || 'Standard'}
                                                 onChange={(e) => updateNested('appearance', 'manualTheme', e.target.value)}
                                                 className="w-full bg-dark-900 border border-dark-600 rounded-[5px] px-4 py-3 text-white text-xs font-bold outline-none focus:border-brand-500"
                                             >
                                                 <option value="Standard">Standard Dark</option>
                                                 <option value="Halloween">Halloween</option>
                                                 <option value="Christmas">Christmas</option>
                                                 <option value="New Year">New Year</option>
                                                 <option value="Valentine">Valentine</option>
                                             </select>
                                         </div>
                                    )}
                                </div>
                            </SettingSection>
                            
                            <SettingSection 
                                title="Seasonal Calendar" 
                                subtitle="Event Timing" 
                                icon={Calendar} 
                                color="text-orange-500" 
                                bgColor="bg-orange-500/10" 
                                borderColor="border-orange-500/20"
                            >
                                <p className="text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-widest">Define active date ranges for auto-theme switching. (Months 0-11)</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {['halloween', 'christmas', 'newYear', 'prideDay', 'comingOut'].map(event => (
                                        <div key={event} className="bg-dark-900 p-4 rounded-[5px] border border-dark-600">
                                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Calendar size={12} className="text-orange-500"/> {event}
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-[8px] font-bold text-gray-500 uppercase block mb-1">Start (M/D)</label>
                                                    <div className="flex gap-1">
                                                        <input type="number" className="w-12 bg-dark-800 border border-dark-700 rounded p-1.5 text-center text-xs text-white font-bold" value={settings.appearance.calendar[event]?.startMonth} onChange={(e) => {
                                                            const val = parseInt(e.target.value);
                                                            const newCal = {...settings.appearance.calendar};
                                                            newCal[event].startMonth = val;
                                                            updateNested('appearance', 'calendar', newCal);
                                                        }} />
                                                        <input type="number" className="w-12 bg-dark-800 border border-dark-700 rounded p-1.5 text-center text-xs text-white font-bold" value={settings.appearance.calendar[event]?.startDay} onChange={(e) => {
                                                            const val = parseInt(e.target.value);
                                                            const newCal = {...settings.appearance.calendar};
                                                            newCal[event].startDay = val;
                                                            updateNested('appearance', 'calendar', newCal);
                                                        }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[8px] font-bold text-gray-500 uppercase block mb-1">End (M/D)</label>
                                                    <div className="flex gap-1">
                                                        <input type="number" className="w-12 bg-dark-800 border border-dark-700 rounded p-1.5 text-center text-xs text-white font-bold" value={settings.appearance.calendar[event]?.endMonth} onChange={(e) => {
                                                            const val = parseInt(e.target.value);
                                                            const newCal = {...settings.appearance.calendar};
                                                            newCal[event].endMonth = val;
                                                            updateNested('appearance', 'calendar', newCal);
                                                        }} />
                                                        <input type="number" className="w-12 bg-dark-800 border border-dark-700 rounded p-1.5 text-center text-xs text-white font-bold" value={settings.appearance.calendar[event]?.endDay} onChange={(e) => {
                                                            const val = parseInt(e.target.value);
                                                            const newCal = {...settings.appearance.calendar};
                                                            newCal[event].endDay = val;
                                                            updateNested('appearance', 'calendar', newCal);
                                                        }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SettingSection>
                        </div>
                    )}

                    {/* --- MODULES (FEATURES) --- */}
                    {activeSection === 'modules' && (
                        <div className="space-y-8 animate-in fade-in">
                            <SettingSection title="Feature Modules" subtitle="Core Systems" icon={Layers} color="text-red-500" bgColor="bg-red-500/10" borderColor="border-red-500/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {MODULE_LIST.map(mod => {
                                        const isActive = settings.features[mod.key] ?? false;
                                        return (
                                            <div key={mod.key} className="bg-dark-900 p-4 rounded-[5px] border border-dark-600 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded bg-dark-800 text-gray-400`}>
                                                        <mod.icon size={16} />
                                                    </div>
                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">{mod.label}</span>
                                                </div>
                                                <Toggle 
                                                    label="" 
                                                    checked={isActive} 
                                                    onChange={(v: boolean) => updateNested('features', mod.key, v)} 
                                                    activeColor="bg-red-600"
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </SettingSection>
                        </div>
                    )}
                    
                    {/* --- TEAM & COMMS --- */}
                    {activeSection === 'team' && (
                        <div className="space-y-8 animate-in fade-in">
                            <div className="bg-dark-800 border border-dark-700 rounded-[5px] p-6 shadow-xl mb-6">
                                 <div className="flex justify-between items-center mb-6">
                                     <h3 className="font-bold text-white text-lg uppercase tracking-tight flex items-center gap-2">
                                         <MessageSquare size={20} className="text-brand-500"/> Broadcast Message
                                     </h3>
                                     <button className="bg-brand-600 text-white px-4 py-2 rounded-[5px] text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-brand-500 transition-all shadow-lg">
                                         <Send size={14} /> Send Alert
                                     </button>
                                 </div>
                                 <div className="relative">
                                     <input 
                                        type="text" 
                                        value={teamSearch}
                                        onChange={(e) => setTeamSearch(e.target.value)}
                                        placeholder="Type message to team..." 
                                        className="w-full bg-dark-900 border border-dark-600 rounded-[5px] p-4 pl-12 text-sm text-white focus:border-brand-500 outline-none font-medium placeholder:text-gray-600"
                                     />
                                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                 </div>
                                 <div className="flex items-center gap-4 mt-4">
                                     <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase cursor-pointer">
                                         <input type="checkbox" className="accent-brand-500" /> Send as Priority
                                     </label>
                                     <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase cursor-pointer">
                                         <input type="checkbox" className="accent-brand-500" /> Notify Email
                                     </label>
                                 </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {/* Mock Moderator Cards */}
                                 {displayMods.map((mod: any, i: number) => (
                                     <div key={i} className="bg-dark-800 border border-dark-700 rounded-[5px] p-4 flex items-center gap-4 hover:border-brand-500/30 transition-all cursor-pointer group shadow-lg">
                                         <img src={mod.avatarUrl} className="w-12 h-12 rounded-full border border-dark-600 object-cover" alt="Mod" />
                                         <div>
                                             <h4 className="font-bold text-white text-sm group-hover:text-brand-500 transition-colors">{mod.displayName}</h4>
                                             <div className="flex items-center gap-2 mt-1">
                                                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest bg-dark-900 px-2 py-0.5 rounded border border-white/5">Active</span>
                                                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{mod.role}</span>
                                             </div>
                                         </div>
                                     </div>
                                 ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}