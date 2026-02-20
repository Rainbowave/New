
import React, { useState } from 'react';
import { X, TrendingUp, Users, Target, CreditCard, CheckCircle, BarChart, Calendar, DollarSign, Hash, Image as ImageIcon, Check, Search, ChevronDown, Video, BookOpen, ShoppingBag, Eye } from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';

interface PromoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'hashtag' | 'post' | 'profile';
}

type ContentType = 'photo' | 'short' | 'comic' | 'product';

export const PromoteModal: React.FC<PromoteModalProps> = ({ isOpen, onClose, mode = 'profile' }) => {
  if (!isOpen) return null;

  const currentUser = authService.getCurrentUser();

  // State
  const [hashtag, setHashtag] = useState('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [goal, setGoal] = useState<'engagement' | 'followers' | 'clicks'>('engagement');
  const [budget, setBudget] = useState(50);
  const [duration, setDuration] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Post Selection State
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [postSearch, setPostSearch] = useState('');
  const [contentType, setContentType] = useState<ContentType>('photo');

  // Tags State
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Mock Content Database (In reality, fetch from db.getUserPosts)
  const myContent = {
      photo: [
          { id: 'p1', title: 'Summer Vibes ☀️', image: 'https://picsum.photos/200/200?random=101' },
          { id: 'p2', title: 'City Lights 🌃', image: 'https://picsum.photos/200/200?random=102' },
      ],
      short: [
          { id: 's1', title: 'Epic Fail 😂', image: 'https://picsum.photos/200/200?random=201' },
      ],
      comic: [
          { id: 'c1', title: 'Hero Origin Ep.1', image: 'https://picsum.photos/200/200?random=301' },
      ],
      product: [
          { id: 'm1', title: 'Limited Hoodie', image: 'https://picsum.photos/200/200?random=401' },
      ]
  };

  const expectedViewers = Math.floor(budget * 125 * (1 + (duration * 0.1))).toLocaleString();

  const handleAddTag = () => {
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
          setTags([...tags, tagInput.trim()]);
          setTagInput('');
      }
  };

  const handleRemoveTag = (tagToRemove: string) => {
      setTags(tags.filter(t => t !== tagToRemove));
  };

  const handlePromote = async () => {
    if (mode === 'hashtag' && !hashtag) return;
    if (mode === 'post' && !selectedPost) return;
    if (!currentUser) return;

    setIsProcessing(true);
    
    try {
        await new Promise(r => setTimeout(r, 1500)); // Simulate payment processing

        // Create Promotion Record in DB
        const promoData = {
            userId: currentUser.id,
            user: currentUser.username,
            targetType: mode,
            targetId: mode === 'hashtag' ? hashtag : mode === 'post' ? selectedPost : null,
            goal,
            budget,
            duration,
            tags
        };

        db.createPromotion(promoData);

        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            onClose();
            // Reset local state
            setHashtag('');
            setSelectedPost(null);
            setIsPostMenuOpen(false);
            setPostSearch('');
            setTags([]);
        }, 2000);
    } catch (error) {
        alert("Promotion failed. Check your wallet balance.");
    } finally {
        setIsProcessing(false);
    }
  };

  const getTargetDisplay = () => {
      if (mode === 'hashtag') return hashtag ? `#${hashtag.replace('#', '')}` : 'New Hashtag';
      if (mode === 'post') {
          return selectedPost ? `Post #${selectedPost}` : 'Select Content';
      }
      return 'Your Profile';
  };

  const activeList = myContent[contentType] || [];
  const filteredPosts = activeList.filter(p => p.title.toLowerCase().includes(postSearch.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-lg relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
          <h3 className="font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-green-500" size={20} /> 
            {mode === 'hashtag' ? 'Promote Hashtag' : mode === 'post' ? 'Boost Content' : 'Promote Profile'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="text-green-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Campaign Started!</h2>
            <p className="text-gray-400">Your request has been sent to the Admin Console for review.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Target Info Header */}
              <div className="bg-dark-900 rounded-xl p-4 border border-dark-600 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {mode === 'hashtag' ? <Hash size={24} /> : mode === 'post' ? <ImageIcon size={24} /> : 'P'}
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Promoting</div>
                    <div className="text-white font-bold truncate max-w-[200px]">{getTargetDisplay()}</div>
                </div>
              </div>

              {/* MODE: Hashtag Input */}
              {mode === 'hashtag' && (
                  <div>
                      <label className="text-sm font-bold text-gray-300 mb-3 block">Enter Hashtag</label>
                      <div className="relative">
                          <Hash className="absolute left-4 top-3.5 text-brand-500" size={20} />
                          <input 
                              type="text" 
                              value={hashtag}
                              onChange={(e) => setHashtag(e.target.value)}
                              placeholder="e.g. SummerVibes" 
                              className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all font-bold"
                              autoFocus
                          />
                      </div>
                  </div>
              )}

              {/* MODE: Post Selection */}
              {mode === 'post' && (
                  <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-300 block">Select Content Type</label>
                      
                      {/* Content Type Tabs */}
                      <div className="grid grid-cols-4 gap-2 mb-2">
                          {[
                              { id: 'photo', icon: ImageIcon, label: 'Photos' },
                              { id: 'short', icon: Video, label: 'Shorts' },
                              { id: 'comic', icon: BookOpen, label: 'Comics' },
                              { id: 'product', icon: ShoppingBag, label: 'Mega' }
                          ].map(type => (
                              <button
                                key={type.id}
                                onClick={() => { setContentType(type.id as ContentType); setSelectedPost(null); setIsPostMenuOpen(true); }}
                                className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${contentType === type.id ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-800 border-dark-600 text-gray-400 hover:bg-dark-700'}`}
                              >
                                  <type.icon size={18} />
                                  <span className="text-[10px] font-bold">{type.label}</span>
                              </button>
                          ))}
                      </div>

                      {/* Selection Box / Trigger */}
                      <div 
                          onClick={() => setIsPostMenuOpen(!isPostMenuOpen)}
                          className={`w-full p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all flex items-center justify-between group ${selectedPost ? 'border-brand-500 bg-brand-900/10' : 'border-dark-600 hover:border-brand-500/50 hover:bg-dark-700/50'}`}
                      >
                          {selectedPost ? (
                              <div className="flex items-center gap-4">
                                  <img 
                                    src={activeList.find(p => p.id === selectedPost)?.image} 
                                    className="w-12 h-12 rounded-lg object-cover shadow-sm" 
                                    alt="" 
                                  />
                                  <div className="text-left min-w-0">
                                      <p className="font-bold text-white text-sm truncate">{activeList.find(p => p.id === selectedPost)?.title}</p>
                                      <p className="text-xs text-green-400 font-medium">Ready to boost</p>
                                  </div>
                              </div>
                          ) : (
                              <div className="flex items-center gap-3 text-gray-400 group-hover:text-white">
                                  <div className="w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center group-hover:bg-dark-600 transition-colors">
                                      <ImageIcon size={24} />
                                  </div>
                                  <span className="font-bold text-sm">Select {contentType}</span>
                              </div>
                          )}
                          <ChevronDown size={20} className={`text-gray-500 transition-transform duration-200 ${isPostMenuOpen ? 'rotate-180' : ''}`} />
                      </div>

                      {/* In-page Filter Menu */}
                      {isPostMenuOpen && (
                          <div className="bg-dark-900 border border-dark-700 rounded-xl p-3 animate-in fade-in slide-in-from-top-2 shadow-xl">
                              <div className="relative mb-3">
                                  <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                                  <input 
                                      type="text" 
                                      placeholder={`Filter ${contentType}s...`} 
                                      value={postSearch}
                                      onChange={(e) => setPostSearch(e.target.value)}
                                      className="w-full bg-dark-800 border border-dark-600 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                                      autoFocus
                                  />
                              </div>
                              <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                  {filteredPosts.map(post => (
                                      <div 
                                          key={post.id}
                                          onClick={() => {
                                              setSelectedPost(post.id);
                                              setIsPostMenuOpen(false);
                                          }}
                                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                              selectedPost === post.id ? 'bg-brand-900/20 text-white' : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                                          }`}
                                      >
                                          <img src={post.image} className="w-10 h-10 rounded-md object-cover" alt="" />
                                          <span className="text-sm font-medium truncate flex-1">{post.title}</span>
                                          {selectedPost === post.id && <Check size={16} className="text-brand-500" />}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              )}

              {/* Tagging */}
              <div>
                  <label className="text-sm font-bold text-gray-300 mb-3 block">Campaign Tags</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add keywords (e.g. Summer, Sale)"
                        className="flex-1 bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-500 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <button onClick={handleAddTag} className="bg-dark-700 hover:bg-dark-600 text-white font-bold px-4 rounded-xl text-xs uppercase tracking-widest transition-all">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                          <span key={tag} className="bg-brand-500/10 text-brand-500 px-3 py-1 rounded-lg text-xs font-bold border border-brand-500/20 flex items-center gap-2">
                              #{tag}
                              <button onClick={() => handleRemoveTag(tag)} className="hover:text-white"><X size={12}/></button>
                          </span>
                      ))}
                      {tags.length === 0 && <span className="text-xs text-gray-600 italic">No tags added yet.</span>}
                  </div>
              </div>

              {/* Budget & Duration */}
              <div className="space-y-6 pt-4 border-t border-dark-700">
                <div>
                   <div className="flex justify-between mb-2">
                       <label className="text-sm font-bold text-gray-300 flex items-center gap-2"><DollarSign size={16}/> Daily Budget</label>
                       <span className="text-brand-400 font-bold">${budget}</span>
                   </div>
                   <input 
                      type="range" min="5" max="500" step="5" value={budget} 
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-brand-500"
                   />
                </div>
                <div>
                   <div className="flex justify-between mb-2">
                       <label className="text-sm font-bold text-gray-300 flex items-center gap-2"><Calendar size={16}/> Duration</label>
                       <span className="text-brand-400 font-bold">{duration} Days</span>
                   </div>
                   <input 
                      type="range" min="1" max="30" step="1" value={duration} 
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-brand-500"
                   />
                </div>
              </div>
              
              {/* Expected Viewers Calculation */}
              <div className="bg-brand-900/10 border border-brand-500/30 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <Eye className="text-brand-500" size={24} />
                      <div>
                          <h4 className="font-bold text-white text-sm uppercase">Expected Viewers</h4>
                          <p className="text-[10px] text-gray-500">Estimated Reach</p>
                      </div>
                  </div>
                  <div className="text-2xl font-black text-brand-500 tracking-tighter">
                      ~{expectedViewers}
                  </div>
              </div>

              {/* Summary */}
              <div className="flex justify-between items-center pt-2 border-t border-dark-700">
                  <div className="text-sm text-gray-400">Total Cost</div>
                  <div className="text-xl font-bold text-white">${budget * duration}.00</div>
              </div>
            </div>

            <div className="p-4 border-t border-dark-700 bg-dark-800">
                <button 
                  onClick={handlePromote}
                  disabled={isProcessing || (mode === 'hashtag' && !hashtag) || (mode === 'post' && !selectedPost)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? 'Processing...' : `Pay $${budget * duration}.00 & Promote`}
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
