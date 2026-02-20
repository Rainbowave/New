
import React, { useState } from 'react';
import { Search, HelpCircle, ChevronDown, Clock, ShieldCheck, Smile, CheckCircle, LifeBuoy, Mail, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HelpCenter() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        { q: "How do I verify my account?", a: "Go to Settings > Verification Center. Generate a code and upload a selfie holding it." },
        { q: "What is the difference between memberships?", a: "PreStar removes ads and gives 1080p. LuciStar includes 4K streaming, lower fees, and gold badge." },
        { q: "How do payouts work?", a: "Withdrawals are processed within 24-48 hours via Stripe (Fiat) or NowPayments (Crypto)." },
        { q: "Can I change my username?", a: "Yes, you can change your username once every 30 days in Profile Settings." },
        { q: "What content is allowed?", a: "We support creative freedom. Adult content is permitted in Naughty mode. Illegal content is strictly prohibited." },
        { q: "How do I start streaming?", a: "Click the 'Go Live' button in the sidebar or 'Create' menu. You'll need to set up your stream key in OBS." }
    ];

    const stats = [
        { label: "Avg Response", value: "2h", icon: Clock, color: "text-blue-500" },
        { label: "Satisfaction", value: "99%", icon: Smile, color: "text-green-500" },
        { label: "Active Mods", value: "24", icon: ShieldCheck, color: "text-brand-500" },
        { label: "Resolved Today", value: "142", icon: CheckCircle, color: "text-purple-500" },
    ];

    const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-dark-900 p-8 pb-32 animate-in fade-in">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 text-brand-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-500/20">
                        <HelpCircle size={14} /> Support Hub
                    </div>
                    <h1 className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">
                        How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">Help?</span>
                    </h1>
                    <div className="max-w-lg mx-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for answers..." 
                            className="w-full bg-dark-800 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-brand-500 outline-none transition-all shadow-lg font-bold"
                        />
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-dark-800 border border-dark-700 rounded-3xl overflow-hidden shadow-2xl mb-16">
                    {filteredFaqs.map((faq, i) => (
                        <div key={i} className="border-b border-white/5 last:border-0">
                            <button 
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors group"
                            >
                                <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{faq.q}</span>
                                <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-brand-500' : ''}`} />
                            </button>
                            <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-brand-500 pl-4">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                    {filteredFaqs.length === 0 && (
                        <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">No results found matching your query.</div>
                    )}
                </div>

                {/* Community Stats */}
                <div className="mb-16">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                        <LifeBuoy size={24} className="text-brand-500" /> Community Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-dark-800 border border-dark-700 p-6 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-brand-500/30 transition-all shadow-lg hover:-translate-y-1">
                                <div className={`p-3 rounded-full bg-dark-900 mb-3 ${stat.color} bg-opacity-10 group-hover:scale-110 transition-transform border border-white/5`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
                                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
