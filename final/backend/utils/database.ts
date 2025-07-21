import fs from "fs";
import { UserDB, MemoryDB, DragDropDB, TimedQuestionDB, LanguageDB, GamesDB } from "types";

export const readGamesDB = (): GamesDB => {
  try {
    const data = fs.readFileSync("databases/games.json", "utf-8");
    return data
      ? JSON.parse(data)
      : {
          gameInfo: {
            dragdrop: {
              name: "Drag & Drop",
              icon: "🎯",
              description: "Match items to their correct categories",
              color: "#1890ff",
              tailwindColor: "text-blue-500",
              path: "/dragdrop",
            },
            timed: {
              name: "Timed Quiz",
              icon: "⏰",
              description: "Answer questions before time runs out",
              color: "#52c41a",
              tailwindColor: "text-green-500",
              path: "/timed",
            },
            memory: {
              name: "Memory Cards",
              icon: "🧠",
              description: "Match pairs of cards by memory",
              color: "#722ed1",
              tailwindColor: "text-purple-500",
              path: "/memory",
            },
          },
          dragdrop: { pairs: [] },
          memory: { cards: [] },
          timed: { questions: [] },
        };
  } catch (error) {
    return {
      gameInfo: {
        dragdrop: {
          name: "Drag & Drop",
          icon: "🎯",
          description: "Match items to their correct categories",
          color: "#1890ff",
          tailwindColor: "text-blue-500",
          path: "/dragdrop",
        },
        timed: {
          name: "Timed Quiz",
          icon: "⏰",
          description: "Answer questions before time runs out",
          color: "#52c41a",
          tailwindColor: "text-green-500",
          path: "/timed",
        },
        memory: {
          name: "Memory Cards",
          icon: "🧠",
          description: "Match pairs of cards by memory",
          color: "#722ed1",
          tailwindColor: "text-purple-500",
          path: "/memory",
        },
      },
      dragdrop: { pairs: [] },
      memory: { cards: [] },
      timed: { questions: [] },
    };
  }
};

// User database
export const readUserDB = (): UserDB => {
  try {
    const data = fs.readFileSync("databases/user.json", "utf-8");
    return data ? JSON.parse(data) : { users: [] };
  } catch (error) {
    return { users: [] };
  }
};

export const writeUserDB = (db: UserDB): void => {
  fs.writeFileSync("databases/user.json", JSON.stringify(db, null, 2));
};

// Memory Card database
export const readMemoryDB = (): MemoryDB => {
  try {
    const data = fs.readFileSync("databases/memory.json", "utf-8");
    return data ? JSON.parse(data) : { cards: [] };
  } catch (error) {
    return { cards: [] };
  }
};

// Drag & Drop database
export const readDragDropDB = (): DragDropDB => {
  try {
    const data = fs.readFileSync("databases/dragdrop.json", "utf-8");
    return data ? JSON.parse(data) : { pairs: [], scores: [] };
  } catch (error) {
    return { pairs: [], scores: [] };
  }
};

// Timed database
export const readTimedDB = (): TimedQuestionDB => {
  try {
    const data = fs.readFileSync("databases/timed.json", "utf-8");
    return data ? JSON.parse(data) : { questions: [] };
  } catch (error) {
    return { questions: [] };
  }
};

// Language database
export const readLanguageDB = (): LanguageDB => {
  try {
    const data = fs.readFileSync("databases/language.json", "utf-8");
    return data ? JSON.parse(data) : { translations: {} };
  } catch (error) {
    return { translations: {} };
  }
};
