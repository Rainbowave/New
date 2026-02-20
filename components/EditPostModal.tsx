
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Loader2, Image, FileText, ShoppingBag, BookOpen, Bold, Italic, Link as LinkIcon, Upload, Camera } from 'lucide-react';
import { db } from '../services/db';

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: any;
    onSave: () => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, post, onSave }) => {
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [price, setPrice] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [category, setCategory] = useState('');
    const [saving, setSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    
    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Blog Categories
    const availableCategories = db.getBlogCategories();

    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setCaption(post.content || post.description || ''); 
            setPrice(post.price || '');
            setTags(post.tags || []);
            setCategory(post.category || '');
            setPreviewImage(post.thumbnailUrl || post.url || post.image || '');
        }
    }, [post]);

    const handleSave = async () => {
        setSaving(true);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));
        
        const updates: any = {
            title,
            tags,
            thumbnailUrl: previewImage // In real app, upload file first if changed
        };
        
        // Map correct fields based on what the DB uses/Post type
        if (post.type === 'PRODUCT') {
            updates.title = title; // Products use title
            updates.price = price;
        } else if (post.type === 'RESOURCE') {
            updates.content = caption;
            updates.category = category;
        } else {
            updates.content = caption; // Most posts use content
        }

        db.updatePost(post.id, updates);
        setSaving(false);
        onSave();
        onClose();
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    // Rich Text Formatting
    const insertFormat = (startTag: string, endTag: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = caption.substring(start, end);
        const newText = caption.substring(0, start) + startTag + selectedText + endTag + caption.substring(end);
        
        setCaption(newText);
        
        // Restore selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + startTag.length, end + startTag.length);
        }, 0);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh] md:max-h-[85vh]">
                <div className="p-4 md:p-5 border-b border-dark-700 flex justify-between items-center bg-dark-900/50 rounded-t-2xl shrink-0">
                    <h3 className="font-black text-white text-base md:text-lg uppercase italic tracking-tighter flex items-center gap-2">
                        {post.type === 'PRODUCT' ? <ShoppingBag size={18} className="text-green-500" /> : 
                         post.type === 'COMIC' ? <BookOpen size={18} className="text-purple-500" /> :
                         <FileText size={18} className="text-brand-500" />}
                        Edit {post.type === 'RESOURCE' ? 'Blog Post' : 'Content'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    {/* Image Upload Area */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative w-full h-48 md:h-56 bg-dark-900 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden hover:border-brand-500/50 transition-colors"
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            accept="image/*"
                        />
                        {previewImage ? (
                            <>
                                <img src={previewImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" alt="Preview" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white font-bold text-xs flex items-center gap-2 border border-white/10">
                                        <Camera size={14} /> Change Image
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-gray-500">
                                <Image size={32} className="mb-2" />
                                <span className="text-xs font-bold uppercase tracking-widest">Upload Cover</span>
                            </div>
                        )}
                        <div className="absolute top-2 left-2 bg-dark-900/80 backdrop-blur px-2 py-1 rounded text-[9px] font-black text-white uppercase border border-white/10">
                            ID: {post.id}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Title</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none text-sm font-bold"
                            placeholder="Enter title..."
                        />
                    </div>

                    {post.type !== 'PRODUCT' && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase ml-1">
                                    {post.type === 'RESOURCE' ? 'Body / Content' : 'Caption'}
                                </label>
                                {/* Rich Text Toolbar */}
                                <div className="flex bg-dark-900 rounded-lg border border-dark-600 p-0.5">
                                    <button onClick={() => insertFormat('**', '**')} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Bold"><Bold size={12}/></button>
                                    <button onClick={() => insertFormat('_', '_')} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Italic"><Italic size={12}/></button>
                                    <button onClick={() => insertFormat('[', '](url)')} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Link"><LinkIcon size={12}/></button>
                                </div>
                            </div>
                            <textarea 
                                ref={textareaRef}
                                value={caption} 
                                onChange={(e) => setCaption(e.target.value)} 
                                className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-500 outline-none min-h-[140px] resize-y font-medium leading-relaxed"
                                placeholder="Write something..."
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {post.type === 'RESOURCE' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Category</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white text-sm font-bold focus:border-brand-500 outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {availableCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {post.type === 'PRODUCT' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Price (LSC)</label>
                                <input 
                                    type="text" 
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)} 
                                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white font-bold focus:border-brand-500 outline-none"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-2 bg-dark-900 rounded-xl border border-dark-600">
                            {tags.map((tag, idx) => (
                                <span key={idx} className="bg-brand-500/10 text-brand-500 px-2 py-1 rounded-lg text-[10px] font-black uppercase border border-brand-500/20 flex items-center gap-1">
                                    {tag}
                                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-white"><X size={10}/></button>
                                </span>
                            ))}
                            <input 
                                type="text" 
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                placeholder={tags.length === 0 ? "Add tags..." : ""}
                                className="bg-transparent text-white text-xs outline-none flex-1 min-w-[60px]"
                            />
                        </div>
                        <button onClick={handleAddTag} className="text-[10px] font-bold text-brand-500 uppercase hover:text-brand-400 ml-1">+ Add Tag manually</button>
                    </div>
                </div>

                <div className="p-5 border-t border-dark-700 bg-dark-900/50 rounded-b-2xl shrink-0">
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
