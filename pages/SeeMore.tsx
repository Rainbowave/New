
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Megaphone, Hash, TrendingUp, Grid, TrendingDown, Minus } from 'lucide-react';
import { api } from '../services/api';
import { db } from '../services/db';

export default function SeeMore() {
    const { type } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState<any[]>([]);
    const [hashtags, setHashtags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'posts' | 'tags'>('posts');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (type === 'trending') {
                    // Fetch Hashtags - extended list mock
                    const tags = [
                        { id: '1', tag: '#GamingLife', count: '2.5M', trend: 'up' },
                        { id: '2', tag: '#AIArt', count: '1.8M', trend: 'up' },
                        { id: '3', tag: '#RetroStyle', count: '850K', trend: 'down' },
                        { id: '4', tag: '#Summer2025', count: '500K', trend: 'stable' },
                        { id: '5', tag: '#TechNews', count: '320K', trend: 'up' },
                        { id: '6', tag: '#ViralDance', count: '220K', trend: 'up' },
                        { id: '7', tag: '#Comics', count: '120K', trend: 'stable' },
                        { id: '8', tag: '#Photography', count: '90K', trend: 'down' },
                        { id: '9', tag: '#IndieDev', count: '50K', trend: 'up' },
                        { id: '10', tag: '#Cosplay', count: '45K', trend: 'up' },
                        { id: '11', tag: '#Foodie', count: '40K', trend: 'stable' },
                        { id: '12', tag: '#Travel', count: '35K', trend: 'down' },
                    ];
                    setHashtags(tags);
                    setView('tags'); // Default to tags view for trending page
                } else {
                    // Fetch Posts for other types
                    let endpoint = '/trends/creators';
                    if (type === 'suggested') endpoint = '/trends/shorts';
                    if (type === 'trending-comics') endpoint = '/trends/comics';

                    const data = await api.get<any[]>(endpoint);
                    setItems([...data, ...data, ...data]); 
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [type]);

    const handleHashtagClick = (tag: string) => {
        const query = tag.replace('#', '');
        navigate(`/search?q=${encodeURIComponent(query)}`);
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-dark-800 rounded-full transition-colors text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-white capitalize">{type?.replace('-', ' ')}</h1>
                </div>
                
                {type === 'trending' && (
                    <div className="flex bg-dark-800 p-1 rounded-xl border border-dark-700">
                        <button 
                            onClick={() => setView('tags')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'tags' ? 'bg-brand-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Hash size={16} /> Hashtags
                        </button>
                        <button 
                            onClick={() => setView('posts')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'posts' ? 'bg-brand-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Grid size={16} /> Top Posts
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
                </div>
            ) : (
                <>
                    {view === 'tags' && type === 'trending' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {hashtags.map((tag) => (
                                <div 
                                    key={tag.id} 
                                    onClick={() => handleHashtagClick(tag.tag)}
                                    className="bg-dark-800 p-6 rounded-2xl border border-dark-700 hover:border-brand-500 transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/10 h-full"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center text-gray-400 group-hover:text-brand-400 group-hover:bg-brand-900/20 transition-colors">
                                            <Hash size={24} />
                                        </div>
                                        {tag.trend === 'up' && <TrendingUp size={20} className="text-green-500" />}
                                        {tag.trend === 'down' && <TrendingDown size={20} className="text-red-500" />}
                                        {tag.trend === 'stable' && <Minus size={20} className="text-gray-500" />}
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-bold text-white text-lg group-hover:text-brand-400 transition-colors mb-1">{tag.tag}</h3>
                                        <p className="text-gray-500 text-sm font-medium">{tag.count} posts</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {items.map((item, i) => (
                                <div 
                                    key={`${item.id}-${i}`} 
                                    className="bg-dark-800 rounded-xl overflow-hidden transition-all cursor-pointer group border border-dark-700 hover:border-brand-500 hover:-translate-y-1"
                                >
                                    <div className="aspect-[3/4] overflow-hidden relative">
                                        <img src={item.image || item.cover || item.thumbnail || `https://picsum.photos/300/400?random=${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-bold text-white text-sm truncate">{item.title || item.name}</h3>
                                        <p className="text-xs text-gray-500 truncate mt-1">
                                            {item.viewers ? `${(item.viewers/1000).toFixed(1)}k Views` : item.subtitle || 'Popular'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
