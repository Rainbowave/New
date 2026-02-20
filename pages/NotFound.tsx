import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-6 border-2 border-dark-700">
        <AlertTriangle size={48} className="text-brand-500" />
      </div>
      <h1 className="text-6xl font-black text-white mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-300 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button 
        onClick={() => navigate('/home')}
        className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
      >
        <Home size={20} /> Go Home
      </button>
    </div>
  );
}