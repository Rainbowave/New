
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { DiscussionSection } from './DiscussionSection';

interface CommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: number | string;
    variant?: 'default' | 'embedded'; // Embedded removes modal overlay/wrapper
}

interface Comment {
    id: number;
    user: string;
    text: string;
    time: string;
    avatar: string;
    score: number;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ isOpen, onClose, postId, variant = 'default' }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        if (isOpen && postId) {
            const fetchComments = async () => {
                setLoading(true);
                try {
                    const res = await api.get<any[]>(`/posts/${postId}/comments`);
                    if (isMounted) {
                        // Map old API response to new structure if needed, or assume API returns compatible data
                        // Adding mocks for missing fields for demo
                        const mapped = res.map(c => ({
                            id: c.id,
                            user: c.user,
                            text: c.text,
                            time: c.time,
                            avatar: c.avatar || `https://picsum.photos/50/50?random=${c.user}`,
                            score: c.score || Math.floor(Math.random() * 50)
                        }));
                        setComments(mapped);
                    }
                } catch (e) {
                    console.error("Failed to load comments", e);
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            };
            fetchComments();
        }
        return () => {
            isMounted = false;
        };
    }, [isOpen, postId]);

    if (!isOpen) return null;

    const Content = () => (
        <div className={`flex flex-col h-full ${variant === 'default' ? 'bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-lg h-[600px] shadow-2xl relative' : 'bg-transparent h-full'}`}>
            {variant === 'default' && (
                <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50 rounded-t-2xl">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Comments ({comments.length})</h3>
                    <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-0 custom-scrollbar bg-dark-900">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin text-brand-500" />
                    </div>
                ) : (
                    <div className="p-6">
                        <DiscussionSection initialComments={comments} title="Post Discussion" />
                    </div>
                )}
            </div>
        </div>
    );

    if (variant === 'embedded') {
        return <Content />;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Content />
        </div>
    );
};
