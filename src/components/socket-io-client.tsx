"use client";

import { useEffect } from "react";

export default function SocketIOClient() {
  useEffect(() => {
    fetch("/api/socketio");
  }, []);

  return null; // This component doesn't render anything
}
