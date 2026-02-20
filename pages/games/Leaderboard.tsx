
import React from 'react';
import { Trophy, Crown, Medal, User } from 'lucide-react';

const LeaderboardRow = ({ rank, name, score, avatar, change }: any) => {
    let rankDisplay;
    let bgClass = "bg-dark-800 border-dark-700";

    if (rank === 1) {
        rankDisplay = <Crown className="text-yellow-500 fill-yellow-500" size={24} />;
        bgClass = "bg-gradient-to-r from-yellow-900/20 to-dark-800 border-yellow-500/30";
    } else if (rank === 2) {
        rankDisplay = <Medal className="text-gray-300 fill-gray-300" size={24} />;
        bgClass = "bg-dark-800 border-gray-600/30";
    } else if (rank === 3) {
        rankDisplay = <Medal className="text-orange-400 fill-orange-400" size={24} />;
        bgClass = "bg-dark-800 border-orange-500/30";
    } else {
        rankDisplay = <span className="text-lg font-bold text-gray-500 w-6 text-center">{rank}</span>;
    }

    return (
        <div className={`flex items-center gap-4 p-4 rounded-2xl border ${bgClass} mb-3 transition-transform hover:scale-[1.01]`}>
            <div className="w-8 flex justify-center shrink-0">{rankDisplay}</div>
            <img src={avatar} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt={name} />
            <div className="flex-1">
                <h4 className="font-bold text-white text-lg">{name}</h4>
                <p className="text-xs text-gray-500">Level 42 • Pro Gamer</p>
            </div>
            <div className="text-right">
                <div className="font-black text-xl text-white tracking-tight">{score.toLocaleString()}</div>
                <div className={`text-xs font-bold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {change > 0 ? '+' : ''}{change}%
                </div>
            </div>
        </div>
    );
};

export default function Leaderboard() {
    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30 shadow-xl shadow-yellow-900/20">
                    <Trophy className="text-yellow-500" size={32} />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Global Leaderboard</h1>
                <p className="text-gray-400">Top players this week in Cosmic Clicker</p>
            </div>

            <div className="flex justify-center gap-2 mb-8">
                {['Weekly', 'Monthly', 'All Time'].map((t) => (
                    <button 
                        key={t}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${t === 'Weekly' ? 'bg-white text-black' : 'bg-dark-800 text-gray-400 hover:bg-dark-700'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="space-y-1">
                <LeaderboardRow rank={1} name="CyberNinja" score={154200} avatar="https://picsum.photos/100/100?random=90" change={12} />
                <LeaderboardRow rank={2} name="PixelQueen" score={142100} avatar="https://picsum.photos/100/100?random=91" change={5} />
                <LeaderboardRow rank={3} name="GlitchMaster" score={138900} avatar="https://picsum.photos/100/100?random=92" change={-2} />
                <LeaderboardRow rank={4} name="RetroGamer" score={112000} avatar="https://picsum.photos/100/100?random=93" change={8} />
                <LeaderboardRow rank={5} name="NeonDrifter" score={98500} avatar="https://picsum.photos/100/100?random=94" change={1} />
                <LeaderboardRow rank={6} name="StarLord" score={87200} avatar="https://picsum.photos/100/100?random=95" change={-5} />
            </div>
        </div>
    );
}
