import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const httpServer = createServer();
const prisma = new PrismaClient();

// Helper function to generate MongoDB ObjectID
function generateObjectId() {
  return Math.random().toString(16).substring(2, 10) + 
         Math.random().toString(16).substring(2, 10) + 
         Math.random().toString(16).substring(2, 10);
}

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
    const { room, message, sender, conversationId, customerEmail, customerName } = data;
    
    try {
      let savedMessage;
      let conversationId_final;
      let customerId;
      let organizationId;
      let isAuthenticated = false;

      if (sender === 'customer') {
        // Handle customer message through widget API
        try {
          console.log("Attempting to call widget API...");
          const response = await fetch('http://localhost:3002/api/widget/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': socket.handshake.headers.cookie || ''
            },
            body: JSON.stringify({
              message,
              roomId: room,
              customerEmail,
              customerName
            })
          });

          console.log("Widget API response status:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Widget API error response:", errorText);
            throw new Error(`Widget API error: ${response.status} - ${errorText}`);
          }

          const result = await response.json();
          console.log("Widget API success result:", result);
          
          savedMessage = result.message;
          conversationId_final = result.conversationId;
          customerId = result.customerId;
          organizationId = result.organizationId;
          isAuthenticated = result.isAuthenticated;

          console.log("Widget message processed:", {
            messageId: savedMessage.id,
            conversationId: conversationId_final,
            customerId,
            organizationId,
            isAuthenticated
          });

        } catch (apiError) {
          console.error("Widget API error:", apiError);
          console.log("Falling back to direct database save...");
          
          // Fallback to direct database save with proper ObjectID
          const fallbackConversationId = generateObjectId();
          savedMessage = await prisma.message.create({
            data: {
              conversationId: fallbackConversationId,
              senderType: 'CUSTOMER',
              content: message,
            },
          });
          conversationId_final = fallbackConversationId;
          console.log("Fallback message saved:", savedMessage.id);
        }

      } else {
        // Handle admin message (existing logic)
        console.log("Processing admin message...");
        
        // Generate proper ObjectID for conversation
        const adminConversationId = generateObjectId();
        
        savedMessage = await prisma.message.create({
          data: {
            conversationId: adminConversationId,
            senderType: sender === 'admin' ? 'USER' : 'CUSTOMER',
            content: message,
          },
        });
        conversationId_final = adminConversationId;
        console.log("Admin message saved:", savedMessage.id);
      }
      
      // Broadcast to room with message ID
      console.log("Broadcasting message to room:", room);
      io.to(room).emit("receive-message", { 
        message, 
        sender, 
        messageId: savedMessage.id,
        timestamp: savedMessage.createdAt,
        conversationId: conversationId_final,
        customerId,
        organizationId,
        isAuthenticated
      });
      
      // Emit message sent confirmation
      socket.emit("message-sent", { 
        messageId: savedMessage.id,
        status: 'sent',
        conversationId: conversationId_final
      });
      
    } catch (error) {
      console.error("Error saving message:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        data: { room, message, sender, conversationId, customerEmail, customerName }
      });
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
