import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ServerCrash } from 'lucide-react';

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/30">
        <ServerCrash size={48} className="text-red-500" />
      </div>
      <h1 className="text-6xl font-black text-white mb-2">500</h1>
      <h2 className="text-2xl font-bold text-gray-300 mb-4">Server Error</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Oops! Something went wrong on our end. We're fixing it as we speak. Please try again later.
      </p>
      <div className="flex gap-4">
        <button 
            onClick={() => window.location.reload()}
            className="bg-dark-800 hover:bg-dark-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all border border-dark-600"
        >
            <RefreshCw size={20} /> Refresh
        </button>
        <button 
            onClick={() => navigate('/home')}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-xl transition-all hover:scale-105"
        >
            Go Home
        </button>
      </div>
    </div>
  );
}