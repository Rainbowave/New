
import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Coins, Dices, Play, RotateCw, Gem, Brain, 
  TrendingUp, Trophy, Zap, Users, Star, Flame, History, 
  ChevronRight, Sparkles, Target, Activity, Clock, 
  ShieldCheck, Layers, ArrowRightLeft, Eye, BarChart3,
  Dna, Cpu, Fingerprint, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const GameCard = ({ id, title, desc, icon: Icon, color, image, badge, players, entryCost, multiplier }: any) => {
    const navigate = useNavigate();
    return (
        <div 
            className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden group transition-all cursor-pointer shadow-2xl flex flex-col h-full relative hover:border-brand-500/50" 
            onClick={() => navigate(`/arcade/${id}`)}
        >
            <div className="aspect-[16/9] bg-dark-900 relative overflow-hidden">
                <img src={image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" alt={title} />
                <div className="absolute top-3 left-3 bg-brand-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase shadow-lg italic">
                    {multiplier}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="bg-white text-black font-black px-6 py-2 rounded-xl text-[10px] uppercase shadow-2xl flex items-center gap-2">
                        Play Now <ArrowRight size={12} />
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl ${color} text-white shadow-lg`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white truncate">{title}</h3>
                        <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                        <Users size={12} /> {players} Playing
                    </div>
                    <div className="text-yellow-500 font-bold text-xs flex items-center gap-1">
                        <Coins size={12} /> {entryCost} LSC
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Games() {
    const navigate = useNavigate();
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const wallet = await api.get<any>('/wallet');
                if (wallet?.balance) setPoints(wallet.balance);
            } catch (e) { console.error(e); }
        };
        fetchBalance();
    }, []);

    const categories = [
        { id: 'featured', label: 'Classic Games', icon: Gamepad2 },
        { id: 'instant', label: 'Instant Wins', icon: Zap },
        { id: 'skill', label: 'Puzzles & Skills', icon: Brain },
    ];

    const gamesData = {
        featured: [
            { id: 'crypto_slots', title: 'Lucky Slots', desc: 'Classic slot machine fun.', icon: Gem, color: 'bg-orange-500', image: 'https://picsum.photos/600/400?random=slot', players: '1.2K', entryCost: 50, multiplier: '100X Potential' },
            { id: 'dice', title: 'Cosmic Dice', desc: 'Roll and win big.', icon: Dices, color: 'bg-emerald-500', image: 'https://picsum.photos/600/400?random=dice', players: '840', entryCost: 20, multiplier: '5X Max' },
        ],
        instant: [
            { id: 'heads', title: 'Coin Flip', desc: 'A simple 50/50 game.', icon: Coins, color: 'bg-amber-500', image: 'https://picsum.photos/600/400?random=coin', players: '310', entryCost: 10, multiplier: '2X Payout' },
            { id: 'mines', title: 'Treasure Mines', desc: 'Find gems, avoid bombs.', icon: Target, color: 'bg-slate-700', image: 'https://picsum.photos/600/400?random=mines', players: '440', entryCost: 50, multiplier: 'Scaling Win' },
        ],
        skill: [
            { id: 'rps', title: 'Arena RPS', desc: 'Play against the computer.', icon: Brain, color: 'bg-rose-500', image: 'https://picsum.photos/600/400?random=rps', players: '215', entryCost: 30, multiplier: '2X Prize' },
        ]
    };

    return (
        <div className="max-w-[1400px] mx-auto pt-10 px-6 pb-24 bg-black">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                <div className="lg:col-span-8 bg-dark-800 rounded-3xl p-10 border border-white/5 relative overflow-hidden flex flex-col justify-center min-h-[400px] shadow-2xl">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-brand-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <Trophy size={16} fill="currentColor" /> Live Tournament
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter leading-tight">
                            Arcade <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-yellow-600">Jackpots</span>
                        </h1>
                        <button onClick={() => navigate('/leaderboard')} className="bg-white text-black hover:bg-brand-500 hover:text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all">
                            View Leaderboard
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-dark-800 border border-white/5 rounded-3xl p-10 flex flex-col justify-between shadow-2xl">
                    <div className="space-y-10">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={16} className="text-brand-500" /> Account Stats
                        </h2>
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-2">My Points Balance</span>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20">
                                    <Coins size={28} />
                                </div>
                                <span className="text-5xl font-black text-white tabular-nums">{points.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => navigate('/points')} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-xs transition-all mt-10">
                        Buy More Points
                    </button>
                </div>
            </div>

            <div className="space-y-24">
                {categories.map(cat => (
                    <section key={cat.id}>
                        <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                                <cat.icon size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{cat.label}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(gamesData as any)[cat.id].map((game: any) => (
                                <GameCard key={game.id} {...game} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
