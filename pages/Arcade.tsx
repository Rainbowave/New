
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gamepad2, Coins, Dices, Zap, Brain, 
  Trophy, Users, Target, Activity, 
  ArrowRight, RotateCw, Gem, Spade, Grid3X3, Palette, Timer, ArrowRightLeft,
  HelpCircle, Eye, Bomb, Loader2, Pickaxe, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { authService } from '../services/authService';
import { db } from '../services/db';

const GameCard = ({ id, title, desc, icon: Icon, color, image, multiplier }: any) => {
    const navigate = useNavigate();
    return (
        <div 
            className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden group transition-all cursor-pointer flex flex-col h-full relative hover:border-brand-500/50 shadow-none hover:shadow-2xl hover:scale-[1.02]" 
            onClick={() => navigate(`/arcade/${id}`)}
        >
            <div className="aspect-[16/9] bg-dark-900 relative overflow-hidden">
                <img src={image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" alt={title} />
                <div className="absolute top-3 left-3 bg-brand-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase italic z-10">
                    {multiplier}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all z-20">
                    <button className="bg-white text-black font-black px-6 py-2 rounded-xl text-[10px] uppercase flex items-center gap-2 hover:bg-brand-500 hover:text-white transition-all shadow-none">
                        Play Now <ArrowRight size={12} />
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1 relative z-10 bg-dark-800">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${color} bg-opacity-20 text-white`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase italic tracking-wide leading-none">{title}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Arcade() {
    const navigate = useNavigate();
    const [points, setPoints] = useState(0);
    const [activeGames, setActiveGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const user = authService.getCurrentUser();
    const mood = user?.contentPreference === 'adult' ? 'naughty' : 'dating';
    const accentColor = mood === 'dating' ? 'text-brand-second' : 'text-brand-500';
    const accentBg = mood === 'dating' ? 'bg-brand-second' : 'bg-brand-500';

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch Wallet
                const wallet = await api.get<any>('/wallet');
                if (wallet?.balance) setPoints(wallet.balance);
                
                // Fetch Game Config
                const settings = db.getSiteSettings();
                const gameConfigs = settings.configs?.arcade?.games || {};

                const ALL_GAMES = [
                    { id: 'miner', title: 'Time Miner', desc: 'Click & Earn', icon: Pickaxe, color: 'bg-yellow-600', image: 'https://picsum.photos/600/400?random=miner', multiplier: '100PTS' },
                    { id: 'heads', title: 'Flip Fate', desc: 'Heads or Tails', icon: Coins, color: 'bg-amber-500', image: 'https://picsum.photos/600/400?random=101', multiplier: '2X' },
                    { id: 'rps', title: 'Tactical Arena', desc: 'Rock Paper Scissors', icon: Brain, color: 'bg-pink-500', image: 'https://picsum.photos/600/400?random=102', multiplier: '2X' },
                    { id: 'wheel', title: 'Neon Wheel', desc: 'Spin to Win', icon: RotateCw, color: 'bg-purple-500', image: 'https://picsum.photos/600/400?random=103', multiplier: '10X' },
                    { id: 'guess', title: 'Neural Guess', desc: 'Higher or Lower', icon: HelpCircle, color: 'bg-blue-500', image: 'https://picsum.photos/600/400?random=104', multiplier: 'Variable' },
                    { id: 'dice', title: 'Cosmic Dice', desc: 'Roll the Bones', icon: Dices, color: 'bg-emerald-500', image: 'https://picsum.photos/600/400?random=105', multiplier: '5X' },
                    { id: 'ace', title: 'Ace Hunter', desc: 'Find the Card', icon: Eye, color: 'bg-slate-500', image: 'https://picsum.photos/600/400?random=106', multiplier: '3X' },
                    { id: 'crypto_slots', title: 'Terminal Slots', desc: 'Match Symbols', icon: Gem, color: 'bg-orange-500', image: 'https://picsum.photos/600/400?random=107', multiplier: '100X' },
                    { id: 'roulette', title: 'Roulette', desc: 'Red or Black', icon: Trophy, color: 'bg-red-600', image: 'https://picsum.photos/600/400?random=108', multiplier: '14X' },
                    { id: 'keno', title: 'Keno Grid', desc: 'Pick Numbers', icon: Grid3X3, color: 'bg-indigo-500', image: 'https://picsum.photos/600/400?random=109', multiplier: 'Variable' },
                    { id: 'blackjack', title: 'Blackjack', desc: 'Hit or Stand', icon: Spade, color: 'bg-green-600', image: 'https://picsum.photos/600/400?random=110', multiplier: '2.5X' },
                    { id: 'mines', title: 'Mines', desc: 'Extraction', icon: Bomb, color: 'bg-red-800', image: 'https://picsum.photos/600/400?random=111', multiplier: 'Scaling' },
                    { id: 'color', title: 'Color Predict', desc: 'Blue or Red', icon: Palette, color: 'bg-cyan-500', image: 'https://picsum.photos/600/400?random=112', multiplier: '1.9X' },
                    { id: 'crazy', title: 'Crazy Times', desc: 'Wheel Bonus', icon: Timer, color: 'bg-yellow-500', image: 'https://picsum.photos/600/400?random=113', multiplier: '500X' },
                    { id: 'double', title: 'Double Protocol', desc: 'Risk it all', icon: ArrowRightLeft, color: 'bg-zinc-500', image: 'https://picsum.photos/600/400?random=114', multiplier: '2X++' },
                ];

                // Filter games based on config enabled status (default true if config missing)
                const visible = ALL_GAMES.filter(g => {
                    const conf = gameConfigs[g.id];
                    return conf ? conf.enabled : true; 
                });

                setActiveGames(visible);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        init();
    }, []);

    const filteredGames = useMemo(() => {
        if (!searchQuery) return activeGames;
        return activeGames.filter(g => 
            g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            g.desc.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeGames, searchQuery]);

    return (
        <div className="max-w-[1600px] mx-auto pt-10 px-6 pb-24 bg-dark-850 min-h-screen">
            
            {/* Hero Section */}
            <div className="relative rounded-3xl bg-dark-900 border border-white/5 overflow-hidden mb-12 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl">
                <div className={`absolute inset-0 bg-[url('https://picsum.photos/1600/900?random=arcade_hero')] bg-cover opacity-10 mix-blend-overlay`}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-dark-900/80 to-transparent"></div>
                
                <div className="relative z-10 max-w-xl">
                    <div className={`inline-flex items-center gap-2 ${accentBg} text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6 shadow-lg`}>
                        <Gamepad2 size={14} fill="currentColor" /> Arcade Protocol
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter leading-[0.9]">
                        Play to <span className={accentColor}>Earn</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs leading-relaxed mb-8">
                        High stakes, instant payouts. Challenge the system in fair-play certified games.
                    </p>
                    <div className="flex gap-4 items-center">
                        <button onClick={() => navigate('/points')} className="bg-white text-black hover:bg-brand-500 hover:text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all">
                            Get Credits
                        </button>
                        
                        {/* Search Input */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-500 transition-colors" size={16} />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Games..." 
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-xs text-white focus:border-brand-500 outline-none transition-all placeholder:text-gray-600 font-bold uppercase tracking-wider backdrop-blur-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 bg-dark-800/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl min-w-[280px] shadow-2xl mt-8 md:mt-0">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Your Balance</h3>
                    <div className="text-4xl font-black text-white mb-2 tabular-nums">{points.toLocaleString()} <span className="text-lg text-brand-500">LSC</span></div>
                    <div className="h-1 w-full bg-dark-700 rounded-full overflow-hidden">
                        <div className={`h-full ${accentBg} w-3/4 animate-pulse`}></div>
                    </div>
                </div>
            </div>

            {/* Games Grid */}
            {loading ? (
                 <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {filteredGames.map((game) => (
                        <GameCard key={game.id} {...game} />
                    ))}
                    {filteredGames.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-dark-700 rounded-xl">
                            {searchQuery ? `No games found matching "${searchQuery}"` : "System Offline. No games available."}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
