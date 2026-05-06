/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { authManager, AuthUser } from './lib/auth';
import { dataService } from './services/dataService';
import { UserProfile, UserRole } from './types';
import Login from './components/auth/Login';
import { BarChart3 } from 'lucide-react';

import Dashboard from './components/dashboard/Dashboard';
import PanneForm from './components/pannes/PanneForm';
import PanneList from './components/pannes/PanneList';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'report' | 'pannes' | 'analytics'>('dashboard');

  useEffect(() => {
    const unsubscribe = authManager.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const userProfile = await dataService.getProfile(authUser.uid);
        if (userProfile) {
          setProfile(userProfile as UserProfile);
        } else {
          // New user logic - for demo, default to technician if email contains 'tech'
          const role: UserRole = authUser.email?.includes('tech') ? 'technician' : 
                            authUser.email?.includes('admin') ? 'admin' : 'nurse';
          
          const newProfile: UserProfile = {
            uid: authUser.uid,
            email: authUser.email || '',
            name: authUser.name || 'Utilisateur',
            role,
            createdAt: new Date().toISOString()
          };
          await dataService.createProfile(newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user || !profile) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-slate-950 font-sans relative overflow-hidden text-slate-200">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      <Sidebar profile={profile} currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <Header profile={profile} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'dashboard' && <Dashboard profile={profile} setCurrentView={setCurrentView} />}
              {currentView === 'report' && <PanneForm profile={profile} onBack={() => setCurrentView('dashboard')} />}
              {currentView === 'pannes' && <PanneList profile={profile} />}
              {currentView === 'analytics' && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <BarChart3 size={64} className="mb-4 opacity-20" />
                  <p className="text-xl font-bold font-display text-white">Rapports & Statistiques</p>
                  <p>Cette fonctionnalité est réservée aux administrateurs.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
