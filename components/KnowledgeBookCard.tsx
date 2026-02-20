
import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

interface KnowledgeBookCardProps {
    id: string | number;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    readTime: string;
    author: {
        username: string;
        avatar: string;
        displayName?: string;
    };
    date: string;
    onClick: () => void;
}

export const KnowledgeBookCard: React.FC<KnowledgeBookCardProps> = ({
    title,
    description,
    category,
    imageUrl,
    readTime,
    author,
    date,
    onClick
}) => {
    return (
        <div 
            onClick={onClick}
            className="group flex flex-col bg-dark-800 border border-white/5 rounded-[5px] overflow-hidden cursor-pointer hover:border-brand-500/50 transition-all shadow-sm hover:shadow-lg h-full"
        >
            {/* Image Section - Fixed height to approximate half card */}
            <div className="relative w-full h-64 bg-dark-900 overflow-hidden shrink-0">
                <img 
                    src={imageUrl} 
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-[5px]">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-brand-500" /> {readTime}
                    </span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span>{date}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-brand-500 transition-colors">
                    {title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">
                    {description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-3">
                        <img 
                            src={author.avatar} 
                            alt={author.username}
                            className="w-8 h-8 rounded-full object-cover border border-white/10"
                        />
                        <div>
                            <p className="text-xs font-bold text-white">{author.displayName || author.username}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Author</p>
                        </div>
                    </div>
                    
                    <span className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest group-hover:text-brand-500 transition-colors">
                        Read Article <ArrowRight size={14} />
                    </span>
                </div>
            </div>
        </div>
    );
};
