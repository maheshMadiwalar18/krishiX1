import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Sprout } from 'lucide-react';
import Home from './components/Home';
import DiseaseDetection from './components/DiseaseDetection';
import WeatherRecommendation from './components/WeatherRecommendation';
import CropDecisionSystem from './components/CropDecisionSystem';
import IrrigationPlanner from './components/IrrigationPlanner';
import VoiceAssistant from './components/VoiceAssistant';

import Earthworm from './components/Earthworm';
import Community from './components/Community';
import Dashboard from './components/Dashboard';
import Presentation from './components/Presentation';
import { NotificationProvider, useNotification } from './components/ui/Notification';
import { AnimatePresence, motion } from 'motion/react';

import Auth from './components/Auth';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';

function ProtectedRoute({ isLoggedIn, children }: { isLoggedIn: boolean, children: React.ReactNode }) {
  const { addNotification } = useNotification();
  
  useEffect(() => {
    if (!isLoggedIn) {
      addNotification('info', 'Please log in to access this feature.');
    }
  }, [isLoggedIn, addNotification]);

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  // Redirect to home if already logged in and trying to access auth page
  useEffect(() => {
    if (isLoggedIn && location.pathname === '/auth') {
      navigate('/');
    }
  }, [isLoggedIn, location.pathname, navigate]);

  const handleLogin = () => {
    addNotification('success', 'Logged in successfully!');
    navigate('/');
  };

  const handleLogout = async () => {
    await signOut(auth);
    addNotification('info', 'You have been logged out.');
    navigate('/');
  };

  const handleNavigate = (v: 'home' | 'disease' | 'weather' | 'assistant' | 'login' | 'knowledge' | 'planning' | 'dashboard' | 'irrigation' | 'community') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (v === 'home') navigate('/');
    else if (v === 'login') navigate('/auth');
    else if (v === 'disease') navigate('/disease-detection');
    else if (v === 'weather') navigate('/weather');
    else if (v === 'assistant') navigate('/assistant');

    else if (v === 'knowledge') navigate('/knowledge');
    else if (v === 'planning') navigate('/planning');
    else if (v === 'irrigation') navigate('/irrigation');
    else if (v === 'community') navigate('/community');
    else if (v === 'dashboard') navigate('/dashboard');
  };

  // Do not render Navbar and Main padding on auth page
  const isAuthPage = location.pathname === '/auth';

  if (isInitializing) return null;

  return (
    <div className="min-h-screen bg-bg transition-colors duration-500">
      {!isAuthPage && (
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onLogin={() => handleNavigate('login')} 
          onLogout={handleLogout}
          onHome={() => handleNavigate('home')}
          onNavigate={handleNavigate}
        />
      )}
      
      <main className={isAuthPage ? "" : location.pathname === '/' ? "pt-24" : "pt-24 pb-20 px-4 md:px-8 selection:bg-primary/20"}>
        <AnimatePresence mode="wait">
          {/* @ts-ignore: React Router v6 types clash with React 19 AnimatePresence key requirements */}
          <Routes location={location} key={location.pathname}>
            <Route path="/auth" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <Auth onLoginSuccess={handleLogin} />
              </motion.div>
            } />
            <Route path="/" element={
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Home 
                  isLoggedIn={isLoggedIn} 
                  onLogin={() => handleNavigate('login')}
                  onNavigate={handleNavigate}
                />
              </motion.div>
            } />
            <Route path="/disease-detection" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98, y: 10 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 1.02, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <DiseaseDetection onBack={() => handleNavigate('home')} />
                </motion.div>
              </ProtectedRoute>
            } />
            <Route path="/weather" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <motion.div 
                  initial={{ opacity: 0, x: 30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                >
                  <WeatherRecommendation onBack={() => handleNavigate('home')} />
                </motion.div>
              </ProtectedRoute>
            } />
            <Route path="/planning" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <motion.div 
                  initial={{ opacity: 0, x: 30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                >
                  <CropDecisionSystem onBack={() => handleNavigate('home')} />
                </motion.div>
              </ProtectedRoute>
            } />
            <Route path="/irrigation" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <motion.div 
                  initial={{ opacity: 0, x: 30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                >
                  <IrrigationPlanner onBack={() => handleNavigate('home')} />
                </motion.div>
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <motion.div 
                  initial={{ opacity: 0, x: 30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                >
                  <Community onBack={() => handleNavigate('home')} />
                </motion.div>
              </ProtectedRoute>
            } />
            <Route path="/assistant" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <motion.div 
                  initial={{ opacity: 0, y: 40 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ type: "spring", damping: 20, stiffness: 150 }}
                >
                  <VoiceAssistant onBack={() => handleNavigate('home')} />
                </motion.div>
              </ProtectedRoute>
            } />

            <Route path="/knowledge" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Earthworm onBack={() => handleNavigate('home')} />
                </motion.div>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Dashboard onStartView={(v) => handleNavigate(v)} />
                </motion.div>
              </ProtectedRoute>
            } />
            <Route path="/presentation" element={<Presentation />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAuthPage && isLoggedIn && location.pathname !== '/assistant' && (
        <button 
          onClick={() => handleNavigate('assistant')}
          className="fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full shadow-[0_4px_20px_rgba(46,125,50,0.4)] hover:shadow-[0_4px_25px_rgba(46,125,50,0.6)] hover:scale-105 transition-all flex items-center justify-center z-50 group border-2 border-primary/10 text-white"
          aria-label="Ask KrushiX Assistant"
        >
          <Sprout size={28} className="group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
}

import { UserProvider } from './contexts/UserContext';

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
