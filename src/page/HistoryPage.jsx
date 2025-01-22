import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const username = JSON.parse(localStorage.getItem("user"));

        if (!username) {
          console.error("No logged-in user found.");
          return;
        }

        const response = await fetch(
          `${BACKEND_URL}/api/results/history?name=${username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user history.");
        }

        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching user history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, []);

  const totalPages = Math.ceil(history.length / resultsPerPage);
  const paginatedResults = history.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const styleTable = {
    fontFamily: "Comic Neue, cursive",
    fontSize: "1rem",
    color: "white",
  };

  const styleTableHeader = {
    fontFamily: "Comic Neue, cursive",
    fontSize: "1.5rem",
    color: "white",
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "80px" }}>
      <h1 className="header-style wiggle-text">My History</h1>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          borderRadius: "10px",
        }}
      >
        <Table
          sx={{ minWidth: 650 }}
          size="small"
          aria-label="user history table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={styleTableHeader}>Match Id</TableCell>
              <TableCell sx={styleTableHeader} align="right">
                Opponent
              </TableCell>
              <TableCell sx={styleTableHeader} align="right">
                Your Score
              </TableCell>
              <TableCell sx={styleTableHeader} align="right">
                Opponent's Score
              </TableCell>
              <TableCell sx={styleTableHeader} align="right">
                Result
              </TableCell>
              <TableCell sx={styleTableHeader} align="right">
                When
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedResults.map((match) => {
              const storedUser = JSON.parse(localStorage.getItem("user"));
              const isPlayer1 = match.player1.username === storedUser; // Check if the user is player1

              // Dynamically assign opponent based on the logged-in user
              const opponent = isPlayer1
                ? match.player2.username
                : match.player1.username;

              // Dynamically assign scores based on the logged-in user
              const yourScore = isPlayer1
                ? match.player1Score
                : match.player2Score;

              const opponentScore = isPlayer1
                ? match.player2Score
                : match.player1Score;

              return (
                <TableRow key={match._id}>
                  <TableCell sx={styleTable}>{match._id}</TableCell>
                  <TableCell sx={styleTable} align="right">
                    {opponent}
                  </TableCell>
                  <TableCell sx={styleTable} align="right">
                    {yourScore}
                  </TableCell>
                  <TableCell sx={styleTable} align="right">
                    {opponentScore}
                  </TableCell>
                  <TableCell sx={styleTable} align="right">
                    {match.winner === storedUser ? "Win" : "Loss"}
                  </TableCell>
                  <TableCell sx={styleTable} align="right">
                    {new Date(match.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
}
