
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Coins, Trophy, History, Zap, Minus, Plus, 
  BarChart, Activity
} from 'lucide-react';
import { 
    SlotMachine, HeadsOrTails, LuckyWheel, RockPaperScissors, 
    Mines, CardFinding, DoubleOrNothing, CosmicDice, 
    NumberGuessing, Roulette, Keno, BlackJack, ColorPrediction, CrazyTimes,
    TimeMiner
} from '../components/games/ArcadeGames';
import { api } from '../services/api';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const gameId = id || 'crypto_slots';
  
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(100);
  const [stakeLevel, setStakeLevel] = useState('Casual');
  const [turboMode, setTurboMode] = useState('1x');
  const [netProfit, setNetProfit] = useState(0);
  const [rounds, setRounds] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const wallet = await api.get<any>('/wallet');
        if (wallet?.balance) setBalance(wallet.balance);
      } catch (e) { console.error(e); }
    };
    fetchBalance();
  }, []);

  const handleUpdateBalance = async (amount: number) => {
    setBalance(prev => prev + amount);
    if (amount > 0) setNetProfit(prev => prev + amount); // Should track profit vs bet properly in a real app
    setRounds(prev => prev + 1);
    try { await api.post('/wallet/update', { amount }); } catch (e) {}
  };

  const stakeLevels = ['Casual', 'Club', 'High Roller', 'Whale'];
  const turboModes = ['1x', '5x', '25x', '50x', '100x'];

  const renderGame = () => {
      const common = { onClose: () => navigate('/arcade'), currentBalance: balance, onUpdateBalance: handleUpdateBalance, currentBet: betAmount, onBetChange: setBetAmount };
      switch(gameId) {
          case 'miner': return <TimeMiner {...common} />;
          case 'crypto_slots': return <SlotMachine type="crypto" {...common} />;
          case 'wheel': return <LuckyWheel {...common} />;
          case 'heads': return <HeadsOrTails {...common} />;
          case 'rps': return <RockPaperScissors {...common} />;
          case 'mines': return <Mines {...common} />;
          case 'ace': return <CardFinding {...common} />;
          case 'double': return <DoubleOrNothing {...common} />;
          case 'dice': return <CosmicDice {...common} />;
          case 'guess': return <NumberGuessing {...common} />;
          case 'roulette': return <Roulette {...common} />;
          case 'keno': return <Keno {...common} />;
          case 'blackjack': return <BlackJack {...common} />;
          case 'color': return <ColorPrediction {...common} />;
          case 'crazy': return <CrazyTimes {...common} />;
          default: return <SlotMachine type="classic" {...common} />;
      }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col p-4 md:p-10 gap-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center w-full max-w-[1500px] mx-auto">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate('/arcade')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <div className="p-2 bg-dark-800 rounded-full group-hover:bg-dark-700"><ArrowLeft size={20} /></div>
            <span className="text-sm font-bold uppercase tracking-wider">Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Arcade Arena</h1>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] mt-2">Active Gaming Environment v4.2</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 px-8 py-4 bg-[#0d0d0f] border border-white/10 rounded-md shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-brand-500/20 group-hover:bg-brand-500 transition-colors"></div>
            <Coins size={24} className="text-brand-500" />
            <span className="font-mono font-black text-2xl text-white tabular-nums tracking-tighter">{balance.toLocaleString()}</span>
          </div>
          <button onClick={() => navigate('/points')} className="hidden md:flex items-center gap-3 px-8 py-5 bg-brand-500 hover:bg-brand-600 rounded-md text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-brand-900/30 transition-all active:scale-95">
            <Plus size={18} strokeWidth={3} /> Deposit Credits
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1500px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
          <div className="bg-[#0d0d0f] border border-white/5 rounded-md p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-10 relative z-10">
              <Zap className="text-brand-500" size={24} fill="currentColor" />
              <h2 className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Round Control</h2>
            </div>

            <div className="space-y-10 relative z-10">
              <div>
                <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mb-5 block">Stake Hierarchy</label>
                <div className="grid grid-cols-2 gap-3">
                  {stakeLevels.map(level => (
                    <button key={level} onClick={() => setStakeLevel(level)} className={`py-4 px-1 rounded-sm text-[10px] font-black uppercase tracking-widest border-2 transition-all ${stakeLevel === level ? 'bg-white text-black border-white shadow-2xl scale-[1.02]' : 'bg-dark-900 border-white/5 text-gray-700 hover:border-white/20'}`}>{level}</button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                   <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">Wager Value</label>
                   <span className="text-[9px] text-gray-800 font-black uppercase tracking-widest border border-white/5 px-2 rounded-full">Cap: 2000 LSC</span>
                </div>
                <div className="flex items-center bg-dark-900 border-2 border-white/5 rounded-sm overflow-hidden group hover:border-brand-500/30 transition-all shadow-inner">
                  <button onClick={() => setBetAmount(Math.max(10, betAmount - 50))} className="p-6 hover:bg-white/5 text-gray-600 border-r border-white/5 transition-colors active:text-white"><Minus size={18}/></button>
                  <div className="flex-1 flex flex-col items-center py-4">
                    <span className="text-3xl font-black text-white leading-none italic tabular-nums tracking-tighter">{betAmount}</span>
                  </div>
                  <button onClick={() => setBetAmount(betAmount + 50)} className="p-6 hover:bg-white/5 text-gray-600 border-l border-white/5 transition-colors active:text-white"><Plus size={18}/></button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-5">
                  <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">Processing Speed</label>
                </div>
                <div className="flex bg-dark-900 border-2 border-white/5 rounded-sm p-1.5 shadow-inner">
                  {turboModes.map(mode => (
                    <button key={mode} onClick={() => setTurboMode(mode)} className={`flex-1 py-3.5 rounded-sm text-[10px] font-black uppercase tracking-tighter transition-all ${turboMode === mode ? 'bg-brand-500 text-white shadow-xl scale-105' : 'text-gray-700 hover:text-white'}`}>{mode}</button>
                  ))}
                </div>
              </div>

              <div className="bg-dark-800/40 border border-white/5 rounded-md p-6 flex items-center gap-6 mt-8">
                  <div className="w-14 h-14 rounded-full bg-dark-900 border border-white/5 flex items-center justify-center text-gray-500">
                      <History size={24} />
                  </div>
                  <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Last High Yield</h4>
                      <p className="text-xl font-black text-brand-500 italic tracking-tighter">2,450 LSC (10m ago)</p>
                  </div>
              </div>

              <div className="pt-6 space-y-4">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-700 border-t border-white/5 pt-8">
                      <span>SESSION ROUNDS</span>
                      <span className="text-white tabular-nums">{rounds}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-700">
                      <span>CUMULATIVE YIELD</span>
                      <span className={`tabular-nums ${netProfit >= 0 ? 'text-brand-500' : 'text-red-500'}`}>{netProfit > 0 ? '+' : ''}{netProfit} LSC</span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 h-full flex flex-col order-1 lg:order-2">
          {renderGame()}
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-800/40 border border-white/5 rounded-md p-6 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-dark-900 border border-white/5 flex items-center justify-center text-gray-500">
                      <BarChart size={24} />
                  </div>
                  <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Global Return</h4>
                      <p className="text-xl font-black text-white italic tracking-tighter">98.4% Efficiency</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}