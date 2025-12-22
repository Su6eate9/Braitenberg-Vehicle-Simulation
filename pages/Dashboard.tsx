
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Simulation, SimulationStatus, VehicleType } from '../types';
import { VEHICLE_DETAILS } from '../constants';

const SensorChart: React.FC<{ data: { l: number, r: number }[] }> = ({ data }) => {
  const maxPoints = 60; 
  const width = 300;
  const height = 100;

  const getX = (index: number) => (index / (maxPoints - 1)) * width;
  const getY = (value: number) => height - (value / 100) * height;

  const pointsL = useMemo(() => data.map((d, i) => `${getX(i)},${getY(d.l)}`).join(' '), [data]);
  const pointsR = useMemo(() => data.map((d, i) => `${getX(i)},${getY(d.r)}`).join(' '), [data]);

  const areaL = useMemo(() => data.length === 0 ? "" : `${pointsL} ${getX(data.length - 1)},${height} ${getX(0)},${height} Z`, [pointsL, data]);
  const areaR = useMemo(() => data.length === 0 ? "" : `${pointsR} ${getX(data.length - 1)},${height} ${getX(0)},${height} Z`, [pointsR, data]);

  return (
    <div className="w-full h-[120px] mt-4 bg-slate-50 dark:bg-black/30 rounded-2xl p-2 border border-slate-100 dark:border-white/5 relative overflow-hidden group">
      <div className="absolute top-2 left-3 flex gap-4 z-10">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(19,91,236,0.5)]"></div>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">sensorL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">sensorR</span>
        </div>
      </div>
      <div className="absolute top-2 right-3 z-10 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
        <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Live: 60s</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradL" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#135bec" stopOpacity="0.2" /><stop offset="100%" stopColor="#135bec" stopOpacity="0" /></linearGradient>
          <linearGradient id="gradR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" /><stop offset="100%" stopColor="#f59e0b" stopOpacity="0" /></linearGradient>
        </defs>
        <g className="opacity-20">
          <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="currentColor" className="text-slate-400" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="currentColor" className="text-slate-400" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="currentColor" className="text-slate-400" strokeWidth="0.5" strokeDasharray="2 4" />
        </g>
        <polygon points={areaR} fill="url(#gradR)" className="transition-all duration-1000 linear" />
        <polygon points={areaL} fill="url(#gradL)" className="transition-all duration-1000 linear" />
        <polyline fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" points={pointsR} className="transition-all duration-1000 linear" />
        <polyline fill="none" stroke="#135bec" strokeWidth="2" strokeLinecap="round" points={pointsL} className="transition-all duration-1000 linear" />
      </svg>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [visVehicle, setVisVehicle] = useState<VehicleType>(VehicleType.LOVE);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [sensorHistory, setSensorHistory] = useState<{ l: number, r: number }[]>(
    Array(60).fill(null).map(() => ({ l: 20 + Math.random() * 20, r: 20 + Math.random() * 20 }))
  );

  useEffect(() => {
    const saved = localStorage.getItem('userSimulations');
    if (saved) {
      setSimulations(JSON.parse(saved).slice(0, 5));
    }

    const interval = setInterval(() => {
      setSensorHistory(prev => {
        const last = prev[prev.length - 1];
        const drift = 15;
        const nl = Math.max(0, Math.min(100, last.l + (Math.random() - 0.5) * drift));
        const nr = Math.max(0, Math.min(100, last.r + (Math.random() - 0.5) * drift));
        return [...prev.slice(1), { l: nl, r: nr }];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: 'Braitenberg Studio',
      text: 'Confira esta simulação ativa no Braitenberg Studio!',
      url: window.location.href.split('#')[0] + '#/live/alpha'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copiado para a área de transferência!');
      }
    } catch (err) {
      console.debug('Compartilhamento cancelado ou falhou', err);
    }
  };

  const renderNeuralGraph = () => {
    const isCrossed = visVehicle === VehicleType.AGGRESSION || visVehicle === VehicleType.LOVE;
    const isInhibitory = visVehicle === VehicleType.LOVE || visVehicle === VehicleType.EXPLORER;
    const polarity = isInhibitory ? '-' : '+';
    const color = isInhibitory ? '#ef4444' : '#22c55e';

    return (
      <div className="relative w-full aspect-[16/9] bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 120" className="w-full h-full p-4">
          <g transform="translate(40, 25)">
            <rect x="-15" y="-10" width="30" height="20" rx="4" className="fill-white dark:fill-surface-dark stroke-slate-300 dark:stroke-slate-700 shadow-sm" />
            <text textAnchor="middle" y="4" className="fill-slate-500 dark:fill-slate-400 font-bold text-[8px]">S. ESQ</text>
            <circle cx="0" cy="10" r="3" fill="#f59e0b" />
          </g>
          <g transform="translate(160, 25)">
            <rect x="-15" y="-10" width="30" height="20" rx="4" className="fill-white dark:fill-surface-dark stroke-slate-300 dark:stroke-slate-700 shadow-sm" />
            <text textAnchor="middle" y="4" className="fill-slate-500 dark:fill-slate-400 font-bold text-[8px]">S. DIR</text>
            <circle cx="0" cy="10" r="3" fill="#f59e0b" />
          </g>
          <g transform="translate(40, 95)">
            <rect x="-15" y="-10" width="30" height="20" rx="4" className="fill-white dark:fill-surface-dark stroke-slate-300 dark:stroke-slate-700 shadow-sm" />
            <text textAnchor="middle" y="4" className="fill-slate-500 dark:fill-slate-400 font-bold text-[8px]">M. ESQ</text>
            <circle cx="0" cy="-10" r="3" fill="#135bec" />
          </g>
          <g transform="translate(160, 95)">
            <rect x="-15" y="-10" width="30" height="20" rx="4" className="fill-white dark:fill-surface-dark stroke-slate-300 dark:stroke-slate-700 shadow-sm" />
            <text textAnchor="middle" y="4" className="fill-slate-500 dark:fill-slate-400 font-bold text-[8px]">M. DIR</text>
            <circle cx="0" cy="-10" r="3" fill="#135bec" />
          </g>
          {isCrossed ? (
            <><path d="M 40 35 L 160 85" stroke={color} strokeWidth="2" strokeDasharray={isInhibitory ? "4" : "0"} fill="none" /><path d="M 160 35 L 40 85" stroke={color} strokeWidth="2" strokeDasharray={isInhibitory ? "4" : "0"} fill="none" /><text x="100" y="55" textAnchor="middle" fill={color} className="font-bold text-[12px]">{polarity}</text><text x="100" y="75" textAnchor="middle" fill={color} className="font-bold text-[12px]">{polarity}</text></>
          ) : (
            <><path d="M 40 35 L 40 85" stroke={color} strokeWidth="2" strokeDasharray={isInhibitory ? "4" : "0"} fill="none" /><path d="M 160 35 L 160 85" stroke={color} strokeWidth="2" strokeDasharray={isInhibitory ? "4" : "0"} fill="none" /><text x="32" y="60" textAnchor="middle" fill={color} className="font-bold text-[12px]">{polarity}</text><text x="168" y="60" textAnchor="middle" fill={color} className="font-bold text-[12px]">{polarity}</text></>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="pb-32 overflow-y-auto no-scrollbar bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between p-6 pt-10 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => navigate('/settings')}>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all" style={{ backgroundImage: `url('https://picsum.photos/id/64/100/100')` }} />
              <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Cientista Sênior</h2>
              <h1 className="text-xl font-bold leading-tight tracking-tight">Dr. Silva</h1>
            </div>
          </div>
          <button onClick={() => navigate('/settings')} className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </header>

        <section className="px-6 py-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Veículos Simulados com Ícone Aprimorado */}
          <div className="flex items-center gap-4 rounded-3xl p-5 bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5 hover:border-primary/20 transition-all group">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Veículos Simulados</p>
              <p className="text-3xl font-bold tracking-tight">{simulations.length}</p>
            </div>
          </div>

          {/* Status do Laboratório com Ícone Aprimorado */}
          <div className="flex items-center gap-4 rounded-3xl p-5 bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5 hover:border-green-500/20 transition-all group">
            <div className="size-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">database</span>
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Status do Laboratório</p>
              <p className="text-sm font-bold text-green-500 flex items-center gap-1.5 mt-1">
                <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                Operacional
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-4">
          <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div><h2 className="text-lg font-bold tracking-tight">Conexões Neurais</h2><p className="text-xs text-slate-500 dark:text-slate-400">Esquema de ligação sensor-motor</p></div>
              <select value={visVehicle} onChange={(e) => setVisVehicle(e.target.value as VehicleType)} className="bg-slate-100 dark:bg-black/40 border-none rounded-xl px-4 py-2 text-sm font-bold text-primary focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer">
                {Object.values(VehicleType).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            {renderNeuralGraph()}
          </div>
        </section>

        <section className="flex flex-col gap-4 px-6 py-2">
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold tracking-tight">Simulação Ativa</h2><Link to="/history" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Histórico Completo</Link></div>
          <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-md active:scale-[0.99] transition-all cursor-pointer" onClick={() => navigate('/live/alpha', { state: { vehicleType: VehicleType.LOVE } })}>
            <div className="flex flex-col md:flex-row">
              <div className="h-48 md:h-auto md:w-1/2 bg-[#0a0f18] relative overflow-hidden shrink-0">
                <div className="absolute top-4 left-4 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-2 uppercase tracking-widest">
                  <div className="size-1.5 rounded-full bg-green-500 animate-pulse"></div> Live
                </div>
                <img src="https://picsum.photos/id/1/600/300" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
              </div>
              <div className="p-5 md:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-2 group-hover:text-primary transition-colors mb-1">
                  <span className={`material-symbols-outlined ${VEHICLE_DETAILS[VehicleType.LOVE].color}`}>{VEHICLE_DETAILS[VehicleType.LOVE].icon}</span>
                  <h3 className="font-bold text-lg leading-tight">Experimento Alpha: 'Amor'</h3>
                </div>
                <SensorChart data={sensorHistory} />
                <div className="flex gap-2 mt-5">
                  <button onClick={(e) => e.stopPropagation()} className="flex-1 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                    <span className="material-symbols-outlined text-xl">pause_circle</span> Pausar
                  </button>
                  <button onClick={handleShare} className="h-12 px-4 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all active:scale-90" title="Compartilhar Simulação">
                    <span className="material-symbols-outlined text-xl">share</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); navigate('/new'); }} className="h-12 px-4 rounded-xl border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/5 transition-colors">
                    <span className="material-symbols-outlined text-xl">stop_circle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="px-6 flex items-center justify-between mb-4"><h2 className="text-lg font-bold tracking-tight">Recém Executados</h2></div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4">
            {simulations.length > 0 ? simulations.map((sim) => (
              <div key={sim.id} onClick={() => navigate(`/live/${sim.id}`)} className="flex-shrink-0 w-44 md:w-56 flex flex-col gap-3 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-white/5 active:scale-95 transition-all cursor-pointer">
                <div className="h-24 md:h-32 w-full rounded-xl bg-slate-100 dark:bg-black/40 overflow-hidden relative group">
                  <img src={`https://picsum.photos/seed/${sim.id}/300/200`} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1 min-w-0">
                    <span className={`material-symbols-outlined text-sm shrink-0 ${VEHICLE_DETAILS[sim.vehicleType].color}`}>{VEHICLE_DETAILS[sim.vehicleType].icon}</span>
                    <p className="font-bold text-sm truncate leading-tight">{sim.name}</p>
                  </div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-slate-400 font-bold">{sim.timestamp}</span><div className={`size-2 rounded-full ${sim.status === SimulationStatus.COMPLETED ? 'bg-green-500' : 'bg-red-500'}`}></div></div>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-sm px-6">Nenhum histórico encontrado.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
