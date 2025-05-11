import express from "express";
import dotenv from "dotenv";
import { startWs } from "./app.js";
import cors from "cors";
import http from "http";

const init = () => {
  const app = express();
  dotenv.config();
  const PORT = process.env.PORT;

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    })
  );
  app.use(express.json());

  const server = http.createServer(app);

  const socket = startWs(server);

  server.listen(PORT, () => {
    console.log(`APP listening on port ${PORT}`);
  });
};

init();
