import { createContext, useState, useEffect } from "react";

export const TripContext = createContext();

export function TripProvider({ children }) {
  const [itinerary, setItinerary] = useState(() => {
    // Load itinerary from localStorage when component mounts
    const savedItinerary = localStorage.getItem("itinerary");
    return savedItinerary ? JSON.parse(savedItinerary) : null;
  });

  useEffect(() => {
    if (itinerary) {
      localStorage.setItem("itinerary", JSON.stringify(itinerary));
    }
  }, [itinerary]);

  return (
    <TripContext.Provider value={{ itinerary, setItinerary }}>
      {children}
    </TripContext.Provider>
  );
}
