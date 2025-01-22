import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export default function LeaderBoardPage() {
  const [results, setResults] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/results/leaderboard`);
        if (!response.ok) {
          throw new Error("Failed to fetch results from the server");
        }
        const data = await response.json();
        setResults(data); // Update the state with results
      } catch (error) {
        console.error("Failed to fetch results:", error);
      }
    };

    fetchResults();
  }, []);

  const sortedResults = [...results].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
    }
  });

  const totalPages = Math.ceil(sortedResults.length / resultsPerPage);
  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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

  return (
    <>
      <div style={{ padding: "80px" }}>
        <h1 className="header-style wiggle-text">Leaderboard</h1>
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
            aria-label="leaderboard table"
          >
            <TableHead>
              <TableRow>
                <TableCell sx={styleTableHeader}>Match Id</TableCell>
                <TableCell sx={styleTableHeader} align="right">
                  Player 1 Score
                </TableCell>
                <TableCell sx={styleTableHeader} align="right">
                  Player 2 Score
                </TableCell>
                <TableCell sx={styleTableHeader} align="right">
                  Winner
                </TableCell>
                <TableCell sx={styleTableHeader} align="right">
                  <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    size="small"
                    displayEmpty
                  >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedResults.map((result) => (
                <TableRow
                  key={result._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={styleTable} component="th" scope="row">
                    {result._id}
                  </TableCell>
                  <TableCell sx={styleTable} align="right">
                    {result.player1Score}
                  </TableCell>
                  <TableCell sx={styleTable} align="right">
                    {result.player2Score}
                  </TableCell>
                  <TableCell sx={styleTable} align="right">
                    {result.winner}
                  </TableCell>
                  <TableCell sx={styleTable} align="right">
                    {new Date(result.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div
        style={{
          display: "flex",
          allignItem: "flex-end",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </>
  );
}
