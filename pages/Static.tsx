
import React from 'react';
import { ArrowLeft, Target, Heart, Zap, Globe, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StaticPageProps {
    type: 'about' | 'terms' | 'privacy';
}

export default function StaticPages({ type }: StaticPageProps) {
    const navigate = useNavigate();

    const Content = () => {
        if (type === 'about') {
            return (
                <div className="space-y-16">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-brand-900/30 border border-brand-500/30 px-3 py-1 rounded-full text-brand-300 text-xs font-bold mb-6 uppercase tracking-wider">
                            <Globe size={14} /> Our Story
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                            Redefining the <br/> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">Creator Economy</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            LuciSin was born from a simple idea: Creators deserve better. Better tools, better pay, and total freedom over their content.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-dark-900 p-8 rounded-3xl border border-dark-600 text-center hover:border-brand-500/50 transition-colors">
                            <div className="w-16 h-16 bg-brand-900/20 rounded-2xl flex items-center justify-center text-brand-400 mx-auto mb-6">
                                <Target size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                To democratize content creation and provide a safe, inclusive, and profitable ecosystem for creators worldwide, free from restrictive algorithms.
                            </p>
                        </div>
                        <div className="bg-dark-900 p-8 rounded-3xl border border-dark-600 text-center hover:border-purple-500/50 transition-colors">
                            <div className="w-16 h-16 bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-400 mx-auto mb-6">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Creators First</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                We believe in fair revenue sharing. Creators keep up to 95% of earnings on direct tips and sales, ensuring their passion is sustainable.
                            </p>
                        </div>
                        <div className="bg-dark-900 p-8 rounded-3xl border border-dark-600 text-center hover:border-blue-500/50 transition-colors">
                            <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-6">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Leveraging cutting-edge tech like low-latency streaming, AI-powered moderation, and Web3 payments to build the future of social media.
                            </p>
                        </div>
                    </div>

                    <div className="bg-dark-900 rounded-3xl p-8 border border-dark-600 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-white mb-4">A Space for Everyone</h2>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Whether you're a gamer, artist, musician, or educator, there is a place for you here. We support diverse content types including:
                            </p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-center gap-3"><Shield size={18} className="text-green-500"/> Safe & Moderated Communities</li>
                                <li className="flex items-center gap-3"><Users size={18} className="text-blue-500"/> Direct Fan Engagement</li>
                                <li className="flex items-center gap-3"><Globe size={18} className="text-purple-500"/> Global Reach & Localization</li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full">
                            <img src="https://picsum.photos/600/400?random=about" className="rounded-2xl w-full object-cover shadow-2xl shadow-brand-900/20" alt="Community" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-brand-900 to-purple-900 rounded-3xl p-12 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-4">Join the Movement</h2>
                            <p className="text-brand-100 mb-8 max-w-xl mx-auto">
                                The future of the creator economy is here. Don't get left behind.
                            </p>
                            <button onClick={() => navigate('/auth/register')} className="bg-white text-brand-900 px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl">
                                Get Started Today
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>
                </div>
            );
        }
        if (type === 'terms') {
            return (
                <div className="space-y-6 text-gray-300">
                    <h1 className="text-4xl font-black text-white mb-8 border-b border-dark-700 pb-4">Terms of Service</h1>
                    <p className="text-sm text-gray-500 mb-8">Effective Date: October 2025</p>
                    
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">1. Acceptance of Terms</h3>
                        <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

                        <h3 className="text-xl font-bold text-white">2. Content Guidelines</h3>
                        <p>You are responsible for the content you post. We prohibit illegal content, hate speech, and harassment. Adult content is permitted only in designated areas and must comply with legal standards.</p>
                        
                        <h3 className="text-xl font-bold text-white">3. Monetization & Payments</h3>
                        <p>Earnings are subject to platform fees as outlined in our Creator Policy. Payouts are processed according to the schedule in your dashboard.</p>
                    </div>
                </div>
            );
        }
        if (type === 'privacy') {
            return (
                <div className="space-y-6 text-gray-300">
                    <h1 className="text-4xl font-black text-white mb-8 border-b border-dark-700 pb-4">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 mb-8">Last Updated: October 2025</p>
                    
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Data Collection</h3>
                        <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.</p>

                        <h3 className="text-xl font-bold text-white">Data Usage</h3>
                        <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect LuciSin and our users.</p>
                        
                        <h3 className="text-xl font-bold text-white">Security</h3>
                        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access.</p>
                    </div>
                </div>
            );
        }
        return <div>Page not found</div>;
    };

    return (
        <div className="max-w-5xl mx-auto py-20 px-6">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors bg-dark-800 px-4 py-2 rounded-full w-fit hover:bg-dark-700 border border-dark-700"
            >
                <ArrowLeft size={18} /> Back
            </button>
            
            <div className="bg-dark-800 border border-dark-700 rounded-3xl p-8 md:p-12 shadow-2xl">
                <Content />
            </div>
        </div>
    );
}
