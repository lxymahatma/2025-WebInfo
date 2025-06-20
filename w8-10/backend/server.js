const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const SECRET = "mySecretKey";
const PORT = 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(bodyParser.json());

app.get("/posts", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    res.json(db.posts);
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
  const user = db.users.find((u) => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "1h" });
    res.json({ token, userId: user.id });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/posts", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    const { title, body } = req.body;
    const newPost = {
      id: db.posts.length ? Math.max(...db.posts.map((p) => p.id)) + 1 : 1,
      title,
      body,
      userId: user.id,
    };
    db.posts.push(newPost);
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
    res.json(newPost);
  });
});

app.put("/posts/:id", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    const postId = parseInt(req.params.id);
    const postIndex = db.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return res.status(404).json({ message: "Post not found" });
    if (db.posts[postIndex].userId !== user.id)
      return res.status(403).json({ message: "No permission" });
    const { title, body } = req.body;
    db.posts[postIndex].title = title;
    db.posts[postIndex].body = body;
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
    res.json(db.posts[postIndex]);
  });
});

app.delete("/posts/:id", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    const postId = parseInt(req.params.id);
    const postIndex = db.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return res.status(404).json({ message: "Post not found" });
    if (db.posts[postIndex].userId !== user.id)
      return res.status(403).json({ message: "No permission" });
    db.posts.splice(postIndex, 1);
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
    res.json({ message: "Post deleted" });
  });
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.emit("welcome", "Welcome! This is your first Socket.IO message.");

  socket.on("hello", () => {
    console.log(`User ${socket.id} said hello`);
    socket.emit("response", "Hi! Server got your hello.");
  });

  socket.on("send_message", ({ name, message }) => {
    const fullMessage = `${name}: ${message}`;
    console.log(`Sending message: ${fullMessage}`);
    io.emit("receive_message", fullMessage);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
