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
  User,
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
    const data = fs.readFileSync("databases/user-db.json", "utf-8");
    return data ? JSON.parse(data) : { users: [] };
  } catch (error) {
    return { users: [] };
  }
};

const writeUserDB = (db: UserDB): void => {
  fs.writeFileSync("databases/user-db.json", JSON.stringify(db, null, 2));
};

// Memory Card database
const readMemoryDB = (): MemoryDB => {
  try {
    const data = fs.readFileSync("databases/memory-db.json", "utf-8");
    return data ? JSON.parse(data) : { cards: [] };
  } catch (error) {
    return { cards: [] };
  }
};

// Drag & Drop database
const readDragDropDB = (): DragDropDB => {
  try {
    const data = fs.readFileSync("databases/drag-drop-db.json", "utf-8");
    return data ? JSON.parse(data) : { pairs: [], scores: [] };
  } catch (error) {
    return { pairs: [], scores: [] };
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

app.get("/dragdrop/pairs", verifyToken, (req: AuthRequest, res: Response) => {
  const db = readDragDropDB();
  res.json(db.pairs);
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
      },
    });
  }
);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
