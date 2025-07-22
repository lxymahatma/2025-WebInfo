import fs from "fs";
import { LanguageDB } from "./languages.types";

export const readLanguagesDB = (): LanguageDB => {
  try {
    const data = fs.readFileSync("databases/languages.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { translations: {} };
  }
};
