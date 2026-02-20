
import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image, Tag, ChevronRight, Save, X, AlertCircle, Loader2, CheckCircle, FileText } from 'lucide-react';
import { uploadService } from '../../services/uploadService';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { authService } from '../../services/authService';

interface PanelFile {
    id: string;
    file: File;
    preview: string;
    url?: string; // Captured after "upload"
    title: string;
    tags: string;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

export default function ComicUpload() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const canMonetize = currentUser?.userSettings?.canMonetize ?? (currentUser?.role === 'creator' || currentUser?.role === 'admin');

    const [step, setStep] = useState(1);
    
    // Metadata State
    const [seriesTitle, setSeriesTitle] = useState('');
    const [description, setDescription] = useState('');
    const [episodeTitle, setEpisodeTitle] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');
    
    const [panels, setPanels] = useState<PanelFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    // Validation Constants
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    // Track all generated URLs for cleanup
    const urlRef = useRef<string[]>([]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            urlRef.current.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            urlRef.current.push(preview);
            setCoverFile(file);
            setCoverPreview(preview);
        }
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const newPanels: PanelFile[] = Array.from(files).map(file => {
            // Validation
            if (!ALLOWED_TYPES.includes(file.type)) {
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    preview: '',
                    title: file.name,
                    tags: '',
                    progress: 0,
                    status: 'error',
                    error: 'Invalid file type. Use JPG, PNG, or WEBP.'
                };
            }
            if (file.size > MAX_FILE_SIZE) {
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    preview: '',
                    title: file.name,
                    tags: '',
                    progress: 0,
                    status: 'error',
                    error: 'File too large. Max 10MB.'
                };
            }

            const previewUrl = URL.createObjectURL(file);
            urlRef.current.push(previewUrl);

            return {
                id: Math.random().toString(36).substr(2, 9),
                file,
                preview: previewUrl,
                title: file.name.split('.')[0], // Default title from filename
                tags: '',
                progress: 0,
                status: 'pending'
            };
        });

        setPanels(prev => [...prev, ...newPanels]);
    };

    const removePanel = (id: string) => {
        setPanels(prev => {
            const panelToRemove = prev.find(p => p.id === id);
            if (panelToRemove && panelToRemove.preview) {
                URL.revokeObjectURL(panelToRemove.preview);
                urlRef.current = urlRef.current.filter(u => u !== panelToRemove.preview);
            }
            return prev.filter(p => p.id !== id);
        });
    };

    const updatePanelData = (id: string, field: 'title' | 'tags', value: string) => {
        setPanels(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const uploadPanels = async () => {
        setIsUploading(true);
        
        const uploadPromises = panels.filter(p => p.status !== 'error' && p.status !== 'completed').map(async (panel) => {
            setPanels(prev => prev.map(p => p.id === panel.id ? { ...p, status: 'uploading' } : p));
            
            try {
                const finalUrl = await uploadService.uploadChunked(panel.file, (progress) => {
                    setPanels(prev => prev.map(p => p.id === panel.id ? { ...p, progress } : p));
                });
                setPanels(prev => prev.map(p => p.id === panel.id ? { ...p, status: 'completed', progress: 100, url: finalUrl } : p));
            } catch (error) {
                setPanels(prev => prev.map(p => p.id === panel.id ? { ...p, status: 'error', error: 'Upload failed' } : p));
            }
        });

        await Promise.all(uploadPromises);
        setIsUploading(false);
        setStep(3);
    };

    const handleFinish = async () => {
        if (!seriesTitle || !episodeTitle) {
            alert("Series and Episode titles are required.");
            return;
        }

        setIsPublishing(true);
        try {
            const comicData = {
                type: 'COMIC',
                title: seriesTitle,
                episodeTitle: episodeTitle,
                description: description,
                thumbnailUrl: coverPreview || panels[0]?.url || panels[0]?.preview,
                userId: currentUser?.id || '1001',
                panels: panels.map(p => ({
                    id: p.id,
                    url: p.url || p.preview,
                    title: p.title,
                    tags: p.tags.split(' ').filter(t => t.startsWith('#'))
                })),
                tags: ['#comic', '#sequential', '#art'],
                category: 'Fantasy', // Default or from state
                episodes: 1,
                heat: 0,
                views: 0
            };

            await api.post('/posts', comicData);
            alert("Comic Published Successfully!");
            navigate('/comics');
        } catch (error) {
            console.error("Publishing failed", error);
            alert("Upload failed during publication.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-white mb-8 italic uppercase tracking-tighter">Publish Comic</h1>
            
            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-dark-800 text-gray-500'}`}>1</div>
                <div className="h-1 flex-1 bg-dark-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-brand-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-dark-800 text-gray-500'}`}>2</div>
                <div className="h-1 flex-1 bg-dark-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-brand-600 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-brand-600 text-white' : 'bg-dark-800 text-gray-500'}`}>3</div>
            </div>

            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Series Title</label>
                            <input 
                                type="text" 
                                value={seriesTitle}
                                onChange={(e) => setSeriesTitle(e.target.value)}
                                placeholder="Enter series title" 
                                className="w-full bg-dark-900 border border-white/5 rounded-xl p-4 text-white focus:border-brand-500 outline-none transition-all font-bold" 
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Cover Image</label>
                                <div 
                                    onClick={() => coverInputRef.current?.click()}
                                    className="aspect-[3/4] bg-dark-900 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-brand-500 cursor-pointer transition-colors relative overflow-hidden group"
                                >
                                    <input type="file" ref={coverInputRef} onChange={handleCoverSelect} className="hidden" accept="image/*" />
                                    {coverPreview ? (
                                        <>
                                            <img src={coverPreview} className="w-full h-full object-cover" alt="Cover preview" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-xs font-bold uppercase tracking-widest">Change Cover</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Image size={32} className="mb-2 text-brand-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Upload Cover</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-full min-h-[200px] bg-dark-900 border border-white/5 rounded-xl p-4 text-white focus:border-brand-500 outline-none resize-none font-medium text-sm leading-relaxed" 
                                    placeholder="Tell the Pride about your story..."
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button 
                                onClick={() => setStep(2)} 
                                disabled={!seriesTitle}
                                className="bg-white text-black hover:bg-brand-500 hover:text-white font-black py-4 px-10 rounded-sm text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl disabled:opacity-30"
                            >
                                Next Step <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Episode Title</label>
                            <input 
                                type="text" 
                                value={episodeTitle}
                                onChange={(e) => setEpisodeTitle(e.target.value)}
                                placeholder="Ep. 1 - The Beginning" 
                                className="w-full bg-dark-900 border border-white/5 rounded-xl p-4 text-white focus:border-brand-500 outline-none transition-all font-bold" 
                            />
                        </div>
                        
                        {/* Drop Zone */}
                        <div 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-dark-900/50 hover:bg-dark-900 transition-colors cursor-pointer group"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={(e) => handleFiles(e.target.files)} 
                                className="hidden" 
                                multiple 
                                accept="image/jpeg,image/png,image/webp" 
                            />
                            <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/5">
                                <UploadCloud size={32} className="text-brand-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 uppercase italic">Upload Pages</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">Drag & drop panel images here. Max 10MB per file.</p>
                            <button className="bg-dark-800 hover:bg-white hover:text-black text-white font-black py-2 px-8 rounded-lg text-[10px] uppercase tracking-widest border border-white/10 transition-all">Select Files</button>
                        </div>

                        {/* File List */}
                        <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
                            {panels.map((panel, index) => (
                                <div key={panel.id} className="bg-dark-900 rounded-xl p-4 border border-white/5 flex gap-4 items-start animate-in slide-in-from-left-2 duration-300">
                                    <div className="w-20 h-20 bg-dark-800 rounded-lg overflow-hidden shrink-0 relative border border-white/10">
                                        {panel.preview ? (
                                            <img src={panel.preview} className="w-full h-full object-cover" alt="preview" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-red-500"><AlertCircle size={20} /></div>
                                        )}
                                        <div className="absolute top-1 left-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-black uppercase tracking-tighter">#{index + 1}</div>
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 mr-4">
                                                <input 
                                                    type="text" 
                                                    value={panel.title} 
                                                    onChange={(e) => updatePanelData(panel.id, 'title', e.target.value)}
                                                    className="w-full bg-transparent border-b border-white/5 focus:border-brand-500 outline-none text-sm text-white font-bold pb-1 mb-1 uppercase tracking-tight"
                                                    placeholder="Panel Title (Optional)"
                                                />
                                                {panel.status === 'error' ? (
                                                    <p className="text-[10px] text-red-400 font-bold uppercase mt-1">{panel.error}</p>
                                                ) : (
                                                    <div className="w-full h-1 bg-dark-700 rounded-full mt-2 overflow-hidden">
                                                        <div className={`h-full transition-all duration-300 ${panel.status === 'completed' ? 'bg-emerald-500' : 'bg-brand-500 animate-pulse'}`} style={{ width: `${panel.progress}%` }}></div>
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={() => removePanel(panel.id)} className="text-gray-600 hover:text-red-500 p-1 transition-colors">
                                                <X size={18} />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Tag size={12} className="text-brand-500" />
                                            <input 
                                                type="text" 
                                                value={panel.tags}
                                                onChange={(e) => updatePanelData(panel.id, 'tags', e.target.value)}
                                                placeholder="#action #shonen #pov" 
                                                className="w-full bg-transparent text-[10px] font-bold text-gray-500 uppercase tracking-widest outline-none placeholder:text-gray-700"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between pt-4 border-t border-white/5">
                            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white font-black uppercase text-[10px] tracking-widest">Back</button>
                            <button 
                                onClick={uploadPanels} 
                                disabled={panels.length === 0 || isUploading}
                                className="bg-brand-600 hover:bg-brand-500 disabled:opacity-30 text-white font-black py-4 px-12 rounded-sm text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all"
                            >
                                {isUploading ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16}/>}
                                {isUploading ? 'UPLOADING...' : `UPLOAD ${panels.length} PAGES`}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500/30 text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                <CheckCircle size={48} className="animate-bounce" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter leading-none">Upload Ready</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">All files successfully processed.</p>
                        </div>

                        <div className="bg-dark-900 rounded-xl p-8 border border-white/5 flex gap-8 shadow-inner items-center">
                            <div className="w-24 h-32 bg-dark-800 rounded-sm shrink-0 overflow-hidden border border-white/10 shadow-2xl transform -rotate-3">
                                <img src={coverPreview || panels[0]?.preview} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black text-white text-xl uppercase italic tracking-tighter mb-1">{seriesTitle}</h3>
                                <p className="text-[10px] text-brand-500 font-black uppercase tracking-widest">{episodeTitle}</p>
                                <div className="flex gap-2 mt-6">
                                    <span className="px-3 py-1 bg-white/5 rounded-sm text-[9px] font-black uppercase text-gray-400 border border-white/5 tracking-widest">Fantasy</span>
                                    <span className="px-3 py-1 bg-white/5 rounded-sm text-[9px] font-black uppercase text-gray-400 border border-white/5 tracking-widest">{panels.length} Panels</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-yellow-900/10 border border-yellow-500/10 rounded-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 border border-yellow-500/20"><Tag size={20} /></div>
                                <div>
                                    <h4 className="font-black text-yellow-500 text-xs uppercase tracking-widest mb-1 italic">Pricing Settings</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed">
                                        {canMonetize 
                                            ? "This episode will be available for public consumption at 0.00 LSC." 
                                            : "Standard Member: Free Content Only"}
                                    </p>
                                </div>
                            </div>
                            <button 
                                className={`text-[10px] font-black uppercase tracking-widest px-4 ${canMonetize ? 'text-yellow-500 hover:underline cursor-pointer' : 'text-gray-600 cursor-not-allowed opacity-50'}`}
                                disabled={!canMonetize}
                                title={!canMonetize ? "Upgrade to Creator to set prices" : ""}
                            >
                                Change
                            </button>
                        </div>

                        <div className="flex justify-between pt-8 border-t border-white/5">
                            <button onClick={() => setStep(2)} className="text-gray-500 hover:text-white font-black uppercase text-[10px] tracking-widest">Back</button>
                            <div className="flex gap-4">
                                <button className="bg-dark-700 hover:bg-dark-600 text-white font-black py-4 px-8 rounded-sm text-[10px] uppercase tracking-widest transition-all">Save Draft</button>
                                <button 
                                    onClick={handleFinish}
                                    disabled={isPublishing}
                                    className="bg-brand-600 hover:bg-brand-500 text-white font-black py-4 px-12 rounded-sm shadow-xl shadow-brand-900/30 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-[10px]"
                                >
                                    {isPublishing ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    {isPublishing ? 'PUBLISHING...' : 'PUBLISH COMIC'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-12 py-8 flex flex-col items-center opacity-10">
                <FileText size={18} className="mb-4 text-gray-600" />
                <span className="text-[7px] font-black text-white uppercase tracking-[1.5em]">Comic Upload Tool</span>
            </div>
        </div>
    );
}
