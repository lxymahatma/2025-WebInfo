import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { isString, trim } from "es-toolkit";
import { verifyToken, SECRET } from "shared/middleware";
import type {
  AuthRequest,
  AuthResponse,
  ErrorResponse,
  SignupRequestBody,
  SigninRequestBody,
} from "./auth.types";
import type { User } from "modules/users";
import { readUsersDB, writeUsersDB } from "modules/users";

const router = Router();

router.post(
  "/signup",
  (
    req: Request<object, AuthResponse | ErrorResponse, SignupRequestBody>,
    res: Response<AuthResponse | ErrorResponse>
  ) => {
    const { username, password } = req.body;

    if (!isString(username) || !isString(password) || !trim(username) || !trim(password)) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const db = readUsersDB();
    const existingUser = db.users.find((u) => u.username === username);

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser: User = {
      username,
      password,
      gameStats: {
        dragdrop: 0,
        timed: 0,
        memory: 0,
      },
      language: "Eng",
    };

    db.users.push(newUser);
    writeUsersDB(db);

    const token = jwt.sign({ username: newUser.username }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, username: newUser.username });
  }
);

router.post(
  "/signin",
  (
    req: Request<object, AuthResponse | ErrorResponse, SigninRequestBody>,
    res: Response<AuthResponse | ErrorResponse>
  ) => {
    const { username, password } = req.body;
    const db = readUsersDB();
    const user = db.users.find((u) => u.username === username && u.password === password);

    if (user) {
      const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: "1h" });
      res.json({ token, username: user.username });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  }
);

router.post("/signout", verifyToken, (_req: AuthRequest, res: Response<ErrorResponse>) => {
  res.json({ message: "Successfully signed out" });
});

export const authRouter = router;
