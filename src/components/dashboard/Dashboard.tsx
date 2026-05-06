
import { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Activity,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Panne, UserProfile } from '../../types';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface DashboardProps {
  profile: UserProfile;
  setCurrentView: (view: any) => void;
}

export default function Dashboard({ profile, setCurrentView }: DashboardProps) {
  const [pannes, setPannes] = useState<Panne[]>([]);

  useEffect(() => {
    return dataService.listenToPannes(setPannes);
  }, []);

  const stats = [
    { label: 'Total pannes', value: pannes.length, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Critiques', value: pannes.filter(p => p.status === 'Critique').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'En cours', value: pannes.filter(p => p.status === 'En cours').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Résolues', value: pannes.filter(p => p.status === 'Résolue').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const chartData = [
    { name: 'Dialyse', val: 35 },
    { name: 'Urgence', val: 28 },
    { name: 'Bloc', val: 20 },
    { name: 'Imagerie', val: 18 },
    { name: 'Cardio', val: 12 },
    { name: 'Autres', val: 8 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold font-display text-white tracking-tight">Vue d'ensemble</h1>
          <p className="text-slate-400 mt-1">Gérez et priorisez les interventions médicales en temps réel.</p>
        </div>
        <button 
          onClick={() => setCurrentView('report')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-xl shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={20} />
          Déclarer une panne
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 rounded-[2rem]"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-white/5 border border-white/10 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-3xl font-light text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-8 rounded-[2rem]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Analyse des pannes par service</h2>
              <p className="text-sm text-slate-500 italic">Volume de pannes enregistrées ce mois-ci</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-400 px-3 py-2 outline-none hover:bg-white/10 transition-colors">
              <option>Ce mois</option>
              <option>Cette semaine</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'}}
                  itemStyle={{color: '#fff', fontSize: '12px'}}
                  labelStyle={{color: '#94a3b8', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em'}}
                />
                <Bar dataKey="val" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <motion.rect key={`cell-${index}`} initial={{ height: 0 }} animate={{ height: 'auto' }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem] flex flex-col h-[400px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-xl font-bold text-white tracking-tight">Pannes récentes</h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {pannes.slice(0, 5).map((panne) => (
              <div key={panne.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
                  panne.urgencyLevel === 'Elevé' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                  panne.urgencyLevel === 'Moyenne' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}>
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{panne.equipmentName}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                    {panne.service} • {new Date(panne.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex flex-col justify-center">
                  <span className={`text-[9px] uppercase font-bold py-1 px-2 rounded-lg border ${
                    panne.status === 'En cours' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                    panne.status === 'Critique' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {panne.status}
                  </span>
                </div>
              </div>
            ))}
            {pannes.length === 0 && (
              <p className="text-center text-slate-500 py-12 text-sm italic">Aucune panne enregistrée</p>
            )}
          </div>
          <button className="w-full mt-6 py-3 text-xs font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-all uppercase tracking-widest">
            Historique complet
          </button>
        </div>
      </div>
    </div>
  );
}
