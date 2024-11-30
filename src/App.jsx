import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import HomePage from "./page/HomePage";
import NavBar from "./component/NavBar";
import DifficultyPage from "./page/DifficultyPage";
import SinglePlayer from "./page/SinglePlayer";
import MultiPlayer from "./page/MultiPlayer";
import LoadingPage from "./page/LoadingPage";

function App() {
  const navigate = useNavigate();

  const handleGameStart = (gameId) => {
    navigate(`/multiplayer/${gameId}`);
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/difficulty" element={<DifficultyPage />} />
        <Route path="/singleplayer" element={<SinglePlayer />} />
        <Route
          path="/loading"
          element={<LoadingPage onGameStart={handleGameStart} />}
        />
        <Route path="/multiplayer/:gameId" element={<MultiPlayer />} />
      </Routes>
    </>
  );
}

export default App;
