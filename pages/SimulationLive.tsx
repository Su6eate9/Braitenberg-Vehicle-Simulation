import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VehicleType, SimulationStatus, Simulation } from '../types';
import { VEHICLE_DETAILS } from '../constants';

const SimulationLive: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const vehicleType = (location.state?.vehicleType as VehicleType) || VehicleType.LOVE;
  const simName = (location.state?.simName as string) || `P3: ${vehicleType.split(': ')[1]}`;
  const configGain = (location.state?.gain as number) || 2.5;
  const configSpeed = (location.state?.speed as number) || 80;
  
  const vDetails = (VEHICLE_DETAILS as any)[vehicleType];
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [angle, setAngle] = useState(-Math.PI / 2);
  const [lightPos, setLightPos] = useState({ x: 50, y: 20 });
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sensorValues, setSensorValues] = useState({ l: 0, r: 0 });
  const [motorValues, setMotorValues] = useState({ l: 0, r: 0 });
  
  const lastTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);

  const updateSimulation = useCallback((time: number) => {
    if (lastTimeRef.current !== 0 && isPlaying) {
      const dt = (time - lastTimeRef.current) / 1000;
      setElapsedTime(prev => prev + (time - lastTimeRef.current));
      
      const sensorOffset = 6;
      const wheelBase = 6;
      
      // 1. SENSORES COM ÂNGULO MAIOR PARA CAPTAR MAIS ASSIMETRIA
      const getSensorPos = (side: 'l' | 'r') => {
        const baseAngle = vehicleType === VehicleType.FEAR ? angle + Math.PI : angle;
        // MUDOU: ângulo aumentado de 0.6 para 0.9 radianos (~51°)
        const sideAngle = side === 'l' ? baseAngle - 0.9 : baseAngle + 0.9;
        return {
          x: pos.x + Math.cos(sideAngle) * sensorOffset,
          y: pos.y + Math.sin(sideAngle) * sensorOffset
        };
      };

      const sLPos = getSensorPos('l');
      const sRPos = getSensorPos('r');

      // 2. Intensidade Luminosa
      const getIntensity = (sPos: {x: number, y: number}) => {
        const dx = lightPos.x - sPos.x;
        const dy = lightPos.y - sPos.y;
        const distSq = dx*dx + dy*dy;
        return Math.min(100, 4000 / Math.max(20, distSq));
      };

      const sL = getIntensity(sLPos);
      const sR = getIntensity(sRPos);
      setSensorValues({ l: sL, r: sR });

      // 3. CONTROLE MOTOR - RESPOSTA NÃO-LINEAR PARA AMPLIFICAR ASSIMETRIA
      const baseV = configSpeed / 10;
      const gain = configGain * 0.6;  // Aumentado de 0.5 para 0.6
      
      let mL = baseV;
      let mR = baseV;

      switch(vehicleType) {
        case VehicleType.FEAR:
          // Fuga com sensores traseiros
          mL = baseV + sL * gain * 1.2;
          mR = baseV + sR * gain * 1.2;
          break;
          
        case VehicleType.AGGRESSION:
          // CORREÇÃO CRÍTICA: Amplificar DIFERENÇA entre sensores
          const diffAgg = Math.abs(sL - sR);
          const avgAgg = (sL + sR) / 2;
          
          // Se sensores muito similares (luz centralizada), adicionar perturbação
          const perturbAgg = diffAgg < 5 ? 0.1 * (Math.random() - 0.5) : 0;
          
          // Resposta não-linear: quanto maior a assimetria, mais agressivo
          const amplifier = 1 + (diffAgg / 10);
          
          mL = baseV + (sR + perturbAgg) * gain * 3.0 * amplifier;
          mR = baseV + (sL - perturbAgg) * gain * 3.0 * amplifier;
          break;
          
        case VehicleType.LOVE:
          // CORREÇÃO: Inibição assimétrica mais pronunciada
          const diffLove = Math.abs(sL - sR);
          
          // Quando detecta luz, reduz velocidade mas mantém diferencial
          const inhibition = 0.5;
          const asymmetry = 0.3; // Fator de assimetria aumentado
          
          mL = Math.max(1.0, baseV - sL * gain * inhibition - (sL - sR) * gain * asymmetry);
          mR = Math.max(1.0, baseV - sR * gain * inhibition - (sR - sL) * gain * asymmetry);
          break;
          
        case VehicleType.EXPLORER:
          // CORREÇÃO: Órbita requer diferencial CONSTANTE
          const avgExp = (sL + sR) / 2;
          const diffExp = sR - sL;
          
          // Base de movimento orbital
          const orbitalBase = 3.0;
          
          // Quanto mais luz detecta, mais forte a órbita
          const orbitalStrength = avgExp * 0.02;
          
          // Inibição contralateral com amplificação da diferença
          mL = Math.max(orbitalBase, baseV - sR * gain * 0.3 + diffExp * gain * 0.4);
          mR = Math.max(orbitalBase, baseV - sL * gain * 0.3 - diffExp * gain * 0.4);
          break;
      }
      
      setMotorValues({ l: mL, r: mR });

      // 4. Cinemática
      const v = (mL + mR) / 2;
      const omega = (mR - mL) / wheelBase;

      const newAngle = angle + omega * dt * 18;
      const newX = pos.x + Math.cos(newAngle) * v * dt * 25;
      const newY = pos.y + Math.sin(newAngle) * v * dt * 25;

      setAngle(newAngle);
      setPos({
        x: Math.max(5, Math.min(95, newX)),
        y: Math.max(5, Math.min(95, newY))
      });
      setDistance(prev => prev + v * dt * 8);
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(updateSimulation);
  }, [isPlaying, lightPos, pos, angle, vehicleType, configGain, configSpeed]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateSimulation);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [updateSimulation]);

  const handleLightMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const relX = ((x - rect.left) / rect.width) * 100;
    const relY = ((y - rect.top) / rect.height) * 100;
    setLightPos({ x: Math.max(0, Math.min(100, relX)), y: Math.max(0, Math.min(100, relY)) });
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden">
      <header className="px-6 py-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-white dark:bg-surface-dark z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-primary">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="font-bold text-base leading-tight">{simName}</h2>
            <div className="flex gap-2 items-center mt-0.5">
               <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{vehicleType}</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span className="text-[9px] text-primary font-mono">{configGain}mV/lx</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsPlaying(!isPlaying)} className={`p-2 rounded-xl border transition-all ${isPlaying ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
            <span className="material-symbols-outlined text-xl">{isPlaying ? 'pause' : 'play_arrow'}</span>
          </button>
          <button onClick={() => navigate('/history')} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/20">
            Finalizar
          </button>
        </div>
      </header>

      <div className="h-[55vh] relative bg-slate-950 overflow-hidden cursor-crosshair touch-none border-b border-white/10" onMouseMove={handleLightMove} onTouchMove={handleLightMove}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="absolute pointer-events-none" style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}>
           <div className="size-20 bg-amber-400/10 blur-2xl rounded-full animate-pulse"></div>
           <div className="size-10 bg-amber-400 rounded-full shadow-[0_0_40px_#fbbf24] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">wb_sunny</span>
           </div>
           <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-amber-500 whitespace-nowrap">FONTE_ATIVA_ESTIMULO</div>
        </div>

        <div className="absolute transition-all duration-100 ease-linear" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, -50%) rotate(${angle + Math.PI/2}rad)` }}>
           <div className="relative">
              <div className="w-10 h-12 bg-slate-800 rounded-lg border-2 border-white/20 shadow-2xl flex flex-col items-center justify-center pt-1">
                 <div className="flex gap-4 mb-2">
                    <div className={`w-1 h-1 rounded-full ${sensorValues.l > 20 ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
                    <div className={`w-1 h-1 rounded-full ${sensorValues.r > 20 ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
                 </div>
                 <span className={`material-symbols-outlined text-xl ${vDetails.color}`}>smart_toy</span>
              </div>
              <div className="absolute -bottom-3 left-0 right-0 flex justify-center gap-3 opacity-60">
                <div className="w-1.5 bg-primary rounded-full transition-all" style={{ height: `${motorValues.l * 3}px` }}></div>
                <div className="w-1.5 bg-amber-500 rounded-full transition-all" style={{ height: `${motorValues.r * 3}px` }}></div>
              </div>
           </div>
        </div>
      </div>

      <main className="flex-1 bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Relatório Cinético</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500">Deslocamento</span>
                <span className="text-2xl font-bold font-mono text-primary">{distance.toFixed(2)}<span className="text-xs ml-1 font-sans">m</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500">Amostragem</span>
                <span className="text-2xl font-bold font-mono text-emerald-500">{Math.floor(elapsedTime/1000)}<span className="text-xs ml-1 font-sans">s</span></span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-sm lg:col-span-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Monitoramento Sináptico</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono"><span>S_L (Sensor Esquerdo)</span><span>{sensorValues.l.toFixed(1)}%</span></div>
                  <div className="h-1.5 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${sensorValues.l}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono"><span>M_L (Motor Esquerdo)</span><span>{motorValues.l.toFixed(2)} PWM</span></div>
                  <div className="h-1.5 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/50" style={{ width: `${Math.min(100, motorValues.l * 10)}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono"><span>S_R (Sensor Direito)</span><span>{sensorValues.r.toFixed(1)}%</span></div>
                  <div className="h-1.5 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${sensorValues.r}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono"><span>M_R (Motor Direito)</span><span>{motorValues.r.toFixed(2)} PWM</span></div>
                  <div className="h-1.5 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500/50" style={{ width: `${Math.min(100, motorValues.r * 10)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 shadow-sm md:col-span-2 lg:col-span-1">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Padrão Bio-Observado</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">biotech</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold leading-tight">{vDetails.bioParallel}</p>
                <p className="text-[10px] text-slate-500 mt-1">Análogo Biológico</p>
              </div>
            </div>
            <div className="bg-white/50 dark:bg-black/30 p-4 rounded-2xl border border-primary/10">
              <p className="text-[9px] font-bold text-primary mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">info</span> NOTA TÉCNICA
              </p>
              <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400">
                {vehicleType === VehicleType.FEAR 
                  ? "Sensores traseiros + conexões ipsilaterais excitatórias geram comportamento emergente de fuga, análogo a fotofobia em organismos simples."
                  : "A resposta emergente demonstra o processamento sensorial bruto influenciando diretamente o torque motor, dispensando lógica centralizada."
                }
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimulationLive;