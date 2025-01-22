import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export default function SinglePlayer() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const difficulty = queryParams.get("difficulty");
  const navigate = useNavigate();

  const [word, setWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/words/random`);
      const randomWords = await response.json();
      const selectedWord =
        randomWords[Math.floor(Math.random() * randomWords.length)];
      setWord(selectedWord.word);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const getTimerDuration = () => {
    return difficulty === "easy" ? 7 : difficulty === "medium" ? 5 : 3;
  };

  const startNewWord = async () => {
    await fetchData();
    setUserInput("");
    setTimeLeft(getTimerDuration());
    setGameOver(false);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setUserInput(inputValue);

    if (inputValue === word) {
      setScore((prevScore) => prevScore + 1);
      startNewWord();
    }
  };

  const handleLeave = () => {
    navigate("/");
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    startNewWord();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>
          Type the given word within
          {difficulty === "easy" ? 7 : difficulty === "medium" ? 5 : "3"}
          seconds
        </h3>
        <h1 style={{ fontSize: "4rem" }}>{word}</h1>{" "}
        <TextField
          label="Start typing..."
          variant="outlined"
          value={userInput}
          onChange={handleInputChange}
          disabled={gameOver}
        />
        <div style={{ display: "flex" }}>
          <h2 id="time" style={{ margin: "20px 40px" }}>
            Time left: {timeLeft}
          </h2>
          <h2 id="score" style={{ margin: "20px 40px" }}>
            Score: {score}
          </h2>
        </div>
        {gameOver && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Game Over! Final Score: {score}</h2>
            <Button variant="contained" color="success" onClick={startNewWord}>
              Start New Word
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleLeave}
              style={{ margin: "10px" }}
            >
              Leave Game
            </Button>
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
    </>
  );
}
