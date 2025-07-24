import type { ErrorResponse } from "@eduplayground/shared/error";
import type {
  DragDropPairsResponse,
  GameDashboardResponse,
  GameStatsResponse,
  MemoryCardsResponse,
  UpdateGameStatsRequest,
} from "@eduplayground/shared/game";
import { groupBy, sampleSize, shuffle } from "es-toolkit";
import { type Request, type Response, Router } from "express";
import { readUsersDB, writeUsersDB } from "modules/users";
import { verifyToken } from "shared/middleware";
import type { AuthRequest } from "shared/types";

import { readGamesDB } from "./games.repository";

const router = Router();

router.get(
  "/dashboard",
  verifyToken,
  (request: AuthRequest, response: Response<GameDashboardResponse | ErrorResponse>) => {
    const gamesDatabase = readGamesDB();
    const usersDatabase = readUsersDB();

    const user = usersDatabase.users.find((u) => u.username === request.user?.username);

    const userStats = user?.gameStats ?? {
      dragdrop: 0,
      timed: 0,
      memory: 0,
    };

    response.json({
      dashboard: gamesDatabase.dashboard,
      userStats: userStats,
    });
  }
);

router.get(
  "/memory/cards",
  (_request: Request, response: Response<MemoryCardsResponse | ErrorResponse>) => {
    const database = readGamesDB();

    const cards = sampleSize(database.memory.cards, 4);

    response.json({ cards });
  }
);

router.get(
  "/dragdrop/pairs",
  (request: Request, response: Response<DragDropPairsResponse | ErrorResponse>) => {
    const database = readGamesDB();
    const difficulty = request.query.difficulty as string;

    const itemsPerCategory = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    const count = itemsPerCategory[difficulty as keyof typeof itemsPerCategory];

    const shuffledPairs = shuffle(database.dragdrop.pairs);
    const groupedPairs = groupBy(shuffledPairs, (pair) => pair.category);

    const selectedPairs = Object.values(groupedPairs).flatMap((categoryPairs) =>
      sampleSize(categoryPairs, Math.min(count, categoryPairs.length))
    );

    response.json({ pairs: shuffle(selectedPairs) });
  }
);

router.get("/timed/questions", (request: Request, response: Response) => {
  const database = readGamesDB();
  const subject = request.query.subject as string;

  if (!subject) {
    return response.status(400).json({ message: "Subject parameter is required" });
  }

  const subjectQuestions = database.timed.questions.filter((q) => q.subject === subject);

  if (subjectQuestions.length === 0) {
    return response.status(404).json({ message: "No questions found for this subject" });
  }

  const shuffledQuestions = shuffle(subjectQuestions);
  response.json({ questions: shuffledQuestions });
});

router.get(
  "/stats",
  verifyToken,
  (request: AuthRequest, response: Response<GameStatsResponse | ErrorResponse>) => {
    const userDatabase = readUsersDB();
    const user = userDatabase.users.find((u) => u.username === request.user?.username);

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    response.json({ stats: user.gameStats });
  }
);

router.post(
  "/stats/increment",
  verifyToken,
  (request: AuthRequest, response: Response<GameStatsResponse | ErrorResponse>) => {
    const { gameType }: UpdateGameStatsRequest = request.body as UpdateGameStatsRequest;

    if (!["dragdrop", "timed", "memory"].includes(gameType)) {
      return response.status(400).json({ message: "Invalid game type" });
    }

    const userDatabase = readUsersDB();
    const user = userDatabase.users.find((u) => u.username === request.user?.username);

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    user.gameStats[gameType]++;

    writeUsersDB(userDatabase);
    response.json({ stats: user.gameStats });
  }
);

router.post(
  "/stats/reset",
  verifyToken,
  (request: AuthRequest, response: Response<GameStatsResponse | ErrorResponse>) => {
    const userDatabase = readUsersDB();
    const user = userDatabase.users.find((u) => u.username === request.user?.username);

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    user.gameStats = {
      dragdrop: 0,
      timed: 0,
      memory: 0,
    };

    writeUsersDB(userDatabase);
    response.json({ stats: user.gameStats });
  }
);

export const gamesRouter = router;
