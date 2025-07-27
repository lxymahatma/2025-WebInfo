import http from "node:http";

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { authRouter, gamesRouter, languagesRouter, usersRouter } from "modules";
import { SERVER_PORT } from "shared/config/constants";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

app.use("/", authRouter);
app.use("/", usersRouter);
app.use("/game", gamesRouter);
app.use("/language", languagesRouter);

server.listen(SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${SERVER_PORT}`);
});
