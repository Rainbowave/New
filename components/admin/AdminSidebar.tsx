
import React, { useState, useEffect } from 'react';
import { 
    BarChart2, Users, DollarSign, Settings, ChevronRight, ChevronDown,
    Video, FileText, Shield, UserCheck, Wallet, Crown, Image as ImageIcon, 
    ShoppingBag, BookOpen, Layers, Megaphone, Film, LayoutGrid, 
    Sliders, Activity, Flag, PenTool, Key, Palette, Layout, Search, ToggleLeft, Gamepad2, Coins,
    MessageSquare, Smartphone, Grid, HardDrive, Trophy, Ticket, Heart, ShieldCheck,
    ShieldAlert, CheckCircle2, Ban, User, Flame, Globe, Eye
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { UserRole } from '../../types';
import { db } from '../../services/db';

interface AdminSidebarProps {
    viewRole?: UserRole;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ viewRole = 'admin' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const currentUser = authService.getCurrentUser();
    
    // Manage expanded state locally
    const [expandedSections, setExpandedSections] = useState<string[]>(['Engagement', 'Global Settings', 'Community']);
    
    // Global Admin Mode State
    const [adminMode, setAdminMode] = useState<'dating' | 'naughty'>(() => {
        return (localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating';
    });

    // Role Definition State
    const [currentRoleDef, setCurrentRoleDef] = useState<any>(null);

    useEffect(() => {
        const roles = db.getRoles();
        const role = roles.find(r => r.id === viewRole);
        setCurrentRoleDef(role);
    }, [viewRole]);

    const toggleAdminMode = (mode: 'dating' | 'naughty') => {
        setAdminMode(mode);
        localStorage.setItem('admin_view_mode', mode);
        // Dispatch event for pages to react
        window.dispatchEvent(new Event('admin-mode-change'));
    };

    const toggleSection = (title: string) => {
        setExpandedSections(prev => 
            prev.includes(title) 
                ? prev.filter(t => t !== title)
                : [...prev, title] 
        );
    };
    
    const isActive = (route: string) => {
        if (route === '/admin') return path === '/admin';
        return path.startsWith(route);
    };

    // Helper to check granular permission
    const hasPerm = (section: string) => {
        if (!currentRoleDef) return false;
        // Admin bypass
        if (currentRoleDef.id === 'admin') return true;
        // Check DB perm
        return currentRoleDef.permissions?.[section]?.view === true;
    };

    // Menu Definitions tied to permission keys
    const menuGroups = [
        {
            title: 'Community',
            icon: Users,
            permKey: 'users', // Check 'users' view perm
            color: 'text-blue-400',
            items: [
                { label: 'Overview', route: '/admin/community', icon: Activity, permKey: 'users' },
                { label: 'All Users', route: '/admin/users', icon: Users, permKey: 'users' },
                { label: 'Engagement Pride', route: '/admin/users?filter=moderators', icon: ShieldCheck, permKey: 'users' }, // Logic inside page handles edit check
                { label: 'Role Permissions', route: '/admin/roles', icon: Shield, permKey: 'settings' }, // Usually protected
                { label: 'Verification', route: '/admin/verification', icon: UserCheck, permKey: 'users' },
                { label: 'User Reports', route: '/admin/reports', icon: Flag, permKey: 'users' },
                { label: 'Suspensions', route: '/admin/suspensions', icon: Ban, permKey: 'users' },
                { label: 'Approval Queue', route: '/admin/approvals', icon: CheckCircle2, permKey: 'users' },
            ]
        },
        {
            title: 'Engagement',
            icon: Heart,
            permKey: 'engagement',
            color: 'text-pink-500',
            items: [
                { label: 'Overview', route: '/admin/engagement', icon: Activity, permKey: 'engagement' },
                { label: 'Leaderboard', route: '/admin/engagement?tab=leaderboard', icon: Trophy, permKey: 'engagement' },
                { label: 'Contests', route: '/admin/engagement?tab=contests', icon: Flag, permKey: 'engagement' },
            ]
        },
        {
            title: 'Content Manager',
            icon: Layers,
            permKey: 'content',
            color: 'text-purple-400',
            items: [
                { label: 'Manager Overview', route: '/admin/content', icon: Activity, permKey: 'content' },
                { label: 'Posts & Polls', route: '/admin/posts?type=POST', icon: FileText, permKey: 'content' },
                { label: 'Photos', route: '/admin/posts?type=PHOTO', icon: ImageIcon, permKey: 'photos' },
                { label: 'Shorts', route: '/admin/posts?type=SHORT', icon: Smartphone, permKey: 'shorts' },
                { label: 'Videos', route: '/admin/posts?type=VIDEO', icon: Film, permKey: 'videos' },
                { label: 'Live Streams', route: '/admin/streams', icon: Video, permKey: 'live' },
                { label: 'Comics', route: '/admin/posts?type=COMIC', icon: BookOpen, permKey: 'comics' },
                { label: 'Collection', route: '/admin/posts?type=COLLECTION', icon: ShoppingBag, permKey: 'collection' },
                { label: 'Knowledge Book', route: '/admin/posts?type=RESOURCE', icon: BookOpen, permKey: 'resources' }, 
                { label: 'Arcade Config', route: '/admin/settings/arcade', icon: Gamepad2, permKey: 'arcade' },
            ]
        },
        {
            title: 'Ads Manager',
            icon: Megaphone,
            permKey: 'ads',
            color: 'text-orange-400',
            items: [
                { label: 'Promotions', route: '/admin/ads?tab=campaigns', permKey: 'ads' },
                { label: 'Placements', route: '/admin/ads?tab=placements', permKey: 'ads' },
                { label: 'Content Config', route: '/admin/ads?tab=content_ads', permKey: 'ads' },
            ]
        },
        {
            title: 'Finances',
            icon: Wallet,
            permKey: 'finance',
            color: 'text-green-400',
            items: [
                { label: 'Transactions', route: '/admin/finance?tab=transactions', permKey: 'finance' },
                { label: 'Subscriptions', route: '/admin/finance?tab=subscriptions', permKey: 'finance' },
                { label: 'Withdrawals', route: '/admin/finance?tab=withdrawals', permKey: 'finance' },
            ]
        },
        {
            title: 'Global Settings',
            icon: Settings,
            permKey: 'settings',
            color: 'text-gray-200',
            items: [
                { label: 'General', route: '/admin/settings/general', icon: Layout, permKey: 'settings' },
                { label: 'Points System', route: '/admin/settings/points', icon: Coins, permKey: 'settings' },
                { label: 'SEO & Performance', route: '/admin/settings/seo', icon: Search, permKey: 'settings' },
                { label: 'Modules', route: '/admin/settings/modules', icon: Layers, permKey: 'settings' },
                { label: 'Theme', route: '/admin/settings/appearance', icon: Palette, permKey: 'settings' },
                { label: 'Agenda & Landing', route: '/admin/settings/agenda', icon: Flag, permKey: 'settings' },
                { label: 'Team & Comms', route: '/admin/settings/team', icon: MessageSquare, permKey: 'settings' },
                { label: 'API & Keys', route: '/admin/api', icon: Key, permKey: 'settings' },
            ]
        }
    ];

    if (!currentRoleDef) return <div className="w-64 bg-dark-800 border-r border-dark-700 animate-pulse"></div>;

    return (
        <div className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col shrink-0 h-full">
            <div className="p-4 flex items-center gap-3 border-b border-dark-700 h-16">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center font-black text-white">L</div>
                <span className="font-black text-white uppercase tracking-tight">Admin Console</span>
            </div>
            
            {/* Global Context Switcher */}
            <div className="p-4 border-b border-dark-700">
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Global Context</div>
                <div className="flex bg-dark-900 p-1 rounded-lg border border-dark-600">
                    <button 
                        onClick={() => toggleAdminMode('dating')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${adminMode === 'dating' ? 'bg-brand-second text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Heart size={10} fill={adminMode === 'dating' ? "currentColor" : "none"} /> Dating
                    </button>
                    <button 
                        onClick={() => toggleAdminMode('naughty')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${adminMode === 'naughty' ? 'bg-brand-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Flame size={10} fill={adminMode === 'naughty' ? "currentColor" : "none"} /> Naughty
                    </button>
                </div>
            </div>

            <div className="p-4 overflow-y-auto no-scrollbar flex-1 space-y-2">
                <button 
                    onClick={() => navigate('/admin')} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold mb-6 transition-colors ${
                        path === '/admin'
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                >
                    <BarChart2 size={20} />
                    <span>Dashboard</span>
                </button>

                {menuGroups.map((group: any, i) => {
                    // Check top-level permission (e.g. if generic 'content' perm allows seeing the group)
                    // We assume if any child is visible, we might want to show group, OR use group perm key
                    // Here we use group perm key mostly
                    const groupVisible = hasPerm(group.permKey);
                    
                    // Optimization: Check if at least one item is visible
                    const hasVisibleItems = group.items.some((item: any) => hasPerm(item.permKey));
                    
                    if (!groupVisible && !hasVisibleItems) return null;
                    
                    const isExpanded = expandedSections.includes(group.title);
                    const hasActiveChild = group.items.some((item: any) => isActive(item.route));
                    
                    return (
                        <div key={i} className="mb-2">
                            <button 
                                onClick={() => toggleSection(group.title)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${
                                    isExpanded 
                                    ? 'text-white bg-dark-700' 
                                    : 'text-gray-500 hover:text-white hover:bg-dark-700'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <group.icon size={16} className={`${hasActiveChild || isExpanded ? 'text-white' : group.color}`} />
                                    <span>{group.title}</span>
                                </div>
                                {isExpanded ? <ChevronDown size={14} className="text-white" /> : <ChevronRight size={14} />}
                            </button>

                            {isExpanded && (
                                <div className="mt-1 ml-4 pl-4 border-l border-dark-700 space-y-1 animate-in slide-in-from-left-2 duration-200">
                                    {group.items.map((item: any, idx: number) => {
                                        if (!hasPerm(item.permKey)) return null;
                                        const active = isActive(item.route);

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => navigate(item.route)}
                                                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                                                    active
                                                    ? 'text-brand-400 bg-brand-500/10 font-bold' 
                                                    : 'text-gray-500 hover:text-white hover:bg-dark-700/30'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {item.icon && <item.icon size={14} className={active ? 'text-brand-400' : 'text-gray-600'} />}
                                                    <span>{item.label}</span>
                                                </div>
                                                {item.badge && (
                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black text-white uppercase tracking-wider ${item.badgeColor || 'bg-pink-500'}`}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="p-4 border-t border-dark-700">
                <div className="flex items-center gap-3 px-4 bg-dark-900/50 py-3 rounded-xl border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-dark-700 overflow-hidden border border-white/10">
                        <img src={currentUser?.avatarUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{currentUser?.displayName}</p>
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-wider">{viewRole}</p>
                    </div>
                </div>
            </div>

            {/* Mode Viewer Switcher - Only visible if actual user is Admin */}
            {currentUser?.role === 'admin' && (
                <div className="relative group px-4 pb-4">
                    <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-dark-800 border border-white/5 px-3 py-1.5 rounded-lg">
                        <Eye size={14} />
                        <span>View Mode</span>
                        <ChevronDown size={12} />
                    </button>
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-dark-800 border border-dark-600 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50">
                        <div className="p-2 space-y-1">
                            <div className="px-3 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 mb-1">Select View</div>
                            {/* Reset to Admin */}
                            <button 
                                onClick={() => window.location.reload()} // Hack to reset view state without passing props down deeply
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ${viewRole === 'admin' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Shield size={12} /> System Admin
                            </button>

                            <div className="px-3 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 mb-1 mt-2">Engagement Pride Squads</div>
                            {/* In a real app, this list would come from props or context */}
                            {/* For now, just showing structure update based on prompt requirement */}
                            <div className="text-[9px] text-gray-500 px-3 py-1 italic">Use Users page to switch view</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
