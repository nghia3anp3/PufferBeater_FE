import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { initializeWebSocket, closeWebSocket, getWebSocket } from "../socket";

export default function LoadingPage() {
  const [playerNumber, setPlayerNumber] = useState(null);
  const [status, setStatus] = useState({
    player1: false,
    player2: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const socket = initializeWebSocket();

    socket.on("playerAssigned", (data) => {
      setPlayerNumber(data.playerNumber);
      console.log(data.playerNumber);
      socket.playerNumber = data.playerNumber;
    });

    socket.on("sessionIdAssigned", ({ sessionId }) => {
      console.log(`Session ID received: ${sessionId}`);
      localStorage.setItem("sessionId", sessionId);
    });

    socket.on("playerStatus", (statuses) => {
      setStatus(statuses);
    });

    socket.on("gameStart", () => {
      navigate(`/multiplayer`);
    });

    socket.on("full", () => {
      alert("the rooms is full");
      navigate(`/`);
    });

    return () => {
      socket.off("sessionIdAssigned");
      socket.off("playerStatus");
      socket.off("playerAssigned");
    };
  }, [navigate]);

  const handleStartGame = () => {
    const socket = getWebSocket();
    socket.emit("startGame");
  };

  const handleLeave = () => {
    const socket = getWebSocket();
    socket.emit("playerLeave");
    closeWebSocket();

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
