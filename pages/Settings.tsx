
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  // Load preferences from localStorage on initialization
  const [smoothAnimations, setSmoothAnimations] = useState(() => {
    return localStorage.getItem('smoothAnimations') !== 'false';
  });
  const [hapticFeedback, setHapticFeedback] = useState(() => {
    return localStorage.getItem('hapticFeedback') !== 'false';
  });
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('notifications') !== 'false';
  });

  // Sync preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('smoothAnimations', String(smoothAnimations));
  }, [smoothAnimations]);

  useEffect(() => {
    localStorage.setItem('hapticFeedback', String(hapticFeedback));
  }, [hapticFeedback]);

  useEffect(() => {
    localStorage.setItem('notifications', String(notifications));
  }, [notifications]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const toggleDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const SettingToggle = ({ 
    label, 
    icon, 
    checked, 
    onChange 
  }: { 
    label: string; 
    icon: string; 
    checked: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <div 
      className="flex items-center gap-4 px-4 py-4 min-h-[56px] justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
      onClick={() => onChange(!checked)}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <span className="text-base font-bold tracking-tight">{label}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
      </label>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24 no-scrollbar">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pt-10 pb-4 border-b border-slate-200 dark:border-slate-800">
          <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center text-primary rounded-full hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h2 className="text-xl font-bold flex-1 text-center pr-10">Configurações</h2>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar py-6 px-4 md:px-8">
          {/* User Profile */}
          <div className="mb-8">
            <div className="flex items-center gap-5 bg-white dark:bg-[#1c2433] p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer hover:shadow-md transition-all">
              <div className="shrink-0 bg-center bg-no-repeat bg-cover rounded-2xl h-20 w-20 ring-4 ring-primary/10" style={{ backgroundImage: `url('https://picsum.photos/id/70/100/100')` }} />
              <div className="flex flex-col justify-center flex-1">
                <p className="text-xl font-bold leading-none mb-2">Dr. Pesquisador</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Laboratório de IA Experimental</p>
                <div className="mt-3 flex items-center gap-2">
                   <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase">Pro User</span>
                </div>
              </div>
              <div className="shrink-0 text-slate-300">
                <span className="material-symbols-outlined text-3xl">chevron_right</span>
              </div>
            </div>
          </div>

          {/* Settings Groups */}
          <div className="space-y-8">
            <div>
              <h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest px-4 pb-3">Ambiente de Trabalho</h3>
              <div className="bg-white dark:bg-[#1c2433] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="px-4 py-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">palette</span>
                    </div>
                    <span className="text-base font-bold tracking-tight">Tema Visual</span>
                  </div>
                  <div className="flex bg-slate-100 dark:bg-black/30 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                    <button onClick={() => toggleDarkMode(false)} className="px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-primary">CLARO</button>
                    <button onClick={() => toggleDarkMode(true)} className="px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white dark:bg-primary shadow-sm text-primary dark:text-white">ESCURO</button>
                  </div>
                </div>
                <SettingToggle 
                  label="Animações Suaves" 
                  icon="auto_fix_high" 
                  checked={smoothAnimations} 
                  onChange={setSmoothAnimations}
                />
              </div>
            </div>

            <div>
              <h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest px-4 pb-3">Comunicação</h3>
              <div className="bg-white dark:bg-[#1c2433] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <SettingToggle 
                  label="Notificações de Alerta" 
                  icon="notifications_active" 
                  checked={notifications} 
                  onChange={setNotifications}
                />
                <div className="h-px bg-slate-50 dark:bg-slate-800 mx-4"></div>
                <SettingToggle 
                  label="Feedback Tátil" 
                  icon="vibration" 
                  checked={hapticFeedback} 
                  onChange={setHapticFeedback}
                />
              </div>
            </div>

            <div>
              <h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest px-4 pb-3">Sistema e Dados</h3>
              <div className="bg-white dark:bg-[#1c2433] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <button 
                  onClick={() => {
                    if (confirm('Deseja realmente limpar todos os dados salvos localmente?')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="flex items-center gap-4 px-4 py-5 min-h-[56px] w-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">delete_sweep</span>
                  </div>
                  <span className="text-red-600 dark:text-red-400 text-base font-bold tracking-tight">Limpar Dados Locais</span>
                </button>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="mt-12 mb-10">
            <button 
              onClick={onLogout}
              className="w-full py-5 rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold text-lg hover:bg-red-100 dark:hover:bg-red-900/20 active:scale-98 transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <span className="material-symbols-outlined text-2xl">logout</span>
              Encerrar Sessão
            </button>
            <div className="mt-8 flex flex-col items-center gap-2">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Braitenberg Simulation Studio</p>
               <p className="text-[10px] text-slate-400/60 font-medium tracking-widest">v2.4.0-Stable Build 8292</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
