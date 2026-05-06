
import { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  User,
  Wrench,
  ChevronRight,
  Filter
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Panne, UserProfile } from '../../types';
import { motion } from 'motion/react';

interface PanneListProps {
  profile: UserProfile;
}

export default function PanneList({ profile }: PanneListProps) {
  const [pannes, setPannes] = useState<Panne[]>([]);
  const [filter, setFilter] = useState<'Toutes' | 'Critiques' | 'En cours'>('Toutes');

  useEffect(() => {
    return dataService.listenToPannes((data) => {
      let filtered = data;
      if (filter === 'Critiques') filtered = data.filter(p => p.status === 'Critique');
      if (filter === 'En cours') filtered = data.filter(p => p.status === 'En cours');
      setPannes(filtered);
    });
  }, [filter]);

  const handleTakeCharge = async (panneId: string) => {
    await dataService.updatePanne(panneId, {
      technicianId: profile.uid,
      technicianName: profile.name,
      status: 'En cours'
    });
  };

  const handleResolve = async (panneId: string) => {
    await dataService.updatePanne(panneId, {
      status: 'Résolue',
      resolvedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center glass-nav rounded-[1.5rem] p-1.5 border border-white/5">
        <div className="flex gap-1.5 w-full sm:w-auto">
          {(['Toutes', 'Critiques', 'En cours'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="hidden sm:flex items-center gap-3 px-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <Filter size={16} />
          Filtrer par technicien
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {pannes.map((panne) => (
          <motion.div
            key={panne.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[2rem] overflow-hidden flex flex-col group hover:border-white/20 transition-all duration-500"
          >
            <div className={`h-1.5 w-full ${
              panne.status === 'Critique' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
              panne.status === 'En cours' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
            }`} />
            
            <div className="p-8 flex-1 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">{panne.equipmentName}</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">{panne.service}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  panne.urgencyLevel === 'Elevé' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                  panne.urgencyLevel === 'Moyenne' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {panne.urgencyLevel}
                </div>
              </div>

              <div className="bg-white/5 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-5 italic text-[40px] font-black uppercase pointer-events-none tracking-tighter">Report</div>
                 <p className="text-sm text-slate-300 leading-relaxed italic z-10 relative">"{panne.description}"</p>
                 <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <User size={14} className="text-indigo-400" />
                    <span>Signalement: <b className="text-slate-300 ml-1">{panne.reportedByName}</b></span>
                 </div>
              </div>

              {panne.aiSuggestions && panne.aiSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {panne.aiSuggestions.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-indigo-500/20 flex items-center gap-2">
                      <CheckCircle2 size={12} /> {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                   <Clock size={14} />
                   {new Date(panne.createdAt).toLocaleString()}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  {panne.status !== 'Résolue' && (
                    <>
                      {(!panne.technicianId || panne.technicianId === profile.uid) ? (
                        <button
                          onClick={() => panne.technicianId ? handleResolve(panne.id) : handleTakeCharge(panne.id)}
                          className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 border ${
                            panne.technicianId 
                              ? 'bg-emerald-500 text-slate-950 border-transparent hover:bg-emerald-400' 
                              : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <Wrench size={16} />
                          {panne.technicianId ? 'Terminer' : 'Intervenir'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                          <User size={14} className="text-indigo-400" />
                          {panne.technicianName}
                        </div>
                      )}
                    </>
                  )}
                  {panne.status === 'Résolue' && (
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-5 py-3 rounded-2xl border border-emerald-500/20">
                      <CheckCircle2 size={18} /> Clôturé
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {pannes.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500 italic text-lg glass-card rounded-[2rem]">
            Aucun incident ne correspond aux critères.
          </div>
        )}
      </div>
    </div>
  );
}
