import type { ErrorResponse } from "@eduplayground/shared/types/error";
import type {
  LanguageResponse,
  Translations,
  UpdateLanguageRequest,
} from "@eduplayground/shared/types/language";
import { type Response, Router } from "express";
import { readUsersDB, writeUsersDB } from "modules/users";
import { verifyToken } from "shared/middleware";
import type { AuthRequest } from "shared/types";

import { readLanguagesDB } from "./languages.repository";

const router = Router();

router.get(
  "/",
  verifyToken,
  (request: AuthRequest, response: Response<LanguageResponse | ErrorResponse>) => {
    const languageDB = readLanguagesDB();
    const userDatabase = readUsersDB();

    const user = userDatabase.users.find((u) => u.username === request.user?.username);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    response.json({
      translations: languageDB.translations,
      userLanguage: user.language as keyof Translations,
    });
  }
);

router.put(
  "/",
  verifyToken,
  (
    request: AuthRequest,
    response: Response<{ message: string; language: string } | ErrorResponse>
  ) => {
    const { language }: UpdateLanguageRequest = request.body as UpdateLanguageRequest;
    const languageDB = readLanguagesDB();
    const userDatabase = readUsersDB();

    const user = userDatabase.users.find((u) => u.username === request.user?.username);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    if (!(language in languageDB.translations)) {
      return response.status(400).json({ message: "Invalid language" });
    }

    user.language = language;
    writeUsersDB(userDatabase);

    response.json({ message: "Language updated successfully", language });
  }
);

export const languagesRouter = router;
