
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Heart, MessageCircle, Settings, ZoomIn, ZoomOut, DollarSign, Share2, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TipModal } from '../../components/TipModal';
import { Watermark } from '../../components/Shared';

const mockPanels = [
    'https://picsum.photos/800/1200?random=1',
    'https://picsum.photos/800/1200?random=2',
    'https://picsum.photos/800/1200?random=3',
    'https://picsum.photos/800/1200?random=4',
    'https://picsum.photos/800/1200?random=5',
];

const mockCreator = {
    id: 'u_comic_artist',
    name: 'Nick Dragotta',
    avatar: 'https://picsum.photos/100/100?random=88',
    handle: '@dragotta'
};

export default function ComicReader() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoom, setZoom] = useState(1);
    
    // Hover Zoom State
    const [isHovering, setIsHovering] = useState(false);
    const [transformOrigin, setTransformOrigin] = useState('center center');
    
    // Sidebar State
    const [isTipOpen, setIsTipOpen] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [comments, setComments] = useState([
        { id: 1, user: 'ReaderOne', text: 'This panel is intense!', time: '2m' },
        { id: 2, user: 'MangaFan', text: 'The art style changed here?', time: '5m' },
        { id: 3, user: 'ProCritic', text: 'Great pacing in this chapter.', time: '10m' },
        { id: 4, user: 'Newbie', text: 'Wait, who is that character?', time: '12m' },
    ]);

    // Keyboard Nav
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextPanel();
            if (e.key === 'ArrowLeft') prevPanel();
            if (e.key === 'Escape') navigate(-1);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [currentIndex]);

    const nextPanel = () => {
        if (currentIndex < mockPanels.length - 1) {
            setCurrentIndex(p => p + 1);
        }
    };

    const prevPanel = () => {
        if (currentIndex > 0) {
            setCurrentIndex(p => p - 1);
        }
    };

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput.trim()) return;
        setComments([...comments, { id: Date.now(), user: 'You', text: commentInput, time: 'Just now' }]);
        setCommentInput('');
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setTransformOrigin(`${x}% ${y}%`);
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setTransformOrigin('center center');
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex animate-in fade-in duration-200">
            <TipModal isOpen={isTipOpen} onClose={() => setIsTipOpen(false)} creatorName={mockCreator.name} />

            {/* LEFT COLUMN: Exit & Ads */}
            <div 
                className="hidden xl:flex w-80 flex-col p-6 border-r border-dark-800 bg-[#0a0a0a] cursor-pointer"
                onClick={() => navigate(-1)}
            >
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
                    <div className="p-2 bg-dark-800 rounded-full"><ChevronLeft size={20} /></div>
                    <span className="font-bold text-sm">Exit Reader</span>
                </button>

                <div className="flex-1 flex flex-col justify-center gap-6" onClick={(e) => e.stopPropagation()}>
                    {/* Top Ad */}
                    <div className="w-full aspect-[4/3] bg-dark-900 rounded-xl border border-dark-800 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                            <span className="text-dark-700 font-black text-xl uppercase opacity-50 tracking-widest">Ad Space</span>
                        </div>
                        <img src={`https://picsum.photos/300/250?random=comic_ad1`} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" alt="Ad" />
                        <div className="absolute top-2 right-2 bg-black/50 text-[10px] text-white px-1.5 py-0.5 rounded">Ad</div>
                    </div>

                    {/* Bottom Ad */}
                    <div className="w-full aspect-[4/5] bg-dark-900 rounded-xl border border-dark-800 flex items-center justify-center relative overflow-hidden group">
                         <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                            <span className="text-dark-700 font-black text-xl uppercase opacity-50 tracking-widest">Ad Space</span>
                        </div>
                        <img src={`https://picsum.photos/300/400?random=comic_ad2`} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" alt="Ad" />
                        <div className="absolute top-2 right-2 bg-black/50 text-[10px] text-white px-1.5 py-0.5 rounded">Ad</div>
                    </div>
                </div>
            </div>

            {/* CENTER COLUMN: Comic Panel */}
            <div className="flex-1 relative bg-[#121212] flex flex-col h-full">
                <Watermark />
                
                {/* Mobile Header */}
                <div className="xl:hidden absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-20">
                    <button onClick={() => navigate(-1)} className="p-2 bg-black/50 rounded-full text-white"><X size={20}/></button>
                    <span className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded-full">{currentIndex + 1} / {mockPanels.length}</span>
                </div>

                <div className="flex-1 flex items-center justify-center relative overflow-hidden" onClick={() => navigate(-1)}>
                    {/* Click Zones for Navigation */}
                    <div className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-w-resize" onClick={(e) => { e.stopPropagation(); prevPanel(); }} />
                    <div className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-e-resize" onClick={(e) => { e.stopPropagation(); nextPanel(); }} />
                    
                    <img 
                        src={mockPanels[currentIndex]} 
                        alt={`Page ${currentIndex + 1}`}
                        className="max-h-full max-w-full object-contain shadow-2xl transition-transform duration-200 ease-out select-none cursor-zoom-in"
                        style={{ 
                            transformOrigin: transformOrigin,
                            transform: isHovering ? `scale(2)` : `scale(${zoom})` 
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    />
                </div>

                {/* Bottom Controls */}
                <div className="h-16 bg-dark-900 border-t border-dark-800 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={prevPanel} disabled={currentIndex === 0} className="p-2 hover:bg-dark-800 rounded-lg text-gray-400 hover:text-white disabled:opacity-30"><ChevronLeft size={20} /></button>
                        <span className="text-sm font-mono text-gray-400">{currentIndex + 1} / {mockPanels.length}</span>
                        <button onClick={nextPanel} disabled={currentIndex === mockPanels.length - 1} className="p-2 hover:bg-dark-800 rounded-lg text-gray-400 hover:text-white disabled:opacity-30"><ChevronRight size={20} /></button>
                    </div>
                    
                    <div className="flex gap-2">
                        <button onClick={() => setZoom(z => Math.max(1, z - 0.2))} className="p-2 hover:bg-dark-800 rounded-lg text-gray-400"><ZoomOut size={18} /></button>
                        <button onClick={() => setZoom(1)} className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-white">Reset</button>
                        <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 hover:bg-dark-800 rounded-lg text-gray-400"><ZoomIn size={18} /></button>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Sidebar */}
            <div className="hidden lg:flex w-96 bg-dark-900 border-l border-dark-800 flex-col shrink-0 h-full relative z-20 shadow-2xl">
                {/* Header */}
                <div className="p-5 border-b border-dark-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <img src={mockCreator.avatar} className="w-10 h-10 rounded-full border border-dark-700" alt="Creator" />
                            <div>
                                <h3 className="font-bold text-white text-sm">{mockCreator.name}</h3>
                                <p className="text-xs text-gray-500">Creator</p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-dark-800 rounded-full text-gray-400 hover:text-white transition-colors"><Settings size={18} /></button>
                    </div>

                    <h1 className="font-bold text-white text-base mb-2">Absolute Batman #1</h1>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        The Dark Knight returns in this gritty reboot. 
                        <span className="text-brand-400 cursor-pointer hover:underline ml-1">#batman</span>
                        <span className="text-brand-400 cursor-pointer hover:underline ml-1">#dc</span>
                    </p>

                    <div className="flex items-center justify-between bg-dark-800/50 p-3 rounded-xl border border-dark-800">
                        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-500 transition-colors px-2">
                            <Heart size={20} />
                            <span className="text-[10px] font-bold">12K</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors px-2">
                            <MessageCircle size={20} />
                            <span className="text-[10px] font-bold">{comments.length}</span>
                        </button>
                        <button onClick={() => setIsTipOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-green-400 transition-colors px-2">
                            <DollarSign size={20} />
                            <span className="text-[10px] font-bold">Tip</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors px-2">
                            <Share2 size={20} />
                            <span className="text-[10px] font-bold">Share</span>
                        </button>
                    </div>
                </div>

                {/* Body: Comments */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discussion</h3>
                    {comments.map(c => (
                        <div key={c.id} className="flex gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                                {c.user[0]}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-sm font-bold text-gray-300">{c.user}</span>
                                    <span className="text-[10px] text-gray-600">{c.time}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer: Input */}
                <div className="p-4 border-t border-dark-800 bg-dark-900">
                    <form onSubmit={handleSendComment} className="relative">
                        <input 
                            type="text" 
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-dark-800 border border-dark-700 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                        />
                        <button 
                            type="submit"
                            disabled={!commentInput.trim()}
                            className="absolute right-2 top-2 p-1.5 bg-brand-600 text-white rounded-full hover:bg-brand-500 disabled:opacity-50 disabled:bg-dark-700 transition-all"
                        >
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
