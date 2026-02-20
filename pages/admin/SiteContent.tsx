
import React, { useState } from 'react';
import { FileText, Megaphone, MessageSquare, Plus, Edit2, Trash2, CheckCircle, Save, X } from 'lucide-react';

const PageItem = ({ title, slug, status, onDelete }: any) => (
    <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl border border-dark-600 mb-2 group hover:border-brand-500/30 transition-colors">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-dark-800 rounded-lg text-gray-400"><FileText size={20} /></div>
            <div>
                <h4 className="font-bold text-white text-sm">{title}</h4>
                <p className="text-xs text-gray-500">/{slug}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${status === 'Published' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>{status}</span>
            <button className="text-gray-400 hover:text-white p-1"><Edit2 size={16}/></button>
            <button onClick={onDelete} className="text-gray-400 hover:text-red-400 p-1"><Trash2 size={16}/></button>
        </div>
    </div>
);

const AnnouncementItem = ({ id, title, date, active, onDelete }: any) => (
    <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl border border-dark-600 mb-2 group hover:border-brand-500/30 transition-colors">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-brand-900/20 rounded-lg text-brand-400"><Megaphone size={20} /></div>
            <div>
                <h4 className="font-bold text-white text-sm">{title}</h4>
                <p className="text-xs text-gray-500">{date}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            {active && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Active"></span>}
            <button onClick={() => onDelete(id)} className="text-gray-400 hover:text-red-400 p-1"><Trash2 size={16}/></button>
        </div>
    </div>
);

export default function AdminSiteContent() {
    const [activeTab, setActiveTab] = useState('pages');
    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    
    // Pages State
    const [pages, setPages] = useState([
        { id: 1, title: "Terms of Service", slug: "terms", status: "Published" },
        { id: 2, title: "Privacy Policy", slug: "privacy", status: "Published" },
        { id: 3, title: "About Us", slug: "about", status: "Published" },
        { id: 4, title: "Creator Guidelines", slug: "guidelines", status: "Draft" },
    ]);

    // Announcements State
    const [announcements, setAnnouncements] = useState([
        { id: 1, title: "Maintenance Scheduled: Oct 28", date: "Posted 2 days ago", active: true },
        { id: 2, title: "Welcome to Creator 2.0", date: "Posted 1 month ago", active: false },
    ]);

    const handleCreate = () => {
        if (!newTitle.trim()) return;
        
        if (activeTab === 'pages') {
            const slug = newTitle.toLowerCase().replace(/ /g, '-');
            setPages([...pages, { id: Date.now(), title: newTitle, slug, status: "Draft" }]);
        } else if (activeTab === 'announcements') {
            setAnnouncements([{ id: Date.now(), title: newTitle, date: "Just now", active: true }, ...announcements]);
        }
        setNewTitle('');
        setShowCreate(false);
    };

    const handleDeletePage = (id: number) => {
        if(window.confirm("Delete this page?")) {
            setPages(pages.filter(p => p.id !== id));
        }
    };

    const handleDeleteAnnouncement = (id: number) => {
        setAnnouncements(announcements.filter(a => a.id !== id));
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Site Content</h1>
            
            <div className="flex gap-2 mb-6">
                {['pages', 'announcements', 'messages'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setShowCreate(false); }}
                        className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-brand-600 text-white' : 'bg-dark-800 text-gray-400 hover:bg-dark-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 min-h-[400px]">
                {activeTab === 'pages' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">Public Pages</h3>
                            <button 
                                onClick={() => setShowCreate(!showCreate)}
                                className="flex items-center gap-2 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white px-3 py-2 rounded-lg transition-colors"
                            >
                                <Plus size={14} /> New Page
                            </button>
                        </div>
                        
                        {showCreate && (
                            <div className="mb-4 p-4 bg-dark-900 border border-dark-600 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <input 
                                    type="text" 
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Page Title"
                                    className="flex-1 bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand-500"
                                    autoFocus
                                />
                                <button onClick={handleCreate} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white"><Save size={16}/></button>
                                <button onClick={() => setShowCreate(false)} className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-white"><X size={16}/></button>
                            </div>
                        )}

                        <div className="space-y-2">
                            {pages.map(page => (
                                <PageItem key={page.id} {...page} onDelete={() => handleDeletePage(page.id)} />
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'announcements' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">System Announcements</h3>
                            <button 
                                onClick={() => setShowCreate(!showCreate)}
                                className="flex items-center gap-2 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white px-3 py-2 rounded-lg transition-colors"
                            >
                                <Plus size={14} /> New Announcement
                            </button>
                        </div>

                        {showCreate && (
                            <div className="mb-4 p-4 bg-dark-900 border border-dark-600 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <input 
                                    type="text" 
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Announcement Headline"
                                    className="flex-1 bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand-500"
                                    autoFocus
                                />
                                <button onClick={handleCreate} className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white"><Save size={16}/></button>
                                <button onClick={() => setShowCreate(false)} className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-white"><X size={16}/></button>
                            </div>
                        )}

                        <div className="space-y-2">
                            {announcements.map(ann => (
                                <AnnouncementItem key={ann.id} {...ann} onDelete={() => handleDeleteAnnouncement(ann.id)} />
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'messages' && (
                    <div className="text-center py-12 text-gray-500">
                        <MessageSquare size={40} className="mx-auto mb-4 opacity-50" />
                        <p>No new contact messages.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
