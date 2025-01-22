import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { closeWebSocket, getWebSocket } from "../socket";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export default function MultiPlayer() {
  const [playerNumber, setPlayerNumber] = useState(null);
  const [wordList, setWordList] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [userInput, setUserInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [replayCount, setReplayCount] = useState(0);

  const navigate = useNavigate();

  const fetchWord = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/words/random`);
      const data = await response.json();
      if (data && data.length > 0) {
        const words = data.map((item) => item.word);
        setWordList(words);
        setCurrentWord(words[0]);
      }
      setUserInput("");
      setGameOver(false);
    } catch (error) {
      console.error("Error fetching word:", error);
    }
  };

  useEffect(() => {
    const socket = getWebSocket();
    setPlayerNumber(socket.playerNumber);
    console.log(playerNumber);

    fetchWord();
    setGameOver(false);
  }, []);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);

    if (event.target.value === currentWord) {
      setScore((prevScore) => {
        const newScore = prevScore + 1;

        const socket = getWebSocket();
        socket.emit("scoreUpdate", { playerNumber, score: newScore });

        return newScore;
      });

      fetchWord();
    }
  };

  useEffect(() => {
    const socket = getWebSocket();

    socket.on("scoreUpdate", (data) => {
      if (data.playerNumber === playerNumber) {
        setScore(data.score);
      } else {
        setOpponentScore(data.score);
      }
    });

    socket.on("replayStatus", (data) => {
      setReplayCount(data.replayCount);
    });

    socket.on("gameRestart", () => {
      setScore(0);
      setOpponentScore(0);
      setReplayCount(0);
      fetchWord();
    });

    socket.on("playerLeave", () => {
      alert("Your opponent has left the game.");
      closeWebSocket();
      navigate("/");
    });

    socket.on("timeUpdate", ({ remainingTime }) => {
      setTimeLeft(remainingTime);
    });

    socket.on("gameOver", ({ player1Score, player2Score }) => {
      setGameOver(true);
      if (playerNumber === 1) {
        setScore(player1Score);
        setOpponentScore(player2Score);
      } else if (playerNumber === 2) {
        setScore(player2Score);
        setOpponentScore(player1Score);
      }
    });

    // Clean up listeners on unmount
    return () => {
      socket.off("playerAssigned");
      socket.off("scoreUpdate");
      socket.off("replayStatus");
      socket.off("gameRestart");
      socket.off("playerLeave");
      socket.off("timeUpdate");
      socket.off("gameOver");
    };
  }, [playerNumber]);

  const handleLeave = () => {
    const socket = getWebSocket();
    if (socket) {
      socket.emit("playerLeave");
      closeWebSocket();
    }
    navigate("/");
  };

  const handleReplayRequest = () => {
    const socket = getWebSocket();
    if (socket) {
      socket.emit("playerReplay");
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
