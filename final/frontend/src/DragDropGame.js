import React, { useState, useRef } from "react";

const PAIRS = [
  { id: "apple", label: "🍎 Apple", match: "Fruit" },
  { id: "dog", label: "🐶 Dog", match: "Animal" },
  { id: "car", label: "🚗 Car", match: "Vehicle" },
  { id: "rose", label: "🌹 Rose", match: "Flower" },
];

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    padding: "24px",
    maxWidth: "640px",
    margin: "0 auto",
    fontFamily: "system-ui, sans-serif",
  },
  heading: { fontSize: "1.5rem", fontWeight: 700 },
  instructions: { color: "#555", marginBottom: "8px" },
  tokenRow: { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" },
  token: (inactive) => ({
    opacity: inactive ? 0.4 : 1,
    cursor: inactive ? "default" : "grab",
    padding: "8px 16px",
    background: "#e0e7ff",
    borderRadius: "12px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
    userSelect: "none",
    transition: "transform 0.15s ease-in-out",
  }),
  zoneGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "16px",
    width: "100%",
  },
  zone: {
    minHeight: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed #999",
    borderRadius: "12px",
    background: "#fff",
  },
  win: {
    marginTop: "24px",
    padding: "12px 20px",
    background: "#d1fadf",
    color: "#0f5132",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: 600,
    boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
  },
};

export default function DragDropGame() {
  const [solved, setSolved] = useState({});
  const dragItemRef = useRef(null);

  const handleDragStart = (e, id) => {
    dragItemRef.current = id;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, zoneLabel) => {
    e.preventDefault();
    const draggedId = dragItemRef.current;
    const draggedItem = PAIRS.find((p) => p.id === draggedId);

    if (!draggedItem) return;

    if (draggedItem.match === zoneLabel) {
      setSolved((prev) => ({ ...prev, [draggedId]: true }));
    } else {
      const origBg = e.currentTarget.style.backgroundColor;
      e.currentTarget.style.backgroundColor = "#ffe0e0";
      setTimeout(() => {
        e.currentTarget.style.backgroundColor = origBg;
      }, 500);
    }
    dragItemRef.current = null;
  };

  const allSolved = Object.keys(solved).length === PAIRS.length;
  const zoneLabels = Array.from(new Set(PAIRS.map((p) => p.match)));

  return (
    <div style={styles.root}>
      <h2 style={styles.heading}>Drag & Drop Match Game</h2>
      <p style={styles.instructions}>Drag each emoji token into the correct category.</p>
      <div style={styles.tokenRow}>
        {PAIRS.map(({ id, label }) => (
          <div
            key={id}
            draggable={!solved[id]}
            onDragStart={(e) => handleDragStart(e, id)}
            style={styles.token(solved[id])}>
            {label}
          </div>
        ))}
      </div>
      <div style={styles.zoneGrid}>
        {zoneLabels.map((zoneLabel) => (
          <div
            key={zoneLabel}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, zoneLabel)}
            style={styles.zone}>
            {zoneLabel}
          </div>
        ))}
      </div>
      {allSolved && <div style={styles.win}>🎉 Well done! You matched them all.</div>}
    </div>
  );
}
