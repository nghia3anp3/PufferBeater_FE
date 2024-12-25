import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { initializeWebSocket, closeWebSocket } from "../socket";

export default function LoadingPage() {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState({
    player1: false,
    player2: false,
  });
  const [playerNumber, setPlayerNumber] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socketInstance = initializeWebSocket();

    socketInstance.on("sessionIdAssigned", ({ sessionId }) => {
      console.log(`Session ID received: ${sessionId}`);
      localStorage.setItem("sessionId", sessionId);
    });

    socketInstance.on("playerStatus", (statuses) => {
      setStatus(statuses);
    });

    socketInstance.on("playerAssigned", (data) => {
      setPlayerNumber(data.playerNumber);
    });

    socketInstance.on("gameStart", (data) => {
      navigate(`/multiplayer/${data.gameId}`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("sessionIdAssigned");
      socketInstance.off("playerStatus");
      socketInstance.off("playerAssigned");
      socketInstance.off("gameStart");
      closeWebSocket();
    };
  }, [navigate]);

  const handleStartGame = () => {
    if (socket) {
      socket.emit("startGame");
    }
  };

  const handleLeave = () => {
    if (socket) {
      socket.emit("playerLeave");
      closeWebSocket();
    }
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Waiting for Players...
      </Typography>
      <Typography variant="h6">
        {status.player1 ? "Player 1 connected" : "Player 1 not connected"}
      </Typography>
      <Typography variant="h6">
        {status.player2 ? "Player 2 connected" : "Player 2 not connected"}
      </Typography>
      <Button
        variant="contained"
        onClick={handleStartGame}
        disabled={!status.player1 || !status.player2}
        sx={{ margin: "10px" }}
      >
        Start Game
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLeave}
        sx={{ margin: "10px" }}
      >
        Leave
      </Button>
    </Box>
  );
}
