"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";

export default function WidgetChatbox() {
  const params = useSearchParams();
  const room = params.get("room") || "default-room";

  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ message: string; sender?: string }[]>([]);

  useEffect(() => {
    console.log("Widget connecting to room:", room);
    const s = io("http://localhost:3001");
    setSocket(s);

    s.on("connect", () => {
      console.log("Widget connected to Socket.IO");
      s.emit("join-room", room);
    });

    s.on("receive-message", (data: { message: string; sender?: string }) => {
      console.log("Widget received message:", data);
      setMessages((prev) => [...prev, { message: data.message, sender: data.sender }]);
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
    socket.emit("send-message", { room, message, sender: "customer" });
    setMessages((prev) => [...prev, { message, sender: "customer" }]);
    setMessage("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flexGrow: 1, overflowY: "auto", padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "4px 0", textAlign: m.sender === "admin" ? "right" : "left" }}>
            <p>{m.message}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: 10, borderTop: "1px solid #ddd" }}>
        <input
          style={{ width: "80%", padding: 8 }}
          value={message}
          placeholder="Type..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={send} style={{ width: "18%", marginLeft: 8, padding: 8 }}>
          Send
        </button>
      </div>
    </div>
  );
}
