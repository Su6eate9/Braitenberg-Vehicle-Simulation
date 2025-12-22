
import React, { useState } from 'react';
import { UserProgress } from '../types';
import { INITIAL_MISSIONS } from '../constants';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('braitenberg_users') || '[]');
      
      if (isLogin) {
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          onLogin();
        } else {
          setError('Credenciais inválidas ou pesquisador não registrado.');
        }
      } else {
        if (users.find((u: any) => u.email === email)) {
          setError('E-mail já cadastrado no laboratório.');
        } else {
          const newUser = {
            id: `user_${Date.now()}`,
            name,
            email,
            password,
            xp: 0,
            unlockedThemes: ['default'],
            activeTheme: 'default',
            missions: INITIAL_MISSIONS
          };
          users.push(newUser);
          localStorage.setItem('braitenberg_users', JSON.stringify(users));
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          onLogin();
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="flex flex-col items-center justify-center px-6 pt-20 pb-8 flex-shrink-0">
        <div className="relative flex items-center justify-center size-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6 border border-primary/20 shadow-2xl shadow-primary/10">
          <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        </div>
        <h1 className="tracking-tight text-3xl font-bold leading-tight text-center">Braitenberg Studio</h1>
        <p className="text-slate-500 dark:text-[#9da6b9] text-sm mt-2 text-center max-w-xs">
          Acesse o seu laboratório de cibernética e robótica cognitiva.
        </p>
      </div>

      <form className="flex flex-col gap-4 px-6 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1" htmlFor="name">Nome do Pesquisador</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#3b4354] h-12 px-4 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" placeholder="Dr. Alan Turing" type="text" />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1" htmlFor="email">E-mail</label>
          <input required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#3b4354] h-12 px-4 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" placeholder="pesquisa@lab.io" type="email" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1" htmlFor="password">Senha</label>
          <input required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#3b4354] h-12 px-4 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" placeholder="••••••••" type="password" />
        </div>

        <button 
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center rounded-2xl h-14 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isLogin ? 'Entrar no Laboratório' : 'Criar Conta')}
        </button>
      </form>

      <div className="mt-auto pb-12 pt-6 px-4 text-center">
        <p className="text-slate-500 text-sm">
          {isLogin ? 'Novo por aqui?' : 'Já é um pesquisador?'}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold ml-1 hover:underline">
            {isLogin ? 'Cadastre-se' : 'Faça Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
