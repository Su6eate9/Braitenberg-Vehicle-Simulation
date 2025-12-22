
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VEHICLE_DETAILS } from '../constants';
import { VehicleType } from '../types';

const NewSimulation: React.FC = () => {
  const navigate = useNavigate();
  
  // Load saved preferences from localStorage
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
        return parsed.neuralGain || 2.5;
      } catch (e) {}
    }
    return 2.5;
  });

  const [speed, setSpeed] = useState(80);
  const [simName, setSimName] = useState('');

  // Update default name when vehicle changes, if user hasn't typed much yet
  useEffect(() => {
    const vehicleLabel = selectedVehicle.split(': ')[1];
    setSimName(`Exp. ${vehicleLabel}`);
  }, [selectedVehicle]);

  const vehicleTypes = Object.entries(VEHICLE_DETAILS);

  const handleBack = () => {
    // Garantir retorno para o Dashboard de forma direta e segura
    navigate('/');
  };

  const handleReset = () => {
    setSelectedVehicle(VehicleType.LOVE);
    setGain(2.5);
    setSpeed(80);
    setSimName('Exp. Amor');
  };

  const startSimulation = () => {
    navigate('/live/new-sim', { 
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
              title="Voltar"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            
            <h2 className="text-lg font-bold tracking-tight">Nova Simulação</h2>
            
            <button 
              onClick={handleReset} 
              className="px-3 py-1.5 text-primary hover:bg-primary/10 rounded-lg text-sm font-bold active:scale-95 transition-all"
            >
              Resetar
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col gap-6 pt-6 px-4 md:px-8">
          {/* Simulation Name Input */}
          <section className="w-full">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">
              Nome do Experimento
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">edit_note</span>
              </div>
              <input 
                type="text" 
                value={simName}
                onChange={(e) => setSimName(e.target.value)}
                placeholder="Ex: Teste de Colisão A"
                className="w-full bg-white dark:bg-surface-dark border-2 border-slate-100 dark:border-white/5 rounded-2xl h-14 pl-12 pr-4 text-lg font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vehicle Selection Section */}
            <section className="lg:col-span-2">
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-2xl font-bold tracking-tight">Tipo de Veículo</h3>
                <span className="text-sm text-primary font-medium">
                  {Object.keys(VehicleType).indexOf(Object.keys(VehicleType).find(k => (VehicleType as any)[k] === selectedVehicle) || '') + 1} de 4
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-4 pb-2">
                {vehicleTypes.map(([type, details]) => (
                  <div
                    key={type}
                    onClick={() => setSelectedVehicle(type as VehicleType)}
                    className={`flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                      selectedVehicle === type 
                        ? 'border-primary bg-white dark:bg-surface-dark shadow-lg shadow-primary/10' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark opacity-60 hover:opacity-100'
                    }`}
                  >
                    {selectedVehicle === type && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-sm animate-in zoom-in duration-300">
                        <span className="material-symbols-outlined text-white text-sm font-bold block">check</span>
                      </div>
                    )}
                    <div className="w-full aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <span className={`material-symbols-outlined text-4xl ${details.color}`}>{details.icon}</span>
                    </div>
                    <div>
                      <p className={`font-bold text-base leading-normal transition-colors ${selectedVehicle === type ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{type}</p>
                      <p className="text-slate-500 dark:text-[#9da6b9] text-[10px] leading-tight mt-1 h-8 line-clamp-2">{details.description}</p>
                      <p className="text-[10px] text-primary/70 font-bold uppercase mt-2">{details.connections}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Parameters Section */}
            <section className="lg:col-span-1">
              <h3 className="text-2xl font-bold tracking-tight mb-4">Configurações</h3>
              <div className="flex flex-col gap-6 bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">sensors</span>
                      Sensibilidade
                    </label>
                    <div className="bg-primary/10 px-3 py-1 rounded-full text-primary font-mono font-bold text-xs">{gain.toFixed(1)}</div>
                  </div>
                  <input 
                    type="range" min="0.5" max="5" step="0.1" value={gain} 
                    onChange={(e) => setGain(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-700 w-full"></div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">speed</span>
                      Potência
                    </label>
                    <div className="bg-primary/10 px-3 py-1 rounded-full text-primary font-mono font-bold text-xs">{speed}%</div>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={speed} 
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-dashed border-slate-300 dark:border-slate-600">
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    "Os parâmetros neurais definem como o veículo reagirá à luz e obstáculos no ambiente simulado."
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 w-full p-4 pb-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-5xl mx-auto w-full">
          <button 
            onClick={startSimulation}
            className="w-full bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <span>Iniciar Simulação</span>
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default NewSimulation;
