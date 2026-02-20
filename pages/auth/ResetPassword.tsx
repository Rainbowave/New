
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus('error'); // Simple validation
            return;
        }
        
        setStatus('loading');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => navigate('/auth/login'), 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
            <div className="bg-dark-800 p-8 rounded-2xl shadow-2xl border border-dark-700 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-500/30">
                        <Lock className="text-brand-500" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-gray-400">Enter your new password below.</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
                        <p className="text-gray-400">Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">New Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                required
                                minLength={8}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                required
                            />
                        </div>

                        {status === 'error' && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                                <AlertCircle size={16} /> Passwords do not match.
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {status === 'loading' ? 'Resetting...' : 'Set New Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
