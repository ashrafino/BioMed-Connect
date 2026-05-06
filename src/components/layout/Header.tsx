
import { Bell, Search, User } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  profile: UserProfile;
}

export default function Header({ profile }: HeaderProps) {
  return (
    <header className="h-16 glass-nav border-b flex items-center justify-between px-4 md:px-8 shrink-0 relative z-20">
      <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full max-w-md backdrop-blur-sm shadow-inner overflow-hidden">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Rechercher équipement ou panne..." 
          className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm ml-2 w-full text-white placeholder-slate-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:bg-white/10 rounded-full relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950 shadow-lg shadow-indigo-500/50" />
        </button>
        
        <div className="h-8 w-px bg-white/10 mx-1" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white tracking-tight">{profile.name}</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{profile.role}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 overflow-hidden shadow-lg shadow-indigo-500/10">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
