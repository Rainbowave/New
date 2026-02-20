
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Video, Camera, Gamepad2, 
  BookOpen, User, Settings, Bell, Search, PlusSquare, 
  MessageCircle, LogOut,
  Shuffle, Image as ImageIcon, Coins, Users,
  Trophy, HelpCircle, Zap,
  Heart, ChevronDown,
  ShoppingBag, MessageSquare, FileText,
  LayoutGrid, Moon, Sun, LayoutList, Flame, Activity, Sparkles,
  UserPlus, BarChart2, X, ShieldAlert, Lock, Hash, Crown, UploadCloud
} from 'lucide-react';
import { CreatePostModal, PostType } from './CreatePostModal';
import { BottomNav } from './mobile/BottomNav';
import { CartDrawer } from './cart/CartDrawer';
import { db } from '../services/db';
import { authService } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  onUserUpdate?: (user: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onUserUpdate }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<PostType | undefined>(undefined);
  const [createContext, setCreateContext] = useState<'general' | 'intimacy'>('general');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Naughty Gate State
  const [isNaughtyGateOpen, setIsNaughtyGateOpen] = useState(false);
  const [gateProcessing, setGateProcessing] = useState(false);

  // Header Navigation State
  const [isContentOpen, setIsContentOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Right Menu State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  
  // Split Notification & Message State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [messageTab, setMessageTab] = useState<'direct' | 'intimacy'>('direct');
  
  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const postMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const currentMode = user.contentPreference || 'dating';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) setIsContentOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchFocused(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setIsProfileMenuOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
      if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) setIsMessagesOpen(false);
      if (postMenuRef.current && !postMenuRef.current.contains(event.target as Node)) setIsPostMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMainCreateClick = () => {
    const path = location.pathname;
    setCreateContext('general');
    if (path.includes('/videos')) setCreateModalType('SHORT');
    else if (path.includes('/photos')) setCreateModalType('PHOTO');
    else if (path.includes('/comics')) setCreateModalType('COMIC');
    else if (path.includes('/collection')) setCreateModalType('COLLECTION');
    else if (path.includes('/knowledge-book')) setCreateModalType('RESOURCE');
    else setCreateModalType(undefined);
    setIsCreateModalOpen(true);
  };
  
  const handleIntimacyPost = () => {
      setCreateModalType('PHOTO');
      setCreateContext('intimacy');
      setIsCreateModalOpen(true);
      setIsPostMenuOpen(false);
  };

  const handleModeChange = (mode: 'dating' | 'adult') => {
    if (mode === 'adult' && user.contentPreference !== 'adult') {
        setIsNaughtyGateOpen(true);
        setIsProfileMenuOpen(false);
        return;
    }
    
    authService.updateContentPreference(mode);
    if (onUserUpdate) {
        onUserUpdate({ ...user, contentPreference: mode });
    }
    setIsProfileMenuOpen(false);
    navigate('/home');
  };

  const handleConfirmNaughty = async () => {
      setGateProcessing(true);
      // Simulate transaction processing
      await new Promise(r => setTimeout(r, 1200));
      
      // Update preference
      authService.updateContentPreference('adult');
      if (onUserUpdate) {
          onUserUpdate({ ...user, contentPreference: 'adult' });
      }
      
      setGateProcessing(false);
      setIsNaughtyGateOpen(false);
      navigate('/home');
      window.scrollTo(0, 0);
  };

  const toggleTheme = () => {
    const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
          setIsSearchFocused(false);
          setSearchQuery('');
      }
  };

  // Redesigned Mock Notifications using standardized Activity Hub Types
  const mockNotifications = [
      { id: 1, text: 'New follower: @NeonRider', time: '2m', unread: true, type: 'subscription' },
      { id: 2, text: 'Your post is trending!', time: '1h', unread: true, type: 'reach' },
      { id: 3, text: 'System update available', time: '1d', unread: false, type: 'system' },
      { id: 4, text: 'Sara sent a gift', time: '2h', unread: false, type: 'gift' },
      { id: 5, text: 'New comment on "City Lights"', time: '3h', unread: false, type: 'comment' },
      { id: 6, text: 'Video processed successfully', time: '4h', unread: true, type: 'upload' },
  ];
  
  const mockDirectMessages = [
      { id: 1, user: 'Sarah_Noir', text: 'Loved your latest video!', time: '5m', unread: true, avatar: 'https://picsum.photos/100/100?random=m1' },
      { id: 2, user: 'GamerPro', text: 'Collab next week?', time: '2h', unread: false, avatar: 'https://picsum.photos/100/100?random=m2' },
  ];

  const mockIntimacyMessages = [
      { id: 1, group: 'Velvet Circle', text: 'New exclusive drop tonight!', time: '10m', unread: true, avatar: 'https://picsum.photos/100/100?random=i1' },
      { id: 2, group: 'Cosplay Hub', text: 'Jessica: Who is going to the con?', time: '1h', unread: false, avatar: 'https://picsum.photos/100/100?random=i2' },
  ];
  
  const unreadNotifs = mockNotifications.filter(n => n.unread).length;
  const unreadMessages = mockDirectMessages.filter(m => m.unread).length + mockIntimacyMessages.filter(m => m.unread).length;

  // Content Menu Items
  const contentItems = [
      { label: 'Live Streams', path: '/live', icon: Camera },
      { label: 'Photos', path: '/photos', icon: ImageIcon },
      { label: 'Videos', path: '/videos', icon: Video },
      { label: 'Comics', path: '/comics', icon: BookOpen },
      { label: 'Collection', path: '/collection', icon: ShoppingBag },
      { label: 'Knowledge', path: '/knowledge-book', icon: FileText },
      { label: 'Pride Tags', path: '/tags', icon: Hash },
      { label: 'Random Chat', path: '/random-cam', icon: Shuffle },
      { label: 'Arcade', path: '/arcade', icon: Gamepad2 }
  ];

  const getNotifIconInfo = (type: string) => {
      switch(type) {
          case 'like': return { icon: Flame, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
          case 'subscription': return { icon: Crown, color: 'text-brand-500', bg: 'bg-brand-500/10', border: 'border-brand-500/20' };
          case 'comment': return { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
          case 'upload': return { icon: UploadCloud, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
          case 'reach': return { icon: BarChart2, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
          case 'gift': return { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
          case 'system': return { icon: Settings, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
          default: return { icon: Bell, color: 'text-gray-500', bg: 'bg-dark-800', border: 'border-dark-700' };
      }
  };

  return (
    <div className="flex flex-col h-screen text-gray-100 font-sans bg-dark-900">
      
      {/* Naughty Gate Modal */}
      {isNaughtyGateOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
              <div className="w-full max-w-md bg-[#120505] border border-red-600/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                  {/* Top Red Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                  
                  <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20 text-red-500 shadow-lg shadow-red-900/40">
                          <ShieldAlert size={32} />
                      </div>
                      
                      <div>
                          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Restricted Access</h2>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">18+ Content Protocol • Naughty Mode</p>
                      </div>

                      <div className="bg-red-950/20 border border-red-600/20 p-4 rounded-xl w-full">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Entry Fee</span>
                              <span className="text-lg font-black text-white flex items-center gap-1"><Lock size={14} className="text-red-500"/> 500 LSC</span>
                          </div>
                          <p className="text-[10px] text-gray-500 text-left">Unlocks uncensored feed, exclusive creator content, and private circles.</p>
                      </div>

                      <div className="flex gap-3 w-full">
                          <button 
                              onClick={() => setIsNaughtyGateOpen(false)}
                              className="flex-1 py-3.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handleConfirmNaughty}
                              disabled={gateProcessing}
                              className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                          >
                              {gateProcessing ? 'Verifying...' : 'Confirm'}
                          </button>
                      </div>
                      
                      <p className="text-[9px] text-gray-600 font-medium">
                          By confirming, you verify that you are 18 years of age or older.
                      </p>
                  </div>
              </div>
          </div>
      )}

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        userAvatar={user.avatarUrl}
        userId={user.id}
        isPremium={user.isPremium}
        contentPreference={user.contentPreference}
        initialType={createModalType}
        context={createContext}
        userRole={user.role} 
      />
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* --- HEADER --- */}
      <header className="h-20 border-b border-white/5 bg-dark-950/95 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between gap-4">
         
         {/* Left Side: Logo, Timeline, Content, Search */}
         <div className="flex items-center gap-4 md:gap-6 flex-1 max-w-5xl h-full">
             <div onClick={() => navigate('/home')} className="flex items-center gap-3 cursor-pointer group shrink-0">
                <div className="w-10 h-10 bg-brand-500 rounded-[5px] flex items-center justify-center font-bold text-white transition-transform group-hover:scale-105 shadow-lg">L</div>
                <span className="hidden md:block text-xl font-black tracking-tighter text-gray-100 uppercase">LuciSin</span>
             </div>

             {/* Timeline Button */}
             <button 
                onClick={() => navigate('/home')}
                className={`flex items-center gap-2 px-3 py-2 rounded-[5px] text-xs font-bold uppercase tracking-wide transition-all ${location.pathname === '/home' ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
             >
                 <LayoutList size={18} /> <span className="hidden lg:inline">Timeline</span>
             </button>

             {/* Content Dropdown */}
             <div className="relative shrink-0" ref={contentRef}>
                 <button 
                    onClick={() => setIsContentOpen(!isContentOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-[5px] text-xs font-bold uppercase tracking-wide transition-all ${isContentOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                     <LayoutGrid size={18} /> <span className="hidden lg:inline">Content</span> <ChevronDown size={14} />
                 </button>
                 {isContentOpen && (
                     <div className="absolute top-full left-0 mt-3 w-64 bg-dark-900 border border-white/10 rounded-[5px] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 origin-top-left grid grid-cols-1 gap-1">
                         {contentItems.map((item) => (
                             <button
                                key={item.label}
                                onClick={() => { navigate(item.path); setIsContentOpen(false); }}
                                className="w-full text-left px-3 py-2.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3 transition-colors"
                             >
                                 <item.icon size={16} className="text-gray-500" /> {item.label}
                             </button>
                         ))}
                     </div>
                 )}
             </div>

             {/* Search Bar */}
             <div className="relative flex-1 hidden md:flex items-center h-full" ref={searchRef}>
                 <form onSubmit={handleSearchSubmit} className="relative group w-full flex items-center bg-dark-900 border border-white/10 rounded-[5px] overflow-hidden focus-within:border-brand-500 transition-all">
                    <Search className="absolute left-4 z-10 text-gray-500 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        placeholder="Search..."
                        className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-sm text-white focus:outline-none placeholder:text-gray-600 font-medium z-10"
                    />
                 </form>
             </div>
         </div>

         {/* Center/Right: Actions */}
         <div className="flex items-center gap-2 md:gap-4 shrink-0">
             
             {/* Messages */}
             <div className="relative hidden md:block" ref={messagesRef}>
                 <button onClick={() => setIsMessagesOpen(!isMessagesOpen)} className={`p-2.5 rounded-[5px] transition-colors relative ${isMessagesOpen ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                     <MessageCircle size={20} />
                     {unreadMessages > 0 && (
                         <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-dark-900 px-0.5">
                             {unreadMessages}
                         </div>
                     )}
                 </button>
                 {isMessagesOpen && (
                     <div className="absolute top-full right-0 mt-3 w-80 bg-dark-900 border border-white/10 rounded-[5px] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                         <div className="flex border-b border-white/5">
                            <button onClick={() => setMessageTab('direct')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${messageTab === 'direct' ? 'text-brand-500 border-b-2 border-brand-500 bg-white/5' : 'text-gray-500 hover:text-white'}`}>
                                <MessageSquare size={12}/> Messages
                            </button>
                            <button onClick={() => setMessageTab('intimacy')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${messageTab === 'intimacy' ? 'text-brand-500 border-b-2 border-brand-500 bg-white/5' : 'text-gray-500 hover:text-white'}`}>
                                <Heart size={12}/> Intimacy
                            </button>
                         </div>
                         <div className="max-h-64 overflow-y-auto no-scrollbar">
                            {(messageTab === 'direct' ? mockDirectMessages : mockIntimacyMessages).map(m => (
                                <div key={m.id} className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer flex items-center gap-3">
                                    <img src={m.avatar} className="w-10 h-10 rounded-[5px] object-cover border border-white/10" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="text-xs font-bold text-white truncate">{messageTab === 'direct' ? m.user : m.group}</span>
                                            <span className="text-[9px] text-gray-500">{m.time}</span>
                                        </div>
                                        <p className={`text-[10px] truncate ${m.unread ? 'text-white font-bold' : 'text-gray-500'}`}>{m.text}</p>
                                    </div>
                                    {m.unread && <div className="w-2 h-2 rounded-full bg-brand-500"></div>}
                                </div>
                            ))}
                            {(messageTab === 'direct' ? mockDirectMessages : mockIntimacyMessages).length === 0 && (
                                <div className="p-8 text-center text-gray-500 text-xs">No new messages</div>
                            )}
                         </div>
                         <button 
                             onClick={() => { 
                                 if (messageTab === 'intimacy') {
                                     navigate('/intimacy');
                                 } else {
                                     navigate('/chat'); 
                                 }
                                 setIsMessagesOpen(false); 
                             }} 
                             className="w-full py-3 bg-dark-800 text-[10px] font-black uppercase text-white hover:bg-dark-700"
                        >
                            Chat
                         </button>
                     </div>
                 )}
             </div>

             {/* Notifications (Activity Hub Style) */}
             <div className="relative hidden md:block" ref={notificationsRef}>
                 <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`p-2.5 rounded-[5px] transition-colors relative ${isNotificationsOpen ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                     <Bell size={20} />
                     {unreadNotifs > 0 && (
                         <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-dark-900 px-0.5">
                             {unreadNotifs}
                         </div>
                     )}
                 </button>
                 {isNotificationsOpen && (
                     <div className="absolute top-full right-0 mt-3 w-80 bg-dark-900 border border-white/10 rounded-[5px] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                         <div className="p-3 border-b border-white/5 bg-dark-800 flex items-center gap-2">
                             <Activity size={14} className="text-brand-500"/>
                             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Activity</h3>
                         </div>
                         <div className="max-h-64 overflow-y-auto no-scrollbar">
                            {mockNotifications.map(n => {
                                const { icon: Icon, color, bg, border } = getNotifIconInfo(n.type);
                                return (
                                    <div key={n.id} className={`p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer flex gap-3 ${n.unread ? 'bg-brand-900/5' : ''}`}>
                                        <div className={`w-8 h-8 rounded-[5px] flex items-center justify-center shrink-0 border ${bg} ${border}`}>
                                            <Icon size={14} className={color} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-gray-200 font-medium leading-snug">{n.text}</p>
                                            <span className="text-[9px] text-gray-500 mt-1 block font-bold">{n.time} ago</span>
                                        </div>
                                    </div>
                                );
                            })}
                         </div>
                         <button onClick={() => { navigate('/notifications'); setIsNotificationsOpen(false); }} className="w-full py-3 bg-dark-800 text-[10px] font-black uppercase text-white hover:bg-dark-700">View All</button>
                     </div>
                 )}
             </div>

             {/* Create Button */}
             <div className="relative" ref={postMenuRef}>
                <button 
                    onClick={() => setIsPostMenuOpen(!isPostMenuOpen)}
                    className="hidden md:flex items-center justify-center w-10 h-10 bg-brand-600 hover:bg-brand-500 text-white rounded-[5px] shadow-lg transition-all active:scale-95"
                >
                    <PlusSquare size={20} />
                </button>
                {isPostMenuOpen && (
                    <div className="absolute top-full right-0 mt-3 w-56 bg-dark-900 border border-white/10 rounded-[5px] shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-dark-800/50">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Create</span>
                             <button onClick={() => setIsPostMenuOpen(false)} className="text-gray-400 hover:text-white"><X size={14}/></button>
                        </div>
                        <button onClick={() => { handleMainCreateClick(); setIsPostMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 flex items-center gap-2">
                            <Zap size={14} className="text-brand-500"/> Quick Post
                        </button>
                        {/* Start Poll Removed */}
                        <button onClick={handleIntimacyPost} className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                            <Heart size={14}/> Post Intimacy
                        </button>
                        <button onClick={() => { navigate('/manage-content'); setIsPostMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                            <LayoutGrid size={14}/> Content Studio
                        </button>
                    </div>
                )}
             </div>

             {/* Profile */}
             <div className="relative" ref={profileMenuRef}>
                 <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-10 h-10 rounded-[5px] overflow-hidden border border-white/20 hover:border-brand-500 transition-colors">
                     <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                 </button>

                 {isProfileMenuOpen && (
                     <div className="absolute top-full right-0 mt-3 w-72 bg-dark-900 border border-white/10 rounded-[5px] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                         {/* User Header with Balance */}
                         <div className="p-4 border-b border-white/5 bg-dark-800/50 flex justify-between items-center">
                            <div 
                                className="flex items-center gap-3 cursor-pointer hover:opacity-80" 
                                onClick={() => { navigate(`/profile/${user.username}`); setIsProfileMenuOpen(false); }}
                            >
                                <img src={user.avatarUrl} className="w-10 h-10 rounded-[5px] border border-white/10" alt="" />
                                <div className="min-w-0">
                                    <h4 className="font-bold text-white text-sm truncate">{user.displayName}</h4>
                                    <p className="text-[10px] text-gray-500 truncate">@{user.username}</p>
                                </div>
                            </div>
                            <div 
                                className="text-right cursor-pointer hover:opacity-80 transition-opacity" 
                                onClick={() => { navigate('/points'); setIsProfileMenuOpen(false); }}
                            >
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Balance</span>
                                <span className="text-xs font-black text-brand-500 tabular-nums">{(user.walletBalance || 0).toLocaleString()} LSC</span>
                            </div>
                         </div>
                         
                         {/* Upgrade Button */}
                         <div className="p-2 border-b border-white/5">
                             <button 
                                onClick={() => { navigate('/subscriptions'); setIsProfileMenuOpen(false); }}
                                className="w-full py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-black text-[10px] uppercase tracking-widest rounded-[5px] shadow-lg flex items-center justify-center gap-2 transition-all"
                            >
                                 <Sparkles size={14} fill="currentColor"/> Upgrade Plan
                             </button>
                         </div>

                         {/* Experience Mode Section */}
                         <div className="p-4 border-b border-white/5">
                             <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Experience Mode</div>
                             <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => handleModeChange('dating')} 
                                    className={`py-2.5 rounded-[5px] text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-1 ${currentMode === 'dating' ? 'bg-brand-second text-black border-brand-second' : 'bg-dark-800 text-gray-400 border-white/5 hover:text-white'}`}
                                >
                                    {currentMode === 'dating' && <Heart size={10} fill="currentColor"/>} Dating
                                </button>
                                <button 
                                    onClick={() => handleModeChange('adult')} 
                                    className={`py-2.5 rounded-[5px] text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-1 ${currentMode === 'adult' ? 'bg-brand-500 text-white border-brand-500' : 'bg-dark-800 text-gray-400 border-white/5 hover:text-white'}`}
                                >
                                    {currentMode === 'adult' && <Flame size={10} fill="currentColor"/>} Naughty
                                </button>
                             </div>
                         </div>

                         {/* Account Section */}
                         <div className="p-2 border-b border-white/5">
                             <div className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Account</div>
                             <button onClick={() => { navigate(`/profile/${user.username}`); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                 <User size={14}/> My Profile
                             </button>
                             <button onClick={() => { navigate('/manage-content'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                 <LayoutGrid size={14}/> Content Studio
                             </button>
                             <button onClick={() => { navigate(`/profile/${user.username}/settings`); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                 <Settings size={14}/> Settings
                             </button>
                         </div>

                         {/* Community Section */}
                         <div className="p-2 border-b border-white/5">
                             <div className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Community</div>
                             <button onClick={() => { navigate('/intimacy'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                 <Heart size={14}/> Intimacy
                             </button>
                             <button onClick={() => { navigate(`/profile/${user.username}/network/groups`); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                 <Users size={14}/> My Circles
                             </button>
                             <button onClick={() => { navigate('/leaderboard'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                 <Trophy size={14}/> Leaderboard
                             </button>
                             <button onClick={() => { navigate('/referrals'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                 <Users size={14}/> Referrals
                             </button>
                         </div>

                         {/* Log Out & Help */}
                         <div className="p-2 grid grid-cols-5 gap-1">
                             <button onClick={() => { onLogout(); setIsProfileMenuOpen(false); }} className="col-span-4 w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-[5px] flex items-center gap-3">
                                 <LogOut size={16}/> Log Out
                             </button>
                             <button onClick={() => { navigate('/help-center'); setIsProfileMenuOpen(false); }} className="col-span-1 flex items-center justify-center bg-dark-800 hover:bg-white/10 rounded-[5px] text-gray-400 hover:text-white transition-colors" title="Help Center">
                                 <HelpCircle size={16}/>
                             </button>
                         </div>
                     </div>
                 )}
             </div>
         </div>
      </header>

      {/* Main Content Area - Full width since Sidebar is gone */}
      <main id="main-content" className="flex-1 overflow-y-auto no-scrollbar relative bg-dark-900" ref={scrollContainerRef}>
        {children}
      </main>

      <BottomNav onCreateClick={handleMainCreateClick} onMenuClick={() => setIsProfileMenuOpen(true)} />
    </div>
  );
};
