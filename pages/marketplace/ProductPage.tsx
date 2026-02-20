
import React, { useState } from 'react';
import { ShoppingCart, Star, Share2, Heart, Check, Truck, ShieldCheck, X, Info, User, MessageCircle } from 'lucide-react';
import { RelatedCarousel } from '../../components/RelatedCarousel';

const relatedProducts = [
    { id: 201, title: "Texture Pack Vol. 2", subtitle: "Assets", image: "https://picsum.photos/300/300?random=201", price: "20.00", type: "product" },
    { id: 202, title: "Pro Brushes", subtitle: "Tools", image: "https://picsum.photos/300/300?random=202", price: "15.00", type: "product" },
    { id: 203, title: "Cyberpunk UI Kit", subtitle: "Design", image: "https://picsum.photos/300/300?random=203", price: "45.00", type: "product" },
    { id: 204, title: "3D Models", subtitle: "Assets", image: "https://picsum.photos/300/300?random=204", price: "60.00", type: "product" },
    { id: 205, title: "Stream Overlay", subtitle: "Streaming", image: "https://picsum.photos/300/300?random=205", price: "10.00", type: "product" },
    { id: 206, title: "LUT Pack", subtitle: "Video", image: "https://picsum.photos/300/300?random=206", price: "25.00", type: "product" },
];

export default function ProductPage() {
    const [selectedOption, setSelectedOption] = useState('Standard License');
    const [showToast, setShowToast] = useState(false);
    const [mainImage, setMainImage] = useState('https://picsum.photos/800/800?random=1');

    const handleAddToCart = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 relative h-full flex flex-col">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300">
                    <div className="bg-white/20 p-1 rounded-full"><Check size={16} /></div>
                    <div>
                        <h4 className="font-bold text-sm">Added to Cart</h4>
                        <p className="text-xs text-green-100">Creator Item ({selectedOption})</p>
                    </div>
                    <button onClick={() => setShowToast(false)} className="ml-4 hover:bg-black/10 p-1 rounded"><X size={14}/></button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-dark-800 rounded-2xl overflow-hidden border border-dark-700 relative group shadow-2xl">
                        <img src={mainImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Product" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 11, 12, 13].map(i => (
                            <div 
                                key={i} 
                                onClick={() => setMainImage(`https://picsum.photos/800/800?random=${i}`)}
                                className={`aspect-square bg-dark-800 rounded-xl overflow-hidden border cursor-pointer transition-all ${mainImage.includes(`random=${i}`) ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-dark-700 hover:border-brand-500'}`}
                            >
                                <img src={`https://picsum.photos/800/800?random=${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt={`Gallery ${i}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Digital Creator Asset Pack</h1>
                            <div className="flex items-center gap-2 text-yellow-500 text-sm">
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <span className="text-gray-400 font-medium">(124 reviews)</span>
                            </div>
                        </div>
                        <button className="p-3 bg-dark-800 rounded-full text-gray-400 hover:text-red-500 hover:bg-dark-700 transition-colors">
                            <Heart size={24} />
                        </button>
                    </div>

                    <div className="text-3xl font-bold text-white mb-8">45.00 LSC</div>

                    {/* License Selection */}
                    <div className="space-y-6 mb-8">
                        <div>
                            <label className="text-sm font-bold text-gray-400 block mb-3">Select License: <span className="text-white">{selectedOption}</span></label>
                            <div className="flex flex-wrap gap-3">
                                {['Standard License', 'Extended License', 'Team License'].map(opt => (
                                    <button 
                                        key={opt}
                                        onClick={() => setSelectedOption(opt)}
                                        className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${selectedOption === opt ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-800 border-dark-600 text-gray-300 hover:border-gray-500'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mb-8">
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-900/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                        >
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                        <button className="bg-dark-800 hover:bg-dark-700 text-white font-bold py-4 px-6 rounded-xl border border-dark-600 transition-colors">
                            <Share2 size={20} />
                        </button>
                    </div>

                    {/* Site Info */}
                    <div className="grid grid-cols-1 gap-4 text-sm text-gray-300 mb-8">
                        <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl border border-dark-700">
                            <ShieldCheck className="text-green-400" />
                            <span>Verified Creator • Instant Digital Download</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl border border-dark-700">
                            <Info className="text-blue-400" />
                            <span>Files included: .PSD, .AI, .PNG</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-dark-700">
                        <h3 className="font-bold text-white mb-2">Description</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Enhance your creative workflow with this premium asset pack. Includes high-quality textures, brushes, and overlays compatible with major design software. Perfect for digital artists, photographers, and graphic designers looking to add depth and character to their work.
                        </p>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mb-12 border-t border-dark-700 pt-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <MessageCircle className="text-brand-500" /> Reviews <span className="text-sm text-gray-500 font-normal ml-2">(124)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(review => (
                        <div key={review} className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-gray-400">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Verified Buyer</h4>
                                    <div className="flex text-yellow-500 text-xs">
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 ml-auto">2 days ago</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                "Honestly one of the best asset packs I've purchased. The resolution is insane and it's super easy to use in Photoshop. Highly recommend!"
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 text-center">
                    <button className="text-sm font-bold text-gray-400 hover:text-white transition-colors">View All Reviews</button>
                </div>
            </div>

            {/* Related Products Carousel */}
            <RelatedCarousel title="You Might Also Like" items={relatedProducts as any[]} type="product" />
        </div>
    );
}
