
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Video, Menu, ShoppingBag, PlusSquare } from 'lucide-react';

interface BottomNavProps {
    onCreateClick: () => void;
    onMenuClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onCreateClick, onMenuClick }) => {
    return (
        <div className="md:hidden h-20 bg-dark-800 border-t border-dark-700 flex items-center justify-around px-2 z-20 pb-4 fixed bottom-0 w-full safe-area-pb">
            <NavLink 
                to="/home" 
                className={({isActive}) => `p-2 flex flex-col items-center gap-1 rounded-xl transition-colors ${isActive ? 'text-brand-500' : 'text-gray-500'}`}
            >
                <Home size={22} />
                <span className="text-[10px] font-medium">Home</span>
            </NavLink>
            
            <NavLink 
                to="/chat" 
                className={({isActive}) => `p-2 flex flex-col items-center gap-1 rounded-xl transition-colors ${isActive ? 'text-brand-500' : 'text-gray-500'}`}
            >
                <MessageCircle size={22} />
                <span className="text-[10px] font-medium">Inbox</span>
            </NavLink>

            <button 
                onClick={onCreateClick}
                className="p-3 bg-brand-600 rounded-2xl text-white shadow-lg shadow-brand-900/30 -mt-6 border-4 border-dark-900"
            >
                <PlusSquare size={24} />
            </button>

            <NavLink 
                to="/collection" 
                className={({isActive}) => `p-2 flex flex-col items-center gap-1 rounded-xl transition-colors ${isActive ? 'text-brand-500' : 'text-gray-500'}`}
            >
                <ShoppingBag size={22} />
                <span className="text-[10px] font-medium">Collection</span>
            </NavLink>

            <button 
                onClick={onMenuClick}
                className="p-2 flex flex-col items-center gap-1 rounded-xl text-gray-500 hover:text-white transition-colors"
            >
                <Menu size={22} />
                <span className="text-[10px] font-medium">Menu</span>
            </button>
        </div>
    );
};
