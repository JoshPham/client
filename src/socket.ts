
"use client";
import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://materialism-and-happiness.org";

// Make sure the path is set correctly
export const socket = io(SOCKET_URL, {
  path: "/socket.io/",
  transports: ["websocket"],
  secure: true,
  reconnection: true,
  reconnectionAttempts: 5,
});