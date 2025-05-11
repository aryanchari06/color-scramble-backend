import { Server } from "socket.io";
import { selectColors } from "./src/colors.js";

export const startWs = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("join-room", (roomId) => {
      let scoreYou = 0;
      socket.join(roomId);

      io.to(roomId).emit("new-user", {
        message: `User ${socket.id} has joined the room ${roomId}`,
      });

      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      let wrongCount = io.sockets.adapter.rooms.get(roomId)?.wrongCount || 0;

      console.log("Clients in the room: ", clients);

      // Initialize wrongCount for the room if it doesn't exist
      if (!io.sockets.adapter.rooms.get(roomId)?.wrongCount) {
        io.sockets.adapter.rooms.get(roomId).wrongCount = 0;
      }

      if (clients.length >= 2) {
        const { randomColorName, shuffledObj } = selectColors();
        io.to(roomId).emit("game-data", { randomColorName, shuffledObj });
      }

      socket.on("correct-answer", (payload) => {
        console.log(payload);
        console.log("wrongCounts", wrongCount);
        if (payload.user === socket.id) scoreYou++;
        io.to(roomId).emit("correct-answer", {
          message: "Correct Answer",
          user: payload.user,
        });

        const { randomColorName, shuffledObj } = selectColors();
        io.to(roomId).emit("game-data", { randomColorName, shuffledObj });
        wrongCount = 0; // reset the wrong count when someone answers correctly
      });

      socket.on("wrong-answer", () => {
        // Increment the wrongCount for this room
        io.sockets.adapter.rooms.get(roomId).wrongCount++;
        wrongCount = io.sockets.adapter.rooms.get(roomId).wrongCount;

        console.log(wrongCount);
        if (wrongCount === clients.length) {
          const { randomColorName, shuffledObj } = selectColors();
          io.to(roomId).emit("game-data", { randomColorName, shuffledObj });
          io.sockets.adapter.rooms.get(roomId).wrongCount = 0; // reset wrongCount for the room
        }
      });

      socket.on("update-score", (payload) => {
        console.log(payload);
        payload.score = scoreYou;
        io.to(roomId).emit("update-score", { payload });
      });

      socket.on('disconnect', () => {
        socket.leave(roomId);
        console.log('Clients in my room', clients);
      });
    });

    socket.on("message", (msg) => {
      console.log(msg);
    });
  });
};
