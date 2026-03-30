"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    socketRef.current = io(process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL, {
      auth: { token },
    });
    socketRef.current.on("connect", () => {
      (console.log("Socket connected"), socketRef.current?.id);
    });
    socketRef.current.on("disconnect", () => {
      (console.log("Socket disconnected"), socketRef.current?.id);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  return socketRef;
}
