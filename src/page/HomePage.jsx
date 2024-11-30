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

  return (
    <>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          margin: 0,
          padding: "80px 0px",
          fontSize: "70px",
          userSelect: "none",
        }}
        className="wiggle-text"
      >
        Select a mode to start
      </h1>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div style={styleDescription}>
          <Button
            onClick={() => navigate("/difficulty")}
            style={styleButton}
            className="wiggle-text"
          >
            Single player
          </Button>
          <h2>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit odit
            corrupti, molestias quam reiciendis laborum iusto inventore
            accusantium enim, incidunt magnam odio sunt? Consequuntur, quod.
            Libero et reiciendis iure error.
          </h2>
        </div>
        <div style={styleDescription}>
          <Button
            onClick={() => navigate("/loading")}
            style={styleButton}
            className="wiggle-text"
          >
            Multi player
          </Button>

          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis,
            sunt minus harum tenetur voluptates debitis illo natus,
            necessitatibus exercitationem deleniti ratione. Amet nemo ab
            voluptatum dignissimos ex aspernatur atque odit.
          </h2>
        </div>
      </div>
    </>
  );
}
