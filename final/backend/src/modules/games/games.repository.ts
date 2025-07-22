import fs from "node:fs";
import type { GamesDB } from "./games.types";

export const readGamesDB = (): GamesDB => {
  try {
    const data = fs.readFileSync("databases/games.json", "utf8");
    return JSON.parse(data) as GamesDB;
  } catch (error) {
    console.error("Error reading games database:", error);
    return {
      dashboard: {
        cards: {
          dragdrop: {
            name: "Drag & Drop",
            icon: "🎯",
            description: "Match items to their correct categories",
            backgroundColor: "bg-blue-500",
            textColor: "text-blue-500",
            path: "/dragdrop",
          },
          timed: {
            name: "Timed Quiz",
            icon: "⏰",
            description: "Answer questions before time runs out",
            backgroundColor: "bg-green-500",
            textColor: "text-green-500",
            path: "/timed",
          },
          memory: {
            name: "Memory Cards",
            icon: "🧠",
            description: "Match pairs of cards by memory",
            backgroundColor: "bg-purple-500",
            textColor: "text-purple-500",
            path: "/memory",
          },
        },
      },
      dragdrop: { pairs: [] },
      memory: { cards: [] },
      timed: { questions: [] },
    };
  }
};
