
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { MapPin, Link as LinkIcon, Calendar, Crown, Gift, Trophy, Check, Plus, MessageCircle, ChevronDown, Video, Palette, Cpu, ArrowRight, Flame, Users, Tag, Settings, Mic, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
    user: User;
    isOwnProfile: boolean;
    isFollowing: boolean;
    onFollow: () => void;
    onSubscribe: (tier: string) => void;
    onTip: () => void;
    onMessage: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
    user, 
    isOwnProfile, 
    isFollowing, 
    onFollow, 
    onSubscribe,
    onTip,
    onMessage
}) => {
    const navigate = useNavigate();
    const [showFollowingMenu, setShowFollowingMenu] = useState(false);
    const followingDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (followingDropdownRef.current && !followingDropdownRef.current.contains(event.target as Node)) {
                setShowFollowingMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMessageClick = () => {
        navigate('/chat');
    };

    // Name Coloring Logic
    const getNameClass = () => {
        if (user.isLuciStar) {
            // Sexuality Gradient Map
            const sexuality = user.sexuality || 'Other';
            if (sexuality.includes('Gay')) return "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-green-500 to-blue-500";
            if (sexuality.includes('Lesbian')) return "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-pink-500";
            if (sexuality.includes('Bi')) return "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500";
            if (sexuality.includes('Pan')) return "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400";
            if (sexuality.includes('Trans')) return "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-white";
            if (sexuality.includes('Queer')) return "text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500";
            return "text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500"; // Default Gold/Premium gradient
        }
        if (user.isPremium) {
            return "text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"; // Silver Effect
        }
        return "text-white";
    };

    return (
        <div className="px-6 md:px-12 relative mb-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start -mt-16 md:-mt-20 relative z-20">
                {/* Avatar - Left */}
                <div className="shrink-0 relative group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[5px] border-4 border-dark-900 bg-dark-800 overflow-hidden shadow-2xl">
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    {isOwnProfile && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[5px] cursor-pointer" onClick={() => navigate(`/profile/${user.username}/settings`)}>
                            <span className="text-white text-xs font-black uppercase tracking-widest italic">Update Profile</span>
                        </div>
                    )}
                </div>

                {/* Main Info - Center */}
                <div className="flex-1 min-w-0 pt-2 md:pt-20 lg:pt-20 space-y-4">
                    <div className="mt-4">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h1 className={`text-3xl md:text-4xl font-black flex items-center gap-2 uppercase italic tracking-tighter ${getNameClass()}`}>
                                {user.displayName} 
                                {user.isVerified && <span className="bg-brand-second rounded-[5px] p-0.5 text-white shadow-lg"><Check size={12} strokeWidth={4} /></span>}
                            </h1>
                            {user.isLuciStar && <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1"><Crown size={10} fill="currentColor"/> LuciStar</span>}
                            {user.isPremium && !user.isLuciStar && <span className="bg-gray-300 text-black px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1"><Star size={10} fill="currentColor"/> PreStar</span>}
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-gray-400 text-base font-medium">@{user.username}</p>
                            {user.pronunciation && (
                                <span className="text-gray-500 text-xs flex items-center gap-1">
                                    <Mic size={10} /> {user.pronunciation}
                                </span>
                            )}
                            {user.pronouns && (
                                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full lowercase font-medium">{user.pronouns}</span>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-200 text-lg leading-relaxed font-light max-w-2xl">
                        {user.description || "Sharing high-fidelity signals within the sanctuary. 🎮 🎨"}
                    </p>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 font-medium">
                            <div className="flex items-center gap-2"><MapPin size={16} className="text-brand-500" /> {user.location || 'Sanctuary Node'}</div>
                            <a href="#" className="flex items-center gap-2 text-brand-second hover:text-brand-400 transition-colors"><LinkIcon size={16} /> lucisin.com/{user.username}</a>
                            <div className="flex items-center gap-2"><Calendar size={16} className="text-brand-500" /> Joined {new Date().getFullYear()}</div>
                        </div>

                        {user.tags && user.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {user.tags.map(tag => (
                                    <span 
                                        key={tag} 
                                        className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-dark-800 border border-white/10 text-gray-400 rounded-sm flex items-center gap-1.5"
                                    >
                                        <Tag size={10} className="text-brand-second" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Actions Card */}
                <div className="w-full lg:w-80 shrink-0 mt-[30px]">
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 shadow-xl">
                        <div className="flex gap-2 mb-6">
                            {isOwnProfile ? (
                                <>
                                    <button onClick={() => navigate(`/profile/${user.username}/settings`)} className="bg-white text-black font-black py-2.5 px-6 rounded-xl transition-colors shadow-lg text-[10px] uppercase tracking-widest flex-1 hover:bg-brand-500 hover:text-white">
                                        Edit Profile
                                    </button>
                                    <button onClick={() => navigate('/manage-content')} className="bg-dark-700 text-white border border-dark-600 font-black py-2.5 px-4 rounded-xl transition-colors shadow-lg text-[10px] uppercase tracking-widest hover:bg-dark-600 flex items-center justify-center">
                                        <Settings size={16} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="relative flex-1" ref={followingDropdownRef}>
                                        <button 
                                            onClick={isFollowing ? () => setShowFollowingMenu(!showFollowingMenu) : onFollow} 
                                            className={`w-full font-black py-2.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest ${isFollowing ? 'bg-dark-700 text-white border border-dark-600' : 'bg-white text-black hover:bg-brand-main hover:text-white'}`}
                                        >
                                            {isFollowing ? (
                                                <>Following Pride <ChevronDown size={16} className={`transition-transform duration-200 ${showFollowingMenu ? 'rotate-180' : ''}`} /></>
                                            ) : (
                                                'Join Pride'
                                            )}
                                        </button>

                                        {isFollowing && showFollowingMenu && (
                                            <div className="absolute top-full right-0 mt-2 w-64 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-white/5">
                                                <button 
                                                    onClick={() => {onTip(); setShowFollowingMenu(false);}} 
                                                    className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                                >
                                                    <Gift size={14} className="text-yellow-500" /> Send Gift
                                                </button>
                                                <button 
                                                    onClick={() => {onSubscribe('1'); setShowFollowingMenu(false);}} 
                                                    className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-colors flex items-center gap-2 border-t border-white/5"
                                                >
                                                    <Crown size={14} className="text-brand-500" /> Subscription Plans
                                                </button>
                                                <button 
                                                    onClick={() => {onFollow(); setShowFollowingMenu(false);}} 
                                                    className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors border-t border-white/5"
                                                >
                                                    Leave Pride
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <button onClick={onMessage} className="p-2.5 bg-transparent hover:bg-white/5 text-white rounded-xl transition-all">
                                        <MessageCircle size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-0 text-center mb-6 border-b border-dark-700 pb-6">
                            <div 
                                className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => navigate(`/profile/${user.username}/network/pride`)}
                            >
                                <span className="font-black text-[#e9e8ed] text-lg italic tracking-tighter">{(user.followers / 1000).toFixed(1)}K</span>
                                <span className="text-[9px] text-white uppercase font-black tracking-[0.2em]">Pride</span>
                            </div>
                            <div 
                                className="flex flex-col items-center border-l border-dark-700 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => navigate(`/profile/${user.username}/network/following`)}
                            >
                                <span className="font-black text-[#e9e8ed] text-lg italic tracking-tighter">450</span>
                                <span className="text-[9px] text-white uppercase font-black tracking-[0.2em]">Following</span>
                            </div>
                            <div className="flex flex-col items-center border-l border-dark-700 cursor-default">
                                <span className="font-black text-[#e9e8ed] text-lg italic tracking-tighter">1.2M</span>
                                <span className="text-[9px] text-white uppercase font-black tracking-[0.2em] flex items-center gap-1"><Flame size={10} /> Heat</span>
                            </div>
                        </div>

                        <div 
                            onClick={() => navigate('/leaderboard')}
                            className="flex items-center justify-between cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-dark-700/50 transition-colors"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1 text-yellow-500">
                                    <Trophy size={14} />
                                    <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Global Rank</h3>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-white tracking-tighter italic">#42</span>
                                    <span className="text-[9px] text-gray-600 font-black uppercase">Top 1% LuciStars</span>
                                </div>
                            </div>
                            
                            <div className="bg-dark-700 p-2 rounded-full text-white group-hover:bg-brand-500 group-hover:text-white transition-all">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
