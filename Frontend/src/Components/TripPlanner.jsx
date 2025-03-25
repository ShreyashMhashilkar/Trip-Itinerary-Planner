import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Box,
  Alert,
} from "@mui/material";
import { TripContext } from "../context/TripContext";

function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setItinerary } = useContext(TripContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://trip-itinerary-planner.onrender.com/plan-trip",
        {
          destination,
          selectedDay: Number(duration),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.itinerary) {
        setItinerary(response.data.itinerary);
        localStorage.setItem("itinerary", JSON.stringify(response.data.itinerary));
        navigate("/output");
      } else {
        setError("No itinerary available for the selected destination and duration.");
      }
    } catch (error) {
      console.error("Error fetching itinerary:", error);

      if (error.response) {
        setError(error.response.data.error || "Unable to fetch itinerary. Please try again.");
      } else if (error.request) {
        setError("Network error! Please check your internet connection and try again.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #001f3f, #007bff)",
        p: 2,
      }}
    >
      <Container maxWidth="xs" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, bgcolor: "white", textAlign: "center", width: "100%", maxWidth: "400px" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976D2" }}>
            Trip Planner
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2, color: "gray" }}>
            Plan your trip effortlessly!
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <TextField
              fullWidth
              label="Destination"
              variant="outlined"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Select Duration</InputLabel>
              <Select value={duration} onChange={(e) => setDuration(e.target.value)} required>
                {[...Array(10).keys()].map((day) => (
                  <MenuItem key={day + 1} value={day + 1}>{day + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Select Interests</InputLabel>
              <Select value={interests} onChange={(e) => setInterests(e.target.value)} required>
                {["Food", "Culture", "Adventure", "Nature", "History"].map((interest) => (
                  <MenuItem key={interest} value={interest.toLowerCase()}>{interest}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ bgcolor: "#1976D2", color: "white", py: 1.5, fontSize: "1rem", "&:hover": { bgcolor: "#1565C0" } }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Plan My Trip"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default TripPlanner;
