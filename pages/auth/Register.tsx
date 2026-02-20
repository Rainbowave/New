
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ChevronLeft, Loader2, Search, Globe } from 'lucide-react';
import { AgeGate } from '../../components/auth/AgeGate';
import { db } from '../../services/db';

type RegisterStep = 'age' | 'region' | 'basics' | 'identity' | 'sexuality' | 'space' | 'interests';

const INTEREST_TAGS = ['Gaming', 'Digital Art', 'Cosplay', 'ASMR', 'Vlogging', 'Music', 'Fitness', 'Cooking', 'Tech', 'Comics', 'NSFW', 'Photography', 'Chatting', 'Alternative', 'Fashion', 'Anime', 'Manga', 'Roleplay', 'Writing', 'DIY', 'Beauty', 'Travel', 'Food', 'Movies'];

export default function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState<RegisterStep>('age');
    const [loading, setLoading] = useState(false);
    
    // Dynamic Settings
    const [genders, setGenders] = useState<any[]>([]);
    const [sexualities, setSexualities] = useState<any[]>([]);
    const [interests, setInterests] = useState<any[]>([]);
    const [availableRegions, setAvailableRegions] = useState<any[]>([]);

    const [interestSearch, setInterestSearch] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        displayName: '',
        email: '',
        password: '',
        birthDate: '',
        gender: '',
        sexuality: '',
        region: 'English (US)',
        space: 'dating',
        interests: [] as string[]
    });

    useEffect(() => {
        const settings = db.getSiteSettings();
        if (settings.agenda?.genders) setGenders(settings.agenda.genders);
        if (settings.agenda?.orientations) setSexualities(settings.agenda.orientations);
        if (settings.agenda?.interests) setInterests(settings.agenda.interests);
        // Default to English if no regions defined, otherwise load from DB
        setAvailableRegions(settings.agenda?.regions && settings.agenda.regions.length > 0 
            ? settings.agenda.regions 
            : [{ label: 'English (US)' }, { label: 'English (UK)' }]);
    }, []);

    const handleAgeVerify = (isVerified: boolean, birthDate: string) => {
        if (isVerified) {
            setFormData(prev => ({ ...prev, birthDate })); 
            setStep('region');
        }
    };

    const toggleInterest = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(tag) ? prev.interests.filter(t => t !== tag) : [...prev.interests, tag]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate default background based on sexuality for demo
            let bgUrl = '';
            if (formData.sexuality.toLowerCase().includes('gay')) bgUrl = 'https://placehold.co/1200x300/10b981/ffffff?text=Pride'; 
            else if (formData.sexuality.toLowerCase().includes('lesbian')) bgUrl = 'https://placehold.co/1200x300/db2777/ffffff?text=Pride'; 
            else bgUrl = ''; 

            const newUser = {
                username: formData.email.split('@')[0], 
                displayName: formData.displayName,
                email: formData.email,
                birthdate: formData.birthDate,
                gender: formData.gender,
                sexuality: formData.sexuality,
                region: formData.region,
                contentPreference: formData.space === 'adult' ? 'adult' : 'dating',
                tags: formData.interests,
                role: 'user',
                status: 'active',
                joinedAt: new Date().toISOString(),
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.displayName)}&background=a10a39&color=fff`,
                backgroundUrl: bgUrl, 
                walletBalance: 0,
                followers: 0,
                isVerified: false
            };
            db.createUser(newUser);
            navigate('/auth/login');
        } catch (err: any) {
            alert('Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepHeader = (title: string, subtitle: string) => (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500 text-center">
            <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter leading-none">{title}</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{subtitle}</p>
        </div>
    );

    const filteredInterests = interests.filter(i => i.label.toLowerCase().includes(interestSearch.toLowerCase()));

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
             {/* Static Background */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[url('https://picsum.photos/1920/1080?grayscale')] bg-cover opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-dark-900/80 to-dark-900 pointer-events-none"></div>

            <div className="w-full max-w-xl bg-dark-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in duration-500 relative z-30 pointer-events-auto">
                
                {/* Header: Branding (Top) */}
                <div className="w-full bg-black/40 relative flex items-center justify-between p-6 border-b border-white/5 overflow-hidden">
                    <div className="relative z-10 flex items-center gap-4">
                        <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-bold text-xl italic transition-transform group-hover:scale-105 shadow-lg">L</div>
                            <span className="text-xl font-bold text-white tracking-tighter uppercase italic">LuciSin</span>
                        </div>
                    </div>
                    
                    {step !== 'age' && (
                        <div className="relative z-10">
                            <div className="flex gap-1">
                                {['region', 'basics', 'identity', 'sexuality', 'space', 'interests'].map((s, i) => {
                                    const currentIndex = ['region', 'basics', 'identity', 'sexuality', 'space', 'interests'].indexOf(step);
                                    const isActive = i <= currentIndex;
                                    return (
                                        <div key={s} className={`w-4 h-1 rounded-full ${isActive ? 'bg-brand-500' : 'bg-dark-700'}`}></div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 md:p-10 relative">
                    {step !== 'age' && (
                        <button 
                            onClick={() => {
                                if (step === 'region') setStep('age');
                                if (step === 'basics') setStep('region');
                                if (step === 'identity') setStep('basics');
                                if (step === 'sexuality') setStep('identity');
                                if (step === 'space') setStep('sexuality');
                                if (step === 'interests') setStep('space');
                            }}
                            className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    {step === 'age' && <AgeGate onVerify={handleAgeVerify} />}

                    {step === 'region' && (
                        <div className="animate-in fade-in slide-in-from-right-2">
                             {renderStepHeader("Select Region", "Personalize your content feed")}
                             <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                 {availableRegions.map((reg: any, i: number) => {
                                     const isSelected = formData.region === reg.label;
                                     return (
                                         <button 
                                            key={i}
                                            onClick={() => setFormData({...formData, region: reg.label})}
                                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center group ${isSelected ? 'bg-brand-600 border-brand-500 text-white shadow-lg' : 'bg-dark-800 border-white/5 text-gray-400 hover:border-white/20 hover:text-white'}`}
                                         >
                                             <Globe size={24} className={isSelected ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'} />
                                             <span className="text-xs font-bold uppercase tracking-wide">{reg.label}</span>
                                         </button>
                                     )
                                 })}
                             </div>
                             <button 
                                onClick={() => setStep('basics')}
                                className="w-full bg-white text-black font-black py-4 rounded-lg mt-8 uppercase tracking-widest text-xs shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                            >
                                Continue <ArrowRight size={14} />
                            </button>
                        </div>
                    )}

                    {step === 'basics' && (
                        <div className="animate-in fade-in slide-in-from-right-2">
                            {renderStepHeader("Create Account", "Initialize your secure profile")}
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Display Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Alex Smith"
                                        value={formData.displayName}
                                        onChange={e => setFormData({...formData, displayName: e.target.value})}
                                        className="w-full bg-dark-800 border border-white/5 rounded-lg py-4 px-4 text-white text-sm font-bold focus:border-brand-500 outline-none transition-all placeholder:text-gray-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="you@domain.com"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-dark-800 border border-white/5 rounded-lg py-4 px-4 text-white text-sm font-bold focus:border-brand-500 outline-none transition-all placeholder:text-gray-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-dark-800 border border-white/5 rounded-lg py-4 px-4 text-white text-sm font-bold focus:border-brand-500 outline-none transition-all placeholder:text-gray-700"
                                    />
                                </div>
                                <button 
                                    onClick={() => setStep('identity')}
                                    disabled={!formData.email || !formData.password}
                                    className="w-full bg-white text-black font-black py-4 rounded-lg mt-4 uppercase tracking-widest text-xs shadow-lg hover:bg-gray-100 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Next Step <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'identity' && (
                        <div className="animate-in fade-in slide-in-from-right-2">
                            {renderStepHeader("True Identity", "How do you identify?")}
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-3">
                                    {genders.map((g: any) => {
                                        const isSelected = formData.gender === g.label;
                                        
                                        return (
                                            <div 
                                                key={g.id}
                                                onClick={() => setFormData({...formData, gender: g.label})}
                                                className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 group border-2 ${isSelected ? 'border-brand-500 bg-brand-900/10 scale-[1.02] shadow-xl' : 'border-white/5 bg-dark-800 hover:border-white/20'}`}
                                            >
                                                <div className="relative p-4 flex flex-col items-center justify-center text-center h-24">
                                                    {g.image ? <img src={g.image} alt={g.label} className="w-8 h-8 mb-2 object-contain" /> : <span className="text-xl mb-2">●</span>}
                                                    <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-white' : 'text-gray-400'}`}>{g.label}</span>
                                                </div>
                                                {isSelected && <div className="absolute top-2 right-2 text-brand-500"><CheckCircle size={14}/></div>}
                                            </div>
                                        );
                                    })}
                                </div>
                                <button onClick={() => setStep('sexuality')} disabled={!formData.gender} className="w-full bg-white text-black font-black py-4 rounded-lg mt-4 uppercase tracking-widest text-xs shadow-lg hover:bg-gray-100 disabled:opacity-50 active:scale-[0.98] transition-all">Next Step</button>
                            </div>
                        </div>
                    )}

                    {step === 'sexuality' && (
                        <div className="animate-in fade-in slide-in-from-right-2">
                            {renderStepHeader("Your Colors", "Express your flag")}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {sexualities.map((s: any) => {
                                        const isSelected = formData.sexuality === s.label;
                                        return (
                                            <button 
                                                key={s.id}
                                                onClick={() => setFormData({...formData, sexuality: s.label})}
                                                className={`relative overflow-hidden w-full h-16 rounded-xl transition-all duration-300 group border-2 text-left ${isSelected ? 'border-white scale-[1.02] shadow-xl ring-2 ring-brand-500/50' : 'border-transparent hover:scale-[1.01]'}`}
                                            >
                                                {s.image ? <img src={s.image} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={s.label} /> : <div className={`absolute inset-0 bg-dark-700 opacity-80 group-hover:opacity-100 transition-opacity`}></div>}
                                                <div className="absolute inset-0 flex items-center justify-between px-6 z-10 bg-black/20 group-hover:bg-black/10 transition-colors">
                                                    <div>
                                                        <span className="text-sm font-black text-white uppercase tracking-wider shadow-black drop-shadow-md block">{s.label}</span>
                                                        <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest drop-shadow-sm">{s.desc}</span>
                                                    </div>
                                                    {isSelected && <div className="bg-white text-black rounded-full p-1"><CheckCircle size={16}/></div>}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <button onClick={() => setStep('space')} disabled={!formData.sexuality} className="w-full bg-white text-black font-black py-4 rounded-lg mt-4 uppercase tracking-widest text-xs shadow-lg hover:bg-gray-100 disabled:opacity-50 active:scale-[0.98] transition-all">Continue</button>
                            </div>
                        </div>
                    )}

                    {step === 'space' && (
                        <div className="animate-in fade-in slide-in-from-right-2">
                            {renderStepHeader("Experience Mode", "Choose your vibe")}
                            <div className="space-y-4">
                                <button onClick={() => { setFormData({...formData, space: 'dating'}); setStep('interests'); }} className={`w-full bg-dark-800 border-2 p-6 rounded-xl flex flex-col gap-4 transition-all group text-left shadow-none ${formData.space === 'dating' ? 'border-brand-second bg-brand-second/5' : 'border-white/5 hover:border-brand-second/50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 bg-brand-second/10 rounded-lg flex items-center justify-center text-brand-second">❤️</div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-second px-2 py-1 bg-brand-second/5 rounded border border-brand-second/10 italic">Connection Hub</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white text-lg uppercase italic tracking-tighter">Dating Mode</h3>
                                        <p className="text-gray-400 text-xs leading-relaxed mt-1 font-medium">Verified profiles, safe interactions, and relationship-focused discovery.</p>
                                    </div>
                                </button>

                                <button onClick={() => { setFormData({...formData, space: 'adult'}); setStep('interests'); }} className={`w-full bg-dark-800 border-2 p-6 rounded-xl flex flex-col gap-4 transition-all group text-left shadow-none ${formData.space === 'adult' ? 'border-brand-500 bg-brand-500/5' : 'border-white/5 hover:border-brand-500/50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 bg-brand-500/10 rounded-lg flex items-center justify-center text-brand-500">🔥</div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-500 px-2 py-1 bg-brand-500/5 rounded border border-brand-500/10 italic">Premium Feed</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white text-lg uppercase italic tracking-tighter">Naughty Mode</h3>
                                        <p className="text-gray-400 text-xs leading-relaxed mt-1 font-medium">Unfiltered content, exclusive media, and privacy-first exploration.</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'interests' && (
                        <div className="animate-in fade-in slide-in-from-right-2">
                            {renderStepHeader("Interest Tags", "Personalize your feed")}
                            <div className="space-y-6">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input type="text" placeholder="Search interests..." value={interestSearch} onChange={(e) => setInterestSearch(e.target.value)} className="w-full bg-dark-800 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-white text-xs font-bold outline-none focus:border-brand-500 transition-all placeholder:text-gray-600" />
                                </div>

                                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                                    {filteredInterests.length > 0 ? filteredInterests.map(interest => (
                                        <button key={interest.id} onClick={() => toggleInterest(interest.label)} className={`relative h-20 rounded-lg overflow-hidden group border transition-all ${formData.interests.includes(interest.label) ? 'border-brand-500 ring-1 ring-brand-500' : 'border-white/5 hover:border-white/20'}`}>
                                            <img src={interest.image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt={interest.label} />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="text-xs font-black text-white uppercase tracking-wider text-center px-2">{interest.label}</span>
                                            </div>
                                            {formData.interests.includes(interest.label) && <div className="absolute top-1 right-1 text-brand-500 bg-white rounded-full"><CheckCircle size={12}/></div>}
                                        </button>
                                    )) : (
                                        INTEREST_TAGS.filter(t => t.toLowerCase().includes(interestSearch.toLowerCase())).map(tag => (
                                            <button key={tag} onClick={() => toggleInterest(tag)} className={`py-3 px-3 rounded-lg text-[9px] font-black border uppercase tracking-widest transition-all shadow-sm ${formData.interests.includes(tag) ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-800 border-white/5 text-gray-500 hover:text-white hover:border-white/20'}`}>
                                                #{tag}
                                            </button>
                                        ))
                                    )}
                                </div>

                                <button onClick={handleSubmit} disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-lg shadow-xl uppercase tracking-widest text-xs disabled:opacity-50 hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Complete Setup'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 text-center pt-6 border-t border-white/5">
                        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                            Already registered? <Link to="/auth/login" className="text-white hover:text-brand-500 ml-1 transition-colors">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
