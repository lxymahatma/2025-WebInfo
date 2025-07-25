import { AuthProvider, NavBar, useAuth } from 'components';
import { DragDropGame, MemoryCardGame, TimedQuestionGame } from 'games';
import { GameDashboardPage, HomePage, ProfilePage, SignInPage, SignUpPage } from 'pages';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';

function AppContent() {
  const { userName } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="App text-center font-sans">
      {userName && !isHomePage && <NavBar />}
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={userName ? <Navigate to="/" /> : <SignInPage />} />
          <Route path="/signup" element={userName ? <Navigate to="/" /> : <SignUpPage />} />
          <Route path="/profile" element={userName ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/tracker" element={userName ? <GameDashboardPage /> : <Navigate to="/" />} />
          <Route path="/dragdrop" element={userName ? <DragDropGame /> : <Navigate to="/" />} />
          <Route path="/memory" element={userName ? <MemoryCardGame /> : <Navigate to="/" />} />
          <Route path="/timed" element={userName ? <TimedQuestionGame /> : <Navigate to="/" />} />
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
