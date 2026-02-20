
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Loader2, User, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';

export default function Login({ onLogin }: { onLogin: () => void }) {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(true);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || !password) {
            setError('Missing required credentials.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await authService.login(identifier, password);
            onLogin();
            navigate('/home');
        } catch (err: any) {
            setError('Invalid login details.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
             {/* Static Background */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[url('https://picsum.photos/1920/1080?grayscale')] bg-cover opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-dark-900/80 to-dark-900 pointer-events-none"></div>

            <div className="w-full max-w-xl bg-dark-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in duration-500 relative z-30 mt-10 pointer-events-auto">
                
                {/* Header: Branding (Top) */}
                <div className="w-full bg-black/40 relative flex items-center justify-between p-8 border-b border-white/5">
                    <div className="relative z-10 flex items-center gap-4">
                        <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-bold text-2xl italic transition-transform group-hover:scale-105 shadow-lg">L</div>
                        </div>
                        <div>
                             <h2 className="text-2xl font-black text-white leading-tight tracking-tighter uppercase italic">
                                Account <span className="text-brand-500">Login</span>
                            </h2>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                Secure Pride Authentication
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body: Form (Bottom) */}
                <div className="w-full p-8 md:p-10 flex flex-col justify-center">
                    <div className="w-full">
                        <div className="mb-8">
                            <h1 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">Welcome Back</h1>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Enter your credentials to access the sanctuary.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Username or Email</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-500 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input 
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder="Username or Email"
                                        className="w-full bg-dark-800 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:border-brand-500 outline-none transition-all placeholder:text-gray-700"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Password</label>
                                    <Link to="/auth/forgot-password" className="text-[9px] font-bold text-brand-500 uppercase tracking-widest hover:text-brand-400">Recovery</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-500 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-dark-800 border border-white/5 rounded-xl py-4 pl-12 pr-12 text-white text-sm font-bold focus:border-brand-500 outline-none transition-all placeholder:text-gray-700"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-1 py-1">
                                <button 
                                    type="button"
                                    onClick={() => setRememberMe(!rememberMe)}
                                    className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-brand-600 border-brand-500' : 'bg-dark-800 border-white/10'}`}
                                >
                                    {rememberMe && <CheckIcon className="text-white w-2.5 h-2.5" />}
                                </button>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest select-none cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                                    Remember Me
                                </span>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-lg hover:bg-gray-200 disabled:opacity-50 active:scale-[0.98] transition-all"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Login'}
                            </button>
                        </form>

                        <div className="mt-10 pt-6 border-t border-white/5 text-center">
                            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-4">No account yet?</p>
                            <Link to="/auth/register" className="inline-flex items-center gap-2 text-white hover:text-brand-400 font-black uppercase tracking-[0.2em] text-[10px] transition-colors group">
                                Create New Account <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);
