import React, { useState } from 'react';
import { dataService } from '../../services/dataService';
import { motion } from 'motion/react';
import { Stethoscope, Lock, Mail, ChevronRight, User } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('nurse');
  const [service, setService] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await dataService.login({ email, password });
      } else {
        await dataService.register({ 
          email, 
          password, 
          name,
          role,
          service 
        });
      }
      // Auth manager will handle the state update
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 rounded-[2.5rem] w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white mb-4 shadow-xl shadow-indigo-500/20">
            <Stethoscope size={32} />
          </div>
          <h1 className="text-3xl font-bold font-display text-white text-center tracking-tight">BioMed Connect</h1>
          <p className="text-slate-400 text-center mt-2 text-sm italic">Gestion intelligente des pannes biomédicales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Nom complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 glass-input rounded-2xl"
                  placeholder="Dr. Ahmed Benali"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 glass-input rounded-2xl"
                placeholder="votre@hopital.ma"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 glass-input rounded-2xl"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Rôle</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3.5 glass-input rounded-2xl"
                >
                  <option value="nurse">Infirmier</option>
                  <option value="technician">Technicien</option>
                  <option value="admin">Administrateur</option>
                  <option value="service">Service DAB</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Service</label>
                <input 
                  type="text" 
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-3.5 glass-input rounded-2xl"
                  placeholder="Cardiologie, Urgences, etc."
                />
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-red-400 text-xs font-medium">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
            {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          {isLogin ? "Vous n'avez pas de compte ?" : "Déjà un compte ?"}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 underline-offset-4 hover:underline transition-colors"
          >
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </p>

        <div className="mt-10 flex justify-center pt-8 border-t border-white/5">
           <div className="flex flex-col items-center">
             <span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-600 mb-3">Rôles Disponibles</span>
             <div className="flex gap-6 text-[10px] font-bold text-slate-500">
                <span className="hover:text-indigo-400 transition-colors cursor-default">Technicien</span>
                <span className="hover:text-indigo-400 transition-colors cursor-default">Infirmier</span>
                <span className="hover:text-indigo-400 transition-colors cursor-default">DAB</span>
             </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
