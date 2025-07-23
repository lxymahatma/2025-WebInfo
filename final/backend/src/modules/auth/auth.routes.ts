import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { isString, trim } from "es-toolkit";
import { verifyToken, SECRET } from "shared/middleware";
import type { AuthRequest } from "shared/types";
import type { ErrorResponse } from "@eduplayground/shared/error";
import type {
  AuthResponse,
  SignupRequestBody,
  SigninRequestBody,
} from "@eduplayground/shared/auth";
import type { User } from "@eduplayground/shared/user";
import { readUsersDB, writeUsersDB } from "modules/users";

const router = Router();

router.post(
  "/signup",
  (
    request: Request<object, AuthResponse | ErrorResponse, SignupRequestBody>,
    response: Response<AuthResponse | ErrorResponse>
  ) => {
    const { username, password } = request.body;

    if (!isString(username) || !isString(password) || !trim(username) || !trim(password)) {
      return response.status(400).json({ message: "Username and password are required" });
    }

    const database = readUsersDB();
    const existingUser = database.users.find((u) => u.username === username);

    if (existingUser) {
      return response.status(400).json({ message: "Username already exists" });
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

    database.users.push(newUser);
    writeUsersDB(database);

    const token = jwt.sign({ username: newUser.username }, SECRET, {
      expiresIn: "1h",
    });
    response.json({ token, username: newUser.username });
  }
);

router.post(
  "/signin",
  (
    request: Request<object, AuthResponse | ErrorResponse, SigninRequestBody>,
    response: Response<AuthResponse | ErrorResponse>
  ) => {
    const { username, password } = request.body;
    const database = readUsersDB();
    const user = database.users.find((u) => u.username === username && u.password === password);

    if (user) {
      const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: "1h" });
      response.json({ token, username: user.username });
    } else {
      response.status(401).json({ message: "Invalid credentials" });
    }
  }
);

router.post("/signout", verifyToken, (_request: AuthRequest, response: Response<ErrorResponse>) => {
  response.json({ message: "Successfully signed out" });
});

export const authRouter = router;
