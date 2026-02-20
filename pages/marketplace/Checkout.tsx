
import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Loader2, ArrowRight, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate Stripe/Payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        setStep(2); // Success state
    };

    if (step === 2) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
                    <CheckCircle className="text-green-500" size={48} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
                <p className="text-gray-400 mb-8 max-w-md">
                    Thank you for your purchase. We've sent a confirmation email to your inbox.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/collection/orders')} className="bg-dark-800 hover:bg-dark-700 text-white px-6 py-3 rounded-xl border border-dark-600 font-bold transition-colors">
                        View Order
                    </button>
                    <button onClick={() => navigate('/collection')} className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
            
            <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping */}
                    <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
                        <h2 className="text-xl font-bold text-white mb-4">Shipping Address</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="First Name" className="bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-500 outline-none" required />
                            <input type="text" placeholder="Last Name" className="bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-500 outline-none" required />
                            <input type="text" placeholder="Address" className="col-span-2 bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-500 outline-none" required />
                            <input type="text" placeholder="City" className="bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-500 outline-none" required />
                            <input type="text" placeholder="ZIP Code" className="bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-500 outline-none" required />
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
                        <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>
                        
                        <div className="flex gap-4 mb-6">
                            <button 
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-brand-500 bg-brand-900/10' : 'border-dark-600 bg-dark-900'}`}
                            >
                                <CreditCard className={paymentMethod === 'card' ? 'text-brand-400' : 'text-gray-400'} />
                                <span className="font-bold text-sm text-white">Card</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setPaymentMethod('paypal')}
                                className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-900/20' : 'border-dark-600 bg-dark-900'}`}
                            >
                                <Wallet className={paymentMethod === 'paypal' ? 'text-blue-400' : 'text-gray-400'} />
                                <span className="font-bold text-sm text-white">PayPal</span>
                            </button>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className="space-y-4 animate-in fade-in">
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                    <input type="text" placeholder="Card Number" className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white focus:border-brand-500 outline-none" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="MM/YY" className="bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-500 outline-none" required />
                                    <input type="text" placeholder="CVC" className="bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-500 outline-none" required />
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                            <Lock size={12} /> Payments are secure and encrypted.
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Subtotal</span>
                                <span className="text-white font-medium">45.00 LSC</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Shipping</span>
                                <span className="text-white font-medium">5.00 LSC</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Taxes</span>
                                <span className="text-white font-medium">4.12 LSC</span>
                            </div>
                            <div className="h-px bg-dark-600 my-2"></div>
                            <div className="flex justify-between text-lg font-bold text-white">
                                <span>Total</span>
                                <span>54.12 LSC</span>
                            </div>
                        </div>
                        
                        <button 
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-900/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Pay Now'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
