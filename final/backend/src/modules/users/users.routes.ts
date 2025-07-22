import { Router } from "express";
import type { Request, Response } from "express";
import { pick, merge } from "es-toolkit";
import { verifyToken } from "shared/middleware";
import type { AuthRequest, ErrorResponse } from "shared/types";
import type { ProfileResponse, UpdateProfileRequestBody } from "./users.types";
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
    response.json({
      user: pick(user, ["username", "password"]),
    });
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
    response.json({
      user: pick(userDatabase.users[userIndex], ["username", "password"]),
    });
  }
);

export { router as usersRouter };
