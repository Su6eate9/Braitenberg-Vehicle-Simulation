# 🤖 Simulação de Veículos de Braitenberg

## Uma Abordagem Neuro-robótica Inspirada em Comportamentos Biológicos

**Autor:** Antonio Claudino S. Neto  
**Disciplina:** Princípios e Aplicações de Robótica  
**Instituição:** UFMA

---

## 📋 Sobre o Projeto

Este projeto implementa uma simulação interativa dos **Veículos de Braitenberg**, proposta pelo neurocientista Valentino Braitenberg em 1984. Demonstra como comportamentos complexos e aparentemente intencionais podem emergir de arquiteturas neurais extremamente simples.

### 🎯 Objetivos

#### Objetivo Geral

Implementar e simular diferentes configurações de Veículos de Braitenberg para demonstrar como conexões neurais simples geram comportamentos complexos, estabelecendo paralelos com sistemas biológicos e princípios de neuro-robótica.

#### Objetivos Específicos

- ✅ Simular 4 tipos de veículos de Braitenberg (2a, 2b, 3a, 3b)
- ✅ Demonstrar comportamentos emergentes: medo, agressão, amor e exploração
- ✅ Implementar sensores virtuais de luz e atuadores motores
- ✅ Analisar como arquitetura neural minimalista produz comportamentos adaptativos
- ✅ Comparar comportamentos simulados com padrões biológicos

---

## 🧬 Fundamentação Teórica

### Tipos de Veículos Implementados

| Veículo             | Tipo de Conexão                        | Comportamento                 | Paralelo Biológico             |
| ------------------- | -------------------------------------- | ----------------------------- | ------------------------------ |
| **2a - Medo**       | Diretas Excitatórias (Ipsilaterais)    | Foge da fonte de luz          | Baratas fugindo de luz         |
| **2b - Agressão**   | Cruzadas Excitatórias (Contralaterais) | Ataca/persegue a fonte        | Protistas caçadores            |
| **3a - Amor**       | Diretas Inibitórias (Ipsilaterais)     | Aproxima-se suavemente e para | C. elegans buscando alimento   |
| **3b - Explorador** | Cruzadas Inibitórias (Contralaterais)  | Orbita ao redor da fonte      | Bactérias em gradiente químico |

### Princípios Fundamentais

**Veículos de Braitenberg** são agentes robóticos hipotéticos compostos por:

- **Sensores:** Captam estímulos ambientais (luz, calor, químicos)
- **Conexões:** Ligações diretas ou cruzadas entre sensores e motores
- **Atuadores:** Motores que controlam a locomoção

#### Arquiteturas Neurais

```
Veículo 2a (Medo):       Veículo 2b (Agressão):
  SL ──→ ML                SL ─╲  ╱─ ML
  SR ──→ MR                SR ─╱  ╲─ MR

Veículo 3a (Amor):       Veículo 3b (Explorador):
  SL ──⊣ ML                SL ─⊣╲  ╱─ ML
  SR ──⊣ MR                SR ─⊣╱  ╲─ MR
```

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/Su6eate9/Braitenberg-Vehicle-Simulation.git
cd Braitenberg-Vehicle-Simulation
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Execute a aplicação:**

```bash
npm run dev
```

4. **Acesse no navegador:**

```
http://localhost:3000
```

---

## 🎮 Como Usar

1. **Selecione um tipo de veículo** no Dashboard (2a, 2b, 3a ou 3b)
2. **Configure os parâmetros:**
   - Ganho sensorial (sensibilidade dos sensores)
   - Velocidade base
3. **Inicie a simulação** e observe o comportamento emergente
4. **Mova a fonte de luz** clicando/arrastando no canvas
5. **Analise os dados** em tempo real (velocidade dos motores, leitura dos sensores)

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + TypeScript
- **Vite** - Build tool
- **React Router** - Navegação
- **Tailwind CSS** - Estilização
- **Canvas API** - Renderização da simulação

---

## 📊 Estrutura do Projeto

```
Braitenberg-Vehicle-Simulation/
├── pages/
│   ├── Dashboard.tsx          # Tela principal
│   ├── NewSimulation.tsx      # Configuração de simulações
│   ├── SimulationLive.tsx     # Motor de simulação
│   ├── History.tsx            # Histórico de simulações
│   ├── Analysis.tsx           # Análise de dados
│   └── Settings.tsx           # Configurações
├── components/
│   └── BottomNav.tsx          # Navegação inferior
├── types.ts                    # Definições TypeScript
├── constants.ts                # Constantes e configurações
└── App.tsx                     # Componente raiz
```

---

## 🧪 Resultados Esperados

- ✅ Demonstração funcional de 4 tipos de Veículos de Braitenberg
- ✅ Visualização em tempo real dos comportamentos emergentes
- ✅ Análise comparativa entre arquiteturas neurais
- ✅ Discussão sobre implicações para neuro-robótica
- ✅ Código-fonte documentado e reproduzível

---

## 📚 Referências Bibliográficas

1. **BRAITENBERG, V.** _Vehicles: Experiments in Synthetic Psychology._ MIT Press, 1984.

2. **WEBB, B.** Can robots make good models of biological behaviour? _Behavioral and Brain Sciences_, v. 24, n. 6, p. 1033-1050, 2001.

3. **PRESCOTT, T. J.; MONTES GONZÁLEZ, F.; GURNEY, K.; HUMPHRIES, M. D.; REDGRAVE, P.** A robot model of the basal ganglia: Behavior and intrinsic processing. _Neural Networks_, v. 19, n. 1, p. 31-61, 2006.

4. **FLOREANO, D.; MATTIUSSI, C.** _Bio-Inspired Artificial Intelligence: Theories, Methods, and Technologies._ MIT Press, 2008.

5. **MONDADA, F. et al.** The e-puck, a robot designed for education in engineering. _Proceedings of the 9th Conference on Autonomous Robot Systems and Competitions_, v. 1, n. 1, p. 59-65, 2009.

---

## 🎓 Justificativa Acadêmica

Este projeto combina aspectos teóricos de neurociência com implementação prática em robótica, demonstrando:

1. **Conexão Neurociência-Robótica:** Princípios fundamentais de processamento sensorial e ação motora
2. **Comportamento Emergente:** Inteligência surgindo de regras simples
3. **Aplicabilidade:** Princípios aplicáveis em robótica de enxame e sistemas autônomos
4. **Acessibilidade:** Implementação prática e educacional

---

## 📝 Licença

Este projeto é de código aberto e está disponível para fins educacionais.

---

## 👤 Autor

**Antonio Claudino S. Neto**  
Universidade Federal do Maranhão (UFMA)  
Disciplina: Princípios e Aplicações de Robótica

---

## 🌟 Agradecimentos

Agradecimentos especiais ao Prof. responsável pela disciplina e aos colegas que contribuíram com feedback durante o desenvolvimento.

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!**
