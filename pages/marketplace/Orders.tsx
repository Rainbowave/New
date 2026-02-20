
import React, { useState, useMemo } from 'react';
import { Package, Search, Download, FileText, HardDrive, Smartphone, Filter, CheckCircle, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LibraryItem {
    id: string;
    name: string;
    desc: string;
    type: 'purchased' | 'free';
    image: string;
    size: string;
    date: string;
    price: string;
}

const CollectionItemCard: React.FC<{ item: LibraryItem }> = ({ item }) => {
    const navigate = useNavigate();

    const handleAction = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (item.type === 'free') {
            navigate(`/collection/view/${item.id}`);
        } else {
            alert(`Downloading ${item.name}...`);
        }
    };

    return (
        <div onClick={handleAction} className="bg-dark-800 border border-white/5 rounded-xl p-4 hover:border-brand-500/50 transition-all group flex flex-col h-full cursor-pointer">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-dark-900 border border-white/5">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-sm text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                    {item.size}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                        onClick={handleAction}
                        className="bg-white text-black font-black px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 shadow-xl"
                    >
                        {item.type === 'free' ? <Eye size={14} /> : <Download size={14} />} 
                        {item.type === 'free' ? 'View' : 'Download'}
                    </button>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-1">{item.desc}</p>
                
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest">
                         <span className={item.type === 'purchased' ? 'text-green-400' : 'text-blue-400'}>
                             {item.type === 'purchased' ? 'Purchased' : 'Free Claim'}
                         </span>
                    </div>
                    <span className="text-[9px] text-gray-600 font-bold">{item.date}</span>
                </div>
            </div>
        </div>
    );
};

export default function MyCollection() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'purchased' | 'free'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const libraryItems: LibraryItem[] = [
        { id: '1', name: "Cyberpunk Overlay Pack v2", desc: "OBS / Streamlabs", type: 'purchased', image: "https://picsum.photos/300/300?random=101", size: "124MB", date: "Oct 24", price: "$25.00" },
        { id: '2', name: "Pro Luts Bundle 2025", desc: "For Premiere & DaVinci", type: 'purchased', image: "https://picsum.photos/300/300?random=102", size: "45MB", date: "Oct 22", price: "$30.00" },
        { id: '3', name: "Sound FX Library: Sci-Fi", desc: "WAV / MP3", type: 'purchased', image: "https://picsum.photos/300/300?random=103", size: "850MB", date: "Oct 22", price: "$15.00" },
        { id: '4', name: "Exclusive Wallpaper Set 4K", desc: "Desktop & Mobile", type: 'free', image: "https://picsum.photos/300/300?random=104", size: "28MB", date: "Oct 20", price: "Free" },
        { id: '5', name: "Streamer Starter Kit", desc: "Graphics & Alerts", type: 'free', image: "https://picsum.photos/300/300?random=105", size: "200MB", date: "Oct 15", price: "Free" },
        { id: '6', name: "Retro Wave Music Pack", desc: "Copyright Free", type: 'purchased', image: "https://picsum.photos/300/300?random=106", size: "320MB", date: "Oct 10", price: "$20.00" },
    ];

    const filteredItems = useMemo(() => {
        return libraryItems.filter(item => {
            const matchesFilter = filter === 'all' || item.type === filter;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [filter, searchQuery]);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 min-h-screen bg-dark-900">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                        <Package className="text-brand-500" size={32} /> My Collection
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Your digital assets library</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-500 transition-colors" size={16} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search library..." 
                            className="w-full bg-dark-800 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-brand-500 outline-none transition-all placeholder:text-gray-600 font-bold" 
                        />
                    </div>
                    
                    <div className="flex bg-dark-800 p-1 rounded-xl border border-white/5">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            All Items
                        </button>
                        <button 
                            onClick={() => setFilter('purchased')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'purchased' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Purchased
                        </button>
                        <button 
                            onClick={() => setFilter('free')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'free' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Free Claims
                        </button>
                    </div>
                </div>
            </div>

            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {filteredItems.map(item => (
                        <CollectionItemCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-2xl bg-dark-800/30 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-4 text-gray-600">
                        <Package size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Vault Empty</h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">No items found in your collection.</p>
                    <button onClick={() => navigate('/collection')} className="mt-6 bg-brand-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 transition-all shadow-lg">
                        Browse Store
                    </button>
                </div>
            )}
        </div>
    );
}
