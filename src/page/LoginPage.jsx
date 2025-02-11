import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export default function LoginPage() {
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();

  const formContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 0px",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    width: "400px",
  };

  const formSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await formSchema.validate(formValues, { abortEarly: false });
      setErrors({});

      const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log("Login successful:", data.message);

        login(data.token, data.username);
        navigate("/");
      } else {
        if (data.error === "Invalid username or password") {
          setErrors({ username: data.error, password: data.error });
        }
      }
    } catch (err) {
      const extractedErrors = {};
      err.inner.forEach((validationError) => {
        extractedErrors[validationError.path] = validationError.message;
      });
      setErrors(extractedErrors);
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
        Login
      </h1>
      <div style={formContainerStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <TextField
            id="username"
            label="Username"
            variant="standard"
            value={formValues.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username || ""}
            fullWidth
          />
          <TextField
            id="password"
            label="Password"
            variant="standard"
            type="password"
            fullWidth
            value={formValues.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password || ""}
          />
          <Button
            variant="contained"
            display="flex"
            color="primary"
            type="submit"
            style={{ marginTop: "20px" }}
          >
            Login
          </Button>
          <h4>
            Don't have an account? <Link to="/register">Create one here</Link>.
          </h4>
        </form>
      </div>
    </>
  );
}
