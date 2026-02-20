
import React, { useState } from 'react';
import { Gift, Copy, Check, Users, DollarSign, Share2, TrendingUp, Sparkles } from 'lucide-react';

const ReferralCard = ({ code, reward, claims }: { code: string, reward: string, claims: number }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-dark-800 border border-white/5 hover:border-brand-500/50 rounded-sm p-8 relative overflow-hidden transition-all group shadow-xl">
            <div className="absolute top-0 right-0 p-20 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-colors pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                            <Sparkles size={10} className="text-yellow-500" /> Referral Code
                        </h3>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase drop-shadow-lg">{code}</span>
                            <button 
                                onClick={handleCopy} 
                                className="w-10 h-10 rounded-full bg-dark-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-500 hover:bg-brand-500 transition-all shadow-lg active:scale-95"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-yellow-900/20 rotate-3 group-hover:rotate-6 transition-transform">
                        <Gift size={28} />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-dark-900/50 rounded-sm p-5 border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Reward / Invite</div>
                        <div className="font-black text-xl text-yellow-500 italic tracking-tight">{reward}</div>
                    </div>
                    <div className="bg-dark-900/50 rounded-sm p-5 border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Total Referrals</div>
                        <div className="font-black text-white text-xl italic tracking-tight">{claims}</div>
                    </div>
                </div>

                <button className="w-full bg-white text-black hover:bg-brand-500 hover:text-white font-black py-4 rounded-sm transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]">
                    <Share2 size={16} /> Share Referral
                </button>
            </div>
        </div>
    );
}

const BonusHistory = () => (
    <div className="bg-dark-800 border border-white/5 rounded-sm overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-dark-900/80 backdrop-blur-md flex justify-between items-center">
            <h3 className="font-black text-white text-sm uppercase italic tracking-widest flex items-center gap-3">
                <TrendingUp size={16} className="text-brand-500" /> Bonus History
            </h3>
            <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Recent Activity</div>
        </div>
        <div className="divide-y divide-white/[0.03]">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-default group">
                    <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-sm bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                            <DollarSign size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="font-black text-white text-xs uppercase italic tracking-tight mb-0.5">Referral Multiplier</div>
                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">User_{Math.floor(Math.random() * 9999)} referred</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-black text-yellow-500 tabular-nums italic text-sm">+5.00 LSC</div>
                        <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">2h ago</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)

export default function Referrals() {
    return (
        <div className="w-full min-h-screen bg-dark-900">
            <div className="max-w-6xl mx-auto py-16 px-6 lg:px-12 space-y-16">
                
                {/* Header */}
                <div className="text-center relative">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter leading-[0.9]">
                        Grow the Pride <br/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Earn Rewards</span>
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed">
                        Monetize your social circle. Introduce new creators to the Pride and receive recurring rewards.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <ReferralCard code="SANCTUARY25" reward="5.00 LSC" claims={12} />
                    
                    <div className="bg-dark-800 rounded-sm p-10 relative overflow-hidden border border-white/5 hover:border-brand-500/30 transition-all group shadow-xl h-full flex flex-col justify-between">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">Growth Bonus</h3>
                            <p className="text-gray-400 mb-8 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                Reach 50 referred users this month to unlock the exclusive <span className="text-brand-500 font-black">"Pride Builder"</span> rank and a 100 LSC reward bonus.
                            </p>
                            
                            <div className="mb-2 flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-white">
                                <span>Progress</span>
                                <span className="text-brand-500">24%</span>
                            </div>
                            <div className="w-full bg-dark-900 rounded-full h-2 mb-6 overflow-hidden border border-white/5">
                                <div className="bg-gradient-to-r from-brand-600 to-brand-400 h-full w-[24%] shadow-[0_0_10px_rgba(144,9,51,0.5)]"></div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="bg-dark-900/50 px-4 py-2 rounded-sm border border-white/5">
                                    <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest">Current</span>
                                    <span className="text-white font-black text-lg italic">12</span>
                                </div>
                                <div className="bg-dark-900/50 px-4 py-2 rounded-sm border border-white/5">
                                    <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest">Goal</span>
                                    <span className="text-gray-400 font-black text-lg italic">50</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative BG elements */}
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-colors pointer-events-none"></div>
                    </div>
                </div>

                <BonusHistory />
                
                <div className="pt-12 border-t border-white/5 text-center opacity-30">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-[1.5em]">Referral Program Active</span>
                </div>
            </div>
        </div>
    );
}
