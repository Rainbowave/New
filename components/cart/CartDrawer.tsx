
import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [items, setItems] = useState<CartItem[]>([
        { id: 1, name: 'Creator Hoodie', price: 45.00, quantity: 1, image: 'https://picsum.photos/100/100?random=1', variant: 'Black / M' },
        { id: 2, name: 'Gaming Mousepad', price: 35.00, quantity: 2, image: 'https://picsum.photos/100/100?random=2', variant: 'XL RGB' }
    ]);

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const updateQuantity = (id: number, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="w-full max-w-md bg-dark-900 h-full relative z-10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-5 border-b border-dark-700 flex justify-between items-center bg-dark-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingBag size={20} /> Your Cart ({items.length})
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag size={48} className="mx-auto text-dark-600 mb-4" />
                            <p className="text-gray-500">Your cart is empty.</p>
                            <button onClick={onClose} className="mt-4 text-brand-400 font-bold hover:underline">Continue Shopping</button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex gap-4 bg-dark-800 p-3 rounded-xl border border-dark-700 group">
                                <div className="w-20 h-20 bg-dark-700 rounded-lg overflow-hidden shrink-0">
                                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{item.name}</h4>
                                            <p className="text-xs text-gray-500">{item.variant}</p>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="text-dark-600 hover:text-red-400 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="font-bold text-white">${item.price.toFixed(2)}</div>
                                        <div className="flex items-center gap-3 bg-dark-900 rounded-lg p-1 border border-dark-700">
                                            <button 
                                                onClick={() => updateQuantity(item.id, -1)} 
                                                className="p-1 hover:bg-dark-700 rounded text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Minus size={14}/>
                                            </button>
                                            <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, 1)} 
                                                className="p-1 hover:bg-dark-700 rounded text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Plus size={14}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 bg-dark-800 border-t border-dark-700">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-400">Subtotal</span>
                            <span className="text-xl font-bold text-white">${total.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={() => { onClose(); navigate('/collection/checkout'); }}
                            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                            Checkout <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
