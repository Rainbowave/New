

import React, { useState, useEffect } from 'react';
import { Save, Key, Globe, CreditCard, HardDrive, Cpu, CheckCircle, Eye, EyeOff, Search as SearchIcon, Video, Code, Copy, Bitcoin, Shield, Flame, Zap, MousePointerClick, Layout, Image as ImageIcon, Maximize, ArrowDownToLine } from 'lucide-react';
import { db } from '../../services/db';

const InputField = ({ label, value, onChange, placeholder, type = 'text', helpText, icon: Icon }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string, helpText?: string, icon?: any }) => {
    const [show, setShow] = useState(false);
    const inputType = type === 'password' ? (show ? 'text' : 'password') : type;

    return (
        <div className="mb-4">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                {Icon && <Icon size={14} className="text-brand-500" />} {label}
            </label>
            <div className="relative">
                <input 
                    type={inputType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all font-mono text-sm"
                />
                {type === 'password' && (
                    <button 
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-white"
                    >
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {helpText && <p className="text-[10px] text-gray-500 mt-1.5 font-medium">{helpText}</p>}
        </div>
    );
}

export default function AdminApi() {
    const [settings, setSettings] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Ad Specific Local State
    const [adMode, setAdMode] = useState<'SFW' | 'NSFW'>('SFW');

    useEffect(() => {
        const loaded = db.getApiSettings();
        
        // Ensure complex structure exists even if DB has old data
        const safeSettings = {
            liveStreaming: { serverUrl: '', streamKey: '', ...loaded.liveStreaming },
            payments: { 
                stripePublishableKey: '', 
                stripeSecretKey: '', 
                nowPaymentsApiKey: '', 
                nowPaymentsRecurringApiKey: '', 
                ...loaded.payments 
            },
            storage: { bucketUrl: '', accessKey: '', ...loaded.storage },
            ai: { geminiKey: '', ...loaded.ai },
            // Expanded Ad Settings structure
            ads: { 
                mode: loaded.ads?.mode || 'SFW',
                sfw: { 
                    exoclick: { 
                        apiToken: '', 
                        bannerZoneId: '', 
                        prerollZoneId: '', 
                        contentZoneId: '',
                        ...loaded.ads?.sfw?.exoclick 
                    },
                    popads: { 
                        apiKey: '', 
                        websiteId: '',
                        popupZoneId: '',
                        popunderZoneId: '',
                        ...loaded.ads?.sfw?.popads 
                    }
                },
                nsfw: {
                    exoclick: { 
                        apiToken: '', 
                        bannerZoneId: '', 
                        prerollZoneId: '', 
                        contentZoneId: '',
                        ...loaded.ads?.nsfw?.exoclick 
                    },
                    popads: { 
                        apiKey: '', 
                        websiteId: '',
                        popupZoneId: '',
                        popunderZoneId: '',
                        ...loaded.ads?.nsfw?.popads 
                    }
                }
            }
        };

        setSettings(safeSettings);
        setAdMode(safeSettings.ads.mode as 'SFW' | 'NSFW');
    }, []);

    const handleSave = () => {
        setSaving(true);
        // Sync local ad mode to settings before saving
        const finalSettings = {
            ...settings,
            ads: {
                ...settings.ads,
                mode: adMode
            }
        };
        db.saveApiSettings(finalSettings);
        setTimeout(() => {
            setSaving(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 800);
    };

    const updateSection = (section: string, field: string, value: string) => {
        setSettings((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const updateAdConfig = (mode: 'sfw' | 'nsfw', provider: 'exoclick' | 'popads', field: string, value: string) => {
        setSettings((prev: any) => ({
            ...prev,
            ads: {
                ...prev.ads,
                [mode]: {
                    ...prev.ads[mode],
                    [provider]: {
                        ...prev.ads[mode][provider],
                        [field]: value
                    }
                }
            }
        }));
    };

    const renderAdConfig = (mode: 'sfw' | 'nsfw') => {
        const config = settings.ads[mode];
        const isSfw = mode === 'sfw';
        const borderColor = isSfw ? 'border-brand-second/20' : 'border-brand-500/20';
        const badgeColor = isSfw ? 'bg-brand-second/20 text-brand-second border-brand-second/20' : 'bg-red-900/20 text-red-400 border-red-500/20';
        const iconColor = isSfw ? 'text-brand-second' : 'text-red-500';
        
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ExoClick Configuration */}
                <div className={`bg-dark-900/50 rounded-xl p-6 border ${borderColor}`}>
                    <div className="flex items-center justify-between mb-4 border-b border-dark-700 pb-2">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Video size={16} className={iconColor} /> ExoClick {mode.toUpperCase()}
                        </h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-black ${badgeColor}`}>Video & Display</span>
                    </div>
                    
                    <InputField 
                        label="API Token" 
                        icon={Key}
                        type="password"
                        value={config.exoclick.apiToken} 
                        onChange={(v) => updateAdConfig(mode, 'exoclick', 'apiToken', v)}
                        placeholder="exo_api_token..."
                        helpText="Required for stats and reporting"
                    />

                    <div className="grid grid-cols-1 gap-2 pt-2">
                        <InputField 
                            label="Banner Zone ID" 
                            icon={Layout}
                            value={config.exoclick.bannerZoneId} 
                            onChange={(v) => updateAdConfig(mode, 'exoclick', 'bannerZoneId', v)}
                            placeholder="1234567"
                        />
                        <InputField 
                            label="Pre-Roll Video Zone ID" 
                            icon={Video}
                            value={config.exoclick.prerollZoneId} 
                            onChange={(v) => updateAdConfig(mode, 'exoclick', 'prerollZoneId', v)}
                            placeholder="7654321"
                        />
                        <InputField 
                            label="Content Ad Zone ID" 
                            icon={ImageIcon}
                            value={config.exoclick.contentZoneId} 
                            onChange={(v) => updateAdConfig(mode, 'exoclick', 'contentZoneId', v)}
                            placeholder="9988776"
                        />
                    </div>
                </div>

                {/* PopAds Configuration */}
                <div className="bg-dark-900/50 rounded-xl p-6 border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-4 border-b border-dark-700 pb-2">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <MousePointerClick size={16} className="text-yellow-500" /> PopAds {mode.toUpperCase()}
                        </h4>
                        <span className="text-[9px] bg-yellow-900/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20 uppercase font-black">Pop-Under</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <InputField 
                            label="API Key" 
                            icon={Key}
                            type="password"
                            value={config.popads.apiKey} 
                            onChange={(v) => updateAdConfig(mode, 'popads', 'apiKey', v)}
                            placeholder="pop_api_key..."
                        />
                        <InputField 
                            label="Website ID" 
                            icon={Globe}
                            value={config.popads.websiteId} 
                            onChange={(v) => updateAdConfig(mode, 'popads', 'websiteId', v)}
                            placeholder="12345"
                        />
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dark-700">
                            <InputField 
                                label="Pop-Up Zone ID" 
                                icon={Maximize}
                                value={config.popads.popupZoneId} 
                                onChange={(v) => updateAdConfig(mode, 'popads', 'popupZoneId', v)}
                                placeholder="98765"
                                helpText="Standard Pop-Up"
                            />
                            <InputField 
                                label="Pop-Under Zone ID" 
                                icon={ArrowDownToLine}
                                value={config.popads.popunderZoneId} 
                                onChange={(v) => updateAdConfig(mode, 'popads', 'popunderZoneId', v)}
                                placeholder="98766"
                                helpText="Back-under Trigger"
                            />
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                        <p className="text-[10px] text-yellow-500/80 leading-relaxed font-medium">
                            <span className="font-bold uppercase">Note:</span> Pop-unders perform best for high-traffic {isSfw ? 'dating' : 'NSFW'} landing pages. Ensure frequency caps are set in the PopAds dashboard to avoid user churn.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    if (!settings) return null;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">API Keys & Configuration</h1>
                    <p className="text-gray-400 text-sm">Manage third-party integrations, monetization, and secrets.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-brand-900/30 transition-all hover:scale-105 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                </button>
            </div>

            {success && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4 mb-8 flex items-center gap-3 text-green-400 animate-in fade-in">
                    <CheckCircle size={20} />
                    <span className="font-bold">Configuration saved successfully.</span>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* 1. Ad Networks (Updated) */}
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 xl:col-span-2">
                    <div className="flex justify-between items-center mb-6 border-b border-dark-700 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-900/20 rounded-lg text-yellow-400"><Globe size={20} /></div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Ad Network Ecosystem</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Monetize free tier traffic</p>
                            </div>
                        </div>
                        
                        {/* SFW / NSFW Toggle */}
                        <div className="flex bg-dark-900 p-1 rounded-lg border border-dark-600">
                            <button 
                                onClick={() => setAdMode('SFW')}
                                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${adMode === 'SFW' ? 'bg-brand-second text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Shield size={12} /> SFW
                            </button>
                            <button 
                                onClick={() => setAdMode('NSFW')}
                                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${adMode === 'NSFW' ? 'bg-brand-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Flame size={12} /> NSFW
                            </button>
                        </div>
                    </div>

                    <div className="animate-in fade-in slide-in-from-top-2">
                        {adMode === 'SFW' ? renderAdConfig('sfw') : renderAdConfig('nsfw')}
                    </div>
                </div>
                
                {/* 2. Monetization Gateways */}
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                        <div className="p-2 bg-green-900/20 rounded-lg text-green-400"><CreditCard size={20} /></div>
                        <h3 className="font-bold text-white text-lg">Monetization (Stripe & NowPayments)</h3>
                    </div>
                    
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">Stripe (Fiat)</h4>
                        <InputField 
                            label="Publishable Key" 
                            value={settings.payments.stripePublishableKey} 
                            onChange={(v) => updateSection('payments', 'stripePublishableKey', v)}
                            placeholder="pk_live_..."
                        />
                        <InputField 
                            label="Secret Key" 
                            type="password"
                            value={settings.payments.stripeSecretKey} 
                            onChange={(v) => updateSection('payments', 'stripeSecretKey', v)}
                            placeholder="sk_live_..."
                        />
                    </div>

                    <div className="border-t border-dark-700 pt-4">
                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Bitcoin size={14} className="text-orange-500"/> NowPayments (Crypto)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField 
                                label="Standard API Key" 
                                type="password"
                                value={settings.payments.nowPaymentsApiKey} 
                                onChange={(v) => updateSection('payments', 'nowPaymentsApiKey', v)}
                                placeholder="Standard Key"
                            />
                            <InputField 
                                label="Recurring Payments API Key" 
                                type="password"
                                value={settings.payments.nowPaymentsRecurringApiKey} 
                                onChange={(v) => updateSection('payments', 'nowPaymentsRecurringApiKey', v)}
                                placeholder="Recurring Key"
                            />
                        </div>
                        <div className="mt-2 bg-dark-900 p-3 rounded-lg border border-dark-600">
                            <p className="text-[10px] text-gray-400">
                                <strong>Standard API:</strong> Used for one-time Coin purchases and Marketplace sales.<br/>
                                <strong>Recurring API:</strong> Used for processing monthly Subscriptions via crypto.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Live Streaming */}
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                        <div className="p-2 bg-red-900/20 rounded-lg text-red-400"><Video size={20} /></div>
                        <h3 className="font-bold text-white text-lg">Live Streaming (RTMP/HLS)</h3>
                    </div>
                    <InputField 
                        label="Server URL (Ingest)" 
                        value={settings.liveStreaming.serverUrl} 
                        onChange={(v) => updateSection('liveStreaming', 'serverUrl', v)}
                        placeholder="rtmp://live.example.com/app"
                    />
                    <InputField 
                        label="Stream Key (Master)" 
                        type="password"
                        value={settings.liveStreaming.streamKey} 
                        onChange={(v) => updateSection('liveStreaming', 'streamKey', v)}
                        placeholder="live_key_..."
                    />
                </div>

                {/* 4. AI Integration */}
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                        <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400"><Cpu size={20} /></div>
                        <h3 className="font-bold text-white text-lg">AI & Machine Learning</h3>
                    </div>
                    <InputField 
                        label="Gemini API Key" 
                        type="password"
                        value={settings.ai.geminiKey} 
                        onChange={(v) => updateSection('ai', 'geminiKey', v)}
                        placeholder="AIza..."
                    />
                    <p className="text-xs text-gray-500 mt-2">Used for content moderation, tagging, and chat assistants.</p>
                </div>

                {/* 5. Storage */}
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                        <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400"><HardDrive size={20} /></div>
                        <h3 className="font-bold text-white text-lg">Cloud Storage (S3)</h3>
                    </div>
                    <InputField 
                        label="Bucket URL" 
                        value={settings.storage.bucketUrl} 
                        onChange={(v) => updateSection('storage', 'bucketUrl', v)}
                        placeholder="https://my-bucket.s3.region.amazonaws.com"
                    />
                    <InputField 
                        label="Access Key ID" 
                        value={settings.storage.accessKey} 
                        onChange={(v) => updateSection('storage', 'accessKey', v)}
                        placeholder="AKIA..."
                    />
                </div>
            </div>
        </div>
    );
}