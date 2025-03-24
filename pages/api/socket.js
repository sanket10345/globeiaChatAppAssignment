import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false
    });

    io.on("connection", (socket) => {
      console.log("User connected", socket.id);

      socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
      });

      socket.on("sendMessage", ({ room, message, username }) => {
        const timestamp = new Date().toISOString();
        io.to(room).emit("receiveMessage", { username, message, timestamp });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
