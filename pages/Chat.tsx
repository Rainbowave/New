
import React, { useState, useEffect, useRef } from 'react';
import { 
    Send, Image, Smile, MoreVertical, Search, Phone, Video, Info, 
    Flame, Heart, MessageCircle, DollarSign, Clock, Gift, LayoutGrid,
    UserMinus, Ban, Flag, Trash2, CheckCircle, Lock, Users, Shield, ArrowLeft, UserPlus,
    Globe, Gamepad2, Palette, Calendar, Sparkles, ShoppingBag, Coffee, Coins, Film, StickyNote, X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { db } from '../services/db';
import { api } from '../services/api';

interface Contact {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    type: 'private' | 'circles';
    members?: number; // For circles
    isVerified?: boolean;
    category?: string; // For circle filtering
}

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'them';
    time: string;
    type: 'text' | 'image' | 'paid' | 'gift' | 'content_share';
    price?: string;
    expiresIn?: string;
    isLocked?: boolean;
    senderName?: string; // For group chats
    avatar?: string;
    attachmentUrl?: string;
}

const CircleCategoryItem = ({ icon: Icon, label, count, isActive, onClick, color }: any) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center gap-1.5 min-w-[60px] group transition-all"
    >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isActive ? `bg-${color}-500/20 border-${color}-500 text-${color}-500 shadow-[0_0_10px_rgba(var(--${color}-500-rgb),0.3)]` : 'bg-dark-800 border-white/5 text-gray-500 group-hover:text-white group-hover:border-white/20'}`}>
            <Icon size={16} />
        </div>
        <div className="flex flex-col items-center">
            <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-500'}`}>{label}</span>
            <span className="text-[7px] font-bold text-gray-600">{count}</span>
        </div>
    </button>
);

export default function Chat() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [activeChat, setActiveChat] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [messageTab, setMessageTab] = useState<'private' | 'circles'>('private');
    
    // Circle Filtering
    const [circleCategory, setCircleCategory] = useState('All');

    // UI State
    const [isContextOpen, setIsContextOpen] = useState(false);
    const [showPaidConfig, setShowPaidConfig] = useState(false);
    const [msgPrice, setMsgPrice] = useState('');
    const [msgDuration, setMsgDuration] = useState('24h');
    const [isMobileListVisible, setIsMobileListVisible] = useState(true);

    // Content Picker State
    const [showContentPicker, setShowContentPicker] = useState(false);
    const [pickerTab, setPickerTab] = useState<'photos'|'videos'|'gifs'>('photos');
    const [pickerSearch, setPickerSearch] = useState('');
    const [contentResults, setContentResults] = useState<any[]>([]);
    const [isSearchingContent, setIsSearchingContent] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentUser = authService.getCurrentUser();
    const isNaughtyMode = currentUser?.contentPreference === 'adult';
    const accentColor = isNaughtyMode ? 'text-brand-500' : 'text-brand-second';
    const bgAccent = isNaughtyMode ? 'bg-brand-500' : 'bg-brand-second';
    const borderAccent = isNaughtyMode ? 'border-brand-500' : 'border-brand-second';

    useEffect(() => {
        // Load contacts and mock mixture of DMs and Circles
        const loadedContacts: Contact[] = [
            // Private Chats
            { id: 1, name: "Sarah_Noir", avatar: "https://picsum.photos/100/100?random=1", lastMessage: "Loved your latest video!", time: "10m", unread: 2, online: true, type: 'private', isVerified: true },
            { id: 2, name: "GamerKing", avatar: "https://picsum.photos/100/100?random=2", lastMessage: "Are you streaming tonight?", time: "1h", unread: 0, online: false, type: 'private', isVerified: false },
            { id: 3, name: "Velvet_Vixen", avatar: "https://picsum.photos/100/100?random=3", lastMessage: "Sent you a tip!", time: "2h", unread: 0, online: true, type: 'private', isVerified: true },
            
            // Circles (Groups) - Added Categories
            { id: 101, name: "Neon Nights", avatar: "https://picsum.photos/100/100?random=101", lastMessage: "Alex: Who is going to the event?", time: "5m", unread: 15, online: true, type: 'circles', members: 1240, category: 'Social' },
            { id: 102, name: "Creators Hub", avatar: "https://picsum.photos/100/100?random=102", lastMessage: "System: New trends updated.", time: "1d", unread: 0, online: true, type: 'circles', members: 5800, category: 'Art' },
            { id: 103, name: "VIP Lounge", avatar: "https://picsum.photos/100/100?random=103", lastMessage: "Sarah: Exclusive preview dropping soon.", time: "3h", unread: 3, online: true, type: 'circles', members: 120, category: 'Fashion' },
            { id: 104, name: "Beauty Squad", avatar: "https://picsum.photos/100/100?random=104", lastMessage: "New tutorial live!", time: "1h", unread: 5, online: true, type: 'circles', members: 450, category: 'Makeup' },
            { id: 105, name: "Coffee Talk", avatar: "https://picsum.photos/100/100?random=105", lastMessage: "Morning vibes.", time: "2d", unread: 0, online: true, type: 'circles', members: 890, category: 'Lifestyle' },
            { id: 106, name: "Safe Haven", avatar: "https://picsum.photos/100/100?random=106", lastMessage: "Voice chat active...", time: "Now", unread: 12, online: true, type: 'circles', members: 300, category: 'Support' },
        ];
        
        setContacts(loadedContacts);
    }, []);

    useEffect(() => {
        if (activeChat) {
            // Mock load messages for active chat
            setMessages([
                { id: 1, text: activeChat.type === 'circles' ? "Welcome to the circle!" : "Hey! How's it going?", sender: 'them', senderName: activeChat.type === 'circles' ? 'Mod' : activeChat.name, time: '10:30 AM', type: 'text', avatar: activeChat.avatar },
                { id: 2, text: "Thanks for having me.", sender: 'me', time: '10:32 AM', type: 'text' },
                { id: 3, text: activeChat.lastMessage, sender: 'them', senderName: activeChat.type === 'circles' ? 'Alex' : activeChat.name, time: activeChat.time, type: 'text', avatar: activeChat.avatar }
            ]);
            setIsContextOpen(false);
            setShowPaidConfig(false);
            setShowContentPicker(false);
            setIsMobileListVisible(false); // Hide list on mobile when chat selected
        }
    }, [activeChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Content Picker API Logic
    useEffect(() => {
        if (showContentPicker) {
            const fetchContent = async () => {
                setIsSearchingContent(true);
                try {
                    // Use new dedicated content search endpoint
                    let typeParam = 'PHOTO';
                    if (pickerTab === 'videos') typeParam = 'VIDEO';
                    if (pickerTab === 'gifs') typeParam = 'GIF'; 

                    const res = await api.get<{items: any[]}>(`/content/search?limit=20&type=${typeParam}&q=${encodeURIComponent(pickerSearch)}`);
                    let results = res.items || [];
                    
                    setContentResults(results);
                } catch (e) {
                    console.error("Content fetch failed", e);
                } finally {
                    setIsSearchingContent(false);
                }
            };
            
            // Debounce search
            const timer = setTimeout(fetchContent, 300);
            return () => clearTimeout(timer);
        }
    }, [showContentPicker, pickerTab, pickerSearch]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() && !showPaidConfig) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: showPaidConfig ? 'paid' : 'text',
            price: showPaidConfig ? msgPrice : undefined,
            expiresIn: showPaidConfig ? msgDuration : undefined,
            isLocked: showPaidConfig
        };

        setMessages([...messages, newMessage]);
        setInputValue('');
        setShowPaidConfig(false);
        setMsgPrice('');
    };

    const handleShareContent = (item: any) => {
        const newMessage: Message = {
            id: Date.now(),
            text: "",
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'content_share',
            attachmentUrl: item.thumbnailUrl || item.url,
            isLocked: false
        };
        setMessages([...messages, newMessage]);
        setShowContentPicker(false);
    };

    const handleSafetyAction = (action: 'block' | 'unpride' | 'remove') => {
        if (!activeChat) return;
        const actionText = action === 'block' ? 'Blocked' : action === 'unpride' ? 'Removed from Pride' : 'Removed Conversation';
        alert(`${activeChat.name} has been ${actionText}`);
        setIsContextOpen(false);
        if (action === 'remove' || action === 'block') {
             setContacts(prev => prev.filter(c => c.id !== activeChat.id));
             setActiveChat(null);
             setIsMobileListVisible(true);
        }
    };

    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        c.type === messageTab &&
        (messageTab !== 'circles' || circleCategory === 'All' || c.category === circleCategory)
    );

    // Calculate aggregated member counts for circles
    const getCategoryCount = (cat: string) => {
        if (cat === 'All') return contacts.filter(c => c.type === 'circles').reduce((acc, c) => acc + (c.members || 0), 0);
        return contacts.filter(c => c.type === 'circles' && c.category === cat).reduce((acc, c) => acc + (c.members || 0), 0);
    };

    const circleCategories = [
        { id: 'All', label: 'All', icon: Globe, color: 'blue' },
        { id: 'Social', label: 'Social', icon: MessageCircle, color: 'pink' },
        { id: 'Art', label: 'Art', icon: Palette, color: 'purple' },
        { id: 'Support', label: 'Support', icon: Heart, color: 'red' },
        { id: 'Events', label: 'Events', icon: Calendar, color: 'yellow' },
        { id: 'Makeup', label: 'Makeup', icon: Sparkles, color: 'fuchsia' },
        { id: 'Fashion', label: 'Fashion', icon: ShoppingBag, color: 'emerald' },
        { id: 'Lifestyle', label: 'Lifestyle', icon: Coffee, color: 'orange' },
    ];

    return (
        <div className="flex h-[calc(100vh-80px)] md:h-screen bg-[#0a0a0a] overflow-hidden border-t border-white/5 pt-16 md:pt-0">
            {/* Sidebar */}
            <div className={`${isMobileListVisible ? 'flex' : 'hidden'} md:flex w-full md:w-80 flex-col border-r border-white/5 bg-dark-900/50`}>
                 <div className="p-4 md:p-6 pb-2">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                            {messageTab === 'circles' ? 'Circles' : 'Inbox'} 
                            <span className={`w-2 h-2 rounded-full animate-pulse ${bgAccent}`}></span>
                        </h1>
                        <button className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex p-1 bg-dark-800 rounded-xl mb-4 border border-white/5">
                        <button
                            onClick={() => setMessageTab('private')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${messageTab === 'private' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            <MessageCircle size={12} /> Private
                        </button>
                        <button
                            onClick={() => setMessageTab('circles')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${messageTab === 'circles' ? `${bgAccent} text-white shadow-lg` : 'text-gray-500 hover:text-white'}`}
                        >
                            <Users size={12} fill="currentColor" /> Circles
                        </button>
                    </div>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                            type="text" 
                            placeholder={messageTab === 'circles' ? "Search circles..." : "Search messages..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-dark-800 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-600 font-medium"
                        />
                    </div>
                 </div>

                 {/* Circle Categories Bar */}
                 {messageTab === 'circles' && (
                     <div className="px-4 pb-2">
                         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-fade">
                             {circleCategories.map(cat => (
                                 <CircleCategoryItem 
                                    key={cat.id}
                                    icon={cat.icon}
                                    label={cat.label}
                                    count={(getCategoryCount(cat.id)/1000).toFixed(1) + 'K'}
                                    color={cat.color}
                                    isActive={circleCategory === cat.id}
                                    onClick={() => setCircleCategory(cat.id)}
                                 />
                             ))}
                         </div>
                         <div className="h-px bg-white/5 w-full my-2"></div>
                     </div>
                 )}

                 <div className="flex-1 overflow-y-auto no-scrollbar">
                     {filteredContacts.length === 0 ? (
                         <div className="p-8 text-center opacity-40">
                             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No {messageTab} found.</p>
                         </div>
                     ) : (
                         filteredContacts.map(contact => (
                             <div 
                                key={contact.id} 
                                onClick={() => setActiveChat(contact)}
                                className={`flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer transition-colors border-l-2 ${activeChat?.id === contact.id ? `${borderAccent} bg-white/[0.02]` : 'border-transparent'}`}
                             >
                                 <div className="relative shrink-0">
                                     <img src={contact.avatar} className="w-12 h-12 rounded-full object-cover border border-white/10" alt={contact.name} />
                                     {contact.type === 'private' && contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-dark-900 rounded-full"></div>}
                                     {contact.type === 'circles' && (
                                         <div className="absolute -bottom-1 -right-1 bg-dark-800 rounded-full p-0.5 border border-white/10">
                                             <Users size={10} className="text-gray-400" />
                                         </div>
                                     )}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <div className="flex justify-between items-baseline mb-0.5">
                                         <h4 className={`font-bold text-sm truncate ${activeChat?.id === contact.id ? 'text-white' : 'text-gray-300'}`}>{contact.name}</h4>
                                         <span className="text-[10px] text-gray-600 font-medium uppercase shrink-0 ml-2">{contact.time}</span>
                                     </div>
                                     <div className="flex justify-between items-center">
                                         <p className="text-xs text-gray-500 truncate pr-2 w-32">{contact.lastMessage}</p>
                                         {contact.unread > 0 && (
                                             <span className={`min-w-[18px] h-[18px] flex items-center justify-center text-[9px] font-bold text-white rounded-full px-1 ${bgAccent}`}>
                                                 {contact.unread}
                                             </span>
                                         )}
                                     </div>
                                 </div>
                             </div>
                         ))
                     )}
                 </div>
            </div>
            
            {/* Chat Area */}
            {activeChat ? (
                <div className={`${isMobileListVisible ? 'hidden' : 'flex'} flex-1 flex-col bg-[#0a0a0a]`}>
                    {/* Chat Header */}
                    <div className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-dark-900/80 backdrop-blur-md relative z-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => { setActiveChat(null); setIsMobileListVisible(true); }} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"><ArrowLeft size={20}/></button>
                            <div className="relative" onClick={() => navigate(activeChat.type === 'circles' ? `/intimacy` : `/profile/${activeChat.name}`)}>
                                <img src={activeChat.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10 cursor-pointer" alt="" />
                                {activeChat.type === 'private' && activeChat.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-dark-900 rounded-full"></div>}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base leading-tight flex items-center gap-2 cursor-pointer hover:underline" onClick={() => navigate(activeChat.type === 'circles' ? `/intimacy` : `/profile/${activeChat.name}`)}>
                                    {activeChat.name}
                                    {activeChat.isVerified && <Shield size={12} className="text-brand-500" fill="currentColor"/>}
                                    {activeChat.type === 'circles' && <span className={`text-[9px] ${isNaughtyMode ? 'text-brand-500 bg-brand-500/10' : 'text-brand-second bg-brand-second/10'} px-1.5 py-0.5 rounded uppercase tracking-wider font-black`}>Circle</span>}
                                </h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    {activeChat.type === 'circles' 
                                        ? `${activeChat.members?.toLocaleString()} Members • ${activeChat.category || 'General'}` 
                                        : (activeChat.online ? 'Active Now' : 'Offline')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 relative">
                             {activeChat.type === 'private' && (
                                 <>
                                     <button className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-full hidden md:block"><Phone size={20} /></button>
                                     <button className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-full hidden md:block"><Video size={20} /></button>
                                 </>
                             )}
                             <button 
                                onClick={() => setIsContextOpen(!isContextOpen)}
                                className={`p-2 transition-colors hover:bg-white/5 rounded-full ${isContextOpen ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}
                             >
                                 <MoreVertical size={20} />
                             </button>

                             {/* Safety / Action Menu */}
                             {isContextOpen && (
                                 <div className="absolute top-12 right-0 w-48 bg-dark-800 border border-dark-600 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                                     <button onClick={() => handleSafetyAction('remove')} className="w-full text-left px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2">
                                         <Trash2 size={14}/> Remove Chat
                                     </button>
                                     {activeChat.type === 'circles' ? (
                                         <button onClick={() => handleSafetyAction('unpride')} className="w-full text-left px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2">
                                             <UserMinus size={14}/> Leave Circle
                                         </button>
                                     ) : (
                                         <>
                                             <button onClick={() => navigate(`/profile/${activeChat.name}`)} className="w-full text-left px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2">
                                                 <UserPlus size={14}/> View Profile
                                             </button>
                                             <button onClick={() => handleSafetyAction('block')} className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-900/20 flex items-center gap-2 border-t border-white/5">
                                                 <Ban size={14}/> Block User
                                             </button>
                                         </>
                                     )}
                                     <button className="w-full text-left px-4 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                                         <Flag size={14}/> Report
                                     </button>
                                 </div>
                             )}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                        {messages.map((msg, idx) => {
                            const isMe = msg.sender === 'me';
                            return (
                                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto border border-white/10 cursor-pointer" onClick={() => !isMe && navigate(`/profile/${msg.senderName}`)}>
                                        <img 
                                            src={isMe ? (currentUser?.avatarUrl || 'https://picsum.photos/50/50?random=me') : (msg.avatar || activeChat.avatar)} 
                                            alt={isMe ? 'Me' : msg.senderName}
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>

                                    <div className={`max-w-[80%] md:max-w-[60%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        {/* Sender Name in Group Chat */}
                                        {!isMe && activeChat.type === 'circles' && (
                                            <span className="text-[10px] font-bold text-gray-500 mb-1 ml-1 block">{msg.senderName}</span>
                                        )}
                                        
                                        <div className={`px-5 py-3 rounded-2xl text-sm font-medium relative ${isMe ? `${bgAccent} text-white rounded-tr-sm` : 'bg-dark-800 text-gray-200 border border-white/5 rounded-tl-sm'} ${msg.type === 'paid' ? 'border-2 border-yellow-500 bg-yellow-900/20' : ''}`}>
                                            {msg.type === 'paid' && (
                                                <div className="flex justify-between items-center mb-2 border-b border-yellow-500/30 pb-2 gap-4">
                                                    <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-1"><Lock size={10}/> Paid Message</span>
                                                    <span className="text-yellow-400 font-black text-xs">{msg.price} LSC</span>
                                                </div>
                                            )}
                                            
                                            {/* Render Attachments */}
                                            {msg.attachmentUrl && (
                                                 <div className="mb-2 rounded-lg overflow-hidden border border-white/10 max-h-48">
                                                     <img src={msg.attachmentUrl} className="w-full h-full object-cover" alt="attachment" />
                                                 </div>
                                            )}

                                            {msg.text}
                                            
                                            {msg.type === 'paid' && (
                                                <div className="mt-2 text-[9px] font-bold text-yellow-500/70 uppercase tracking-widest flex items-center gap-1">
                                                    <Clock size={10}/> Expires: {msg.expiresIn}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[9px] text-gray-600 mt-1.5 font-bold uppercase tracking-widest mx-1 block">{msg.time}</span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Paid Message Config Popover */}
                    {showPaidConfig && (
                        <div className="px-6 pb-2 animate-in slide-in-from-bottom-4">
                            <div className="bg-dark-800 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-4">
                                <div>
                                    <label className="text-[9px] font-black text-yellow-500 uppercase tracking-widest block mb-1">Price</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={msgPrice}
                                            onChange={(e) => setMsgPrice(e.target.value)}
                                            placeholder="0"
                                            className="w-24 bg-dark-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-bold outline-none focus:border-yellow-500"
                                        />
                                        <span className="absolute right-2 top-1.5 text-[9px] text-gray-500 font-bold">LSC</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Duration</label>
                                    <select 
                                        value={msgDuration}
                                        onChange={(e) => setMsgDuration(e.target.value)}
                                        className="bg-dark-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-bold outline-none"
                                    >
                                        <option value="1h">1 Hour</option>
                                        <option value="24h">24 Hours</option>
                                        <option value="7d">7 Days</option>
                                        <option value="forever">Forever</option>
                                    </select>
                                </div>
                                <div className="flex-1 text-[10px] text-gray-400 pl-4 border-l border-white/10 italic">
                                    Recipient must pay to unlock view. Revenue adds to your wallet instantly.
                                </div>
                                <button onClick={() => setShowPaidConfig(false)} className="p-1 hover:bg-white/10 rounded text-gray-400"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    )}
                    
                    {/* Content Picker Popover */}
                    {showContentPicker && (
                         <div className="px-6 pb-2 animate-in slide-in-from-bottom-4">
                             <div className="bg-dark-800 border border-white/10 rounded-2xl p-4 shadow-2xl h-[400px] flex flex-col">
                                 {/* Picker Header */}
                                 <div className="flex items-center gap-4 mb-4">
                                     <div className="relative flex-1">
                                         <input 
                                            type="text" 
                                            value={pickerSearch} 
                                            onChange={(e) => setPickerSearch(e.target.value)} 
                                            placeholder="Search Content..."
                                            className="w-full bg-dark-900 border border-white/5 rounded-lg py-2 pl-3 pr-3 text-xs text-white focus:border-brand-500 outline-none"
                                         />
                                     </div>
                                     
                                     {/* Type Toggles */}
                                     <div className="flex bg-dark-900 rounded-lg p-0.5 border border-white/5 shrink-0">
                                         <button onClick={() => setPickerTab('photos')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${pickerTab === 'photos' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>Photos</button>
                                         <button onClick={() => setPickerTab('videos')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${pickerTab === 'videos' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>Videos</button>
                                         <button onClick={() => setPickerTab('gifs')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${pickerTab === 'gifs' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>GIFs</button>
                                     </div>

                                     <button onClick={() => setShowContentPicker(false)} className="p-1.5 bg-dark-900 rounded-lg text-gray-500 hover:text-white border border-white/5"><X size={16} /></button>
                                 </div>

                                 {/* Grid */}
                                 <div className="flex-1 overflow-y-auto custom-scrollbar">
                                     {isSearchingContent ? (
                                         <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>
                                     ) : (
                                         <div className="flex flex-wrap gap-2">
                                             {contentResults.map((item: any) => (
                                                 <div 
                                                    key={item.id} 
                                                    className="h-[150px] relative rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-brand-500 hover:opacity-80 shrink-0"
                                                    onClick={() => handleShareContent(item)}
                                                 >
                                                     <img src={item.thumbnailUrl || item.url} className="h-full w-auto object-cover min-w-[100px]" alt="" />
                                                     {item.type === 'VIDEO' && <div className="absolute top-1 right-1"><Film size={10} className="text-white"/></div>}
                                                 </div>
                                             ))}
                                         </div>
                                     )}
                                     {!isSearchingContent && contentResults.length === 0 && (
                                         <div className="text-center text-[10px] text-gray-500 uppercase py-10 font-bold">No content found</div>
                                     )}
                                 </div>
                             </div>
                         </div>
                    )}

                    {/* Input */}
                    <div className="p-4 bg-dark-900 border-t border-white/5">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-dark-800 p-2 rounded-2xl border border-white/5 focus-within:border-white/20 transition-colors">
                            <button 
                                type="button" 
                                onClick={() => { setShowContentPicker(!showContentPicker); setShowPaidConfig(false); }}
                                className={`p-2 transition-colors rounded-full ${showContentPicker ? 'text-brand-500 bg-brand-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                title="Content Search"
                            >
                                <Globe size={20} />
                            </button>
                            
                            <button 
                                type="button" 
                                onClick={() => { setShowPaidConfig(!showPaidConfig); setShowContentPicker(false); }}
                                className={`p-2 transition-colors rounded-full ${showPaidConfig ? 'text-yellow-500 bg-yellow-500/10' : 'text-yellow-600 hover:text-yellow-500 hover:bg-white/5'}`} 
                                title="Paid Message"
                            >
                                <Coins size={20} className="fill-current" />
                            </button>
                            
                            <input 
                                type="text" 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={showPaidConfig ? "Type locked message content..." : "Type a message..."}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm font-medium placeholder-gray-500"
                            />
                            
                            <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-full"><Smile size={20} /></button>
                            <button type="button" className="p-2 text-gray-400 hover:text-yellow-400 transition-colors hover:bg-white/5 rounded-full" title="Send Tip"><Gift size={20} /></button>
                            
                            <button 
                                type="submit" 
                                disabled={!inputValue.trim()}
                                className={`p-2 rounded-xl transition-all ${inputValue.trim() ? `${bgAccent} text-white` : 'bg-dark-700 text-gray-500'}`}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 items-center justify-center flex-col text-gray-600 bg-[#0a0a0a]">
                    <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-6 border border-white/5">
                        <Send size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Your Messages</h3>
                    <p className="text-xs font-bold uppercase tracking-widest">Select a conversation to start chatting</p>
                </div>
            )}
        </div>
    );
}
