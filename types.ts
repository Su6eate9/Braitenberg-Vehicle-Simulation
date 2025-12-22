
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
