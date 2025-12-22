
export enum SimulationStatus {
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  STOPPED = 'stopped'
}

export enum VehicleType {
  FEAR = '2a: Medo',
  AGGRESSION = '2b: Agressão',
  LOVE = '3a: Amor',
  EXPLORER = '3b: Explorador'
}

export interface Simulation {
  id: string;
  // Added optional userId to allow simulations to be associated with specific researchers
  userId?: string;
  name: string;
  vehicleType: VehicleType;
  status: SimulationStatus;
  timestamp: string;
  duration: string;
  speed: string;
  metrics: {
    distance: string;
    avgSpeed: string;
    sensorL: number;
    sensorR: number;
  };
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  requirement: number;
  current: number;
  isCompleted: boolean;
  reward: string;
  category: 'distance' | 'time' | 'count';
}

export interface UserProgress {
  unlockedThemes: string[];
  activeTheme: string;
  missions: Mission[];
  xp: number;
}
