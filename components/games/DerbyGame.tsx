import React from 'react';
import { Gamepad2 } from 'lucide-react';

export const DerbyGame: React.FC<any> = ({ onClose }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-20 bg-dark-900 text-center">
            <Gamepad2 size={64} className="text-brand-500 mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-2">Galactic Derby</h2>
            <p className="text-gray-400 mb-8">This game is currently undergoing maintenance. Check back later!</p>
            <button onClick={onClose} className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all">
                Back to Arcade
            </button>
        </div>
    );
};