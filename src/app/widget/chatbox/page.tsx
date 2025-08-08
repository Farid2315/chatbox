"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";

export default function WidgetChatbox() {
  const params = useSearchParams();
  const room = params.get("room") || "default-room";

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
    console.log("Widget connecting to room:", room);
    const s = io("http://localhost:3001");
    setSocket(s);

    s.on("connect", () => {
      console.log("Widget connected to Socket.IO");
      s.emit("join-room", room);
    });

    s.on("receive-message", (data: { message: string; sender?: string; messageId?: string; timestamp?: Date }) => {
      console.log("Widget received message:", data);
      setMessages((prev) => [...prev, { 
        message: data.message, 
        sender: data.sender, 
        messageId: data.messageId,
        timestamp: data.timestamp,
        status: 'sent'
      }]);
      
      // Notify parent widget if message is from admin
      if (data.sender === 'admin') {
        window.parent.postMessage({
          type: 'new-message',
          sender: data.sender,
          message: data.message
        }, '*');
      }
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
      console.log("Widget disconnected from Socket.IO");
    });

    return () => {
      s.disconnect();
    };
  }, [room]);

  const send = () => {
    if (!socket || !message) return;
    console.log("Widget sending message:", { room, message, sender: "customer" });
    
    // Add message to UI immediately with sending status
    const tempMessage = { 
      message, 
      sender: "customer" as const, 
      status: 'sending' as const,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, tempMessage]);
    
    // Send to server
    socket.emit("send-message", { 
      room, 
      message, 
      sender: "customer",
      conversationId: room 
    });
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flexGrow: 1, overflowY: "auto", padding: 10 }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px',
            marginTop: '20px'
          }}>
            👋 Welcome! How can we help you today?
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ 
            margin: "8px 0", 
            textAlign: m.sender === "admin" ? "left" : "right",
            position: 'relative'
          }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: '18px',
              backgroundColor: m.sender === "admin" ? '#f3f4f6' : '#3b82f6',
              color: m.sender === "admin" ? '#374151' : 'white',
              position: 'relative',
              fontSize: '14px',
              lineHeight: '1.4'
            }}>
              <p style={{ margin: 0, wordWrap: 'break-word' }}>{m.message}</p>
              {m.sender === "customer" && (
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
      <div style={{ padding: 15, borderTop: "1px solid #e5e7eb", backgroundColor: '#f9fafb' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <input
            style={{ 
              flex: 1, 
              padding: '12px 16px', 
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            value={message}
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          <button 
            onClick={send} 
            disabled={!message.trim()}
            style={{ 
              padding: '12px 16px', 
              backgroundColor: message.trim() ? '#3b82f6' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: message.trim() ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s ease'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
