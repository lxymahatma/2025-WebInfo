import { Router, Response } from "express";
import { verifyToken } from "shared/middleware";
import {
  AuthRequest,
  LanguageResponse,
  ErrorResponse,
  UpdateLanguageRequest,
} from "./languages.types";
import { readLanguagesDB } from "./languages.repository";
import { readUsersDB, writeUsersDB } from "modules/users";

const router = Router();

router.get(
  "/",
  verifyToken,
  (req: AuthRequest, res: Response<LanguageResponse | ErrorResponse>) => {
    const languageDB = readLanguagesDB();
    const userDb = readUsersDB();

    const user = userDb.users.find((u) => u.username === req.user?.username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      translations: languageDB.translations,
      userLanguage: user.language,
    });
  }
);

router.put(
  "/",
  verifyToken,
  (req: AuthRequest, res: Response<{ message: string; language: string } | ErrorResponse>) => {
    const { language }: UpdateLanguageRequest = req.body;
    const languageDB = readLanguagesDB();
    const userDb = readUsersDB();

    const user = userDb.users.find((u) => u.username === req.user?.username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!languageDB.translations[language]) {
      return res.status(400).json({ message: "Invalid language" });
    }

    user.language = language;
    writeUsersDB(userDb);

    res.json({ message: "Language updated successfully", language });
  }
);

export const languagesRouter = router;
