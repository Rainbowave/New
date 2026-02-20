
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Users, UserPlus, Check, Flame, Heart, Lock } from 'lucide-react';
import { api } from '../services/api';
import { db } from '../services/db';

interface NetworkUser {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    isVerified: boolean;
    followers: number;
    isFollowing: boolean;
    type?: 'user' | 'group';
    memberCount?: number;
    isPrivate?: boolean;
}

export default function UserNetwork() {
    const { username, type } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState<NetworkUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'groups'>(type === 'pride' ? 'followers' : type === 'groups' ? 'groups' : 'following');

    useEffect(() => {
        setActiveTab(type === 'pride' ? 'followers' : type === 'groups' ? 'groups' : 'following');
    }, [type]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setUsers([]); // Clear previous
            try {
                // Simulate API latency
                await new Promise(r => setTimeout(r, 600));
                
                if (activeTab === 'groups') {
                    // Mock Group Data
                    const mockGroups: NetworkUser[] = Array.from({ length: 10 }).map((_, i) => ({
                        id: `grp_${i}`,
                        username: `Group_${i}`,
                        displayName: `Intimacy Circle ${i+1}`,
                        avatarUrl: `https://picsum.photos/100/100?random=grp_${i}`,
                        isVerified: true,
                        followers: 0,
                        isFollowing: i % 2 === 0,
                        type: 'group',
                        memberCount: Math.floor(Math.random() * 500) + 50,
                        isPrivate: i % 3 === 0
                    }));
                    setUsers(mockGroups);
                } else {
                    // Get mock user data
                    const allUsers = db.getUsers();
                    const mockList: NetworkUser[] = allUsers.map((u: any) => ({
                        id: u.id,
                        username: u.username,
                        displayName: u.displayName,
                        avatarUrl: u.avatarUrl,
                        isVerified: u.isVerified,
                        followers: u.followers,
                        isFollowing: Math.random() > 0.5,
                        type: 'user'
                    }));
                    setUsers(mockList.sort(() => 0.5 - Math.random()));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username, activeTab]);

    const filteredUsers = users.filter(u => 
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFollow = (id: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, isFollowing: !u.isFollowing } : u));
    };

    return (
        <div className="min-h-screen bg-dark-900 pb-20">
            <div className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                                {activeTab === 'groups' ? 'Intimacy Circles' : activeTab === 'followers' ? 'Pride Members' : 'Following'}
                            </h1>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">@{username}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                        <button 
                            onClick={() => navigate(`/profile/${username}/network/pride`)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === 'followers' ? 'bg-white text-black border-white' : 'bg-dark-800 text-gray-500 border-white/5'}`}
                        >
                            Followers
                        </button>
                        <button 
                            onClick={() => navigate(`/profile/${username}/network/following`)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === 'following' ? 'bg-white text-black border-white' : 'bg-dark-800 text-gray-500 border-white/5'}`}
                        >
                            Following
                        </button>
                         <button 
                            onClick={() => navigate(`/profile/${username}/network/groups`)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === 'groups' ? 'bg-white text-black border-white' : 'bg-dark-800 text-gray-500 border-white/5'}`}
                        >
                            Intimacy Circles
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search network..."
                            className="w-full bg-dark-900 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:border-white/30 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="bg-dark-800 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => user.type === 'user' && navigate(`/profile/${user.username}`)}>
                                <img src={user.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-white/10" alt={user.username} />
                                <div>
                                    <h4 className="font-bold text-white text-sm flex items-center gap-1">
                                        {user.displayName}
                                        {user.isVerified && <Check size={12} className="text-brand-500" strokeWidth={4} />}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                        {user.type === 'group' 
                                            ? `${user.memberCount} Members` 
                                            : `@${user.username}`
                                        }
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleFollow(user.id)}
                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                    user.isFollowing 
                                    ? 'bg-dark-900 text-gray-400 border border-white/5' 
                                    : 'bg-white text-black hover:bg-brand-500 hover:text-white'
                                }`}
                            >
                                {user.type === 'group' ? (user.isFollowing ? 'Joined' : 'Join') : (user.isFollowing ? 'Following' : 'Follow')}
                            </button>
                        </div>
                    ))}
                    
                    {!loading && filteredUsers.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-white/5 rounded-xl">
                            No matching connections found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
