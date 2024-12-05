import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeWebSocket, closeWebSocket } from "../socket";

export default function MultiPlayer() {
  const [playerNumber, setPlayerNumber] = useState(null);
  const [wordList, setWordList] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(30); // Initialize timeLeft
  const [userInput, setUserInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [replayCount, setReplayCount] = useState(0); // Tracker for rematch requests
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

  const fetchWord = async () => {
    try {
      const response = await fetch("http://localhost:5000/random-words");
      const data = await response.json();
      if (data && data.length > 0) {
        const words = data.map((item) => item.word);
        setWordList(words.word);
        setCurrentWord(words[0]);
      }
      setUserInput("");
      setGameOver(false);
    } catch (error) {
      console.error("Error fetching word:", error);
    }
  };

  useEffect(() => {
    fetchWord();
    setGameOver(false);
  }, []);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);

    if (event.target.value === currentWord) {
      setScore((prevScore) => {
        const newScore = prevScore + 1;

        if (socket) {
          socket.emit("scoreUpdate", { playerNumber, score: newScore });
        }

        return newScore;
      });

      fetchWord();
    }
  };

  useEffect(() => {
    const socketInstance = initializeWebSocket();

    socketInstance.on("playerAssigned", (data) => {
      setPlayerNumber(data.playerNumber);

      if (data.playerNumber && playerNumber) {
        console.log("Emitting startGame event...");
        socketInstance.emit("startGame");
      }
    });

    socketInstance.on("scoreUpdate", (data) => {
      if (data.playerNumber !== playerNumber) {
        setOpponentScore(data.score);
      }
    });

    socketInstance.on("replayStatus", (data) => {
      setReplayCount(data.replayCount); // Update tracker for rematch requests
    });

    socketInstance.on("gameRestart", () => {
      setScore(0);
      setOpponentScore(0);
      setReplayCount(0);
      fetchWord();
    });

    socketInstance.on("playerLeave", () => {
      alert("Your opponent has left the game.");
      closeWebSocket();
      navigate("/"); // Navigate both players to the home page
    });

    // Handle real-time timer updates
    socketInstance.on("timeUpdate", ({ remainingTime }) => {
      console.log(`Time update received: ${remainingTime}`); // Debug log
      setTimeLeft(remainingTime); // Update the time left in real-time
    });

    // Handle game over event
    socketInstance.on("gameOver", ({ player1Score, player2Score }) => {
      console.log("Game over event received:", { player1Score, player2Score });
      setGameOver(true);
      if (playerNumber === 1) {
        setScore(player1Score); // Your score if you're Player 1
        setOpponentScore(player2Score); // Opponent's score if you're Player 1
      } else if (playerNumber === 2) {
        setScore(player2Score); // Your score if you're Player 2
        setOpponentScore(player1Score); // Opponent's score if you're Player 2
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("playerAssigned");
      socketInstance.off("scoreUpdate");
      socketInstance.off("replayStatus");
      socketInstance.off("gameRestart");
      socketInstance.off("playerLeave");
      socketInstance.off("timeUpdate");
      socketInstance.off("gameOver");
      closeWebSocket();
    };
  }, [playerNumber, navigate]);

  const handleLeave = () => {
    if (socket) {
      socket.emit("playerLeave");
      closeWebSocket();
    }
    navigate("/");
  };

  const handleReplayRequest = () => {
    if (socket) {
      socket.emit("playerReplay"); // Notify server of rematch request
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h3>Type the given word within 30 seconds</h3>
      <h1
        style={{ fontSize: "4rem", marginBottom: "20px", userSelect: "none" }}
      >
        {currentWord}
      </h1>
      <TextField
        label="Start typing..."
        variant="outlined"
        value={userInput}
        onChange={handleInputChange}
        disabled={gameOver}
        style={{ marginBottom: "20px", width: "300px" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: "0 40px" }}>Time left: {timeLeft}</h2>
        <h2 style={{ margin: "0 40px" }}>Your Score: {score}</h2>
        <h2 style={{ margin: "0 40px" }}>Opponent Score: {opponentScore}</h2>
      </div>
      {gameOver && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>Game Over! Final Score: {score}</h2>
          <div>
            <Button
              variant="contained"
              color="error"
              onClick={handleLeave}
              style={{ margin: "10px" }}
            >
              Leave Game
            </Button>
            <Button
              variant="contained"
              onClick={handleReplayRequest}
              style={{ margin: "10px" }}
              color="success"
            >
              Request Replay
            </Button>
            <p>{replayCount}/2 players want a rematch</p>
          </div>
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
        <h4>Type each word correctly within the given time to score points!</h4>
      </div>
    </div>
  );
}
