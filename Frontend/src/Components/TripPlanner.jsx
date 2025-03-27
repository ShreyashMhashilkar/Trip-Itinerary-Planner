import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Box,
  useMediaQuery,
} from "@mui/material";
import { FaPlaneDeparture } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { TripContext } from "../context/TripContext";

function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const { setItinerary } = useContext(TripContext);
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://trip-itinerary-planner.onrender.com/plan-trip",
        { destination, selectedDay: Number(duration) },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.itinerary) {
        setItinerary(response.data.itinerary);
        localStorage.setItem("itinerary", JSON.stringify(response.data.itinerary));
        navigate("/output");
      } else {
        alert("No itinerary available for the selected destination and duration.");
      }
    } catch (error) {
      alert("Error fetching itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #002f6c, #1976d2)",
        padding: isMobile ? "0 20px" : "0",
      }}
    >
      <Box
        maxWidth={400}
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={4}
        borderRadius={3}
        boxShadow="0px 10px 30px rgba(0, 47, 108, 0.2)"
        sx={{
          background: "linear-gradient(to bottom, #ffffff, #f9f9f9)",
          mx: isMobile ? 2 : 0, // Margin for mobile view
          boxShadow: "0px 4px 20px rgba(0, 47, 108, 0.4)", // Gradient shadow effect
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            mb: 1,
          }}
        >
          <FaPlaneDeparture size={30} color="#1976D2" />
          <Typography variant="h4" fontWeight="bold" color="#1976D2">
            Trip Planner
          </Typography>
        </Box>

        <Typography
          variant="subtitle1"
          sx={{ mb: 2, color: "gray", display: "flex", alignItems: "center", gap: 1 }}
        >
          <MdOutlineExplore /> Plan your trip effortlessly!
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            placeholder="Destination *"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Duration</InputLabel>
            <Select value={duration} onChange={(e) => setDuration(e.target.value)} required>
              {[...Array(10).keys()].map((day) => (
                <MenuItem key={day + 1} value={day + 1}>
                  {day + 1} Days
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Interests</InputLabel>
            <Select value={interests} onChange={(e) => setInterests(e.target.value)} required>
              {["Food", "Culture", "Adventure", "Nature", "History"].map((interest) => (
                <MenuItem key={interest} value={interest.toLowerCase()}>
                  {interest}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#1976D2",
              color: "white",
              fontSize: "1rem",
              borderRadius: 2,
              "&:hover": { bgcolor: "#1565C0" },
              py: 1.5,
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "PLAN MY TRIP"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default TripPlanner;
