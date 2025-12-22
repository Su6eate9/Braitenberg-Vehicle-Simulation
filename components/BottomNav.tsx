
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const activePath = location.pathname;

  // Paths where BottomNav should be hidden
  const hidePaths = ['/live', '/onboarding', '/auth', '/new'];
  if (hidePaths.some(p => activePath.startsWith(p))) return null;

  const NavItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => {
    const isActive = activePath === to;
    return (
      <Link to={to} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all h-full group ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>
        <span className={`material-symbols-outlined text-2xl group-active:scale-90 transition-transform ${isActive ? 'material-symbols-filled' : ''}`}>{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe z-50 shadow-2xl">
      <div className="flex justify-between items-center h-20 max-w-lg mx-auto px-4 relative">
        <NavItem to="/" icon="dashboard" label="Home" />
        <NavItem to="/history" icon="folder_special" label="Simulações" />
        
        <div className="w-20"></div> {/* Central Gap for FAB */}
        
        <NavItem to="/analysis" icon="analytics" label="Análise" />
        <NavItem to="/settings" icon="account_circle" label="Perfil" />

        <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="pointer-events-auto rounded-full bg-background-light dark:bg-background-dark p-2">
            <Link 
              to="/new" 
              className="flex items-center justify-center size-16 rounded-full bg-primary text-white shadow-xl shadow-primary/40 hover:scale-105 hover:bg-blue-600 active:scale-90 transition-all border-4 border-white dark:border-background-dark"
            >
              <span className="material-symbols-outlined text-3xl">add</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
