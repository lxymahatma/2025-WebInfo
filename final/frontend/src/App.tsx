import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { GameTrackerProvider } from './GameTrackerContext';
import NavBar from './NavBar';
import HomePage from './HomePage';
import DragDropGame from './DragDropGame';
import TimedQuestionGame from './TimedQuestionGame';
import ProfilePage from './ProfilePage';
import MemoryCardGame from './MemoryCardGame';
import GameTracker from './GameTracker';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={user ? <Navigate to="/" /> : <SignIn />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/dragdrop" element={user ? <DragDropGame /> : <Navigate to="/" />} />
        <Route path="/timed" element={user ? <TimedQuestionGame /> : <Navigate to="/" />} />
        <Route path="/memory" element={user ? <MemoryCardGame /> : <Navigate to="/" />} />
        <Route path="/tracker" element={user ? <GameTracker /> : <Navigate to="/" />} />
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
