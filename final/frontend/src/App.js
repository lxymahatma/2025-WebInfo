import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import DragDropGame from "./DragDropGame";
import TimedQuestionGame from "./TimedQuestionGame";

export default function App() {
  const handleAnswer = (idx) => {
    alert(idx === null ? "Time's up!" : `You chose option ${idx + 1}`);
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/dragdrop" />} />
        <Route path="/dragdrop" element={<DragDropGame />} />
        <Route
          path="/timed"
          element={
            <TimedQuestionGame
              question="Which is the largest planet in our solar system?"
              options={["Earth", "Mars", "Jupiter", "Venus"]}
              onAnswer={handleAnswer}
            />
          }
        />
      </Routes>
    </Router>
  );
}
