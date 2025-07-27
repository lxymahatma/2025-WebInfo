import fs from "node:fs";

import type { LanguageDB } from "./languages.types";

export const readLanguagesDB = (): LanguageDB => {
  try {
    const data = fs.readFileSync("databases/languages.json", "utf8");
    return JSON.parse(data) as LanguageDB;
  } catch (error) {
    console.error("Error reading languages database:", error);
    throw new Error(`Failed to read languages database`, { cause: error });
  }
};
