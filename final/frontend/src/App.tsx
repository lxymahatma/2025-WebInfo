import { AuthProvider, NavBar, useAuth } from 'components';
import { DragDropGame, MemoryCardGame, TimedQuestionGame } from 'games';
import { GameDashboardPage, HomePage, ProfilePage, SignInPage, SignUpPage } from 'pages';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="App text-center font-sans">
      {user && !isHomePage && <NavBar />}
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={user ? <Navigate to="/" /> : <SignInPage />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/tracker" element={user ? <GameDashboardPage /> : <Navigate to="/" />} />
          <Route path="/dragdrop" element={user ? <DragDropGame /> : <Navigate to="/" />} />
          <Route path="/memory" element={user ? <MemoryCardGame /> : <Navigate to="/" />} />
          <Route path="/timed" element={user ? <TimedQuestionGame /> : <Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};
