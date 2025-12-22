
import React, { useState } from 'react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a brief delay
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 800);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="flex flex-col items-center justify-center px-6 pt-20 pb-8 flex-shrink-0">
        <div className="relative flex items-center justify-center size-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 mb-8 border border-primary/20 shadow-2xl shadow-primary/10">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          <div className="absolute top-2 right-2 size-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)] border-2 border-white dark:border-background-dark"></div>
        </div>
        <h1 className="tracking-tight text-3xl font-bold leading-tight text-center">Braitenberg Studio</h1>
        <p className="text-slate-500 dark:text-[#9da6b9] text-base font-normal mt-2 text-center max-w-xs leading-relaxed">
          {isLogin ? 'Explore o comportamento emergente através da simulação robótica.' : 'Junte-se a milhares de pesquisadores e estudantes.'}
        </p>
      </div>

      <form className="flex flex-col gap-5 px-6 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1" htmlFor="name">Nome Completo</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"><span className="material-symbols-outlined text-xl">person</span></div>
              <input required className="w-full rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#3b4354] h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm" id="name" placeholder="Dr. Alan Turing" type="text" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1" htmlFor="email">E-mail Institucional</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"><span className="material-symbols-outlined text-xl">alternate_email</span></div>
            <input required className="w-full rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#3b4354] h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm" id="email" placeholder="pesquisa@universidade.edu" type="email" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1" htmlFor="password">Senha</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"><span className="material-symbols-outlined text-xl">lock</span></div>
            <input required className="w-full rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#3b4354] h-14 pl-12 pr-12 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm" id="password" placeholder="••••••••" type="password" />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">visibility</span></button>
          </div>
        </div>

        <button 
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center rounded-2xl h-14 bg-primary text-white text-base font-bold tracking-wide shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            isLogin ? 'Entrar no Laboratório' : 'Criar Conta de Pesquisador'
          )}
        </button>
      </form>

      <div className="mt-auto pb-12 pt-6 px-4 text-center">
        <p className="text-slate-500 font-medium">
          {isLogin ? 'Ainda não tem acesso?' : 'Já possui uma conta?'}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary font-bold ml-1 hover:underline underline-offset-2"
          >
            {isLogin ? 'Cadastre-se' : 'Faça Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
