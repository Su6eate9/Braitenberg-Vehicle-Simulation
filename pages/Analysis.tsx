
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Simulation, VehicleType } from '../types';
import { RECENT_HISTORY, VEHICLE_DETAILS } from '../constants';
import { GoogleGenAI } from "@google/genai";

const ComparisonChart: React.FC<{ 
  label: string; 
  dataA: number[]; 
  dataB?: number[]; 
  colorA: string; 
  colorB?: string; 
  unit: string;
}> = ({ label, dataA, dataB, colorA, colorB, unit }) => {
  const max = Math.max(...dataA, ...(dataB || []), 1);
  const w = 400;
  const h = 100;
  const p = 20;

  const getPoints = (data: number[]) => {
    return data.map((val, i) => {
      const x = (i / (data.length - 1 || 1)) * (w - p * 2) + p;
      const y = h - ((val / max) * (h - p * 2) + p);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="p-6 rounded-[2rem] bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</h3>
          <div className="flex gap-4 mt-1">
            <div className="flex items-center gap-1.5"><div className="size-2 rounded-full" style={{ backgroundColor: colorA }}></div><span className="text-[10px] font-bold text-slate-500 uppercase">Base</span></div>
            {dataB && <div className="flex items-center gap-1.5"><div className="size-2 rounded-full" style={{ backgroundColor: colorB }}></div><span className="text-[10px] font-bold text-slate-500 uppercase">Overlay</span></div>}
          </div>
        </div>
        <div className="text-right"><p className="text-[10px] font-bold text-slate-400 uppercase">Pico</p><p className="text-lg font-bold font-mono text-primary">{max.toFixed(0)}{unit}</p></div>
      </div>
      <div className="h-40 relative">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <line x1={p} y1={h-p} x2={w-p} y2={h-p} stroke="currentColor" className="text-slate-100 dark:text-white/5" strokeWidth="1" />
          {dataB && (
            <polyline fill="none" stroke={colorB} strokeWidth="2" strokeDasharray="4 2" points={getPoints(dataB)} className="opacity-40 transition-all duration-500" />
          )}
          <polyline fill="none" stroke={colorA} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={getPoints(dataA)} className="drop-shadow-[0_4px_10px_rgba(19,91,236,0.3)] transition-all duration-500" />
        </svg>
      </div>
    </div>
  );
};

const ComplexityCard: React.FC<{ score: number }> = ({ score }) => {
  return (
    <div className="p-6 rounded-[2rem] bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="size-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
          <span className="material-symbols-outlined text-3xl">hub</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fator de Complexidade</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Emergência baseada em diversidade e telemetria</p>
        </div>
      </div>
      <div className="text-center sm:text-right min-w-[120px]">
        <p className="text-3xl font-bold text-indigo-500 font-mono tracking-tighter">{score.toFixed(1)}%</p>
        <div className="w-full sm:w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000 ease-out" 
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [simA, setSimA] = useState<Simulation | null>(null);
  const [simB, setSimB] = useState<Simulation | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('userSimulations') || '[]');
    const all = [...saved, ...RECENT_HISTORY].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setSimulations(all);
    if (all.length > 0) setSimA(all[0]);
  }, []);

  const generateComparison = async () => {
    if (!simA || !simB) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analise a divergência comportamental de dois robôs de Braitenberg:
      A: ${simA.name} (${simA.vehicleType}), Distância: ${simA.metrics.distance}
      B: ${simB.name} (${simB.vehicleType}), Distância: ${simB.metrics.distance}
      Dê um parecer técnico de 2 frases sobre qual configuração demonstrou resposta sensorial mais otimizada.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setAiInsight(response.text);
    } catch (err) {
      setAiInsight("Motor de análise comparativa offline.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Simulação de rastro temporal para os gráficos
  const getTrace = (sim: Simulation | null) => {
    if (!sim) return Array(24).fill(0);
    const base = parseFloat(sim.metrics.distance.replace(/[^\d.]/g, '')) / 10;
    const seed = sim.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return Array.from({ length: 24 }, (_, i) => Math.max(5, base + Math.sin((seed + i) * 0.5) * (base/3)));
  };

  const traceA = useMemo(() => getTrace(simA), [simA]);
  const traceB = useMemo(() => getTrace(simB), [simB]);

  // Cálculo do Fator de Complexidade
  const complexityScore = useMemo(() => {
    if (!simA) return 0;
    let base = 25;
    
    // Impacto da distância (atividade física)
    const distA = parseFloat(simA.metrics.distance.replace(/[^\d.]/g, '')) || 0;
    base += Math.min(25, distA / 40);

    if (simB) {
      // Bônus por Variedade (Comportamentos diferentes somam complexidade ao sistema)
      if (simA.vehicleType !== simB.vehicleType) base += 25;
      else base += 10; // Mesma topologia, mas ambientes/ganhos diferentes

      // Bônus por Interatividade (Similaridade de performance indica "disputa" de nicho no ambiente)
      const distB = parseFloat(simB.metrics.distance.replace(/[^\d.]/g, '')) || 0;
      const diff = Math.abs(distA - distB);
      if (diff < 150) base += 15;
    }

    // Variância pseudo-aleatória baseada nos IDs para simular entropia sensorial
    const entropy = (simA.id.length + (simB?.id.length || 0)) % 8;
    
    return Math.min(99.4, base + entropy);
  }, [simA, simB]);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32 overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto w-full px-6 pt-10">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">query_stats</span>
            <h1 className="text-3xl font-bold tracking-tight">Laboratório Analítico</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Sobreponha telemetrias e descubra padrões de eficiência neural.</p>
        </header>

        <section className="mb-8 p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">layers</span>
              Modo Comparativo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Cenário A (Primário)</label>
                <select value={simA?.id} onChange={(e) => setSimA(simulations.find(s => s.id === e.target.value) || null)} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                  {simulations.map(s => <option key={s.id} value={s.id}>{s.name} - {s.timestamp}</option>)}
                </select>
                {simA && <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5"><span className={`material-symbols-outlined ${VEHICLE_DETAILS[simA.vehicleType].color}`}>{VEHICLE_DETAILS[simA.vehicleType].icon}</span><div className="flex flex-col"><span className="text-xs font-bold">{simA.vehicleType}</span><span className="text-[10px] opacity-40">{simA.metrics.distance} rodados</span></div></div>}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Cenário B (Overlay)</label>
                <select value={simB?.id || ''} onChange={(e) => setSimB(simulations.find(s => s.id === e.target.value) || null)} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer">
                  <option value="">Nenhum</option>
                  {simulations.map(s => <option key={s.id} value={s.id}>{s.name} - {s.timestamp}</option>)}
                </select>
                {simB && <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5"><span className={`material-symbols-outlined text-amber-500`}>{VEHICLE_DETAILS[simB.vehicleType].icon}</span><div className="flex flex-col"><span className="text-xs font-bold">{simB.vehicleType}</span><span className="text-[10px] opacity-40">{simB.metrics.distance} rodados</span></div></div>}
              </div>
            </div>
            {simA && simB && (
              <button onClick={generateComparison} disabled={isAnalyzing} className="mt-8 w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50">
                {isAnalyzing ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span className="material-symbols-outlined">analytics</span>}
                Sintetizar Divergência com IA
              </button>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 mb-10">
          {simA && <ComplexityCard score={complexityScore} />}
          
          <ComparisonChart label="Sinal de Telemetria Integrada" dataA={traceA} dataB={simB ? traceB : undefined} colorA="#135bec" colorB="#f59e0b" unit="m" />
          
          {aiInsight && (
            <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 animate-in zoom-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">psychology</span>
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Relatório Comparativo de IA</h3>
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 italic leading-relaxed font-medium">"{aiInsight}"</p>
            </div>
          )}
        </div>

        {!simB && (
          <div className="p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/5 flex flex-col items-center text-center opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4">compare_arrows</span>
            <p className="text-sm font-bold uppercase tracking-widest">Selecione um cenário B para habilitar o Overlay</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
