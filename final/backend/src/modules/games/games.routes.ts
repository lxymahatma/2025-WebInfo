import { Router, type Request, type Response } from "express";
import { shuffle, groupBy, sampleSize } from "es-toolkit";
import { verifyToken } from "shared/middleware";
import type { AuthRequest, ErrorResponse } from "shared/types";
import type {
  DragDropPair,
  GameDashboardResponse,
  GameStatsResponse,
  UpdateGameStatsRequest,
} from "./games.types";
import { readGamesDB } from "./games.repository";
import { readUsersDB, writeUsersDB } from "modules/users";

const router = Router();

router.get(
  "/dashboard",
  verifyToken,
  (req: AuthRequest, res: Response<GameDashboardResponse | ErrorResponse>) => {
    const gamesDb = readGamesDB();
    const usersDb = readUsersDB();

    const user = usersDb.users.find((u) => u.username === req.user?.username);

    const userStats = user?.gameStats ?? {
      dragdrop: 0,
      timed: 0,
      memory: 0,
    };

    res.json({
      dashboard: gamesDb.dashboard,
      userStats: userStats,
    });
  }
);

router.get("/memory/cards", (_req: Request, res: Response) => {
  const db = readGamesDB();

  if (db.memory.cards.length === 0) {
    return res.json({ cards: ["Dog", "Cat", "Mouse", "Hamster"] });
  }

  const cards = sampleSize(db.memory.cards, 4).map((card) => card.type);

  res.json({ cards });
});

router.get("/dragdrop/pairs", (req: Request, res: Response) => {
  const db = readGamesDB();
  const difficulty = req.query.difficulty as string;

  const itemsPerCategory = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const count = itemsPerCategory[difficulty as keyof typeof itemsPerCategory];

  const groupedPairs = groupBy(db.dragdrop.pairs, (pair) => pair.match);
  const selectedPairs: DragDropPair[] = [];

  Object.values(groupedPairs).forEach((categoryPairs) => {
    const sampledPairs = sampleSize(categoryPairs, Math.min(count, categoryPairs.length));
    selectedPairs.push(...sampledPairs);
  });

  const finalPairs = shuffle(selectedPairs);
  res.json(finalPairs);
});

router.get("/timed/questions", (req: Request, res: Response) => {
  const db = readGamesDB();
  const subject = req.query.subject as string;

  if (!subject) {
    return res.status(400).json({ message: "Subject parameter is required" });
  }

  const subjectQuestions = db.timed.questions.filter((q) => q.subject === subject);

  if (subjectQuestions.length === 0) {
    return res.status(404).json({ message: "No questions found for this subject" });
  }

  const shuffledQuestions = shuffle(subjectQuestions);
  res.json({ questions: shuffledQuestions });
});

router.get(
  "/stats",
  verifyToken,
  (req: AuthRequest, res: Response<GameStatsResponse | ErrorResponse>) => {
    const userDb = readUsersDB();
    const user = userDb.users.find((u) => u.username === req.user?.username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ stats: user.gameStats });
  }
);

router.post(
  "/stats/increment",
  verifyToken,
  (req: AuthRequest, res: Response<GameStatsResponse | ErrorResponse>) => {
    const { gameType }: UpdateGameStatsRequest = req.body as unknown as UpdateGameStatsRequest;

    if (!["dragdrop", "timed", "memory"].includes(gameType)) {
      return res.status(400).json({ message: "Invalid game type" });
    }

    const userDb = readUsersDB();
    const user = userDb.users.find((u) => u.username === req.user?.username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.gameStats[gameType]++;

    writeUsersDB(userDb);
    res.json({ stats: user.gameStats });
  }
);

router.post(
  "/stats/reset",
  verifyToken,
  (req: AuthRequest, res: Response<GameStatsResponse | ErrorResponse>) => {
    const userDb = readUsersDB();
    const user = userDb.users.find((u) => u.username === req.user?.username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.gameStats = {
      dragdrop: 0,
      timed: 0,
      memory: 0,
    };

    writeUsersDB(userDb);
    res.json({ stats: user.gameStats });
  }
);

export const gamesRouter = router;
