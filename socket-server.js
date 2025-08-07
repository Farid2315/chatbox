const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();

const io = new Server(httpServer, {
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
    console.log(`Broadcasting to room ${room}:`, { message, sender });
    io.to(room).emit("receive-message", { message, sender });
  });

  socket.on("join-room", (room) => {
    console.log("Client joining room:", room);
    socket.join(room);
    console.log(`Client ${socket.id} joined room ${room}`);
    console.log(`Room ${room} now has ${io.sockets.adapter.rooms.get(room)?.size || 0} clients`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
