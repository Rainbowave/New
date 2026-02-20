
import React, { useState, useEffect } from 'react';
import { 
    ShieldAlert, Search, RefreshCw, UserX, Calendar, Ban, CheckCircle, ArrowLeft, Undo2, Heart, Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';

export default function Suspensions() {
    const navigate = useNavigate();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [adminMode, setAdminMode] = useState<'dating' | 'naughty'>((localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating');

    useEffect(() => {
        const handleModeChange = () => {
             setAdminMode(localStorage.getItem('admin_view_mode') as 'dating' | 'naughty' || 'dating');
        };
        window.addEventListener('admin-mode-change', handleModeChange);
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, []);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 600));
            
            // Get filtered logs by context
            const context = adminMode === 'naughty' ? 'adult' : 'dating';
            const allLogs = db.getLogs(context).filter((l: any) => 
                l.action.includes('suspend') || l.action.includes('ban') || l.action.includes('warn')
            );
            
            setLogs(allLogs);
            setLoading(false);
        };
        fetchLogs();
    }, [adminMode]);

    const filteredLogs = logs.filter(l => 
        l.targetId.toLowerCase().includes(search.toLowerCase()) || 
        l.details.toLowerCase().includes(search.toLowerCase())
    );

    const handleReverseAction = (userId: string, actionType: string) => {
        const reverseText = actionType.includes('ban') ? 'Unban' : actionType.includes('suspend') ? 'Unsuspend' : 'Revoke Warning';
        if (confirm(`${reverseText} user @${userId}? This will restore their access.`)) {
            db.updateUser(userId, { status: 'active' });
            db.logAction('admin', `reverse_${actionType}`, 'user', userId, 'Manual reversal by admin');
            alert(`Action reversed for @${userId}.`);
            window.location.reload();
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/admin/community')} className="p-2 bg-dark-800 rounded-full text-gray-400 hover:text-white transition-colors border border-white/5">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                        <UserX className="text-red-500" size={32} />
                        Action Logs
                    </h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Audit trail of Engagement Pride interventions ({adminMode})</p>
                </div>
            </div>

            <div className="bg-dark-800 border border-dark-700 rounded-[5px] p-6 mb-6 shadow-lg">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by user ID or reason..." 
                        className="w-full bg-dark-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-500 font-bold" 
                    />
                </div>
            </div>

            <div className="bg-dark-800 border border-dark-700 rounded-[5px] overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-dark-900 text-[10px] text-gray-500 uppercase font-black tracking-widest border-b border-dark-700">
                        <tr>
                            <th className="px-6 py-5">User ID</th>
                            <th className="px-6 py-5">Context</th>
                            <th className="px-6 py-5">Action Type</th>
                            <th className="px-6 py-5">Reason / Details</th>
                            <th className="px-6 py-5">Date</th>
                            <th className="px-6 py-5 text-right">Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                        {filteredLogs.map((log, i) => {
                            const isAdult = log.context === 'adult';
                            return (
                                <tr key={i} className="hover:bg-dark-700/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">@{log.targetId}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 w-fit ${isAdult ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20' : 'bg-brand-second/10 text-brand-second border border-brand-second/20'}`}>
                                            {isAdult ? <Flame size={10} fill="currentColor"/> : <Heart size={10} fill="currentColor"/>}
                                            {isAdult ? 'Naughty' : 'Dating'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                                            log.action.includes('ban') ? 'bg-red-900/20 text-red-500 border-red-500/20' : 
                                            log.action.includes('suspend') ? 'bg-orange-900/20 text-orange-500 border-orange-500/20' :
                                            'bg-yellow-900/20 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                            {log.action.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-300 max-w-md truncate">{log.details}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleReverseAction(log.targetId, log.action)}
                                            className="text-[9px] font-bold text-gray-400 hover:text-white uppercase tracking-widest border border-white/10 px-3 py-1.5 rounded hover:bg-white/5 transition-all flex items-center gap-2 ml-auto"
                                        >
                                            <Undo2 size={12} /> Reverse Action
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                         {filteredLogs.length === 0 && (
                            <tr><td colSpan={6} className="p-10 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">No disciplinary records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
