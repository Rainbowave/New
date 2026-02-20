
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';

export const ContentWall = () => {
    const navigate = useNavigate();
    const [columns, setColumns] = useState<any[][]>([]);

    useEffect(() => {
        const allPosts = db.getPosts();
        
        // Generate a dense set of items
        let displayItems;
        if (allPosts.length > 0) {
            // Shuffle and duplicate to ensure enough content for many columns
            const shuffled = [...allPosts, ...allPosts, ...allPosts].sort(() => 0.5 - Math.random());
            displayItems = shuffled.slice(0, 150).map((p: any) => ({
                id: p.id,
                url: p.thumbnailUrl || p.url || `https://picsum.photos/400/600?random=${p.id}`,
                type: p.type
            }));
        } else {
            displayItems = Array.from({ length: 150 }).map((_, i) => ({
                id: i + 1000,
                url: `https://picsum.photos/400/600?random=auth_${i}`,
                type: i % 3 === 0 ? 'LIVE' : i % 5 === 0 ? 'SHORT' : 'PHOTO'
            }));
        }

        // Create enough columns to fill wide screens
        const columnCount = 8; 
        const cols: any[][] = Array.from({ length: columnCount }, () => []);
        
        displayItems.forEach((item, i) => {
            cols[i % columnCount].push(item);
        });
        
        setColumns(cols);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden bg-dark-900 z-0">
            {/* Angled Container for visual interest - Fully visible */}
            <div className="absolute inset-0 flex justify-center gap-6 -top-32 -left-32 -right-32 min-w-[150%] rotate-[5deg] scale-110 pointer-events-auto">
                {columns.map((col, colIndex) => (
                    <div 
                        key={colIndex} 
                        className={`flex flex-col gap-6 w-[280px] shrink-0 animate-scroll-y ${colIndex % 2 === 0 ? 'animate-reverse' : ''}`}
                        style={{ 
                            animationDuration: `${80 + (colIndex % 3) * 15}s` // Slower animation for larger items
                        }}
                    >
                        {/* Tripled content for seamless infinite scroll */}
                        {[...col, ...col, ...col].map((item, i) => (
                            <div 
                                key={`${item.id}-${i}`} 
                                className="w-[280px] h-[200px] rounded-2xl overflow-hidden relative group cursor-pointer transition-all duration-300 hover:z-50 hover:scale-110 hover:shadow-2xl border border-white/10 bg-dark-800 shadow-lg"
                                onClick={() => navigate(`/post/${item.id}`)}
                            >
                                <img 
                                    src={item.url} 
                                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" 
                                    alt="" 
                                    loading="lazy"
                                />
                                {/* Overlay gradient for better text contrast if needed, but keeping image visible */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-0 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            
            <style>{`
                @keyframes scroll-y {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-33.33%); } /* Scroll 1/3rd (one set) */
                }
                .animate-scroll-y {
                    animation: scroll-y linear infinite;
                }
                .animate-reverse {
                    animation-direction: reverse;
                }
            `}</style>
        </div>
    );
};
