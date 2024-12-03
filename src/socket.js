import { io } from "socket.io-client";

let socket = null;

export const initializeWebSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", { transports: ["websocket"] });

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
