import fs from "node:fs";

import type { GamesDB } from "./games.types";

export const readGamesDB = (): GamesDB => {
  try {
    const data = fs.readFileSync("databases/games.json", "utf8");
    return JSON.parse(data) as GamesDB;
  } catch (error) {
    console.error("Error reading games database:", error);
    throw new Error(`Failed to read games database`, { cause: error });
  }
};
