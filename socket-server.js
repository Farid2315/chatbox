const { createServer } = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const httpServer = createServer();
const prisma = new PrismaClient();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  
  socket.on("send-message", async (data) => {
    console.log("Message received:", data);
    const { room, message, sender, conversationId } = data;
    
    try {
      // Save message to database
      const savedMessage = await prisma.message.create({
        data: {
          conversationId: conversationId || room,
          senderType: sender === 'admin' ? 'USER' : 'CUSTOMER',
          content: message,
        },
      });
      
      console.log("Message saved to database:", savedMessage.id);
      
      // Broadcast to room with message ID
      io.to(room).emit("receive-message", { 
        message, 
        sender, 
        messageId: savedMessage.id,
        timestamp: savedMessage.createdAt 
      });
      
      // Emit message sent confirmation
      socket.emit("message-sent", { 
        messageId: savedMessage.id,
        status: 'sent'
      });
      
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("message-error", { error: "Failed to save message" });
    }
  });

  socket.on("join-room", (room) => {
    console.log("Client joining room:", room);
    socket.join(room);
    console.log(`Client ${socket.id} joined room ${room}`);
    console.log(`Room ${room} now has ${io.sockets.adapter.rooms.get(room)?.size || 0} clients`);
  });

  socket.on("mark-seen", async (data) => {
    try {
      const { messageId } = data;
      await prisma.message.update({
        where: { id: messageId },
        data: { seenAt: new Date() }
      });
      console.log(`Message ${messageId} marked as seen`);
    } catch (error) {
      console.error("Error marking message as seen:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
