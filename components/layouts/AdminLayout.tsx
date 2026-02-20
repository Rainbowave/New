
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../admin/AdminSidebar';
import { LogOut, Bell, Eye, ChevronDown, Shield, User } from 'lucide-react';
import { UserRole } from '../../types';
import { db } from '../../services/db';

interface AdminLayoutProps {
    children: React.ReactNode;
    user: any;
    onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, user, onLogout }) => {
    // State to manage the "View As" mode
    // Defaults to the user's actual role, but admins can switch views
    const [viewRole, setViewRole] = useState<UserRole>(user.role as UserRole);
    const [availableRoles, setAvailableRoles] = useState<any[]>([]);

    const loadRoles = () => {
        const roles = db.getRoles();
        setAvailableRoles(roles);
    };

    useEffect(() => {
        loadRoles();
        // Listen for role updates
        window.addEventListener('roles-updated', loadRoles);
        return () => window.removeEventListener('roles-updated', loadRoles);
    }, []);

    return (
        <div className="flex h-screen bg-dark-900 text-gray-100 font-sans overflow-hidden">
            {/* Pass the selected viewRole to the sidebar to filter items */}
            <AdminSidebar viewRole={viewRole} />
            
            <main className="flex-1 flex flex-col min-w-0">
                {/* Admin Header */}
                <header className="h-16 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded border uppercase tracking-wider ${
                            viewRole === 'admin' ? 'bg-red-900/30 text-red-400 border-red-500/20' :
                            viewRole === 'moderator' ? 'bg-blue-900/30 text-blue-400 border-blue-500/20' :
                            viewRole === 'creator' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/20' :
                            'bg-gray-800 text-gray-400 border-gray-600'
                        }`}>
                            {viewRole.startsWith('mod_') ? 'MOD: ' + viewRole.replace('mod_', '').toUpperCase() : viewRole.toUpperCase()} VIEW
                        </span>
                        <h2 className="text-sm font-bold text-gray-400 ml-2">Welcome, {user.displayName}</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Mode Viewer Switcher - Only visible if actual user is Admin */}
                        {user.role === 'admin' && (
                            <div className="relative group">
                                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-dark-900 border border-white/5 px-3 py-1.5 rounded-lg">
                                    <Eye size={14} />
                                    <span>View Mode</span>
                                    <ChevronDown size={12} />
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-56 bg-dark-800 border border-dark-600 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50">
                                    <div className="p-2 space-y-1">
                                        <div className="px-3 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 mb-1">Select View</div>
                                        {/* Reset to Admin */}
                                        <button 
                                            onClick={() => setViewRole('admin')} 
                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ${viewRole === 'admin' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <Shield size={12} /> System Admin
                                        </button>

                                        <div className="px-3 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 mb-1 mt-2">Moderator Squads</div>
                                        {availableRoles.filter(r => !['admin', 'creator', 'user'].includes(r.id)).map(role => (
                                            <button 
                                                key={role.id}
                                                onClick={() => setViewRole(role.id as UserRole)} 
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ${viewRole === role.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                            >
                                                <Shield size={12} />
                                                {role.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <button className="relative text-gray-400 hover:text-white">
                                <Bell size={20} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button onClick={onLogout} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>
                </header>
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto bg-dark-900 scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
};
