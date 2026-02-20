
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Video, DollarSign, Users, Zap, Shield, BarChart2, Globe, ArrowRight, 
    Check, ShoppingBag, BookOpen, Smartphone, Crown, HelpCircle, ChevronDown, 
    Play, Rocket, Coins, Gift, Gamepad2
} from 'lucide-react';

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-dark-700">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left hover:text-brand-400 transition-colors"
            >
                <span className="font-bold text-lg text-white italic uppercase tracking-tighter">{question}</span>
                <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 pb-6' : 'max-h-0'}`}>
                <p className="text-gray-400 leading-relaxed font-medium">{answer}</p>
            </div>
        </div>
    );
};

const RevenueCard = ({ title, percent, desc, icon: Icon, color }: any) => (
    <div className="bg-dark-800 border border-dark-700 p-8 rounded-[5px] relative overflow-hidden group hover:border-brand-500/50 transition-all">
        <div className={`absolute top-0 right-0 p-24 ${color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`}></div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-[5px] ${color.replace('bg-', 'bg-').replace('500', '900/20')} flex items-center justify-center ${color.replace('bg-', 'text-')}`}>
                    <Icon size={28} />
                </div>
                <span className="text-3xl font-black text-white italic tracking-tighter">{percent}%</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{title}</h3>
            <p className="text-gray-400 text-xs font-bold leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default function StartCreating() {
    const navigate = useNavigate();
    const [sliderValue, setSliderValue] = useState(1000);

    const calculateEarnings = (followers: number) => {
        const base = followers * 0.05;
        return Math.floor(base * 12).toLocaleString(); 
    };

    return (
        <div className="min-h-screen bg-dark-900 text-white font-sans selection:bg-brand-500/30">
            <nav className="fixed top-0 w-full z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-purple-600 rounded flex items-center justify-center font-bold text-white text-xl">L</div>
                        <span className="text-xl font-bold tracking-tight uppercase">LuciSin <span className="text-brand-400">Creators</span></span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/auth')} className="bg-white text-black px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
                            Join Now
                        </button>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-dark-800 border border-dark-700 px-4 py-1.5 rounded-full text-brand-300 text-[10px] font-black mb-8 uppercase tracking-[0.3em]">
                        <Rocket size={14} /> The Creator Platform
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none italic uppercase">
                        Grow Your Brand.<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400">Maximize Earnings.</span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-bold uppercase tracking-tight">
                        The all-in-one platform for Live Streams, Shorts, Comics, and Collection sales. Keep 100% of your primary content revenue.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={() => navigate('/auth')} className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-5 rounded-[5px] font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 transition-transform hover:scale-105">
                            Start Creating <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div id="benefits" className="py-24 bg-dark-800/30 border-y border-dark-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-white mb-4 italic uppercase tracking-tighter">Tools to Help You Succeed</h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Everything you need to build a business around your content.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-dark-800 p-8 rounded-[5px] border border-dark-700 hover:border-red-500/50 transition-all group">
                            <div className="w-14 h-14 bg-red-900/20 rounded-[5px] flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                                <Video size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight italic">Live Streaming</h3>
                            <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-wider">Fast, low-latency streaming with built-in tipping and interaction.</p>
                        </div>

                        <div className="bg-dark-800 p-8 rounded-[5px] border border-dark-700 hover:border-blue-500/50 transition-all group">
                            <div className="w-14 h-14 bg-blue-900/20 rounded-[5px] flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                <Smartphone size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight italic">Shorts</h3>
                            <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-wider">Grow fast with a feed designed for discovery and engagement.</p>
                        </div>

                        <div className="bg-dark-800 p-8 rounded-[5px] border border-dark-700 hover:border-purple-500/50 transition-all group">
                            <div className="w-14 h-14 bg-purple-900/20 rounded-[5px] flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight italic">Comics</h3>
                            <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-wider">Publish chapters easily and build a dedicated reader base.</p>
                        </div>

                        <div className="bg-dark-800 p-8 rounded-[5px] border border-dark-700 hover:border-green-500/50 transition-all group">
                            <div className="w-14 h-14 bg-green-900/20 rounded-[5px] flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                                <ShoppingBag size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight italic">Collection</h3>
                            <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-wider">Sell digital items, merch, or services directly to your community.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="earnings" className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <div className="sticky top-24">
                            <div className="inline-flex items-center gap-2 bg-green-900/20 border border-green-500/30 px-3 py-1 rounded-full text-green-400 text-[10px] font-black mb-6 uppercase tracking-widest">
                                <DollarSign size={14} /> Fair Payouts
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 italic uppercase tracking-tighter leading-none">Keep All Your Sales</h2>
                            <p className="text-lg text-gray-500 mb-10 leading-relaxed font-bold uppercase tracking-tight">
                                We believe you should keep what you earn. We take 0% of your sales and subscriptions, only charging a small fee when you withdraw funds.
                            </p>
                        </div>

                        <div className="space-y-6 pt-10">
                            <RevenueCard 
                                title="Subscriptions" 
                                percent="100" 
                                desc="Keep all monthly revenue from your members. You define the tiers."
                                icon={Crown}
                                color="bg-yellow-500"
                            />
                            <RevenueCard 
                                title="Collection Sales" 
                                percent="100" 
                                desc="Sell art, videos, or assets. No platform cuts on your products."
                                icon={ShoppingBag}
                                color="bg-green-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
