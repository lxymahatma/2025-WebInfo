const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(cors());
const PORT = 3001;
app.get("/posts", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    //const posts = db.posts.filter(p => p.userId === user.id);
    res.json(posts);
  });
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const SECRET = "mySecretKey";
app.use(bodyParser.json());
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
  const user = db.users.find((u) => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});
