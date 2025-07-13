import express from "express";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";

const SECRET = "mySecretKey";
const PORT = 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(bodyParser.json());

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

const readMemoryCards = (): MemoryCard[] => {
  try {
    const data = fs.readFileSync("databases/memory-db.json", "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

const readDragDropDB = (): DragDropDB => {
  try {
    const data = fs.readFileSync("databases/drag-drop-db.json", "utf-8");
    return data ? JSON.parse(data) : { pairs: [], scores: [] };
  } catch (error) {
    return { pairs: [], scores: [] };
  }
};

const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

app.post("/signup", (req, res) => {
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
    id: db.users.length ? Math.max(...db.users.map((u) => u.id)) + 1 : 1,
    username,
    password,
  };

  db.users.push(newUser);
  writeUserDB(db);

  const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET, {
    expiresIn: "1h",
  });
  res.json({ token, userId: newUser.id, username: newUser.username });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  const db = readUserDB();
  const user = db.users.find((u) => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "1h" });
    res.json({ token, userId: user.id, username: user.username });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/signout", verifyToken, (req, res) => {
  res.json({ message: "Successfully signed out" });
});

app.get("/memory/cards", (req, res) => {
  const cards = readMemoryCards();
  res.json(cards);
});

app.get("/dragdrop/pairs", verifyToken, (req, res) => {
  const db = readDragDropDB();
  res.json(db.pairs);
});

app.get("/profile", verifyToken, (req: any, res) => {
  const userDb = readUserDB();
  const memoryDb = readMemoryCards();
  const dragDropDb = readDragDropDB();

  const user = userDb.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  //   const memoryScores = memoryDb.scores.filter((s) => s.userId === req.user.id);
  const dragDropScores = dragDropDb.scores.filter((s) => s.userId === req.user.id);

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    stats: {
      //   memoryGamesPlayed: memoryScores.length,
      //   memoryBestScore: memoryScores.length > 0 ? Math.max(...memoryScores.map((s) => s.score)) : 0,
      dragDropGamesPlayed: dragDropScores.length,
      dragDropBestScore:
        dragDropScores.length > 0 ? Math.max(...dragDropScores.map((s) => s.score)) : 0,
    },
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
