
import { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { UserProfile, UrgencyLevel, PanneStatus } from '../../types';
import { dataService } from '../../services/dataService';
import { getPanneAnalysis } from '../../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface PanneFormProps {
  profile: UserProfile;
  onBack: () => void;
}

export default function PanneForm({ profile, onBack }: PanneFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service: profile.service || 'Dialyse',
    equipment: '',
    description: '',
    urgencyLevel: 'Moyenne' as UrgencyLevel,
  });

  const [aiAnalysis, setAiAnalysis] = useState<{
    priorityScore: number;
    priorityLevel: string;
    suggestions: string[];
  } | null>(null);

  const services = ['Dialyse', 'Urgence', 'Bloc Opératoire', 'Imagerie', 'Cardiologie', 'Pédiatrie'];
  const equipmentsMap: Record<string, string[]> = {
    'Dialyse': ['Machine d\'hémodialyse (HD-01)', 'Osmoseur', 'Générateur de secours'],
    'Urgence': ['Défibrillateur (DF-02)', 'Moniteur Multiparamétrique', 'Ventilateur (VT-05)'],
    'Bloc Opératoire': ['Table d\'opération', 'Scialytique', 'Bistouri électrique'],
  };

  const handleNext = async () => {
    if (step === 1) {
      setLoading(true);
      const suggestions = await getPanneAnalysis(formData.equipment, formData.description);
      
      // Heuristic for priority scoring for demo purposes
      let score = 10;
      if (formData.urgencyLevel === 'Elevé') score += 5;
      if (formData.service === 'Urgence' || formData.service === 'Bloc Opératoire') score += 3;
      if (formData.description.toLowerCase().includes('patient')) score += 2;
      
      setAiAnalysis({
        priorityScore: Math.min(score, 20),
        priorityLevel: score > 15 ? 'CRITIQUE' : score > 10 ? 'MOYENNE' : 'FAIBLE',
        suggestions
      });
      setLoading(false);
      setStep(2);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await dataService.reportPanne({
      equipmentId: 'HD-0' + Math.floor(Math.random() * 100),
      equipmentName: formData.equipment,
      service: formData.service,
      description: formData.description,
      urgencyLevel: formData.urgencyLevel,
      status: aiAnalysis?.priorityLevel === 'CRITIQUE' ? 'Critique' : 'En cours',
      priorityScore: aiAnalysis?.priorityScore || 0,
      priorityLevel: aiAnalysis?.priorityLevel || 'Moyenne',
      reportedBy: profile.uid,
      reportedByName: profile.name,
      createdAt: new Date().toISOString(),
      aiSuggestions: aiAnalysis?.suggestions || []
    });
    setLoading(false);
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft size={18} />
        Retour au dashboard
      </button>

      <div className="glass-card rounded-[2.5rem] overflow-hidden">
        <div className="flex border-b border-white/5">
          <div className={`flex-1 p-6 text-center border-b-4 transition-all ${step === 1 ? 'border-primary-500 bg-white/5' : 'border-emerald-500 bg-emerald-500/5'}`}>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step === 1 ? 'text-primary-400' : 'text-emerald-400'}`}>
              Étape 1
            </span>
            <h3 className="font-bold text-white mt-1">Déclaration</h3>
          </div>
          <div className={`flex-1 p-6 text-center border-b-4 transition-all ${step === 2 ? 'border-primary-500 bg-white/5' : 'border-transparent'}`}>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step === 2 ? 'text-primary-400' : 'text-slate-500'}`}>
              Étape 2
            </span>
            <h3 className="font-bold text-white mt-1">Analyse & Priorité</h3>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {step === 1 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Service Émetteur</label>
                  <select 
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full glass-input rounded-2xl px-5 py-4 appearance-none"
                  >
                    {services.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Équipement Concerné</label>
                  <select 
                    value={formData.equipment}
                    onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                    className="w-full glass-input rounded-2xl px-5 py-4 appearance-none"
                  >
                    <option value="" className="bg-slate-900">Sélectionner...</option>
                    {(equipmentsMap[formData.service] || ['Générique']).map(e => <option key={e} value={e} className="bg-slate-900">{e}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Description Technique</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full glass-input rounded-2xl px-5 py-4 resize-none"
                  placeholder="Décrivez les symptômes de la panne..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Degré d'Urgence Déclaré</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['Faible', 'Moyenne', 'Elevé'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({...formData, urgencyLevel: level})}
                      className={`py-4 rounded-2xl font-bold transition-all border 2 ${
                        formData.urgencyLevel === level 
                          ? 'bg-primary-500/10 border-primary-500 text-primary-400 shadow-lg shadow-primary-500/10' 
                          : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                <div className="flex flex-col md:flex-row gap-8 items-stretch">
                  <div className="flex-1 glass-card bg-primary-500/5 rounded-3xl p-10 border-primary-500/20 flex flex-col items-center justify-center text-center shadow-primary-500/10">
                    <h4 className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em] mb-6">Score de Priorité IA</h4>
                    <div className={`px-6 py-2 rounded-full font-black text-xs tracking-widest mb-8 border ${
                      aiAnalysis?.priorityLevel === 'CRITIQUE' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                    }`}>
                      {aiAnalysis?.priorityLevel}
                    </div>
                    <div className="relative h-32 w-32 flex items-center justify-center">
                       <svg className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-lg">
                          <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                          <circle 
                            cx="64" cy="64" r="56" 
                            stroke={aiAnalysis?.priorityLevel === 'CRITIQUE' ? '#ef4444' : '#3b82f6'} 
                            strokeWidth="8" fill="none" 
                            strokeDasharray="351.8" 
                            strokeDashoffset={351.8 - (351.8 * (aiAnalysis?.priorityScore || 0) / 20)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                       </svg>
                       <div className="text-center z-10">
                         <span className="text-5xl font-light text-white leading-none">{aiAnalysis?.priorityScore}</span>
                         <span className="text-xs text-slate-500 block font-bold mt-1">/20</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                      <Lightbulb size={24} />
                      <p className="text-sm font-bold tracking-tight">Recommandations du Système</p>
                    </div>
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                      {aiAnalysis?.suggestions.map((s, i) => (
                        <div key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-black text-primary-400">{i + 1}</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          <div className="mt-12 flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/5">
             <button 
               onClick={onBack}
               className="px-8 py-3 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition"
             >
               Annuler
             </button>
             <button 
               onClick={handleNext}
               disabled={loading || (step === 1 && !formData.equipment)}
               className="bg-white text-slate-950 px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-slate-100 transition shadow-2xl disabled:opacity-30 active:scale-95 group"
             >
               {loading ? (
                 <Loader2 size={24} className="animate-spin" />
               ) : (
                 <>
                   {step === 1 ? 'Analyse Initiale' : 'Soumettre Intervention'}
                   <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </>
               )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
