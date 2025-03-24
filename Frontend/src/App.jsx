import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TripProvider } from "./context/TripContext";
import TripPlanner from "./Components/TripPlanner";
import Output from "./Components/Output";

function App() {
  return (
    <TripProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TripPlanner />} />
          <Route path="/output" element={<Output />} />
        </Routes>
      </Router>
    </TripProvider>
  );
}

export default App;