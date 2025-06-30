// DragAndDropMatchGame.js
// Self‑contained React component written in **plain JavaScript (no JSX)**.
// **No TailwindCSS** or external styling libraries required.
// Usage → import DragAndDropMatchGame from "./DragAndDropMatchGame"; then <DragAndDropMatchGame />

import React, { useState, useRef } from "react";

export default function DragAndDropMatchGame() {
  // ─────────────────────────────────────────────────────────────────────────────
  // DATA ─ list the draggable tokens and their matching drop‑zones
  // ─────────────────────────────────────────────────────────────────────────────
  const PAIRS = [
    { id: "apple", label: "🍎 Apple", match: "Fruit" },
    { id: "dog", label: "🐶 Dog", match: "Animal" },
    { id: "car", label: "🚗 Car", match: "Vehicle" },
    { id: "rose", label: "🌹 Rose", match: "Flower" },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE + REFS
  // ─────────────────────────────────────────────────────────────────────────────
  const [solved, setSolved] = useState({});         // id → true when matched
  const dragItemRef = useRef(null);                 // id of the token being dragged

  // ─────────────────────────────────────────────────────────────────────────────
  // STYLING (pure JavaScript objects)
  // ─────────────────────────────────────────────────────────────────────────────
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
      background: "#e0e7ff",           // light indigo
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
      background: "#d1fadf",            // pale green
      color: "#0f5132",
      borderRadius: "12px",
      fontSize: "1.1rem",
      fontWeight: 600,
      boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
    },
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleDragStart = (e, id) => {
    dragItemRef.current = id;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // make drop possible
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, zoneLabel) => {
    e.preventDefault();
    const draggedId = dragItemRef.current;
    const draggedItem = PAIRS.find((p) => p.id === draggedId);

    if (!draggedItem) return;

    if (draggedItem.match === zoneLabel) {
      // correct match 🥳
      setSolved((prev) => ({ ...prev, [draggedId]: true }));
    } else {
      // quick visual feedback for a mismatch
      const origBg = e.currentTarget.style.backgroundColor;
      e.currentTarget.style.backgroundColor = "#ffe0e0"; // light red
      setTimeout(() => {
        e.currentTarget.style.backgroundColor = origBg;
      }, 500);
    }

    dragItemRef.current = null;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER (no JSX) ─ build the tree with React.createElement
  // ─────────────────────────────────────────────────────────────────────────────
  const allSolved = Object.keys(solved).length === PAIRS.length;

  // Draggable tokens
  const tokens = PAIRS.map(({ id, label }) =>
    React.createElement(
      "div",
      {
        key: id,
        draggable: !solved[id],
        onDragStart: (e) => handleDragStart(e, id),
        style: styles.token(solved[id]),
      },
      label
    )
  );

  // Drop zones
  const zoneLabels = Array.from(new Set(PAIRS.map((p) => p.match)));
  const zones = zoneLabels.map((zoneLabel) =>
    React.createElement(
      "div",
      {
        key: zoneLabel,
        onDragOver: handleDragOver,
        onDrop: (e) => handleDrop(e, zoneLabel),
        style: styles.zone,
      },
      zoneLabel
    )
  );

  // Optional win message
  const winMessage =
    allSolved &&
    React.createElement("div", { style: styles.win }, "🎉 Well done! You matched them all.");

  return React.createElement(
    "div",
    { style: styles.root },
    React.createElement("h2", { style: styles.heading }, "Drag & Drop Match Game"),
    React.createElement(
      "p",
      { style: styles.instructions },
      "Drag each emoji token into the correct category."
    ),
    React.createElement("div", { style: styles.tokenRow }, ...tokens),
    React.createElement("div", { style: styles.zoneGrid }, ...zones),
    winMessage
  );
}
