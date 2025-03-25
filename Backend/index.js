const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const xlsx = require("xlsx");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Load Excel file
const filePath = path.join(__dirname, "trip_itinerary_output.xlsx");
let sheetData = [];

try {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  sheetData = sheetName ? xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]) : [];
} catch (error) {
  console.error("Error loading Excel file:", error.message);
}

// Trip Planner Endpoint
app.post("/plan-trip", (req, res) => {
  const { destination, selectedDay } = req.body;

  if (!destination || !selectedDay) {
    return res.status(400).json({ error: "Destination and selected day are required." });
  }

  if (typeof destination !== "string" || typeof selectedDay !== "number" || selectedDay < 1) {
    return res.status(400).json({ error: "Invalid input format. Selected day must be a positive number." });
  }

  const filteredItinerary = sheetData.filter(
    (row) => row.Destination && row.Destination.toLowerCase() === destination.toLowerCase()
  );

  if (!filteredItinerary.length) {
    return res.status(404).json({ error: "No itinerary found for the given destination." });
  }

  const itineraryDays = [];
  for (let i = 1; i <= selectedDay; i++) {
    const dayKey = `Day ${i}`;
    if (filteredItinerary[0][dayKey]) {
      itineraryDays.push({ day: dayKey, activities: filteredItinerary[0][dayKey] });
    }
  }

  if (!itineraryDays.length) {
    return res.status(404).json({ error: "No itinerary available for the selected duration." });
  }

  res.json({ itinerary: itineraryDays });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
