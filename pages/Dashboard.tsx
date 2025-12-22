
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Simulation, Mission } from '../types';
import { VEHICLE_DETAILS } from '../constants';
import { GoogleGenAI } from "@google/genai";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userSims, setUserSims] = useState<Simulation[]>([]);
  const [theoryInsight, setTheoryInsight] = useState<string>('Carregando bases da neuro-robótica...');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
      setUser(currentUser);
      const allSims = JSON.parse(localStorage.getItem('userSimulations') || '[]');
      setUserSims(allSims.slice(0, 5));
      fetchTheory();
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const fetchTheory = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Explique brevemente (15 palavras) o conceito de comportamento emergente nos veículos de Braitenberg para um estudante de robótica.'
      });
      setTheoryInsight(response.text || 'Simplicidade na conexão gera complexidade no comportamento adaptativo.');
    } catch (e) {
      setTheoryInsight('Comportamentos complexos emergem de arquiteturas neurais minimalistas e conexões sensor-motor.');
    }
  };

  if (!user) return null;

  return (
    <div className="pb-32 bg-background-light dark:bg-background-dark min-h-screen overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto px-6">
        <header className="flex items-center justify-between py-10">
          <div>
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-1">Status do Pesquisador</h2>
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          </div>
          <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">stars</span>
            <span className="text-sm font-bold text-primary">{user.xp} XP</span>
          </div>
        </header>

        {/* Módulo de Fundamentação Teórica (P3) */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-primary via-indigo-700 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-9xl">school</span>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-indigo-200">Fundamentação Acadêmica</h3>
              <p className="text-xl font-medium leading-relaxed italic">"{theoryInsight}"</p>
              <div className="mt-6 flex gap-3">
                 <span className="text-[9px] font-bold px-2 py-1 bg-white/10 rounded border border-white/20">VALENTINO BRAITENBERG (1984)</span>
                 <span className="text-[9px] font-bold px-2 py-1 bg-white/10 rounded border border-white/20">NEURO-ROBÓTICA</span>
              </div>
            </div>
          </div>
        </section>

        {/* Objetivos do Projeto P3 */}
        <section className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">inventory_2</span> Objetivos do Laboratório
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-surface-dark rounded-3xl border border-slate-100 dark:border-white/5">
              <span className="material-symbols-outlined text-primary mb-3">hub</span>
              <h4 className="font-bold text-sm mb-1">Mapeamento Neural</h4>
              <p className="text-[10px] text-slate-500">Analise como conexões ipsi e contralaterais ditam o comportamento.</p>
            </div>
            <div className="p-6 bg-white dark:bg-surface-dark rounded-3xl border border-slate-100 dark:border-white/5">
               <span className="material-symbols-outlined text-emerald-500 mb-3">psychology</span>
               <h4 className="font-bold text-sm mb-1">Emergência Cognitiva</h4>
               <p className="text-[10px] text-slate-500">Identifique medo, agressão e amor através de telemetria sensorial.</p>
            </div>
            <div className="p-6 bg-white dark:bg-surface-dark rounded-3xl border border-slate-100 dark:border-white/5">
               <span className="material-symbols-outlined text-amber-500 mb-3">biotech</span>
               <h4 className="font-bold text-sm mb-1">Sistemas Biológicos</h4>
               <p className="text-[10px] text-slate-500">Compare resultados com organismos como C. elegans e bactérias.</p>
            </div>
          </div>
        </section>

        {/* Sessões Recentes */}
        <section>
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Registros de Campo</h3>
             <button onClick={() => navigate('/history')} className="text-primary text-[10px] font-bold uppercase">Ver Log Completo</button>
          </div>
          <div className="space-y-4">
             {userSims.map(sim => (
               <div key={sim.id} onClick={() => navigate(`/live/${sim.id}`)} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                     <span className={`material-symbols-outlined ${VEHICLE_DETAILS[sim.vehicleType].color}`}>{VEHICLE_DETAILS[sim.vehicleType].icon}</span>
                     <div>
                        <p className="font-bold text-sm">{sim.name}</p>
                        <p className="text-[9px] text-slate-400 uppercase">{sim.vehicleType} • {sim.timestamp}</p>
                     </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">chevron_right</span>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
