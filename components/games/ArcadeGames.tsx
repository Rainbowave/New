
import React, { useState, useEffect, useRef } from 'react';
import { 
    X, Trophy, Bomb, Diamond, ArrowRightLeft, 
    RotateCw, Coins, Eye, Grid3X3, Hand, Scissors, 
    HelpCircle, Brain, Target, Dices, Gem, Zap, 
    RefreshCw, Flame, Spade, Club, Heart, Timer, 
    Palette, Circle, BoxSelect, ToggleLeft, Ghost, Clock, Pickaxe
} from 'lucide-react';
import { db } from '../../services/db';

interface GameProps {
    onClose: () => void;
    currentBalance: number;
    onUpdateBalance: (amount: number) => void;
    currentBet: number;
    onBetChange: (bet: number) => void;
}

const GameContainer = ({ title, onClose, balance, children, accentColor = "from-brand-900 to-black", icon: Icon = Trophy }: any) => {
    return (
        <div className={`w-full relative overflow-hidden rounded-md border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] bg-gradient-to-br flex flex-col min-h-[600px] ${accentColor}`}>
            <div className="relative z-10 flex justify-between items-center p-6 border-b border-white/5 bg-black/40 backdrop-blur-3xl">
                <div className="flex items-center gap-4">
                    <div className="bg-brand-600/10 p-2.5 rounded-sm border border-brand-500/20 shadow-lg shadow-brand-500/10">
                        <Icon size={24} className="text-brand-500" />
                    </div>
                    <div>
                        <h3 className="font-black text-xl uppercase tracking-tighter italic text-white leading-none">{title}</h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1.5">Balance: {(balance || 0).toLocaleString()} LSC</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-sm flex items-center justify-center text-gray-400 hover:text-white transition-all"><X size={28} /></button>
            </div>
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 w-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                {children}
            </div>
        </div>
    );
};

const useGameConfig = (gameId: string) => {
    const [config, setConfig] = useState<any>({});
    useEffect(() => {
        const c = db.getArcadeConfig(gameId);
        setConfig(c);
    }, [gameId]);
    return config;
};

// --- GAME LOGIC IMPLEMENTATIONS ---

// New: Time Miner (Clicker)
export const TimeMiner: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance }) => {
    const [lastMineTime, setLastMineTime] = useState<number>(() => {
        const saved = localStorage.getItem('arcade_miner_last');
        return saved ? parseInt(saved) : 0;
    });
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = now - lastMineTime;
            const hour = 60 * 60 * 1000;
            
            if (diff < hour) {
                setCooldown(hour - diff);
            } else {
                setCooldown(0);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastMineTime]);

    const handleMine = () => {
        if (cooldown > 0) return;
        
        const reward = 100;
        onUpdateBalance(reward);
        
        const now = Date.now();
        setLastMineTime(now);
        localStorage.setItem('arcade_miner_last', now.toString());
        
        db.addGameResult({ id: now, game: 'Time Miner', type: 'win', profit: reward, bet: 0, timestamp: now });
    };

    const formatTime = (ms: number) => {
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const seconds = Math.floor((ms / 1000) % 60);
        return `${minutes}m ${seconds}s`;
    };

    return (
        <GameContainer title="Time Miner" icon={Pickaxe} onClose={onClose} balance={currentBalance} accentColor="from-yellow-900 to-black">
             <div className="flex flex-col items-center gap-8 text-center max-w-md">
                 <div className={`w-40 h-40 rounded-full border-8 border-yellow-500/30 flex items-center justify-center relative overflow-hidden group ${cooldown === 0 ? 'cursor-pointer hover:border-yellow-400 hover:scale-105' : 'opacity-50 cursor-not-allowed'}`} onClick={handleMine}>
                     <div className="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>
                     {cooldown === 0 ? (
                         <Pickaxe size={64} className="text-yellow-500 animate-bounce" />
                     ) : (
                         <div className="flex flex-col items-center">
                             <Clock size={40} className="text-gray-400 mb-2" />
                             <span className="text-sm font-black text-white font-mono">{formatTime(cooldown)}</span>
                         </div>
                     )}
                 </div>
                 
                 <div>
                     <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
                         {cooldown === 0 ? "Ready to Mine" : "Recharging Core"}
                     </h2>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                         Click to generate <span className="text-yellow-500">100 Points</span>. <br/> System requires 60 minutes to recharge between cycles.
                     </p>
                 </div>

                 <button 
                    onClick={handleMine} 
                    disabled={cooldown > 0} 
                    className={`w-full py-4 rounded-sm font-black uppercase tracking-widest text-xs shadow-xl transition-all flex items-center justify-center gap-2 ${cooldown === 0 ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-dark-700 text-gray-500'}`}
                 >
                     {cooldown === 0 ? <><Zap size={16} fill="currentColor"/> MINE 100 POINTS</> : 'COOLING DOWN'}
                 </button>
             </div>
        </GameContainer>
    );
};

// 1. Head & Tail
export const HeadsOrTails: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const config = useGameConfig('heads');
    const [flipping, setFlipping] = useState(false);
    const [result, setResult] = useState<'HEADS' | 'TAILS' | null>(null);
    const [choice, setChoice] = useState<'HEADS' | 'TAILS' | null>(null);
    const [streak, setStreak] = useState(0);

    const play = () => {
        if (!choice || flipping || currentBet > currentBalance) return;
        if (currentBet < (config.minBet || 10)) { alert(`Min Bet: ${config.minBet}`); return; }

        onUpdateBalance(-currentBet);
        setFlipping(true);
        setResult(null);

        setTimeout(() => {
            // Determine outcome based on winChance
            const win = Math.random() * 100 < (config.winChance || 48);
            const outcome = win ? choice : (choice === 'HEADS' ? 'TAILS' : 'HEADS');
            
            setResult(outcome);
            setFlipping(false);

            if (outcome === choice) {
                const isStreak = streak + 1 >= 3;
                const bonus = isStreak ? (config.streakBonus || 5) : 0;
                const multiplier = 2 + (bonus / 100);
                onUpdateBalance(currentBet * multiplier);
                setStreak(s => s + 1);
                
                db.addGameResult({ id: Date.now(), game: 'Head & Tail', type: 'win', profit: currentBet * multiplier, bet: currentBet, timestamp: Date.now() });
            } else {
                setStreak(0);
                db.addGameResult({ id: Date.now(), game: 'Head & Tail', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
            }
        }, 1500);
    };

    return (
        <GameContainer title="Flip Fate" icon={Coins} onClose={onClose} balance={currentBalance} accentColor="from-amber-900 to-black">
             <div className="flex flex-col items-center gap-8">
                 <div className={`w-32 h-32 rounded-full border-4 border-amber-500 flex items-center justify-center text-4xl font-black text-amber-500 bg-black/50 transition-all ${flipping ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}>
                     {result ? result[0] : (flipping ? '?' : <Coins size={48} />)}
                 </div>
                 
                 <div className="flex gap-4">
                     <button onClick={() => setChoice('HEADS')} className={`px-6 py-3 rounded-xl border-2 font-black uppercase tracking-widest text-xs transition-all ${choice === 'HEADS' ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent border-white/20 text-white'}`}>Heads</button>
                     <button onClick={() => setChoice('TAILS')} className={`px-6 py-3 rounded-xl border-2 font-black uppercase tracking-widest text-xs transition-all ${choice === 'TAILS' ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent border-white/20 text-white'}`}>Tails</button>
                 </div>
                 
                 <button onClick={play} disabled={!choice || flipping} className="w-full bg-white text-black font-black py-4 px-12 rounded-sm uppercase tracking-widest text-xs disabled:opacity-50">FLIP COIN</button>
                 {streak > 1 && <div className="text-yellow-500 text-xs font-bold uppercase animate-pulse">Streak Bonus Active! +{config.streakBonus}%</div>}
             </div>
        </GameContainer>
    );
};

// 2. Rock Paper Scissors
export const RockPaperScissors: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const config = useGameConfig('rps');
    const [selection, setSelection] = useState<'rock' | 'paper' | 'scissors' | null>(null);
    const [cpuChoice, setCpuChoice] = useState<'rock' | 'paper' | 'scissors' | null>(null);
    const [result, setResult] = useState('');
    const [playing, setPlaying] = useState(false);

    const play = () => {
        if (!selection || playing || currentBet > currentBalance) return;
        onUpdateBalance(-currentBet);
        setPlaying(true);
        setCpuChoice(null);
        setResult('');

        setTimeout(() => {
            const choices: ('rock'|'paper'|'scissors')[] = ['rock', 'paper', 'scissors'];
            // Logic to respect winChance
            const willWin = Math.random() * 100 < (config.winChance || 33);
            let cpu;
            
            if (willWin) {
                if (selection === 'rock') cpu = 'scissors';
                else if (selection === 'paper') cpu = 'rock';
                else cpu = 'paper';
            } else {
                 // Randomize loss or tie
                 const remaining = choices.filter(c => {
                     if (selection === 'rock') return c !== 'scissors';
                     if (selection === 'paper') return c !== 'rock';
                     return c !== 'paper';
                 });
                 cpu = remaining[Math.floor(Math.random() * remaining.length)];
            }
            
            setCpuChoice(cpu);
            setPlaying(false);

            if (cpu === selection) {
                setResult('TIE');
                onUpdateBalance(currentBet); // Refund
            } else if (
                (selection === 'rock' && cpu === 'scissors') ||
                (selection === 'paper' && cpu === 'rock') ||
                (selection === 'scissors' && cpu === 'paper')
            ) {
                setResult('WIN');
                onUpdateBalance(currentBet * 2);
                db.addGameResult({ id: Date.now(), game: 'RPS', type: 'win', profit: currentBet, bet: currentBet, timestamp: Date.now() });
            } else {
                setResult('LOSE');
                db.addGameResult({ id: Date.now(), game: 'RPS', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
            }
        }, 1500);
    };

    return (
        <GameContainer title="Tactical Arena" icon={Hand} onClose={onClose} balance={currentBalance} accentColor="from-pink-900 to-black">
             <div className="flex flex-col items-center gap-8 w-full max-w-md">
                 <div className="flex justify-between w-full items-center text-4xl">
                     <div className={`transition-transform ${playing ? 'animate-bounce' : ''}`}>{selection === 'rock' ? '✊' : selection === 'paper' ? '✋' : selection === 'scissors' ? '✌️' : '❓'}</div>
                     <span className="text-sm font-black text-gray-500">VS</span>
                     <div className={`transition-transform ${playing ? 'animate-bounce' : ''}`}>{cpuChoice === 'rock' ? '✊' : cpuChoice === 'paper' ? '✋' : cpuChoice === 'scissors' ? '✌️' : '❓'}</div>
                 </div>
                 
                 <div className="flex gap-4">
                     {['rock', 'paper', 'scissors'].map(opt => (
                         <button key={opt} onClick={() => setSelection(opt as any)} className={`p-4 rounded-xl border-2 transition-all ${selection === opt ? 'bg-pink-600 border-pink-500' : 'bg-transparent border-white/20 hover:bg-white/5'}`}>
                             {opt === 'rock' ? <Circle /> : opt === 'paper' ? <Hand /> : <Scissors />}
                         </button>
                     ))}
                 </div>
                 
                 {result && <div className={`text-2xl font-black uppercase tracking-widest ${result === 'WIN' ? 'text-green-500' : result === 'LOSE' ? 'text-red-500' : 'text-yellow-500'}`}>{result}</div>}
                 
                 <button onClick={play} disabled={!selection || playing} className="w-full bg-white text-black font-black py-4 rounded-sm uppercase tracking-widest text-xs disabled:opacity-50">FIGHT</button>
             </div>
        </GameContainer>
    );
};

// 3. Spin Wheel
export const LuckyWheel: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const config = useGameConfig('wheel');
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [multiplier, setMultiplier] = useState<number | null>(null);

    const segments = [0, 2, 0, 5, 0, 1.5, 0, 10]; // Multipliers

    const spin = () => {
        if (spinning || currentBet > currentBalance) return;
        onUpdateBalance(-currentBet);
        setSpinning(true);
        setMultiplier(null);

        // Determine outcome
        const win = Math.random() * 100 < (config.winChance || 40);
        let landedIndex;
        
        if (win) {
            // Find positive multipliers indices
            const wins = segments.map((v, i) => v > 0 ? i : -1).filter(i => i !== -1);
            landedIndex = wins[Math.floor(Math.random() * wins.length)];
        } else {
             const losses = segments.map((v, i) => v === 0 ? i : -1).filter(i => i !== -1);
             landedIndex = losses[Math.floor(Math.random() * losses.length)];
        }

        const segmentAngle = 360 / segments.length;
        const targetRotation = 3600 + (landedIndex * segmentAngle); // 10 spins + target
        setRotation(targetRotation);

        setTimeout(() => {
            setSpinning(false);
            const resultMult = segments[landedIndex];
            setMultiplier(resultMult);
            if (resultMult > 0) {
                onUpdateBalance(currentBet * resultMult);
                db.addGameResult({ id: Date.now(), game: 'Wheel', type: 'win', profit: currentBet * resultMult, bet: currentBet, timestamp: Date.now() });
            } else {
                db.addGameResult({ id: Date.now(), game: 'Wheel', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
            }
        }, 4000); // 4s spin duration
    };

    return (
        <GameContainer title="Neon Wheel" icon={RotateCw} onClose={onClose} balance={currentBalance} accentColor="from-purple-900 to-black">
             <div className="flex flex-col items-center gap-10">
                 <div className="relative">
                     <div className="w-4 h-4 bg-white absolute -top-6 left-1/2 -translate-x-1/2 z-20" style={{clipPath: 'polygon(50% 100%, 0 0, 100% 0)'}}></div>
                     <div 
                        className="w-64 h-64 rounded-full border-4 border-purple-500 bg-dark-900 relative transition-transform duration-[4000ms] cubic-bezier(0.25, 0.1, 0.25, 1)"
                        style={{ transform: `rotate(-${rotation}deg)` }}
                     >
                         {segments.map((seg, i) => (
                             <div key={i} className="absolute top-1/2 left-1/2 w-full h-1 bg-white/10 origin-left" style={{ transform: `rotate(${i * (360/8)}deg)` }}>
                                 <span className="absolute right-4 -top-3 text-xs font-black text-white">{seg}x</span>
                             </div>
                         ))}
                     </div>
                 </div>
                 
                 {multiplier !== null && <div className="text-2xl font-black text-white uppercase tracking-widest">{multiplier > 0 ? `Won ${multiplier}x!` : 'Try Again'}</div>}
                 
                 <button onClick={spin} disabled={spinning} className="bg-purple-600 hover:bg-purple-500 text-white font-black py-4 px-12 rounded-sm uppercase tracking-widest text-xs shadow-lg disabled:opacity-50">SPIN</button>
             </div>
        </GameContainer>
    );
};

// 4. Number Guessing (High/Low)
export const NumberGuessing: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const config = useGameConfig('guess');
    const [target, setTarget] = useState(0);
    const [guess, setGuess] = useState('');
    const [status, setStatus] = useState<'idle' | 'playing' | 'win' | 'lose'>('idle');
    const [attempts, setAttempts] = useState(0);

    const startGame = () => {
        if (currentBet > currentBalance) return;
        if (currentBet < (config.minBet || 10)) { alert(`Min Bet: ${config.minBet}`); return; }
        
        onUpdateBalance(-currentBet);
        setTarget(Math.floor(Math.random() * 100) + 1);
        setAttempts(5); // 5 tries
        setStatus('playing');
        setGuess('');
    };

    const handleGuess = () => {
        const num = parseInt(guess);
        if (isNaN(num)) return;
        
        if (num === target) {
            const win = currentBet * (attempts * 2); // More attempts left = higher win
            onUpdateBalance(win);
            setStatus('win');
            db.addGameResult({ id: Date.now(), game: 'Guess', type: 'win', profit: win, bet: currentBet, timestamp: Date.now() });
        } else {
            setAttempts(a => a - 1);
            if (attempts <= 1) {
                setStatus('lose');
                db.addGameResult({ id: Date.now(), game: 'Guess', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
            }
        }
        setGuess('');
    };

    return (
        <GameContainer title="Neural Guess" icon={Brain} onClose={onClose} balance={currentBalance} accentColor="from-blue-900 to-black">
             <div className="w-full max-w-md text-center space-y-8">
                 <div className="text-6xl font-black text-white mb-4">{status === 'idle' ? '???' : status === 'playing' ? '???' : target}</div>
                 
                 {status === 'playing' && (
                     <div className="space-y-4">
                         <div className="text-sm font-bold text-gray-400">Attempts Left: {attempts}</div>
                         <input type="number" value={guess} onChange={e => setGuess(e.target.value)} className="bg-dark-900 border border-white/10 rounded-lg p-4 w-full text-center text-2xl text-white outline-none" placeholder="1-100" />
                         <button onClick={handleGuess} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-sm uppercase tracking-widest text-xs">Submit</button>
                     </div>
                 )}
                 
                 {status === 'idle' && <button onClick={startGame} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-sm uppercase tracking-widest text-xs">Start Game</button>}
                 {status === 'win' && <div className="text-green-500 font-black text-2xl uppercase">Correct! You Win! <button onClick={() => setStatus('idle')} className="block mt-4 text-xs underline text-white">Again</button></div>}
                 {status === 'lose' && <div className="text-red-500 font-black text-2xl uppercase">Game Over <button onClick={() => setStatus('idle')} className="block mt-4 text-xs underline text-white">Try Again</button></div>}
             </div>
        </GameContainer>
    );
};

// 5. Dice Rolling
export const CosmicDice: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const config = useGameConfig('dice');
    const [dice, setDice] = useState([1, 1]);
    const [rolling, setRolling] = useState(false);
    const [prediction, setPrediction] = useState<'under' | 'over' | 'seven'>('seven');

    const roll = () => {
        if (rolling || currentBet > currentBalance) return;
        onUpdateBalance(-currentBet);
        setRolling(true);
        
        setTimeout(() => {
            // Logic to respect winChance
            const willWin = Math.random() * 100 < (config.winChance || 40);
            let d1, d2, sum;
            
            if (willWin) {
                // Force a winning roll
                if (prediction === 'seven') { d1=3; d2=4; }
                else if (prediction === 'under') { d1=1; d2=2; }
                else { d1=5; d2=6; }
            } else {
                // Force a losing roll
                 if (prediction === 'seven') { d1=1; d2=1; }
                else if (prediction === 'under') { d1=5; d2=5; }
                else { d1=1; d2=2; }
            }
            // Add some randomness if not forced by simple logic above
            if (!willWin) {
                d1 = Math.floor(Math.random() * 6) + 1;
                d2 = Math.floor(Math.random() * 6) + 1;
                // Retry if accidental win (simple check)
                 if ((prediction === 'seven' && d1+d2===7) || (prediction === 'under' && d1+d2<7) || (prediction === 'over' && d1+d2>7)) {
                     d1 = d1 === 6 ? 1 : d1+1; 
                 }
            }

            sum = d1 + d2;
            setDice([d1, d2]);
            setRolling(false);
            
            const won = (prediction === 'seven' && sum === 7) || (prediction === 'under' && sum < 7) || (prediction === 'over' && sum > 7);
            
            if (won) {
                const multi = prediction === 'seven' ? 5 : 2;
                onUpdateBalance(currentBet * multi);
                db.addGameResult({ id: Date.now(), game: 'Dice', type: 'win', profit: currentBet * multi, bet: currentBet, timestamp: Date.now() });
            } else {
                 db.addGameResult({ id: Date.now(), game: 'Dice', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
            }
        }, 1000);
    };

    return (
        <GameContainer title="Cosmic Dice" icon={Dices} onClose={onClose} balance={currentBalance} accentColor="from-green-900 to-black">
             <div className="flex flex-col items-center gap-8">
                 <div className="flex gap-4">
                     {dice.map((d, i) => (
                         <div key={i} className={`w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl font-black text-black border-4 border-gray-300 shadow-xl ${rolling ? 'animate-bounce' : ''}`}>
                             {d}
                         </div>
                     ))}
                 </div>
                 <div className="flex gap-4">
                     <button onClick={() => setPrediction('under')} className={`px-6 py-3 rounded-lg border-2 font-black uppercase text-xs ${prediction === 'under' ? 'bg-green-500 border-green-500 text-black' : 'border-white/20 text-white'}`}>Under 7 (2x)</button>
                     <button onClick={() => setPrediction('seven')} className={`px-6 py-3 rounded-lg border-2 font-black uppercase text-xs ${prediction === 'seven' ? 'bg-green-500 border-green-500 text-black' : 'border-white/20 text-white'}`}>Lucky 7 (5x)</button>
                     <button onClick={() => setPrediction('over')} className={`px-6 py-3 rounded-lg border-2 font-black uppercase text-xs ${prediction === 'over' ? 'bg-green-500 border-green-500 text-black' : 'border-white/20 text-white'}`}>Over 7 (2x)</button>
                 </div>
                 <button onClick={roll} disabled={rolling} className="w-full bg-white text-black font-black py-4 rounded-sm uppercase tracking-widest text-xs disabled:opacity-50 shadow-lg">ROLL</button>
             </div>
        </GameContainer>
    );
};

// 6. Card Finding (Ace Hunter)
export const CardFinding: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const config = useGameConfig('ace');
    const [cards, setCards] = useState([0, 1, 2]); // 0=Lose, 1=Ace
    const [shuffling, setShuffling] = useState(false);
    const [revealed, setRevealed] = useState<number | null>(null);
    const [winningIndex, setWinningIndex] = useState(0);

    const start = () => {
        if (shuffling || currentBet > currentBalance) return;
        onUpdateBalance(-currentBet);
        setShuffling(true);
        setRevealed(null);
        
        setTimeout(() => {
            // Respect winChance
             const willWin = Math.random() * 100 < (config.winChance || 33);
             // We just set state, the click determines result
             const target = Math.floor(Math.random() * 3);
             setWinningIndex(target);
             setShuffling(false);
        }, 1000);
    };

    const pick = (index: number) => {
        if (shuffling || revealed !== null) return;
        
        const willWin = Math.random() * 100 < (config.winChance || 33);
        let finalWinningIndex = winningIndex;
        
        // Rigging logic based on config
        if (willWin) finalWinningIndex = index;
        else if (finalWinningIndex === index) finalWinningIndex = (index + 1) % 3;

        setWinningIndex(finalWinningIndex);
        setRevealed(index);

        if (index === finalWinningIndex) {
            onUpdateBalance(currentBet * 3);
            db.addGameResult({ id: Date.now(), game: 'Ace Hunter', type: 'win', profit: currentBet * 3, bet: currentBet, timestamp: Date.now() });
        } else {
             db.addGameResult({ id: Date.now(), game: 'Ace Hunter', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
        }
    };

    return (
        <GameContainer title="Ace Hunter" icon={Spade} onClose={onClose} balance={currentBalance} accentColor="from-slate-900 to-black">
             <div className="flex flex-col items-center gap-12">
                 <div className="flex gap-4 h-48">
                     {[0, 1, 2].map(i => (
                         <div 
                            key={i} 
                            onClick={() => !shuffling && revealed === null && pick(i)}
                            className={`w-32 h-48 bg-white rounded-xl border-4 border-gray-300 cursor-pointer transition-transform duration-500 ${shuffling ? 'translate-y-4' : ''} flex items-center justify-center`}
                         >
                             {revealed !== null && i === winningIndex ? (
                                 <Spade size={64} className="text-black" />
                             ) : revealed !== null && i === revealed ? (
                                 <X size={64} className="text-red-500" />
                             ) : (
                                 <div className="w-full h-full bg-brand-900 rounded-lg pattern-grid-lg"></div>
                             )}
                         </div>
                     ))}
                 </div>
                 {revealed === null && !shuffling && <button onClick={start} className="bg-white text-black font-black py-3 px-10 rounded-sm uppercase tracking-widest text-xs">Deal Cards</button>}
                 {revealed !== null && <button onClick={start} className="bg-white text-black font-black py-3 px-10 rounded-sm uppercase tracking-widest text-xs">Play Again</button>}
             </div>
        </GameContainer>
    );
};

// 7. Number Slot (Crypto Slots)
export const SlotMachine: React.FC<GameProps & {type: string}> = ({ onClose, currentBalance, onUpdateBalance, currentBet, type }) => {
    const config = useGameConfig('crypto_slots');
    const [reels, setReels] = useState([0, 0, 0]);
    const [spinning, setSpinning] = useState(false);
    
    const spin = () => {
        if (spinning || currentBet > currentBalance) return;
        onUpdateBalance(-currentBet);
        setSpinning(true);
        
        setTimeout(() => {
            const willWin = Math.random() * 100 < (config.winChance || 30);
            let res;
            if (willWin) {
                const val = Math.floor(Math.random() * 7);
                res = [val, val, val];
            } else {
                res = [Math.floor(Math.random()*7), Math.floor(Math.random()*7), Math.floor(Math.random()*7)];
                // Prevent accidental win
                if (res[0] === res[1] && res[1] === res[2]) res[2] = (res[2] + 1) % 7;
            }
            setReels(res);
            setSpinning(false);
            
            if (res[0] === res[1] && res[1] === res[2]) {
                const multi = res[0] === 7 ? 100 : 10;
                onUpdateBalance(currentBet * multi);
                db.addGameResult({ id: Date.now(), game: 'Slots', type: 'win', profit: currentBet * multi, bet: currentBet, timestamp: Date.now() });
            } else {
                 db.addGameResult({ id: Date.now(), game: 'Slots', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
            }
        }, 2000);
    };

    const icons = ['🍒', '🍋', '🍇', '🍉', '🔔', '💎', '7️⃣'];

    return (
        <GameContainer title="Crypto Slots" icon={Gem} onClose={onClose} balance={currentBalance} accentColor="from-yellow-900 to-black">
             <div className="flex flex-col items-center gap-10">
                 <div className="flex gap-4 p-8 bg-black/40 rounded-3xl border-4 border-yellow-600 shadow-[0_0_50px_rgba(202,138,4,0.3)]">
                     {reels.map((r, i) => (
                         <div key={i} className="w-24 h-32 bg-white rounded-xl flex items-center justify-center text-6xl shadow-inner border-2 border-gray-300 overflow-hidden">
                             <div className={spinning ? 'animate-pulse blur-sm' : ''}>{icons[r]}</div>
                         </div>
                     ))}
                 </div>
                 <button onClick={spin} disabled={spinning} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black py-4 px-16 rounded-sm uppercase tracking-widest text-sm shadow-xl disabled:opacity-50 transform active:scale-95 transition-all">SPIN</button>
             </div>
        </GameContainer>
    );
};

// 8. Roulette
export const Roulette: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const config = useGameConfig('roulette');
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState<'red' | 'black' | 'green' | null>(null);

    const spin = () => {
        if (!selectedColor || currentBet > currentBalance) return;
        onUpdateBalance(-currentBet);
        setSpinning(true);
        setTimeout(() => {
            const num = Math.floor(Math.random() * 37); // 0-36
            setResult(num);
            setSpinning(false);
            
            const color = num === 0 ? 'green' : (num % 2 === 0 ? 'red' : 'black'); // Simplified logic
            
            if (color === selectedColor) {
                const multi = color === 'green' ? 14 : 2;
                onUpdateBalance(currentBet * multi);
                db.addGameResult({ id: Date.now(), game: 'Roulette', type: 'win', profit: currentBet * multi, bet: currentBet, timestamp: Date.now() });
            } else {
                 db.addGameResult({ id: Date.now(), game: 'Roulette', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
            }
        }, 2000);
    };

    return (
        <GameContainer title="Cyber Roulette" icon={Circle} onClose={onClose} balance={currentBalance} accentColor="from-red-900 to-black">
             <div className="text-center space-y-8">
                 <div className={`w-32 h-32 rounded-full border-4 border-white/10 mx-auto flex items-center justify-center bg-dark-900 text-4xl font-black text-white ${spinning ? 'animate-spin' : ''}`}>
                     {result !== null ? result : <RotateCw />}
                 </div>
                 <div className="flex gap-4 justify-center">
                     <button onClick={() => setSelectedColor('red')} className={`w-16 h-16 bg-red-600 rounded-full border-4 ${selectedColor === 'red' ? 'border-white' : 'border-transparent'}`}></button>
                     <button onClick={() => setSelectedColor('green')} className={`w-16 h-16 bg-green-600 rounded-full border-4 ${selectedColor === 'green' ? 'border-white' : 'border-transparent'}`}></button>
                     <button onClick={() => setSelectedColor('black')} className={`w-16 h-16 bg-black rounded-full border-4 ${selectedColor === 'black' ? 'border-white' : 'border-transparent'}`}></button>
                 </div>
                 <button onClick={spin} disabled={spinning || !selectedColor} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-sm uppercase tracking-widest text-xs disabled:opacity-50">Spin Wheel</button>
             </div>
        </GameContainer>
    );
};

// 9. Keno
export const Keno: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const config = useGameConfig('keno');
    const [selected, setSelected] = useState<number[]>([]);
    const [drawn, setDrawing] = useState<number[]>([]);
    const [playing, setPlaying] = useState(false);

    const toggleNum = (n: number) => {
        if (playing) return;
        if (selected.includes(n)) setSelected(prev => prev.filter(x => x !== n));
        else if (selected.length < 10) setSelected(prev => [...prev, n]);
    };

    const play = () => {
        if (selected.length === 0 || currentBet > currentBalance) return;
        onUpdateBalance(-currentBet);
        setPlaying(true);
        setDrawing([]);
        
        const draws: number[] = [];
        const interval = setInterval(() => {
            const n = Math.floor(Math.random() * 40) + 1; // 40 max for this small grid
            if (!draws.includes(n)) {
                draws.push(n);
                setDrawing([...draws]);
            }
            if (draws.length === 10) {
                clearInterval(interval);
                setPlaying(false);
                const matches = selected.filter(s => draws.includes(s)).length;
                if (matches > 0) {
                     const multi = matches * 1.5; // Simplified payout
                     onUpdateBalance(currentBet * multi);
                     db.addGameResult({ id: Date.now(), game: 'Keno', type: 'win', profit: currentBet * multi, bet: currentBet, timestamp: Date.now() });
                } else {
                     db.addGameResult({ id: Date.now(), game: 'Keno', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
                }
            }
        }, 200);
    };

    return (
        <GameContainer title="Keno Grid" icon={Grid3X3} onClose={onClose} balance={currentBalance} accentColor="from-purple-900 to-black">
            <div className="grid grid-cols-8 gap-2 mb-8">
                {Array.from({ length: 40 }).map((_, i) => { // Reduced grid for UI fit
                    const n = i + 1;
                    const isSel = selected.includes(n);
                    const isDrawn = drawn.includes(n);
                    return (
                        <button 
                            key={n} 
                            onClick={() => toggleNum(n)}
                            className={`w-8 h-8 rounded text-[10px] font-bold flex items-center justify-center transition-all ${isDrawn && isSel ? 'bg-green-500 text-black' : isDrawn ? 'bg-yellow-500 text-black' : isSel ? 'bg-brand-500 text-white' : 'bg-dark-900 text-gray-500 border border-white/5'}`}
                        >
                            {n}
                        </button>
                    )
                })}
            </div>
            <button onClick={play} disabled={playing || selected.length === 0} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-sm uppercase tracking-widest text-xs disabled:opacity-50">Draw Numbers</button>
        </GameContainer>
    );
};

// 10. Black Jack
export const BlackJack: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const [playerHand, setPlayerHand] = useState<number[]>([]);
    const [dealerHand, setDealerHand] = useState<number[]>([]);
    const [status, setStatus] = useState<'bet' | 'play' | 'end'>('bet');
    const [msg, setMsg] = useState('');

    const deal = () => {
        if (currentBet > currentBalance) return;
        onUpdateBalance(-currentBet);
        setPlayerHand([Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1]);
        setDealerHand([Math.floor(Math.random() * 10) + 1]);
        setStatus('play');
        setMsg('');
    };

    const hit = () => {
        const card = Math.floor(Math.random() * 10) + 1;
        const newHand = [...playerHand, card];
        setPlayerHand(newHand);
        const sum = newHand.reduce((a,b) => a+b, 0);
        if (sum > 21) {
            setMsg('BUST');
            setStatus('end');
             db.addGameResult({ id: Date.now(), game: 'Blackjack', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
        }
    };

    const stand = () => {
        let dHand = [...dealerHand];
        let sum = dHand.reduce((a,b) => a+b, 0);
        while (sum < 17) {
            const card = Math.floor(Math.random() * 10) + 1;
            dHand.push(card);
            sum += card;
        }
        setDealerHand(dHand);
        const pSum = playerHand.reduce((a,b) => a+b, 0);
        
        if (sum > 21 || pSum > sum) {
            setMsg('WIN');
            onUpdateBalance(currentBet * 2);
             db.addGameResult({ id: Date.now(), game: 'Blackjack', type: 'win', profit: currentBet, bet: currentBet, timestamp: Date.now() });
        } else if (pSum === sum) {
            setMsg('PUSH');
            onUpdateBalance(currentBet);
        } else {
            setMsg('LOSE');
             db.addGameResult({ id: Date.now(), game: 'Blackjack', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
        }
        setStatus('end');
    };

    return (
        <GameContainer title="Blackjack 21" icon={Spade} onClose={onClose} balance={currentBalance} accentColor="from-green-900 to-black">
             <div className="w-full max-w-md space-y-8 text-center">
                 <div>
                     <h4 className="text-gray-500 font-bold uppercase text-xs mb-2">Dealer</h4>
                     <div className="flex justify-center gap-2">
                         {dealerHand.map((c, i) => <div key={i} className="w-12 h-16 bg-white rounded text-black font-black flex items-center justify-center text-xl border-2 border-gray-300">{c}</div>)}
                     </div>
                 </div>
                 <div>
                     <h4 className="text-gray-500 font-bold uppercase text-xs mb-2">Player ({playerHand.reduce((a,b)=>a+b,0)})</h4>
                     <div className="flex justify-center gap-2">
                         {playerHand.map((c, i) => <div key={i} className="w-12 h-16 bg-white rounded text-black font-black flex items-center justify-center text-xl border-2 border-gray-300">{c}</div>)}
                     </div>
                 </div>
                 {msg && <div className="text-3xl font-black text-white uppercase animate-bounce">{msg}</div>}
                 
                 {status === 'bet' ? (
                     <button onClick={deal} className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-sm uppercase tracking-widest text-xs">Deal</button>
                 ) : status === 'play' ? (
                     <div className="flex gap-4">
                         <button onClick={hit} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-black py-4 rounded-sm uppercase tracking-widest text-xs">Hit</button>
                         <button onClick={stand} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-sm uppercase tracking-widest text-xs">Stand</button>
                     </div>
                 ) : (
                    <button onClick={() => setStatus('bet')} className="w-full bg-dark-700 hover:bg-dark-600 text-white font-black py-4 rounded-sm uppercase tracking-widest text-xs">New Round</button>
                 )}
             </div>
        </GameContainer>
    );
};

// 11. Mines
export const Mines: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const config = useGameConfig('mines');
    const [grid, setGrid] = useState(Array(25).fill('hidden'));
    const [bombs, setBombs] = useState<number[]>([]);
    const [playing, setPlaying] = useState(false);
    const [safeCount, setSafeCount] = useState(0);

    const start = () => {
        if (currentBet > currentBalance) return;
        onUpdateBalance(-currentBet);
        setGrid(Array(25).fill('hidden'));
        setSafeCount(0);
        
        // Place 3 random bombs
        const newBombs = [];
        while(newBombs.length < 3) {
            const r = Math.floor(Math.random() * 25);
            if(!newBombs.includes(r)) newBombs.push(r);
        }
        setBombs(newBombs);
        setPlaying(true);
    };

    const clickCell = (index: number) => {
        if (!playing || grid[index] !== 'hidden') return;
        
        const newGrid = [...grid];
        if (bombs.includes(index)) {
            newGrid[index] = 'bomb';
            setPlaying(false);
             db.addGameResult({ id: Date.now(), game: 'Mines', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
        } else {
            newGrid[index] = 'gem';
            setSafeCount(c => c + 1);
        }
        setGrid(newGrid);
    };

    const cashout = () => {
        const multi = 1 + (safeCount * 0.2);
        const win = currentBet * multi;
        onUpdateBalance(win);
        setPlaying(false);
        db.addGameResult({ id: Date.now(), game: 'Mines', type: 'win', profit: win - currentBet, bet: currentBet, timestamp: Date.now() });
    };

    return (
        <GameContainer title="Extraction Grid" icon={Bomb} onClose={onClose} balance={currentBalance} accentColor="from-red-900 to-black">
             <div className="flex flex-col items-center gap-6">
                 <div className="grid grid-cols-5 gap-2">
                     {grid.map((cell, i) => (
                         <div 
                            key={i} 
                            onClick={() => clickCell(i)}
                            className={`w-12 h-12 rounded bg-dark-900 border border-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 ${cell === 'bomb' ? 'bg-red-500' : cell === 'gem' ? 'bg-green-500' : ''}`}
                         >
                             {cell === 'bomb' && <Bomb size={20} className="text-black" />}
                             {cell === 'gem' && <Gem size={20} className="text-white" />}
                         </div>
                     ))}
                 </div>
                 
                 <div className="flex gap-4 w-full max-w-xs">
                     {!playing && <button onClick={start} className="flex-1 bg-white text-black font-black py-4 rounded-sm uppercase tracking-widest text-xs">Start Run</button>}
                     {playing && <button onClick={cashout} disabled={safeCount === 0} className="flex-1 bg-green-500 text-white font-black py-4 rounded-sm uppercase tracking-widest text-xs">Cashout ({(1 + safeCount * 0.2).toFixed(1)}x)</button>}
                 </div>
             </div>
        </GameContainer>
    );
};

// 12. Color Prediction
export const ColorPrediction: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const [selected, setSelected] = useState('');
    const [result, setResult] = useState('');
    const [timer, setTimer] = useState(0);

    const play = (color: string) => {
        if (currentBet > currentBalance) return;
        onUpdateBalance(-currentBet);
        setSelected(color);
        setResult('');
        setTimer(3);
        const t = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(t);
                    const outcome = Math.random() > 0.5 ? 'red' : 'blue'; 
                    setResult(outcome);
                    if (outcome === color) {
                        onUpdateBalance(currentBet * 1.9);
                        db.addGameResult({ id: Date.now(), game: 'Color', type: 'win', profit: currentBet * 0.9, bet: currentBet, timestamp: Date.now() });
                    } else {
                        db.addGameResult({ id: Date.now(), game: 'Color', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <GameContainer title="Color Predict" icon={Palette} onClose={onClose} balance={currentBalance} accentColor="from-indigo-900 to-black">
            <div className="w-full max-w-md text-center space-y-8">
                <div className={`w-32 h-32 rounded-full mx-auto border-4 border-white/20 flex items-center justify-center text-4xl font-black text-white ${result === 'red' ? 'bg-red-500' : result === 'blue' ? 'bg-blue-500' : 'bg-dark-900'}`}>
                    {timer > 0 ? timer : result ? '' : '?'}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => play('red')} disabled={timer > 0} className="py-8 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest border-b-4 border-red-800 disabled:opacity-50">Red</button>
                    <button onClick={() => play('blue')} disabled={timer > 0} className="py-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest border-b-4 border-blue-800 disabled:opacity-50">Blue</button>
                </div>
            </div>
        </GameContainer>
    );
};

// 13. Crazy Times
export const CrazyTimes: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
    const [spinning, setSpinning] = useState(false);
    const [multiplier, setMultiplier] = useState(0);

    const play = () => {
         if (currentBet > currentBalance) return;
         onUpdateBalance(-currentBet);
         setSpinning(true);
         setTimeout(() => {
             const m = [0, 2, 5, 10, 0, 1][Math.floor(Math.random() * 6)];
             setMultiplier(m);
             setSpinning(false);
             if (m > 0) {
                 onUpdateBalance(currentBet * m);
                 db.addGameResult({ id: Date.now(), game: 'Crazy', type: 'win', profit: currentBet * m, bet: currentBet, timestamp: Date.now() });
             } else {
                 db.addGameResult({ id: Date.now(), game: 'Crazy', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
             }
         }, 3000);
    };

    return (
        <GameContainer title="Crazy Times" icon={Timer} onClose={onClose} balance={currentBalance} accentColor="from-yellow-900 to-black">
             <div className="text-center space-y-8">
                 <div className={`w-64 h-64 rounded-full border-8 border-yellow-500/50 mx-auto flex items-center justify-center bg-dark-900 relative ${spinning ? 'animate-spin' : ''}`}>
                     <div className="absolute inset-0 bg-[conic-gradient(var(--tw-gradient-stops))] from-yellow-500 via-purple-500 to-pink-500 opacity-20 rounded-full"></div>
                     <span className="text-4xl font-black text-white">{spinning ? '...' : `${multiplier}x`}</span>
                 </div>
                 <button onClick={play} disabled={spinning} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-sm uppercase tracking-widest text-xs disabled:opacity-50">Spin Crazy</button>
             </div>
        </GameContainer>
    );
};

// 14. Double Or Nothing (Placeholder Logic for completeness)
export const DoubleOrNothing: React.FC<GameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet }) => {
     const [step, setStep] = useState(0);
     const [playing, setPlaying] = useState(false);
     
     const play = (action: 'take' | 'risk') => {
         if (action === 'risk') {
             if (step === 0) {
                 if (currentBet > currentBalance) return;
                 onUpdateBalance(-currentBet);
                 setPlaying(true);
             }
             
             if (Math.random() > 0.5) {
                 setStep(s => s + 1);
             } else {
                 setStep(0);
                 setPlaying(false);
                 db.addGameResult({ id: Date.now(), game: 'Double', type: 'loss', profit: -currentBet, bet: currentBet, timestamp: Date.now() });
             }
         } else {
             // Take
             const win = currentBet * Math.pow(2, step);
             onUpdateBalance(win);
             setStep(0);
             setPlaying(false);
             db.addGameResult({ id: Date.now(), game: 'Double', type: 'win', profit: win, bet: currentBet, timestamp: Date.now() });
         }
     };

     return (
        <GameContainer title="Double Protocol" icon={ArrowRightLeft} onClose={onClose} balance={currentBalance} accentColor="from-cyan-900 to-black">
             <div className="text-center space-y-8">
                 <div className="text-4xl font-black text-white uppercase italic">{step === 0 ? 'Risk It?' : `${Math.pow(2, step)}x Multiplier`}</div>
                 <div className="flex gap-4">
                     <button onClick={() => play('risk')} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-sm uppercase tracking-widest text-xs">Risk (Double)</button>
                     {step > 0 && <button onClick={() => play('take')} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-sm uppercase tracking-widest text-xs">Take Profit</button>}
                 </div>
             </div>
        </GameContainer>
     );
};