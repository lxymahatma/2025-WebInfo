import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import DragDropGame from "./DragDropGame";
import TimedQuestionGame from "./TimedQuestionGame";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signin" />;
};

export default function App() {
  const handleAnswer = (idx) => {
    alert(idx === null ? "Time's up!" : `You chose option ${idx + 1}`);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <NavBar />
              <Navigate to="/dragdrop" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dragdrop"
          element={
            <ProtectedRoute>
              <NavBar />
              <DragDropGame />
            </ProtectedRoute>
          }
        />
        <Route
          path="/timed"
          element={
            <ProtectedRoute>
              <NavBar />
              <TimedQuestionGame
                question="Which is the largest planet in our solar system?"
                options={["Earth", "Mars", "Jupiter", "Venus"]}
                onAnswer={handleAnswer}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}