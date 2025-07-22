import fs from "fs";
import type { LanguageDB } from "./languages.types";

export const readLanguagesDB = (): LanguageDB => {
  try {
    const data = fs.readFileSync("databases/languages.json", "utf-8");
    return JSON.parse(data) as LanguageDB;
  } catch (error) {
    console.error("Error reading languages database:", error);
    return { translations: {} };
  }
};
