import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DifficultyPage() {
  const [difficulty, setDifficulty] = useState();
  const navigate = useNavigate();

  const buttonStyle = {
    margin: "80px",
    fontSize: "40px",
    fontFamily: "Comic Neue, cursive",
  };

  const handleDifficultySelect = (difficultyLevel) => {
    setDifficulty(difficultyLevel);
    navigate(`/singleplayer?difficulty=${difficultyLevel}`);
  };

  return (
    <>
      <div
        className="wiggle-text"
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: "40px",
          userSelect: "none",
        }}
      >
        <h1>Select a difficulty</h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: " center",
          margin: "80px 0px",
        }}
      >
        <Button
          variant="contained"
          style={{ ...buttonStyle, backgroundColor: "green" }}
          onClick={() => handleDifficultySelect("easy")}
        >
          Easy
        </Button>
        <Button
          variant="contained"
          style={{ ...buttonStyle, backgroundColor: "yellow" }}
          onClick={() => handleDifficultySelect("medium")}
        >
          Medium
        </Button>
        <Button
          variant="contained"
          style={{ ...buttonStyle, backgroundColor: "red" }}
          onClick={() => handleDifficultySelect("hard")}
        >
          Hard
        </Button>
      </div>
    </>
  );
}
