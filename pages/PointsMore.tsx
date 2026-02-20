
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Zap, Crown, Newspaper, Clock, 
    ChevronRight, Wallet, Star, TrendingUp, Play, 
    Sparkles, Target, Layers, ArrowUpRight
} from 'lucide-react';

const DetailCard = ({ title, value, type, icon: Icon, color, onClick }: any) => (
    <div 
        onClick={onClick}
        className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-white/[0.1] rounded-[20px] p-6 transition-all duration-500 cursor-pointer overflow-hidden shadow-lg"
    >
        <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${color}-500/10 blur-[40px] group-hover:bg-${color}-500/20 transition-all duration-700`}></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} strokeWidth={1.5} />
                </div>
                {type && (
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-[0.1em] text-gray-500">
                        {type}
                    </div>
                )}
            </div>
            <div>
                <h4 className="text-white font-black uppercase italic tracking-tighter text-base mb-1">{title}</h4>
                <div className="flex items-center justify-between">
                    <span className={`text-lg font-black tabular-nums tracking-tighter ${type === 'EARN' ? 'text-emerald-400' : 'text-brand-500'}`}>
                        {value}
                    </span>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-all group-hover:translate-x-1" />
                </div>
            </div>
        </div>
    </div>
);

const FullArticleCard = ({ title, category, image, readTime, description, author, date }: any) => (
    <div className="group bg-white/[0.02] border border-white/[0.05] rounded-[32px] overflow-hidden hover:border-brand-500/30 transition-all duration-500 cursor-pointer shadow-2xl flex flex-col h-full">
        <div className="aspect-[16/10] overflow-hidden bg-dark-800 relative shrink-0">
            <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
                <span className="text-[10px] font-black text-white bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 uppercase tracking-widest shadow-lg">
                    {category}
                </span>
            </div>
        </div>
        
        <div className="p-8 flex flex-col flex-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
                <Clock size={14} className="text-brand-500" /> {readTime} read
            </div>
            
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight mb-4 group-hover:text-brand-400 transition-colors line-clamp-2">
                {title}
            </h3>
            
            <p className="text-sm text-gray-500 leading-relaxed font-medium line-clamp-3 mb-8">
                {description}
            </p>
            
            <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                    <img src={author.avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                    <div className="text-xs font-black text-white uppercase tracking-tight leading-none">{author.name}</div>
                    <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1.5">{date}</div>
                </div>
            </div>
        </div>
    </div>
);

export default function PointsMore() {
    const { type } = useParams();
    const navigate = useNavigate();

    const earnNodes = [
        { title: 'Ad Views', value: '150 LSC', type: 'EARN', icon: Zap, color: 'blue' },
        { title: 'Stream Views', value: '500 LSC', type: 'EARN', icon: Play, color: 'emerald' },
        { title: 'Shared Content', value: '1,200 LSC', type: 'EARN', icon: TrendingUp, color: 'purple' },
        { title: 'Daily Checkpoint', value: '50 LSC', type: 'EARN', icon: Star, color: 'amber' },
        { title: 'Referral Link', value: '250 LSC', type: 'EARN', icon: ArrowUpRight, color: 'cyan' },
        { title: 'Content Boost', value: '100 LSC', type: 'EARN', icon: TrendingUp, color: 'rose' },
    ];

    const rewards = [
        { title: 'Elite Status', value: '5,000 LSC', type: 'CLAIM', icon: Crown, color: 'brand' },
        { title: 'Priority Listing', value: '800 LSC', type: 'CLAIM', icon: Zap, color: 'rose' },
        { title: 'Content Access', value: '1,500 LSC', type: 'CLAIM', icon: Wallet, color: 'indigo' },
        { title: 'Starlight Frame', value: '250 LSC', type: 'CLAIM', icon: Sparkles, color: 'cyan' },
        { title: 'Ghost Mode', value: '3,000 LSC', type: 'CLAIM', icon: Target, color: 'slate' },
        { title: 'Custom Theme', value: '600 LSC', type: 'CLAIM', icon: Layers, color: 'orange' },
    ];

    const intel = [
        { 
            title: "Optimizing Reach: A Masterclass in Retention", 
            category: "Intelligence", 
            image: "https://picsum.photos/600/400?random=intel1", 
            readTime: "15-20 mins",
            description: "Learn how to calibrate your content for maximum listener retention and cross-platform synchronization in the new LuciSin infrastructure.",
            author: { name: "Dr. Ben Affleck", avatar: "https://picsum.photos/50/50?random=auth1" },
            date: "June 22, '25"
        },
        { 
            title: "Zero-Knowledge Proofs in the Platform Economy", 
            category: "Technology", 
            image: "https://picsum.photos/600/400?random=intel2", 
            readTime: "10 mins",
            description: "A deep dive into the cryptography securing the Pride's transactions and why ZK-proofs are the key to absolute privacy.",
            author: { name: "Dr. Nick Willford", avatar: "https://picsum.photos/50/50?random=auth2" },
            date: "June 21, '25"
        },
        { 
            title: "Building a Loyal Pride: From Zero to Elite Creator", 
            category: "Growth", 
            image: "https://picsum.photos/600/400?random=intel3", 
            readTime: "15 mins",
            description: "How to effectively manage your follower base and turn standard links into prioritized engagement channels.",
            author: { name: "Dr. Sarah Legend", avatar: "https://picsum.photos/50/50?random=auth3" },
            date: "May 28, '25"
        },
        { 
            title: "The Future of Decentralized Content Streaming", 
            category: "Trends", 
            image: "https://picsum.photos/600/400?random=intel4", 
            readTime: "10 mins",
            description: "Why P2P streaming nodes are replacing central CDN infrastructure for the next generation of LuciStars.",
            author: { name: "Dr. Evan Peters", avatar: "https://picsum.photos/50/50?random=auth4" },
            date: "May 16, '25"
        },
        { 
            title: "Mastering the Art of Digital Scarcity", 
            category: "Economics", 
            image: "https://picsum.photos/600/400?random=intel5", 
            readTime: "15 mins",
            description: "Strategies for creating limited edition digital collections that drive demand within the Mega marketplace.",
            author: { name: "Dr. Sam Cooper", avatar: "https://picsum.photos/50/50?random=auth5" },
            date: "April 20, '25"
        },
        { 
            title: "Security Protocols: Protecting Your Digital Profile", 
            category: "Safety", 
            image: "https://picsum.photos/600/400?random=intel6", 
            readTime: "6 mins",
            description: "Essential checklists for every star to ensure their broadcast streams and payment routes are hardened against intercept.",
            author: { name: "Dr. Kelly Adams", avatar: "https://picsum.photos/50/50?random=auth6" },
            date: "April 18, '25"
        },
    ];

    const getTitle = () => {
        if (type === 'earn') return 'Earning Methods';
        if (type === 'rewards') return 'Rewards';
        return 'Creator Guide';
    };

    const getIcon = () => {
        if (type === 'earn') return <Zap size={24} className="text-brand-500" />;
        if (type === 'rewards') return <Crown size={24} className="text-brand-500" />;
        return <Newspaper size={24} className="text-brand-500" />;
    };

    return (
        <div className="min-h-screen bg-[#050506] flex flex-col overflow-y-auto no-scrollbar selection:bg-brand-500 selection:text-white">
            {/* Simple Navigation Header */}
            <div className="w-full flex items-center sticky top-0 z-50 bg-[#050506]/40 backdrop-blur-3xl px-8 h-12 border-b border-white/[0.03]">
                <button onClick={() => navigate('/points')} className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Hub
                </button>
                <div className="ml-auto flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Protocol Status</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto w-full py-16 px-6">
                <div className="flex items-center gap-4 mb-12 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {getIcon()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{getTitle()}</h1>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-2">Extended Exploration Module</p>
                    </div>
                </div>

                {type === 'intel' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {intel.map((article, i) => (
                            <FullArticleCard key={i} {...article} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {(type === 'earn' ? earnNodes : rewards).map((item, i) => (
                            <DetailCard key={i} {...item} onClick={() => alert(`Opening ${item.title}...`)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
