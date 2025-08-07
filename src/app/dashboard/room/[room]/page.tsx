"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";

export default function AdminChatRoom() {
  const { room } = useParams();
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ message: string; sender?: string }[]>([]);

  useEffect(() => {
    console.log("Dashboard connecting to room:", room);
    const s = io("http://localhost:3001");
    setSocket(s);

    s.on("connect", () => {
      console.log("Dashboard connected to Socket.IO");
      s.emit("join-room", room);
    });

    s.on("receive-message", (data: { message: string; sender?: string }) => {
      console.log("Dashboard received message:", data);
      setMessages((prev) => [...prev, { message: data.message, sender: data.sender }]);
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
    socket.emit("send-message", { room, message, sender: "admin" });
    setMessages((prev) => [...prev, { message, sender: "admin" }]);
    setMessage("");
  };

  return (
    <div>
      <h2>Room: {room}</h2>
      <div style={{ height: "60vh", overflowY: "auto", border: "1px solid #ccc", padding: 8 }}>
        {(messages).map((m, idx) => (
          <div key={idx} style={{ textAlign: m.sender === "admin" ? "right" : "left", margin: 4 }}>
            <span>{m.message}</span>
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
