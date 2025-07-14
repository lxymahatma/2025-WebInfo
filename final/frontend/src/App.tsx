import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth, NavBar } from 'components';
import { HomePage, GameTrackerPage, ProfilePage, SignInPage, SignUpPage, GameTrackerProvider } from 'pages';
import { DragDropGame, MemoryCardGame, TimedQuestionGame } from 'games';
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

export const App = () => {
  return (
    <AuthProvider>
      <GameTrackerProvider>
        <Router>
          <AppContent />
        </Router>
      </GameTrackerProvider>
    </AuthProvider>
  );
};
