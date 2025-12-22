
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { THEMES } from '../constants';

interface SettingsProps {
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (current) {
      setUser(current);
      setNewName(current.name);
    }
  }, []);

  const handleUpdateProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updatedUser = { ...user, name: newName };
      
      // Atualizar no banco simulado (braitenberg_users)
      const users = JSON.parse(localStorage.getItem('braitenberg_users') || '[]');
      const updatedUsers = users.map((u: any) => u.id === user.id ? updatedUser : u);
      
      localStorage.setItem('braitenberg_users', JSON.stringify(updatedUsers));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsSaving(false);
      alert('Perfil atualizado com sucesso!');
    }, 600);
  };

  const updateTheme = (themeId: string) => {
    const updatedUser = { ...user, activeTheme: themeId };
    const users = JSON.parse(localStorage.getItem('braitenberg_users') || '[]');
    const updatedUsers = users.map((u: any) => u.id === user.id ? updatedUser : u);
    
    localStorage.setItem('braitenberg_users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    document.documentElement.className = themeId === 'default' ? 'dark' : `dark theme-${themeId}`;
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col px-4 pt-10">
        <header className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center text-primary rounded-full hover:bg-primary/10">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-2xl font-bold flex-1 text-center pr-10">Configurações</h2>
        </header>

        <section className="mb-8 p-6 bg-white dark:bg-surface-dark rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Nome de Exibição</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 px-4 focus:ring-2 focus:ring-primary outline-none font-bold" />
          </div>
          <button 
            disabled={isSaving || newName === user.name}
            onClick={handleUpdateProfile}
            className="w-full py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all active:scale-95"
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </section>

        <section className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">palette</span> Temas Desbloqueados
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Explicitly cast Object.values(THEMES) to an array of objects to fix property access errors on 'unknown' type */}
            {(Object.values(THEMES) as Array<{ id: string; name: string }>).map(theme => {
              const isUnlocked = user.unlockedThemes.includes(theme.id);
              const isActive = user.activeTheme === theme.id;
              return (
                <button key={theme.id} disabled={!isUnlocked} onClick={() => updateTheme(theme.id)} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${isActive ? 'border-primary bg-primary/5' : isUnlocked ? 'border-slate-200 dark:border-slate-800' : 'opacity-40 grayscale border-slate-100'}`}>
                  <span className="text-xs font-bold">{theme.name}</span>
                  {!isUnlocked && <span className="material-symbols-outlined text-xs">lock</span>}
                </button>
              );
            })}
          </div>
        </section>

        <button onClick={onLogout} className="mt-auto w-full py-5 rounded-2xl border border-red-200 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all">
          <span className="material-symbols-outlined">logout</span> Encerrar Sessão
        </button>
      </div>
    </div>
  );
};

export default Settings;
