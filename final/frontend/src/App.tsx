import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { GameTrackerProvider } from './pages/GameTrackerContext';
import NavBar from './NavBar';

// Pages
import HomePage from './pages/HomePage';
import GameTrackerPage from './pages/GameTrackerPage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

// Games
import DragDropGame from './games/DragDropGame';
import MemoryCardGame from './games/MemoryCardGame';
import TimedQuestionGame from './games/TimedQuestionGame';

import './App.css';

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {user && !isHomePage && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={user ? <Navigate to="/" /> : <SignInPage />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/tracker" element={user ? <GameTrackerPage /> : <Navigate to="/" />} />
        <Route path="/dragdrop" element={user ? <DragDropGame /> : <Navigate to="/" />} />
        <Route path="/memory" element={user ? <MemoryCardGame /> : <Navigate to="/" />} />
        <Route path="/timed" element={user ? <TimedQuestionGame /> : <Navigate to="/" />} />
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
