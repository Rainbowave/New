import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    placeholderColor?: string;
    variant?: 'default' | 'black-fade';
}

export const LazyImage: React.FC<LazyImageProps> = ({ 
    src, 
    className, 
    alt, 
    placeholderColor = 'bg-dark-800',
    variant = 'default',
    ...props 
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' } 
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {!isLoaded && (
                <div className={`absolute inset-0 z-0 animate-pulse ${placeholderColor}`}></div>
            )}
            
            {variant === 'black-fade' && (
                <div className={`absolute inset-0 bg-black/50 z-20 transition-opacity duration-700 pointer-events-none ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
            )}

            <img
                ref={imgRef}
                src={isVisible ? src : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}
                alt={alt || ""}
                className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out relative z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={handleLoad}
                {...props}
            />
        </div>
    );
};