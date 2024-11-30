import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MultiPlayer() {
  const { gameId } = useParams(); // To identify the game session
  const [playerNumber, setPlayerNumber] = useState(null); // Player 1 or Player 2
  const [word, setWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0); // Player's own score
  const [opponentScore, setOpponentScore] = useState(0); // Opponent's score
  const [ws, setWs] = useState(null); // WebSocket connection

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/random-words");
      const randomWords = await response.json();
      const selectedWord =
        randomWords[Math.floor(Math.random() * randomWords.length)];
      setWord(selectedWord.word);
      setTimeLeft(5); // Set default timer for multiplayer
      setGameOver(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);

    if (event.target.value === word) {
      setScore((prevScore) => {
        const newScore = prevScore + 1;

        // Notify server of score update
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "scoreUpdate",
              playerNumber,
              score: newScore,
            })
          );
        }

        return newScore;
      });

      startNewWord();
    }
  };

  const startNewWord = async () => {
    await fetchData();
    setUserInput("");
    setTimeLeft(5); // Reset timer for new word
    setGameOver(false);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    fetchData();

    // Initialize WebSocket connection
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "playerAssigned") {
        setPlayerNumber(message.playerNumber); // Assign Player 1 or Player 2
        console.log(`Assigned as Player ${message.playerNumber}`);
      }

      if (message.type === "scoreUpdate") {
        console.log("Received score update:", message);
        if (message.playerNumber === playerNumber) {
          // Update the current player's score
          setScore(message.score);
        } else {
          // Update the opponent's score
          setOpponentScore(message.score);
        }
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [gameId, playerNumber]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3>Type the given word within 5 seconds</h3>
      <h1 style={{ fontSize: "4rem" }}>{word}</h1>
      <TextField
        label="Start typing..."
        variant="outlined"
        value={userInput}
        onChange={handleInputChange}
        disabled={gameOver}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2 style={{ margin: "20px 40px" }}>Time left: {timeLeft}</h2>
        <h2 style={{ margin: "20px 40px" }}>Me: {score}</h2>
        <h2 style={{ margin: "20px 40px" }}>Opponent: {opponentScore}</h2>
      </div>
      {gameOver && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>Game Over! Final Score: {score}</h2>
          <button onClick={startNewWord}>Start New Word</button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "40px",
        }}
      >
        <h2>Instructions</h2>
        <h4>Type each word in the given amount of time to score</h4>
      </div>
    </div>
  );
}
