
import React, { useState, useEffect } from 'react';
import { 
    Check, X, ExternalLink, User, Loader2, RefreshCw, 
    AlertCircle, Camera, ShieldCheck, Zap, Users, 
    Database, Star, Info, ArrowUpRight, ShieldAlert,
    XCircle
} from 'lucide-react';
import { db } from '../../services/db';
import { useNavigate } from 'react-router-dom';

interface VerificationRequest {
    id: number;
    user: string;
    type: string;
    date: string;
    code: string;
    userStats?: {
        followers: string;
        posts: number;
        joined: string;
    };
}

const VerificationCard: React.FC<{ 
    req: VerificationRequest, 
    onApprove: (id: number) => void, 
    onReject: (id: number) => void, 
    isProcessing: boolean 
}> = ({ req, onApprove, onReject, isProcessing }) => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'proof' | 'stats'>('proof');

    return (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl flex flex-col gap-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 hover:border-brand-500/20 transition-all group">
            {/* Card Header */}
            <div className="p-6 border-b border-dark-700 bg-dark-900/40">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img src={`https://picsum.photos/100/100?random=${req.user}`} className="w-12 h-12 rounded-xl bg-dark-700 object-cover border border-white/5" alt="" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-dark-900 flex items-center justify-center text-[8px] font-black text-black">!</div>
                        </div>
                        <div>
                            <h3 className="font-black text-white text-lg leading-none truncate w-40 uppercase italic tracking-tighter">@{req.user}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Pending Check</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate(`/admin/users/${req.user}`)}
                        className="p-2.5 bg-white/5 hover:bg-brand-600 hover:text-white rounded-xl text-gray-500 transition-all"
                    >
                        <ArrowUpRight size={18} />
                    </button>
                </div>

                <div className="flex bg-dark-900/80 p-1 rounded-lg border border-dark-700">
                    <button 
                        onClick={() => setViewMode('proof')}
                        className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'proof' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Proof Image
                    </button>
                    <button 
                        onClick={() => setViewMode('stats')}
                        className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'stats' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        User History
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-center min-h-[300px]">
                {viewMode === 'proof' ? (
                    <div className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                        <div className="flex justify-between items-center bg-dark-900 rounded-lg p-3 border border-dark-700 shadow-inner">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                <Camera size={14} className="text-brand-500" /> Validation Code
                            </span>
                            <span className="text-xl font-mono font-black text-brand-400 tracking-[0.3em] ml-2">
                                {req.code}
                            </span>
                        </div>
                        <div className="aspect-[4/3] bg-black rounded-xl overflow-hidden border-2 border-dark-700 group-hover:border-brand-500/20 transition-all shadow-2xl relative">
                            <img 
                                src={`https://picsum.photos/600/800?random=${req.id}`} 
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" 
                                alt="Selfie Proof"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-4">
                                <p className="text-[9px] text-gray-300 font-bold text-center uppercase tracking-widest leading-relaxed">
                                    Check for matching code <span className="text-brand-400 font-black">"{req.code}"</span> and facial clarity.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                                <Users size={14} className="text-blue-400 mb-2" />
                                <div className="text-lg font-black text-white">{req.userStats?.followers || '1.2K'}</div>
                                <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Pride Members</div>
                            </div>
                            <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                                <Database size={14} className="text-purple-400 mb-2" />
                                <div className="text-lg font-black text-white">{req.userStats?.posts || 42}</div>
                                <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Active Posts</div>
                            </div>
                        </div>
                        <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700 space-y-3">
                            <div className="flex justify-between items-center text-[10px] border-b border-dark-700 pb-2">
                                <span className="text-gray-500 font-bold uppercase tracking-widest">Joined Since</span>
                                <span className="text-white font-black">{req.userStats?.joined || 'Oct 2024'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] border-b border-dark-700 pb-2">
                                <span className="text-gray-500 font-bold uppercase tracking-widest">Safety Tier</span>
                                <span className="text-green-400 font-black uppercase italic">Verified Human</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-gray-500 font-bold uppercase tracking-widest">Report Rate</span>
                                <span className="text-white font-black">0.00%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-dark-700 bg-dark-900/20 flex gap-3">
                {isProcessing ? (
                    <div className="w-full flex justify-center py-2.5">
                        <Loader2 size={24} className="animate-spin text-brand-500" />
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={() => onApprove(req.id)} 
                            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-900/20 uppercase tracking-widest text-[10px]"
                        >
                            <ShieldCheck size={16} /> Verify User
                        </button>
                        <button 
                            onClick={() => onReject(req.id)} 
                            className="w-14 bg-dark-700 hover:bg-red-900/40 text-gray-400 hover:text-red-400 border border-dark-600 hover:border-red-500/30 rounded-xl flex items-center justify-center transition-all group/reject" 
                            title="Reject Request"
                        >
                            <X size={18} className="group-hover/reject:rotate-90 transition-transform" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default function AdminVerification() {
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [adminMode, setAdminMode] = useState<string>(localStorage.getItem('admin_view_mode') || 'dating');

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const dbReqs = db.getVerificationRequests();
            const enhancedReqs = dbReqs.length > 0 ? dbReqs : [
                { id: 2001, user: 'cyber_vixen', type: 'Selfie', date: 'Just now', code: 'A942', userStats: { followers: '45.1K', posts: 124, joined: 'Jan 2024' } },
                { id: 2002, user: 'neon_rider', type: 'Selfie', date: '2h ago', code: 'X108', userStats: { followers: '12.2K', posts: 88, joined: 'Mar 2024' } },
                { id: 2003, user: 'pixel_mancer', type: 'Selfie', date: '5h ago', code: 'Z774', userStats: { followers: '500', posts: 12, joined: 'Sep 2024' } },
            ];

            setRequests(enhancedReqs as VerificationRequest[]);
        } catch (err) {
            setError("Communication failure with the badge validation node.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleModeChange = () => {
             setAdminMode(localStorage.getItem('admin_view_mode') || 'dating');
             fetchRequests(); // Reload when context changes
        };
        window.addEventListener('admin-mode-change', handleModeChange);
        fetchRequests();
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, []);

    const handleApprove = async (id: number) => {
        const req = requests.find(r => r.id === id);
        if (!req) return;

        setProcessingId(id);
        try {
            await new Promise(resolve => setTimeout(resolve, 1200));
            db.logAction('admin', 'verify_user', 'request', id.toString(), `Approved star status for @${req.user}`);
            db.removeVerificationRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            alert("Approval failed.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: number) => {
        const reason = prompt("Enter rejection reason for the badge (sent to user):", "Code visibility insufficient");
        if (reason === null) return; 

        setProcessingId(id);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            db.logAction('admin', 'reject_verification', 'request', id.toString(), `Rejected @${id} - Reason: ${reason}`);
            db.removeVerificationRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            alert("Rejection failed.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-4 leading-none">
                        <ShieldCheck className="text-brand-500" size={32} />
                        Verification
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Queue for <span className={adminMode === 'naughty' ? 'text-brand-500' : 'text-brand-second'}>{adminMode.toUpperCase()}</span> user validations.
                    </p>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 flex items-center gap-6 shadow-xl">
                        <div className="text-center">
                            <div className="text-2xl font-black text-white">{requests.length}</div>
                            <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Pending Checks</div>
                        </div>
                    </div>
                    <button 
                        onClick={fetchRequests} 
                        className="p-3 bg-dark-800 border border-dark-700 rounded-xl text-gray-400 hover:text-white transition-all shadow-lg active:scale-95"
                    >
                        <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-6 rounded-2xl mb-10 flex items-center gap-4 animate-in slide-in-from-top-4">
                    <ShieldAlert size={24} />
                    <span className="font-bold uppercase tracking-widest text-sm">{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-40">
                    <Loader2 size={64} className="text-brand-500 animate-spin" />
                    <p className="text-xs font-black text-white uppercase tracking-[0.6em] animate-pulse">Scanning Requests...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {requests.map(req => (
                        <VerificationCard 
                            key={req.id} 
                            req={req} 
                            onApprove={handleApprove} 
                            onReject={handleReject} 
                            isProcessing={processingId === req.id}
                        />
                    ))}
                    
                    {requests.length === 0 && (
                        <div className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-20 border-2 border-dashed border-dark-700 rounded-[40px] bg-dark-900/50">
                            <XCircle size={80} className="text-gray-500 mb-6" />
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">No Requests</h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-4">The queue is empty. Refresh to check for new requests.</p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-20 py-12 border-t border-white/5 flex flex-col items-center opacity-10">
                <Database size={18} className="mb-4 text-gray-600" />
                <span className="text-[7px] font-black text-white uppercase tracking-[1.5em]">Verification Protocol Online</span>
            </div>
        </div>
    );
}
