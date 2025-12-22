
import { SimulationStatus, VehicleType, Simulation, Mission } from './types';

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Análise de Quimiotaxia',
    description: 'Simule o comportamento de fuga (2a) por 300m para entender padrões de nematódeos.',
    requirement: 300,
    current: 0,
    isCompleted: false,
    reward: 'Certificado: Iniciante em Neuro-Robótica',
    category: 'distance'
  },
  {
    id: 'm2',
    title: 'Emergência de Órbita',
    description: 'Mantenha um Veículo 3b (Explorador) ativo por 5 minutos.',
    requirement: 300, // segundos
    current: 0,
    isCompleted: false,
    reward: 'Módulo: Sensores Químicos',
    category: 'time'
  }
];

export const VEHICLE_DETAILS = {
  [VehicleType.FEAR]: {
    description: "Conexões diretas excitatórias. Foge da fonte, simulando respostas de sobressalto em insetos.",
    connections: "Ipsilaterais (+)",
    icon: "bolt",
    color: "text-yellow-500",
    bioParallel: "Baratas (fuga de luz)",
    law: "M_L = S_L | M_R = S_R"
  },
  [VehicleType.AGGRESSION]: {
    description: "Conexões cruzadas excitatórias. Persegue a fonte agressivamente, similar a predadores simples.",
    connections: "Contralaterais (+)",
    icon: "priority_high",
    color: "text-red-500",
    bioParallel: "Protistas caçadores",
    law: "M_L = S_R | M_R = S_L"
  },
  [VehicleType.LOVE]: {
    description: "Conexões diretas inibitórias. Aproxima-se e repousa, simulando fototaxia positiva controlada.",
    connections: "Ipsilaterais (-)",
    icon: "favorite",
    color: "text-pink-500",
    bioParallel: "C. elegans (busca de alimento)",
    law: "M_L = 1/S_L | M_R = 1/S_R"
  },
  [VehicleType.EXPLORER]: {
    description: "Conexões cruzadas inibitórias. Orbita a fonte com curiosidade, investigando o gradiente.",
    connections: "Contralaterais (-)",
    icon: "visibility",
    color: "text-blue-400",
    bioParallel: "Bactérias (gradiente químico)",
    law: "M_L = 1/S_R | M_R = 1/S_L"
  }
};

/**
 * Themes available in the Braitenberg Studio.
 * Required for the researcher profile customization.
 */
export const THEMES = {
  default: { id: 'default', name: 'Laboratório (Padrão)' },
  cyber: { id: 'cyber', name: 'Cibernética' },
  minimal: { id: 'minimal', name: 'Minimalista' },
  classic: { id: 'classic', name: 'Neuro Clássico' }
};

export const MOCK_DATABASE: Simulation[] = [
  {
    id: 'db_1',
    name: 'Validação Braitenberg 3a',
    vehicleType: VehicleType.LOVE,
    status: SimulationStatus.COMPLETED,
    timestamp: '20 Out, 09:00',
    duration: '5m 20s',
    speed: '0.8 m/s',
    metrics: { distance: '256.0 m', avgSpeed: '0.8 m/s', sensorL: 20, sensorR: 20 }
  }
];

export const RECENT_HISTORY: Simulation[] = MOCK_DATABASE;
