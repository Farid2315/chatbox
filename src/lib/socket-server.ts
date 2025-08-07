import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";

let io: SocketIOServer | null = null;

export function initSocketServer() {
  if (io) return io;

  const httpServer = createServer();
  
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    socket.on("send-message", (data) => {
      console.log("Message received:", data);
      const { room, message, sender } = data;
      io?.to(room).emit("receive-message", { message, sender });
    });

    socket.on("join-room", (room) => {
      console.log("Client joining room:", room);
      socket.join(room);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  const PORT = process.env.SOCKET_PORT || 3001;
  httpServer.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
  });

  return io;
}

export function getSocketServer() {
  return io;
}
