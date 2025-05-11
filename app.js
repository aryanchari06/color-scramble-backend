import { Server } from "socket.io";
import { selectColors } from "./src/colors.js";

export const startWs = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  let wrongCount = 0;
  io.on("connection", (socket) => {
    console.log(socket.id);
    // socket.emit("new-user", { message: `New user connected ${socket.id}` });

    socket.on("join-room", (roomId) => {
      let scoreYou = 0;

      socket.join(roomId);
      // const clientsInRoom = io.sockets.(roomId);
      io.to(roomId).emit("new-user", {
        message: `User ${socket.id} has joined the room ${roomId}`,
      });

      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

      console.log("Clients in the room: ", clients);

      if (clients.length >= 2) {
        const { randomColorName, shuffledObj } = selectColors();
        // console.log(randomColorName)
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
        // console.log(randomColorName)
        io.to(roomId).emit("game-data", { randomColorName, shuffledObj });
        wrongCount = 0
      });

      socket.on("wrong-answer", () => {
        wrongCount++;
        console.log(wrongCount);
        if (wrongCount === clients.length) {
          // console.log("get new gamedata")
          const { randomColorName, shuffledObj } = selectColors();
          io.to(roomId).emit("game-data", { randomColorName, shuffledObj });
          wrongCount = 0;
        }
      });

      socket.on("update-score", (payload) => {
        console.log(payload);
        payload.score = scoreYou;
        io.to(roomId).emit("update-score", { payload });
      });

      socket.on('disconnect', () => {
        socket.leave(roomId)
        console.log('Clients in my room', clients)
      })
    });
    socket.on("message", (msg) => {
      console.log(msg);
    });

    // socket.on("disconnect", () => {
    //   socket.leave(roomId)
    // })
  });
};
