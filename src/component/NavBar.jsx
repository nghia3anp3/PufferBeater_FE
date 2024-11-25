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
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [buttonText, setButtonText] = useState("Log In");
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLoginSubmit = () => {
    setButtonText(username);
    handleClose();
    localStorage.setItem("username", username);
  };

  return (
    <Box sx={navBarStyles}>
      <Typography
        className="hover-cursor"
        onClick={() => navigate("/")}
        sx={{
          flexGrow: 1,
          textAlign: "center",
          fontSize: "2rem",
          fontFamily: "Comic Neue, cursive",
        }}
      >
        Puffer Typer
      </Typography>
      <Typography
        className="hover-cursor"
        sx={{ fontFamily: "Comic Neue, cursive", fontSize: "1.75rem" }}
      >
        <Button
          onClick={handleOpen}
          className="hover-cursor"
          sx={{ fontFamily: "Comic Neue, cursive", fontSize: "1.75rem" }}
          color="black"
        >
          {buttonText} {/* Display current button text */}
        </Button>
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            sx={{ fontFamily: "Comic Neue, cursive" }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Username:
            <input
              type="text"
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username state on input change
            />
          </Typography>
          <Button
            variant="contained"
            onClick={handleLoginSubmit}
            sx={{ marginTop: "16px" }}
            disabled={!username} // Disable if no name is entered
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
