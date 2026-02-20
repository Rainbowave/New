import React, { useEffect, useRef, useState, memo } from 'react';
import { ExternalLink } from 'lucide-react';

interface AdCardProps {
    id?: string;
    link?: string;
    className?: string;
    height?: string;
    imageUrl?: string;
    title?: string;
}

const AdCardComponent: React.FC<AdCardProps> = ({ 
    id = '12345', 
    link = 'https://example.com', 
    className = '', 
    height = 'h-48',
    imageUrl,
    title = 'Sponsored Content'
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const hasTrackedImpression = useRef(false);

    // Fallback image if none provided
    const displayImage = imageUrl || `https://picsum.photos/800/400?random=ad${id}`;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    
                    if (!hasTrackedImpression.current) {
                        console.log(`[Ad Tracking] Impression registered for Ad ID: ${id}`);
                        hasTrackedImpression.current = true;
                    }
                    
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [id]);

    const handleClick = () => {
        console.log(`[Ad Tracking] Click registered for Ad ID: ${id}`);
        window.open(link, '_blank');
    };

    return (
        <article 
            ref={cardRef} 
            onClick={handleClick}
            className={`bg-dark-800 rounded-none overflow-hidden border border-brand-500/20 mb-8 cursor-pointer animate-in fade-in duration-700 group relative hover:border-brand-500/50 transition-all shadow-sm hover:shadow-md ${height} ${className}`}
            aria-label="Advertisement"
        >
            {!isVisible ? (
                <div className="h-full w-full bg-dark-700 animate-pulse"></div>
            ) : (
                <>
                    <div className="absolute top-2 left-2 z-10">
                        <span className="text-[10px] font-black text-white bg-brand-600/90 backdrop-blur px-3 py-1 rounded-sm uppercase tracking-widest shadow-sm">SPONSORED</span>
                    </div>
                    
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 backdrop-blur p-1.5 rounded-sm text-white">
                            <ExternalLink size={12} />
                        </div>
                    </div>

                    <div className="w-full h-full relative">
                        <img 
                            src={displayImage} 
                            className="w-full h-full object-cover transition-all duration-700" 
                            alt={title} 
                            loading="lazy" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <h4 className="text-white font-bold text-sm uppercase italic tracking-wider truncate w-full">{title}</h4>
                        </div>
                    </div>
                </>
            )}
        </article>
    );
};

export const AdCard = memo(AdCardComponent);