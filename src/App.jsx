import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./page/HomePage";
import NavBar from "./component/NavBar";
import DifficultyPage from "./page/DifficultyPage";
import SinglePlayer from "./page/SinglePlayer";
import MultiPlayer from "./page/MultiPlayer";
import LoadingPage from "./page/LoadingPage";
import RegisterPage from "./page/RegisterPage";
import LoginPage from "./page/LoginPage";
import LeaderboardPage from "./page/LeaderboardPage";
import HistoryPage from "./page/HistoryPage";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/difficulty" element={<DifficultyPage />} />
        <Route path="/singleplayer" element={<SinglePlayer />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/multiplayer" element={<MultiPlayer />} />
      </Routes>
    </>
  );
}

export default App;
