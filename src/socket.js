import { io } from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
let socket = null;

export const initializeWebSocket = () => {
  let playerName = JSON.parse(localStorage.getItem("user"));
  if (!socket) {
    socket = io(`${BACKEND_URL}`, {
      transports: ["websocket"],
      query: { name: playerName },
    });

    socket.on("connect", () => {
      console.log("WebSocket connected", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("WebSocket disconnected:", reason);
    });
  }
  return socket;
};

export const getWebSocket = () => {
  if (!socket) {
    throw new Error(
      "WebSocket is not initialized. Call initializeWebSocket first."
    );
  }
  return socket;
};

export const closeWebSocket = () => {
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
};
