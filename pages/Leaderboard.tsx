
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Crown, Medal, TrendingUp, Users, Star, ArrowUp, ArrowDown, Minus, Loader2, ChevronRight, Heart, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { authService } from '../services/authService';
import { db } from '../services/db';

interface LeaderboardMember {
    id: string;
    rank: number;
    name: string;
    handle: string;
    score: string;
    followers: string;
    avatar: string;
    category: string;
    change: 'up' | 'down' | 'same';
    isVerified: boolean;
}

const PodiumUser: React.FC<{ member: LeaderboardMember, place: number, prize: number }> = ({ member, place, prize }) => {
    const navigate = useNavigate();
    let borderColor = 'border-gray-700';
    let icon = null;
    let height = 'h-32';
    let avatarSize = 'w-24 h-24';
    let scale = 'scale-90';
    let podiumBg = 'from-dark-800 to-black';
    
    if (place === 1) {
        borderColor = 'border-yellow-500';
        podiumBg = 'from-yellow-600/30 via-yellow-600/10 to-transparent';
        icon = <Crown className="text-yellow-500 fill-yellow-500" size={32} />;
        height = 'h-52';
        avatarSize = 'w-32 h-32';
        scale = 'scale-110';
    } else if (place === 2) {
        borderColor = 'border-slate-300';
        podiumBg = 'from-zinc-500/20 via-zinc-500/5 to-transparent';
        icon = <Medal className="text-zinc-300 fill-zinc-300" size={24} />;
        height = 'h-44';
        avatarSize = 'w-28 h-28';
        scale = 'scale-100';
    } else if (place === 3) {
        borderColor = 'border-orange-500';
        podiumBg = 'from-orange-600/20 via-orange-600/5 to-transparent';
        icon = <Medal className="text-orange-500 fill-orange-500" size={24} />;
        height = 'h-36';
        avatarSize = 'w-24 h-24';
        scale = 'scale-100';
    }

    const cleanName = member.name.replace(/^LuciStar\s+/i, '');

    return (
        <div className={`flex flex-col items-center group cursor-pointer transition-all duration-500 ${scale}`} onClick={() => navigate(`/profile/${member.handle.replace('@', '')}`)}>
            <div className="relative mb-3 flex flex-col items-center">
                <div className="z-20 mb-2">{icon}</div>
                <div className={`rounded-full p-1 border-4 ${borderColor} relative z-10 bg-dark-900 transition-transform group-hover:scale-105`}>
                    <img src={member.avatar} className={`${avatarSize} rounded-full object-cover`} alt={cleanName} />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-black font-black text-xs px-3 py-1 rounded-full shadow-none">
                        #{place}
                    </div>
                </div>
            </div>
            <div className="text-center z-20">
                <h3 className="font-black text-white text-lg mt-2 flex items-center justify-center gap-1 group-hover:text-brand-second transition-colors uppercase italic tracking-tighter">
                    {cleanName} 
                    {member.isVerified && <CheckIcon className="text-blue-500 w-3 h-3" />}
                </h3>
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest">{member.handle}</p>
                <div className="mt-3 flex flex-col items-center gap-1">
                    <div className="inline-flex items-center gap-1 text-yellow-500 font-black px-3 py-1 rounded-[5px] text-[10px] bg-yellow-500/10 border border-yellow-500/20 uppercase tracking-widest">
                        <Star size={10} fill="currentColor" /> {member.score}
                    </div>
                    {prize > 0 && (
                        <div className="text-[10px] font-black text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded uppercase tracking-widest">
                            Prize: {prize} LSC
                        </div>
                    )}
                </div>
            </div>
            
            <div className={`w-full ${height} bg-gradient-to-t ${podiumBg} rounded-t-[20px] mt-6 flex items-end justify-center pb-8 border-x border-t border-white/5 transition-colors`}>
                <span className="text-6xl font-black text-white/5 select-none">{place}</span>
            </div>
        </div>
    );
};

const LeaderboardRow: React.FC<{ member: LeaderboardMember }> = ({ member }) => {
    const navigate = useNavigate();
    const cleanName = member.name.replace(/^LuciStar\s+/i, '');
    
    return (
        <div 
            onClick={() => navigate(`/profile/${member.handle.replace('@', '')}`)}
            className="flex items-center gap-4 p-4 bg-dark-950 border border-white/5 rounded-[5px] hover:border-brand-second/40 transition-all cursor-pointer group mb-1.5 animate-in fade-in slide-in-from-bottom-2"
        >
            <div className="w-10 font-black text-gray-600 text-xs text-center uppercase tracking-widest">#{member.rank}</div>
            
            <div className="relative">
                <img src={member.avatar} className="w-12 h-12 rounded-[5px] object-cover border border-white/10 group-hover:border-brand-second transition-colors" alt={cleanName} />
                {member.isVerified && <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-dark-950 flex items-center justify-center"><CheckIcon className="text-white w-2.5 h-2.5" /></div>}
            </div>
            
            <div className="flex-1 min-w-0">
                <h4 className="font-black text-white text-sm truncate group-hover:text-brand-second transition-colors uppercase tracking-tight italic">
                    {cleanName}
                </h4>
                <div className="flex items-center gap-3 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                    <span>{member.category}</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span className="flex items-center gap-1"><Users size={10}/> {member.followers} Pride Members</span>
                </div>
            </div>

            <div className="text-right flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <div className="font-black text-yellow-500 text-lg tracking-tighter italic tabular-nums">{member.score}</div>
                    <div className={`text-[9px] font-black flex items-center justify-end gap-1 uppercase tracking-widest ${
                        member.change === 'up' ? 'text-green-500' : member.change === 'down' ? 'text-red-500' : 'text-gray-600'
                    }`}>
                        {member.change === 'up' && <ArrowUp size={10} />}
                        {member.change === 'down' && <ArrowDown size={10} />}
                        {member.change === 'same' && <Minus size={10} />}
                        {member.change}
                    </div>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-brand-second transition-colors" />
            </div>
        </div>
    );
};

// Sub-component to handle data fetching and infinite scroll logic independently
const LeaderboardList = ({ categoryFilter, timeFilter, prizes }: { categoryFilter: string, timeFilter: string, prizes: { first: number, second: number, third: number } }) => {
    const [members, setMembers] = useState<LeaderboardMember[]>([]);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const currentCursor = cursor || '0';
            const response = await api.get<{ items: LeaderboardMember[], nextCursor?: string }>(
                `/leaderboard?limit=20&cursor=${currentCursor}&category=${categoryFilter}&time=${timeFilter}`
            );
            
            if (response && response.items) {
                setMembers(prev => [...prev, ...response.items]);
                setCursor(response.nextCursor);
                setHasMore(!!response.nextCursor);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error("Failed to load leaderboard", e);
        } finally {
            setLoading(false);
        }
    }, [cursor, loading, hasMore, categoryFilter, timeFilter]);

    // Initial load when filters change
    useEffect(() => {
        setMembers([]);
        setCursor(undefined);
        setHasMore(true);
    }, [categoryFilter, timeFilter]);

    useEffect(() => {
        if (members.length === 0 && hasMore && !loading) {
            loadMore();
        }
    }, [members.length, hasMore, loading, loadMore]);

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading, loadMore]);

    if (loading && members.length === 0) {
        return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="animate-spin text-brand-main" /></div>;
    }

    return (
        <>
            {/* Podium for Top 3 - Only show if ALL categories or specifically NOT just Users (unless Users have rankings) */}
            {members.length >= 3 && categoryFilter !== 'Users' && (
                <div className="grid grid-cols-3 gap-0 items-end justify-center mb-24 max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="order-2 md:order-1">
                        <PodiumUser member={members[1]} place={2} prize={prizes.second} />
                    </div>
                    <div className="order-1 md:order-2">
                        <PodiumUser member={members[0]} place={1} prize={prizes.first} />
                    </div>
                    <div className="order-3">
                        <PodiumUser member={members[2]} place={3} prize={prizes.third} />
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-1">
                <div className="flex items-center justify-between px-6 mb-10">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                        <TrendingUp size={18} className="text-brand-second" /> 
                        {categoryFilter === 'Users' ? 'Community Members' : 'Rising Stars'}
                    </h3>
                </div>
                
                <div className="space-y-1">
                    {/* If showing podium, skip first 3 in list. If Users tab, show all. */}
                    {members.slice(categoryFilter === 'Users' ? 0 : 3).map((member, idx) => (
                        <LeaderboardRow key={`${member.id}-${idx}`} member={member} />
                    ))}
                </div>
                
                {/* Sentinel for Infinite Scroll */}
                <div ref={observerTarget} className="h-24 flex flex-col items-center justify-center gap-4 mt-8">
                    {loading && (
                        <Loader2 className="animate-spin text-brand-main" />
                    )}
                    {!hasMore && members.length > 0 && (
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">End of Leaderboard</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default function Leaderboard() {
    const [timeFilter, setTimeFilter] = useState('Weekly');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const user = authService.getCurrentUser();
    const mode = user?.contentPreference || 'dating';
    
    // Get prize config based on mode
    const settings = db.getSiteSettings() as any;
    const currentPrizes = mode === 'adult' 
        ? settings?.leaderboard?.naughty || { first: 0, second: 0, third: 0 }
        : settings?.leaderboard?.dating || { first: 0, second: 0, third: 0 };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 min-h-screen">
            <div className="text-center mb-20">
                <div className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-10 ${mode === 'adult' ? 'bg-brand-500/10 border-brand-500/20 text-brand-500' : 'bg-brand-second/10 border-brand-second/20 text-brand-second'}`}>
                    {mode === 'adult' ? <Flame size={14} fill="currentColor" /> : <Heart size={14} fill="currentColor" />}
                    {mode === 'adult' ? 'Naughty Rankings' : 'Dating Rankings'}
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none shadow-none">
                    Pride Leaderboard
                </h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest max-w-xl mx-auto opacity-70">
                    Celebrating the most impactful {mode === 'adult' ? 'icons' : 'members'} in the {mode === 'adult' ? 'private' : 'social'} space.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-20">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {['All', 'Users', 'Gaming', 'Tech', 'Art', 'Music', 'Lifestyle'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${categoryFilter === cat ? 'bg-white text-black border-white shadow-none scale-105' : 'bg-transparent border-white/10 text-gray-500 hover:text-brand-second hover:border-brand-second'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                <div className="flex items-center gap-1 bg-dark-800 p-1 rounded-[5px] border border-white/5">
                    {['Weekly', 'Monthly', 'All Time'].map(time => (
                        <button
                            key={time}
                            onClick={() => setTimeFilter(time)}
                            className={`px-5 py-2 rounded-[5px] text-[9px] font-black uppercase tracking-widest transition-all ${timeFilter === time ? 'bg-brand-main text-white' : 'text-gray-600 hover:text-white'}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            <LeaderboardList categoryFilter={categoryFilter} timeFilter={timeFilter} prizes={currentPrizes} />
        </div>
    );
}

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);
