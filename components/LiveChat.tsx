
import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Gift, Star, MoreVertical, Heart, AlertCircle } from 'lucide-react';

interface ChatMessage {
    id: number;
    user: string;
    avatar: string;
    text: string;
    isVip?: boolean;
    isMod?: boolean;
    color: string;
}

const COLORS = ['text-red-400', 'text-blue-400', 'text-green-400', 'text-purple-400', 'text-yellow-400', 'text-pink-400'];

export const LiveChat = ({ isLive = true, streamId }: { isLive?: boolean, streamId?: number }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Reset Chat on Stream Change
    useEffect(() => {
        setMessages([]);
        setIsConnected(false);
    }, [streamId]);

    // Simulating WebSocket Connection
    useEffect(() => {
        if (!isLive) {
            setIsConnected(false);
            return;
        }

        // Fake connection time
        const connectTimeout = setTimeout(() => {
            setIsConnected(true);
            setMessages(prev => [...prev, {
                id: Date.now(),
                user: 'System',
                avatar: '',
                text: 'Welcome to the chat! Be respectful.',
                color: 'text-gray-400',
                isMod: true
            }]);
        }, 1000);

        // Simulate incoming messages via WS
        const mockInterval = setInterval(() => {
            if (!isConnected) return; // Wait until "connected"

            const randomUser = `User${Math.floor(Math.random() * 1000)}`;
            const msgs = ['OMG!', 'Insane play!', 'LOL 😂', 'Hello from Brazil 🇧🇷', 'Can you play Minecraft?', 'GG', 'Wow', 'Love this stream ❤️', 'PogChamp', 'Hype!', 'Streamer noticed me!', 'Nice strategy'];
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            
            const newMsg: ChatMessage = {
                id: Date.now(),
                user: randomUser,
                avatar: `https://picsum.photos/50/50?random=${Math.random()}`,
                text: randomMsg,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                isVip: Math.random() > 0.9,
                isMod: Math.random() > 0.98
            };

            setMessages(prev => {
                const updated = [...prev, newMsg];
                if (updated.length > 50) updated.shift(); 
                return updated;
            });
        }, 2000);

        return () => {
            clearTimeout(connectTimeout);
            clearInterval(mockInterval);
        };
    }, [isLive, isConnected, streamId]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const msg = {
            id: Date.now(),
            user: 'You',
            avatar: 'https://picsum.photos/50/50?random=me',
            text: input,
            color: 'text-brand-400',
            isMod: false
        };

        setMessages(prev => [...prev, msg]);
        // Simulate WS send
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-dark-800 border-l border-dark-700">
            {/* Header */}
            <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Stream Chat</h3>
                    {isConnected ? (
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Connected"></span>
                    ) : (
                        <span className="w-2 h-2 rounded-full bg-red-500" title="Disconnected"></span>
                    )}
                </div>
                <button className="text-gray-400 hover:text-white"><MoreVertical size={16} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-medium text-sm scroll-smooth" ref={scrollRef}>
                {!isConnected && (
                    <div className="flex items-center justify-center text-yellow-500 text-xs gap-2 my-2 h-full">
                        <div className="flex flex-col items-center gap-2">
                            <AlertCircle size={18} /> 
                            <span>Connecting to chat...</span>
                        </div>
                    </div>
                )}
                {messages.map(msg => (
                    <div key={msg.id} className="break-words leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-100">
                        <span className="inline-flex items-center gap-1 mr-2 align-middle">
                            {msg.isMod && <span className="bg-green-600 p-0.5 rounded flex items-center justify-center"><img src="https://api.iconify.design/mdi:sword.svg?color=white" className="w-3 h-3" alt="mod" /></span>}
                            {msg.isVip && <span className="bg-brand-600 p-0.5 rounded flex items-center justify-center"><Star size={10} className="text-white fill-white" /></span>}
                            <span className={`font-bold ${msg.color} cursor-pointer hover:underline text-xs`}>{msg.user}:</span>
                        </span>
                        <span className="text-gray-200 align-middle text-sm">{msg.text}</span>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-dark-900 border-t border-dark-700">
                <div className="flex gap-2 mb-3">
                     <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold py-2 rounded-lg transition-colors border border-red-500/20 flex items-center justify-center gap-1">
                         <Heart size={12} fill="currentColor" /> Like
                     </button>
                     <button className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs font-bold py-2 rounded-lg transition-colors border border-yellow-500/20 flex items-center justify-center gap-1">
                         <Gift size={12} /> Gift
                     </button>
                </div>
                <form onSubmit={handleSend} className="relative">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Say something..." 
                        className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-brand-500 transition-all placeholder-gray-500"
                        disabled={!isConnected}
                    />
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                        <button type="button" className="p-1.5 text-gray-400 hover:text-brand-400 transition-colors"><Smile size={18} /></button>
                        <button type="submit" disabled={!input.trim() || !isConnected} className="p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-500 disabled:opacity-50 transition-all"><Send size={14} /></button>
                    </div>
                </form>
            </div>
        </div>
    );
};
