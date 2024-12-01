import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const SERVER_URL = "http://localhost:5000";

export default function LoadingPage() {
  const [socket, setSocket] = useState(null);
  const [statusText, setStatusText] = useState({
    player1: "Player 1 not connected",
    player2: "Player 2 not connected",
  });
  const [bothPlayersConnected, setBothPlayersConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    // Listen for player status updates
    newSocket.on("playerStatus", (statuses) => {
      setStatusText({
        player1: statuses.player1
          ? "Player 1 connected"
          : "Player 1 not connected",
        player2: statuses.player2
          ? "Player 2 connected"
          : "Player 2 not connected",
      });

      // Enable "Start" button only if both players are connected
      setBothPlayersConnected(statuses.player1 && statuses.player2);
    });

    // Listen for gameStart event from the server
    newSocket.on("gameStart", (data) => {
      console.log("Game started with ID:", data.gameId);
      navigate(`/multiplayer/${data.gameId}`); // Navigate to multiplayer route with gameId
    });

    // Handle server disconnection
    newSocket.on("disconnect", () => {
      console.log("Disconnected from server.");
      setStatusText({
        player1: "Player 1 not connected",
        player2: "Player 2 not connected",
      });
      setBothPlayersConnected(false); // Disable "Start" button
    });

    // Cleanup listeners and disconnect on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [navigate]);

  const handleStartGame = () => {
    if (socket) {
      console.log("Start Game button clicked.");
      socket.emit("startGame"); // Notify backend to start the game
    }
  };

  const handleDisconnect = () => {
    if (socket) {
      console.log("Disconnect button clicked.");
      socket.disconnect(); // Explicitly disconnect from the server
      setSocket(null);
      setStatusText({
        player1: "Player 1 not connected",
        player2: "Player 2 not connected",
      });
      setBothPlayersConnected(false);
      navigate("/"); // Route back to the home page
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
      }}
    >
      <Typography variant="h4" gutterBottom>
        Waiting for Players...
      </Typography>
      <Typography variant="h6">{statusText.player1}</Typography>
      <Typography variant="h6">{statusText.player2}</Typography>
      <Button
        variant="contained"
        onClick={handleStartGame}
        disabled={!bothPlayersConnected} // Only enable when both players are connected
        sx={{ margin: "10px" }}
      >
        Start
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDisconnect} // Disconnect and route back
        sx={{ margin: "10px" }}
      >
        Disconnect
      </Button>
    </Box>
  );
}
