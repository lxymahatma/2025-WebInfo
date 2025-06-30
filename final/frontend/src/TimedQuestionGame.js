import React, { useState, useEffect } from "react";

const styles = {
  container: {
    position: "relative",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    padding: "2rem 2.5rem",
    maxWidth: 420,
    margin: "2rem auto",
    fontFamily: "system-ui, sans-serif",
  },
  timer: {
    position: "absolute",
    top: 18,
    right: 28,
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#e74c3c",
    background: "#fff8e1",
    borderRadius: "8px",
    padding: "0.2rem 0.8rem",
    boxShadow: "0 1px 4px #ffe066",
  },
  question: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "1.5rem",
    color: "#0080a8",
    textAlign: "center",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  optionBtn: (selected, disabled) => ({
    width: "100%",
    textAlign: "left",
    padding: "0.8rem 1.2rem",
    borderRadius: "8px",
    border: "2px solid #e0e7ff",
    background: selected ? "#0080a8" : "#f3fafd",
    color: selected ? "#fff" : "#222",
    fontWeight: 500,
    fontSize: "1.08rem",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled && !selected ? 0.6 : 1,
    transition: "background 0.18s, color 0.18s",
    outline: "none",
  }),
};

export default function TimedQuestionGame({ question, options, onAnswer }) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (timeLeft === 0) {
      onAnswer(null);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onAnswer]);

  const handleSelect = (idx) => {
    setSelected(idx);
    onAnswer(idx);
  };

  return (
    <div style={styles.container}>
      <div style={styles.timer}>{timeLeft}s</div>
      <div style={styles.question}>{question}</div>
      <div style={styles.options}>
        {options.map((opt, idx) => (
          <button
            key={idx}
            style={styles.optionBtn(selected === idx, selected !== null)}
            disabled={selected !== null}
            onClick={() => handleSelect(idx)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
