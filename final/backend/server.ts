import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import { authRouter, userRouter, gameRouter, languageRouter } from "routes";

const PORT = 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(bodyParser.json());

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", gameRouter);
app.use("/languages", languageRouter);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
