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

// Sign up endpoint
app.post("/signup", (req, res) => {
  const { email, username, password } = req.body;
  
  // Validate required fields
  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
  
  // Check if user already exists
  const existingUser = db.users.find(
    (u) => u.username === username || u.email === email
  );
  
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  
  // Create new user
  const newUser = {
    id: db.users.length ? Math.max(...db.users.map((u) => u.id)) + 1 : 1,
    email,
    username,
    password, // In production, hash this password
  };
  
  db.users.push(newUser);
  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
  
  // Generate token
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username },
    SECRET,
    { expiresIn: "1h" }
  );
  
  res.json({
    message: "User created successfully",
    token,
    userId: newUser.id,
    username: newUser.username,
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
  const user = db.users.find((u) => u.username === username && u.password === password);
  
  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "1h" });
    res.json({ 
      token, 
      userId: user.id,
      username: user.username,
      message: "Login successful"
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Protected route to get user profile
app.get("/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    const userProfile = db.users.find((u) => u.id === user.id);
    
    if (userProfile) {
      // Don't send password in response
      const { password, ...userWithoutPassword } = userProfile;
      res.json(userWithoutPassword);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

// Socket.IO connection handling
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

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});