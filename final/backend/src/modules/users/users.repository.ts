import fs from "node:fs";

import type { UserDB } from "./users.types";

export const readUsersDB = (): UserDB => {
  try {
    const data = fs.readFileSync("databases/users.json", "utf8");
    return JSON.parse(data) as UserDB;
  } catch (error) {
    console.error("Error reading users database:", error);
    throw new Error(`Failed to read users database`, { cause: error });
  }
};

export const writeUsersDB = (database: UserDB): void => {
  try {
    fs.writeFileSync("databases/users.json", JSON.stringify(database, undefined, 2));
  } catch (error) {
    console.error("Error writing users database:", error);
    throw new Error(`Failed to write users database`, { cause: error });
  }
};
