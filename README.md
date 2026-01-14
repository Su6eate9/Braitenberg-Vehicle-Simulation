
# Braitenberg Vehicle Simulation

> Simulate, analyze, and learn about emergent behaviors in Braitenberg vehicles using an interactive web interface.

## Description

This project is an educational and experimental platform for simulating Braitenberg vehicles, allowing users to explore concepts in neurorobotics, emergent behavior, and scientific data analysis. Users can create, run, and analyze simulations, track progress in missions, and keep a history of experiments.

## Features

- Real-time simulation of different Braitenberg vehicle types (Fear, Aggression, Love, Explorer)
- Creation and configuration of custom experiments
- Visualization of sensor signals, metrics, and telemetry
- Scientific log and data export (CSV)
- Comparative analysis of simulations
- Missions and achievements system
- Onboarding and user authentication
- Responsive and intuitive interface

## Project Structure

```
├── App.tsx                # Main component and routing
├── components/
│   └── BottomNav.tsx      # Bottom navigation
├── pages/
│   ├── Dashboard.tsx      # Home and summary page
│   ├── NewSimulation.tsx  # Simulation creation
│   ├── SimulationLive.tsx # Simulation execution
│   ├── History.tsx        # History and export
│   ├── Analysis.tsx       # Data analysis
│   ├── Settings.tsx       # User profile
│   ├── Onboarding.tsx     # Initial tutorial
│   └── Auth.tsx           # Authentication
├── constants.ts           # Constants and support data
├── types.ts               # Project types and enums
├── package.json           # Dependencies and scripts
└── ...
```

## How to Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file and set your Gemini API key:
   ```env
   GEMINI_API_KEY=YOUR_TOKEN_HERE
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access `http://localhost:5173` in your browser.

## Main Dependencies

- React 19
- React Router DOM 7
- Vite 6
- TypeScript 5
- @google/genai

## License

MIT. See the LICENSE file for more details.

## Authors

- [Your Name Here]
- Contributors: [Add others if necessary]

---

Project developed for educational and experimental purposes in the context of robotics and neuroscience.
