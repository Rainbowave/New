
import React, { useState, useEffect, useRef } from 'react';
import { 
    Crown, Video, Clock, Zap, Smile, User, Settings, AlertCircle, 
    Flame, SkipForward, PhoneOff, Mic, MicOff, Video as VideoIcon, 
    VideoOff, Loader2, Gift, Gamepad2, Star, Shield, Search, 
    Radio, Info, Share2, History, Target, X, HelpCircle,
    Smile as SmileIcon, RefreshCw, Send, MessageSquare, Heart,
    Filter, Lock, Unlock, Coins, Check, Tag, Users, Globe, ShieldCheck
} from 'lucide-react';
import { useMatchRTC } from '../hooks/useMatchRTC';
import { TipModal } from '../components/TipModal';
import { Watermark } from '../components/Shared';
import { authService } from '../services/authService';
import { db } from '../services/db';

// --- Sub-Components ---

const DiscoveryLogEntry = ({ date, duration, partner, rating, avatar }: any) => (
    <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded hover:bg-white/[0.05] transition-all cursor-pointer group">
        <div className="w-10 h-10 rounded-sm overflow-hidden border border-white/10 shrink-0">
            <img src={avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-white text-[11px] uppercase tracking-tight truncate">{partner}</span>
                <span className="text-[9px] font-bold text-gray-600">{duration}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex text-yellow-500 text-[8px]">
                    {'★'.repeat(rating)}{'☆'.repeat(5-rating)}
                </div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{date}</span>
            </div>
        </div>
    </div>
);

const UserScanner = ({ gender, mood, sexuality, accentColor, accentText }: { gender: string, mood: string, sexuality: string, accentColor: string, accentText: string }) => (
    <div className="flex flex-col items-center justify-center h-full relative">
        <div className="relative w-64 h-64 flex items-center justify-center">
            <div className={`absolute inset-0 border ${accentColor.replace('bg-', 'border-')}/20 rounded-full animate-pulse`}></div>
            <div className={`absolute inset-8 border ${accentColor.replace('bg-', 'border-')}/10 rounded-full animate-[ping_3s_linear_infinite]`}></div>
            <div className={`absolute inset-4 border ${accentColor.replace('bg-', 'border-')}/30 rounded-full animate-[spin_8s_linear_infinite]`}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 ${accentColor.replace('bg-', 'bg-')} rounded-full shadow-[0_0_15px_currentColor]`}></div>
            </div>
            <div className={`w-32 h-32 ${accentColor.replace('bg-', 'bg-')}/5 rounded-full flex items-center justify-center border ${accentColor.replace('bg-', 'border-')}/20 shadow-[0_0_40px_currentColor] backdrop-blur-sm`}>
                <Radio size={48} className={`${accentText} animate-pulse`} />
            </div>
        </div>
        
        <div className="mt-12 text-center space-y-3">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">Scanning Pride</h3>
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-md mx-auto">
                 <span className={`${accentColor.replace('bg-', 'bg-')}/10 border ${accentColor.replace('bg-', 'border-')}/20 ${accentText} px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest`}>{gender}</span>
                 <span className="bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">{mood}</span>
                 <span className="bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">{sexuality}</span>
            </div>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] animate-pulse pt-2">
                Locating Partner...
            </p>
        </div>
    </div>
);

const UnlockFilterModal = ({ isOpen, onClose, cost, balance, onConfirm, filterName }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto text-brand-500 border border-brand-500/30">
                        <Lock size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Unlock {filterName}</h3>
                        <p className="text-xs text-gray-400 font-medium mt-2">
                            This filter is reserved for Stars. Unlock it for this session using points.
                        </p>
                    </div>
                    
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase">Cost</span>
                        <span className="text-lg font-black text-yellow-500 flex items-center gap-1">
                            {cost} <Coins size={14} />
                        </span>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-bold text-xs hover:bg-white/5 hover:text-white transition-colors">Cancel</button>
                        <button 
                            onClick={onConfirm}
                            disabled={balance < cost}
                            className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest shadow-lg"
                        >
                            {balance < cost ? 'Need Points' : 'Unlock Now'}
                        </button>
                    </div>
                    {balance < cost && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Insufficient Balance ({balance})</p>}
                </div>
            </div>
        </div>
    );
};

// Mode Configs
const MODE_CONFIG = {
    dating: {
        accentColor: 'bg-brand-second',
        accentText: 'text-brand-second',
        hoverBg: 'hover:bg-brand-second',
        border: 'border-brand-second',
        vibes: ['Friendly', 'Romantic', 'Chat', 'Date', 'Fun'],
        icon: Heart
    },
    adult: {
        accentColor: 'bg-brand-500',
        accentText: 'text-brand-500',
        hoverBg: 'hover:bg-brand-500',
        border: 'border-brand-500',
        vibes: ['Flirty', 'Wild', 'Private', 'Kinky', 'Show'],
        icon: Flame
    }
};

export default function RandomCam() {
  const { status, error, localStream, remoteStream, startMatch, nextMatch, endSession } = useMatchRTC();
  const [localVideoEnabled, setLocalVideoEnabled] = useState(true);
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  
  // Dynamic Settings from DB
  const [config, setConfig] = useState<any>(null);
  
  // Dynamic Lists from Agenda Settings
  const [genderList, setGenderList] = useState<any[]>([]);
  const [sexualityList, setSexualityList] = useState<any[]>([]);

  // Filter States
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedMood, setSelectedMood] = useState('Friendly');
  const [selectedSexuality, setSelectedSexuality] = useState('Ask Me');
  
  // Lock Logic
  const [unlockedGenders, setUnlockedGenders] = useState<string[]>(['All']);
  const [unlockModal, setUnlockModal] = useState<{ isOpen: boolean, gender: string, cost: number } | null>(null);
  
  // Chat
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  // Partner Rating
  const [partnerRating, setPartnerRating] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentUser = authService.getCurrentUser();
  const isPremium = currentUser?.isLuciStar || currentUser?.isPremium;
  const [userBalance, setUserBalance] = useState(currentUser?.coins || 0);

  // Determine Mode
  const currentMode = (currentUser?.contentPreference === 'adult') ? 'adult' : 'dating';
  const modeSettings = MODE_CONFIG[currentMode];
  const { accentColor, accentText, hoverBg, border } = modeSettings;

  useEffect(() => {
      // Load Random Config & Agenda
      const settings = db.getSiteSettings();
      setConfig(settings.configs.random);
      
      // Override Moods based on mode
      const activeVibes = modeSettings.vibes;
      setSelectedMood(activeVibes[0]);
      
      // Load Dynamic Lists from Agenda
      if (settings.agenda?.genders) {
          const mappedGenders = [{ label: 'All', image: '' }, ...settings.agenda.genders];
          setGenderList(mappedGenders);
      } else {
          setGenderList([{ label: 'All', image: '' }, { label: 'Man', image: '' }, { label: 'Woman', image: '' }]);
      }
      
      if (settings.agenda?.orientations) {
          setSexualityList(settings.agenda.orientations);
          if (settings.agenda.orientations.length > 0) setSelectedSexuality(settings.agenda.orientations[0].label);
      } else {
          setSexualityList([{label: 'Straight', image: ''}, {label: 'Gay', image: ''}]);
      }

      const w = db.getWallet(currentUser?.id || '');
      setUserBalance(w.balance);
  }, [currentUser, currentMode]);

  useEffect(() => {
      if (localStream && localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
      if (remoteStream && remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleVideo = () => {
      if (localStream) {
          localStream.getVideoTracks().forEach(track => track.enabled = !localVideoEnabled);
          setLocalVideoEnabled(!localVideoEnabled);
      }
  };

  const toggleAudio = () => {
      if (localStream) {
          localStream.getTracks().forEach(track => { if(track.kind === 'audio') track.enabled = !localAudioEnabled; });
          setLocalAudioEnabled(!localAudioEnabled);
      }
  };

  const handleSendChat = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim()) return;
      setChatMessages([...chatMessages, { sender: 'me', text: chatInput, time: 'Now' }]);
      setChatInput('');
  };

  const handleGenderSelect = (gender: string, cost: number) => {
      // If locked via config and user is not premium and not unlocked yet
      if (config?.genderLock && !isPremium && gender !== 'All' && !unlockedGenders.includes(gender)) {
           setUnlockModal({ isOpen: true, gender, cost });
      } else {
           setSelectedGender(gender);
      }
  };

  const confirmUnlock = () => {
      if (!unlockModal) return;
      if (userBalance >= unlockModal.cost) {
          const newBal = db.updateWallet(currentUser?.id || 'guest', -unlockModal.cost);
          setUserBalance(newBal);
          setUnlockedGenders([...unlockedGenders, unlockModal.gender]);
          setSelectedGender(unlockModal.gender);
          setUnlockModal(null);
      }
  };

  const genderOptionsWithCost = genderList.map(g => ({
      label: g.label,
      image: g.image,
      count: '1K+', // Mock
      cost: config?.genderCost?.[g.label] || 0
  }));

  if (!config) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-brand-500" /></div>;

  if (status === 'connected' || status === 'searching') {
      return (
          <div className="h-full flex flex-col md:flex-row relative bg-black overflow-hidden animate-in fade-in duration-500">
              <TipModal isOpen={isTipModalOpen} onClose={() => setIsTipModalOpen(false)} creatorName="Random Star" />

              <div className="flex-1 relative flex flex-col order-1">
                  {/* Top Bar */}
                  <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                      <div className="flex items-center gap-4 pointer-events-auto">
                          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                  {status === 'connected' ? 'Connected' : 'Searching...'}
                              </span>
                          </div>
                      </div>
                      <div className="flex items-center gap-2 pointer-events-auto">
                          <button onClick={endSession} className="p-2.5 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-lg shadow-red-900/40 backdrop-blur-md transition-all">
                              <X size={20} />
                          </button>
                      </div>
                  </div>

                  <div className="flex-1 relative flex items-center justify-center bg-black">
                      {status === 'connected' && remoteStream ? (
                          <div className="w-full h-full relative">
                              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover bg-[#0a0a0a]" />
                          </div>
                      ) : (
                          <UserScanner 
                              gender={selectedGender} 
                              mood={selectedMood} 
                              sexuality={selectedSexuality} 
                              accentColor={accentColor}
                              accentText={accentText}
                          />
                      )}

                      {/* Partner Info & Rating (Bottom Left) */}
                      {status === 'connected' && (
                          <div className="absolute bottom-24 left-6 z-30 animate-in slide-in-from-left-4 fade-in duration-500">
                               <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4">
                                   <div className="relative">
                                       <img src="https://picsum.photos/100/100?random=partner" className="w-12 h-12 rounded-full border-2 border-white/10" alt="Partner" />
                                       <div className={`absolute -bottom-1 -right-1 ${accentColor} text-white p-0.5 rounded-full border border-black`}><ShieldCheck size={10} /></div>
                                   </div>
                                   <div>
                                       <h3 className="font-black text-white text-sm uppercase italic tracking-tighter">Random_Star_99</h3>
                                       <div className="flex items-center gap-1 mt-1">
                                            {[1,2,3,4,5].map(s => (
                                                <button key={s} onClick={() => setPartnerRating(s)} className="focus:outline-none group">
                                                    <Star size={12} className={`${s <= (partnerRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600 group-hover:text-yellow-500/50'}`} />
                                                </button>
                                            ))}
                                       </div>
                                   </div>
                               </div>
                          </div>
                      )}

                      {/* Local Video Picture-in-Picture (Bottom Right) */}
                      <div className="absolute right-6 bottom-24 w-32 h-48 md:w-40 md:h-60 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-dark-900 z-30 group transition-all">
                          {localStream ? (
                              <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform scale-x-[-1] ${!localVideoEnabled ? 'opacity-0' : ''}`} />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center bg-dark-800">
                                  <Loader2 className={`animate-spin ${accentText}`} size={24} />
                              </div>
                          )}
                          {!localVideoEnabled && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-800 gap-2">
                                  <VideoOff size={24} className="text-gray-600" />
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="h-20 flex items-center justify-center px-6 z-40 bg-gradient-to-t from-black/90 to-transparent">
                      <div className="flex items-center gap-4">
                          <div className="flex gap-2 bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10">
                              <button onClick={toggleAudio} className={`p-3.5 rounded-xl transition-all ${localAudioEnabled ? 'hover:bg-white/10 text-white' : 'bg-red-500/20 text-red-500'}`}>
                                  {localAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                              </button>
                              <button onClick={toggleVideo} className={`p-3.5 rounded-xl transition-all ${localVideoEnabled ? 'hover:bg-white/10 text-white' : 'bg-red-500/20 text-red-500'}`}>
                                  {localVideoEnabled ? <VideoIcon size={20} /> : <VideoOff size={20} />}
                              </button>
                          </div>

                          <button onClick={nextMatch} disabled={status === 'searching'} className={`h-14 px-8 ${accentColor} text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-900/40 ${hoverBg} transition-all disabled:opacity-50 flex items-center gap-2`}>
                                {status === 'searching' ? <Loader2 size={16} className="animate-spin"/> : <><SkipForward size={18} /> SKIP PARTNER</>}
                          </button>

                          <button onClick={() => setIsTipModalOpen(true)} className="h-14 w-14 bg-yellow-500 text-black rounded-2xl flex items-center justify-center hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-900/30">
                              <Gift size={24} />
                          </button>
                      </div>
                  </div>
              </div>

              {/* Chat Sidebar (Moved to Right) */}
              {config.allowText && (
                  <div className="hidden lg:flex w-80 bg-dark-950 border-l border-white/5 flex-col shrink-0 z-20 order-2">
                      <div className="p-6 border-b border-white/5 bg-dark-900/50">
                          <h3 className="font-black text-white uppercase italic tracking-widest text-sm flex items-center gap-2">
                              <MessageSquare size={18} className={accentText} /> Live Conversation
                          </h3>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                          {chatMessages.length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-6">
                                  <MessageSquare size={32} className="mb-4" />
                                  <p className="text-[10px] font-black uppercase tracking-widest">Connection established. Start chatting!</p>
                              </div>
                          ) : (
                              chatMessages.map((m, i) => (
                                  <div key={i} className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                      <div className={`px-4 py-2 rounded-xl text-xs max-w-[90%] ${m.sender === 'me' ? `${accentColor} text-white` : 'bg-dark-800 text-gray-200'}`}>
                                          {m.text}
                                      </div>
                                      <span className="text-[8px] text-gray-600 mt-1 uppercase font-bold">{m.time}</span>
                                  </div>
                              ))
                          )}
                          <div ref={chatEndRef} />
                      </div>
                      <form onSubmit={handleSendChat} className="p-4 border-t border-white/5 bg-dark-900">
                          <div className="relative">
                              <input 
                                  type="text" 
                                  value={chatInput}
                                  onChange={(e) => setChatInput(e.target.value)}
                                  placeholder="Type message..."
                                  className={`w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-4 pr-10 text-xs text-white focus:${border} outline-none transition-all`}
                              />
                              <button type="submit" className={`absolute right-2 top-1/2 -translate-y-1/2 ${accentText} p-1.5 hover:scale-110 transition-transform`}>
                                  <Send size={16} />
                              </button>
                          </div>
                      </form>
                  </div>
              )}
          </div>
      );
  }

  // --- Initial Setup View ---
  return (
    <div className="max-w-[1400px] mx-auto py-10 px-8 pb-32 animate-in fade-in duration-700 h-full flex flex-col">
        {/* Unlock Filter Modal */}
        <UnlockFilterModal 
            isOpen={!!unlockModal} 
            onClose={() => setUnlockModal(null)}
            cost={unlockModal?.cost}
            filterName={unlockModal?.gender}
            balance={userBalance}
            onConfirm={confirmUnlock}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start flex-1 min-h-0">
            {/* Left: Preview & Start */}
            <div className="lg:col-span-8 space-y-10">
                {error && (
                    <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-4 text-red-400 shadow-2xl animate-in shake">
                        <AlertCircle size={24} className="shrink-0 mt-1" />
                        <div className="flex-1">
                            <p className="text-sm font-black uppercase tracking-widest mb-4 leading-relaxed">{error}</p>
                            <button onClick={startMatch} className="bg-red-500 text-white px-6 py-2 rounded font-black text-[10px] uppercase tracking-widest hover:bg-red-400 transition-all flex items-center gap-2">
                                <RefreshCw size={14} /> Retry Authorization
                            </button>
                        </div>
                    </div>
                )}

                <div className="relative group overflow-hidden rounded-2xl aspect-video border border-white/5 bg-dark-800 shadow-2xl">
                    <div className={`absolute inset-0 bg-[url('https://picsum.photos/1200/800?random=cam_bg_${currentMode}')] bg-cover opacity-20 grayscale mix-blend-overlay`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900/40"></div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center gap-8">
                        <div className="relative">
                            <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_60px_rgba(144,9,51,0.2)]">
                                <Radio size={40} className={`${accentText} animate-pulse`} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Random Cam</h3>
                            <div className="flex justify-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1"><Users size={12}/> {currentMode === 'adult' ? '18+ Only' : 'Community'}</span>
                                <span className="flex items-center gap-1"><Globe size={12}/> Global</span>
                            </div>
                        </div>
                        <button 
                            onClick={startMatch}
                            className={`bg-white text-black px-16 py-6 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_40px_rgba(255,255,255,0.1)] ${hoverBg} hover:text-white transition-all hover:scale-105 active:scale-95 border-4 border-transparent`}
                        >
                            Start Matching
                        </button>
                    </div>
                    <Watermark className="bottom-8 right-8" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Shield, title: "Protected", desc: "Moderated environment" },
                        { icon: Zap, title: "Instant", desc: "Low latency connection" },
                        { icon: Gift, title: "Rewards", desc: "Earn tips while chatting" }
                    ].map((feat, i) => (
                        <div key={i} className={`bg-dark-800 p-6 rounded-2xl border border-white/5 flex items-center gap-4 group hover:${border}/30 transition-colors`}>
                            <div className={`p-3 bg-dark-900 rounded-xl ${accentText} group-hover:text-white transition-colors`}>
                                <feat.icon size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-xs uppercase tracking-widest">{feat.title}</h4>
                                <p className="text-[10px] text-gray-500 font-medium">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Preferences & Logs */}
            <div className="lg:col-span-4 space-y-6 h-full flex flex-col min-h-0">
                
                {/* 1. Target Gender (Lockable) */}
                <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl space-y-6 shrink-0">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                             <h3 className={`text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2`}>
                                <Target size={16} className={accentText} /> Gender
                            </h3>
                            {isPremium && <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-1"><Crown size={10} /> Unlocked</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            {genderOptionsWithCost.map(g => {
                                const isLocked = !isPremium && config?.genderLock && g.label !== 'All' && !unlockedGenders.includes(g.label);
                                return (
                                    <button 
                                        key={g.label} 
                                        onClick={() => handleGenderSelect(g.label, g.cost)}
                                        className={`w-full py-3 px-4 rounded-xl transition-all flex items-center justify-between border ${
                                            selectedGender === g.label 
                                            ? `${accentColor} text-white ${border} shadow-lg` 
                                            : 'bg-dark-900/50 border-transparent text-gray-400 hover:bg-dark-900 hover:text-white hover:border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isLocked ? (
                                                <Lock size={14} className="text-gray-500" /> 
                                            ) : g.image ? (
                                                <img src={g.image} className="w-5 h-5 object-cover" alt={g.label} />
                                            ) : (
                                                <User size={14} />
                                            )}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{g.label}</span>
                                        </div>
                                        {isLocked ? (
                                             <div className="flex items-center gap-1 text-[9px] font-bold text-yellow-500 bg-yellow-900/10 px-2 py-0.5 rounded border border-yellow-500/20">
                                                 {g.cost} <Coins size={10} />
                                             </div>
                                        ) : (
                                            <span className="text-[9px] font-bold opacity-60">{g.count}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. Mood Tags (Dynamic based on Mode) */}
                    <div>
                        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                            <modeSettings.icon size={16} className={accentText} /> Current Vibe
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {modeSettings.vibes.map((mood: string) => (
                                <button
                                    key={mood}
                                    onClick={() => setSelectedMood(mood)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                                        selectedMood === mood
                                        ? `${accentColor} text-white ${border} shadow-lg`
                                        : 'bg-dark-900 text-gray-500 border-white/5 hover:text-white hover:border-white/20'
                                    }`}
                                >
                                    {mood}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Sexuality Tags */}
                    <div>
                        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                            <Heart size={16} className="text-pink-500" /> Identity
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {sexualityList.map((sex: any) => (
                                <button
                                    key={sex.id}
                                    onClick={() => setSelectedSexuality(sex.label)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                                        selectedSexuality === sex.label
                                        ? 'bg-pink-500 text-white border-pink-500 shadow-lg'
                                        : 'bg-dark-900 text-gray-500 border-white/5 hover:text-white hover:border-white/20'
                                    }`}
                                >
                                    {sex.image && <img src={sex.image} className="w-4 h-3 object-cover rounded-[1px]" alt="" />}
                                    {sex.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* History Log */}
                <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col flex-1 min-h-0">
                    <div className="flex items-center gap-3 mb-6 shrink-0 border-b border-white/5 pb-4">
                        <History className="text-gray-500" size={18} />
                        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Recent Matches</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1 custom-scrollbar-thin">
                        <DiscoveryLogEntry date="Today" duration="15:42" partner="Sarah_Tech" rating={5} avatar="https://picsum.photos/100/100?random=1" />
                        <DiscoveryLogEntry date="Today" duration="08:20" partner="Glitch_Mod" rating={4} avatar="https://picsum.photos/100/100?random=2" />
                        <DiscoveryLogEntry date="Yesterday" duration="22:10" partner="VibeStar" rating={5} avatar="https://picsum.photos/100/100?random=3" />
                        <DiscoveryLogEntry date="Yesterday" duration="05:15" partner="Alpha_User" rating={3} avatar="https://picsum.photos/100/100?random=4" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
