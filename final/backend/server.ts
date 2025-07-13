import express from "express";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";
import { randomInt } from "es-toolkit";
import {
  UserDB,
  MemoryDB,
  DragDropDB,
  TimedQuestionDB,
  User,
  GameStats,
  GameStatsResponse,
  UpdateGameStatsRequest,
  AuthRequest,
  SignupRequestBody,
  SigninRequestBody,
  AuthResponse,
  ErrorResponse,
  ProfileResponse,
  Request,
  Response,
  NextFunction,
} from "./types";

const SECRET = "mySecretKey";
const PORT = 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(bodyParser.json());

// User database
const readUserDB = (): UserDB => {
  try {
    const data = fs.readFileSync("databases/user.json", "utf-8");
    return data ? JSON.parse(data) : { users: [] };
  } catch (error) {
    return { users: [] };
  }
};

const writeUserDB = (db: UserDB): void => {
  fs.writeFileSync("databases/user.json", JSON.stringify(db, null, 2));
};

// Memory Card database
const readMemoryDB = (): MemoryDB => {
  try {
    const data = fs.readFileSync("databases/memory.json", "utf-8");
    return data ? JSON.parse(data) : { cards: [] };
  } catch (error) {
    return { cards: [] };
  }
};

// Drag & Drop database
const readDragDropDB = (): DragDropDB => {
  try {
    const data = fs.readFileSync("databases/dragdrop.json", "utf-8");
    return data ? JSON.parse(data) : { pairs: [], scores: [] };
  } catch (error) {
    return { pairs: [], scores: [] };
  }
};

// Timed database
const readTimedDB = (): TimedQuestionDB => {
  try {
    const data = fs.readFileSync("databases/timed.json", "utf-8");
    return data ? JSON.parse(data) : { questions: [] };
  } catch (error) {
    return { questions: [] };
  }
};

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

app.post(
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
    };

    db.users.push(newUser);
    writeUserDB(db);

    const token = jwt.sign({ username: newUser.username }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, username: newUser.username });
  }
);

app.post(
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

app.post("/signout", verifyToken, (req: AuthRequest, res: Response<ErrorResponse>) => {
  res.json({ message: "Successfully signed out" });
});

app.get("/memory/cards", (req: Request, res: Response) => {
  const memoryDB = readMemoryDB();

  if (memoryDB.cards.length === 0) {
    return res.json({ cards: ["Dog", "Cat", "Mouse", "Hamster"] });
  }

  const randomIndices: number[] = [];

  while (randomIndices.length < 4 && randomIndices.length < memoryDB.cards.length) {
    const randomIndex = randomInt(0, memoryDB.cards.length);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }

  const cards = randomIndices.map((index) => memoryDB.cards[index].type);

  res.json({ cards });
});

app.get("/dragdrop/pairs", (req: Request, res: Response) => {
  const db = readDragDropDB();
  const difficulty = req.query.difficulty as string;

  const itemsPerCategory = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const count = itemsPerCategory[difficulty as keyof typeof itemsPerCategory];

  const categories = Array.from(new Set(db.pairs.map((p) => p.match)));
  const selectedPairs: any[] = [];

  for (const category of categories) {
    const categoryPairs = db.pairs.filter((p) => p.match === category);
    const shuffled = categoryPairs.sort(() => Math.random() - 0.5);
    selectedPairs.push(...shuffled.slice(0, count));
  }

  const finalPairs = selectedPairs.sort(() => Math.random() - 0.5);
  res.json(finalPairs);
});

app.get("/timed/questions", (req: Request, res: Response) => {
  const db = readTimedDB();
  const subject = req.query.subject as string;

  if (!subject) {
    return res.status(400).json({ message: "Subject parameter is required" });
  }

  const subjectQuestions = db.questions.filter((q) => q.subject === subject);

  if (subjectQuestions.length === 0) {
    return res.status(404).json({ message: "No questions found for this subject" });
  }

  const shuffledQuestions = subjectQuestions.sort(() => Math.random() - 0.5);
  res.json({ questions: shuffledQuestions });
});

app.get(
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

// Game Tracker
app.get(
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

app.post(
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

app.post(
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

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
