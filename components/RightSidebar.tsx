
import React, { memo, useMemo } from 'react';
import { 
    TrendingUp, TrendingDown, Minus, Megaphone, 
    Sparkles, UserPlus, Eye, MousePointerClick, Heart, Flame,
    Video, Image, Smartphone, BookOpen, ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export type SidebarCategory = 'general' | 'live' | 'photos' | 'comics' | 'collection' | 'shorts_related' | 'videos';

interface SidebarProps {
    trends: any[];
    onPromoteClick: () => void;
    showAd?: boolean;
    showFooter?: boolean;
    category?: SidebarCategory;
    relatedVideos?: any[]; 
    onVideoClick?: (video: any) => void;
}

// SECTION SPECIFIC DATA
const SECTION_DATA: Record<string, { title: string, icon: any, trends: any[], creators: any[] }> = {
    general: {
        title: "Trending",
        icon: TrendingUp,
        trends: [], 
        creators: [] 
    },
    live: {
        title: "Live Now",
        icon: Video,
        trends: [
            { id: 'l1', tag: '#JustChatting', trend: 'up', posts: '12K' },
            { id: 'l2', tag: '#GamingLive', trend: 'up', posts: '8K' },
            { id: 'l3', tag: '#ASMR', trend: 'stable', posts: '5K' },
            { id: 'l4', tag: '#MusicLive', trend: 'up', posts: '3.5K' },
            { id: 'l5', tag: '#IRL', trend: 'down', posts: '2K' }
        ],
        creators: [
            { name: 'StreamKing', handle: '@strm_king', avatar: 'https://picsum.photos/100/100?random=l1', isLive: true },
            { name: 'ChattyCathy', handle: '@chatty_c', avatar: 'https://picsum.photos/100/100?random=l2', isLive: true },
            { name: 'GamerGuy', handle: '@gamer_g', avatar: 'https://picsum.photos/100/100?random=l3', isLive: true },
            { name: 'VibeCheck', handle: '@vibe_c', avatar: 'https://picsum.photos/100/100?random=l4', isLive: true },
            { name: 'NightOwl', handle: '@night_o', avatar: 'https://picsum.photos/100/100?random=l5', isLive: true }
        ]
    },
    photos: {
        title: "Visual Arts",
        icon: Image,
        trends: [
            { id: 'p1', tag: '#Portrait', trend: 'up', posts: '45K' },
            { id: 'p2', tag: '#Cyberpunk', trend: 'up', posts: '22K' },
            { id: 'p3', tag: '#B&W', trend: 'down', posts: '15K' },
            { id: 'p4', tag: '#Neon', trend: 'up', posts: '12K' },
            { id: 'p5', tag: '#Nature', trend: 'stable', posts: '8K' }
        ],
        creators: [
            { name: 'LensMaster', handle: '@lens_m', avatar: 'https://picsum.photos/100/100?random=p1', isLive: false },
            { name: 'VisualVibe', handle: '@visual_v', avatar: 'https://picsum.photos/100/100?random=p2', isLive: false },
            { name: 'ShutterBug', handle: '@shutter_b', avatar: 'https://picsum.photos/100/100?random=p3', isLive: false },
            { name: 'PixelArt', handle: '@pixel_a', avatar: 'https://picsum.photos/100/100?random=p4', isLive: false },
            { name: 'FocusPoint', handle: '@focus_p', avatar: 'https://picsum.photos/100/100?random=p5', isLive: false }
        ]
    },
    videos: {
        title: "Video Trends",
        icon: Video,
        trends: [
            { id: 'v1', tag: '#VlogDaily', trend: 'up', posts: '8K' },
            { id: 'v2', tag: '#TechReview', trend: 'stable', posts: '12K' },
            { id: 'v3', tag: '#Cinematic', trend: 'up', posts: '5K' },
            { id: 'v4', tag: '#Tutorial', trend: 'down', posts: '3K' },
            { id: 'v5', tag: '#Gaming', trend: 'up', posts: '25K' }
        ],
        creators: [
            { name: 'FilmBuff', handle: '@film_b', avatar: 'https://picsum.photos/100/100?random=v1', isLive: false },
            { name: 'EditorPro', handle: '@edit_p', avatar: 'https://picsum.photos/100/100?random=v2', isLive: false },
            { name: 'VlogStar', handle: '@vlog_s', avatar: 'https://picsum.photos/100/100?random=v3', isLive: false },
            { name: 'TechGuru', handle: '@tech_g', avatar: 'https://picsum.photos/100/100?random=v4', isLive: false },
            { name: 'DirectorX', handle: '@dir_x', avatar: 'https://picsum.photos/100/100?random=v5', isLive: false }
        ]
    },
    shorts_related: { 
        title: "Viral Shorts",
        icon: Smartphone,
        trends: [
            { id: 's1', tag: '#FYP', trend: 'up', posts: '1.2M' },
            { id: 's2', tag: '#Dance', trend: 'up', posts: '800K' },
            { id: 's3', tag: '#Comedy', trend: 'stable', posts: '500K' },
            { id: 's4', tag: '#LifeHacks', trend: 'up', posts: '300K' },
            { id: 's5', tag: '#Pets', trend: 'down', posts: '200K' }
        ],
        creators: [
            { name: 'TikToker', handle: '@tik_tok', avatar: 'https://picsum.photos/100/100?random=s1', isLive: false },
            { name: 'ShortKing', handle: '@short_k', avatar: 'https://picsum.photos/100/100?random=s2', isLive: false },
            { name: 'ViralQueen', handle: '@viral_q', avatar: 'https://picsum.photos/100/100?random=s3', isLive: false },
            { name: 'TrendSetter', handle: '@trend_s', avatar: 'https://picsum.photos/100/100?random=s4', isLive: false },
            { name: 'QuickClips', handle: '@quick_c', avatar: 'https://picsum.photos/100/100?random=s5', isLive: false }
        ]
    },
    comics: {
        title: "Top Reads",
        icon: BookOpen,
        trends: [
            { id: 'c1', tag: '#Manga', trend: 'up', posts: '25K' },
            { id: 'c2', tag: '#Webtoon', trend: 'stable', posts: '18K' },
            { id: 'c3', tag: '#Superhero', trend: 'up', posts: '10K' },
            { id: 'c4', tag: '#Fantasy', trend: 'down', posts: '8K' },
            { id: 'c5', tag: '#SciFi', trend: 'up', posts: '15K' }
        ],
        creators: [
            { name: 'InkMaster', handle: '@ink_m', avatar: 'https://picsum.photos/100/100?random=c1', isLive: false },
            { name: 'StoryTeller', handle: '@story_t', avatar: 'https://picsum.photos/100/100?random=c2', isLive: false },
            { name: 'ComicPro', handle: '@comic_p', avatar: 'https://picsum.photos/100/100?random=c3', isLive: false },
            { name: 'MangaArtist', handle: '@manga_a', avatar: 'https://picsum.photos/100/100?random=c4', isLive: false },
            { name: 'WebComic', handle: '@web_c', avatar: 'https://picsum.photos/100/100?random=c5', isLive: false }
        ]
    },
    collection: {
        title: "Market",
        icon: ShoppingBag,
        trends: [
            { id: 'm1', tag: '#Assets', trend: 'up', posts: '5K' },
            { id: 'm2', tag: '#Merch', trend: 'up', posts: '2K' },
            { id: 'm3', tag: '#3DModels', trend: 'stable', posts: '1.5K' },
            { id: 'm4', tag: '#Presets', trend: 'up', posts: '3K' },
            { id: 'm5', tag: '#DigitalArt', trend: 'down', posts: '4K' }
        ],
        creators: [
            { name: 'AssetStore', handle: '@assets', avatar: 'https://picsum.photos/100/100?random=m1', isLive: false },
            { name: 'MerchDrop', handle: '@merch_d', avatar: 'https://picsum.photos/100/100?random=m2', isLive: false },
            { name: 'ModelMaker', handle: '@model_m', avatar: 'https://picsum.photos/100/100?random=m3', isLive: false },
            { name: 'PresetPro', handle: '@preset_p', avatar: 'https://picsum.photos/100/100?random=m4', isLive: false },
            { name: 'ArtSeller', handle: '@art_s', avatar: 'https://picsum.photos/100/100?random=m5', isLive: false }
        ]
    }
};

const MOOD_DATA = {
    dating: {
        trends: [
            { id: 't1', tag: '#SoulmateSearch', trend: 'up', posts: '1.2M' },
            { id: 't2', tag: '#DateNight', trend: 'up', posts: '850K' },
            { id: 't3', tag: '#RelationshipGoals', trend: 'stable', posts: '2.1M' },
            { id: 't4', tag: '#FirstDate', trend: 'down', posts: '500K' },
            { id: 't5', tag: '#LoveStory', trend: 'up', posts: '3.5M' }
        ],
        creators: [
             { name: 'Sarah_Noir', handle: '@sarah_noir', avatar: 'https://picsum.photos/100/100?random=s1', isLive: true },
             { name: 'Alex_Roams', handle: '@alex_roams', avatar: 'https://picsum.photos/100/100?random=s2', isLive: false },
             { name: 'Chef_Mike', handle: '@chef_mike', avatar: 'https://picsum.photos/100/100?random=s3', isLive: false },
             { name: 'Artsy_Emma', handle: '@artsy_em', avatar: 'https://picsum.photos/100/100?random=s4', isLive: true },
             { name: 'Traveler_Joe', handle: '@travel_j', avatar: 'https://picsum.photos/100/100?random=s5', isLive: false },
        ],
        accent: 'text-brand-second',
        bgHover: 'hover:bg-brand-second/10',
        borderHover: 'hover:border-brand-second/20'
    },
    adult: {
        trends: [
            { id: 't1', tag: '#AfterDark', trend: 'up', posts: '5.2M' },
            { id: 't2', tag: '#Exclusive', trend: 'up', posts: '3.1M' },
            { id: 't3', tag: '#NaughtyVibes', trend: 'stable', posts: '1.5M' },
            { id: 't4', tag: '#PrivateRoom', trend: 'up', posts: '800K' },
            { id: 't5', tag: '#Unfiltered', trend: 'down', posts: '2.2M' }
        ],
        creators: [
             { name: 'Velvet_Vixen', handle: '@velvet_v', avatar: 'https://picsum.photos/100/100?random=n1', isLive: true },
             { name: 'Night_Owl', handle: '@night_owl', avatar: 'https://picsum.photos/100/100?random=n2', isLive: true },
             { name: 'Siren_Song', handle: '@siren_s', avatar: 'https://picsum.photos/100/100?random=n3', isLive: false },
             { name: 'Roxy_Red', handle: '@roxy_red', avatar: 'https://picsum.photos/100/100?random=n4', isLive: false },
             { name: 'Midnight_Muse', handle: '@muse_m', avatar: 'https://picsum.photos/100/100?random=n5', isLive: true },
        ],
        accent: 'text-brand-500',
        bgHover: 'hover:bg-brand-500/10',
        borderHover: 'hover:border-brand-500/20'
    }
};

const RedesignedTrendingNow = memo(({ items, mood, title, Icon }: { items: any[], mood: 'dating' | 'adult', title: string, Icon: any }) => {
    const navigate = useNavigate();
    const { accent, bgHover, borderHover } = MOOD_DATA[mood];

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <Icon className={accent} size={24} />
                    <h2 className="text-xl font-black text-white dark:text-white uppercase tracking-tighter italic">
                        {title}
                    </h2>
                </div>
            </div>
            <div className="space-y-2">
                {items.map((item, idx) => (
                    <div key={item.id || idx} onClick={() => navigate(`/tags/${encodeURIComponent(item.tag.replace('#', ''))}`)} className={`flex items-center gap-4 p-2 ${bgHover} transition-all group cursor-pointer rounded-lg border border-transparent ${borderHover}`}>
                        <div className="w-8 h-8 flex items-center justify-center shrink-0 text-gray-500 font-black text-lg group-hover:text-white transition-colors">#</div>
                        <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-black text-white dark:text-white group-hover:text-white transition-colors truncate`}>{item.tag.replace('#','')}</h4>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.posts} signals</p>
                        </div>
                        <div className={`shrink-0 ${item.trend === 'up' ? accent : item.trend === 'down' ? 'text-red-500' : 'text-gray-600'}`}>
                           {item.trend === 'up' ? <TrendingUp size={16} /> : item.trend === 'down' ? <TrendingDown size={16} /> : <Minus size={16} />}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
});

const SuggestedCreators = memo(({ onPromoteClick, creators, mood, title }: { onPromoteClick: () => void, creators: any[], mood: 'dating' | 'adult', title: string }) => {
    const navigate = useNavigate();
    const { accent, bgHover, borderHover } = MOOD_DATA[mood];

    return (
        <section className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    {mood === 'adult' ? <Flame className={accent} size={24} fill="currentColor" /> : <Sparkles className={accent} size={24} />}
                    <h2 className="text-xl font-black text-white dark:text-white uppercase tracking-tighter italic">
                        {title}
                    </h2>
                </div>
                <button onClick={onPromoteClick} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="Promote Profile">
                    <Megaphone size={14} />
                </button>
            </div>
            <div className="space-y-2">
                {creators.map((s, i) => (
                    <div key={i} className={`flex items-center gap-4 p-3 ${bgHover} transition-all group cursor-pointer rounded-lg border border-transparent ${borderHover}`}>
                        <div className="relative shrink-0 w-12 h-12 bg-dark-800 border border-white/[0.1] rounded-[5px] overflow-hidden shadow-lg">
                            <img src={s.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                            {s.isLive && <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 border-2 border-dark-900 rounded-full animate-pulse"></span>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-black text-white dark:text-white ${mood === 'adult' ? 'group-hover:text-brand-500' : 'group-hover:text-brand-second'} transition-colors truncate`}>{s.name}</h4>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{s.handle}</p>
                        </div>
                        <div className="shrink-0"><button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"><UserPlus size={16} /></button></div>
                    </div>
                ))}
            </div>
        </section>
    );
});

export const RightSidebar: React.FC<SidebarProps> = ({ trends, onPromoteClick, showAd = true, showFooter = true, category = 'general' }) => {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const currentMode = (currentUser?.contentPreference === 'adult') ? 'adult' : 'dating';
    
    // Determine content based on category
    const sectionData = SECTION_DATA[category] || SECTION_DATA.general;
    
    // Fallback to mode data if section data is empty (for general view)
    const displayTrends = sectionData.trends.length > 0 ? sectionData.trends : MOOD_DATA[currentMode].trends;
    const displayCreators = sectionData.creators.length > 0 ? sectionData.creators : MOOD_DATA[currentMode].creators;
    const displayTitle = category !== 'general' ? sectionData.title : (currentMode === 'adult' ? 'Hot Now' : 'Trending');
    const displayIcon = category !== 'general' ? sectionData.icon : TrendingUp;

    return (
        <div className="hidden lg:flex w-full shrink-0 border-l border-white/5 flex-col h-full bg-[#141414]">
            <div className="p-6 space-y-8 flex flex-col h-full bg-[#141414] overflow-hidden">
                
                <RedesignedTrendingNow 
                    items={displayTrends} 
                    mood={currentMode} 
                    title={displayTitle} 
                    Icon={displayIcon}
                />

                <SuggestedCreators 
                    onPromoteClick={onPromoteClick} 
                    creators={displayCreators}
                    mood={currentMode} 
                    title={currentMode === 'adult' ? 'Top Icons' : 'Top Muses'}
                />
                
                {/* Spacer */}
                <div className="flex-1"></div>

                {showAd && (
                    <div className="pt-2">
                        <div className="flex items-center gap-2 px-1 mb-2">
                            <Megaphone size={14} className={currentMode === 'adult' ? 'text-brand-500' : 'text-brand-second'} />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sponsored</span>
                        </div>
                        <div className="w-full h-[160px] bg-dark-800 border border-dark-700 rounded-lg overflow-hidden relative group cursor-pointer" onClick={() => navigate('/subscriptions')}>
                            <img src={`https://picsum.photos/300/200?random=promo_${currentMode}`} className="w-full h-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105" alt="Sponsored" />
                            
                            {/* Ad Metrics Overlay */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
                                <div className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-black text-white border border-white/10 flex items-center gap-1">
                                    <Eye size={8} className="text-blue-400" /> 12.5k
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center backdrop-blur-[1px] group-hover:opacity-0 transition-opacity duration-300">
                                <h4 className="text-sm font-black text-white uppercase tracking-tighter mb-1 italic">Upgrade Identity</h4>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between px-3 border-t border-white/5">
                                <div className="flex flex-col min-w-0">
                                    <p className={`text-[8px] font-black ${currentMode === 'adult' ? 'text-brand-500' : 'text-brand-second'} uppercase tracking-widest leading-none mb-0.5 truncate`}>Elite Access</p>
                                </div>
                                <button className={`${currentMode === 'adult' ? 'bg-brand-500 hover:bg-brand-600' : 'bg-brand-second hover:bg-brand-second/80'} text-white font-black text-[9px] px-3 py-1 rounded-sm uppercase tracking-widest transition-all`}>Upgrade</button>
                            </div>
                        </div>
                    </div>
                )}
                
                {showFooter && (
                    <div className="mt-2 px-1 pb-2">
                        <footer className="text-[9px] font-black text-gray-600 uppercase italic tracking-tighter flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
                            <span>© 2025 LuciSin</span>
                            <div className="flex gap-3">
                                <button className="hover:text-white transition-colors">Privacy</button>
                                <button className="hover:text-white transition-colors">Terms</button>
                            </div>
                        </footer>
                    </div>
                )}
            </div>
        </div>
    );
};
