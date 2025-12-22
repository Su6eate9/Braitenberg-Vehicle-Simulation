
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RECENT_HISTORY, VEHICLE_DETAILS } from '../constants';
import { SimulationStatus, VehicleType, Simulation } from '../types';

const MiniSensorChart: React.FC<{ sim: Simulation }> = ({ sim }) => {
  const [tick, setTick] = useState(0);
  const isRunning = sim.status === SimulationStatus.RUNNING;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  const points = useMemo(() => {
    const seed = sim.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const generateTrace = (baseValue: number, offset: number) => {
      return Array.from({ length: 24 }, (_, i) => {
        const timeOffset = isRunning ? tick * 0.2 : 0;
        const variance = Math.sin((seed + i + offset + timeOffset) * 0.4) * 12;
        const noise = (Math.random() - 0.5) * 2;
        return Math.max(10, Math.min(90, baseValue + variance + noise));
      });
    };
    return { l: generateTrace(sim.metrics.sensorL, 0), r: generateTrace(sim.metrics.sensorR, 100) };
  }, [sim.id, sim.metrics.sensorL, sim.metrics.sensorR, isRunning, tick]);

  const width = 240;
  const height = 48;
  const getPointsStr = (data: number[]) => data.map((val, i) => `${(i / (data.length - 1)) * width},${height - (val / 100) * height}`).join(' ');

  return (
    <div className="w-full mt-3 p-3 bg-slate-50/80 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden relative group/chart">
      <div className="h-10 relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <polyline fill="none" stroke="#135bec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={getPointsStr(points.l)} className="opacity-80" />
          <polyline fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={getPointsStr(points.r)} className="opacity-80" />
        </svg>
      </div>
    </div>
  );
};

const History: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const userSims = JSON.parse(localStorage.getItem('userSimulations') || '[]');
    setSimulations([...userSims, ...RECENT_HISTORY]);
  }, []);

  const handleExport = (e: React.MouseEvent, sim: Simulation) => {
    e.stopPropagation();
    const data = `id,name,type,distance,duration\n${sim.id},${sim.name},${sim.vehicleType},${sim.metrics.distance},${sim.duration}`;
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetria_${sim.id}.csv`;
    a.click();
  };

  const performDelete = () => {
    if (!deleteConfirmId) return;
    const userSims = JSON.parse(localStorage.getItem('userSimulations') || '[]');
    const updated = userSims.filter((s: Simulation) => s.id !== deleteConfirmId);
    localStorage.setItem('userSimulations', JSON.stringify(updated));
    setSimulations(prev => prev.filter(s => s.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  const filteredSims = simulations.filter(sim => 
    sim.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sim.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32">
      <div className="max-w-7xl mx-auto w-full px-6 pt-10">
        <header className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-primary"><span className="material-symbols-outlined">arrow_back</span></button>
              <h2 className="text-3xl font-bold">Log Científico</h2>
           </div>
           <div className="relative w-full max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Pesquisar..." className="w-full bg-white dark:bg-surface-dark border-none rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary shadow-sm" />
           </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSims.map((sim) => {
            const vDetails = VEHICLE_DETAILS[sim.vehicleType];
            const isLive = sim.status === SimulationStatus.RUNNING;
            return (
              <div key={sim.id} onClick={() => navigate(`/live/${sim.id}`)} className="group bg-white dark:bg-surface-dark p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-slate-100 dark:bg-black/20 flex items-center justify-center">
                       <span className={`material-symbols-outlined text-2xl ${vDetails.color}`}>{vDetails.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{sim.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sim.vehicleType}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={(e) => handleExport(e, sim)} className="p-2 text-slate-300 hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">download</span></button>
                    {!sim.id.startsWith('db_') && <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(sim.id); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-black/20 text-xs">
                   <div className="flex flex-col gap-0.5"><span className="text-slate-400 font-bold uppercase text-[8px]">Distância</span><span className="font-mono font-bold">{sim.metrics.distance}</span></div>
                   <div className="flex flex-col gap-0.5"><span className="text-slate-400 font-bold uppercase text-[8px]">Duração</span><span className="font-mono font-bold">{sim.duration}</span></div>
                </div>

                <MiniSensorChart sim={sim} />

                <div className="flex items-center justify-between mt-auto">
                   <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-lg ${isLive ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>{isLive ? 'Em Tempo Real' : 'Finalizado'}</span>
                   <span className="text-[10px] text-slate-400 font-bold">{sim.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-[2.5rem] p-8 text-center animate-in zoom-in-95">
            <span className="material-symbols-outlined text-red-500 text-5xl mb-4">warning</span>
            <h3 className="text-xl font-bold mb-2">Excluir Registro?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Esta ação removerá permanentemente os dados desta simulação do laboratório.</p>
            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setDeleteConfirmId(null)} className="py-4 rounded-2xl bg-slate-100 dark:bg-white/5 font-bold">Cancelar</button>
               <button onClick={performDelete} className="py-4 rounded-2xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/20">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
