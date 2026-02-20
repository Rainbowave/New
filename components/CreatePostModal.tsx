
import React, { useState, useRef, useEffect } from 'react';
import { 
    X, UploadCloud, Image as ImageIcon, Video, BookOpen, 
    BarChart2, PlusCircle, DollarSign,
    Target, Loader2, Sparkles,
    Ticket, MapPin, Hash, Trash2, Send, Lock,
    FileText, Smartphone, Film, Grid, Layout,
    Archive, Save, ChevronRight, Layers, Clock, List, Users, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { uploadService } from '../services/uploadService';
import { analyzeImageForTags } from '../services/geminiService';
import { db } from '../services/db'; 
import { UserRole } from '../types';

// Updated Post Types
export type PostType = 'POST' | 'PHOTO' | 'VIDEO' | 'SHORT' | 'COMIC' | 'COLLECTION' | 'RESOURCE' | 'POLL' | 'PRODUCT';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    userAvatar: string;
    userId: string;
    isPremium?: boolean;
    contentPreference?: string;
    initialType?: PostType;
    initialTags?: string[];
    initialMediaUrl?: string;
    context?: 'general' | 'intimacy';
    onSuccess?: () => void;
    variant?: 'modal' | 'inline' | 'page';
    userRole?: UserRole; 
}

interface UploadFile {
    id: string;
    file: File | null;
    preview: string;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    url?: string;
    tags: string[]; // Per-file tags
    title?: string; // Optional per-file title
}

interface ImageMarker {
    id: number;
    x: number;
    y: number;
    label: string;
}

interface PollOptionItem {
    id: string;
    text: string;
}

interface CurriculumItem {
    id: string;
    title: string;
    type: 'video' | 'article';
    duration: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
    isOpen, 
    onClose, 
    userAvatar, 
    userId, 
    initialType,
    initialTags,
    initialMediaUrl,
    context = 'general',
    onSuccess,
    userRole = 'user' 
}) => {
    const [postType, setPostType] = useState<PostType>(initialType || 'POST');
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [addToCollection, setAddToCollection] = useState(false);
    
    // Metadata (Global)
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState(''); 
    const [category, setCategory] = useState('');
    
    // Intimacy Circle Selection
    const [selectedCircle, setSelectedCircle] = useState('');
    
    // Tag Input State
    const [tagInput, setTagInput] = useState('');
    
    // Curriculum State (For Knowledge Book)
    const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const [newLessonType, setNewLessonType] = useState<'video' | 'article'>('video');
    const [newLessonDuration, setNewLessonDuration] = useState('');

    // Monetization & Access
    const [privacy, setPrivacy] = useState<'public' | 'subscribers' | 'unlock'>('public');
    const [price, setPrice] = useState(''); 
    
    // Ticket/Poll State
    const [showTicketConfig, setShowTicketConfig] = useState(false);
    const [ticketType, setTicketType] = useState<'standard' | 'ticket_pool'>('standard');
    const [ticketMode, setTicketMode] = useState<'text' | 'media' | 'interactive'>('text');
    const [ticketQuestion, setTicketQuestion] = useState('');
    const [ticketPrice, setTicketPrice] = useState('10');
    const [ticketOptions, setTicketOptions] = useState<PollOptionItem[]>([
        { id: '1', text: '' },
        { id: '2', text: '' }
    ]);
    const [markers, setMarkers] = useState<ImageMarker[]>([]);

    const [isUploading, setIsUploading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [draftCount, setDraftCount] = useState(3);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const canMonetize = userRole !== 'user'; 

    const CONTENT_MENU = [
        { id: 'POST', label: 'STANDARD POST', icon: FileText },
        { id: 'PHOTO', label: 'PHOTO SET', icon: ImageIcon },
        { id: 'VIDEO', label: 'VIDEO', icon: Film },
        { id: 'SHORT', label: 'SHORTS', icon: Smartphone },
        { id: 'COMIC', label: 'COMIC STRIP', icon: BookOpen },
        { id: 'COLLECTION', label: 'COLLECTION', icon: PlusCircle },
        { id: 'RESOURCE', label: 'KNOWLEDGE BOOK', icon: FileText },
    ];
    
    // Mock Circles for selection
    const availableCircles = [
        { id: 'c1', name: 'Neon Nights' },
        { id: 'c2', name: 'Creators Hub' },
        { id: 'c3', name: 'VIP Lounge' },
        { id: 'c4', name: 'Close Friends' }
    ];

    // Initialize State
    useEffect(() => {
        if (isOpen) {
            setPostType(initialType || 'POST');
            setAddToCollection(false);
            
            if (initialType === 'POLL') {
                setShowTicketConfig(true);
            } else {
                setShowTicketConfig(false);
            }
            
            if (initialMediaUrl) {
                setFiles([{
                    id: 'prefilled-media',
                    file: null,
                    preview: initialMediaUrl,
                    progress: 100,
                    status: 'completed',
                    tags: initialTags || []
                }]);
                setActiveFileIndex(0);
            } else {
                setFiles([]);
            }
            
            // Default circle selection if in intimacy mode
            if (context === 'intimacy' && availableCircles.length > 0) {
                setSelectedCircle(availableCircles[0].id);
                setPrivacy('subscribers'); // Default to restricted for intimacy
            }
        }
    }, [isOpen, initialType, initialTags, initialMediaUrl, context]);

    const handleClose = () => {
        if (isUploading || isPublishing) {
            if (!window.confirm("Upload in progress. Are you sure you want to cancel?")) return;
        }
        onClose();
    };

    // --- AI TAGS ---
    const handleAiTags = async (mode: 'single' | 'all') => {
        if (files.length === 0) return;
        
        setIsGeneratingAi(true);
        try {
            if (mode === 'single') {
                // Tag active file only
                const activeFile = files[activeFileIndex];
                if (!activeFile.file) return;

                const generatedTags = await analyzeImageForTags(activeFile.file);
                const finalTags = generatedTags.length > 0 ? generatedTags : ['Trending', 'Viral', 'New', postType];
                
                const updatedFiles = [...files];
                updatedFiles[activeFileIndex].tags = [...new Set([...updatedFiles[activeFileIndex].tags, ...finalTags])];
                setFiles(updatedFiles);

            } else {
                // Batch Tag All Files
                const updatedFiles = [...files];
                // Process sequentially to simulate processing and avoid rate limits in mock
                for (let i = 0; i < updatedFiles.length; i++) {
                    if (updatedFiles[i].file) {
                        const generatedTags = await analyzeImageForTags(updatedFiles[i].file!);
                        const finalTags = generatedTags.length > 0 ? generatedTags : ['Trending', 'Viral', 'Collection'];
                        updatedFiles[i].tags = [...new Set([...updatedFiles[i].tags, ...finalTags])];
                    }
                }
                setFiles(updatedFiles);
            }

        } catch (e) {
            console.error("AI Tag Error", e);
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim()) {
            const newTag = tagInput.trim();
            if (files.length > 0) {
                const updatedFiles = [...files];
                if (!updatedFiles[activeFileIndex].tags.includes(newTag)) {
                    updatedFiles[activeFileIndex].tags = [...updatedFiles[activeFileIndex].tags, newTag];
                    setFiles(updatedFiles);
                }
            }
            setTagInput('');
        }
    };
    
    const removeTag = (tag: string) => {
        if (files.length > 0) {
            const updatedFiles = [...files];
            updatedFiles[activeFileIndex].tags = updatedFiles[activeFileIndex].tags.filter(t => t !== tag);
            setFiles(updatedFiles);
        }
    };

    // --- CURRICULUM HANDLERS ---
    const handleAddLesson = () => {
        if (!newLessonTitle) return;
        const newItem: CurriculumItem = {
            id: Date.now().toString(),
            title: newLessonTitle,
            type: newLessonType,
            duration: newLessonDuration || '5 min'
        };
        setCurriculum([...curriculum, newItem]);
        setNewLessonTitle('');
        setNewLessonDuration('');
    };

    const removeLesson = (id: string) => {
        setCurriculum(curriculum.filter(c => c.id !== id));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const newFiles = Array.from(e.target.files).map((file: File) => ({
                id: Date.now().toString() + Math.random(),
                file: file,
                preview: URL.createObjectURL(file),
                progress: 0,
                status: 'completed' as const,
                tags: []
            }));
            
            if (postType === 'COLLECTION' || postType === 'COMIC' || addToCollection) {
                setFiles(prev => [...prev, ...newFiles]);
            } else {
                setFiles(newFiles.slice(0, 1)); // Replace if single mode
                setActiveFileIndex(0);
            }
        }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            await new Promise(r => setTimeout(r, 1200)); 
            
            const newPost = {
                type: postType,
                title: title || 'Untitled',
                content: caption,
                category,
                price: privacy === 'unlock' ? price : undefined,
                privacy,
                userId: userId,
                media: files.map(f => ({
                    url: f.preview,
                    tags: f.tags,
                    type: f.file?.type.startsWith('video') ? 'video' : 'image'
                })),
                thumbnailUrl: files[0]?.preview, 
                pollData: showTicketConfig ? {
                    question: ticketQuestion || title,
                    type: ticketType,
                    mode: ticketMode,
                    ticketPrice: ticketType === 'ticket_pool' ? ticketPrice : undefined,
                    options: ticketOptions.map(o => ({ id: o.id, label: o.text, votes: 0 })),
                } : undefined,
                curriculum: postType === 'RESOURCE' ? curriculum : undefined,
                circleId: context === 'intimacy' ? selectedCircle : undefined
            };

            db.createPost(newPost);
            if (onSuccess) onSuccess();
            handleClose();
        } catch (e) {
            alert("Failed to publish.");
        } finally {
            setIsPublishing(false);
        }
    };

    if (!isOpen) return null;

    const isMultiFile = postType === 'COLLECTION' || postType === 'COMIC' || addToCollection;
    const activeFile = files[activeFileIndex];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-[#0f0f11] w-full max-w-5xl h-[85vh] rounded-2xl flex overflow-hidden shadow-2xl border border-white/5 relative">
                
                {/* LEFT SIDEBAR - Content Type */}
                <div className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Content Type</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4">
                        {CONTENT_MENU.map((item) => {
                            const isActive = postType === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setPostType(item.id as PostType);
                                        setShowTicketConfig(false);
                                        setFiles([]);
                                        setCurriculum([]);
                                    }}
                                    className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all relative ${
                                        isActive 
                                        ? 'bg-brand-600 text-white' 
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <item.icon size={16} />
                                    {item.label}
                                    {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white"></div>}
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Drafts Section */}
                    <div className="p-6 border-t border-white/5">
                        <button className="flex items-center justify-between w-full text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                            <span className="flex items-center gap-2"><Archive size={14}/> Drafts</span>
                            <span className="bg-white/10 text-white px-2 py-0.5 rounded">{draftCount}</span>
                        </button>
                    </div>
                </div>

                {/* RIGHT MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-[#0f0f11] min-w-0">
                    
                    {/* Header with Close */}
                    <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0">
                        <h2 className="text-lg font-black text-white uppercase italic tracking-tighter">
                            {context === 'intimacy' ? 'New Circle Post' : `Create ${postType}`}
                        </h2>
                        <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Form Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        
                        {/* Intimacy Circle Selection */}
                        {context === 'intimacy' && (
                            <div className="bg-brand-900/10 border border-brand-500/30 rounded-xl p-6 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                                    <Users size={14} /> Select Circle
                                </label>
                                <div className="relative">
                                    <select 
                                        value={selectedCircle}
                                        onChange={(e) => setSelectedCircle(e.target.value)}
                                        className="w-full bg-dark-900 border border-brand-500/20 rounded-xl px-4 py-3 text-white text-sm font-bold focus:border-brand-500 outline-none appearance-none"
                                    >
                                        {availableCircles.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                </div>
                                <p className="text-[9px] text-gray-500 mt-2 font-bold uppercase tracking-widest">
                                    This content will be exclusive to members of the selected circle.
                                </p>
                            </div>
                        )}

                        {/* 1. Media Upload Section */}
                        <div>
                             <div className="flex justify-between items-center mb-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Content Media</label>
                                {['PHOTO', 'VIDEO', 'SHORT'].includes(postType) && (
                                    <button 
                                        onClick={() => setAddToCollection(!addToCollection)}
                                        className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all flex items-center gap-1 ${addToCollection ? 'bg-brand-500 text-white border-brand-500' : 'text-gray-500 border-white/10 hover:text-white'}`}
                                    >
                                        <Layers size={10} /> Add to Collection
                                    </button>
                                )}
                             </div>

                             {files.length === 0 ? (
                                 // Empty State
                                 <div 
                                    className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-white/5 transition-all relative overflow-hidden group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple={isMultiFile} />
                                    <UploadCloud size={24} className="text-gray-600 mb-2 group-hover:text-white transition-colors" />
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Click to Upload</span>
                                 </div>
                             ) : (
                                 // Filled State
                                 <div className="flex flex-col gap-4 animate-in fade-in">
                                     {/* Large Preview of Active File */}
                                     <div className="w-full aspect-video bg-black rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center group">
                                         <img 
                                            src={files[activeFileIndex].preview} 
                                            className="w-full h-full object-contain" 
                                            alt="Preview" 
                                         />
                                         <div className="absolute top-2 right-2 flex gap-2">
                                             <button 
                                                onClick={() => {
                                                    const newFiles = files.filter((_, i) => i !== activeFileIndex);
                                                    setFiles(newFiles);
                                                    if(activeFileIndex >= newFiles.length) setActiveFileIndex(Math.max(0, newFiles.length - 1));
                                                }}
                                                className="p-2 bg-black/60 rounded-full text-red-500 hover:bg-white transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                         </div>
                                     </div>

                                     {/* Thumbnails Row */}
                                     <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                         {files.map((file, idx) => (
                                             <div 
                                                key={file.id} 
                                                onClick={() => setActiveFileIndex(idx)}
                                                className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${idx === activeFileIndex ? 'border-brand-500 opacity-100' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                                             >
                                                 <img src={file.preview} className="w-full h-full object-cover" alt="thumb" />
                                             </div>
                                         ))}
                                         {/* Add More Button */}
                                         {isMultiFile && (
                                             <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-16 h-16 shrink-0 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-brand-500 hover:text-white text-gray-600 transition-colors"
                                             >
                                                 <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
                                                 <PlusCircle size={20} />
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             )}
                        </div>

                        {/* 2. Metadata Inputs */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Title</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter title..." 
                                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-4 text-white text-sm font-bold focus:border-brand-500 outline-none transition-all placeholder:text-gray-700"
                                />
                            </div>

                            {/* Knowledge Book: Curriculum Builder */}
                            {postType === 'RESOURCE' && (
                                <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <BookOpen size={14} className="text-brand-500" /> Course Curriculum
                                    </h3>
                                    
                                    {/* List Existing Lessons */}
                                    <div className="space-y-2 mb-4">
                                        {curriculum.map((item, i) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-500 text-[10px] font-black">{i + 1}</span>
                                                    <div>
                                                        <div className="text-xs font-bold text-white">{item.title}</div>
                                                        <div className="text-[9px] text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                                            <span>{item.type}</span>
                                                            <span>•</span>
                                                            <span>{item.duration}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeLesson(item.id)} className="text-gray-600 hover:text-red-500">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {curriculum.length === 0 && <p className="text-[10px] text-gray-600 italic">No lessons added yet.</p>}
                                    </div>

                                    {/* Add New Lesson */}
                                    <div className="grid grid-cols-12 gap-3 items-end">
                                        <div className="col-span-6">
                                            <label className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Title</label>
                                            <input 
                                                type="text" 
                                                value={newLessonTitle}
                                                onChange={(e) => setNewLessonTitle(e.target.value)}
                                                className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-white focus:border-brand-500 outline-none"
                                                placeholder="Lesson Name"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                             <label className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Type</label>
                                             <select 
                                                value={newLessonType}
                                                onChange={(e) => setNewLessonType(e.target.value as any)}
                                                className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-white focus:border-brand-500 outline-none"
                                             >
                                                 <option value="video">Video</option>
                                                 <option value="article">Article</option>
                                             </select>
                                        </div>
                                        <div className="col-span-2">
                                             <label className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Time</label>
                                             <input 
                                                type="text" 
                                                value={newLessonDuration}
                                                onChange={(e) => setNewLessonDuration(e.target.value)}
                                                className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-white focus:border-brand-500 outline-none"
                                                placeholder="5m"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <button 
                                                onClick={handleAddLesson}
                                                disabled={!newLessonTitle}
                                                className="w-full h-[34px] bg-brand-600 hover:bg-brand-500 text-white rounded-lg flex items-center justify-center disabled:opacity-50"
                                            >
                                                <PlusCircle size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Caption</label>
                                <textarea 
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Write something..." 
                                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-4 text-white text-sm font-medium focus:border-brand-500 outline-none transition-all placeholder:text-gray-700 resize-none h-32"
                                />
                            </div>

                            {/* Tags Section */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        Tags {files.length > 1 ? `(Image ${activeFileIndex + 1})` : ''}
                                    </label>
                                    
                                    <div className="flex gap-2">
                                        {files.length > 0 && (
                                            <button onClick={() => handleAiTags('single')} disabled={isGeneratingAi} className="text-[9px] font-black text-brand-500 uppercase tracking-widest flex items-center gap-1 hover:text-white px-2 py-1 rounded bg-brand-500/10 border border-brand-500/20">
                                                {isGeneratingAi ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} AI Tag
                                            </button>
                                        )}
                                        {files.length > 1 && (
                                            <button onClick={() => handleAiTags('all')} disabled={isGeneratingAi} className="text-[9px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-1 hover:text-white px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20">
                                                {isGeneratingAi ? <Loader2 size={10} className="animate-spin"/> : <Layers size={10}/>} Tag All
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 p-2 bg-[#1a1a1a] border border-white/5 rounded-xl min-h-[50px]">
                                    {activeFile && activeFile.tags.map(t => (
                                        <span key={t} className="bg-brand-500/10 text-brand-500 border border-brand-500/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-2">
                                            {t} <button onClick={() => removeTag(t)}><X size={10}/></button>
                                        </span>
                                    ))}
                                    <input 
                                        type="text" 
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                        placeholder={activeFile ? "Add tag..." : "Upload media to tag"}
                                        disabled={!activeFile}
                                        className="bg-transparent text-sm text-white outline-none flex-1 min-w-[80px] px-2 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Ticket / Poll Config */}
                        {showTicketConfig && (
                             <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 space-y-6 relative overflow-hidden animate-in slide-in-from-top-2">
                                 <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                                 <div className="flex justify-between items-center">
                                     <h3 className="text-sm font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                                         <Ticket size={16} className="text-brand-500"/> Ticket Configuration
                                     </h3>
                                     <button onClick={() => setShowTicketConfig(false)} className="text-gray-500 hover:text-white"><X size={16}/></button>
                                 </div>
                                 
                                 <input 
                                    type="text" 
                                    value={ticketQuestion}
                                    onChange={(e) => setTicketQuestion(e.target.value)}
                                    placeholder="Ticket Question..." 
                                    className="w-full bg-black border border-white/5 rounded-lg p-3 text-white text-sm font-bold outline-none focus:border-brand-500"
                                />
                                {ticketMode !== 'interactive' && (
                                    <div className="space-y-3">
                                        {ticketOptions.map((opt, i) => (
                                            <div key={opt.id} className="flex gap-2">
                                                <span className="text-gray-600 font-bold text-xs py-3">{i+1}.</span>
                                                <input 
                                                    type="text" 
                                                    value={opt.text}
                                                    onChange={(e) => {
                                                        const newOpts = [...ticketOptions];
                                                        newOpts[i].text = e.target.value;
                                                        setTicketOptions(newOpts);
                                                    }}
                                                    placeholder={`Option ${i+1}`}
                                                    className="flex-1 bg-black border border-white/5 rounded-lg p-3 text-xs text-white focus:border-white/20 outline-none"
                                                />
                                            </div>
                                        ))}
                                        <button onClick={() => setTicketOptions([...ticketOptions, { id: Date.now().toString(), text: '' }])} className="text-[9px] font-black text-brand-500 uppercase tracking-widest hover:text-white">+ Add Option</button>
                                    </div>
                                )}
                             </div>
                        )}

                        {/* Attach Ticket Button */}
                        {!showTicketConfig && (
                            <button 
                                onClick={() => setShowTicketConfig(true)}
                                className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest"
                            >
                                <BarChart2 size={16} /> Attach Ticket / Poll
                            </button>
                        )}

                        {/* Access Control - Hidden if Intimacy Context */}
                        {context !== 'intimacy' && (
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Access Control</label>
                                <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-white/5">
                                    <button onClick={() => setPrivacy('public')} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${privacy === 'public' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Public</button>
                                    <button onClick={() => setPrivacy('subscribers')} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${privacy === 'subscribers' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Subscribers</button>
                                    <button onClick={() => setPrivacy('unlock')} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${privacy === 'unlock' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Unlock</button>
                                </div>
                                {privacy === 'unlock' && (
                                    <div className="mt-4 relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input 
                                            type="number" 
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Set Price (LSC)" 
                                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white text-sm font-bold focus:border-yellow-500 outline-none transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    {/* Footer Actions */}
                    <div className="h-24 bg-[#0f0f11] border-t border-white/5 px-8 flex items-center justify-between shrink-0">
                         <button className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                             <Save size={14} /> Save Draft
                         </button>
                         <button 
                            onClick={handlePublish}
                            disabled={isPublishing || (!title && !ticketQuestion && files.length === 0)}
                            className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-900/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            {context === 'intimacy' ? 'Share to Circle' : 'Publish Content'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
