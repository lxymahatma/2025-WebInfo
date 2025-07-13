import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { GameTrackerProvider } from './pages/GameTrackerContext';
import NavBar from './NavBar';
import HomePage from './pages/HomePage';
import DragDropGame from './pages/games/DragDropGame';
import TimedQuestionGame from './pages/games/TimedQuestionGame';
import ProfilePage from './pages/ProfilePage';
import MemoryCardGame from './pages/games/MemoryCardGame';
import GameTrackerPage from './pages/GameTrackerPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={user ? <Navigate to="/" /> : <SignInPage />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/dragdrop" element={user ? <DragDropGame /> : <Navigate to="/" />} />
        <Route path="/timed" element={user ? <TimedQuestionGame /> : <Navigate to="/" />} />
        <Route path="/memory" element={user ? <MemoryCardGame /> : <Navigate to="/" />} />
        <Route path="/tracker" element={user ? <GameTrackerPage /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GameTrackerProvider>
        <Router>
          <AppContent />
        </Router>
      </GameTrackerProvider>
    </AuthProvider>
  );
}
