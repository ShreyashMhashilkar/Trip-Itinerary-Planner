import { useEffect, useState, useContext } from "react";
import { Container, Typography, Paper, Card, CardContent, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt, FaCalendarDay, FaMountain, FaArrowLeft, FaFileDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { TripContext } from "../context/TripContext";

function Output() {
  const { itinerary } = useContext(TripContext);
  const [tripData, setTripData] = useState(itinerary);

  useEffect(() => {
    setTripData(itinerary);
    document.body.style.backgroundColor = "#ffffff"; // ✅ White background
    document.documentElement.style.backgroundColor = "#ffffff"; // ✅ Apply to full page
  }, [itinerary]);

  const generatePDF = () => {
    if (!tripData || tripData.length === 0) return;
    const pdf = new jsPDF();
    let y = 10;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Your Trip Itinerary", 10, y);
    y += 10;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    tripData.forEach((day) => {
      pdf.setFont("helvetica", "bold");
      pdf.text(`${day.day}`, 10, y);
      y += 8;

      pdf.setFont("helvetica", "normal");
      const textLines = pdf.splitTextToSize(day.activities, 180);
      pdf.text(textLines, 15, y);
      y += textLines.length * 6;
      y += 6;
    });

    pdf.save("Trip_Itinerary.pdf");
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff", // ✅ White background
        padding: "2rem 0",
        margin: "0 auto", // ✅ Centering the container
        fontFamily: '"Poppins", sans-serif', // ✅ Modern font style
        "@media (max-width: 600px)": {
          padding: "1rem",
          margin: "0 10px",
        },
      }}
    >
      <Grid container justifyContent="center">
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#1E3A8A",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaMapMarkedAlt /> Your Trip Itinerary
        </Typography>
      </Grid>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #1E3A8A, #3B82F6)",
              color: "#fff",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaArrowLeft /> Plan Another Trip
          </Button>
        </Link>
        <Button
          variant="contained"
          onClick={generatePDF}
          disabled={!tripData || tripData.length === 0}
          sx={{
            background: "linear-gradient(45deg, #1E3A8A, #3B82F6)",
            color: "#fff",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaFileDownload /> Download PDF
        </Button>
      </div>

      <Grid container justifyContent="center">
        {tripData && tripData.length > 0 ? (
          tripData.map((day, index) => (
            <Card
              key={index}
              elevation={4}
              sx={{
                width: "100%",
                maxWidth: "800px",
                marginBottom: "20px", // ✅ Added margin to prevent cards from touching
                borderRadius: "12px",
                padding: "15px",
                backgroundColor: "#112240",
                color: "#E0F2FE",
                fontFamily: '"Poppins", sans-serif', // ✅ Apply modern font
                lineHeight: "1.6", // ✅ Improve readability
                "@media (max-width: 600px)": {
                  margin: "0 10px 20px", // ✅ Add bottom margin for mobile screens
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#64B6F7",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FaCalendarDay /> {day.day}
                </Typography>
                <Paper
                  sx={{
                    padding: "12px",
                    marginTop: "10px",
                    backgroundColor: "#1E3A8A",
                    color: "#E0F2FE",
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#90CAF9",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaMountain /> Activities
                  </Typography>
                  <ul style={{ paddingLeft: "15px" }}>
                    {day.activities.split("; ").map((activity, j) => (
                      <li key={j} style={{ marginBottom: "5px", color: "#E0F2FE", fontSize: "14px" }}>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </Paper>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6" sx={{ color: "#FF0000", textAlign: "center", marginTop: "2rem" }}>
            No itinerary available for the selected destination.
          </Typography>
        )}
      </Grid>
    </Container>
  );
}

export default Output;
