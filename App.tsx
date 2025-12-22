
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import NewSimulation from './pages/NewSimulation.tsx';
import SimulationLive from './pages/SimulationLive.tsx';
import History from './pages/History.tsx';
import Settings from './pages/Settings.tsx';
import Analysis from './pages/Analysis.tsx';
import Onboarding from './pages/Onboarding.tsx';
import Auth from './pages/Auth.tsx';
import BottomNav from './components/BottomNav.tsx';
import { MOCK_DATABASE } from './constants.ts';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('hasSeenOnboarding') !== 'true';
  });

  useEffect(() => {
    const existingSims = localStorage.getItem('userSimulations');
    if (!existingSims || JSON.parse(existingSims).length === 0) {
      localStorage.setItem('userSimulations', JSON.stringify(MOCK_DATABASE));
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewSimulation />} />
          <Route path="/live/:id" element={<SimulationLive />} />
          <Route path="/history" element={<History />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/settings" element={<Settings onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
};

export default App;
