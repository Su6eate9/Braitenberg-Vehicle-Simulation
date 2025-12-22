
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RECENT_HISTORY, VEHICLE_DETAILS } from '../constants';
import { SimulationStatus, VehicleType, Simulation } from '../types';

const MiniSensorChart: React.FC<{ sim: Simulation }> = ({ sim }) => {
  const points = useMemo(() => {
    const seed = sim.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const generateTrace = (baseValue: number, offset: number) => {
      return Array.from({ length: 20 }, (_, i) => {
        const variance = Math.sin((seed + i + offset) * 0.5) * 15;
        return Math.max(5, Math.min(95, baseValue + variance));
      });
    };
    return {
      l: generateTrace(sim.metrics.sensorL, 0),
      r: generateTrace(sim.metrics.sensorR, 100)
    };
  }, [sim]);

  const width = 200;
  const height = 40;

  const getPointsStr = (data: number[]) => {
    return data.map((val, i) => `${(i / (data.length - 1)) * width},${height - (val / 100) * height}`).join(' ');
  };

  return (
    <div className="w-full h-10 mt-2 relative overflow-hidden bg-slate-50/50 dark:bg-black/10 rounded-lg border border-slate-100 dark:border-white/5">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="#135bec"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={getPointsStr(points.l)}
          className="opacity-70"
        />
        <polyline
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={getPointsStr(points.r)}
          className="opacity-70"
        />
      </svg>
      <div className="absolute top-1 left-2 flex gap-2">
        <div className="flex items-center gap-1">
          <div className="size-1 rounded-full bg-primary"></div>
          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">L</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-1 rounded-full bg-amber-500"></div>
          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">R</span>
        </div>
      </div>
    </div>
  );
};

const History: React.FC = () => {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [dateFilter, setDateFilter] = useState('Todos');
  const [timeFilter, setTimeFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userSims = JSON.parse(localStorage.getItem('userSimulations') || '[]');
    setSimulations([...userSims, ...RECENT_HISTORY]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulations(prevSims => prevSims.map(sim => {
        if (sim.status !== SimulationStatus.RUNNING) return sim;

        const durationMatch = sim.duration.match(/(\d+)m\s*(\d*)s/);
        let totalSeconds = 0;
        if (durationMatch) {
          totalSeconds = parseInt(durationMatch[1]) * 60 + (parseInt(durationMatch[2]) || 0);
        }
        totalSeconds += 1;
        const newDuration = `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;

        const distVal = parseFloat(sim.metrics.distance.replace(/[^\d.]/g, '')) || 0;
        const newDist = (distVal + 0.15 + Math.random() * 0.1).toFixed(1);

        return {
          ...sim,
          duration: newDuration,
          metrics: {
            ...sim.metrics,
            distance: `${newDist} m`,
            sensorL: Math.max(0, Math.min(100, sim.metrics.sensorL + (Math.random() - 0.5) * 12)),
            sensorR: Math.max(0, Math.min(100, sim.metrics.sensorR + (Math.random() - 0.5) * 12)),
          }
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (id.startsWith('db_')) return;
    const userSims = JSON.parse(localStorage.getItem('userSimulations') || '[]');
    const updated = userSims.filter((s: Simulation) => s.id !== id);
    localStorage.setItem('userSimulations', JSON.stringify(updated));
    setSimulations(prev => prev.filter(s => s.id !== id));
  };

  const parseTimestamp = (ts: string) => {
    if (ts.includes(',')) {
      const parts = ts.split(',');
      return { 
        date: parts[0].trim(), 
        time: parts[1].trim() 
      };
    }
    
    if (ts.includes(':')) {
      const parts = ts.split(' ');
      const timePart = parts.find(p => p.includes(':')) || '--:--';
      const datePart = parts.filter(p => !p.includes(':')).join(' ') || ts;
      return { date: datePart, time: timePart };
    }

    return { date: ts, time: '--:--' };
  };

  const handleBack = () => {
    navigate('/');
  };

  const clearFilters = () => {
    setTypeFilter('Todos');
    setStatusFilter('Todos');
    setDateFilter('Todos');
    setTimeFilter('Todos');
    setSearchQuery('');
  };

  const typeOptions = ['Todos', ...Object.values(VehicleType)];
  const statusOptions = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Concluído', value: SimulationStatus.COMPLETED },
    { label: 'Interrompido', value: SimulationStatus.STOPPED },
    { label: 'Pausado', value: SimulationStatus.PAUSED },
    { label: 'Em Execução', value: SimulationStatus.RUNNING }
  ];
  const dateOptions = ['Todos', 'Hoje', 'Esta Semana', 'Este Mês', 'Antigos'];
  const timeOptions = ['Todos', 'Madrugada', 'Manhã', 'Tarde', 'Noite'];

  const filteredSims = simulations.filter(sim => {
    const { date, time } = parseTimestamp(sim.timestamp);
    
    const matchesType = typeFilter === 'Todos' || sim.vehicleType === typeFilter;
    const matchesStatus = statusFilter === 'Todos' || sim.status === statusFilter;
    const matchesSearch = sim.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sim.vehicleType.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Simple Date Filtering Logic
    const matchesDate = (() => {
      if (dateFilter === 'Todos') return true;
      const now = new Date();
      // Mock data handling: "18 Out", "17 Out", etc.
      if (dateFilter === 'Hoje') {
        const today = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        return date.toLowerCase().includes(today.toLowerCase().replace('.', ''));
      }
      if (dateFilter === 'Esta Semana') {
        // Broad match for recent days in Oct/Sep for the mock
        return date.includes('Out') || date.includes('Set'); 
      }
      if (dateFilter === 'Antigos') {
        return !date.includes('Out');
      }
      return true;
    })();

    // Time Filtering Logic
    const matchesTime = (() => {
      if (timeFilter === 'Todos') return true;
      if (!time.includes(':')) return false;
      const hour = parseInt(time.split(':')[0]);
      if (timeFilter === 'Madrugada') return hour >= 0 && hour < 6;
      if (timeFilter === 'Manhã') return hour >= 6 && hour < 12;
      if (timeFilter === 'Tarde') return hour >= 12 && hour < 18;
      if (timeFilter === 'Noite') return hour >= 18 && hour < 24;
      return true;
    })();

    return matchesType && matchesStatus && matchesSearch && matchesDate && matchesTime;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24 scroll-smooth">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-primary transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
             </button>
             <h2 className="text-2xl font-bold tracking-tight">Biblioteca</h2>
          </div>
          <button 
            onClick={clearFilters}
            className="text-xs font-bold text-primary px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all"
          >
            Limpar Filtros
          </button>
        </header>

        <div className="px-4 py-4 md:px-6">
          <div className="relative flex w-full items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou tipo..." 
              className="block w-full rounded-2xl border-none bg-white dark:bg-surface-dark py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none transition-shadow"
            />
          </div>
        </div>

        {/* Scrollable Filters Container */}
        <div className="flex flex-col gap-5 mb-4">
          <div className="space-y-2">
            <div className="px-4 md:px-6"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo</p></div>
            <div className="flex gap-2 overflow-x-auto px-4 md:px-6 pb-1 no-scrollbar">
              {typeOptions.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`flex h-9 shrink-0 items-center justify-center rounded-xl px-4 transition-all text-xs font-bold whitespace-nowrap ${typeFilter === t ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="px-4 md:px-6"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data</p></div>
            <div className="flex gap-2 overflow-x-auto px-4 md:px-6 pb-1 no-scrollbar">
              {dateOptions.map(d => (
                <button key={d} onClick={() => setDateFilter(d)} className={`flex h-9 shrink-0 items-center justify-center rounded-xl px-4 transition-all text-xs font-bold whitespace-nowrap ${dateFilter === d ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300'}`}>{d}</button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="px-4 md:px-6"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Período</p></div>
            <div className="flex gap-2 overflow-x-auto px-4 md:px-6 pb-1 no-scrollbar">
              {timeOptions.map(tm => (
                <button key={tm} onClick={() => setTimeFilter(tm)} className={`flex h-9 shrink-0 items-center justify-center rounded-xl px-4 transition-all text-xs font-bold whitespace-nowrap ${timeFilter === tm ? 'bg-amber-600 text-white shadow-lg' : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300'}`}>{tm}</button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="px-4 md:px-6"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p></div>
            <div className="flex gap-2 overflow-x-auto px-4 md:px-6 pb-1 no-scrollbar">
              {statusOptions.map(opt => (
                <button key={opt.value} onClick={() => setStatusFilter(opt.value)} className={`flex h-9 shrink-0 items-center justify-center rounded-xl px-4 transition-all text-xs font-bold whitespace-nowrap ${statusFilter === opt.value ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300'}`}>{opt.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div ref={resultsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 md:px-6 py-6 scroll-mt-20">
          {filteredSims.length > 0 ? filteredSims.map((sim) => {
            const vDetails = VEHICLE_DETAILS[sim.vehicleType];
            const { date, time } = parseTimestamp(sim.timestamp);
            const isLive = sim.status === SimulationStatus.RUNNING;
            
            return (
              <div 
                key={sim.id} 
                onClick={() => navigate(`/live/${sim.id}`, { state: { vehicleType: sim.vehicleType } })}
                className={`group relative flex flex-col gap-5 rounded-3xl bg-white dark:bg-surface-dark p-6 shadow-sm border active:scale-[0.98] transition-all cursor-pointer hover:shadow-md ${
                  isLive ? 'border-primary/30 ring-1 ring-primary/10' : 'border-slate-100 dark:border-white/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                      sim.status === SimulationStatus.COMPLETED ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 
                      isLive ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                      'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                    }`}>
                      <span className={`material-symbols-outlined text-3xl ${isLive ? 'animate-pulse' : ''}`}>{vDetails.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{sim.name}</h3>
                        {isLive && (
                          <span className="flex size-2 rounded-full bg-primary animate-ping"></span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{sim.vehicleType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!sim.id.startsWith('db_') && !isLive && (
                      <button 
                        onClick={(e) => handleDelete(e, sim.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    )}
                    <div className="p-2 text-primary">
                      <span className={`material-symbols-outlined text-2xl material-symbols-filled ${isLive ? 'text-primary animate-pulse' : ''}`}>
                        {isLive ? 'waves' : 'play_circle'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 h-0 group-hover:h-auto overflow-hidden">
                  <MiniSensorChart sim={sim} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                  <div className="flex flex-col gap-1 border-r border-slate-200 dark:border-white/5 pr-2 last:border-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">calendar_today</span> Data
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-200 truncate">{date}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-r border-slate-200 dark:border-white/5 pr-2 last:border-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">schedule</span> Hora
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-200 truncate">{time}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-r border-slate-200 dark:border-white/5 pr-2 last:border-0">
                    <span className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${isLive ? 'text-primary' : 'text-slate-400'}`}>
                      <span className={`material-symbols-outlined text-[12px] ${isLive ? 'animate-bounce' : ''}`}>route</span> Dist.
                    </span>
                    <span className={`text-xs font-bold font-mono truncate transition-colors ${isLive ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>{sim.metrics.distance}</span>
                  </div>
                  <div className="flex flex-col gap-1 last:border-0">
                    <span className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${isLive ? 'text-primary' : 'text-slate-400'}`}>
                      <span className="material-symbols-outlined text-[12px]">hourglass_empty</span> Dur.
                    </span>
                    <span className={`text-xs font-bold font-mono truncate transition-colors ${isLive ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>{sim.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    sim.status === SimulationStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-500' :
                    isLive ? 'bg-blue-500/10 text-blue-500 shadow-[0_0_10px_rgba(19,91,236,0.2)]' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {sim.status === SimulationStatus.COMPLETED ? 'Concluído' : 
                     isLive ? 'Live: Em Execução' :
                     sim.status === SimulationStatus.PAUSED ? 'Pausado' : 'Interrompido'}
                  </span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {isLive ? 'Monitorar Agora →' : 'Visualizar Detalhes →'}
                  </span>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full py-20 flex flex-col items-center text-slate-400">
               <span className="material-symbols-outlined text-6xl mb-4 opacity-20">history_toggle_off</span>
               <p className="font-bold">Nenhum registro encontrado</p>
               <button onClick={clearFilters} className="mt-4 text-sm text-primary font-bold hover:underline">Redefinir filtros de busca</button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-20 max-w-5xl mx-auto">
        <button onClick={() => navigate('/new')} className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/40 hover:bg-blue-600 transition-transform active:scale-90 border-4 border-white dark:border-background-dark"><span className="material-symbols-outlined text-3xl">add</span></button>
      </div>
    </div>
  );
};

export default History;
