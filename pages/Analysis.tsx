
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Simulation, VehicleType } from '../types';
import { RECENT_HISTORY, VEHICLE_DETAILS } from '../constants';

const AnalysisChart: React.FC<{ 
  data: number[], 
  label: string, 
  color: string,
  unit: string 
}> = ({ data, label, color, unit }) => {
  const [isVisible, setIsVisible] = useState(true);
  const max = Math.max(...data, 1);
  const width = 400;
  const height = 100;
  const padding = 20;

  const points = useMemo(() => {
    if (data.length === 0) return "";
    return data.map((val, i) => {
      const x = (i / (data.length - 1 || 1)) * (width - padding * 2) + padding;
      const y = height - ((val / max) * (height - padding * 2) + padding);
      return `${x},${y}`;
    }).join(' ');
  }, [data, max]);

  return (
    <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</h3>
          {/* Interactive Legend */}
          <button 
            onClick={() => setIsVisible(!isVisible)}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all active:scale-95 ${
              isVisible ? 'bg-slate-50 dark:bg-black/20' : 'opacity-40 grayscale'
            }`}
          >
            <div className="size-2 rounded-full" style={{ backgroundColor: color }}></div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
              {isVisible ? 'Ocultar Dados' : 'Mostrar Dados'}
            </span>
          </button>
        </div>
        <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          Max: {max.toFixed(0)}{unit}
        </span>
      </div>
      
      <div className="h-32 w-full mt-2 relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {/* Background Grid */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" />
          
          <g style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
            {/* Data Line */}
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
              className="drop-shadow-[0_2px_8px_rgba(19,91,236,0.2)]"
            />
            
            {/* Points */}
            {data.map((val, i) => {
              const x = (i / (data.length - 1 || 1)) * (width - padding * 2) + padding;
              const y = height - ((val / max) * (height - padding * 2) + padding);
              return (
                <circle 
                  key={i} 
                  cx={x} 
                  cy={y} 
                  r="4" 
                  fill="white" 
                  stroke={color} 
                  strokeWidth="2" 
                  className="transition-all hover:r-6 cursor-pointer" 
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

const Analysis: React.FC = () => {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    totalDistance: 0,
    mostUsed: '',
    completionRate: 0
  });

  const parseDistance = (d: string) => parseFloat(d.replace(/[^\d.]/g, '')) || 0;
  
  const parseDurationSeconds = (d: string) => {
    const match = d.match(/(\d+)m\s*(\d*)s?/);
    if (!match) return 0;
    const mins = parseInt(match[1]) || 0;
    const secs = parseInt(match[2]) || 0;
    return mins * 60 + secs;
  };

  useEffect(() => {
    const userSims = JSON.parse(localStorage.getItem('userSimulations') || '[]');
    const all = [...userSims, ...RECENT_HISTORY].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    setSimulations(all);

    const dist = all.reduce((acc, s) => acc + parseDistance(s.metrics.distance), 0);
    const types = all.reduce((acc: any, s) => {
      acc[s.vehicleType] = (acc[s.vehicleType] || 0) + 1;
      return acc;
    }, {});
    
    const mostUsedEntry = Object.entries(types).sort((a: any, b: any) => b[1] - a[1])[0];
    const mostUsed = mostUsedEntry ? mostUsedEntry[0].split(': ')[1] : 'N/A';
    
    setStats({
      totalCount: all.length,
      totalDistance: dist,
      mostUsed: mostUsed,
      completionRate: Math.min(100, (all.length / 50) * 100)
    });
  }, []);

  const distanceData = useMemo(() => simulations.map(s => parseDistance(s.metrics.distance)), [simulations]);
  const durationData = useMemo(() => simulations.map(s => parseDurationSeconds(s.duration)), [simulations]);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32">
      <div className="max-w-5xl mx-auto w-full px-6 pt-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Centro de Análise</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Visão geral agregada dos seus experimentos robóticos.</p>
        </header>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm">
            <span className="material-symbols-outlined text-primary mb-2">analytics</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Simulações</p>
            <p className="text-3xl font-bold mt-1">{stats.totalCount}</p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm">
            <span className="material-symbols-outlined text-blue-500 mb-2">straighten</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dist. Total</p>
            <p className="text-3xl font-bold mt-1">{stats.totalDistance.toFixed(0)}m</p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm">
            <span className="material-symbols-outlined text-pink-500 mb-2">favorite</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferido</p>
            <p className="text-xl font-bold mt-1 truncate">{stats.mostUsed}</p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm">
            <span className="material-symbols-outlined text-emerald-500 mb-2">bolt</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meta Pesquisa</p>
            <p className="text-3xl font-bold mt-1">{stats.completionRate.toFixed(0)}%</p>
          </div>
        </div>

        {/* Temporal Metrics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalysisChart 
            data={distanceData} 
            label="Distribuição de Distância" 
            color="#135bec" 
            unit="m" 
          />
          <AnalysisChart 
            data={durationData} 
            label="Duração das Simulações" 
            color="#f59e0b" 
            unit="s" 
          />
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Comportamento Dominante</h3>
            <div className="space-y-4">
              {['Medo', 'Agressão', 'Amor', 'Explorador'].map((type, i) => {
                const colors = ['bg-yellow-500', 'bg-red-500', 'bg-pink-500', 'bg-blue-400'];
                const percentages = [15, 21, 42, 22]; // Mock percentages or calculate based on 'all'
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${colors[i]}`}></div>
                        {type}
                      </span>
                      <span>{percentages[i]}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${colors[i]}`} style={{ width: `${percentages[i]}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="relative size-32 mb-4">
              <svg viewBox="0 0 36 36" className="size-full">
                <path className="text-slate-100 dark:text-slate-800" strokeDasharray="100, 100" strokeWidth="3" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-primary" strokeDasharray="84, 100" strokeWidth="3" strokeLinecap="round" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">8.4</span>
              </div>
            </div>
            <h3 className="text-lg font-bold">Fator de Complexidade</h3>
            <p className="text-sm text-slate-500 mt-2">Sua pesquisa atual apresenta um nível elevado de interações neurais complexas.</p>
            <button className="mt-6 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all active:scale-95">Exportar Dados CSV</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analysis;
