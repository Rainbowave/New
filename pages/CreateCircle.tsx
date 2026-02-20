
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Camera, Lock, Hash, Save, UploadCloud, 
    Users, ShieldCheck, CheckCircle, X, Loader2, Plus, 
    Search, UserPlus, Check, MapPin, Sparkles, Sliders
} from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/authService';

// Identity Config matching Register.tsx for consistent coloring (Sexuality Flags)
const IDENTITY_CONFIG: Record<string, { gradient: string, tags: string[], description: string }> = {
    'Gay': { gradient: 'from-teal-500 via-green-500 to-blue-500', tags: ['Gaymer', 'Men', 'Travel', 'Fashion', 'Bear', 'Twink'], description: 'Men loving Men' },
    'Lesbian': { gradient: 'from-orange-500 via-white to-pink-500', tags: ['WlW', 'Femme', 'Butch', 'Art', 'Cottagecore'], description: 'Women loving Women' },
    'Bisexual': { gradient: 'from-pink-500 via-purple-500 to-blue-500', tags: ['BiVibes', 'Fluid', 'Community', 'BothAnd'], description: 'Attracted to both' },
    'Pansexual': { gradient: 'from-pink-500 via-yellow-400 to-blue-400', tags: ['HeartsNotParts', 'AllLove', 'Soul'], description: 'Hearts not Parts' },
    'Transgender': { gradient: 'from-cyan-400 via-pink-400 to-white', tags: ['TransRights', 'Transition', 'SafeSpace', 'T4T'], description: 'Beautiful Soul' },
    'Queer': { gradient: 'from-purple-500 via-white to-purple-500', tags: ['QueerArt', 'Activism', 'History', 'Radical'], description: 'Undefined & Free' },
    'Non-binary': { gradient: 'from-yellow-400 via-white to-purple-500', tags: ['Enby', 'GenderQueer', 'TheyThem', 'Fluid'], description: 'Beyond Binary' },
    'All Welcome': { gradient: 'from-brand-500 to-purple-600', tags: ['Community', 'Friends', 'Social', 'Events', 'Party'], description: 'Open to All' }
};

const IDENTITIES = Object.keys(IDENTITY_CONFIG);

// Mock Followers
const MOCK_FOLLOWERS = [
    { id: '1', username: 'Sarah_Noir', avatar: 'https://picsum.photos/100/100?random=1', isSelected: false },
    { id: '2', username: 'GamerPro', avatar: 'https://picsum.photos/100/100?random=2', isSelected: false },
    { id: '3', username: 'Velvet_Vixen', avatar: 'https://picsum.photos/100/100?random=3', isSelected: false },
    { id: '4', username: 'Neon_Rider', avatar: 'https://picsum.photos/100/100?random=4', isSelected: false },
];

// Mock Nearby
const MOCK_NEARBY = [
    { id: 'n1', username: 'Local_Artist', avatar: 'https://picsum.photos/100/100?random=n1', distance: '0.5km' },
    { id: 'n2', username: 'Gym_Rat_99', avatar: 'https://picsum.photos/100/100?random=n2', distance: '1.2km' },
    { id: 'n3', username: 'CoffeeLover', avatar: 'https://picsum.photos/100/100?random=n3', distance: '2.0km' },
    { id: 'n4', username: 'City_Walker', avatar: 'https://picsum.photos/100/100?random=n4', distance: '3.5km' },
    { id: 'n5', username: 'Night_Owl', avatar: 'https://picsum.photos/100/100?random=n5', distance: '8.0km' },
];

export default function CreateCircle() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    
    // Core Data
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');
    
    // Identity (Multi Select)
    const [identities, setIdentities] = useState<string[]>(['All Welcome']);
    
    // Discovery
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    
    // Invites
    const [inviteSearch, setInviteSearch] = useState('');
    const [selectedInvites, setSelectedInvites] = useState<string[]>([]);
    const [inviteMode, setInviteMode] = useState<'followers' | 'nearby'>('followers');
    const [searchRadius, setSearchRadius] = useState(10); // km
    
    const [isPublishing, setIsPublishing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Derived Visuals based on Primary Identity
    const primaryIdentity = identities[0] || 'All Welcome';
    const activeGradient = IDENTITY_CONFIG[primaryIdentity]?.gradient || 'from-brand-500 to-purple-600';
    const suggestedTags = IDENTITY_CONFIG[primaryIdentity]?.tags || [];

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleAddTag = (t?: string) => {
        const val = t || tagInput.trim();
        if (val && !tags.includes(val)) {
            setTags([...tags, val]);
            if (!t) setTagInput('');
        }
    };

    const handleRemoveTag = (t: string) => {
        setTags(tags.filter(tag => tag !== t));
    };

    const toggleIdentity = (id: string) => {
        if (identities.includes(id)) {
            // Prevent removing the last identity
            if (identities.length > 1) {
                setIdentities(prev => prev.filter(i => i !== id));
            }
        } else {
            // Remove 'All Welcome' if specific identities selected, or vice versa if needed
            // For now, allow mixing
            setIdentities(prev => [...prev, id]);
        }
    };

    const toggleInvite = (userId: string) => {
        if (selectedInvites.includes(userId)) {
            setSelectedInvites(prev => prev.filter(id => id !== userId));
        } else {
            setSelectedInvites(prev => [...prev, userId]);
        }
    };

    const handlePublish = async () => {
        if (!title || !description) return;
        
        setIsPublishing(true);
        try {
            await new Promise(r => setTimeout(r, 1500));
            // In real app: upload cover, send data to API
            await api.post('/groups/create', {
                title,
                description,
                identities: identities, // Send array
                tags,
                invites: selectedInvites,
                owner: currentUser?.id
            });
            navigate('/intimacy');
        } catch (e) {
            alert('Failed to create circle');
        } finally {
            setIsPublishing(false);
        }
    };

    const displayedUsers = inviteMode === 'followers' 
        ? MOCK_FOLLOWERS 
        : MOCK_NEARBY.filter(u => parseFloat(u.distance) <= searchRadius);
        
    const filteredUsers = displayedUsers.filter(u => u.username.toLowerCase().includes(inviteSearch.toLowerCase()));

    return (
        <div className="min-h-screen bg-dark-900 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">Establish Circle</h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Create a new sanctuary node</p>
                    </div>
                </div>
                <button 
                    onClick={handlePublish}
                    disabled={isPublishing || !title}
                    className={`bg-gradient-to-r ${activeGradient} hover:opacity-90 disabled:opacity-50 text-white font-black py-2.5 px-6 rounded-lg text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all`}
                >
                    {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Initialize
                </button>
            </div>

            <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-8">
                
                {/* ROW 1: Visual (Left) & Core Details (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Visual Identity - Col 1 */}
                    <div className="lg:col-span-1 bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl h-full flex flex-col relative overflow-hidden group">
                        {/* Dynamic Background Glow based on Identity */}
                        <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${activeGradient}`}></div>
                        
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Camera size={16} className="text-white opacity-50" /> Circle Visual
                        </h3>
                        
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 w-full bg-dark-900 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-white/30 hover:bg-dark-900/80 transition-all relative group overflow-hidden min-h-[250px]"
                        >
                            <input type="file" ref={fileInputRef} onChange={handleCoverSelect} className="hidden" accept="image/*" />
                            
                            {coverPreview ? (
                                <>
                                    <img src={coverPreview} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="Cover" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="bg-black/60 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold text-white uppercase tracking-widest">Change Cover</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-3 text-gray-500 group-hover:text-white transition-colors">
                                    <div className={`p-4 bg-dark-800 rounded-full border border-white/5`}>
                                        <UploadCloud size={32} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload Banner</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Core Details - Col 2 & 3 */}
                    <div className="lg:col-span-2 bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl h-full relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${activeGradient}`}></div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Users size={16} className="text-white opacity-50" /> Core Details
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Circle Name</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Neon Nights Collective" 
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-5 py-4 text-white font-bold focus:border-white/30 outline-none transition-all placeholder:text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Manifesto / Description</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the vibe, rules, and purpose..." 
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-5 py-4 text-white font-medium focus:border-white/30 outline-none transition-all placeholder:text-gray-700 min-h-[160px] resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROW 2: Identity (Left) & Discovery Tags (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Identity - Multi Select */}
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                         <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${activeGradient}`}></div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-white opacity-50" /> Community Identity
                        </h3>
                        
                        <div className="mb-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 ml-1">Select all that apply</label>
                            <div className="flex flex-wrap gap-2">
                                {IDENTITIES.map(id => {
                                    const isActive = identities.includes(id);
                                    const gradient = IDENTITY_CONFIG[id]?.gradient || 'from-gray-500 to-gray-600';
                                    
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => toggleIdentity(id)}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all relative overflow-hidden group ${
                                                isActive
                                                ? 'border-transparent text-white shadow-lg scale-105' 
                                                : 'bg-dark-900 border-white/5 text-gray-500 hover:text-white hover:border-white/20'
                                            }`}
                                        >
                                            {isActive && <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-100 z-0`}></div>}
                                            <span className="relative z-10 flex items-center gap-2">
                                                {id}
                                                {isActive && <CheckCircle size={10} className="text-white" />}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Discovery Tags */}
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-1 h-full bg-gradient-to-b ${activeGradient}`}></div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Hash size={16} className="text-white opacity-50" /> Discovery Tags
                        </h3>
                        
                        {/* Suggested Tags based on Primary Identity */}
                        {suggestedTags.length > 0 && (
                            <div className="mb-4 bg-dark-900/50 p-3 rounded-xl border border-white/5">
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 block flex items-center gap-1">
                                    <Sparkles size={10} className="text-yellow-500"/> Suggested for {primaryIdentity}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedTags.map(st => (
                                        <button 
                                            key={st} 
                                            onClick={() => handleAddTag(st)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-dark-800 hover:bg-white/10 rounded-lg text-[9px] font-bold text-gray-300 hover:text-white transition-colors border border-white/10"
                                        >
                                            + {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="relative mb-3">
                            <input 
                                type="text" 
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                placeholder="Add custom keywords..." 
                                className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-3 text-sm text-white focus:border-white/30 outline-none placeholder:text-gray-700"
                            />
                            <button onClick={() => handleAddTag()} className="absolute right-2 top-2 p-1 bg-dark-800 rounded text-gray-400 hover:text-white"><Plus size={16}/></button>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[50px]">
                            {tags.map(t => (
                                <span key={t} className="px-3 py-1.5 bg-dark-900 rounded-md text-[10px] font-bold text-gray-300 uppercase flex items-center gap-2 border border-white/5">
                                    {t} <button onClick={() => handleRemoveTag(t)}><X size={10} className="hover:text-red-500"/></button>
                                </span>
                            ))}
                            {tags.length === 0 && <span className="text-[10px] text-gray-600 italic p-1">No tags added yet.</span>}
                        </div>
                    </div>
                </div>

                {/* ROW 3: Invite System */}
                <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${activeGradient}`}></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <UserPlus size={16} className="text-white opacity-50" /> Invite Members
                        </h3>
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                             {/* Invite Source Toggle */}
                             <div className="flex bg-dark-900 p-1 rounded-lg border border-white/5 self-start md:self-auto">
                                 <button 
                                    onClick={() => setInviteMode('followers')}
                                    className={`px-4 py-2 rounded text-[10px] font-bold uppercase transition-all ${inviteMode === 'followers' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                 >
                                     Followers
                                 </button>
                                 <button 
                                    onClick={() => setInviteMode('nearby')}
                                    className={`px-4 py-2 rounded text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${inviteMode === 'nearby' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                 >
                                     <MapPin size={10} /> Nearby
                                 </button>
                             </div>

                             {/* Nearby Controls */}
                             {inviteMode === 'nearby' && (
                                 <div className="flex items-center gap-3 bg-dark-900 p-2 rounded-lg border border-white/5 flex-1 md:flex-none">
                                     <Sliders size={14} className="text-gray-500 ml-1" />
                                     <input 
                                        type="range" 
                                        min="1" max="100" 
                                        value={searchRadius} 
                                        onChange={(e) => setSearchRadius(Number(e.target.value))}
                                        className="w-24 h-1.5 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-white"
                                     />
                                     <span className="text-[10px] font-bold text-white w-12 text-right">{searchRadius} km</span>
                                 </div>
                             )}

                             {/* Search Input */}
                             <div className="relative group flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={14} />
                                <input 
                                    type="text" 
                                    value={inviteSearch}
                                    onChange={(e) => setInviteSearch(e.target.value)}
                                    placeholder={inviteMode === 'followers' ? "Search followers..." : "Search nearby users..."} 
                                    className="w-full bg-dark-900 border border-white/10 rounded-full py-2.5 pl-9 pr-4 text-xs text-white focus:border-white/30 outline-none transition-all placeholder:text-gray-600 font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                        {filteredUsers.map(user => {
                            const isSelected = selectedInvites.includes(user.id);
                            return (
                                <div 
                                    key={user.id} 
                                    onClick={() => toggleInvite(user.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? `bg-brand-900/20 border-brand-500/50` : 'bg-dark-900 border-white/5 hover:border-white/20'}`}
                                >
                                    <img src={user.avatar} className="w-10 h-10 rounded-full border border-white/10" alt={user.username} />
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-brand-200' : 'text-gray-300'}`}>@{user.username}</h4>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                            {(user as any).distance ? <><MapPin size={8}/> {(user as any).distance}</> : 'Follower'}
                                        </p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-500 border-brand-500' : 'border-gray-600'}`}>
                                        {isSelected && <Check size={12} className="text-white" />}
                                    </div>
                                </div>
                            )
                        })}
                        {filteredUsers.length === 0 && (
                            <div className="col-span-full py-8 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">No users found.</div>
                        )}
                    </div>
                    
                    {selectedInvites.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-green-500">
                            <CheckCircle size={14} /> {selectedInvites.length} Invitations ready to send
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
