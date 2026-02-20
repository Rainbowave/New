
import React, { useState, useEffect } from 'react';
import { X, Dices, Trophy, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';

interface DiceGameProps {
    onClose: () => void;
    currentBalance: number;
    onUpdateBalance: (amount: number) => void;
    currentBet: number;
    onBetChange: (bet: number) => void;
}

const Die = ({ value, rolling }: { value: number, rolling: boolean }) => {
    // Dot positions for each face
    const dots: { [key: number]: number[] } = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8]
    };

    return (
        <div className={`w-20 h-20 bg-white rounded-xl shadow-inner border-2 border-gray-200 flex flex-wrap p-2 justify-between content-between transition-transform duration-100 ${rolling ? 'animate-spin' : ''}`}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className={`w-4 h-4 rounded-full ${dots[value].includes(i) ? 'bg-black' : 'invisible'}`}></div>
            ))}
        </div>
    );
};

export const DiceGame: React.FC<DiceGameProps> = ({ onClose, currentBalance, onUpdateBalance, currentBet, onBetChange }) => {
    const [choice, setChoice] = useState<'low' | 'seven' | 'high' | null>(null);
    const [dice, setDice] = useState<[number, number]>([1, 1]);
    const [rolling, setRolling] = useState(false);
    const [result, setResult] = useState<'win' | 'loss' | null>(null);
    const [winAmount, setWinAmount] = useState(0);

    const handleRoll = () => {
        if (!choice || rolling || currentBet > currentBalance) return;
        
        // Deduct bet immediately
        onUpdateBalance(-currentBet); 
        
        setRolling(true);
        setResult(null);
        setWinAmount(0);

        // Animation loop
        const interval = setInterval(() => {
            setDice([
                Math.ceil(Math.random() * 6),
                Math.ceil(Math.random() * 6)
            ]);
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const d1 = Math.ceil(Math.random() * 6);
            const d2 = Math.ceil(Math.random() * 6);
            const sum = d1 + d2;
            setDice([d1, d2]);
            setRolling(false);
            
            determineWinner(sum);
        }, 1500);
    };

    const determineWinner = (sum: number) => {
        let won = false;
        let multiplier = 0;

        if (choice === 'low' && sum < 7) { won = true; multiplier = 2; }
        else if (choice === 'high' && sum > 7) { won = true; multiplier = 2; }
        else if (choice === 'seven' && sum === 7) { won = true; multiplier = 5; }

        if (won) {
            const winnings = currentBet * multiplier;
            setWinAmount(winnings);
            setResult('win');
            onUpdateBalance(winnings); // Payout winnings
        } else {
            setResult('loss');
            // Bet already deducted
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-dark-800 border border-dark-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="p-4 bg-dark-900 border-b border-dark-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Dices className="text-brand-500" />
                        <span className="font-bold text-white">Cosmic Dice</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs font-bold text-gray-400 bg-dark-800 px-3 py-1 rounded-full border border-dark-600">
                            Balance: <span className="text-white">{currentBalance.toLocaleString()}</span>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-dark-700 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Game Area */}
                <div className="p-8 flex flex-col items-center bg-gradient-to-b from-dark-800 to-dark-900">
                    
                    {/* Dice Display */}
                    <div className="flex gap-8 mb-10 p-8 bg-green-900/20 rounded-3xl border-4 border-green-900/30 relative">
                        <Die value={dice[0]} rolling={rolling} />
                        <Die value={dice[1]} rolling={rolling} />
                        
                        {/* Result Overlay */}
                        {!rolling && result && (
                            <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-black uppercase tracking-wider text-sm shadow-lg ${result === 'win' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}`}>
                                {result === 'win' ? `You Won ${winAmount}!` : 'You Lost'}
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="w-full space-y-6">
                        {/* Bet Amount */}
                        <div className="flex items-center justify-center gap-4">
                            <button onClick={() => onBetChange(Math.max(10, currentBet - 10))} className="p-2 bg-dark-700 rounded-lg hover:bg-dark-600 text-white"><ChevronDown /></button>
                            <div className="flex flex-col items-center w-32">
                                <span className="text-xs text-gray-500 uppercase font-bold">Bet Amount</span>
                                <span className="text-2xl font-black text-white">{currentBet}</span>
                            </div>
                            <button onClick={() => onBetChange(currentBet + 10)} className="p-2 bg-dark-700 rounded-lg hover:bg-dark-600 text-white"><ChevronUp /></button>
                        </div>

                        {/* Betting Options */}
                        <div className="grid grid-cols-3 gap-3">
                            <button 
                                onClick={() => setChoice('low')}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${choice === 'low' ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/50' : 'bg-dark-700 border-dark-600 text-gray-400 hover:bg-dark-600'}`}
                            >
                                <span className="text-lg font-black">Low</span>
                                <span className="text-[10px] opacity-70">2-6 (2x)</span>
                            </button>
                            
                            <button 
                                onClick={() => setChoice('seven')}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${choice === 'seven' ? 'bg-yellow-600 border-yellow-500 text-white shadow-lg shadow-yellow-900/50' : 'bg-dark-700 border-dark-600 text-gray-400 hover:bg-dark-600'}`}
                            >
                                <span className="text-lg font-black">7</span>
                                <span className="text-[10px] opacity-70">Lucky 7 (5x)</span>
                            </button>

                            <button 
                                onClick={() => setChoice('high')}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${choice === 'high' ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/50' : 'bg-dark-700 border-dark-600 text-gray-400 hover:bg-dark-600'}`}
                            >
                                <span className="text-lg font-black">High</span>
                                <span className="text-[10px] opacity-70">8-12 (2x)</span>
                            </button>
                        </div>

                        {/* Roll Button */}
                        <button 
                            onClick={handleRoll}
                            disabled={!choice || rolling || currentBet > currentBalance}
                            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-xl shadow-green-900/30 text-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            {rolling ? <RefreshCw className="animate-spin" /> : <Dices />}
                            ROLL DICE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
