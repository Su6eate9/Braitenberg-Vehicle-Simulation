
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VEHICLE_DETAILS } from '../constants';
import { VehicleType } from '../types';

const NewSimulation: React.FC = () => {
  const navigate = useNavigate();
  
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(() => {
    const saved = localStorage.getItem('braitenberg_prefs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.vehicleType as VehicleType;
      } catch (e) {}
    }
    return VehicleType.LOVE;
  });

  const [gain, setGain] = useState(() => {
    const saved = localStorage.getItem('braitenberg_prefs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.neuralGain || 3.0;
      } catch (e) {}
    }
    return 3.0;
  });

  const [speed, setSpeed] = useState(60);
  const [simName, setSimName] = useState('');

  useEffect(() => {
    const vehicleLabel = selectedVehicle.split(': ')[1];
    setSimName(`P3: Exp. ${vehicleLabel}`);
  }, [selectedVehicle]);

  const vehicleTypes = Object.entries(VEHICLE_DETAILS);

  const handleBack = () => {
    navigate('/');
  };

  const handleReset = () => {
    setSelectedVehicle(VehicleType.LOVE);
    setGain(3.0);
    setSpeed(60);
    setSimName('P3: Exp. Amor');
  };

  const startSimulation = () => {
    navigate(`/live/new-sim`, { 
      state: { 
        vehicleType: selectedVehicle,
        gain,
        speed,
        simName: simName || 'Nova Simulação'
      } 
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        <header className="sticky top-0 z-40 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-4 justify-between h-16 max-w-5xl mx-auto w-full">
            <button 
              onClick={handleBack} 
              className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-surface-dark active:scale-90 transition-all text-slate-700 dark:text-white"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="text-lg font-bold tracking-tight">Configuração Experimental</h2>
            <button onClick={handleReset} className="px-3 py-1.5 text-primary hover:bg-primary/10 rounded-lg text-sm font-bold">
              Resetar
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col gap-6 pt-6 px-4 md:px-8">
          <section className="w-full">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Protocolo de Pesquisa</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">science</span>
              <input 
                type="text" 
                value={simName}
                onChange={(e) => setSimName(e.target.value)}
                className="w-full bg-white dark:bg-surface-dark border-2 border-slate-100 dark:border-white/5 rounded-2xl h-14 pl-12 pr-4 text-lg font-bold focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2">
              <h3 className="text-2xl font-bold tracking-tight mb-4">Arquitetura Neural</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicleTypes.map(([type, details]) => (
                  <div
                    key={type}
                    onClick={() => setSelectedVehicle(type as VehicleType)}
                    className={`flex flex-col gap-3 p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                      selectedVehicle === type 
                        ? 'border-primary bg-primary/5 shadow-lg' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`material-symbols-outlined text-4xl ${details.color}`}>{details.icon}</span>
                      {selectedVehicle === type && <span className="material-symbols-outlined text-primary">check_circle</span>}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{type}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">{details.law}</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{details.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="lg:col-span-1">
              <h3 className="text-2xl font-bold tracking-tight mb-4">Instrumentação de Hardware</h3>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">sensors</span>
                      Sensibilidade do Sensor
                    </label>
                    <span className="bg-primary/10 px-2 py-1 rounded text-primary font-mono text-xs font-bold">{gain.toFixed(1)} <span className="text-[9px] opacity-70">mV/lx</span></span>
                  </div>
                  <input type="range" min="0.5" max="10" step="0.5" value={gain} onChange={(e) => setGain(parseFloat(e.target.value))} className="w-full h-2 accent-primary" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">settings_input_component</span>
                      Potência dos Motores
                    </label>
                    <span className="bg-primary/10 px-2 py-1 rounded text-primary font-mono text-xs font-bold">{speed} <span className="text-[9px] opacity-70">PWM%</span></span>
                  </div>
                  <input type="range" min="10" max="100" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-full h-2 accent-primary" />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-dashed border-slate-300 dark:border-slate-600 text-[10px] text-slate-500 leading-relaxed italic">
                  A calibração em mV/lx define o ganho dos foto-resistores. Valores altos aumentam a reatividade em baixas luminosidades.
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 w-full p-4 pb-8 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-5xl mx-auto">
          <button onClick={startSimulation} className="w-full bg-primary hover:bg-blue-600 text-white font-bold text-lg py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3">
            <span>Iniciar Laboratório em Tempo Real</span>
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default NewSimulation;
