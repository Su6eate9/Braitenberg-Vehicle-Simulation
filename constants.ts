
import { SimulationStatus, VehicleType, Simulation } from './types';

export const MOCK_DATABASE: Simulation[] = [
  {
    id: 'db_1',
    name: 'Projeto Orion: Alpha',
    vehicleType: VehicleType.LOVE,
    status: SimulationStatus.COMPLETED,
    timestamp: '18 Out, 10:20',
    duration: '12m 45s',
    speed: '1.1 m/s',
    metrics: { distance: '841.5 m', avgSpeed: '1.1 m/s', sensorL: 12, sensorR: 15 }
  },
  {
    id: 'db_2',
    name: 'Neural Stress Test',
    vehicleType: VehicleType.FEAR,
    status: SimulationStatus.STOPPED,
    timestamp: '17 Out, 16:45',
    duration: '0m 42s',
    speed: '4.8 m/s',
    metrics: { distance: '201.6 m', avgSpeed: '4.8 m/s', sensorL: 95, sensorR: 98 }
  },
  {
    id: 'db_3',
    name: 'Estudo de Agregação',
    vehicleType: VehicleType.AGGRESSION,
    status: SimulationStatus.COMPLETED,
    timestamp: '15 Out, 09:00',
    duration: '5m 12s',
    speed: '3.2 m/s',
    metrics: { distance: '998.4 m', avgSpeed: '3.2 m/s', sensorL: 70, sensorR: 85 }
  },
  {
    id: 'db_4',
    name: 'Curiosidade Sintética',
    vehicleType: VehicleType.EXPLORER,
    status: SimulationStatus.COMPLETED,
    timestamp: '14 Out, 21:30',
    duration: '25m 00s',
    speed: '0.8 m/s',
    metrics: { distance: '1200 m', avgSpeed: '0.8 m/s', sensorL: 45, sensorR: 42 }
  },
  {
    id: 'db_5',
    name: 'Lab Test: Reflex 09',
    vehicleType: VehicleType.FEAR,
    status: SimulationStatus.COMPLETED,
    timestamp: '12 Out, 11:15',
    duration: '2m 30s',
    speed: '5.1 m/s',
    metrics: { distance: '765.0 m', avgSpeed: '5.1 m/s', sensorL: 88, sensorR: 92 }
  },
  {
    id: 'db_6',
    name: 'Predação Simulada',
    vehicleType: VehicleType.AGGRESSION,
    status: SimulationStatus.STOPPED,
    timestamp: '10 Out, 14:20',
    duration: '1m 15s',
    speed: '2.9 m/s',
    metrics: { distance: '217.5 m', avgSpeed: '2.9 m/s', sensorL: 60, sensorR: 40 }
  },
  {
    id: 'db_7',
    name: 'Afeição Cruzada',
    vehicleType: VehicleType.LOVE,
    status: SimulationStatus.COMPLETED,
    timestamp: '08 Out, 18:05',
    duration: '8m 50s',
    speed: '1.4 m/s',
    metrics: { distance: '742.0 m', avgSpeed: '1.4 m/s', sensorL: 22, sensorR: 28 }
  },
  {
    id: 'db_8',
    name: 'Mapeamento de Luz',
    vehicleType: VehicleType.EXPLORER,
    status: SimulationStatus.PAUSED,
    timestamp: '05 Out, 08:45',
    duration: '14m 20s',
    speed: '0.6 m/s',
    metrics: { distance: '516.0 m', avgSpeed: '0.6 m/s', sensorL: 55, sensorR: 53 }
  },
  {
    id: 'db_9',
    name: 'Experimento Omega',
    vehicleType: VehicleType.AGGRESSION,
    status: SimulationStatus.COMPLETED,
    timestamp: '02 Out, 22:10',
    duration: '4m 12s',
    speed: '3.8 m/s',
    metrics: { distance: '957.6 m', avgSpeed: '3.8 m/s', sensorL: 82, sensorR: 79 }
  },
  {
    id: 'db_10',
    name: 'Protocolo de Fuga',
    vehicleType: VehicleType.FEAR,
    status: SimulationStatus.COMPLETED,
    timestamp: '30 Set, 12:00',
    duration: '3m 05s',
    speed: '4.2 m/s',
    metrics: { distance: '777.0 m', avgSpeed: '4.2 m/s', sensorL: 90, sensorR: 85 }
  },
  {
    id: 'db_11',
    name: 'Busca por Calor',
    vehicleType: VehicleType.LOVE,
    status: SimulationStatus.COMPLETED,
    timestamp: '28 Set, 15:30',
    duration: '6m 40s',
    speed: '1.8 m/s',
    metrics: { distance: '720.0 m', avgSpeed: '1.8 m/s', sensorL: 35, sensorR: 32 }
  },
  {
    id: 'db_12',
    name: 'Deriva Exploratória',
    vehicleType: VehicleType.EXPLORER,
    status: SimulationStatus.STOPPED,
    timestamp: '25 Set, 10:10',
    duration: '0m 55s',
    speed: '0.5 m/s',
    metrics: { distance: '27.5 m', avgSpeed: '0.5 m/s', sensorL: 10, sensorR: 12 }
  },
  {
    id: 'db_13',
    name: 'Ataque de Precisão',
    vehicleType: VehicleType.AGGRESSION,
    status: SimulationStatus.COMPLETED,
    timestamp: '22 Set, 17:45',
    duration: '7m 20s',
    speed: '3.1 m/s',
    metrics: { distance: '1364.0 m', avgSpeed: '3.1 m/s', sensorL: 75, sensorR: 77 }
  },
  {
    id: 'db_14',
    name: 'Teste de Inibição',
    vehicleType: VehicleType.LOVE,
    status: SimulationStatus.COMPLETED,
    timestamp: '20 Set, 09:20',
    duration: '11m 10s',
    speed: '0.9 m/s',
    metrics: { distance: '603.0 m', avgSpeed: '0.9 m/s', sensorL: 15, sensorR: 18 }
  },
  {
    id: 'db_15',
    name: 'Escaneamento Setorial',
    vehicleType: VehicleType.EXPLORER,
    status: SimulationStatus.COMPLETED,
    timestamp: '18 Set, 14:00',
    duration: '18m 30s',
    speed: '1.2 m/s',
    metrics: { distance: '1332.0 m', avgSpeed: '1.2 m/s', sensorL: 48, sensorR: 50 }
  }
];

export const RECENT_HISTORY: Simulation[] = MOCK_DATABASE.slice(0, 3);

export const VEHICLE_DETAILS = {
  [VehicleType.FEAR]: {
    description: "Foge rapidamente ao detectar estímulo.",
    connections: "Paralelas (Excit.)",
    icon: "running_with_errors",
    color: "text-yellow-500"
  },
  [VehicleType.AGGRESSION]: {
    description: "Ataca a fonte com aceleração agressiva.",
    connections: "Cruzadas (Excit.)",
    icon: "swords",
    color: "text-red-500"
  },
  [VehicleType.LOVE]: {
    description: "Aproxima-se suavemente e permanece.",
    connections: "Cruzadas (Inib.)",
    icon: "favorite",
    color: "text-pink-500"
  },
  [VehicleType.EXPLORER]: {
    description: "Investiga o ambiente de forma curiosa.",
    connections: "Paralelas (Inib.)",
    icon: "explore",
    color: "text-blue-400"
  }
};
