
import React, { useState, useEffect, useMemo } from 'react';
import { Video, Users, AlertTriangle, Play, Pause, Ban, RefreshCw, Loader2, MessageSquare, Clock, Heart, DollarSign, Signal, Radio } from 'lucide-react';
import { db } from '../../services/db';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface Stream {
    id: number;
    title: string;
    streamer: string;
    viewers: number;
    thumbnail: string;
    isLive: boolean;
    category: string;
    startTime: string;
}

// Mini Chart for Time Stats (Reused for consistency)
const MiniTimeChart = ({ color, seed }: { color: string, seed: number }) => {
    const data = useMemo(() => {
         return Array.from({ length: 7 }).map((_, i) => ({
             val: 30 + Math.abs(Math.sin(i + seed) * 50) + (Math.random() * 10)
         }));
    }, [seed]);

    return (
        <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`gradient-live`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#gradient-live)`} isAnimationActive={true} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const StreamStatsPanel = ({ streams }: { streams: Stream[] }) => {
    // Calculate Stats
    const totalStreams = streams.length;
    const totalViewers = streams.reduce((acc, s) => acc + (s.viewers || 0), 0);
    // Mock other stats for demo since streams object is simple
    const totalHeat = Math.floor(totalViewers * 4.5); 
    const avgDuration = "42m 10s"; 
    const activeContests = Math.floor(totalStreams * 0.2);
    
    // Simulate unique categories as "tags"
    const uniqueTags = new Set(streams.map(s => s.category)).size;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 animate-in slide-in-from-top-4">
             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 bg-blue-500/5 rounded-full blur-xl -mr-4 -mt-4"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Signal size={10}/> Total Streams</p>
                 <h3 className="text-2xl font-black text-white">{totalStreams}</h3>
             </div>
             
             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 bg-red-500/5 rounded-full blur-xl -mr-4 -mt-4"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Heart size={10} className="text-red-500"/> Global Heat</p>
                 <h3 className="text-2xl font-black text-white">{(totalHeat / 1000).toFixed(1)}k</h3>
             </div>

             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 bg-green-500/5 rounded-full blur-xl -mr-4 -mt-4"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Users size={10} className="text-green-500"/> Live Viewers</p>
                 <h3 className="text-2xl font-black text-white">{(totalViewers / 1000).toFixed(1)}k</h3>
             </div>

             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 bg-purple-500/5 rounded-full blur-xl -mr-4 -mt-4"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Radio size={10} className="text-purple-500"/> Categories</p>
                 <h3 className="text-2xl font-black text-white">{uniqueTags}</h3>
             </div>

             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 bg-yellow-500/5 rounded-full blur-xl -mr-4 -mt-4"></div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><DollarSign size={10} className="text-yellow-500"/> Paid Events</p>
                 <h3 className="text-2xl font-black text-white">{activeContests}</h3>
             </div>

             <div className="bg-dark-800 border border-dark-700 p-4 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={10}/> Avg Duration</p>
                        <h3 className="text-xl font-black text-white">{avgDuration}</h3>
                     </div>
                     <MiniTimeChart color="#22c55e" seed={totalStreams} />
                 </div>
             </div>
        </div>
    );
}

export default function AdminStreams() {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<number | null>(null);

    const fetchStreams = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            // In a real app, this would fetch from an admin endpoint with more metadata
            const data = db.getStreams();
            const enhancedData = data.map((s: any) => ({
                ...s,
                startTime: new Date(Date.now() - Math.random() * 3600000).toISOString() // Mock start time
            }));
            setStreams(enhancedData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStreams();
    }, []);

    const handleTerminate = async (id: number) => {
        if (!window.confirm("Are you sure you want to terminate this stream?")) return;
        setActionId(id);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Remove locally for visual feedback
            setStreams(prev => prev.filter(s => s.id !== id));
            db.logAction('admin', 'terminate_stream', 'stream', id.toString(), 'Admin terminated stream');
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Video className="text-red-500" /> Active Streams
                    </h1>
                    <p className="text-gray-400 text-sm">Monitor and moderate live content.</p>
                </div>
                <button onClick={fetchStreams} className="p-2 hover:bg-dark-800 rounded-lg text-gray-400 hover:text-white">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* NEW STATS PANEL */}
            {!loading && <StreamStatsPanel streams={streams} />}

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {streams.map(stream => (
                        <div key={stream.id} className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden group">
                            <div className="relative aspect-video bg-black">
                                <img src={stream.thumbnail} className="w-full h-full object-cover opacity-80" alt={stream.title} />
                                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> LIVE
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                    <Users size={12} /> {(stream.viewers || 0).toLocaleString()}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="bg-white text-black font-bold py-2 px-6 rounded-full flex items-center gap-2 hover:scale-105 transition-transform">
                                        <Play size={16} fill="currentColor" /> Watch
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-white text-sm line-clamp-1" title={stream.title}>{stream.title}</h3>
                                        <p className="text-xs text-gray-400">by <span className="text-brand-400">{stream.streamer}</span></p>
                                    </div>
                                    <span className="text-[10px] bg-dark-700 text-gray-300 px-2 py-1 rounded border border-dark-600">{stream.category}</span>
                                </div>
                                
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-white" title="View Messages">
                                            <MessageSquare size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-yellow-500" title="Warn User">
                                            <AlertTriangle size={16} />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => handleTerminate(stream.id)}
                                        disabled={actionId === stream.id}
                                        className="bg-red-900/20 hover:bg-red-900/40 text-red-400 text-xs font-bold px-3 py-2 rounded-lg border border-red-500/20 transition-colors flex items-center gap-1"
                                    >
                                        {actionId === stream.id ? <Loader2 size={12} className="animate-spin"/> : <Ban size={12} />} Terminate
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {streams.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-500 bg-dark-800 rounded-xl border border-dark-700 border-dashed">
                            <Video size={48} className="mx-auto mb-4 opacity-50" />
                            No active streams found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
