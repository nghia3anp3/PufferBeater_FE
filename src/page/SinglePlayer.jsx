import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Get me from BE
export default function SinglePlayer() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const difficulty = queryParams.get("difficulty");

  const [word, setWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/random-words");
      const randomWords = await response.json();
      const selectedWord =
        randomWords[Math.floor(Math.random() * randomWords.length)];
      setWord(selectedWord.word);
      setTimeLeft(getTimerDuration());
      setGameOver(false);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const getTimerDuration = () => {
    if (difficulty === "easy") return 7;
    if (difficulty === "medium") return 5;
    return 3;
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);

    if (event.target.value === word) {
      setScore(score + 1);
      startNewWord();
    }
  };

  const startNewWord = async () => {
    await fetchData();
    setUserInput("");
    setTimeLeft(getTimerDuration());
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
  }, [difficulty]);

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
          Type the given word within{" "}
          {difficulty === "easy" ? 7 : difficulty === "medium" ? 5 : "3"}{" "}
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
    </>
  );
}
