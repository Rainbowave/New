
import React, { useState, useEffect } from 'react';
import { 
    Shield, Plus, Edit2, Trash2, Check, X, Users, Video, 
    Image as ImageIcon, Smartphone, BookOpen, Radio, ShoppingBag, 
    FileText, Gamepad2, Megaphone, Wallet, Settings, Activity, Lock, Heart
} from 'lucide-react';
import { db } from '../../services/db';

// Define the structure for permissions based on services/db.ts
interface Permission {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

interface RolePermissions {
    users: Permission;
    content: Permission;
    photos: Permission;
    videos: Permission;
    shorts: Permission;
    comics: Permission;
    live: Permission;
    collection: Permission;
    resources: Permission;
    arcade: Permission;
    ads: Permission;
    finance: Permission;
    settings: Permission;
    engagement: Permission;
}

interface Role {
    id: string;
    title: string;
    description: string;
    type: 'system' | 'custom';
    color: string;
    permissions: RolePermissions;
}

const SECTIONS = [
    { key: 'users', label: 'Users', icon: Users },
    { key: 'content', label: 'Content Manager', icon: Activity },
    { key: 'photos', label: 'Photos', icon: ImageIcon },
    { key: 'videos', label: 'Videos', icon: Video },
    { key: 'shorts', label: 'Shorts', icon: Smartphone },
    { key: 'comics', label: 'Comics', icon: BookOpen },
    { key: 'live', label: 'Live Streams', icon: Radio },
    { key: 'collection', label: 'Collection', icon: ShoppingBag },
    { key: 'resources', label: 'Knowledge', icon: FileText },
    { key: 'arcade', label: 'Arcade', icon: Gamepad2 },
    { key: 'ads', label: 'Ads Manager', icon: Megaphone },
    { key: 'finance', label: 'Finance', icon: Wallet },
    { key: 'engagement', label: 'Engagement', icon: Heart }, 
    { key: 'settings', label: 'Global Settings', icon: Settings },
];

export default function AdminRoles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load roles from DB
        const loadRoles = async () => {
             await new Promise(r => setTimeout(r, 600));
             setRoles(db.getRoles());
             setLoading(false);
        };
        loadRoles();
    }, []);

    const handleDelete = (id: string) => {
        if (confirm('Delete this role?')) {
            // In a real app, call delete API
            setRoles(roles.filter(r => r.id !== id));
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2 flex items-center gap-3">
                        <Shield className="text-brand-500" size={32} />
                        Role & Permissions
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Define access levels for Engagement Pride and Staff.
                    </p>
                </div>
                <button className="bg-white text-black px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    <Plus size={14} /> Create Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl flex flex-col group hover:border-brand-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.color.replace('text-', 'bg-').replace('500', '500/10')} border border-white/5`}>
                                    <Shield size={20} className={role.color.replace('bg-', 'text-').split(' ')[0]} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base">{role.title}</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{role.type}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-dark-900 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <Edit2 size={14} />
                                </button>
                                {role.type !== 'system' && (
                                    <button onClick={() => handleDelete(role.id)} className="p-2 hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 mb-6 min-h-[40px]">{role.description}</p>

                        <div className="flex-1 space-y-1 bg-dark-900/30 rounded-xl p-2 border border-white/5 overflow-y-auto max-h-[300px] custom-scrollbar">
                             {SECTIONS.map(section => {
                                 // Safely access permission
                                 const p = (role.permissions as any)[section.key];
                                 if (!p?.view) return null; // Only show active sections
                                 
                                 return (
                                     <div key={section.key} className="flex items-center justify-between p-2 bg-dark-900/50 rounded border border-white/5">
                                         <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                                             <section.icon size={12} className="text-gray-500" /> {section.label}
                                         </div>
                                         <div className="flex gap-1">
                                             {p.create && <span className="text-[9px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded font-black">ADD</span>}
                                             {p.edit && <span className="text-[9px] bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded font-black">EDIT</span>}
                                             {p.delete && <span className="text-[9px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-black">DEL</span>}
                                             {!p.create && !p.edit && !p.delete && <span className="text-[9px] bg-gray-500/20 text-gray-500 px-1.5 py-0.5 rounded font-black">VIEW</span>}
                                         </div>
                                     </div>
                                 )
                             })}
                             {Object.values(role.permissions || {}).every((p: any) => !p.view) && (
                                 <div className="text-center py-4 text-gray-500 text-xs font-bold uppercase tracking-widest">No active permissions.</div>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
