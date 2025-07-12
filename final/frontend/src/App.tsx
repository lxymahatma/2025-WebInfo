import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import NavBar from './NavBar';
import MainPage from './MainPage';
import DragDropGame from './DragDropGame';
import TimedQuestionGame from './TimedQuestionGame';
import ProfilePage from './ProfilePage';
import MemoryCardGame from './MemoryCardGame';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './App.css';

function AppContent() {
  const { user } = useAuth();
  
  const handleAnswer = (idx: number | null) => {
    alert(idx === null ? "Time's up!" : `You chose option ${idx + 1}`);
  };

  return (
    <>
      {user && <NavBar />}
      <Routes>
        <Route path="/" element={user ? <MainPage /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={user ? <Navigate to="/" /> : <SignIn />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/signin" />} />
        <Route path="/dragdrop" element={user ? <DragDropGame /> : <Navigate to="/signin" />} />
        <Route
          path="/timed"
          element={
            user ? (
              <TimedQuestionGame
                question="Which is the largest planet in our solar system?"
                options={['Earth', 'Mars', 'Jupiter', 'Venus']}
                onAnswer={handleAnswer}
              />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route path="/memory" element={user ? <MemoryCardGame /> : <Navigate to="/signin" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
