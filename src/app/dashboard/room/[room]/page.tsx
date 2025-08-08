"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";

export default function AdminChatRoom() {
  const { room } = useParams();
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ 
    message: string; 
    sender?: string; 
    messageId?: string;
    timestamp?: Date;
    status?: 'sending' | 'sent' | 'error';
  }[]>([]);

  useEffect(() => {
    console.log("Dashboard connecting to room:", room);
    const s = io("http://localhost:3001");
    setSocket(s);

    s.on("connect", () => {
      console.log("Dashboard connected to Socket.IO");
      s.emit("join-room", room);
    });

    s.on("receive-message", (data: { message: string; sender?: string; messageId?: string; timestamp?: Date }) => {
      console.log("Dashboard received message:", data);
      setMessages((prev) => [...prev, { 
        message: data.message, 
        sender: data.sender, 
        messageId: data.messageId,
        timestamp: data.timestamp,
        status: 'sent'
      }]);
    });

    s.on("message-sent", (data: { messageId: string; status: string }) => {
      console.log("Message sent confirmation:", data);
      setMessages((prev) => 
        prev.map(msg => 
          msg.messageId === data.messageId 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
    });

    s.on("message-error", (data: { error: string }) => {
      console.error("Message error:", data);
      setMessages((prev) => 
        prev.map(msg => 
          msg.status === 'sending' 
            ? { ...msg, status: 'error' as const }
            : msg
        )
      );
    });

    s.on("disconnect", () => {
      console.log("Dashboard disconnected from Socket.IO");
    });

    return () => {
      s.disconnect();
    };
  }, [room]);

  const send = () => {
    if (!socket || !message) return;
    console.log("Dashboard sending message:", { room, message, sender: "admin" });
    
    // Add message to UI immediately with sending status
    const tempMessage = { 
      message, 
      sender: "admin" as const, 
      status: 'sending' as const,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, tempMessage]);
    
    // Send to server
    socket.emit("send-message", { 
      room, 
      message, 
      sender: "admin",
      conversationId: room 
    });
    setMessage("");
  };

  return (
    <div>
      <h2>Room: {room}</h2>
      <div style={{ height: "60vh", overflowY: "auto", border: "1px solid #ccc", padding: 8 }}>
        {(messages).map((m, idx) => (
          <div key={idx} style={{ 
            textAlign: m.sender === "admin" ? "right" : "left", 
            margin: 4,
            position: 'relative'
          }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '80%',
              padding: '8px 12px',
              borderRadius: '12px',
              backgroundColor: m.sender === "admin" ? '#3b82f6' : '#f3f4f6',
              color: m.sender === "admin" ? 'white' : 'black',
              position: 'relative'
            }}>
              <span>{m.message}</span>
              {m.sender === "admin" && (
                <div style={{
                  fontSize: '10px',
                  opacity: 0.7,
                  marginTop: '4px',
                  textAlign: 'right'
                }}>
                  {m.status === 'sending' && '⏳ Sending...'}
                  {m.status === 'sent' && '✓ Sent'}
                  {m.status === 'error' && '❌ Failed'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type reply..."
          style={{ width: "80%", padding: 8 }}
        />
        <button onClick={send} className="ml-2 px-4 py-2 bg-blue-600 text-white">
          Send
        </button>
      </div>
    </div>
  );
}
