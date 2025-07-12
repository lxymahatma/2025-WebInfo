import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import DragDropGame from './DragDropGame';
import TimedQuestionGame from './TimedQuestionGame';
import ProfilePage from './ProfilePage';
import MemoryCardGame from './MemoryCardGame';
import './App.css';

export default function App() {
  const handleAnswer = (idx: number | null) => {
    alert(idx === null ? "Time's up!" : `You chose option ${idx + 1}`);
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/dragdrop" />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dragdrop" element={<DragDropGame />} />
        <Route
          path="/timed"
          element={
            <TimedQuestionGame
              question="Which is the largest planet in our solar system?"
              options={['Earth', 'Mars', 'Jupiter', 'Venus']}
              onAnswer={handleAnswer}
            />
          }
        />
        <Route path="/memory" element={<MemoryCardGame />} />
      </Routes>
    </Router>
  );
}
