import { Router } from "express";
import type { Request, Response } from "express";
import { merge } from "es-toolkit";
import { verifyToken } from "shared/middleware";
import type { AuthRequest } from "shared/types";
import type { ErrorResponse } from "@eduplayground/shared/error";
import type { ProfileResponse, UpdateProfileRequestBody } from "@eduplayground/shared/user";
import { readUsersDB, writeUsersDB } from "./users.repository";

const router = Router();

router.get(
  "/profile",
  verifyToken,
  (request: AuthRequest, response: Response<ProfileResponse | ErrorResponse>): void => {
    const userDatabase = readUsersDB();

    const user = userDatabase.users.find((u) => u.username === request.user?.username);
    if (!user) {
      response.status(404).json({ message: "User not found" });
      return;
    }
    response.json({ user });
  }
);

router.put(
  "/profile",
  verifyToken,
  (
    request: Request<object, ProfileResponse | ErrorResponse, UpdateProfileRequestBody>,
    response: Response<ProfileResponse | ErrorResponse>
  ): void => {
    const userDatabase = readUsersDB();

    const userIndex = userDatabase.users.findIndex(
      (u) => u.username === (request as AuthRequest).user?.username
    );
    if (userIndex === -1) {
      response.status(404).json({ message: "User not found" });
      return;
    }
    const updates = { ...request.body };
    userDatabase.users[userIndex] = merge(userDatabase.users[userIndex], updates);
    writeUsersDB(userDatabase);
    response.json({ user: userDatabase.users[userIndex] });
  }
);

export { router as usersRouter };
