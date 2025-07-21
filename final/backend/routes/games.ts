import { Router, Request, Response } from "express";
import { randomInt, shuffle, groupBy, sampleSize, uniq } from "es-toolkit";
import { readGamesDB, readUserDB, writeUserDB } from "utils";
import { verifyToken } from "middleware";
import { AuthRequest, GameStatsResponse, ErrorResponse, UpdateGameStatsRequest } from "types";

const router = Router();

router.get("/info", (req: Request, res: Response) => {
  const db = readGamesDB();
  res.json(db.gameInfo);
});

router.get("/memory/cards", (req: Request, res: Response) => {
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
  const selectedPairs: any[] = [];

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

  // Use es-toolkit's shuffle for better randomization
  const shuffledQuestions = shuffle(subjectQuestions);
  res.json({ questions: shuffledQuestions });
});

router.get(
  "/stats",
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
  "/stats/increment",
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
  "/stats/reset",
  verifyToken,
  (req: AuthRequest, res: Response<GameStatsResponse | ErrorResponse>) => {
    const userDb = readUserDB();
    const user = userDb.users.find((u) => u.username === req.user?.username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.gameStats = {
      dragdrop: 0,
      timed: 0,
      memory: 0,
    };

    writeUserDB(userDb);
    res.json({ stats: user.gameStats });
  }
);

export const gameRouter = router;
