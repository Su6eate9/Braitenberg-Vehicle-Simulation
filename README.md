# Braitenberg Vehicle Simulation

> Simule, analise e aprenda sobre comportamentos emergentes em veículos de Braitenberg usando uma interface web interativa.

## Descrição

Este projeto é uma plataforma educacional e experimental para simulação dos veículos de Braitenberg, permitindo explorar conceitos de neuro-robótica, comportamento emergente e análise de dados científicos. Usuários podem criar, executar e analisar simulações, além de acompanhar o progresso em missões e registrar histórico de experimentos.

## Funcionalidades

- Simulação em tempo real de diferentes tipos de veículos de Braitenberg (Medo, Agressão, Amor, Explorador)
- Criação e configuração de experimentos personalizados
- Visualização de sinais de sensores, métricas e telemetria
- Log científico e exportação de dados (CSV)
- Análise comparativa de simulações
- Sistema de missões e conquistas
- Onboarding e autenticação de usuários
- Interface responsiva e intuitiva

## Estrutura do Projeto

```
├── App.tsx                # Componente principal e roteamento
├── components/
│   └── BottomNav.tsx      # Navegação inferior
├── pages/
│   ├── Dashboard.tsx      # Página inicial e resumo
│   ├── NewSimulation.tsx  # Criação de simulação
│   ├── SimulationLive.tsx # Execução da simulação
│   ├── History.tsx        # Histórico e exportação
│   ├── Analysis.tsx       # Análise de dados
│   ├── Settings.tsx       # Perfil do usuário
│   ├── Onboarding.tsx     # Tutorial inicial
│   └── Auth.tsx           # Autenticação
├── constants.ts           # Constantes e dados de apoio
├── types.ts               # Tipos e enums do projeto
├── package.json           # Dependências e scripts
└── ...
```

## Como Executar Localmente

**Pré-requisitos:** Node.js 18+

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env.local` e defina sua chave da API Gemini:
   ```env
   GEMINI_API_KEY=SEU_TOKEN_AQUI
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:5173` no navegador.

## Principais Dependências

- React 19
- React Router DOM 7
- Vite 6
- TypeScript 5
- @google/genai

## Licença

MIT. Veja o arquivo LICENSE para mais detalhes.

## Autores

- Antonio Claudino Silva Neto

---

Projeto desenvolvido para fins educacionais e experimentais no contexto de robótica e neurociência.
