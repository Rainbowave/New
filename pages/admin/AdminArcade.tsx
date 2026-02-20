
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Gamepad2, Save, RefreshCw, Trophy, AlertTriangle, 
    Zap, Coins, Percent, Lock, Unlock, Sliders, Activity,
    TrendingUp, ArrowUpRight, ArrowDownRight, Dices, RotateCw, Gem, Brain, Target, Spade, Grid3X3, Palette, Timer, ArrowRightLeft, HelpCircle, Eye, Bomb, Users, DollarSign, Clock, LayoutGrid
} from 'lucide-react';
import { db } from '../../services/db';
import { Loader2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const GameConfigCard = ({ id, gameKey, config, stats, onUpdate, icon: Icon }: any) => {
    const handleChange = (field: string, value: any) => {
        onUpdate(gameKey, field, value);
    };

    // Calculate House Edge roughly (100 - winChance * payoutMultiplier approx)
    // For demo, we just color code win chance.
    const riskLevel = config.winChance > 60 ? 'text-red-500' : config.winChance > 40 ? 'text-yellow-500' : 'text-green-500';

    return (
        <div className={`bg-dark-800 border ${config.enabled ? 'border-brand-500/30' : 'border-dark-700 opacity-70'} rounded-2xl p-6 transition-all shadow-xl group hover:border-brand-500/50`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${config.enabled ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-dark-700 text-gray-500'}`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-white text-lg uppercase italic tracking-tight">{id}</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                            {config.enabled ? <span className="text-green-500">Online</span> : <span>Disabled</span>}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => handleChange('enabled', !config.enabled)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${config.enabled ? 'bg-brand-600' : 'bg-dark-900 border border-white/10'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${config.enabled ? 'left-7' : 'left-1'}`}></div>
                </button>
            </div>

            {/* Stats Mini Bar */}
            <div className="grid grid-cols-2 gap-2 mb-6 bg-dark-900/50 p-3 rounded-xl border border-white/5">
                <div>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Rounds</span>
                    <span className="text-sm font-bold text-white">{stats?.rounds || 0}</span>
                </div>
                <div className="text-right">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Net PnL</span>
                    <span className={`text-sm font-bold ${stats?.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stats?.profit > 0 ? '+' : ''}{stats?.profit || 0}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className={`space-y-5 transition-opacity ${config.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                
                {/* Win Chance */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Zap size={12} /> Win Probability
                        </label>
                        <span className={`text-xs font-black ${riskLevel}`}>{config.winChance}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" max="99" 
                        value={config.winChance} 
                        onChange={(e) => handleChange('winChance', parseInt(e.target.value))}
                        className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-brand-500 border border-white/5"
                    />
                </div>

                {/* Bet Limits */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Min Bet</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={config.minBet}
                                onChange={(e) => handleChange('minBet', parseInt(e.target.value))}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white font-bold text-xs focus:border-brand-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Max Bet</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={config.maxBet}
                                onChange={(e) => handleChange('maxBet', parseInt(e.target.value))}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white font-bold text-xs focus:border-brand-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Bonus Multiplier if applicable */}
                {config.streakBonus !== undefined && (
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Streak Bonus %</label>
                        <div className="relative">
                             <input 
                                type="number" 
                                value={config.streakBonus}
                                onChange={(e) => handleChange('streakBonus', parseInt(e.target.value))}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white font-bold text-xs focus:border-brand-500 outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Mini Chart for Time Stats (Reused)
const MiniTimeChart = ({ color, seed }: { color: string, seed: number }) => {
    const data = useMemo(() => {
         return Array.from({ length: 7 }).map((_, i) => ({
             val: 30 + Math.abs(Math.sin(i + seed) * 50) + (Math.random() * 10)
         }));
    }, [seed]);

    return (
        <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`gradient-arcade`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#gradient-arcade)`} isAnimationActive={true} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const ArcadeStatsPanel = ({ activeGames, totalWagered }: { activeGames: number, totalWagered: number }) => {
    const totalRounds = Math.floor(totalWagered / 50); // Estimate
    const activePlayers = Math.floor(totalRounds / 10);
    const jackpotsWon = Math.floor(totalRounds * 0.001);
    const avgSession = "14m 20s";

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 animate-in slide-in-from-top-4">
             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 bg-blue-500/5 rounded-full blur-xl -mr-4 -mt-4"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><RotateCw size={10}/> Total Rounds</p>
                 <h3 className="text-2xl font-black text-white">{totalRounds.toLocaleString()}</h3>
             </div>
             
             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 bg-green-500/5 rounded-full blur-xl -mr-4 -mt-4"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><DollarSign size={10} className="text-green-500"/> Total Wagered</p>
                 <h3 className="text-2xl font-black text-white">{(totalWagered / 1000).toFixed(1)}k</h3>
             </div>

             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 bg-purple-500/5 rounded-full blur-xl -mr-4 -mt-4"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Users size={10} className="text-purple-500"/> Active Players</p>
                 <h3 className="text-2xl font-black text-white">{activePlayers.toLocaleString()}</h3>
             </div>

             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 bg-pink-500/5 rounded-full blur-xl -mr-4 -mt-4"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Gamepad2 size={10} className="text-pink-500"/> Active Games</p>
                 <h3 className="text-2xl font-black text-white">{activeGames}</h3>
             </div>

             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 bg-yellow-500/5 rounded-full blur-xl -mr-4 -mt-4"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Trophy size={10} className="text-yellow-500"/> Jackpots</p>
                 <h3 className="text-2xl font-black text-white">{jackpotsWon}</h3>
             </div>

             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={10}/> Avg Session</p>
                        <h3 className="text-xl font-black text-white">{avgSession}</h3>
                     </div>
                     <MiniTimeChart color="#ec4899" seed={totalWagered} />
                 </div>
             </div>
        </div>
    );
};

export default function AdminArcade() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [gameStats, setGameStats] = useState<any>({});
    const [totalWagered, setTotalWagered] = useState(0);

    const GAMES_META = [
        { key: 'heads', name: 'Flip Fate', icon: Coins },
        { key: 'rps', name: 'Rock Paper Scissors', icon: Brain },
        { key: 'wheel', name: 'Neon Wheel', icon: RotateCw },
        { key: 'guess', name: 'Neural Guess', icon: HelpCircle },
        { key: 'dice', name: 'Cosmic Dice', icon: Dices },
        { key: 'ace', name: 'Ace Hunter', icon: Eye },
        { key: 'crypto_slots', name: 'Crypto Slots', icon: Gem },
        { key: 'roulette', name: 'Roulette', icon: Trophy },
        { key: 'keno', name: 'Keno', icon: Grid3X3 },
        { key: 'blackjack', name: 'Blackjack', icon: Spade },
        { key: 'mines', name: 'Mines', icon: Bomb },
        { key: 'color', name: 'Color Predict', icon: Palette },
        { key: 'crazy', name: 'Crazy Times', icon: Timer },
        { key: 'double', name: 'Double Protocol', icon: ArrowRightLeft },
    ];

    useEffect(() => {
        const loadData = async () => {
            await new Promise(r => setTimeout(r, 600));
            const data = db.getSiteSettings();
            
            // Ensure arcade config exists
            if (!data.configs.arcade) {
                data.configs.arcade = { games: {} };
                GAMES_META.forEach(g => {
                    data.configs.arcade.games[g.key] = { enabled: true, winChance: 45, minBet: 10, maxBet: 1000, streakBonus: 0 };
                });
            }

            setSettings(data);
            
            // Mock Calculate Stats from History (In real app, fetch aggregated stats)
            const history = db.getGameHistory();
            const stats: any = {};
            let total = 0;
            history.forEach((h: any) => {
                // Map game name to key roughly for demo
                const key = GAMES_META.find(g => g.name.includes(h.game) || h.game.includes(g.name))?.key || 'unknown';
                if (!stats[key]) stats[key] = { rounds: 0, profit: 0 };
                stats[key].rounds += 1;
                // Profit is from user perspective in DB, so House PnL is inverted
                stats[key].profit -= h.profit;
                total += h.bet; 
            });
            setGameStats(stats);
            setTotalWagered(total);
            
            setLoading(false);
        };
        loadData();
    }, []);

    const handleUpdate = (gameKey: string, field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            configs: {
                ...prev.configs,
                arcade: {
                    ...prev.configs.arcade,
                    games: {
                        ...prev.configs.arcade.games,
                        [gameKey]: {
                            ...prev.configs.arcade.games[gameKey],
                            [field]: value
                        }
                    }
                }
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        db.saveSiteSettings(settings);
        db.logAction('admin', 'update_arcade_config', 'system', 'arcade', 'Updated game probabilities');
        setSaving(false);
        alert('Arcade configuration updated successfully.');
    };

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="animate-spin text-brand-500" size={48} /></div>;

    const activeGamesCount = GAMES_META.filter(g => settings.configs.arcade.games[g.key]?.enabled).length;

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
                        <Gamepad2 className="text-brand-500" size={32} /> Arcade Protocol
                    </h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        Configure game mechanics, risk levels, and house edge.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-dark-800 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3 shadow-lg">
                        <div className="text-right">
                            <span className="block text-[9px] font-black text-gray-500 uppercase tracking-widest">House PnL (24h)</span>
                            <span className="text-lg font-black text-green-400">+42,500 LSC</span>
                        </div>
                        <div className="p-2 bg-green-900/20 rounded-lg text-green-500"><TrendingUp size={20} /></div>
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-brand-600 hover:bg-brand-500 text-white font-black py-2 px-8 rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Config
                    </button>
                </div>
            </div>

            {/* NEW STATS PANEL */}
            <ArcadeStatsPanel activeGames={activeGamesCount} totalWagered={totalWagered} />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {GAMES_META.map(game => (
                    <GameConfigCard 
                        key={game.key}
                        id={game.name}
                        gameKey={game.key}
                        icon={game.icon}
                        config={settings.configs.arcade.games[game.key] || { enabled: true, winChance: 50, minBet: 10, maxBet: 100 }}
                        stats={gameStats[game.key]}
                        onUpdate={handleUpdate}
                    />
                ))}
            </div>

            <div className="mt-12 p-6 bg-yellow-900/10 border border-yellow-500/20 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="text-yellow-500 shrink-0" size={24} />
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">Risk Management Warning</h4>
                    <p className="text-xs text-yellow-200/70 font-medium leading-relaxed">
                        Adjusting win probabilities significantly can affect platform liquidity. 
                        Ensure 'House Edge' is maintained above 2% for long-term sustainability. 
                        Changes apply immediately to new game sessions.
                    </p>
                </div>
            </div>
        </div>
    );
}
