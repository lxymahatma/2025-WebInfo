import fs from "fs";
import type { UserDB } from "./users.types";

export const readUsersDB = (): UserDB => {
  try {
    const data = fs.readFileSync("databases/users.json", "utf-8");
    return JSON.parse(data) as UserDB;
  } catch (error) {
    console.error("Error reading users database:", error);
    return { users: [] };
  }
};

export const writeUsersDB = (db: UserDB): void => {
  fs.writeFileSync("databases/users.json", JSON.stringify(db, null, 2));
};
