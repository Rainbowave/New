
import React, { useState, useEffect } from 'react';
import { 
    CheckCircle, XCircle, UserCheck, ArrowLeft, Loader2, RefreshCw, 
    Shield, Briefcase, FileText, Clock, ExternalLink, Heart, Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';

interface ApprovalRequest {
    id: number;
    user: string;
    type: string;
    date: string;
    notes: string;
    context: 'dating' | 'adult';
}

interface RequestCardProps {
    req: ApprovalRequest;
    onAction: (id: number, approved: boolean) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ req, onAction }) => {
    const isAdult = req.context === 'adult';
    return (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl flex flex-col group hover:border-brand-500/30 transition-all h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-dark-900 rounded-xl flex items-center justify-center border border-white/5 font-bold text-lg ${isAdult ? 'text-brand-500' : 'text-brand-second'}`}>
                        {req.user[0].toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-black text-white text-lg uppercase italic tracking-tighter">@{req.user}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                            <Clock size={10} /> {req.date}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                     <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
                        {req.type}
                    </div>
                    <div className={`text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 ${isAdult ? 'text-brand-500' : 'text-brand-second'}`}>
                        {isAdult ? <Flame size={8} fill="currentColor"/> : <Heart size={8} fill="currentColor"/>}
                        {isAdult ? 'Naughty' : 'Dating'}
                    </div>
                </div>
            </div>

            <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5 mb-6 flex-1">
                <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <FileText size={10} /> Application Notes
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">"{req.notes}"</p>
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={() => onAction(req.id, false)}
                    className="flex-1 py-3 rounded-xl bg-red-900/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                    <XCircle size={16} /> Decline
                </button>
                <button 
                    onClick={() => onAction(req.id, true)}
                    className="flex-1 py-3 rounded-xl bg-green-900/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                    <CheckCircle size={16} /> Approve
                </button>
            </div>
        </div>
    );
};

export default function UserApprovals() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [adminMode, setAdminMode] = useState<'dating' | 'naughty'>((localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating');

    useEffect(() => {
        const handleModeChange = () => {
             setAdminMode(localStorage.getItem('admin_view_mode') as 'dating' | 'naughty' || 'dating');
        };
        window.addEventListener('admin-mode-change', handleModeChange);
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        
        // Strict DB Filtering based on Context
        const context = adminMode === 'naughty' ? 'adult' : 'dating';
        const dbReqs = db.getPendingApprovals(context);
        
        setRequests(dbReqs as ApprovalRequest[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, [adminMode]);

    const handleAction = async (id: number, approved: boolean) => {
        setRequests(prev => prev.filter(r => r.id !== id));
        const req = requests.find(r => r.id === id);
        const actionType = approved ? 'approve_user_request' : 'decline_user_request';
        db.logAction('moderator', actionType, 'request', req?.user || 'unknown', `Request type: ${req?.type}`);
        db.removePendingApproval(id);
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/community')} className="p-3 bg-dark-800 rounded-2xl text-gray-400 border border-white/5 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1 flex items-center gap-3">
                            <UserCheck className="text-green-500" size={32} />
                            Engagement Pride Approval
                        </h1>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                             Reviewing for: <span className={adminMode === 'naughty' ? 'text-brand-500' : 'text-brand-second'}>{adminMode.toUpperCase()}</span> Protocol
                        </p>
                    </div>
                </div>
                <button onClick={fetchRequests} className="p-3 bg-dark-800 rounded-xl border border-white/5 text-gray-400 hover:text-white transition-all">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-40"><Loader2 className="animate-spin text-brand-500" size={40} /></div>
            ) : requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 text-center opacity-30 border-2 border-dashed border-dark-700 rounded-3xl bg-dark-800/30">
                    <Briefcase size={64} className="text-gray-500 mb-6" />
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">All Caught Up</h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">No pending approvals in the {adminMode} queue.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {requests.map(req => (
                        <RequestCard key={req.id} req={req} onAction={handleAction} />
                    ))}
                </div>
            )}
        </div>
    );
}
