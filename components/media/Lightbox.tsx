
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn, ZoomOut, Maximize, RotateCcw, Move } from 'lucide-react';

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    src: string;
    alt?: string;
    onNext?: () => void;
    onPrev?: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, onClose, src, alt, onNext, onPrev }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setPosition({ x: 0, y: 0 });
        }
    }, [isOpen, src]);

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    // Prevent closing when clicking controls
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-200"
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onClick={onClose}
        >
            {/* Top Toolbar */}
            <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-end px-6 bg-gradient-to-b from-black/80 to-transparent z-50">
                <div className="flex items-center gap-2" onClick={stopPropagation}>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Download Original">
                        <Download size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Share Content">
                        <Share2 size={20} />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-2" />
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Navigation Controls */}
            {onPrev && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-6 p-4 text-white hover:bg-white/10 rounded-full transition-all z-40 hidden md:block"
                >
                    <ChevronLeft size={48} strokeWidth={1} />
                </button>
            )}
            {onNext && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-6 p-4 text-white hover:bg-white/10 rounded-full transition-all z-40 hidden md:block"
                >
                    <ChevronRight size={48} strokeWidth={1} />
                </button>
            )}

            {/* Main Viewport - Scaling disabled per request */}
            <div 
                ref={containerRef}
                className={`w-full h-full flex items-center justify-center overflow-hidden touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
            >
                <img 
                    src={src} 
                    alt={alt || "Lightbox Content"} 
                    className="max-w-full max-h-[90vh] object-contain shadow-2xl transition-transform duration-200 ease-out select-none cursor-default pointer-events-none"
                    style={{ 
                        transform: `translate(${position.x}px, ${position.y}px)`,
                    }}
                />
            </div>

            {/* Bottom Actions */}
            <div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50 p-6 bg-dark-900/40 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl min-w-[200px]"
                onClick={stopPropagation}
            >
                <div className="flex gap-4 w-full">
                    <button 
                        onClick={handleReset}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-6 rounded-xl bg-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                    >
                        <RotateCcw size={14} /> Reset View
                    </button>
                </div>
            </div>
        </div>
    );
};
