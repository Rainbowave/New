
import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../services/db';

interface ExoAdProps {
    zoneId?: string;
    className?: string;
}

export const ExoAd: React.FC<ExoAdProps> = ({ zoneId, className = '' }) => {
    const adRef = useRef<HTMLDivElement>(null);
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const settings = db.getApiSettings();
    
    // Determine mode and access deeply nested zone ID safely
    const mode = (settings.ads?.mode || 'SFW').toLowerCase(); 
    const adSettings = (settings.ads as any)?.[mode];
    const activeZoneId = zoneId || adSettings?.exoclick?.bannerZoneId || '123456';

    useEffect(() => {
        if (!adRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isAdLoaded) {
                    setIsAdLoaded(true);
                    console.log(`[ExoClick] Lazy Loaded Zone: ${activeZoneId} (In Viewport)`);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        observer.observe(adRef.current);

        return () => observer.disconnect();
    }, [activeZoneId, isAdLoaded]);

    return (
        <div className={`w-full flex justify-center items-center my-4 ${className}`}>
            <div ref={adRef} className="w-full max-w-[728px] min-h-[90px] bg-dark-800 border border-dark-700 flex items-center justify-center rounded-none overflow-hidden relative group">
                {isAdLoaded ? (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 z-0 animate-in fade-in duration-500"></div>
                        <div className="z-10 text-center p-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Advertisement</span>
                            <p className="text-gray-400 text-xs">Support the platform by disabling adblock</p>
                        </div>
                        <div className="absolute top-0 right-0 bg-gray-700 text-gray-300 text-[9px] px-1.5 py-0.5 opacity-50">Exo</div>
                    </>
                ) : (
                    <div className="w-full h-full bg-dark-900/50 animate-pulse"></div>
                )}
            </div>
        </div>
    );
};
