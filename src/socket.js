import { io } from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
let socket = null;

export const initializeWebSocket = () => {
  if (!socket) {
    socket = io(`${BACKEND_URL}`, { transports: ["websocket"] });

    // Connection event
    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    // Disconnection event
    socket.on("disconnect", (reason) => {
      console.warn("WebSocket disconnected:", reason);
    });
  }
  return socket;
};

export const closeWebSocket = () => {
  if (socket) {
    // Ensure all listeners are removed before disconnecting
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
