
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { VehicleType, SimulationStatus, Simulation } from '../types';

const SimulationLive: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const vehicleType = (location.state?.vehicleType as VehicleType) || VehicleType.LOVE;
  const simName = (location.state?.simName as string) || `Exp. ${vehicleType.split(': ')[1]}`;
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [neuralGain, setNeuralGain] = useState(location.state?.gain || 2.5);
  const [simSpeed, setSimSpeed] = useState(1.0); // Simulation speed multiplier
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  
  const [pos, setPos] = useState({ x: 50, y: 70 });
  const [angle, setAngle] = useState(-Math.PI / 2);
  const [lightPos, setLightPos] = useState({ x: 50, y: 30 });
  const [sensorValues, setSensorValues] = useState({ l: 0, r: 0 });

  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(null);

  const sensorDistance = 4;
  const sensorAngle = 0.5;
  const wheelbase = 5;

  const handleBack = () => {
    navigate('/');
  };

  const savePreferences = () => {
    setIsSavingPrefs(true);
    const prefs = {
      neuralGain,
      simSpeed,
      vehicleType
    };
    localStorage.setItem('braitenberg_prefs', JSON.stringify(prefs));
    
    setTimeout(() => {
      setIsSavingPrefs(false);
    }, 2000);
  };

  const saveSimulation = () => {
    const durationSeconds = Math.floor(elapsedTime / 1000);
    const durationStr = `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`;
    const newSim: Simulation = {
      id: `user_sim_${Date.now()}`,
      name: simName,
      vehicleType,
      status: SimulationStatus.COMPLETED,
      timestamp: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      duration: durationStr,
      speed: `${(distance / (durationSeconds || 1)).toFixed(1)} m/s`,
      metrics: { distance: `${distance.toFixed(1)} m`, avgSpeed: `${(distance / (durationSeconds || 1)).toFixed(1)} m/s`, sensorL: sensorValues.l, sensorR: sensorValues.r }
    };
    const saved = JSON.parse(localStorage.getItem('userSimulations') || '[]');
    localStorage.setItem('userSimulations', JSON.stringify([newSim, ...saved]));
    navigate('/history');
  };

  const updateSimulation = (time: number) => {
    if (lastTimeRef.current !== undefined && isPlaying) {
      const rawDeltaTime = time - lastTimeRef.current;
      const deltaTime = (rawDeltaTime / 1000) * simSpeed;
      setElapsedTime(prev => prev + (rawDeltaTime * simSpeed));

      const slX = pos.x + Math.cos(angle - sensorAngle) * sensorDistance;
      const slY = pos.y + Math.sin(angle - sensorAngle) * sensorDistance;
      const srX = pos.x + Math.cos(angle + sensorAngle) * sensorDistance;
      const srY = pos.y + Math.sin(angle + sensorAngle) * sensorDistance;

      const distL = Math.max(1, Math.sqrt((slX - lightPos.x) ** 2 + (slY - lightPos.y) ** 2));
      const distR = Math.max(1, Math.sqrt((srX - lightPos.x) ** 2 + (srY - lightPos.y) ** 2));
      const intensityL = 1000 / (distL * distL);
      const intensityR = 1000 / (distR * distR);
      setSensorValues({ l: Math.min(100, intensityL * 10), r: Math.min(100, intensityR * 10) });

      let wheelL = 0.5, wheelR = 0.5;
      const gainFactor = 0.2 * neuralGain;

      switch(vehicleType) {
        case VehicleType.FEAR: wheelL += intensityL * gainFactor; wheelR += intensityR * gainFactor; break;
        case VehicleType.AGGRESSION: wheelL += intensityR * gainFactor; wheelR += intensityL * gainFactor; break;
        case VehicleType.LOVE: wheelL = Math.max(0.1, 2 - intensityR * gainFactor); wheelR = Math.max(0.1, 2 - intensityL * gainFactor); break;
        case VehicleType.EXPLORER: wheelL = Math.max(0.1, 2 - intensityL * gainFactor); wheelR = Math.max(0.1, 2 - intensityR * gainFactor); break;
      }

      const v = (wheelL + wheelR) / 2, w = (wheelR - wheelL) / wheelbase;
      const moveScale = 1.0 * simSpeed;
      const nextAngle = angle + w * moveScale;
      const stepX = v * Math.cos(nextAngle) * moveScale;
      const stepY = v * Math.sin(nextAngle) * moveScale;

      const nextX = pos.x + stepX;
      const nextY = pos.y + stepY;

      setDistance(prev => prev + Math.sqrt(stepX * stepX + stepY * stepY));
      setPos({ x: nextX < 0 ? 100 : (nextX > 100 ? 0 : nextX), y: nextY < 0 ? 100 : (nextY > 100 ? 0 : nextY) });
      setAngle(nextAngle);
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(updateSimulation);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateSimulation);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, pos, angle, lightPos, neuralGain, simSpeed]);

  const formattedTime = () => {
    const s = Math.floor(elapsedTime / 1000), m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex items-center px-4 py-4 pt-12 pb-2 justify-between bg-background-light dark:bg-background-dark sticky top-0 z-20">
          <button onClick={handleBack} className="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition"><span className="material-symbols-outlined">arrow_back</span></button>
          <div className="flex flex-col items-center text-center px-2">
            <h2 className="text-lg font-bold leading-tight tracking-tight max-w-[180px] truncate">{simName}</h2>
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{isPlaying ? 'Em Execução' : 'Pausado'}</span>
          </div>
          <button onClick={saveSimulation} className="flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-white shadow-lg hover:bg-primary/90 transition"><span className="text-sm font-bold">Salvar</span></button>
        </div>

        <main className="flex-1 flex flex-col lg:flex-row px-4 gap-6 overflow-y-auto pb-44 lg:pb-12 pt-4 no-scrollbar">
          <div className="lg:flex-[2] flex flex-col gap-4">
            <div onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setLightPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 }); }} className="w-full aspect-[4/5] sm:aspect-video bg-[#0a0f18] rounded-3xl relative overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 cursor-crosshair">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#135bec 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
              <div className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none" style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%` }}>
                <div className="size-10 bg-yellow-400 rounded-full blur-md animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center"><span className="material-symbols-outlined text-white text-2xl">light_mode</span></div>
              </div>
              <div className="absolute transition-all duration-75 ease-linear" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, -50%) rotate(${angle + Math.PI/2}rad)` }}>
                <div className="w-14 h-16 bg-surface-dark rounded-2xl flex flex-col items-center justify-center shadow-[0_0_25px_rgba(19,91,236,0.4)] border border-white/10 overflow-hidden"><span className="material-symbols-outlined text-primary text-3xl">smart_toy</span></div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-widest px-4 py-2 rounded-full">TEMPO: {formattedTime()} {simSpeed !== 1 && <span className="text-primary ml-2">{simSpeed.toFixed(1)}x</span>}</div>
            </div>
          </div>

          <div className="lg:flex-1 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 shadow-sm"><div className="size-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">route</span></div><div className="flex flex-col min-w-0"><span className="text-[10px] text-slate-500 font-bold uppercase">Distância</span><span className="text-sm font-bold truncate">{distance.toFixed(1)} m</span></div></div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 shadow-sm"><div className="size-10 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><span className="material-symbols-outlined">speed</span></div><div className="flex flex-col min-w-0"><span className="text-[10px] text-slate-500 font-bold uppercase">V. Média</span><span className="text-sm font-bold truncate">{(distance / (elapsedTime / 1000 || 1)).toFixed(1)} m/s</span></div></div>
            </div>
            
            {/* Speed Control */}
            <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between"><p className="text-sm font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary text-xl">fast_forward</span>Velocidade</p><div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-xs font-mono font-bold">{simSpeed.toFixed(1)}x</div></div>
              <input type="range" min="0.1" max="5.0" step="0.1" value={simSpeed} onChange={(e) => setSimSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
            </div>

            {/* Gain Control */}
            <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between"><p className="text-sm font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary text-xl">settings_input_component</span>Ganho Neural</p><div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-xs font-mono font-bold">{neuralGain.toFixed(1)}x</div></div>
              <input type="range" min="0.5" max="5" step="0.1" value={neuralGain} onChange={(e) => setNeuralGain(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
            </div>

            {/* NEW: Save Settings Preference */}
            <button 
              onClick={savePreferences}
              className={`w-full py-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95 ${
                isSavingPrefs 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : 'bg-white dark:bg-surface-dark border-primary/20 text-primary hover:bg-primary/5 dark:hover:bg-primary/10'
              }`}
            >
              <span className="material-symbols-outlined">
                {isSavingPrefs ? 'check_circle' : 'save_as'}
              </span>
              {isSavingPrefs ? 'Preferências Salvas!' : 'Salvar Parâmetros Padrão'}
            </button>
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 pb-12 bg-white/80 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 z-30">
        <div className="flex items-center justify-between max-w-lg mx-auto px-6">
          <button onClick={() => { setPos({x:50, y:70}); setAngle(-Math.PI/2); setDistance(0); setElapsedTime(0); }} className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"><div className="size-12 rounded-full bg-slate-100 dark:bg-surface-dark border flex items-center justify-center text-slate-700 dark:text-white hover:bg-primary/10 transition-colors"><span className="material-symbols-outlined">restart_alt</span></div><span className="text-[10px] font-bold text-slate-500 uppercase">Reset</span></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="flex flex-col items-center group -mt-10 gap-2"><div className={`size-20 p-5 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ring-8 ring-white dark:ring-background-dark hover:scale-105 active:scale-95 ${isPlaying ? 'bg-primary shadow-primary/40' : 'bg-emerald-600 animate-pulse'}`}><span className="material-symbols-outlined text-5xl">{isPlaying ? 'pause' : 'play_arrow'}</span></div><span className={`text-[10px] font-bold uppercase transition-colors ${isPlaying ? 'text-primary' : 'text-emerald-600'}`}>{isPlaying ? 'Pausar' : 'Continuar'}</span></button>
          <button onClick={() => navigate('/new')} className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"><div className="size-12 rounded-full bg-slate-100 dark:bg-surface-dark border flex items-center justify-center text-slate-700 dark:text-white hover:bg-primary/10 transition-colors"><span className="material-symbols-outlined">tune</span></div><span className="text-[10px] font-bold text-slate-500 uppercase">Config</span></button>
        </div>
      </div>
    </div>
  );
};

export default SimulationLive;
