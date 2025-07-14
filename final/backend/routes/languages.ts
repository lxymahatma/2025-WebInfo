import { Router, Response } from "express";
import { verifyToken } from "middleware";
import { AuthRequest, LanguageResponse, ErrorResponse, UpdateLanguageRequest } from "types";
import { readLanguageDB, readUserDB, writeUserDB } from "utils";

const router = Router();

router.get(
  "/",
  verifyToken,
  (req: AuthRequest, res: Response<LanguageResponse | ErrorResponse>) => {
    const languageDB = readLanguageDB();
    const userDb = readUserDB();

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
    const languageDB = readLanguageDB();
    const userDb = readUserDB();

    const user = userDb.users.find((u) => u.username === req.user?.username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!languageDB.translations[language]) {
      return res.status(400).json({ message: "Invalid language" });
    }

    user.language = language;
    writeUserDB(userDb);

    res.json({ message: "Language updated successfully", language });
  }
);

export const languageRouter = router;
