import { Router, Request, Response } from "express";
import { verifyToken } from "middleware";
import {
  AuthRequest,
  ProfileResponse,
  ErrorResponse,
  UpdateProfileRequestBody,
  GameStatsResponse,
  UpdateGameStatsRequest,
} from "types";
import { readUserDB, writeUserDB } from "utils";

const router = Router();

router.get(
  "/profile",
  verifyToken,
  (req: AuthRequest, res: Response<ProfileResponse | ErrorResponse>) => {
    const userDb = readUserDB();

    const user = userDb.users.find((u) => u.username === req.user?.username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        username: user.username,
        password: user.password,
      },
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
    const userDb = readUserDB();
    const userIndex = userDb.users.findIndex(
      (u) => u.username === (req as AuthRequest).user?.username
    );

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, password } = req.body;

    if (username !== undefined) {
      userDb.users[userIndex].username = username;
    }
    if (password !== undefined) {
      userDb.users[userIndex].password = password;
    }

    writeUserDB(userDb);

    res.json({
      user: {
        username: userDb.users[userIndex].username,
        password: userDb.users[userIndex].password,
      },
    });
  }
);

router.get(
  "/game-stats",
  verifyToken,
  (req: AuthRequest, res: Response<GameStatsResponse | ErrorResponse>) => {
    const userDb = readUserDB();
    const user = userDb.users.find((u) => u.username === req.user?.username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.gameStats) {
      user.gameStats = {
        dragdrop: 0,
        timed: 0,
        memory: 0,
      };
      writeUserDB(userDb);
    }

    res.json({ stats: user.gameStats });
  }
);

router.post(
  "/game-stats/increment",
  verifyToken,
  (
    req: Request<{}, GameStatsResponse | ErrorResponse, UpdateGameStatsRequest>,
    res: Response<GameStatsResponse | ErrorResponse>
  ) => {
    const { gameType } = req.body;
    const authReq = req as AuthRequest;

    if (!gameType || !["dragdrop", "timed", "memory"].includes(gameType)) {
      return res.status(400).json({ message: "Invalid game type" });
    }

    const userDb = readUserDB();
    const user = userDb.users.find((u) => u.username === authReq.user?.username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.gameStats) {
      user.gameStats = {
        dragdrop: 0,
        timed: 0,
        memory: 0,
      };
    }

    user.gameStats[gameType]++;

    writeUserDB(userDb);
    res.json({ stats: user.gameStats });
  }
);

router.post(
  "/game-stats/reset",
  verifyToken,
  (req: AuthRequest, res: Response<GameStatsResponse | ErrorResponse>) => {
    const userDb = readUserDB();
    const user = userDb.users.find((u) => u.username === req.user?.username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Reset game stats
    user.gameStats = {
      dragdrop: 0,
      timed: 0,
      memory: 0,
    };

    writeUserDB(userDb);
    res.json({ stats: user.gameStats });
  }
);

export const userRouter = router;
