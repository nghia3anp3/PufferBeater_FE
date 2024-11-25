import React, { useEffect, useState } from "react";
import SinglePlayer from "./SinglePlayer"; // Adjust the import path as necessary
import { Box, Modal, Button, Typography } from "@mui/material";

export default function MultiPlayer() {
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const [gameId, setGameId] = useState(""); // State for Game ID
  const [ws, setWs] = useState(null);

  const [player1Connected, setPlayer1Connected] = useState(false);
  const [player2Connected, setPlayer2Connected] = useState(false);

  useEffect(() => {
    // Establish WebSocket connection
    const websocket = new WebSocket("ws://localhost:8080"); // Adjust if your server is hosted elsewhere

    websocket.onopen = () => {
      console.log("Connected to the WebSocket server");
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Handle player connection messages
      if (data.type === "playerAssigned") {
        if (data.playerNumber === 1) {
          setPlayer1Connected(true);
        } else if (data.playerNumber === 2) {
          setPlayer2Connected(true);
        }
      }

      // Update connection status when a player connects
      if (data.type === "playerConnected") {
        if (data.playerNumber === 1) {
          setPlayer1Connected(true);
        } else if (data.playerNumber === 2) {
          setPlayer2Connected(true);
        }
      }

      // Handle score updates and game results
      if (data.type === "scoreUpdate") {
        setPlayer1Score(data.player1Score);
        setPlayer2Score(data.player2Score);
      } else if (data.type === "gameResult") {
        setWinner(data.winner);
        setGameOver(true);
      }

      // Handle game start message and provide Game ID
      if (data.type === "gameStart") {
        setGameId(data.gameId); // Set Game ID when game starts
        console.log(`Game started with ID: ${data.gameId}`);
      }
    };

    websocket.onclose = () => {
      console.log("Disconnected from the WebSocket server");
    };

    setWs(websocket);

    return () => {
      websocket.close(); // Clean up on unmount
    };
  }, []);

  const handleGameOver = (score1, score2) => {
    setPlayer1Score(score1);
    setPlayer2Score(score2);
    determineWinner(score1, score2);

    // Send game results to other players via WebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
      const resultMessage = JSON.stringify({
        type: "gameResult",
        gameId,
        player1Score: score1,
        player2Score: score2,
        winner:
          score1 > score2 ? "Player 1" : score2 > score1 ? "Player 2" : "Tie",
      });
      ws.send(resultMessage);
    }
  };

  const determineWinner = (score1, score2) => {
    if (score1 > score2) {
      setWinner("Player 1 Wins!");
    } else if (score2 > score1) {
      setWinner("Player 2 Wins!");
    } else {
      setWinner("It's a Tie!");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          flex: 1,
          borderRight: "2px solid #ccc",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Player 1</h2>
        <SinglePlayer
          onGameOver={(score) => handleGameOver(score, player2Score)}
          gameId={gameId}
          disabled={!player1Connected} // Disable until connected
        />
        <Typography variant="subtitle1">
          {player1Connected ? "Connected" : "Waiting for Player 1..."}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Player 2</h2>
        <SinglePlayer
          onGameOver={(score) => handleGameOver(player1Score, score)}
          gameId={gameId}
          disabled={!player2Connected} // Disable until connected
        />
        <Typography variant="subtitle1">
          {player2Connected ? "Connected" : "Waiting for Player 2..."}
        </Typography>
      </Box>

      <Modal open={gameOver} onClose={() => setGameOver(false)}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
          }}
        >
          <h2>{winner}</h2>
          <p>Player 1 Score: {player1Score}</p>
          <p>Player 2 Score: {player2Score}</p>
          <Typography variant="h6">Game ID: {gameId}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Play Again
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
