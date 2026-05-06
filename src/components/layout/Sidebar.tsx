import { 
  LayoutDashboard, 
  FilePlus2, 
  Wrench, 
  BarChart3, 
  LogOut, 
  Stethoscope 
} from 'lucide-react';
import { UserProfile } from '../../types';
import { dataService } from '../../services/dataService';

interface SidebarProps {
  profile: UserProfile;
  currentView: string;
  setCurrentView: (view: any) => void;
}

export default function Sidebar({ profile, currentView, setCurrentView }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'technician', 'nurse', 'service'] },
    { id: 'report', label: 'Déclarer Panne', icon: FilePlus2, roles: ['nurse', 'service', 'admin'] },
    { id: 'pannes', label: 'Interventions', icon: Wrench, roles: ['technician', 'admin'] },
    { id: 'analytics', label: 'Analytique', icon: BarChart3, roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(profile.role));

  const handleSignOut = async () => {
    await dataService.signOut();
  };

  return (
    <aside className="hidden md:flex w-64 flex-col glass-nav border-r">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20">
          <Stethoscope size={24} />
        </div>
        <h1 className="text-xl font-bold font-display text-white tracking-tight">BioMed<span className="text-indigo-400">Connect</span></h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredMenu.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              currentView === item.id 
                ? 'bg-white/10 text-white border border-white/10 shadow-lg' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
