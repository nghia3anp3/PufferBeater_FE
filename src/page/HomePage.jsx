import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const styleDescription = {
    display: "flex",
    flexDirection: "column",
    margin: "20px 100px",
  };

  const styleButton = {
    margin: "20px 0px",
    color: "black",
    fontSize: "40px",
    fontFamily: "Comic Neue, cursive",
  };

  const handleLoading = () => {
    if (localStorage.getItem("user")) {
      navigate("/loading");
    } else {
      alert("You must login");
      navigate("/login");
    }
  };

  return (
    <>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "80px 0px",
          margin: "0px 50px",
          fontSize: "70px",
          userSelect: "none",
        }}
        className="wiggle-text"
      >
        Select a mode to start
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <div style={styleDescription}>
          <Button
            onClick={() => navigate("/difficulty")}
            style={styleButton}
            className="wiggle-text"
          >
            Single player
          </Button>
          <h2>
            Singleplayer mode lets you test and improve your typing skills at
            your own pace. Race against the clock to type as many words as
            possible and aim for a high score through 3 different difficulties.
            Perfect for practicing speed and accuracy while having fun!
          </h2>
        </div>
        <div style={styleDescription}>
          <Button
            onClick={handleLoading}
            style={styleButton}
            className="wiggle-text"
          >
            Multiplayer
          </Button>

          <h2>
            Multiplayer mode brings the excitement of competition! Each player
            gets 30 seconds to type as many words as possible. The player with
            the highest score at the end wins. Show off your speed and accuracy
            to claim victory!
          </h2>
        </div>
      </div>
    </>
  );
}
