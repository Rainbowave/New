
import React from 'react';
import { DollarSign, Star, Tag, ArrowRight } from 'lucide-react';

interface BenefitsBannerProps {
    title?: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    icon?: any;
}

export const BenefitsBanner: React.FC<BenefitsBannerProps> = ({
    title = "Cash Out System",
    description = "Convert your points to real money using NowPayments integration. Supports multiple cryptocurrencies and traditional payment methods.",
    buttonText = "Withdraw Funds",
    onButtonClick,
    icon: Icon = DollarSign
}) => (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between border border-blue-500/30 gap-6 shadow-xl relative overflow-hidden mt-12">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 flex-1">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shadow-sm">
                    <Icon size={24} className="text-blue-200" />
                </div>
                {title}
            </h2>
            <p className="text-blue-100/80 leading-relaxed max-w-2xl text-base font-medium">{description}</p>
            
            {/* Optional visual indicators for benefits if needed, strictly based on prompt 'benefits of publishing' usually implies text */}
            <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-blue-300 text-xs font-bold bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/20">
                    <Star size={12} fill="currentColor" /> Instant Payouts
                </div>
                <div className="flex items-center gap-1.5 text-blue-300 text-xs font-bold bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/20">
                    <Tag size={12} /> Global Reach
                </div>
            </div>
        </div>
        
        <button
            onClick={onButtonClick}
            className="bg-white text-blue-900 font-bold py-3.5 px-8 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 whitespace-nowrap z-10"
        >
            {buttonText} <ArrowRight size={18} />
        </button>
    </div>
);

export const PopularTags = () => (
    <div className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
            <Tag className="text-blue-500" size={18} />
            <h3 className="font-bold text-white text-sm">Popular Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
            {['#portrait', '#landscape', '#artistic', '#lifestyle', '#professional', '#creative', '#outdoor', '#studio', '#natural', '#editorial'].map(tag => (
                <button key={tag} className="px-3 py-1.5 bg-dark-900 border border-dark-600 hover:border-brand-500 text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-all">
                    {tag}
                </button>
            ))}
        </div>
    </div>
);

export const Watermark = ({ className = "" }: { className?: string }) => (
    <div className={`absolute bottom-3 right-3 z-30 pointer-events-none select-none opacity-60 ${className}`}>
        <div className="flex items-center gap-1">
            <span className="text-xl font-black text-white tracking-widest uppercase font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                LuciSin
            </span>
        </div>
    </div>
);
