import { Router, Request, Response } from "express";
import { pick, merge } from "es-toolkit";
import { verifyToken } from "shared/middleware";
import {
  AuthRequest,
  ProfileResponse,
  ErrorResponse,
  UpdateProfileRequestBody,
} from "./users.types";
import { readUsersDB, writeUsersDB } from "./users.repository";

const router = Router();

router.get(
  "/profile",
  verifyToken,
  (req: AuthRequest, res: Response<ProfileResponse | ErrorResponse>) => {
    const userDb = readUsersDB();

    const user = userDb.users.find((u) => u.username === req.user?.username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: pick(user, ["username", "password"]),
    });
  }
);

router.put(
  "/profile",
  verifyToken,
  (
    req: Request<{}, ProfileResponse | ErrorResponse, UpdateProfileRequestBody>,
    res: Response<ProfileResponse | ErrorResponse>
  ) => {
    const userDb = readUsersDB();
    const userIndex = userDb.users.findIndex(
      (u) => u.username === (req as AuthRequest).user?.username
    );

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = { ...req.body };
    userDb.users[userIndex] = merge(userDb.users[userIndex], updates);

    writeUsersDB(userDb);

    res.json({
      user: pick(userDb.users[userIndex], ["username", "password"]),
    });
  }
);

export const usersRouter = router;
