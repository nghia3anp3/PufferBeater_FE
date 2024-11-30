import { Button, Modal, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const navBarStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "40px 30px",
  opacity: 0.6,
  backgroundColor: "grey",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const inputStyle = {
  width: "300px",
  padding: "10px",
  border: "none",
  borderBottom: "2px solid",
  outline: "none",
  fontFamily: "Comic Neue, cursive",
  fontSize: "1rem",
};

export default function NavBar() {
  const [ws, setWs] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "disconnect", username }));
      ws.close(); // Explicitly close the WebSocket connection
    }
    navigate("/");
  };

  return (
    <Box sx={navBarStyles}>
      <Typography
        className="hover-cursor"
        onClick={handleNavigation}
        sx={{
          flexGrow: 1,
          textAlign: "center",
          fontSize: "2rem",
          fontFamily: "Comic Neue, cursive",
        }}
      >
        Puffer Typer
      </Typography>
    </Box>
  );
}
