import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { authRouter, userRouter, gameRouter, languageRouter } from "routes";

const PORT = 3001;

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/game", gameRouter);
app.use("/languages", languageRouter);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
