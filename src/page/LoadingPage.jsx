import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function LoadingPage() {
  const [player1Connected, setPlayer1Connected] = useState(false);
  const [player2Connected, setPlayer2Connected] = useState(false);
  const [ws, setWs] = useState(null);
  const navigate = useNavigate(); // Initialize navigate for routing

  useEffect(() => {
    // Establish WebSocket connection
    const websocket = new WebSocket("ws://localhost:8080");

    websocket.onopen = () => {
      console.log("Connected to the WebSocket server");
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      if (data.type === "playerStatus") {
        console.log("Updating player statuses:", data.statuses);
        const player1 = data.statuses.find((s) => s.playerNumber === 1);
        const player2 = data.statuses.find((s) => s.playerNumber === 2);

        setPlayer1Connected(player1?.connected || false);
        setPlayer2Connected(player2?.connected || false);
      }

      if (data.type === "playerAssigned") {
        console.log(`Assigned as Player ${data.playerNumber}`);
      }

      if (data.type === "bothConnected") {
        console.log("Both players are connected.");
      }

      if (data.type === "gameStart") {
        console.log("Game is starting...");
        navigate(`/multiplayer/gameId=${data.gameId}`);
      }

      if (data.type === "gameReset") {
        console.log("Game has been reset.");
        setPlayer1Connected(false);
        setPlayer2Connected(false);
      }
    };

    websocket.onclose = () => {
      console.log("Disconnected from the WebSocket server");
    };

    setWs(websocket);

    return () => {
      websocket.close(); // Clean up on unmount
    };
  }, [navigate]); // Add navigate as a dependency

  const handleStartGame = () => {
    console.log("Starting the game...");

    // Notify server that both players are ready to start
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
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Loading...
      </Typography>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h6">
          Player 1: {player1Connected ? "Connected" : "Not Connected"}
        </Typography>
        <Typography variant="h6">
          Player 2: {player2Connected ? "Connected" : "Not Connected"}
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={handleStartGame}
        disabled={!player1Connected || !player2Connected} // Disable button if not both players are connected
      >
        Start Game
      </Button>
    </Box>
  );
}
