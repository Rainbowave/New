
import React, { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

interface AgeGateProps {
  onVerify: (isVerified: boolean, birthDate: string) => void;
}

export const AgeGate: React.FC<AgeGateProps> = ({ onVerify }) => {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      setError('DOB required');
      return;
    }

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 18) {
      setError('Identity restricted. Must be 18+');
      onVerify(false, birthDate);
    } else {
      onVerify(true, birthDate);
    }
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-white text-black rounded flex items-center justify-center mx-auto mb-6 shadow-xl italic font-black text-2xl">
        18+
      </div>
      <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Age Verification</h2>
      <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mb-10">Confirm birth date to initialize sanctuary</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
           <input 
             type="date" 
             value={birthDate}
             onChange={(e) => setBirthDate(e.target.value)}
             className="w-full bg-dark-800 border border-white/5 rounded px-4 py-4 text-white font-black text-center focus:border-brand-500 outline-none uppercase transition-all"
             required
           />
        </div>
        
        {error && (
            <div className="bg-red-900/10 border border-red-500/20 rounded p-4 flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle size={16} /> {error}
            </div>
        )}

        <button 
          type="submit"
          className="w-full bg-white text-black font-black py-5 rounded uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-gray-100 active:scale-[0.98] transition-all"
        >
          Confirm Identity
        </button>
      </form>
    </div>
  );
};
