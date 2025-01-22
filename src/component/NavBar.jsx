import { Button, MenuItem, Select, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navBarStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "40px 30px",
  opacity: 0.6,
  backgroundColor: "grey",
};

const buttonStyle = {
  fontFamily: "Comic Neue, cursive",
  fontSize: "1rem",
  color: "white",
  marginRight: "10px",
};

const loginButtonStyle = {
  fontFamily: "Comic Neue, cursive",
  fontSize: "1rem",
  color: "white",
};

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleMatchHistory = () => {
    if (isLoggedIn) {
      navigate("/history");
    } else {
      alert("Must login");
      navigate("/login");
    }
  };

  return (
    <Box sx={navBarStyles}>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
        <Button sx={buttonStyle} onClick={handleHome}>
          Home
        </Button>
        <Button sx={buttonStyle} onClick={handleLeaderboard}>
          Leaderboard
        </Button>
        <Button sx={buttonStyle} onClick={handleMatchHistory}>
          Match History
        </Button>
      </Box>
      <Typography
        sx={{
          userSelect: "none",
          textAlign: "center",
          fontSize: "2rem",
          fontFamily: "Comic Neue, cursive",
        }}
      >
        Puffer Typer
      </Typography>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        {isLoggedIn ? (
          <Select
            displayEmpty
            value=""
            sx={{
              fontFamily: "Comic Neue, cursive",
              fontSize: "1rem",
              color: "white",
              backgroundColor: "transparent",
              border: "1px solid white",
              borderRadius: "4px",
              padding: "0 10px",
            }}
            onChange={(e) => {
              if (e.target.value === "logout") handleLogout();
            }}
          >
            <MenuItem value="" disabled>
              {user || "Username"}
            </MenuItem>
            <MenuItem value="logout">Log Out</MenuItem>
          </Select>
        ) : (
          <Button sx={loginButtonStyle} onClick={handleLogin}>
            Log In
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default NavBar;
