import React, { useState, useEffect } from "react";

function QuizMonitor() {
  const [kickedOut, setKickedOut] = useState(false);
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setKickedOut(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 🧹 Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {kickedOut ? (
        <h2 style={{ color: "red" }}>You have been kicked out for leaving the tab!</h2>
      ) : (
        <>
          <h2>Quiz in Progress</h2>
          <p>Please stay on this tab to complete the quiz.</p>

          <div style={{ marginTop: "20px" }}>
            <h3>Question 1</h3>
            <p>How are you?</p>
            <input type="text" name="q1" value={answers.q1} onChange={handleChange} />
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Question 2</h3>
            <p>What is 1 + 1?</p>
            <input type="text" name="q2" value={answers.q2} onChange={handleChange} />
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Question 3</h3>
            <p>How old are you?</p>
            <input type="text" name="q3" value={answers.q3} onChange={handleChange} />
          </div>
        </>
      )}
    </div>
  );
}

export default QuizMonitor;
