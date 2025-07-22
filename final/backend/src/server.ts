import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { authRouter, usersRouter, gamesRouter, languagesRouter } from "modules";

const PORT = 3001;

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

app.use("/", authRouter);
app.use("/", usersRouter);
app.use("/game", gamesRouter);
app.use("/languages", languagesRouter);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
