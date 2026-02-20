
import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, Trophy, TrendingUp, TrendingDown, Clock, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';

export default function GameHistory() {
    const navigate = useNavigate();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 600));
            setHistory(db.getGameHistory());
            setLoading(false);
        };
        fetchHistory();
    }, []);

    const totalProfit = history.reduce((acc, curr) => acc + curr.profit, 0);

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex items-center gap-4 mb-10">
                <button onClick={() => navigate('/arcade')} className="p-2 hover:bg-dark-800 rounded-full text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                        <History className="text-brand-500" /> Arcade Yields
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Pride Performance Log</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Total Rounds</span>
                    <span className="text-3xl font-black text-white">{history.length}</span>
                </div>
                <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Profit/Loss</span>
                    <span className={`text-3xl font-black ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()} LSC
                    </span>
                </div>
                <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Net Balance</span>
                    <span className="text-3xl font-black text-brand-400">{(1250).toLocaleString()} LSC</span>
                </div>
            </div>

            <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Arcade Session Logs</h3>
                    <div className="flex gap-2">
                        <button className="p-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-500 hover:text-white"><Filter size={16}/></button>
                        <button className="p-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-500 hover:text-white"><Search size={16}/></button>
                    </div>
                </div>
                
                <div className="divide-y divide-dark-700">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Retrieving logs from database...</div>
                    ) : history.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No arcade signals found in identity logs.</div>
                    ) : (
                        history.map((row) => (
                            <div key={row.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${row.type === 'win' ? 'bg-green-900/20 border-green-500/20 text-green-500' : 'bg-red-900/20 border-red-500/20 text-red-500'}`}>
                                        {row.type === 'win' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    </div>
                                    <div>
                                        <div className="font-black text-white text-sm uppercase tracking-tight">{row.game}</div>
                                        <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1 uppercase">
                                            <Clock size={10} /> {new Date(row.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className={`font-black text-lg ${row.type === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                                        {row.type === 'win' ? '+' : ''}{row.profit.toLocaleString()} LSC
                                    </div>
                                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                        Bet: {row.bet} LSC
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
