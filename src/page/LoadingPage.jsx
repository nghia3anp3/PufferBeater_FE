import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { socket } from './socket';

export default function LoadingPage() {
  const [player1Connected, setPlayer1Connected] = useState(false);
  const [player2Connected, setPlayer2Connected] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [ws, setWs] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const websocket = new WebSocket("wss://localhost:8080");

    websocket.onopen = () => {
      console.log("Connected to WebSocket server");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "playerStatus") {
        setPlayer1Connected(data.statuses.player1);
        setPlayer2Connected(data.statuses.player2);
      }

      if (data.type === "gameStart") {
        console.log("Game is starting...");
        navigate(`/multiplayer/gameId=${data.gameId}`);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => websocket.close(); // Clean up WebSocket on component unmount
  }, [navigate]);

  const handleStartGame = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "startGame" }));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Waiting for Players...
      </Typography>
      <Typography variant="h6">
        Player 1: {player1Connected ? "Connected" : "Not Connected"}
      </Typography>
      <Typography variant="h6">
        Player 2: {player2Connected ? "Connected" : "Not Connected"}
      </Typography>
      <Button
        variant="contained"
        onClick={handleStartGame}
        disabled={!player1Connected || !player2Connected} // Enable when both are connected
        sx={{ mt: 2 }}
      >
        Start Game
      </Button>
    </Box>
  );
}
