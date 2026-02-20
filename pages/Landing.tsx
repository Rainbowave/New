
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Zap, Users, Globe, Rocket, Music, Palette, 
  Dumbbell, Utensils, Cpu, Shirt, GraduationCap, 
  ArrowRight, CheckCircle, Heart, BarChart,
  DollarSign, Hash, Layers, Twitter, Instagram, Youtube, Facebook,
  MessageCircle, Eye, ThumbsUp, Sparkles, Lock, Lightbulb, Crown, Flame,
  CreditCard, Shield, Video, BookOpen, ShoppingBag, Terminal, FileText,
  PlusCircle, PenTool, Globe2, X, Send, Database, Newspaper, ShieldCheck, EyeOff,
  Smartphone, Star, Check, Plus, Flag, Megaphone, Camera, Headphones, Gamepad2
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const STYLES = {
    global: "min-h-screen bg-dark-900 text-white font-sans selection:bg-brand-500/30",
    nav: {
        wrapper: "border-b border-dark-800 bg-dark-900/80 backdrop-blur fixed top-0 w-full z-50",
        container: "max-w-7xl mx-auto px-6 h-20 flex items-center justify-between",
        logoWrapper: "flex items-center gap-2 cursor-pointer",
        logoIcon: "w-9 h-9 bg-gradient-to-tr from-brand-600 to-purple-600 rounded-md flex items-center justify-center font-bold text-white text-lg",
        logoText: "text-lg font-bold tracking-tight uppercase",
        links: "hidden md:flex items-center gap-8 text-sm font-medium text-gray-400",
        linkItem: "hover:text-white transition-colors cursor-pointer",
        actions: "flex items-center gap-4",
        loginBtn: "text-gray-300 hover:text-white font-medium px-2 text-sm",
        signupBtn: "bg-white text-dark-900 hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold text-sm transition-colors"
    },
    hero: {
        wrapper: "pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
        headline: "text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight",
        gradientText: "text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-pink-500",
        description: "text-lg text-gray-400 mb-8 max-w-lg leading-relaxed",
        btnGroup: "flex flex-col sm:flex-row gap-4 mb-12",
        primaryBtn: "bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-md font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-900/40",
        secondaryBtn: "bg-dark-800 border border-dark-700 hover:border-dark-600 text-white px-8 py-4 rounded-md font-bold text-lg flex items-center justify-center gap-2 transition-all",
        statsWrapper: "flex items-center gap-8 border-t border-dark-800 pt-8",
        statValue: "text-2xl font-bold text-white",
        statLabel: "text-xs text-gray-500 uppercase tracking-wider font-bold",
        visuals: {
            wrapper: "relative h-[600px] hidden lg:block",
            card1: "absolute top-0 right-0 w-64 h-80 z-10 transition-transform duration-700 hover:scale-105 hover:z-30",
            card2: "absolute bottom-10 left-10 w-60 h-72 z-20 transition-transform duration-700 hover:scale-105 hover:z-30",
            glow: "absolute top-20 left-20 w-48 h-48 bg-brand-600 rounded-full blur-[100px] opacity-50 -z-10"
        }
    },
    footer: {
        wrapper: "bg-[#010100] border-t border-dark-800 pt-16 pb-8",
        container: "max-w-7xl mx-auto px-6",
        grid: "grid grid-cols-2 md:grid-cols-4 gap-8 mb-16",
        socialLink: "w-10 h-10 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all cursor-pointer",
        bottomBar: "border-t border-dark-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600"
    }
};

const PathCard = React.memo(({ title, desc }: { title: string, desc: string }) => (
  <div className="bg-dark-800/40 backdrop-blur-md border border-dark-700 p-8 rounded-md relative overflow-hidden group hover:border-brand-500 transition-all">
    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
));

export default function Landing() {
  const navigate = useNavigate();
  
  const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "LuciSin",
      "url": "https://lucisin.com",
      "potentialAction": {
          "@type": "SearchAction",
          "target": "https://lucisin.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
      }
  };

  useSEO(
      'LuciSin - The Ultimate Creator Sanctuary',
      'Join LuciSin to stream, share content, sell products, and connect with fans. The premier platform for creators, artists, and influencers.',
      ['creators', 'social', 'crypto', 'streaming', 'lucisin'],
      'https://lucisin.com/og-image.jpg',
      'website',
      structuredData
  );

  const heroRotations = useMemo(() => ({
      card1: Math.random() * 6 + 2,
      card2: -(Math.random() * 6 + 2)
  }), []);
  
  // Specific requested paths
  const displayPaths = [
      { title: 'Dating', desc: 'Connect deeply.' },
      { title: 'Naughty', desc: 'Explore freely.' },
      { title: 'Browse', desc: 'Discover content.' },
      { title: 'Earn', desc: 'Monetize content.' }
  ];
  
  // Hardcoded Identity Flags for display
  const identityFlags = [
      { label: 'Gay', desc: 'Men loving Men', image: '' },
      { label: 'Lesbian', desc: 'Women loving Women', image: '' },
      { label: 'Bisexual', desc: 'Attracted to both', image: '' },
      { label: 'Trans', desc: 'Beautiful Soul', image: '' },
      { label: 'Queer', desc: 'Undefined & Free', image: '' }
  ];

  // Hardcoded Interests
  const interests = [
      { id: '1', label: 'Gaming', desc: 'Level Up', image: 'https://picsum.photos/400/300?random=int1' },
      { id: '2', label: 'Art', desc: 'Visuals', image: 'https://picsum.photos/400/300?random=int2' },
      { id: '3', label: 'Music', desc: 'Audio', image: 'https://picsum.photos/400/300?random=int3' },
      { id: '4', label: 'Tech', desc: 'Future', image: 'https://picsum.photos/400/300?random=int4' },
      { id: '5', label: 'Fashion', desc: 'Style', image: 'https://picsum.photos/400/300?random=int5' },
      { id: '6', label: 'Vlog', desc: 'Life', image: 'https://picsum.photos/400/300?random=int6' },
  ];

  // Community Personas for Section 8
  const communityPersonas = [
      { id: 1, name: "Alex", flag: "Gay", desc: "Tech Lead & Gamer", tag: "Tech", img: "https://picsum.photos/100/100?random=p1" },
      { id: 2, name: "Sarah", flag: "Lesbian", desc: "Digital Artist", tag: "Design", img: "https://picsum.photos/100/100?random=p2" },
      { id: 3, name: "Jordan", flag: "Bisexual", desc: "Community Host", tag: "Community", img: "https://picsum.photos/100/100?random=p3" },
      { id: 4, name: "Casey", flag: "Trans", desc: "Safety Guardian", tag: "Safety", img: "https://picsum.photos/100/100?random=p4" },
      { id: 5, name: "Riley", flag: "Queer", desc: "Fashion Icon", tag: "Growth", img: "https://picsum.photos/100/100?random=p5" },
      { id: 6, name: "Jamie", flag: "Non-binary", desc: "Music Producer", tag: "Inspiration", img: "https://picsum.photos/100/100?random=p6" }
  ];

  const getFlagGradient = (flag: string) => {
      switch(flag) {
          case 'Gay': return 'from-teal-400 via-green-400 to-blue-500';
          case 'Lesbian': return 'from-orange-500 via-white to-pink-500';
          case 'Bisexual': return 'from-pink-500 via-purple-500 to-blue-500';
          case 'Trans': return 'from-cyan-400 via-pink-400 to-white';
          case 'Queer': return 'from-purple-500 via-pink-500 to-indigo-500';
          default: return 'from-brand-500 to-purple-600';
      }
  };

  return (
    <div className={STYLES.global}>
      <nav className={STYLES.nav.wrapper}>
         <div className={STYLES.nav.container}>
             <div className={STYLES.nav.logoWrapper} onClick={() => navigate('/')}>
                <div className={STYLES.nav.logoIcon}>L</div>
                <span className={STYLES.nav.logoText}>LuciSin</span>
             </div>
             
             <div className={STYLES.nav.links}>
                 <span onClick={() => navigate('/search')} className={STYLES.nav.linkItem}>Discover</span>
                 <span onClick={() => navigate('/start-creating')} className={STYLES.nav.linkItem}>Become a Creator</span>
                 <span onClick={() => navigate('/live')} className={STYLES.nav.linkItem}>Live</span>
             </div>

             <div className={STYLES.nav.actions}>
                 <button onClick={() => navigate('/auth/login')} className={STYLES.nav.loginBtn}>Log In</button>
                 <button onClick={() => navigate('/auth')} className={STYLES.nav.signupBtn}>Join Now</button>
             </div>
         </div>
      </nav>

      {/* 1. Hero Section */}
      <div className={STYLES.hero.wrapper}>
         <div className="animate-in fade-in slide-in-from-left duration-700">
             <h1 className={STYLES.hero.headline}>
                 Where Creativity Meets Community
             </h1>
             <p className={STYLES.hero.description}>
                 Join the premier social platform for creators. Stream live, share content, and monetize your passion with fair revenue share.
             </p>
             <div className={STYLES.hero.btnGroup}>
                 <button onClick={() => navigate('/auth')} className={STYLES.hero.primaryBtn}>
                    Start Creating <ArrowRight size={20} />
                 </button>
                 <button onClick={() => navigate('/live')} className={STYLES.hero.secondaryBtn}>
                    Explore Live <Globe size={20} />
                 </button>
             </div>
             
             <div className={STYLES.hero.statsWrapper}>
                 <div>
                     <div className={STYLES.hero.statValue}>50K+</div>
                     <div className={STYLES.hero.statLabel}>Creators</div>
                 </div>
                 <div>
                     <div className={STYLES.hero.statValue}>$10M+</div>
                     <div className={STYLES.hero.statLabel}>Earnings</div>
                 </div>
                 <div>
                     <div className={STYLES.hero.statValue}>2M+</div>
                     <div className={STYLES.hero.statLabel}>Members</div>
                 </div>
             </div>
         </div>

         <div className={STYLES.hero.visuals.wrapper}>
             <div className={STYLES.hero.visuals.card1} style={{ transform: `rotate(${heroRotations.card1}deg)` }}>
                 <div className="bg-white p-3 pb-8 h-full rounded-md shadow-2xl">
                     <div className="relative h-full w-full overflow-hidden bg-gray-800 rounded-md">
                        <img src="https://picsum.photos/id/180/400/500" className="w-full h-full object-cover" alt="Hero 1" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="bg-black/60 backdrop-blur p-3 rounded-md border border-white/10">
                                <div className="text-xs font-bold text-white mb-1 uppercase tracking-widest">@Neon_Rider</div>
                                <div className="text-[10px] text-brand-400 font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></span> VIDEO • 15.2K
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>
             </div>
             <div className={STYLES.hero.visuals.card2} style={{ transform: `rotate(${heroRotations.card2}deg)` }}>
                 <div className="bg-white p-3 pb-8 h-full rounded-md shadow-2xl">
                     <div className="relative h-full w-full overflow-hidden bg-gray-800 rounded-md">
                        <img src="https://picsum.photos/id/15/400/500" className="w-full h-full object-cover" alt="Hero 2" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="bg-black/60 backdrop-blur p-3 rounded-md border border-white/10">
                                <div className="text-xs font-bold text-white mb-1 uppercase tracking-widest">@Art_Master</div>
                                <div className="text-[10px] text-gray-300 font-bold uppercase">PHOTO Content</div>
                            </div>
                        </div>
                     </div>
                 </div>
             </div>
             <div className={STYLES.hero.visuals.glow}></div>
         </div>
      </div>

      {/* 2. Movement Section */}
      <div className="py-24 px-6 max-w-7xl mx-auto space-y-16">
          {/* Intro */}
          <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-5xl font-bold text-white mb-6 uppercase tracking-tight">The Movement</h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                  LuciSin isn't just an app; it's a digital home for creativity.
              </p>
          </div>

          {/* Two-Column Split Layout - REDUCED HEIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Dating Sanctuary */}
              <div className="bg-dark-800 border border-brand-second/20 p-10 rounded-2xl relative overflow-hidden group hover:border-brand-second/50 transition-all shadow-2xl flex flex-col justify-between h-[285px]">
                  {/* Background Image */}
                   <div className="absolute inset-0">
                       <img src="https://picsum.photos/id/342/800/600" className="w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" alt="Dating" />
                       <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent"></div>
                   </div>
                  <div className="relative z-10 flex flex-col h-full justify-end">
                      <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-brand-second/20 rounded-xl text-brand-second border border-brand-second/30">
                               <Heart size={32} fill="currentColor" />
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Dating</h3>
                      </div>
                      <p className="text-gray-200 text-lg font-medium leading-relaxed mb-4">
                          A safe space for connection.
                      </p>
                  </div>
              </div>

              {/* Naughty Playground */}
              <div className="bg-dark-800 border border-brand-500/20 p-10 rounded-2xl relative overflow-hidden group hover:border-brand-500/50 transition-all shadow-2xl flex flex-col justify-between h-[285px]">
                   {/* Background Image */}
                   <div className="absolute inset-0">
                       <img src="https://picsum.photos/id/669/800/600" className="w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" alt="Naughty" />
                       <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent"></div>
                   </div>
                  <div className="relative z-10 flex flex-col h-full justify-end">
                      <div className="flex items-center gap-4 mb-4">
                           <div className="p-3 bg-brand-500/20 rounded-xl text-brand-500 border border-brand-500/30">
                               <Flame size={32} fill="currentColor" />
                           </div>
                          <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Naughty</h3>
                      </div>
                      <p className="text-gray-200 text-lg font-medium leading-relaxed mb-4">
                          Explore exclusive content in a secure environment.
                      </p>
                  </div>
              </div>
          </div>
          
          {/* 3. Path Cards - Moved here, on top of "Every Voice" */}
          <div className="py-12 border-t border-dark-800">
              <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-white mb-4 uppercase tracking-tight">Choose Your Path</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {displayPaths.map((path, idx) => (
                    <PathCard key={idx} title={path.title} desc={path.desc} />
                 ))}
              </div>
          </div>
          
          {/* 4. Supporting Diversity & Rights - Moved here after Path Cards */}
          <div className="py-12 border-t border-dark-800">
              <div className="text-center mb-16">
                  <span className="text-brand-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block flex items-center justify-center gap-2">
                     <Megaphone size={14} /> Inclusive Ecosystem
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6 leading-none">
                      Every Color, Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Voice</span>
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
                      We stand firmly for LGBTQIA+ rights and Women's rights. LuciSin is a sanctuary where you can express your true self without fear, built on the pillars of equality, safety, and freedom.
                  </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {identityFlags.map((item) => (
                      <div key={item.label} className="group relative overflow-hidden rounded-xl bg-dark-800 border border-white/5 hover:border-white/10 transition-all cursor-default shadow-md">
                          <div className="h-32 w-full relative">
                              {item.image ? (
                                  <img src={item.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt={item.label} />
                              ) : (
                                  <div className={`w-full h-full bg-gray-800 flex items-center justify-center`}>No Image</div>
                              )}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                               <h4 className="font-black text-white text-sm uppercase italic tracking-tight">{item.label}</h4>
                               <p className="text-[9px] text-gray-300 font-bold uppercase tracking-wider truncate">{item.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          
          {/* 5. Site Interests Section - Moved after Every Voice */}
          <div className="py-16 border-t border-dark-800">
              <div className="text-center mb-12">
                  <span className="text-brand-400 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
                      Explore The Core
                  </span>
                  <h2 className="text-4xl font-bold text-white uppercase italic tracking-tighter">
                      Choose Your <span className="text-white">Universe</span>
                  </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                   {interests.map((interest) => (
                       <div key={interest.id} className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group shadow-lg border border-white/5 hover:border-brand-500/50 transition-all">
                           <img src={interest.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" alt={interest.label} />
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                           <div className="absolute bottom-4 left-4 right-4 text-center">
                               <h3 className="font-black text-white text-lg uppercase italic tracking-tighter mb-1">{interest.label}</h3>
                               <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{interest.desc}</p>
                           </div>
                       </div>
                   ))}
              </div>
          </div>
      </div>

      {/* 6. Action Video Section */}
      <div className="py-24 px-6 max-w-7xl mx-auto">
          <div className="rounded-md overflow-hidden relative aspect-video shadow-2xl border border-dark-700 max-w-5xl mx-auto group">
            <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Action" loading="lazy" />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-12">
               <div className="mb-4">
                  <h3 className="text-3xl font-bold text-white uppercase tracking-tight">LuciSin in Action</h3>
                  <p className="text-gray-200 font-bold uppercase tracking-widest text-xs mt-1">Watch how creators rule the platform.</p>
               </div>
               <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform mx-auto">
                  <Play size={40} fill="white" className="ml-2" />
               </button>
            </div>
          </div>
      </div>

      {/* 7. Safety Commitment - Moved here after video */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-dark-800 pt-16">
              <div className="p-6 bg-dark-800/30 rounded-2xl border border-white/5">
                  <ShieldCheck size={48} className="text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Verified Humans</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Creators pass biometric age and identity checks. No bots.</p>
              </div>
              <div className="p-6 bg-dark-800/30 rounded-2xl border border-white/5">
                  <Lock size={48} className="text-blue-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Consent First</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Strict policies against non-consensual content and harassment.</p>
              </div>
              <div className="p-6 bg-dark-800/30 rounded-2xl border border-white/5">
                  <Users size={48} className="text-pink-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Community Led</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Robust moderation powered by community reports and AI.</p>
              </div>
          </div>
      </div>

      {/* 8. Community In Your Pocket (Modified) */}
      <div className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Text Column (Left) */}
              <div className="text-left">
                  <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-[0.9] mb-6">
                      Community In Your Pocket
                  </h2>
                  
                  <p className="text-xl text-gray-400 leading-relaxed font-medium mb-10 max-w-md">
                      Stay connected to the platform wherever you go. Find people that match your vibe.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                          onClick={() => window.open('https://play.google.com/store/apps', '_blank')}
                          className="bg-dark-800 hover:bg-dark-700 border border-white/10 text-white font-bold px-8 py-4 rounded-md uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 group"
                      >
                          <Smartphone size={20} className="text-green-500" /> 
                          <span>Google Play</span>
                      </button>
                      
                      <button 
                          onClick={() => window.open('https://apps.apple.com/app', '_blank')}
                          className="bg-dark-800 hover:bg-dark-700 border border-white/10 text-white font-bold px-8 py-4 rounded-md uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 group"
                      >
                          <Smartphone size={20} className="text-white" />
                          <span>App Store</span>
                      </button>
                  </div>
              </div>

              {/* Visual Column (Right) - Updated to Community Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {communityPersonas.map((person) => (
                      <div 
                          key={person.id}
                          className="relative group cursor-pointer flex flex-col items-center"
                          onClick={() => navigate(`/knowledge-book?category=${person.tag}`)}
                      >
                           <div className={`w-24 h-24 rounded-full p-[3px] bg-gradient-to-br ${getFlagGradient(person.flag)} shadow-lg shadow-black/50 transition-transform group-hover:scale-110 relative z-10`}>
                               <img src={person.img} alt={person.name} className="w-full h-full object-cover rounded-full border-2 border-dark-900" />
                           </div>
                           
                           {/* Hover Card */}
                           <div className="absolute -bottom-24 z-20 w-40 bg-dark-800 border border-white/10 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-y-2 group-hover:translate-y-0 text-center">
                               <h4 className="font-black text-white text-sm uppercase tracking-tight">{person.name}</h4>
                               <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 mb-2 bg-clip-text text-transparent bg-gradient-to-r ${getFlagGradient(person.flag)}`}>{person.flag}</div>
                               <p className="text-[10px] text-gray-400 font-medium leading-tight">{person.desc}</p>
                           </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 9. Join Family CTA - Seamless Footer Integration */}
      <div className="pt-24 pb-0 bg-[#010100] border-t border-dark-800">
        <div className="w-full text-center relative overflow-hidden p-8 md:p-16">
           {/* Background Glow only */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-600/10 rounded-full blur-[100px] pointer-events-none"></div>
           
           <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight leading-none relative z-10">Join the LGBTQIA+ Family</h2>
           
           <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10 mt-8">
             <button onClick={() => navigate('/auth')} className="bg-white text-black px-8 py-3 md:px-10 md:py-4 rounded-md font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1">
               Join the Family
             </button>
             <button onClick={() => navigate('/subscriptions')} className="bg-transparent text-white border border-dark-600 px-8 py-3 md:px-10 md:py-4 rounded-md font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-dark-800 transition-all">
               Compare Plans
             </button>
           </div>
        </div>
      </div>

      <footer className="bg-[#010100] pt-0 pb-8 border-t-0">
          <div className={STYLES.footer.container}>
              {/* Footer Content */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 pt-16 border-t border-dark-800/50">
                  <div className="col-span-2 md:col-span-1">
                      <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
                          <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-pink-600 rounded flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-brand-500/20">L</div>
                          <span className="text-2xl font-bold text-white tracking-tight">LuciSin</span>
                      </div>
                      <p className="text-gray-500 mb-8 max-w-xs leading-relaxed font-medium text-xs uppercase tracking-wider">
                          Where creativity meets community. Build your universe as a LuciStar.
                      </p>
                      <div className="flex gap-4 mb-8">
                          <a onClick={() => navigate('/about')} className={STYLES.footer.socialLink}><Twitter size={18}/></a>
                          <a onClick={() => navigate('/about')} className={STYLES.footer.socialLink}><Instagram size={18}/></a>
                          <a onClick={() => navigate('/about')} className={STYLES.footer.socialLink}><Youtube size={18}/></a>
                          <a onClick={() => navigate('/about')} className={STYLES.footer.socialLink}><Facebook size={18}/></a>
                      </div>
                  </div>
                  
                  <div>
                      <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-8">Platform</h4>
                      <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                          <li><button onClick={() => navigate('/search')} className="hover:text-brand-400 transition-colors">Discover Stars</button></li>
                          <li><button onClick={() => navigate('/live')} className="hover:text-brand-400 transition-colors">Live</button></li>
                          <li><button onClick={() => navigate('/shorts')} className="hover:text-brand-400 transition-colors">Short Clips</button></li>
                          <li><button onClick={() => navigate('/comics')} className="hover:text-brand-400 transition-colors">Visual Tales</button></li>
                      </ul>
                  </div>
                  
                  <div>
                      <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-8">Creators</h4>
                      <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                          <li><button onClick={() => navigate('/start-creating')} className="hover:text-brand-400 transition-colors">Get Started</button></li>
                          <li><button onClick={() => navigate('/earnings')} className="hover:text-brand-400 transition-colors">Earnings Pool</button></li>
                          <li><button onClick={() => navigate('/leaderboard')} className="hover:text-brand-400 transition-colors">Top Stars</button></li>
                      </ul>
                  </div>
                  
                  <div>
                      <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-8">Community</h4>
                      <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                          <li><button onClick={() => navigate('/about')} className="hover:text-brand-400 transition-colors">Our Ethos</button></li>
                          <li><button onClick={() => navigate('/support')} className="hover:text-brand-400 transition-colors">Help Desk</button></li>
                          <li><button onClick={() => navigate('/terms')} className="hover:text-brand-400 transition-colors">Rules</button></li>
                          <li><button onClick={() => navigate('/privacy')} className="hover:text-brand-400 transition-colors">Privacy Policy</button></li>
                      </ul>
                  </div>
              </div>
              
              <div className={STYLES.footer.bottomBar}>
                  <p>&copy; 2025 LuciSin. All rights reserved.</p>
                  <div className="flex gap-8">
                      <button onClick={() => navigate('/privacy')} className="hover:text-gray-400 uppercase tracking-widest">Privacy Policy</button>
                      <button onClick={() => navigate('/terms')} className="hover:text-gray-400 uppercase tracking-widest">Terms of Service</button>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
}
