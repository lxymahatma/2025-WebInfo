import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyToken, SECRET } from "middleware";
import {
  AuthRequest,
  AuthResponse,
  ErrorResponse,
  SignupRequestBody,
  SigninRequestBody,
  User,
} from "types";
import { readUserDB, writeUserDB } from "utils";

const router = Router();

router.post(
  "/signup",
  (
    req: Request<{}, AuthResponse | ErrorResponse, SignupRequestBody>,
    res: Response<AuthResponse | ErrorResponse>
  ) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const db = readUserDB();
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
    writeUserDB(db);

    const token = jwt.sign({ username: newUser.username }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, username: newUser.username });
  }
);

router.post(
  "/signin",
  (
    req: Request<{}, AuthResponse | ErrorResponse, SigninRequestBody>,
    res: Response<AuthResponse | ErrorResponse>
  ) => {
    const { username, password } = req.body;
    const db = readUserDB();
    const user = db.users.find((u) => u.username === username && u.password === password);

    if (user) {
      const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: "1h" });
      res.json({ token, username: user.username });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  }
);

router.post("/signout", verifyToken, (req: AuthRequest, res: Response<ErrorResponse>) => {
  res.json({ message: "Successfully signed out" });
});

export const authRouter = router;
