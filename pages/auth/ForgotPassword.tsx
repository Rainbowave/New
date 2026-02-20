
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
            <div className="bg-dark-800 p-8 rounded-2xl shadow-2xl border border-dark-700 w-full max-w-md">
                {!submitted ? (
                    <>
                        <div className="mb-6">
                             <Link to="/auth/login" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm mb-4 transition-colors"><ArrowLeft size={16} /> Back to Login</Link>
                             <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                             <p className="text-gray-400">Enter your email and we'll send you instructions to reset your password.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@example.com" 
                                        className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-brand-900/50 disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-green-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                        <p className="text-gray-400 mb-6">We've sent a password reset link to <span className="text-white font-bold">{email}</span></p>
                        <button 
                            onClick={() => setSubmitted(false)}
                            className="text-brand-400 hover:text-brand-300 font-bold text-sm"
                        >
                            Try another email
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
